import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'settings-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    const statements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await query(statement);
    }

    return NextResponse.json({ message: 'Settings table setup successfully' });
  } catch (error) {
    console.error('Setup Settings Error:', error);
    return NextResponse.json(
      { error: 'Failed to setup settings table' },
      { status: 500 }
    );
  }
}
