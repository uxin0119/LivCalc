# 인벤토리 시스템 설계

## 📋 개요

게임에는 두 가지 인벤토리 시스템이 존재:
1. **병사 인벤토리**: 원정 중 휴대 가능한 장비 (무게 제한)
2. **보관함 인벤토리**: 영구 보관 공간 (무게 기반 크기 제한)

---

## 🎒 병사 인벤토리 (Soldier Inventory)

### 무게 기반 시스템

병사가 원정 중 휴대할 수 있는 총 무게 제한.

#### 기본 운반 용량
```
기본 운반 무게: 25kg
```

#### 운반 용량 증가 방법
1. **배낭 착용**:
   - Small Pack: +6kg (총 31kg)
   - Medium Pack: +12kg (총 37kg)
   - Large Pack: +20kg (총 45kg)
   - Military Pack: +30kg (총 55kg)

2. **병사 레벨업**:
   - 레벨 5당 +2kg
   - 최대 레벨 50: +20kg

3. **스킬/퍼크**:
   - "Strong Back" 퍼크: +10kg
   - "Pack Mule" 퍼크: +15kg

#### 최대 이론 운반 용량
```
기본 25kg
+ Military Pack 30kg
+ 레벨 보너스 20kg
+ 퍼크 15kg
= 90kg
```

#### 무게 초과 페널티
```
운반 무게 / 최대 무게 비율에 따른 효과:

0-80%:   정상
81-100%: 스태미나 소모 +20%
101-120%: 스태미나 소모 +50%, 이동속도 -30%
121%+:   과적재 불가 (더 이상 아이템 획득 불가)
```

### 장비 슬롯 시스템

병사의 장비는 슬롯에 장착되며, 무게에 포함됨.

```
┌─ Soldier Loadout ─────────────────────────┐
│                                            │
│ [Helmet Slot]      helmet_lv3.dat  1.8kg  │
│ [Body Armor Slot]  vest_lv3.dat    8.0kg  │
│ [Backpack Slot]    pack_20slot.dat 1.5kg  │
│                                            │
│ [Primary Weapon]   ak47_762.exe    3.5kg  │
│ [Secondary Weapon] glock17_9mm.exe 0.9kg  │
│ [Melee Weapon]     knife_tac.exe   0.4kg  │
│                                            │
│ ┌─ Consumables ─────────────────────────┐ │
│ │ medkit_basic.dll    x2      0.8kg     │ │
│ │ food_mre.tmp        x3      1.2kg     │ │
│ │ ammo_762_60rnd.dat  x4      2.0kg     │ │
│ └───────────────────────────────────────┘ │
│                                            │
│ ┌─ Loot Inventory (획득 아이템) ────────┐ │
│ │ scope_4x.dll               0.3kg      │ │
│ │ loot_bitcoin.dat           0.1kg      │ │
│ │ armor_vest_medium.dat      5.0kg      │ │
│ └───────────────────────────────────────┘ │
│                                            │
│ Total Weight: 25.5kg / 45kg (56%)         │
│ Status: ✓ Normal                          │
└────────────────────────────────────────────┘
```

---

## 🏪 보관함 인벤토리 (Stash Inventory)

### 무게 기반 크기 시스템

보관함은 영구 저장 공간으로, 원정에서 돌아온 아이템을 보관.

#### 기본 보관함 용량
```
기본 크기: 100kg
```

#### 보관함 확장 방법

1. **업그레이드 구매**:
   - Level 1 (기본): 100kg
   - Level 2: 200kg (비용: 10,000₵)
   - Level 3: 350kg (비용: 25,000₵)
   - Level 4: 550kg (비용: 50,000₵)
   - Level 5: 800kg (비용: 100,000₵)

2. **특별 아이템**:
   - "Storage Container": +50kg (희귀 드롭)
   - "Warehouse Key": +100kg (레전더리 퀘스트 보상)

#### 최대 보관함 용량
```
800kg + 추가 아이템 보너스 = 최대 ~1,000kg
```

### 보관함 UI 컨셉

```
┌─ Storage Management System ───────────────────────────┐
│                                                        │
│ Storage Capacity: 234.7kg / 350kg (Level 3)           │
│ [████████████░░░░░░] 67% Used                         │
│                                                        │
│ ┌─ Weapons (45.2kg) ──────────────────────────────┐  │
│ │ ak47_762.exe           3.5kg   [Equip] [Sell]   │  │
│ │ m4a1_556.exe           3.2kg   [Equip] [Sell]   │  │
│ │ shotgun_saiga.exe      4.8kg   [Equip] [Sell]   │  │
│ │ ...                                              │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Armor (67.8kg) ────────────────────────────────┐  │
│ │ helmet_lv3.dat         1.8kg   [Equip] [Sell]   │  │
│ │ vest_lv4.dat          12.0kg   [Equip] [Sell]   │  │
│ │ vest_lv2.dat (65%)     5.0kg   [Repair] [Sell]  │  │
│ │ ...                                              │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Consumables (28.5kg) ──────────────────────────┐  │
│ │ medkit_basic.dll   x12    4.8kg   [Use] [Sell]  │  │
│ │ food_mre.tmp       x24    9.6kg   [Use] [Sell]  │  │
│ │ ammo_762_60rnd.dat x18    9.0kg   [Use] [Sell]  │  │
│ │ ...                                              │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ ┌─ Loot Items (93.2kg) ───────────────────────────┐  │
│ │ loot_bitcoin.dat   x8     0.8kg   [Sell 9,600₵] │  │
│ │ loot_goldbar.dat   x3    15.0kg   [Sell 8,400₵] │  │
│ │ loot_artifact.dat  x1     2.5kg   [Sell 8,500₵] │  │
│ │ ...                                              │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ [Upgrade Storage: Level 4 - 50,000₵]                  │
│ [Sort: Weight] [Sort: Value] [Filter: Category]       │
└────────────────────────────────────────────────────────┘
```

---

## ⚖️ 아이템 무게 체계

### 무기 무게

| 카테고리 | 아이템 | 무게 |
|---------|--------|------|
| 권총 | Glock 17 | 0.9kg |
| 권총 | M1911 | 1.1kg |
| 권총 | Desert Eagle | 1.8kg |
| 소총 | AK-47 | 3.5kg |
| 소총 | M4A1 | 3.2kg |
| 소총 | SCAR-H | 3.8kg |
| 소총 | HK416 | 3.4kg |
| SMG | MP5 | 2.5kg |
| SMG | Kriss Vector | 2.8kg |
| SMG | MP7 | 2.1kg |
| 샷건 | Remington 870 | 3.6kg |
| 샷건 | Saiga-12 | 4.8kg |

### 방어구 무게

| 카테고리 | 아이템 | 무게 |
|---------|--------|------|
| 헬멧 | Basic Helmet | 1.2kg |
| 헬멧 | Kevlar Helmet | 1.5kg |
| 헬멧 | Tactical Helmet | 1.8kg |
| 헬멧 | Heavy Helmet | 2.5kg |
| 조끼 | Light Vest | 3.0kg |
| 조끼 | Medium Vest | 5.0kg |
| 조끼 | Plate Carrier | 8.0kg |
| 조끼 | Heavy Armor | 12.0kg |
| 조끼 | Exo Suit | 15.0kg |
| 배낭 | Small Pack | 0.5kg |
| 배낭 | Medium Pack | 1.0kg |
| 배낭 | Large Pack | 1.5kg |
| 배낭 | Military Pack | 2.0kg |

### 소모품 무게

| 카테고리 | 아이템 | 단위 무게 |
|---------|--------|----------|
| 의료품 | Basic Medkit | 0.4kg |
| 의료품 | Advanced Medkit | 0.5kg |
| 의료품 | Military Medkit | 0.6kg |
| 의료품 | Surgery Kit | 0.8kg |
| 의료품 | Stimpack | 0.1kg |
| 의료품 | Painkillers | 0.05kg |
| 식량 | MRE Ration | 0.4kg |
| 식량 | Energy Bar | 0.1kg |
| 식량 | Water Bottle | 0.5kg |
| 식량 | Tactical Meal | 0.6kg |
| 탄약 | 9mm Box (50발) | 0.6kg |
| 탄약 | .45 ACP Box (50발) | 0.7kg |
| 탄약 | 5.56mm Box (60발) | 0.8kg |
| 탄약 | 7.62mm Box (60발) | 1.0kg |
| 탄약 | .50 AE Box (30발) | 0.9kg |
| 탄약 | 12 Gauge Box (25발) | 0.8kg |

### 부착물 무게

| 카테고리 | 아이템 | 무게 |
|---------|--------|------|
| 조준경 | Red Dot Sight | 0.2kg |
| 조준경 | Holographic Sight | 0.3kg |
| 조준경 | 2x Scope | 0.3kg |
| 조준경 | 4x Scope | 0.4kg |
| 조준경 | Thermal Scope | 0.8kg |
| 총구 | Suppressor | 0.4kg |
| 총구 | Compensator | 0.2kg |
| 총구 | Muzzle Brake | 0.2kg |
| 기타 | Vertical Grip | 0.1kg |
| 기타 | Angled Grip | 0.1kg |
| 기타 | Laser Sight | 0.1kg |
| 기타 | Flashlight | 0.2kg |

### 특수 아이템 무게

| 카테고리 | 아이템 | 무게 |
|---------|--------|------|
| 수리 | Basic Repair Kit | 0.8kg |
| 수리 | Advanced Repair Kit | 1.2kg |
| 수리 | Full Repair Kit | 1.5kg |
| 유틸리티 | Frag Grenade | 0.4kg |
| 유틸리티 | Flashbang | 0.3kg |
| 유틸리티 | Smoke Grenade | 0.3kg |
| 유틸리티 | Lockpick Set | 0.2kg |
| 유틸리티 | Keycard (Blue/Red) | 0.01kg |

### 전리품 아이템 무게

| 아이템 | 무게 | 가치/무게 비율 |
|--------|------|---------------|
| Dog Tag | 0.02kg | 9,000₵/kg |
| Intelligence Folder | 0.3kg | 1,400₵/kg |
| Bitcoin | 0.1kg | 12,000₵/kg ⭐ |
| Gold Bar | 5.0kg | 560₵/kg |
| Ancient Artifact | 2.5kg | 3,400₵/kg |
| USB Drive | 0.05kg | 7,000₵/kg |
| CPU Chip | 0.15kg | 6,333₵/kg |
| Military Battery | 1.2kg | 233₵/kg |
| Rare Optics | 0.8kg | 2,312₵/kg |
| Secure Container | 3.5kg | 428₵/kg |

**가성비 최고**: Bitcoin (12,000₵/kg)
**무거운 저가**: Gold Bar (560₵/kg) - 가치는 높지만 무거움

---

## 🎮 게임플레이 전략

### 루팅 전략

#### 1. 효율성 우선 (가치/무게 비율)
```
1순위: Bitcoin, CPU Chip, USB Drive
2순위: Dog Tag, Artifact, Intelligence
3순위: Rare Optics, Secure Container
회피: Gold Bar (가치는 높지만 너무 무거움)
```

#### 2. 무게 관리
```
원정 초반:
- 가벼운 소모품 위주 (Medkit, Food)
- 탄약은 필요한 만큼만

원정 중반:
- 고가치 경량 아이템 우선 획득
- 무기/방어구는 현재보다 좋을 때만

원정 후반:
- 인벤토리 80% 도달 시 귀환 고려
- 과적재 리스크 vs 추가 보상 판단
```

#### 3. 배낭 선택
```
20분 짧은 원정:
- Medium Pack (37kg) 권장
- 비용 대비 효율적

30분 중간 원정:
- Large Pack (45kg) 권장
- 충분한 전리품 공간

40분 긴 원정:
- Military Pack (55kg) 필수
- 최대한 많은 전리품 확보
```

---

## 🔧 기술 구현

### 무게 계산 시스템

```javascript
// 병사 현재 무게 계산
function calculateSoldierWeight(soldier) {
  let totalWeight = 0;

  // 착용 장비
  totalWeight += soldier.helmet?.weight || 0;
  totalWeight += soldier.armor?.weight || 0;
  totalWeight += soldier.backpack?.weight || 0;
  totalWeight += soldier.primaryWeapon?.weight || 0;
  totalWeight += soldier.secondaryWeapon?.weight || 0;

  // 소모품
  soldier.consumables.forEach(item => {
    totalWeight += item.weight * item.quantity;
  });

  // 획득 아이템
  soldier.lootInventory.forEach(item => {
    totalWeight += item.weight * item.quantity;
  });

  return totalWeight;
}

// 최대 운반 무게 계산
function calculateMaxCarryWeight(soldier) {
  let maxWeight = 25; // 기본

  // 배낭 보너스
  if (soldier.backpack) {
    maxWeight += soldier.backpack.carryBonus;
  }

  // 레벨 보너스 (레벨 5당 +2kg)
  maxWeight += Math.floor(soldier.level / 5) * 2;

  // 퍼크 보너스
  if (soldier.perks.includes('strong_back')) {
    maxWeight += 10;
  }
  if (soldier.perks.includes('pack_mule')) {
    maxWeight += 15;
  }

  return maxWeight;
}

// 과적재 상태 확인
function getEncumbranceStatus(currentWeight, maxWeight) {
  const ratio = currentWeight / maxWeight;

  if (ratio <= 0.80) {
    return { status: 'normal', penalty: 0 };
  } else if (ratio <= 1.00) {
    return { status: 'encumbered', staminaPenalty: 0.2 };
  } else if (ratio <= 1.20) {
    return {
      status: 'overloaded',
      staminaPenalty: 0.5,
      speedPenalty: 0.3
    };
  } else {
    return { status: 'cannot_carry', blocked: true };
  }
}
```

### 보관함 용량 계산

```javascript
// 보관함 현재 사용량
function calculateStashWeight(stash) {
  let totalWeight = 0;

  stash.items.forEach(item => {
    totalWeight += item.weight * item.quantity;
  });

  return totalWeight;
}

// 보관함 최대 용량
function getStashCapacity(stashLevel, bonusItems) {
  const baseCapacity = {
    1: 100,
    2: 200,
    3: 350,
    4: 550,
    5: 800
  };

  let capacity = baseCapacity[stashLevel] || 100;

  // 특별 아이템 보너스
  bonusItems.forEach(bonus => {
    capacity += bonus.capacity;
  });

  return capacity;
}

// 아이템 추가 가능 여부
function canAddToStash(stash, item, quantity) {
  const currentWeight = calculateStashWeight(stash);
  const maxWeight = getStashCapacity(stash.level, stash.bonusItems);
  const itemWeight = item.weight * quantity;

  return (currentWeight + itemWeight) <= maxWeight;
}
```

---

## 📊 밸런스 시나리오

### 시나리오 1: 초보 장비 20분 원정

```
장비 무게:
- Glock 17: 0.9kg
- Basic Helmet: 1.2kg
- Light Vest: 3.0kg
- Medium Pack: 1.0kg
- Medkit x2: 0.8kg
- Food x3: 1.2kg
- 9mm Ammo x2: 1.2kg
---
출발 무게: 9.3kg / 37kg (25%)

예상 전리품:
- Bitcoin x2: 0.2kg (2,400₵)
- USB x3: 0.15kg (1,050₵)
- Dog Tag x5: 0.1kg (900₵)
---
귀환 무게: 9.75kg / 37kg (26%)
```

### 시나리오 2: 중급 장비 30분 원정

```
장비 무게:
- AK-47: 3.5kg
- M1911: 1.1kg
- Tactical Helmet: 1.8kg
- Plate Carrier: 8.0kg
- Large Pack: 1.5kg
- Advanced Medkit x3: 1.5kg
- Food x5: 2.0kg
- 7.62 Ammo x4: 4.0kg
---
출발 무게: 23.4kg / 45kg (52%)

예상 전리품:
- Artifact x2: 5.0kg (17,000₵)
- Bitcoin x4: 0.4kg (4,800₵)
- Intel x3: 0.9kg (1,260₵)
- Rare Optics x2: 1.6kg (3,700₵)
---
귀환 무게: 31.3kg / 45kg (69%)
```

### 시나리오 3: 탐욕 플레이 (과적재 리스크)

```
출발 무게: 35kg / 55kg (64%)

전리품 획득 중:
- 45kg (82%) - 정상
- 50kg (91%) - 스태미나 페널티 시작
- 55kg (100%) - 가득 참
- 60kg (109%) - 과적재! 스태미나 -50%, 속도 -30%

선택:
1. 귀환 (안전하지만 기회 손실)
2. 저가치 아이템 버리고 계속
3. 과적재 감수하고 계속 (위험!)
```

---

**문서 버전**: 1.0
**최종 수정**: 2025-10-15
