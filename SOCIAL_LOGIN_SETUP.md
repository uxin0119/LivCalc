# 소셜 로그인 설정 가이드 (Google)

## 1. Google OAuth 설정

### 1.1 Google Cloud Console에서 프로젝트 생성
1. https://console.cloud.google.com 접속
2. 프로젝트 선택 → "새 프로젝트" 클릭
3. 프로젝트 이름 입력 후 "만들기"

### 1.2 OAuth 2.0 클라이언트 ID 생성
1. 왼쪽 메뉴 → "API 및 서비스" → "사용자 인증 정보"
2. "사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"
3. 애플리케이션 유형: "웹 애플리케이션" 선택
4. 이름: 원하는 이름 입력

5. **승인된 자바스크립트 원본** 추가:
   - http://localhost:3000
   - (배포 시) https://yourdomain.com

6. **승인된 리디렉션 URI** 추가:
   - http://localhost:3000/api/auth/callback/google
   - (배포 시) https://yourdomain.com/api/auth/callback/google

7. "만들기" 클릭

### 1.3 환경변수 설정
생성된 클라이언트 ID와 클라이언트 보안 비밀을 `.env.local` 파일에 추가:

```env
GOOGLE_CLIENT_ID="your-actual-google-client-id"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret"
```

---

## 2. NEXTAUTH_SECRET 생성

보안을 위해 랜덤한 비밀 키를 생성해야 합니다:

```bash
# 터미널에서 실행
openssl rand -base64 32
```

생성된 값을 `.env.local`에 추가:

```env
NEXTAUTH_SECRET="생성된-랜덤-문자열"
```

---

## 3. 배포 시 추가 설정

### 3.1 환경변수 업데이트
Vercel 등에 배포할 때는 `.env.local`의 NEXTAUTH_URL을 실제 도메인으로 변경:

```env
NEXTAUTH_URL="https://yourdomain.com"
```

### 3.2 Google OAuth 리디렉션 URI 추가
Google Cloud Console에서 프로덕션 URL 추가:
- https://yourdomain.com/api/auth/callback/google

---

## 4. 테스트

1. 개발 서버 재시작:
   ```bash
   npm run dev
   ```

2. http://localhost:3000/auth/signin 접속

3. "Google로 계속하기" 버튼 클릭하여 테스트

---

## 문제 해결

### "redirect_uri_mismatch" 오류
- Google 콘솔에서 리디렉션 URI가 정확히 설정되었는지 확인
- http vs https 확인
- 포트 번호 확인 (개발: 3000, 배포: 없음)

### 로그인 후 세션이 유지되지 않음
- NEXTAUTH_SECRET이 설정되었는지 확인
- 브라우저 쿠키가 활성화되어 있는지 확인

### 환경변수가 적용되지 않음
- `.env.local` 파일 수정 후 개발 서버 재시작 필요

---

## 비용

Google OAuth는 **완전 무료**입니다!
- 일일 10,000 요청 (기본 무료 할당량)
- 개인 프로젝트나 중소 규모 서비스에 충분
- 추가 비용 없음
