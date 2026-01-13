import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { data, categories } = await request.json();

    if (!data) {
      return NextResponse.json(
        { error: '저장할 데이터가 없습니다.' },
        { status: 400 }
      );
    }

    // items와 categories를 함께 저장
    const saveData = {
      items: data,
      categories: categories || []
    };

    // 기존 데이터 확인
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
