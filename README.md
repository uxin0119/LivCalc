# LivCalc 💰

> 월간 수입·지출을 관리하고 정산일까지의 **일일 가용 금액을 자동 계산**해주는 개인 재무 관리 웹 애플리케이션

🔗 **Live Demo** → [liv-calc.vercel.app](https://liv-calc.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

---

## ✨ 주요 기능

- **생활비 계산기** — 월 수입·지출을 입력하면 정산일 기준 남은 일수로 일일 가용 금액을 자동 산출
- **자산 기록 달력** — 일별 수입·지출을 달력 뷰로 시각화하여 소비 패턴 파악
- **디자인 토큰 시스템** — 색상·타이포그래피·간격을 토큰으로 관리하는 자체 디자인 시스템 (`/design-tokens` 페이지에서 실시간 프리뷰)
- **사용자 인증** — NextAuth 5 기반 이메일 로그인 및 소셜 로그인 연동
- **영구 저장** — PostgreSQL로 사용자별 가계부 데이터 보관

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack) · React 19
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 (CSS-first config)
- **State**: Zustand 5
- **Data Viz**: Recharts · React Three Fiber (3D 요소)
- **UX**: @dnd-kit (드래그 앤 드롭)

### Backend
- **API**: Next.js Route Handlers + Server Actions
- **Auth**: NextAuth 5 (credentials + OAuth)
- **Database**: PostgreSQL via `@vercel/postgres`
- **Security**: bcryptjs (비밀번호 해싱), crypto-js (민감 데이터 암호화)

### Quality & DX
- **Testing**: Vitest 4 (browser mode) · Playwright (E2E) · `@vitest/coverage-v8`
- **Component Dev**: Storybook 10 + `@storybook/addon-a11y` (접근성 자동 검증)
- **Lint**: ESLint 9 · `eslint-config-next`

### Infrastructure
- **Hosting**: Vercel (Preview + Production)
- **CI**: GitHub Actions (lint, test, build)

## 🏗 설계 포인트

### 디자인 토큰 우선 설계
UI 전반에 쓰이는 색상·간격·타이포그래피를 토큰으로 추상화. Tailwind 4의 CSS-first 설정과 결합해 테마 확장성 확보하고 `/design-tokens`에서 실시간 프리뷰 가능하도록 구성.

### 테스트 피라미드
Vitest 4 browser mode로 **실제 브라우저 환경**에서 컴포넌트 단위 테스트, Playwright로 주요 사용자 플로우 E2E, Storybook으로 상태별 UI를 격리 개발. 세 레이어가 겹치지 않게 역할 분리.

### 접근성 우선
`@storybook/addon-a11y`로 컴포넌트 개발 단계에서 WCAG 위반 자동 검출. 키보드 네비게이션·스크린 리더 대응을 기본으로 고려.

## 🚀 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.local.example .env.local
# .env.local에 DATABASE_URL, NEXTAUTH_SECRET 등 입력

# 3. 개발 서버 (Turbopack)
npm run dev
# → http://localhost:3000

# 4. Storybook (컴포넌트 문서 + 테스트)
npm run storybook
# → http://localhost:6006
```

## 📁 프로젝트 구조

```
src/
├── app/          # Next.js App Router (페이지, API Routes, Server Actions)
├── lib/          # DB 쿼리, 인증 로직, 유틸리티
└── types/        # TypeScript 타입 정의

.storybook/       # Storybook 설정
```

## 📝 추가 문서

- [DEPLOYMENT.md](./DEPLOYMENT.md) — Vercel 배포 가이드
- [SOCIAL_LOGIN_SETUP.md](./SOCIAL_LOGIN_SETUP.md) — 소셜 로그인 OAuth 설정

---

**Author**: [uxin0119](https://github.com/uxin0119)
