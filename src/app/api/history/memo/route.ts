import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (!year || !month) {
        return NextResponse.json({ error: 'Year and month are required' }, { status: 400 });
    }

    // 해당 월의 메모 조회
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-31`; // 간단히 31일로 처리 (DB가 알아서 처리하거나 날짜함수 사용)
    
    // Postgres Date compare
    const memos = await query(
      `SELECT to_char(memo_date, 'YYYY-MM-DD') as date, content
       FROM calendar_memos
       WHERE user_id = $1 
         AND memo_date >= $2::DATE 
         AND memo_date <= $3::DATE`,
      [session.user.id, startDate, endDate]
    );

    return NextResponse.json({ memos });
  } catch (error) {
    console.error('Fetch memos error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date, content } = await request.json();

    if (!date) {
        return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    if (!content || content.trim() === '') {
        // 내용이 비어있으면 삭제 처리
        await query(
            'DELETE FROM calendar_memos WHERE user_id = $1 AND memo_date = $2::DATE',
            [session.user.id, date]
        );
        return NextResponse.json({ message: 'Memo deleted' });
    }

    // Upsert
    await query(
      `INSERT INTO calendar_memos (user_id, memo_date, content)
       VALUES ($1, $2::DATE, $3)
       ON CONFLICT (user_id, memo_date)
       DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`,
      [session.user.id, date, content]
    );

    // 2개월 지난 메모 자동 삭제
    await query(
        "DELETE FROM calendar_memos WHERE memo_date < CURRENT_DATE - INTERVAL '2 months'"
    );

    return NextResponse.json({ message: 'Memo saved' });
  } catch (error) {
    console.error('Save memo error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
