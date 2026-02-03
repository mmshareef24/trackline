
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false } // Required for Supabase/Neon usually
});

async function runMigration() {
  const client = await pool.connect();
  try {
    const migrationPath = path.resolve(__dirname, '../supabase/migrations/20260203000007_dynamic_roles.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Running migration:', migrationPath);
    await client.query(sql);
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
