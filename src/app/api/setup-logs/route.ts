import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const schemaPath = path.join(process.cwd(), 'src/lib/log-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // 세미콜론으로 분리하여 실행 (간단한 파싱)
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await query(statement);
    }

    return NextResponse.json({ message: 'Logs table setup completed' });
  } catch (error) {
    console.error('Logs table setup failed:', error);
    return NextResponse.json(
      { error: 'Failed to setup logs table' },
      { status: 500 }
    );
  }
}
