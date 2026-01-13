# 운영 배포 가이드

## 환경 변수 설정

운영 환경에서 다음 환경 변수들을 설정해야 합니다.

### Vercel 배포 시

1. Vercel 대시보드에서 프로젝트 선택
2. Settings → Environment Variables 이동
3. 다음 환경 변수 추가:

```
DATABASE_URL=postgresql://learner:...@orb-firefly-20334.j77.aws-ap-southeast-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full

NEXTAUTH_URL=https://your-domain.vercel.app
AUTH_SECRET=your-production-secret-key-change-this
NEXTAUTH_SECRET=your-production-secret-key-change-this

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**중요:**
- `AUTH_SECRET`은 **필수** 환경 변수입니다 (NextAuth v5)
- `NEXTAUTH_SECRET`은 하위 호환성을 위해 포함됨
- 운영 환경용으로 새로 생성해야 합니다
- `NEXTAUTH_URL`은 실제 배포 도메인으로 변경해야 합니다

⚠️ **AUTH_SECRET이 없으면:**
- 앱이 임시 secret을 자동 생성하지만 **보안에 취약**합니다
- 서버 재시작 시마다 모든 세션이 무효화됩니다
- **반드시 설정하세요!**

### AUTH_SECRET 생성 방법

터미널에서 다음 명령어 실행:

```bash
openssl rand -base64 32
```

생성된 값을 `NEXTAUTH_SECRET`에 설정하세요.

## Google OAuth 리디렉트 URI 설정

Google Cloud Console에서:

1. API 및 서비스 → 사용자 인증 정보
2. OAuth 2.0 클라이언트 ID 선택
3. 승인된 리디렉션 URI에 추가:
   - `https://your-domain.vercel.app/api/auth/callback/google`

## 데이터베이스 설정 확인

### CockroachDB 연결 제한

- 무료 티어: 최대 연결 수 제한 있음
- 현재 설정: 최대 20개 연결 (서버리스 환경 최적화)
- 필요시 `src/lib/db.ts`에서 `max` 값 조정

### SSL 설정

CockroachDB Serverless는 SSL 연결이 필수입니다. 현재 설정:
```typescript
ssl: {
  rejectUnauthorized: false
}
```

## 배포 전 체크리스트

- [ ] `DATABASE_URL` 환경 변수 설정 확인
- [ ] `AUTH_SECRET` 생성 및 설정 확인 (**필수!**)
- [ ] `NEXTAUTH_SECRET` 설정 확인 (하위 호환성)
- [ ] `NEXTAUTH_URL` 운영 도메인으로 설정
- [ ] Google OAuth 사용 시: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` 설정
- [ ] Google OAuth 리디렉션 URI가 운영 도메인으로 설정되었는지 확인
- [ ] 데이터베이스 테이블이 생성되었는지 확인 (POST /api/setup-db, POST /api/calculator/setup)
- [ ] 로컬에서 빌드가 성공하는지 확인 (`npm run build`)

## 데이터베이스 테이블 초기 설정

배포 후 처음 한 번만 실행:

1. 인증 테이블 생성:
   ```
   POST https://your-domain.vercel.app/api/auth/setup
   ```

2. 계산기 테이블 생성:
   ```
   POST https://your-domain.vercel.app/api/calculator/setup
   ```

또는 CockroachDB Console에서 직접 SQL 실행:
- `src/lib/db-schema.sql`
- `src/lib/calculator-schema.sql`

## 문제 해결

### DB 연결 오류

1. Vercel 로그 확인: `vercel logs`
2. DATABASE_URL이 올바르게 설정되었는지 확인
3. CockroachDB 클러스터가 활성 상태인지 확인

### 인증 오류

**"MissingSecret" 에러:**
- `AUTH_SECRET` 환경 변수가 설정되지 않았습니다
- Vercel/배포 플랫폼의 Environment Variables에서 `AUTH_SECRET` 추가
- 값: `openssl rand -base64 32` 명령으로 생성한 문자열

**로그인 실패:**
1. `AUTH_SECRET`이 설정되어 있는지 확인
2. `NEXTAUTH_URL`이 배포 도메인과 일치하는지 확인
3. Google OAuth 리디렉션 URI가 올바른지 확인
4. 브라우저 쿠키가 차단되지 않았는지 확인
5. 데이터베이스 users 테이블이 생성되었는지 확인

**세션이 계속 끊김:**
- `AUTH_SECRET`이 서버 재시작마다 변경되고 있을 수 있습니다
- 배포 환경에 `AUTH_SECRET` 환경 변수를 영구적으로 설정하세요

### 서버리스 함수 타임아웃

- Vercel 무료 티어: 10초 제한
- DB 쿼리가 느린 경우 인덱스 추가 고려
- 연결 풀 설정 최적화 필요 시 `src/lib/db.ts` 수정
