CREATE TABLE "quickbooks_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"quickbooks_id" varchar(50) NOT NULL,
	"name" varchar(255),
	"sub_account" boolean,
	"parent_ref_value" varchar(50),
	"fully_qualified_name" varchar(255),
	"active" boolean,
	"classification" varchar(50),
	"account_type" varchar(50),
	"account_sub_type" varchar(100),
	"current_balance" numeric,
	"current_balance_with_sub_accounts" numeric,
	"currency_ref_value" varchar(10),
	"currency_ref_name" varchar(255),
	"domain" varchar(10),
	"sparse" boolean,
	"sync_token" varchar(50),
	"meta_data_create_time" timestamp,
	"meta_data_last_updated_time" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quickbooks_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"quickbooks_id" varchar(50) NOT NULL,
	"name" varchar(255),
	"description" text,
	"active" boolean,
	"fully_qualified_name" varchar(255),
	"taxable" boolean,
	"unit_price" numeric,
	"type" varchar(50),
	"income_account_value" varchar(50),
	"income_account_name" varchar(255),
	"purchase_desc" text,
	"purchase_cost" numeric,
	"expense_account_value" varchar(50),
	"expense_account_name" varchar(255),
	"asset_account_value" varchar(50),
	"asset_account_name" varchar(255),
	"track_qty_on_hand" boolean,
	"qty_on_hand" numeric,
	"inv_start_date" timestamp,
	"domain" varchar(10),
	"sparse" boolean,
	"sync_token" varchar(50),
	"meta_data_create_time" timestamp,
	"meta_data_last_updated_time" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "idx_attachments_is_deleted";--> statement-breakpoint
DROP INDEX "idx_invoices_is_deleted";--> statement-breakpoint
ALTER TABLE "quickbooks_accounts" ADD CONSTRAINT "quickbooks_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quickbooks_products" ADD CONSTRAINT "quickbooks_products_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;