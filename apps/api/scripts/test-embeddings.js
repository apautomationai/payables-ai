#!/usr/bin/env node

const { Pool } = require('pg');
const OpenAI = require('openai');
require('dotenv').config();

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const EMBEDDING_MODEL = 'text-embedding-ada-002'; // Using ada-002 for compatibility
const EMBEDDING_DIMENSION = 1536;

// Test data - Multiple records for better similarity testing
const TEST_PRODUCTS = [
  {
    userId: 1, // Use a valid user ID from your database
    quickbooksId: 'TEST_EMBEDDING_001',
    name: 'Gaming Laptop Computer',
    description: 'A high-performance gaming laptop with RTX graphics for development and gaming',
    type: 'Service'
  },
  {
    userId: 1,
    quickbooksId: 'TEST_EMBEDDING_002',
    name: 'Software Development Services',
    description: 'Professional software development and programming services for web applications',
    type: 'Service'
  },
  {
    userId: 1,
    quickbooksId: 'TEST_EMBEDDING_003',
    name: 'Office Supplies',
    description: 'General office supplies including paper, pens, and stationery items',
    type: 'Inventory'
  },
  {
    userId: 1,
    quickbooksId: 'TEST_EMBEDDING_004',
    name: 'Consulting Services',
    description: 'Business consulting and advisory services for small businesses',
    type: 'Service'
  },
  {
    userId: 1,
    quickbooksId: 'TEST_EMBEDDING_005',
    name: 'Cloud Hosting Services',
    description: 'Web hosting and cloud infrastructure services for applications',
    type: 'Service'
  }
];


async function createProductEmbedding(client, openai, product) {
  console.log(`\n📦 Processing product: ${product.name}`);

  const embeddingText = `Name: ${product.name}\nDescription: ${product.description}`;
  console.log(`📝 Embedding text: "${embeddingText}"`);

  // Generate embedding
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: embeddingText,
  });

  const embedding = response.data[0]?.embedding;
  if (!embedding) {
    throw new Error(`Failed to generate embedding for product: ${product.name}`);
  }

  console.log(`✅ Generated embedding with ${embedding.length} dimensions`);

  // Convert embedding array to PostgreSQL vector format
  const embeddingString = `[${embedding.join(',')}]`;

  // Check if record exists
  const checkQuery = `
    SELECT id, name, embedding
    FROM quickbooks_products
    WHERE user_id = $1 AND quickbooks_id = $2
  `;

  const existing = await client.query(checkQuery, [product.userId, product.quickbooksId]);

  if (existing.rows.length > 0) {
    console.log('📝 Updating existing product record...');

    // Update existing record
    const updateQuery = `
      UPDATE quickbooks_products
      SET
        name = $3,
        description = $4,
        type = $5,
        embedding = $6::vector,
        updated_at = NOW()
      WHERE user_id = $1 AND quickbooks_id = $2
    `;

    await client.query(updateQuery, [
      product.userId,
      product.quickbooksId,
      product.name,
      product.description,
      product.type,
      embeddingString
    ]);

    console.log('✅ Product record updated successfully');
  } else {
    console.log('➕ Inserting new product record...');

    // Insert new record
    const insertQuery = `
      INSERT INTO quickbooks_products (
        user_id,
        quickbooks_id,
        name,
        description,
        type,
        embedding,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6::vector, NOW(), NOW())
    `;

    await client.query(insertQuery, [
      product.userId,
      product.quickbooksId,
      product.name,
      product.description,
      product.type,
      embeddingString
    ]);

    console.log('✅ Product record inserted successfully');
  }
}


async function verifyEmbeddings(client, userId) {
  console.log('\n🔍 Verifying stored embeddings...');

  // Check products
  const productQuery = `
    SELECT COUNT(*) as product_count,
           COUNT(embedding) as products_with_embeddings,
           AVG(vector_dims(embedding)) as avg_dimensions
    FROM quickbooks_products
    WHERE user_id = $1
  `;

  const productResult = await client.query(productQuery, [userId]);
  const products = productResult.rows[0];

  console.log(`📦 Products: ${products.product_count} total, ${products.products_with_embeddings} with embeddings`);
  console.log(`   Average dimensions: ${products.avg_dimensions || 'N/A'}`);

  const totalRecords = parseInt(products.product_count);
  const totalWithEmbeddings = parseInt(products.products_with_embeddings);

  console.log(`\n📊 Summary: ${totalWithEmbeddings}/${totalRecords} records have embeddings`);

  if (totalWithEmbeddings > 0) {
    console.log('✅ Embeddings appear to be properly stored');
  } else {
    console.log('⚠️  No embeddings found - run the script first');
  }
}

async function main() {
  console.log('🚀 Starting embedding test script...\n');

  // Validate environment
  if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    process.exit(1);
  }

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  // Initialize database connection
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('📡 Connecting to database...');
    const client = await pool.connect();

    // Process all test products
    console.log('\n🛍️  Processing test products...');
    for (const product of TEST_PRODUCTS) {
      await createProductEmbedding(client, openai, product);
    }

    // Verify embeddings
    await verifyEmbeddings(client, TEST_PRODUCTS[0].userId);

    client.release();
    console.log('\n🎉 Test completed successfully!');

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
