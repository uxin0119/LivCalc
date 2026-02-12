import { Pool } from 'pg';

// 로컬 개발 환경에서 self-signed certificate 에러 방지
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

let connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

// 연결 문자열에 sslmode가 포함되어 있으면 pg 라이브러리 설정과 충돌할 수 있으므로 제거하거나 조정
if (connectionString && connectionString.includes('sslmode=require')) {
  // pg 라이브러리 설정을 위해 내부적으로 처리되도록 둡니다.
}

if (connectionString) {
  const host = connectionString.split('@')[1]?.split(':')[0] || 'unknown';
  console.log(`[DB] Attempting to connect to: ${host}`);
}

// 연결 풀을 초기화
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10, // 커넥션 풀 크기 제한 (Supabase 프리티어 최적화)
  idleTimeoutMillis: 30000,
});

// 연결 테스트 함수
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Supabase Postgres connected successfully:', result.rows[0]);
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
    return result.rows as T[];
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
