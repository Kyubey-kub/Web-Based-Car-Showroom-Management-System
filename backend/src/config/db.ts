// src/config/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// โหลด .env จาก root ของโปรเจกต์
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing!');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

console.log('PostgreSQL (Neon) Configuration:', {
  host: new URL(process.env.DATABASE_URL).hostname,
  database: new URL(process.env.DATABASE_URL).pathname.slice(1),
});

const testConnection = async (retry = 0, max = 5) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    console.log('เชื่อมต่อ Neon (PostgreSQL) สำเร็จ');
    client.release();
  } catch (err: any) {
    console.error('Neon connection error:', err.message);
    if (retry < max) {
      console.log(`Reconnecting... (${retry + 1}/${max})`);
      setTimeout(() => testConnection(retry + 1, max), 5000);
    } else {
      console.error('Max reconnect attempts reached');
      process.exit(1);
    }
  }
};

testConnection();

export type QueryResult<T = any> = { rows: T[]; rowCount: number };
export default pool;