import OpenAI from "openai";
import pLimit from "p-limit";
import logger from "@/helpers/logger";
import {
  QUICKBOOKS_EMBEDDING_DIMENSION,
  QUICKBOOKS_EMBEDDING_MODEL,
} from "@/lib/vector.constants";

const DEFAULT_CONCURRENCY = Number(process.env.OPENAI_EMBEDDING_CONCURRENCY || 2);

class EmbeddingsService {
  private client: OpenAI | null;
  private limiter: <T>(fn: () => Promise<T>) => Promise<T>;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      logger.warn(
        "[EmbeddingsService] OPENAI_API_KEY is not set. Vector enrichment will be skipped.",
      );
      this.client = null;
    } else {
      this.client = new OpenAI({ apiKey });
    }

    const concurrency =
      Number.isFinite(DEFAULT_CONCURRENCY) && DEFAULT_CONCURRENCY > 0
        ? DEFAULT_CONCURRENCY
        : 2;

    const limit = pLimit(concurrency);
    this.limiter = <T>(fn: () => Promise<T>) => limit(fn);
  }

  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.client) {
      return null;
    }

    const trimmed = text.trim();
    if (!trimmed) {
      return null;
    }

    try {
      const response = await this.limiter(() =>
        this.client!.embeddings.create({
          model: QUICKBOOKS_EMBEDDING_MODEL,
          input: trimmed,
          // dimensions: QUICKBOOKS_EMBEDDING_DIMENSION,
        }),
      );

      const embedding = response.data[0]?.embedding;
      if (!embedding || embedding.length === 0) {
        return null;
      }

      if (embedding.length > QUICKBOOKS_EMBEDDING_DIMENSION) {
        return embedding.slice(0, QUICKBOOKS_EMBEDDING_DIMENSION);
      }

      return embedding;
    } catch (error: any) {
      logger.error(
        {
          err: error,
        },
        "[EmbeddingsService] Failed to generate embedding",
      );
      return null;
    }
  }
}

export const embeddingsService = new EmbeddingsService();

