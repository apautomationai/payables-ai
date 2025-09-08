import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from './config';

const pool = new Pool({
  connectionString: config.database.url,
});
const db = drizzle({ client: pool });

export default db;
