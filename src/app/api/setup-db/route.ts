import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // SQL 파일 읽기
    const sqlPath = path.join(process.cwd(), 'src', 'lib', 'db-schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // SQL 실행
    await query(sqlContent);

    return NextResponse.json({
      success: true,
      message: '데이터베이스 테이블이 성공적으로 생성되었습니다!',
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      {
        error: 'Database setup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
