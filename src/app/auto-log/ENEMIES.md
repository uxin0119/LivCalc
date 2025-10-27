# 🎯 적 목록

## Tier 1: 초보자용 (매우 약함)

### 1. test_server.dev
- **HP**: 30
- **공격력**: 4
- **패턴**: 공격(4) → 방어(3) → 공격(4)
- **설명**: Development test server. Very weak defenses.
- **취약점**: WEB (2배 피해)
- **약점**: SYSTEM, NETWORK (1.5배 피해)
- **저항**: 없음

### 2. simple_http.srv
- **HP**: 35
- **공격력**: 5
- **패턴**: 공격(5) → 공격(5) → 공격(6)
- **설명**: Basic HTTP server. No special defenses.
- **취약점**: NETWORK (2배 피해)
- **약점**: WEB (1.5배 피해)
- **저항**: 없음

---

## Tier 2: 초급 (약함)

### 3. legacy_database.sql
- **HP**: 40
- **공격력**: 6
- **패턴**: 방어(4) → 공격(6) → 공격(7)
- **설명**: Outdated database server. Weak to SQL attacks.
- **취약점**: WEB (2배 피해)
- **약점**: SYSTEM (1.5배 피해)
- **저항**: NETWORK (0.5배 피해)

### 4. webapp_server.js
- **HP**: 45
- **공격력**: 7
- **패턴**: 공격(7) → 방어(5) → 공격(8)
- **설명**: Web application server. Vulnerable to web exploits.
- **취약점**: WEB (2배 피해)
- **약점**: NETWORK (1.5배 피해)
- **저항**: SYSTEM (0.5배 피해)

---

## Tier 3: 중급 (보통)

### 5. legacy_app.exe
- **HP**: 50
- **공격력**: 8
- **패턴**: 공격(8) → 공격(9) → 방어(6)
- **설명**: Old C++ application. Memory vulnerabilities.
- **취약점**: SYSTEM (2배 피해)
- **약점**: WEB (1.5배 피해)
- **저항**: NETWORK (0.5배 피해)

### 6. api_gateway.py
- **HP**: 55
- **공격력**: 9
- **패턴**: 공격(9) → 공격(10) → 방어(7)
- **설명**: API gateway. Weak to network attacks.
- **취약점**: NETWORK (2배 피해)
- **약점**: WEB (1.5배 피해)
- **저항**: SYSTEM (0.5배 피해)

---

## Tier 4: 고급 (강함)

### 7. file_server.sh
- **HP**: 60
- **공격력**: 10
- **패턴**: 방어(8) → 공격(10) → 공격(11)
- **설명**: File server. Vulnerable to file inclusion.
- **취약점**: NETWORK (2배 피해)
- **약점**: SYSTEM (1.5배 피해)
- **저항**: WEB (0.5배 피해)

### 8. auth_service.oauth
- **HP**: 65
- **공격력**: 11
- **패턴**: 공격(11) → 방어(9) → 공격(12)
- **설명**: Authentication server. Strong against web attacks.
- **취약점**: SYSTEM (2배 피해)
- **약점**: NETWORK (1.5배 피해)
- **저항**: WEB (0.5배 피해)

---

## 엘리트 적 (Elite Enemies)

### 9. hardened_fortress.sys
- **HP**: 90
- **공격력**: 14
- **패턴**: 방어(12) → 공격(14) → 공격(16) → 방어(10)
- **설명**: Heavily secured server. Defensive pattern.
- **취약점**: 없음
- **약점**: SYSTEM, WEB (1.5배 피해)
- **저항**: NETWORK (0.5배 피해)

### 10. microservice_mesh.k8s
- **HP**: 85
- **공격력**: 15
- **패턴**: 공격(15) → 공격(15) → 방어(11) → 공격(17)
- **설명**: Distributed microservices. Aggressive attacks.
- **취약점**: NETWORK (2배 피해)
- **약점**: WEB (1.5배 피해)
- **저항**: 없음

### 11. security_ai.bot
- **HP**: 80
- **공격력**: 13
- **패턴**: 공격(13) → 방어(13) → 공격(13) → 방어(13)
- **설명**: AI-powered security. Balanced offense and defense.
- **취약점**: SYSTEM (2배 피해)
- **약점**: WEB, NETWORK (1.5배 피해)
- **저항**: 없음

---

## 보스 (Boss)

### 12. MAINFRAME_CORE.mainframe
- **HP**: 150
- **공격력**: 18
- **패턴**: 방어(15) → 공격(18) → 공격(20) → 방어(12) → 공격(22) → 공격(18)
- **설명**: Central mainframe. Multiple attack phases.
- **취약점**: WEB, SYSTEM, NETWORK (2배 피해 - 모든 속성)
- **약점**: 없음
- **저항**: 없음

---

## 통계
- **총 적 수**: 12종
- **일반 적**: 8종 (Tier 1-4)
- **엘리트**: 3종
- **보스**: 1종

## 난이도 스케일링
- 층마다 적 스탯 15% 증가
- 전투 횟수에 따라 적 풀 확대
- 엘리트/보스는 고정 스탯

---

**최종 업데이트**: 2025-10-22
