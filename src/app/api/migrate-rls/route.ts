import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    const tables = [
      'users',
      'accounts',
      'sessions',
      'verification_tokens',
      'site_settings',
      'calculator_data',
      'calculator_logs',
      'calendar_memos',
      'comments',
    ];

    const results: string[] = [];

    for (const table of tables) {
      try {
        await query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`);
        results.push(`${table}: RLS enabled`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        if (message.includes('does not exist')) {
          results.push(`${table}: skipped (table not found)`);
        } else {
          results.push(`${table}: error - ${message}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'RLS migration completed',
      results,
    });
  } catch (error) {
    console.error('RLS migration error:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
