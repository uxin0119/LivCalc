import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 인증 확인
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 데이터 조회
    const result = await queryOne<any>(
      'SELECT data, updated_at FROM calculator_data WHERE user_id = $1',
      [session.user.id]
    );

    if (!result) {
      return NextResponse.json({
        success: true,
        data: null,
        categories: [],
        message: '저장된 데이터가 없습니다.',
      });
    }

    // 데이터 형식 체크 (하위 호환성)
    let items, categories;
    if (Array.isArray(result.data)) {
      // 구 형식: 배열만 있는 경우
      items = result.data;
      categories = [];
    } else if (result.data && typeof result.data === 'object') {
      // 신 형식: { items, categories } 객체
      items = result.data.items || [];
      categories = result.data.categories || [];
    } else {
      items = [];
      categories = [];
    }

    return NextResponse.json({
      success: true,
      data: items,
      categories: categories,
      updatedAt: result.updated_at,
    });
  } catch (error) {
    console.error('Load calculator data error:', error);
    return NextResponse.json(
      {
        error: '데이터 불러오기 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
