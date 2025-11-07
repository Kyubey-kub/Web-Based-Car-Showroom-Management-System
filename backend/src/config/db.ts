// src/config/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// โหลด .env จาก root ของโปรเจกต์
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is missing!');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// แสดงข้อมูลการเชื่อมต่อโดยไม่ parse URL
console.log('PostgreSQL (Neon) Configuration:', {
  host: DATABASE_URL.includes('@') ? DATABASE_URL.split('@')[1].split('/')[0] : 'unknown',
  database: DATABASE_URL.includes('/') ? DATABASE_URL.split('/').pop()?.split('?')[0] : 'unknown',
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
    }
  }
};

testConnection();

export type QueryResult<T = any> = { rows: T[]; rowCount: number };
export default pool;