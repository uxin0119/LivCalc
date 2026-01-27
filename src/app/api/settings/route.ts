import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * 설정 조회 API
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await query('SELECT key, value FROM site_settings');
    const settingsMap = settings.reduce((acc: any, cur: any) => {
      acc[cur.key] = cur.value;
      return acc;
    }, {});

    // 현재 사용자가 관리자인지 여부 확인
    // 1. 관리자 설정이 아예 없으면 -> 누구나 관리자 가능 (isAdmin = true)
    // 2. 관리자 설정이 있으면 -> 이메일 일치 여부 확인
    const currentAdminEmail = settingsMap.admin_email;
    const isAdmin = !currentAdminEmail || currentAdminEmail === session.user.email;

    if (!isAdmin) {
      // 관리자가 아니면 설정 값을 반환하지 않음 (보안 강화)
      return NextResponse.json({ 
        settings: null, 
        isAdmin: false 
      });
    }

    return NextResponse.json({ 
      settings: settingsMap,
      isAdmin: true 
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * 설정 저장 API
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { settings } = await request.json();
    if (!settings) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // 1. 현재 관리자 이메일 확인
    const adminSetting = await queryOne<any>(
      "SELECT value FROM site_settings WHERE key = 'admin_email'"
    );
    const currentAdminEmail = adminSetting?.value;

    // 2. 권한 체크: 관리자가 이미 설정되어 있다면 해당 사용자만 수정 가능
    if (currentAdminEmail && currentAdminEmail !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    // 3. 설정 업데이트 (Transaction 권장되나 여기서는 개별 처리)
    for (const [key, value] of Object.entries(settings)) {
      await query(
        `INSERT INTO site_settings (key, value, updated_at, updated_by)
         VALUES ($1, $2, NOW(), $3)
         ON CONFLICT (key) DO UPDATE 
         SET value = EXCLUDED.value, updated_at = NOW(), updated_by = EXCLUDED.updated_by`,
        [key, value, session.user.id]
      );
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
