# 클리커 게임 개발 계획서

## 프로젝트 개요
**프로젝트명**: Hidden Clicker Game
**컨셉**: 업무용 앱처럼 위장된 클리커 게임
**개발 방식**: Agile (스프린트 단위 개발)

---

## 게임 컨셉
"숨겨진 클리커" - 버튼과 입력란, 숫자만으로 이루어진 미니멀한 UI로 게임을 위장

### 핵심 메커니즘
- 화면 터치/클릭으로 공격
- 클릭당 데미지 누적
- 적 체력 게이지 (숫자로만 표시)
- 적 처치 시 골드/경험치 획득
- 레벨업 시스템

---

## 기술 스택
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Storage**: Local Storage
- **Build Tool**: Turbopack

---

## 프로젝트 구조
```
/app
  /game
    - page.tsx           // 메인 게임 페이지
/components
  /game
    - GameBoard.tsx      // 메인 게임 보드
    - ClickArea.tsx      // 클릭 가능 영역
    - StatusPanel.tsx    // 스탯/상태 표시
    - UpgradePanel.tsx   // 업그레이드 UI
    - ProgressBar.tsx    // 위장용 진행바
/hooks
  - useGameState.ts      // 게임 상태 관리
  - useAutoSave.ts       // 자동 저장 훅
  - useAutoAttack.ts     // 자동 공격 훅
/utils
  - gameLogic.ts         // 게임 계산 로직
  - storage.ts           // 로컬 스토리지 유틸
  - constants.ts         // 게임 상수
/types
  - game.types.ts        // 게임 타입 정의
```

---

## 게임 밸런스

### 초기 스탯
```typescript
{
  clickDamage: 1,
  autoAttackDPS: 0,
  criticalChance: 0,
  criticalMultiplier: 2,
  gold: 0,
  level: 1,
  exp: 0
}
```

### 적 스탯 (레벨별)
```typescript
enemy = {
  health: 10 * level,
  goldReward: 1 * level,
  expReward: 5 * level
}
```

### 업그레이드 비용 (지수 증가)
```typescript
upgrades = {
  clickDamage: {
    baseCost: 10,
    multiplier: 1.5
  },
  autoAttackDPS: {
    baseCost: 50,
    multiplier: 2
  },
  criticalChance: {
    baseCost: 100,
    multiplier: 2
  }
}
```

---

## UI/UX 디자인 원칙

### 위장 디자인
- 모노톤 색상 (회색, 검정, 흰색)
- 버튼은 일반 폼 버튼처럼
- 숫자는 설정값이나 로그처럼 표시
- 애니메이션 최소화
- 전문적/업무용 느낌

### 레이아웃
```
┌─────────────────────────────┐
│  Status: [숫자들]            │
├─────────────────────────────┤
│                             │
│    [클릭 영역]               │
│                             │
├─────────────────────────────┤
│  Configurations:            │
│  [업그레이드 버튼들]         │
└─────────────────────────────┘
```

---

## 개발 스프린트

### Sprint 1: 기본 게임 로직 (Day 1)
- [x] 프로젝트 구조 설정
- [ ] 게임 상태 관리 (useGameState)
- [ ] 클릭 공격 기능
- [ ] 적 생성 및 체력 관리
- [ ] 골드/경험치 획득

### Sprint 2: UI 구현 (Day 1-2)
- [ ] 미니멀 디자인 시스템
- [ ] 클릭 영역 컴포넌트
- [ ] 스탯 표시 패널
- [ ] 진행률 표시

### Sprint 3: 업그레이드 시스템 (Day 2)
- [ ] 업그레이드 로직
- [ ] 비용 계산 시스템
- [ ] 자동 공격 기능
- [ ] 크리티컬 시스템

### Sprint 4: 저장/로드 & 최적화 (Day 3)
- [ ] 로컬 스토리지 연동
- [ ] 자동 저장 기능
- [ ] 성능 최적화
- [ ] 밸런스 조정

---

## 기능 우선순위

### P0 (필수)
- 클릭 공격
- 적 체력 관리
- 골드 획득
- 클릭 데미지 업그레이드

### P1 (중요)
- 자동 공격
- 레벨 시스템
- 로컬 스토리지 저장
- 크리티컬 시스템

### P2 (선택)
- 사운드 효과 (무음 가능)
- 통계 화면
- 리셋 기능
- 도전과제

---

## 성능 목표
- 초기 로드: < 1초
- 클릭 반응: < 16ms
- 메모리 사용: < 50MB
- 60 FPS 유지

---

## 테스트 체크리스트
- [ ] 클릭 시 데미지 적용 확인
- [ ] 적 처치 시 골드 지급 확인
- [ ] 업그레이드 비용 계산 정확성
- [ ] 저장/로드 기능 동작
- [ ] 자동 공격 DPS 계산
- [ ] 크리티컬 확률 검증
- [ ] 밸런스 테스트 (1~100 레벨)

---

## 향후 확장 가능성
- 여러 적 타입
- 보스전
- 스킬 시스템
- 프리스티지 시스템
- 멀티플레이어 (리더보드)

---

## 버전 관리
- **v0.1**: 기본 클릭 게임
- **v0.2**: 업그레이드 시스템
- **v0.3**: 저장/로드
- **v1.0**: 정식 출시

---

**작성일**: 2025-10-10
**업데이트**: 진행 중
