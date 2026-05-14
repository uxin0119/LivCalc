import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS comments (
        type BIGINT NOT NULL,
        object_id BIGINT NOT NULL,
        sub_id BIGINT NOT NULL,
        comment TEXT NOT NULL,
        PRIMARY KEY (type, object_id, sub_id)
      );
      ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
    `;

    await query(sql);

    return NextResponse.json({
      success: true,
      message: 'Comments table has been created successfully!',
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
