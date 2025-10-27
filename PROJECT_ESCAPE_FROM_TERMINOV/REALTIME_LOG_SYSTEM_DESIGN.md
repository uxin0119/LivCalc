# 실시간 활동 로그 시스템 설계

## 📋 개요

전사의 원정 진행 상황을 실시간으로 보여주는 로그 시스템.
시스템 모니터 스타일의 콘솔 로그처럼 보이며, 플레이어에게 몰입감과 긴장감을 제공.

---

## 🎯 핵심 목표

1. **실시간 피드백**: 원정 중 전사의 행동을 시각적으로 표현
2. **긴장감 조성**: 전투/위험 상황을 즉각 알림
3. **정보 제공**: 인벤토리, HP, 스태미나 변화 추적
4. **몰입감 강화**: 시스템 모니터 스타일의 로그 메시지

---

## 📊 로그 이벤트 타입

### 1. 이동 이벤트 (Movement)

```
[00:23] >> Entering: corridor_A
[00:45] >> Reached: room_03 (Security Office)
[01:12] >> Moving through: ventilation_shaft
[02:30] >> Arrived at: extraction_point_alpha
```

**발생 조건:**
- 새로운 구역 진입 시
- 주요 랜드마크 도달 시
- 탈출 지점 근접 시

**메시지 패턴:**
- `>> Entering: {location}`
- `>> Reached: {location} ({location_type})`
- `>> Moving through: {location}`

---

### 2. 전투 이벤트 (Combat)

```
[03:15] ⚠ CONTACT: Hostile detected
[03:16] ⚔ Combat initiated - Enemy: Scavenger
[03:18] 💥 HIT: Enemy -45 HP (AK-47)
[03:20] 🩹 DAMAGE TAKEN: -25 HP
[03:23] ✅ VICTORY: Enemy eliminated
[03:24] 📦 Loot acquired: [ammo_762.dat] [medkit_basic.dll]
```

```
[05:40] ⚠ CONTACT: Multiple hostiles (x3)
[05:41] ⚔ Combat initiated - Enemy: Raider Squad
[05:45] 💥 CRITICAL HIT: Enemy -85 HP
[05:48] 🩹 HEAVY DAMAGE: -60 HP (Warning: HP at 45%)
[05:50] 💀 ENEMY DOWN (1/3)
[05:55] 🔫 Ammo depleted - Switching to secondary
[06:02] ❌ DEFEAT: Retreating from combat
[06:03] ⚠ HP CRITICAL: 18% remaining
```

**발생 조건:**
- 적 조우 시
- 전투 행동 (공격/방어/회피)
- 전투 종료 (승리/패배/도주)

**메시지 패턴:**
- `⚠ CONTACT: {enemy_description}`
- `⚔ Combat initiated - Enemy: {enemy_type}`
- `💥 HIT/CRITICAL HIT: {description}`
- `🩹 DAMAGE TAKEN: -{amount} HP`
- `✅ VICTORY: {result}`
- `❌ DEFEAT: {result}`
- `💀 ENEMY DOWN ({count})`

---

### 3. 루팅 이벤트 (Looting)

```
[04:10] 🔍 Searching: weapon_crate_07
[04:12] 📦 Found: [rifle_m4a1.exe] [scope_4x.dll]
[04:13] ✅ Added to inventory (12.4kg / 20kg)
[04:15] 🔍 Searching: medical_cabinet
[04:16] 📦 Found: [medkit_adv.dll] [stimpack.dll]
[04:17] ⚠ Inventory near capacity (18.9kg / 20kg)

[05:20] 🔍 Searching: rare_loot_box
[05:22] 🌟 RARE FIND: [loot_bitcoin.dat] [keycard_red.key]
[05:23] ❌ Inventory full - Item dropped: [food_ration.tmp]
[05:24] ✅ Added to inventory (20kg / 20kg)
```

**발생 조건:**
- 컨테이너/상자 탐색 시
- 아이템 획득 시
- 인벤토리 공간 부족 시

**메시지 패턴:**
- `🔍 Searching: {container_name}`
- `📦 Found: [item1] [item2]`
- `✅ Added to inventory ({current}kg / {max}kg)`
- `🌟 RARE FIND: {items}`
- `⚠ Inventory near capacity`
- `❌ Inventory full`

---

### 4. 소모품 사용 (Consumables)

```
[06:30] 💊 Used: medkit_basic.dll
[06:31] ❤ HP restored: +30 (48% → 78%)
[06:35] 🍖 Consumed: food_ration.tmp
[06:36] ⚡ Stamina restored: +20 (35% → 55%)

[08:12] 💉 Injected: stimpack.dll
[08:13] ❤ HP +40, ⚡ Stamina +50 (BUFF: 60s)
[08:14] ⚠ Low supplies: Medkit x1, Food x2
```

**발생 조건:**
- 의료품 사용
- 식량/물 섭취
- 전투 자극제 사용

**메시지 패턴:**
- `💊 Used: {item}`
- `❤ HP restored: +{amount}`
- `🍖 Consumed: {item}`
- `⚡ Stamina restored: +{amount}`
- `💉 Injected: {item}`
- `⚠ Low supplies: {remaining}`

---

### 5. 상태 변화 (Status Changes)

```
[10:20] ⚠ HP CRITICAL: 22% remaining
[10:25] 🩸 BLEEDING: -5% HP per minute
[10:30] ⚠ EXHAUSTED: Stamina depleted
[10:35] 🥵 OVERWEIGHT: Movement -30%
[10:40] ❄ COLD: HP regen -50%

[12:10] ✅ Bleeding stopped
[12:15] ⚡ Stamina recovered: 65%
[12:20] ❤ HP regenerating: 3%/min
```

**발생 조건:**
- HP 임계값 도달 (50%, 30%, 20%)
- 상태 이상 발생 (출혈, 골절, 탈진)
- 환경 효과 (추위, 더위, 방사능)

**메시지 패턴:**
- `⚠ HP CRITICAL: {percentage}%`
- `🩸 BLEEDING: {effect}`
- `⚠ EXHAUSTED: {effect}`
- `✅ {status} stopped/recovered`

---

### 6. 귀환 이벤트 (Extraction)

```
[25:00] 🚪 Extraction point visible (500m)
[25:30] >> Moving to: extraction_point_alpha
[26:00] ⚠ CONTACT: Enemy at extraction zone
[26:15] ⚔ Fighting for extraction...
[26:45] ✅ Enemy cleared
[27:00] 🚁 EXTRACTING: Securing perimeter
[27:30] ✅ EXTRACTION SUCCESSFUL
[27:31] 📊 Mission complete - Rewards calculated

--- MISSION SUMMARY ---
Duration: 27m 31s
Enemies killed: 8
Items looted: 15
Survived: YES
XP gained: +450
```

```
[15:20] ⚠ EMERGENCY: Initiating early extraction
[15:21] 🚨 Reason: HP Critical (18%)
[15:25] >> Running to nearest exit (850m)
[15:40] ⚠ CONTACT: Enemy pursuit detected
[16:10] 💀 EXTRACTION FAILED: KIA
[16:11] ❌ All equipped gear lost

--- MISSION FAILED ---
Duration: 16m 11s
Cause of death: Enemy combat
Items lost: ALL EQUIPPED GEAR
XP gained: +0
```

**발생 조건:**
- 탈출 지점 근접
- 정상 귀환 시도
- 긴급 귀환 발동
- 귀환 성공/실패

**메시지 패턴:**
- `🚪 Extraction point visible`
- `⚠ EMERGENCY: {reason}`
- `🚁 EXTRACTING: {status}`
- `✅ EXTRACTION SUCCESSFUL`
- `💀 EXTRACTION FAILED: {reason}`

---

## 🎨 UI 디자인

### 로그 창 레이아웃

```
┌─ Activity Log ────────────────────────────────────────┐
│ [23:45] ✅ VICTORY: Enemy eliminated                   │
│ [23:44] 💥 HIT: Enemy -45 HP (AK-47)                   │
│ [23:43] ⚔ Combat initiated - Enemy: Scavenger         │
│ [23:41] >> Entered: corridor_b                         │
│ [23:38] 🔍 Searching: weapon_crate_03                  │
│ [23:37] 📦 Found: [Rare_Scope.dat]                     │
│ [23:35] 💊 Used: medkit_basic.dll                      │
│ [23:34] 🩹 DAMAGE TAKEN: -15 HP (Warning: HP 67%)      │
│ [23:30] >> Reached: room_07 (Armory)                   │
│ [23:25] ⚡ Consumed: food_ration.tmp                    │
│ [... 247 more entries]                                 │
│                                                         │
│ [Auto-scroll: ON] [Filter: ALL] [Export Log]           │
└───────────────────────────────────────────────────────┘
```

### 스타일링

- **폰트**: Monospace (Consolas, Courier New)
- **배경**: 검은색 (#000000) 또는 다크 그레이 (#0a0a0a)
- **텍스트**: 연한 녹색 (#00ff00) - 시스템 모니터 스타일
- **타임스탬프**: 회색 (#808080)
- **아이콘**: 이모지 또는 ASCII 심볼
- **스크롤**: 최신 로그 자동 표시 (옵션: 자동 스크롤 비활성화)

### 로그 색상 코딩

```css
일반 이동: #00ff00 (녹색)
전투 발생: #ffff00 (노란색)
데미지 입음: #ff6600 (주황색)
위험 상태: #ff0000 (빨간색)
루팅 성공: #00ffff (청록색)
귀환 성공: #00ff00 (녹색)
사망/실패: #ff0000 (빨간색)
희귀 아이템: #9900ff (보라색)
전설 아이템: #ffd700 (금색)
```

---

## ⚙️ 기술 구현

### 1. 로그 데이터 구조

```typescript
interface ActivityLog {
  id: string;
  timestamp: number; // 원정 시작 후 경과 시간 (초)
  type: LogType;
  severity: LogSeverity;
  message: string;
  icon: string;
  metadata?: {
    damage?: number;
    item?: string;
    location?: string;
    enemy?: string;
    [key: string]: any;
  };
}

enum LogType {
  MOVEMENT = 'movement',
  COMBAT = 'combat',
  LOOT = 'loot',
  CONSUMABLE = 'consumable',
  STATUS = 'status',
  EXTRACTION = 'extraction',
  SYSTEM = 'system'
}

enum LogSeverity {
  INFO = 'info',      // 일반 정보
  SUCCESS = 'success', // 긍정적 이벤트
  WARNING = 'warning', // 경고
  DANGER = 'danger',   // 위험
  CRITICAL = 'critical' // 치명적
}
```

### 2. 로그 생성 시스템

```typescript
class ActivityLogGenerator {
  private logs: ActivityLog[] = [];
  private raidStartTime: Date;

  constructor(raidStartTime: Date) {
    this.raidStartTime = raidStartTime;
  }

  // 새 로그 추가
  addLog(type: LogType, message: string, severity: LogSeverity, metadata?: any): void {
    const elapsed = Math.floor((Date.now() - this.raidStartTime.getTime()) / 1000);
    const log: ActivityLog = {
      id: `log_${Date.now()}_${Math.random()}`,
      timestamp: elapsed,
      type,
      severity,
      message,
      icon: this.getIconForType(type, severity),
      metadata
    };

    this.logs.push(log);

    // 최대 500개 로그만 유지 (메모리 관리)
    if (this.logs.length > 500) {
      this.logs.shift();
    }
  }

  // 타입별 아이콘
  private getIconForType(type: LogType, severity: LogSeverity): string {
    const icons = {
      movement: '>>',
      combat: severity === 'danger' ? '⚔' : '💥',
      loot: severity === 'critical' ? '🌟' : '📦',
      consumable: '💊',
      status: severity === 'danger' ? '⚠' : '✅',
      extraction: severity === 'success' ? '✅' : '🚁',
      system: 'ℹ'
    };
    return icons[type] || '•';
  }

  // 로그 필터링
  filterLogs(type?: LogType, severity?: LogSeverity): ActivityLog[] {
    return this.logs.filter(log => {
      if (type && log.type !== type) return false;
      if (severity && log.severity !== severity) return false;
      return true;
    });
  }

  // 최근 N개 로그 가져오기
  getRecentLogs(count: number = 50): ActivityLog[] {
    return this.logs.slice(-count);
  }

  // 타임스탬프 포맷팅
  formatTimestamp(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
```

### 3. 이벤트 시뮬레이션 엔진

```typescript
class RaidSimulator {
  private logGenerator: ActivityLogGenerator;
  private raidState: RaidState;
  private eventQueue: ScheduledEvent[] = [];

  constructor(raidConfig: RaidConfig) {
    this.logGenerator = new ActivityLogGenerator(new Date());
    this.raidState = this.initializeRaidState(raidConfig);
    this.scheduleEvents();
  }

  // 이벤트 스케줄링
  private scheduleEvents(): void {
    const duration = this.raidState.duration;

    // 이동 이벤트 (5-10분마다)
    for (let t = 300; t < duration; t += this.random(300, 600)) {
      this.eventQueue.push({
        time: t,
        type: 'movement',
        handler: () => this.handleMovement()
      });
    }

    // 전투 이벤트 (10-20분마다, 확률 60%)
    for (let t = 600; t < duration; t += this.random(600, 1200)) {
      if (Math.random() < 0.6) {
        this.eventQueue.push({
          time: t,
          type: 'combat',
          handler: () => this.handleCombat()
        });
      }
    }

    // 루팅 이벤트 (전투 후 또는 무작위)
    for (let t = 400; t < duration; t += this.random(400, 800)) {
      this.eventQueue.push({
        time: t,
        type: 'loot',
        handler: () => this.handleLoot()
      });
    }

    // 소모품 사용 (HP/스태미나 기반)
    for (let t = 200; t < duration; t += this.random(200, 500)) {
      this.eventQueue.push({
        time: t,
        type: 'consumable',
        handler: () => this.checkConsumables()
      });
    }

    // 정렬 (시간순)
    this.eventQueue.sort((a, b) => a.time - b.time);
  }

  // 이동 처리
  private handleMovement(): void {
    const locations = [
      { name: 'corridor_A', type: 'Hallway' },
      { name: 'room_03', type: 'Security Office' },
      { name: 'room_07', type: 'Armory' },
      { name: 'room_12', type: 'Server Room' },
      { name: 'ventilation_shaft', type: 'Vent' },
      { name: 'stairwell_B', type: 'Stairs' }
    ];

    const location = locations[Math.floor(Math.random() * locations.length)];
    this.logGenerator.addLog(
      LogType.MOVEMENT,
      `>> Reached: ${location.name} (${location.type})`,
      LogSeverity.INFO,
      { location: location.name }
    );

    this.raidState.currentLocation = location.name;
  }

  // 전투 처리
  private handleCombat(): void {
    const enemies = ['Scavenger', 'Raider', 'Guard', 'Elite Soldier'];
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];

    this.logGenerator.addLog(
      LogType.COMBAT,
      `⚠ CONTACT: Hostile detected`,
      LogSeverity.WARNING
    );

    this.logGenerator.addLog(
      LogType.COMBAT,
      `⚔ Combat initiated - Enemy: ${enemy}`,
      LogSeverity.DANGER,
      { enemy }
    );

    // 전투 시뮬레이션 (3-8초 소요)
    const combatDuration = this.random(3, 8);
    const playerWins = Math.random() < 0.75; // 75% 승률

    if (playerWins) {
      const damage = this.random(15, 40);
      this.raidState.hp -= damage;

      this.logGenerator.addLog(
        LogType.COMBAT,
        `💥 HIT: Enemy -${this.random(30, 80)} HP`,
        LogSeverity.SUCCESS
      );

      if (damage > 0) {
        this.logGenerator.addLog(
          LogType.COMBAT,
          `🩹 DAMAGE TAKEN: -${damage} HP`,
          damage > 30 ? LogSeverity.DANGER : LogSeverity.WARNING,
          { damage }
        );
      }

      this.logGenerator.addLog(
        LogType.COMBAT,
        `✅ VICTORY: Enemy eliminated`,
        LogSeverity.SUCCESS
      );

      // 전투 후 루팅
      setTimeout(() => this.handleLoot(), 2000);

    } else {
      const damage = this.random(40, 70);
      this.raidState.hp -= damage;

      this.logGenerator.addLog(
        LogType.COMBAT,
        `🩹 HEAVY DAMAGE: -${damage} HP`,
        LogSeverity.DANGER,
        { damage }
      );

      this.logGenerator.addLog(
        LogType.COMBAT,
        `❌ DEFEAT: Retreating from combat`,
        LogSeverity.DANGER
      );
    }

    // HP 체크
    this.checkHealthStatus();
  }

  // 루팅 처리
  private handleLoot(): void {
    const containers = [
      'weapon_crate_03',
      'medical_cabinet',
      'ammo_box_12',
      'safe_deposit',
      'rare_loot_box'
    ];

    const container = containers[Math.floor(Math.random() * containers.length)];

    this.logGenerator.addLog(
      LogType.LOOT,
      `🔍 Searching: ${container}`,
      LogSeverity.INFO
    );

    // 아이템 생성 (1-3개)
    const itemCount = this.random(1, 3);
    const items = this.generateRandomItems(itemCount);

    const isRare = items.some(item => item.includes('Epic') || item.includes('Legendary'));

    this.logGenerator.addLog(
      LogType.LOOT,
      `${isRare ? '🌟 RARE FIND' : '📦 Found'}: ${items.map(i => `[${i}]`).join(' ')}`,
      isRare ? LogSeverity.CRITICAL : LogSeverity.SUCCESS,
      { items }
    );

    // 인벤토리 업데이트
    const weight = this.random(0.5, 3.0);
    this.raidState.inventoryWeight += weight;

    if (this.raidState.inventoryWeight >= this.raidState.maxWeight) {
      this.logGenerator.addLog(
        LogType.LOOT,
        `❌ Inventory full - Cannot pick up items`,
        LogSeverity.WARNING
      );
    } else {
      this.logGenerator.addLog(
        LogType.LOOT,
        `✅ Added to inventory (${this.raidState.inventoryWeight.toFixed(1)}kg / ${this.raidState.maxWeight}kg)`,
        LogSeverity.INFO
      );
    }
  }

  // 상태 체크
  private checkHealthStatus(): void {
    const hpPercent = (this.raidState.hp / this.raidState.maxHp) * 100;

    if (hpPercent <= 20) {
      this.logGenerator.addLog(
        LogType.STATUS,
        `⚠ HP CRITICAL: ${Math.round(hpPercent)}% remaining`,
        LogSeverity.CRITICAL
      );
      this.initiateEmergencyExtraction();
    } else if (hpPercent <= 50) {
      this.logGenerator.addLog(
        LogType.STATUS,
        `⚠ HP LOW: ${Math.round(hpPercent)}% remaining`,
        LogSeverity.WARNING
      );
    }
  }

  // 긴급 귀환
  private initiateEmergencyExtraction(): void {
    this.logGenerator.addLog(
      LogType.EXTRACTION,
      `⚠ EMERGENCY: Initiating early extraction`,
      LogSeverity.DANGER
    );

    this.logGenerator.addLog(
      LogType.EXTRACTION,
      `🚨 Reason: HP Critical (${Math.round((this.raidState.hp / this.raidState.maxHp) * 100)}%)`,
      LogSeverity.DANGER
    );

    // 귀환 성공 확률 70%
    const success = Math.random() < 0.7;

    if (success) {
      this.logGenerator.addLog(
        LogType.EXTRACTION,
        `✅ EXTRACTION SUCCESSFUL`,
        LogSeverity.SUCCESS
      );
    } else {
      this.logGenerator.addLog(
        LogType.EXTRACTION,
        `💀 EXTRACTION FAILED: KIA`,
        LogSeverity.CRITICAL
      );
    }
  }

  // 유틸리티
  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateRandomItems(count: number): string[] {
    const items = [
      'ammo_762.dat',
      'medkit_basic.dll',
      'food_ration.tmp',
      'scope_4x.dll',
      'vest_lv3.dat',
      'loot_bitcoin.dat',
      'keycard_red.key'
    ];

    return Array.from({ length: count }, () =>
      items[Math.floor(Math.random() * items.length)]
    );
  }
}
```

### 4. React 컴포넌트 예시

```tsx
import React, { useEffect, useRef, useState } from 'react';

interface ActivityLogProps {
  logs: ActivityLog[];
  autoScroll?: boolean;
  filter?: LogType;
}

const ActivityLogComponent: React.FC<ActivityLogProps> = ({
  logs,
  autoScroll = true,
  filter
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>(logs);

  // 자동 스크롤
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // 필터 적용
  useEffect(() => {
    if (filter) {
      setFilteredLogs(logs.filter(log => log.type === filter));
    } else {
      setFilteredLogs(logs);
    }
  }, [logs, filter]);

  // 색상 매핑
  const getSeverityColor = (severity: LogSeverity): string => {
    const colors = {
      info: '#00ff00',
      success: '#00ffff',
      warning: '#ffff00',
      danger: '#ff6600',
      critical: '#ff0000'
    };
    return colors[severity] || '#00ff00';
  };

  // 타임스탬프 포맷
  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="activity-log-container">
      <div className="log-header">
        <span>─ Activity Log ─────────────────────────</span>
      </div>

      <div
        ref={logContainerRef}
        className="log-content"
        style={{
          backgroundColor: '#0a0a0a',
          color: '#00ff00',
          fontFamily: 'Consolas, "Courier New", monospace',
          fontSize: '12px',
          padding: '10px',
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #333'
        }}
      >
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className="log-entry"
            style={{
              color: getSeverityColor(log.severity),
              marginBottom: '2px',
              whiteSpace: 'pre-wrap'
            }}
          >
            <span style={{ color: '#808080' }}>
              [{formatTimestamp(log.timestamp)}]
            </span>
            {' '}
            <span>{log.icon}</span>
            {' '}
            <span>{log.message}</span>
          </div>
        ))}
      </div>

      <div className="log-footer">
        <span>Auto-scroll: {autoScroll ? 'ON' : 'OFF'}</span>
        <span>Filter: {filter || 'ALL'}</span>
        <span>Total: {filteredLogs.length} entries</span>
      </div>
    </div>
  );
};

export default ActivityLogComponent;
```

---

## 📊 이벤트 발생 빈도

### 20분 원정
- 이동: 4-6회
- 전투: 2-4회
- 루팅: 5-8회
- 소모품 사용: 3-5회
- 상태 변화: 1-3회

### 30분 원정
- 이동: 6-9회
- 전투: 4-6회
- 루팅: 8-12회
- 소모품 사용: 5-8회
- 상태 변화: 3-6회

### 40분 원정
- 이동: 8-12회
- 전투: 6-10회
- 루팅: 12-18회
- 소모품 사용: 8-12회
- 상태 변화: 5-10회

---

## 🎮 사용자 인터랙션

### 로그 제어 옵션

1. **자동 스크롤**: 최신 로그 자동 표시 (ON/OFF)
2. **필터링**: 특정 타입만 표시
   - 전체 (ALL)
   - 전투만 (COMBAT)
   - 루팅만 (LOOT)
   - 위험만 (DANGER + CRITICAL)
3. **로그 내보내기**: 텍스트 파일로 저장
4. **로그 일시정지**: 스크롤하여 과거 로그 확인

### 알림 설정

- **중요 이벤트 알림**: 치명적 상태 시 사운드 알림
  - HP Critical (20% 이하)
  - 전투 발생
  - 희귀 아이템 발견
  - 귀환 시작/실패

---

## 🔊 사운드 효과

### 이벤트별 사운드

- **전투 발생**: 경고음 (beep-beep)
- **데미지 입음**: 타격음 (thud)
- **승리**: 긍정적 효과음 (ding)
- **루팅**: 아이템 획득음 (click)
- **희귀 아이템**: 특별 효과음 (chime)
- **HP Critical**: 반복 경고음 (alarm)
- **귀환 성공**: 성공 팡파레 (fanfare)
- **사망**: 실패 효과음 (game-over)

### 사운드 설정

- 마스터 볼륨 조절
- 개별 카테고리 음소거
- 중요 알림만 활성화 옵션

---

## 📈 향후 확장

1. **상세 로그 모드**: 데미지 계산, 명중률 등 세부 정보 표시
2. **로그 재생**: 과거 원정 로그 다시 보기
3. **통계 분석**: 로그 데이터 기반 통계 (평균 생존 시간, 킬 수 등)
4. **로그 공유**: 원정 기록을 다른 플레이어와 공유
5. **커스텀 필터**: 사용자 정의 필터링 규칙
6. **로그 검색**: 특정 키워드로 로그 검색

---

## 🛠️ 개발 체크리스트

### Phase 1: 기본 구현
- [ ] ActivityLog 데이터 구조 정의
- [ ] ActivityLogGenerator 클래스 구현
- [ ] React 로그 컴포넌트 생성
- [ ] 기본 이벤트 타입 구현 (이동, 전투, 루팅)

### Phase 2: 시뮬레이션
- [ ] RaidSimulator 엔진 구현
- [ ] 이벤트 스케줄링 로직
- [ ] 전투 시뮬레이션
- [ ] 루팅 시스템 연동

### Phase 3: UI/UX 개선
- [ ] 색상 코딩 적용
- [ ] 자동 스크롤 구현
- [ ] 필터링 기능
- [ ] 로그 내보내기

### Phase 4: 사운드 & 알림
- [ ] 사운드 효과 추가
- [ ] 중요 이벤트 알림
- [ ] 알림 설정 UI

---

**문서 버전**: 1.0
**최종 수정**: 2025-10-15
**작성자**: Game Design Team
