import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS calculator_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id)
      );
      CREATE INDEX IF NOT EXISTS idx_calculator_data_user_id ON calculator_data(user_id);
    `;

    // 문장을 하나씩 실행 (pg 라이브러리는 세미콜론으로 구분된 여러 문장을 한 번에 처리할 때 주의가 필요할 수 있음)
    const statements = sql.split(';').filter(s => s.trim().length > 0);
    for (const stmt of statements) {
      await query(stmt);
    }

    return NextResponse.json({
      success: true,
      message: 'calculator_data table created successfully!',
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
