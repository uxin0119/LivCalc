import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS calculator_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        log_date DATE NOT NULL DEFAULT CURRENT_DATE,
        daily_available BIGINT NOT NULL,
        total_expense BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, log_date)
      );
      CREATE INDEX IF NOT EXISTS idx_calculator_logs_user_date ON calculator_logs(user_id, log_date);
      CREATE INDEX IF NOT EXISTS idx_calculator_logs_created_at ON calculator_logs(created_at);
    `;

    const statements = sql.split(';').filter(s => s.trim().length > 0);
    for (const stmt of statements) {
      await query(stmt);
    }

    return NextResponse.json({
      success: true,
      message: 'calculator_logs table created successfully!',
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
