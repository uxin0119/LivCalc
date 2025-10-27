# 💾 프로세스/카드 목록

## 저코스트 공격 프로세스

### 1. packet_send.sh ⚡ NEW EFFECT
- **타입**: 공격
- **코스트**: 1 Cycle
- **효과**: 5 피해. 다음 턴에 2장 드로우 (기본 2장에 추가)
- **속성**: 없음
- **설명**: Fast packet transmission that loads more processes.

### 2. ping_flood.py 🔄 NEW EFFECT
- **타입**: 공격
- **코스트**: 1 Cycle
- **효과**: 4 피해. 3 Firewall 획득
- **속성**: 없음
- **설명**: Defensive flood attack with protective measures.

---

## 저코스트 방어 프로세스

### 3. packet_filter.bat 🛡️ NEW EFFECT
- **타입**: 방어
- **코스트**: 1 Cycle
- **효과**: 5 Firewall. 이번 턴에 스레드 +1
- **설명**: Efficient filtering that frees up resources.

### 4. access_control.sh 💚 NEW EFFECT
- **타입**: 방어
- **코스트**: 1 Cycle
- **효과**: 3 Firewall. 3 Integrity 회복
- **설명**: Access control with system stabilization.

---

## 특수 공격 프로세스

### 5. buffer_overflow.c
- **타입**: 공격
- **코스트**: 2 Cycles
- **피해**: 15
- **속성**: SYSTEM
- **설명**: Memory corruption exploit.

### 6. sql_injection.py
- **타입**: 공격
- **코스트**: 2 Cycles
- **피해**: 12
- **속성**: WEB
- **설명**: Database query injection.

### 7. ddos_attack.exe
- **타입**: 공격
- **코스트**: 3 Cycles
- **피해**: 20
- **속성**: NETWORK
- **설명**: Distributed denial of service.

---

## 디버프/유틸리티 프로세스

### 8. memory_leak.py
- **타입**: 유틸리티
- **코스트**: 1 Cycle
- **효과**: Next attack deals 50% more damage
- **설명**: Inject memory leak.

### 9. cpu_throttle.sh
- **타입**: 유틸리티
- **코스트**: 1 Cycle
- **효과**: Attack reduced by 3 for 2 turns
- **설명**: Reduce enemy CPU performance.

### 10. stack_smash.bat
- **타입**: 유틸리티
- **코스트**: 1 Cycle
- **효과**: Remove firewall and prevent defense for 1 turn
- **설명**: Corrupt stack protection.

---

## 고급 공격 프로세스 (보상용)

### 11. xss_payload.js
- **타입**: 공격
- **코스트**: 1 Cycle
- **피해**: 8
- **속성**: WEB
- **설명**: Inject malicious script.

### 12. csrf_attack.sh 🎯 NEW EFFECT
- **타입**: 공격
- **코스트**: 2 Cycles
- **효과**: 12 피해. 적이 Firewall을 가지고 있다면 추가로 6 피해
- **속성**: WEB
- **설명**: Session hijacking that exploits active defenses.

### 13. remote_shell.exe
- **타입**: 공격
- **코스트**: 3 Cycles
- **피해**: 20
- **속성**: SYSTEM
- **설명**: Execute arbitrary code.

### 14. priv_escalate.bat
- **타입**: 공격
- **코스트**: 2 Cycles
- **피해**: 14
- **속성**: SYSTEM
- **설명**: Gain root access.

### 15. ssrf_exploit.py
- **타입**: 공격
- **코스트**: 2 Cycles
- **피해**: 13
- **속성**: NETWORK
- **설명**: Server-side request forgery.

### 16. file_inclusion.sh 📂 NEW EFFECT
- **타입**: 공격
- **코스트**: 2 Cycles
- **효과**: 8 피해. 손에 있는 카드 수 만큼 추가 피해 (최대 +8)
- **속성**: NETWORK
- **설명**: File access scales with available processes.

### 17. mitm_attack.exe 🔍 NEW EFFECT
- **타입**: 공격
- **코스트**: 3 Cycles
- **효과**: 14 피해. 적의 다음 공격력을 절반으로 감소
- **속성**: NETWORK
- **설명**: Intercept and disrupt enemy communications.

---

## 고급 방어 프로세스 (보상용)

### 18. firewall.bat
- **타입**: 방어
- **코스트**: 2 Cycles
- **방어력**: 15
- **설명**: Deploy strong defensive barrier.

### 19. advanced_shield.exe ⚔️ NEW EFFECT
- **타입**: 방어
- **코스트**: 2 Cycles
- **효과**: 10 Firewall. 다음 공격 프로세스의 피해 +5
- **설명**: Defensive stance that prepares a counter-attack.

---

## 회복/유틸리티 프로세스

### 20. repair.py
- **타입**: 회복
- **코스트**: 2 Cycles
- **회복량**: 12
- **설명**: Restore system integrity.

### 21. vuln_scan.exe
- **타입**: 유틸리티
- **코스트**: 1 Cycle
- **효과**: Draw 1 process
- **설명**: Analyze target weaknesses.

---

## 효과 요약

### 새로운 메커니즘
1. **조건부 피해**: csrf_attack (적 방화벽 있으면 추가 피해)
2. **스케일링 피해**: file_inclusion (손패 개수에 비례)
3. **리소스 생성**: packet_filter (스레드 생성), packet_send (카드 드로우)
4. **하이브리드**: ping_flood (공격+방어), access_control (방어+회복), advanced_shield (방어+공격 버프)
5. **적 디버프**: mitm_attack (적 공격력 감소)

### 시너지 가능성
- **packet_send** → 다음 턴 손패 많음 → **file_inclusion** 강화
- **packet_filter** → 스레드 생성 → 같은 턴에 더 많은 카드 사용
- **advanced_shield** → 방어 후 → 강화된 공격
- **csrf_attack** → 적이 방어 사용 시 → 카운터 전략

---

**업데이트**: 2025-10-22
**새 효과 추가**: 8개 카드
