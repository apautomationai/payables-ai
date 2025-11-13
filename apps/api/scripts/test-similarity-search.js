#!/usr/bin/env node

const { Pool } = require('pg');
const OpenAI = require('openai');
require('dotenv').config();

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const EMBEDDING_MODEL = 'text-embedding-ada-002';
const SIMILARITY_THRESHOLD = 0.5; // Minimum similarity score (0-1)
const MAX_RESULTS = 5;

// Initialize clients
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

const pool = new Pool({
    connectionString: DATABASE_URL,
});

async function generateEmbedding(value) {
    const input = value.replaceAll('\n', ' ').trim();

    if (!input) {
        throw new Error('Empty input for embedding generation');
    }

    const { data } = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input,
    });

    return data[0].embedding;
}

async function findSimilarProducts(searchText, userId, threshold = SIMILARITY_THRESHOLD, limit = MAX_RESULTS) {
    console.log(`🔍 Searching for products similar to: "${searchText}"`);

    // Generate embedding for search query
    const searchEmbedding = await generateEmbedding(searchText);
    console.log(`✅ Generated search embedding with ${searchEmbedding.length} dimensions`);

    const client = await pool.connect();

    try {
        // Use raw SQL with pgvector cosine distance operator
        // similarity = 1 - cosine_distance (higher values = more similar)
        const embeddingString = `[${searchEmbedding.join(',')}]`;
        const query = `
      SELECT
        id,
        name,
        description,
        type,
        1 - (embedding <=> '${embeddingString}'::vector) as similarity
      FROM quickbooks_products
      WHERE user_id = $1
        AND embedding IS NOT NULL
        AND (1 - (embedding <=> '${embeddingString}'::vector)) > $2
      ORDER BY similarity DESC
      LIMIT $3
    `;

        const result = await client.query(query, [userId, threshold, limit]);
        return result.rows;
    } finally {
        client.release();
    }
}


async function main() {
    console.log('🚀 Starting similarity search test script...\n');

    // Validate environment
    if (!OPENAI_API_KEY) {
        console.error('❌ OPENAI_API_KEY not found in environment variables');
        process.exit(1);
    }

    if (!DATABASE_URL) {
        console.error('❌ DATABASE_URL not found in environment variables');
        process.exit(1);
    }

    const userId = 1; // Use a valid user ID from your database

    try {
        console.log('📡 Connecting to database...');

        // Test data for similarity search - matches our test product embeddings
        // const testQueries = [
        //   {
        //     text: "high-performance computer for gaming and coding",
        //     type: "products"
        //   },
        //   {
        //     text: "professional programming services",
        //     type: "products"
        //   },
        //   {
        //     text: "office stationery and supplies",
        //     type: "products"
        //   },
        //   {
        //     text: "business advisory services",
        //     type: "products"
        //   },
        //   {
        //     text: "web hosting and cloud services",
        //     type: "products"
        //   }
        // ];

        // for (const query of testQueries) {
        //   console.log(`\n${'='.repeat(60)}`);
        //   console.log(`🔍 Testing similarity search for: "${query.text}"`);
        //   console.log(`${'='.repeat(60)}\n`);

        //   try {
        //     const results = await findSimilarProducts(query.text, userId);
        //     console.log(`📦 Found ${results.length} similar products:\n`);

        //     if (results.length === 0) {
        //       console.log('   No similar products found. Try running test-embeddings.js first to populate data.');
        //     } else {
        //       results.forEach((product, index) => {
        //         console.log(`${index + 1}. ${product.name || 'Unnamed Product'}`);
        //         console.log(`   Type: ${product.type || 'N/A'}`);
        //         console.log(`   Similarity: ${(product.similarity * 100).toFixed(1)}%`);
        //         if (product.description) {
        //           console.log(`   Description: ${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}`);
        //         }
        //         console.log('');
        //       });
        //     }
        //   } catch (error) {
        //     console.error(`❌ Error searching for products:`, error.message);
        //   }
        // }

        const results = await findSimilarProducts("I want something to write some latter for my office on a paper", userId);
        results.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name || 'Unnamed Product'}`);
            console.log(`   Type: ${product.type || 'N/A'}`);
            console.log(`   Similarity: ${(product.similarity * 100).toFixed(1)}%`);
            if (product.description) {
                console.log(`   Description: ${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}`);
            }
            console.log('');
        });

        console.log('\n🎉 Similarity search test completed successfully!');

    } catch (error) {
        console.error('❌ Error during test:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}
