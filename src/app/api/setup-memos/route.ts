import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'memo-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // 세미콜론으로 분리하여 실행 (간단한 파싱)
    const statements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await query(statement);
    }

    return NextResponse.json({ message: 'Memos table setup successfully' });
  } catch (error) {
    console.error('Setup Memos Error:', error);
    return NextResponse.json(
      { error: 'Failed to setup memos table' },
      { status: 500 }
    );
  }
}
