import { Pool } from 'pg';

// 환경 변수 확인
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// CockroachDB 연결 풀 생성 (서버리스 환경 최적화)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // CockroachDB Serverless의 경우 필요
  },
  max: 20, // 최대 연결 수 (서버리스 환경에서 제한)
  idleTimeoutMillis: 30000, // 30초 후 유휴 연결 해제
  connectionTimeoutMillis: 10000, // 10초 연결 타임아웃
});

// 연결 테스트 함수
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// 쿼리 실행 함수
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// 단일 행 조회 함수
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows.length > 0 ? rows[0] : null;
}

export default pool;
