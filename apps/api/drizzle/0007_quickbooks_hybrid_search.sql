-- Enable pgvector extension for semantic search support
create extension if not exists vector with schema extensions;

-- Constants
do $$
begin
  if not exists (
    select 1
    from pg_attribute
    where attrelid = 'public.quickbooks_products'::regclass
      and attname = 'embedding'
  ) then
    alter table public.quickbooks_products
      add column embedding extensions.vector(1536);
  end if;

  if not exists (
    select 1
    from pg_attribute
    where attrelid = 'public.quickbooks_products'::regclass
      and attname = 'search_fts'
  ) then
    alter table public.quickbooks_products
      add column search_fts tsvector generated always as (
        setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(fully_qualified_name, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(income_account_name, '')), 'D')
      ) stored;
  end if;

  if not exists (
    select 1
    from pg_attribute
    where attrelid = 'public.quickbooks_accounts'::regclass
      and attname = 'embedding'
  ) then
    alter table public.quickbooks_accounts
      add column embedding extensions.vector(1536);
  end if;

  if not exists (
    select 1
    from pg_attribute
    where attrelid = 'public.quickbooks_accounts'::regclass
      and attname = 'search_fts'
  ) then
    alter table public.quickbooks_accounts
      add column search_fts tsvector generated always as (
        setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(fully_qualified_name, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(classification, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(account_type, '')), 'D') ||
        setweight(to_tsvector('english', coalesce(account_sub_type, '')), 'D')
      ) stored;
  end if;
end
$$;

-- FTS and vector indexes
create index if not exists quickbooks_products_search_fts_idx
  on public.quickbooks_products using gin (search_fts);

drop index if exists quickbooks_products_embedding_idx;
create index quickbooks_products_embedding_idx
  on public.quickbooks_products
  using hnsw (embedding extensions.vector_cosine_ops);

create index if not exists quickbooks_accounts_search_fts_idx
  on public.quickbooks_accounts using gin (search_fts);

drop index if exists quickbooks_accounts_embedding_idx;
create index quickbooks_accounts_embedding_idx
  on public.quickbooks_accounts
  using hnsw (embedding extensions.vector_cosine_ops);

-- Hybrid search function for QuickBooks products
create or replace function public.hybrid_search_quickbooks_products(
  p_user_id integer,
  query_text text,
  query_embedding extensions.vector(1536),
  match_count integer,
  full_text_weight double precision default 1,
  semantic_weight double precision default 1,
  rrf_k double precision default 60
)
returns setof public.quickbooks_products
language sql
stable
as $$
with normalized as (
  select
    nullif(trim(query_text), '') as text_query,
    query_embedding as embedding_query,
    least(coalesce(match_count, 20), 50) as matches
),
full_text as (
  select
    qp.id,
    row_number() over (
      order by ts_rank_cd(qp.search_fts, websearch_to_tsquery('english', normalized.text_query)) desc
    ) as rank_ix
  from public.quickbooks_products qp
  join normalized on normalized.text_query is not null
  where qp.user_id = p_user_id
    and qp.search_fts @@ websearch_to_tsquery('english', normalized.text_query)
  order by rank_ix
  limit (normalized.matches * 2)
),
semantic as (
  select
    qp.id,
    row_number() over (
      order by qp.embedding <=> normalized.embedding_query
    ) as rank_ix
  from public.quickbooks_products qp
  join normalized on normalized.embedding_query is not null
  where qp.user_id = p_user_id
    and qp.embedding is not null
  order by rank_ix
  limit (normalized.matches * 2)
)
select qp.*
from normalized
cross join lateral (
  select
    qp.*,
    coalesce(1.0 / (rrf_k + ft.rank_ix), 0.0) * full_text_weight
    + coalesce(1.0 / (rrf_k + se.rank_ix), 0.0) * semantic_weight as rrf_score
  from public.quickbooks_products qp
  left join full_text ft on ft.id = qp.id
  left join semantic se on se.id = qp.id
  where qp.user_id = p_user_id
    and (ft.id is not null or se.id is not null)
  order by rrf_score desc, qp.id
  limit normalized.matches
) as ranked
order by ranked.rrf_score desc, ranked.id;
$$;

-- Hybrid search function for QuickBooks accounts
create or replace function public.hybrid_search_quickbooks_accounts(
  p_user_id integer,
  query_text text,
  query_embedding extensions.vector(1536),
  match_count integer,
  full_text_weight double precision default 1,
  semantic_weight double precision default 1,
  rrf_k double precision default 60
)
returns setof public.quickbooks_accounts
language sql
stable
as $$
with normalized as (
  select
    nullif(trim(query_text), '') as text_query,
    query_embedding as embedding_query,
    least(coalesce(match_count, 20), 50) as matches
),
full_text as (
  select
    qa.id,
    row_number() over (
      order by ts_rank_cd(qa.search_fts, websearch_to_tsquery('english', normalized.text_query)) desc
    ) as rank_ix
  from public.quickbooks_accounts qa
  join normalized on normalized.text_query is not null
  where qa.user_id = p_user_id
    and qa.search_fts @@ websearch_to_tsquery('english', normalized.text_query)
  order by rank_ix
  limit (normalized.matches * 2)
),
semantic as (
  select
    qa.id,
    row_number() over (
      order by qa.embedding <=> normalized.embedding_query
    ) as rank_ix
  from public.quickbooks_accounts qa
  join normalized on normalized.embedding_query is not null
  where qa.user_id = p_user_id
    and qa.embedding is not null
  order by rank_ix
  limit (normalized.matches * 2)
)
select qa.*
from normalized
cross join lateral (
  select
    qa.*,
    coalesce(1.0 / (rrf_k + ft.rank_ix), 0.0) * full_text_weight
    + coalesce(1.0 / (rrf_k + se.rank_ix), 0.0) * semantic_weight as rrf_score
  from public.quickbooks_accounts qa
  left join full_text ft on ft.id = qa.id
  left join semantic se on se.id = qa.id
  where qa.user_id = p_user_id
    and (ft.id is not null or se.id is not null)
  order by rrf_score desc, qa.id
  limit normalized.matches
) as ranked
order by ranked.rrf_score desc, ranked.id;
$$;

