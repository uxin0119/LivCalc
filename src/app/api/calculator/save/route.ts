import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // ... (existing code omitted for brevity in instruction, but I'll provide full block in replacement)
    // 인증 확인
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { data, categories, settlementDay, summary, clientDate } = await request.json();

    if (!data) {
      return NextResponse.json(
        { error: '저장할 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    // items와 categories를 함께 저장 (Main Data)
    const saveData = {
      items: data,
      categories: categories || [],
      settlementDay: settlementDay || 0
    };

    // 1. 메인 데이터 저장 (Update or Insert)
    const existingData = await query(
      'SELECT id FROM calculator_data WHERE user_id = $1',
      [session.user.id]
    );

    if (existingData.length > 0) {
      // 업데이트
      await query(
        'UPDATE calculator_data SET data = $1, updated_at = NOW() WHERE user_id = $2',
        [JSON.stringify(saveData), session.user.id]
      );
    } else {
      // 새로 삽입
      await query(
        'INSERT INTO calculator_data (user_id, data) VALUES ($1, $2)',
        [session.user.id, JSON.stringify(saveData)]
      );
    }

    // 2. 로그 저장 (History Log - 오늘 날짜 기록 업데이트 또는 생성)
    if (summary) {
      const { dailyAvailable, monthTotal } = summary;

      // 클라이언트에서 보내준 날짜 사용 (시간대 문제 방지), 없으면 서버 날짜 사용
      const logDate = clientDate || new Date().toISOString().split('T')[0];

      await query(
        `INSERT INTO calculator_logs (user_id, log_date, daily_available, total_expense)
         VALUES ($1, $2::date, $3, $4)
         ON CONFLICT (user_id, log_date)
         DO UPDATE SET
            daily_available = EXCLUDED.daily_available,
            total_expense = EXCLUDED.total_expense,
            created_at = NOW()`,
        [session.user.id, logDate, dailyAvailable || 0, monthTotal || 0]
      );

      // 3. 오래된 로그 삭제 (설정된 기간 적용)
      const setting = await queryOne<any>(
        "SELECT value FROM site_settings WHERE key = 'calendar_retention_period'"
      );
      const retentionMonths = parseInt(setting?.value || '2', 10);
      
      await query(
        `DELETE FROM calculator_logs WHERE created_at < NOW() - INTERVAL '${retentionMonths} months'`
      );
    }

    return NextResponse.json({
      success: true,
      message: '데이터가 저장되었습니다.',
    });
  } catch (error) {
    console.error('Save calculator data error:', error);
    return NextResponse.json(
      {
        error: '데이터 저장 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}