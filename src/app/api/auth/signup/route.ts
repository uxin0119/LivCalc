import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 입력 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingUser = await queryOne(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 해시화
    const hashedPassword = await hash(password, 12);

    // 사용자 생성
    const newUser = await queryOne<any>(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name || null, email, hashedPassword]
    );

    return NextResponse.json({
      success: true,
      user: newUser,
      message: '회원가입이 완료되었습니다!'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      {
        error: '회원가입 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
