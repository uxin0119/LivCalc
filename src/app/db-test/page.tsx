'use client';

import { useState } from 'react';

export default function DBTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupResult, setSetupResult] = useState<any>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/db-test');
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const setupDatabase = async () => {
    setSetupLoading(true);
    setError(null);
    setSetupResult(null);

    try {
      const response = await fetch('/api/setup-db', {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        setSetupResult(data);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup database');
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>CockroachDB 연결 테스트</h1>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={testConnection}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            flex: 1,
          }}
        >
          {loading ? '테스트 중...' : '연결 테스트하기'}
        </button>

        <button
          onClick={setupDatabase}
          disabled={setupLoading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: setupLoading ? '#ccc' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: setupLoading ? 'not-allowed' : 'pointer',
            flex: 1,
          }}
        >
          {setupLoading ? '설정 중...' : '인증 테이블 생성'}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', color: '#c00' }}>오류 발생</h3>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}

      {setupResult && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#efe',
            border: '1px solid #cfc',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ margin: '0 0 8px 0', color: '#060' }}>
            ✓ {setupResult.message}
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            users, accounts, sessions, verification_tokens 테이블이 생성되었습니다.
          </p>
        </div>
      )}

      {result && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#efe',
            border: '1px solid #cfc',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', color: '#060' }}>
            ✓ {result.message}
          </h3>
          <div style={{ marginBottom: '12px' }}>
            <strong>현재 시간:</strong>{' '}
            {result.data?.current_time}
          </div>
          <div>
            <strong>DB 버전:</strong>
            <pre style={{
              margin: '8px 0 0 0',
              whiteSpace: 'pre-wrap',
              fontSize: '12px',
            }}>
              {result.data?.db_version}
            </pre>
          </div>
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>사용 방법</h2>
        <h3>1. 데이터베이스 쿼리 실행</h3>
        <pre style={{
          backgroundColor: '#fff',
          padding: '12px',
          borderRadius: '4px',
          overflow: 'auto',
        }}>{`import { query } from '@/lib/db';

// 데이터 조회
const users = await query('SELECT * FROM users');

// 데이터 삽입
await query(
  'INSERT INTO users (name, email) VALUES ($1, $2)',
  ['John', 'john@example.com']
);`}</pre>

        <h3>2. API 라우트에서 사용</h3>
        <pre style={{
          backgroundColor: '#fff',
          padding: '12px',
          borderRadius: '4px',
          overflow: 'auto',
        }}>{`// src/app/api/users/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await query('SELECT * FROM users');
  return NextResponse.json(users);
}`}</pre>

        <h3>3. 테이블 생성 예제</h3>
        <pre style={{
          backgroundColor: '#fff',
          padding: '12px',
          borderRadius: '4px',
          overflow: 'auto',
        }}>{`await query(\`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
\`);`}</pre>
      </div>
    </div>
  );
}
