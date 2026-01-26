import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 최근 2달치 데이터 조회
    // 날짜별로 가장 마지막 로그(최신 상태)만 가져오기 위해 DISTINCT ON 사용 또는 Group By
    // Postgres의 DISTINCT ON (log_date) ORDER BY log_date, created_at DESC 가 가장 깔끔함.
    
    const logs = await query(
      `SELECT DISTINCT ON (log_date)
          id,
          to_char(log_date, 'YYYY-MM-DD') as date,
          daily_available,
          total_expense,
          created_at
       FROM calculator_logs
       WHERE user_id = $1
       ORDER BY log_date DESC, created_at DESC`,
      [session.user.id]
    );

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Fetch history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
