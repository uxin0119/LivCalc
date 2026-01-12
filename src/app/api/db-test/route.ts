import { NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';

export async function GET() {
  try {
    // 연결 테스트
    const isConnected = await testConnection();

    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // 현재 시간 조회
    const result = await query('SELECT NOW() as current_time, version() as db_version');

    return NextResponse.json({
      success: true,
      message: 'CockroachDB connected successfully!',
      data: result[0],
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Database query failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
