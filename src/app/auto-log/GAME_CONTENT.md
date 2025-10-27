# SPOIL THE SERVER - 게임 콘텐츠 목록

## 📊 목차
1. [적 목록 (Enemies)](#적-목록)
2. [프로세스/카드 목록 (Processes/Cards)](#프로세스카드-목록)
3. [패시브 아이템 목록 (Items/Relics)](#패시브-아이템-목록)
4. [소모품 목록 (Consumables)](#소모품-목록)
5. [이벤트 목록 (Events)](#이벤트-목록)

---

## 🎯 적 목록

### Tier 1: 초보자용 (매우 약함)

#### 1. test_server.dev
- **HP**: 30
- **공격력**: 4
- **패턴**: 공격(4) → 방어(3) → 공격(4)
- **설명**: Development test server. Very weak defenses.
- **취약점**: WEB (2배 피해)
- **약점**: SYSTEM, NETWORK (1.5배 피해)
- **저항**: 없음

#### 2. simple_http.srv
- **HP**: 35
- **공격력**: 5
- **패턴**: 공격(5) → 공격(5) → 공격(6)
- **설명**: Basic HTTP server. No special defenses.
- **취약점**: NETWORK (2배 피해)
- **약점**: WEB (1.5배 피해)
- **저항**: 없음

---

### Tier 2: 초급 (약함)

#### 3. legacy_database.sql
- **HP**: 40
- **공격력**: 6
- **패턴**: 방어(4) → 공격(6) → 공격(7)
- **설명**: Outdated database server. Weak to SQL attacks.
- **취약점**: WEB (2배 피해)
- **약점**: SYSTEM (1.5배 피해)
- **저항**: NETWORK (0.5배 피해)

#### 4. webapp_server.js
- **HP**: 45
- **공격력**: 7
- **패턴**: 공격(7) → 방어(5) → 공격(8)
- **설명**: Web application server. Vulnerable to web exploits.
- **취약점**: WEB (2배 피해)
- **약점**: NETWORK (1.5배 피해)
- **저항**: SYSTEM (0.5배 피해)

---

### Tier 3: 중급 (보통)

#### 5. legacy_app.exe
- **HP**: 50
- **공격력**: 8
- **패턴**: 공격(8) → 공격(9) → 방어(6)
- **설명**: Old C++ application. Memory vulnerabilities.
- **취약점**: SYSTEM (2배 피해)
- **약점**: WEB (1.5배 피해)
- **저항**: NETWORK (0.5배 피해)

#### 6. api_gateway.py
- **HP**: 55
- **공격력**: 9
- **패턴**: 공격(9) → 공격(10) → 방어(7)
- **설명**: API gateway. Weak to network attacks.
- **취약점**: NETWORK (2배 피해)
- **약점**: WEB (1.5배 피해)
- **저항**: SYSTEM (0.5배 피해)

---

### Tier 4: 고급 (강함)

#### 7. file_server.sh
- **HP**: 60
- **공격력**: 10
- **패턴**: 방어(8) → 공격(10) → 공격(11)
- **설명**: File server. Vulnerable to file inclusion.
- **취약점**: NETWORK (2배 피해)
- **약점**: SYSTEM (1.5배 피해)
- **저항**: WEB (0.5배 피해)

#### 8. auth_service.oauth
- **HP**: 65
- **공격력**: 11
- **패턴**: 공격(11) → 방어(9) → 공격(12)
- **설명**: Authentication server. Strong against web attacks.
- **취약점**: SYSTEM (2배 피해)
- **약점**: NETWORK (1.5배 피해)
- **저항**: WEB (0.5배 피해)

---

### 엘리트 적 (Elite Enemies)

#### 9. hardened_fortress.sys
- **HP**: 90
- **공격력**: 14
- **패턴**: 방어(12) → 공격(14) → 공격(16) → 방어(10)
- **설명**: Heavily secured server. Defensive pattern.
- **취약점**: 없음
- **약점**: SYSTEM, WEB (1.5배 피해)
- **저항**: NETWORK (0.5배 피해)

#### 10. microservice_mesh.k8s
- **HP**: 85
- **공격력**: 15
- **패턴**: 공격(15) → 공격(15) → 방어(11) → 공격(17)
- **설명**: Distributed microservices. Aggressive attacks.
- **취약점**: NETWORK (2배 피해)
- **약점**: WEB (1.5배 피해)
- **저항**: 없음

#### 11. security_ai.bot
- **HP**: 80
- **공격력**: 13
- **패턴**: 공격(13) → 방어(13) → 공격(13) → 방어(13)
- **설명**: AI-powered security. Balanced offense and defense.
- **취약점**: SYSTEM (2배 피해)
- **약점**: WEB, NETWORK (1.5배 피해)
- **저항**: 없음

---

### 보스 (Boss)

#### 12. MAINFRAME_CORE.mainframe
- **HP**: 150
- **공격력**: 18
- **패턴**: 방어(15) → 공격(18) → 공격(20) → 방어(12) → 공격(22) → 공격(18)
- **설명**: Central mainframe. Multiple attack phases.
- **취약점**: WEB, SYSTEM, NETWORK (2배 피해 - 모든 속성)
- **약점**: 없음
- **저항**: 없음

---

## 💾 프로세스/카드 목록

### 저코스트 공격 프로세스

효과 변경
#### 1. packet_send.sh
- **타입**: 공격
- **코스트**: 1 Cycle
- **피해**: 5
- **속성**: 없음
- **설명**: Fast packet transmission attack.

#### 2. ping_flood.py
- **타입**: 공격
- **코스트**: 1 Cycle
- **피해**: 6
- **속성**: 없음
- **설명**: Simple ICMP flood attack.

---

### 저코스트 방어 프로세스

효과 변경
#### 3. packet_filter.bat
- **타입**: 방어
- **코스트**: 1 Cycle
- **방어력**: 5
- **설명**: Basic packet filtering.

#### 4. access_control.sh
- **타입**: 방어
- **코스트**: 1 Cycle
- **방어력**: 6
- **설명**: Light access control layer.

---

### 특수 공격 프로세스

#### 5. buffer_overflow.c
- **타입**: 공격
- **코스트**: 2 Cycles
- **피해**: 15
- **속성**: SYSTEM
- **설명**: Memory corruption exploit.

#### 6. sql_injection.py
- **타입**: 공격
- **코스트**: 2 Cycles
- **피해**: 12
- **속성**: WEB
- **설명**: Database query injection.

#### 7. ddos_attack.exe
- **타입**: 공격
- **코스트**: 3 Cycles
- **피해**: 20
- **속성**: NETWORK
- **설명**: Distributed denial of service.

---

### 디버프/유틸리티 프로세스

#### 8. memory_leak.py
- **타입**: 유틸리티
- **코스트**: 1 Cycle
- **효과**: Next attack deals 50% more damage
- **설명**: Inject memory leak.

#### 9. cpu_throttle.sh
- **타입**: 유틸리티
- **코스트**: 1 Cycle
- **효과**: Attack reduced by 3 for 2 turns
- **설명**: Reduce enemy CPU performance.

#### 10. stack_smash.bat
- **타입**: 유틸리티
- **코스트**: 1 Cycle
- **효과**: Remove firewall and prevent defense for 1 turn
- **설명**: Corrupt stack protection.

---

### 고급 공격 프로세스 (보상용)

#### 11. xss_payload.js
- **타입**: 공격
- **코스트**: 1 Cycle
- **피해**: 8
- **속성**: WEB
- **설명**: Inject malicious script.

효과변경
#### 12. csrf_attack.sh
- **타입**: 공격
- **코스트**: 2 Cycles
- **피해**: 10
- **속성**: WEB
- **설명**: Session hijacking exploit.

#### 13. remote_shell.exe
- **타입**: 공격
- **코스트**: 3 Cycles
- **피해**: 20
- **속성**: SYSTEM
- **설명**: Execute arbitrary code.

#### 14. priv_escalate.bat
- **타입**: 공격
- **코스트**: 2 Cycles
- **피해**: 14
- **속성**: SYSTEM
- **설명**: Gain root access.

#### 15. ssrf_exploit.py
- **타입**: 공격
- **코스트**: 2 Cycles
- **피해**: 13
- **속성**: NETWORK
- **설명**: Server-side request forgery.

효과 변경
#### 16. file_inclusion.sh
- **타입**: 공격
- **코스트**: 2 Cycles
- **피해**: 11
- **속성**: NETWORK
- **설명**: Access restricted files.

효과 변경
#### 17. mitm_attack.exe
- **타입**: 공격
- **코스트**: 3 Cycles
- **피해**: 16
- **속성**: NETWORK
- **설명**: Intercept communications.

---

### 고급 방어 프로세스 (보상용)

#### 18. firewall.bat
- **타입**: 방어
- **코스트**: 2 Cycles
- **방어력**: 15
- **설명**: Deploy strong defensive barrier.

효과 변경
#### 19. advanced_shield.exe
- **타입**: 방어
- **코스트**: 2 Cycles
- **방어력**: 12
- **설명**: Enhanced protection layer.

---

### 회복/유틸리티 프로세스

#### 20. repair.py
- **타입**: 회복
- **코스트**: 2 Cycles
- **회복량**: 12
- **설명**: Restore system integrity.

#### 21. vuln_scan.exe
- **타입**: 유틸리티
- **코스트**: 1 Cycle
- **효과**: Draw 1 process
- **설명**: Analyze target weaknesses.

---

## 🎴 패시브 아이템 목록

### Common (일반) 아이템

#### 1. 🌡️ CPU Cooler
- **효과**: +10 Max Integrity
- **설명**: Keeps your system running cool under pressure.

#### 2. 💾 Extra RAM Stick
- **효과**: +1 Max Threads
- **설명**: More memory for concurrent operations.

#### 3. 🛡️ Basic Antivirus
- **효과**: Start each combat with 3 Firewall
- **설명**: Basic protection layer.

#### 4. 📦 Cache Module
- **효과**: Draw 1 extra process at the start of each turn
- **설명**: Faster process loading.

---

### Uncommon (고급) 아이템

#### 5. ⚡ Overclock Chip
- **효과**: +3 Throughput to all attack processes
- **설명**: Boost attack power.

#### 6. ⚙️ Kernel Optimizer
- **효과**: All processes cost 1 less Cycle (minimum 1)
- **설명**: Reduced resource consumption.

#### 7. 💚 Recovery Daemon
- **효과**: Restore 10 Integrity after defeating an enemy
- **설명**: Automatic health recovery.

#### 8. 🔑 Encryption Key
- **효과**: +5 Firewall at the start of each combat
- **설명**: Enhanced starting defense.

#### 9. 💽 Solid State Drive
- **효과**: +20 Max Integrity
- **설명**: High-speed, high-capacity storage.

---

### Rare (희귀) 아이템

#### 10. 🔮 Quantum Processor
- **효과**: +2 Max Threads
- **설명**: Parallel processing at quantum speeds.

#### 11. 🧠 Neural Network
- **효과**: WEB attacks deal 50% more damage
- **설명**: AI-enhanced web exploitation.

#### 12. 🔐 Root Access Token
- **효과**: SYSTEM attacks deal 50% more damage
- **설명**: Privileged system access.

#### 13. 📡 Advanced Network Card
- **효과**: NETWORK attacks deal 50% more damage
- **설명**: Superior network exploitation.

#### 14. 🧱 Hardware Firewall
- **효과**: All defense processes grant 50% more Firewall
- **설명**: Enhanced defensive capabilities.

#### 15. 📚 Redundant Array
- **효과**: +30 Max Integrity
- **설명**: RAID configuration for maximum reliability.

---

### Boss (보스) 아이템

#### 16. 👑 Master Boot Record
- **효과**: +50 Max Integrity, +1 Max Threads
- **설명**: Total system control.

#### 17. 💀 Zero-Day Exploit
- **효과**: +5 Throughput to all attacks, -1 Cycle cost to all processes
- **설명**: Ultimate offensive and efficiency boost.

#### 18. 🍯 Honeypot System
- **효과**: Start combat with 10 Firewall, Immune to WEB vulnerabilities
- **설명**: Advanced defensive deception.

---

## 💊 소모품 목록

### Social Engineering (사회공학)

#### 1. 📧 Phishing Email
- **효과**: Deal 15 instant damage
- **설명**: Send a convincing phishing email.

#### 2. 🎭 Social Exploit
- **효과**: Deal 20 instant damage
- **설명**: Manipulate an insider.

#### 3. 🔑 Credential Theft
- **효과**: Weaken enemy by 5 attack for 3 turns
- **설명**: Steal login credentials.

---

### Sabotage (사보타주)

#### 4. ⚡ Power Surge
- **효과**: Deal 25 instant damage
- **설명**: Overload the power supply.

#### 5. 🔨 Hardware Damage
- **효과**: Deal 30 instant damage
- **설명**: Physically damage server hardware.

#### 6. 🌡️ Cooling System Failure
- **효과**: Weaken enemy by 8 attack for 2 turns
- **설명**: Disable cooling systems.

#### 7. 💥 Firewall Disruptor
- **효과**: Remove all enemy firewall protection
- **설명**: Breach defensive barriers.

---

### Exploits (익스플로잇)

#### 8. 💀 Zero-Day Package
- **효과**: Deal 35 instant damage
- **설명**: Use an unknown vulnerability.

#### 9. 🚪 Backdoor Access
- **효과**: Gain 2 BTC
- **설명**: Exploit a hidden backdoor.

---

### Utility (유틸리티)

#### 10. 🩹 Emergency Patch
- **효과**: Restore 20 Integrity
- **설명**: Apply emergency system repairs.

#### 11. ⚡ Overclock Injection
- **효과**: Gain 2 Threads this combat
- **설명**: Temporarily boost performance.

#### 12. 📦 Process Cache
- **효과**: Draw 3 processes
- **설명**: Load processes from cache.

#### 13. ⛏️ Quick Crypto Mine
- **효과**: Gain 3 BTC
- **설명**: Run a quick mining operation.

---

## 🎲 이벤트 목록

### Common (일반) 이벤트

#### 1. 👨‍💻 보안 전문가
**상황**: 연구자가 당신의 프로세스를 구매하고 싶어합니다.

**선택지**:
- **프로세스 판매**: 랜덤 프로세스 1개 잃음, 15 ₿ 획득
- **거절**: 3 ₿ 획득

---

#### 2. 🎣 보안 업데이트?
**상황**: 수상한 보안 업데이트 알림이 왔습니다.

**선택지**:
- **설치**: 50% 확률로 강력한 프로세스 획득 OR 프로세스 1개 손실
- **무시하고 스캔**: 8 ₿ 획득

---

#### 3. 🍀 관리자의 실수
**상황**: 비밀번호가 노출된 서버를 발견했습니다.

**선택지**:
- **데이터 탈취**: 18 ₿ 획득
- **익명으로 알림**: 15 체력 회복

---

#### 4. 📦 미스터리 패킷
**상황**: 정체불명의 데이터 패킷을 가로챘습니다.

**선택지**:
- **실행**: 50% 확률로 15 ₿ 획득 OR 15 피해
- **안전하게 파괴**: 8 체력 회복

---

### Uncommon (고급) 이벤트

#### 5. 💼 다크웹 의뢰
**상황**: 고수익 해킹 의뢰가 들어왔습니다.

**선택지**:
- **의뢰 수락**: 엘리트 적과 전투 (보상 2배)
- **거절**: 5 ₿ 획득

---

#### 6. 🐛 취약점 발견
**상황**: 주요 클라우드 제공업체의 치명적인 취약점을 발견했습니다.

**선택지**:
- **버그 바운티에 제보**: 20 ₿ + 10 체력 획득
- **무기화**: 강력한 공격 프로세스 획득

---

#### 7. 🔒 랜섬웨어 갱
**상황**: 당신의 파일이 암호화되었습니다!

**선택지**:
- **몸값 지불**: 15 ₿ 손실
- **역추적 후 반격**: 일반 적과 전투

---

#### 8. 💬 해커 포럼
**상황**: 신뢰받는 트레이더가 프로세스 교환을 제안합니다.

**선택지**:
- **교환**: 랜덤 프로세스 1개 잃고 희귀 프로세스 1개 획득
- **거절**: 소모품 1개 획득

---

#### 9. 💰 데이터 브로커
**상황**: 블랙마켓 브로커가 대량 구매를 제안합니다.

**선택지**:
- **대량 판매**: 프로세스 3개 판매, 25 ₿ 획득
- **거절**: 소모품 1개 획득

---

### Rare (희귀) 이벤트

#### 10. 🎭 익명의 지원자
**상황**: 정체불명의 인물이 위험한 거래를 제안합니다.

**선택지**:
- **거래 수락**: 체력 50% 손실, 강력한 희귀 프로세스 획득
- **거절**: 5 체력 회복

---

#### 11. 💀 다크웹 게시글
**상황**: 0-day 익스플로잇이 유출되었습니다.

**선택지**:
- **다운로드**: 50% 확률로 강력한 익스플로잇 획득 OR 20 피해
- **당국에 신고**: 12 ₿ 획득

---

#### 12. 🕵️ APT 그룹 초대
**상황**: 고급 지속 위협 그룹이 당신을 스카웃합니다.

**선택지**:
- **가입**: 강력한 도구 획득 (부작용 있음)
- **정중히 거절**: 10 ₿ 획득

---

## 📈 게임 통계

### 총 콘텐츠 수
- **적**: 12종 (일반 8, 엘리트 3, 보스 1)
- **프로세스/카드**: 21종
- **패시브 아이템**: 18종 (Common 4, Uncommon 5, Rare 6, Boss 3)
- **소모품**: 13종
- **이벤트**: 12종 (Common 4, Uncommon 5, Rare 3)

### 속성 시스템
- **WEB**: 웹 공격 (SQL Injection, XSS, CSRF 등)
- **SYSTEM**: 시스템 공격 (Buffer Overflow, Remote Shell 등)
- **NETWORK**: 네트워크 공격 (DDoS, MITM, SSRF 등)

### 난이도 스케일링
- 층마다 적 스탯 15% 증가
- 전투 횟수에 따라 적 풀 확대
- 엘리트/보스는 고정 스탯

---

**최종 업데이트**: 2025-10-22
**게임 버전**: 1.0
