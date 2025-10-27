# 아이템 데이터베이스

## 📋 아이템 등급 시스템

- **Common (회색)**: 기본 장비, 낮은 성능
- **Uncommon (녹색)**: 개선된 장비
- **Rare (파란색)**: 희귀 장비, 좋은 성능
- **Epic (보라색)**: 강력한 장비
- **Legendary (황금색)**: 최고급 장비

---

## 🔫 무기 (Weapons)

### 권총 (Pistols)

| ID | 이름 | 표시명 | 등급 | 가격 | 무게 | 데미지 | 연사속도 | 정확도 | 탄창 | 설명 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `pistol_glock17` | Glock 17 | glock17_9mm.exe | Common | 850₵ | 0.9kg | 25 | 0.15s | 75 | 17 | 가장 기본적인 9mm 권총 |
| `pistol_m1911` | M1911 | m1911_45acp.exe | Uncommon | 1,200₵ | 1.1kg | 35 | 0.20s | 80 | 7 | 강력하지만 느린 .45구경 |
| `pistol_deagle` | Desert Eagle | deagle_50ae.exe | Rare | 2,800₵ | 1.8kg | 55 | 0.30s | 70 | 7 | 핸드캐논급 파워 |

### 소총 (Rifles)

| ID | 이름 | 표시명 | 등급 | 가격 | 무게 | 데미지 | 연사속도 | 정확도 | 탄창 | 설명 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `rifle_ak47` | AK-47 | ak47_762.exe | Uncommon | 3,200₵ | 3.5kg | 40 | 0.10s | 70 | 30 | 신뢰성 높은 자동소총 |
| `rifle_m4a1` | M4A1 | m4a1_556.exe | Rare | 4,500₵ | 3.2kg | 38 | 0.08s | 85 | 30 | 높은 정확도의 소총 |
| `rifle_scar` | SCAR-H | scar_762.exe | Epic | 7,200₵ | 3.8kg | 48 | 0.09s | 88 | 20 | 밸런스 좋은 전투 소총 |
| `rifle_hk416` | HK416 | hk416_556.exe | Epic | 8,500₵ | 3.4kg | 42 | 0.07s | 90 | 30 | 최고급 전술 소총 |

### 기관단총 (SMGs)

| ID | 이름 | 표시명 | 등급 | 가격 | 무게 | 데미지 | 연사속도 | 정확도 | 탄창 | 설명 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `smg_mp5` | MP5 | mp5_9mm.exe | Common | 2,100₵ | 2.5kg | 22 | 0.06s | 75 | 30 | 클래식한 기관단총 |
| `smg_vector` | Kriss Vector | vector_45acp.exe | Rare | 4,800₵ | 2.8kg | 28 | 0.04s | 78 | 25 | 초고속 연사 |
| `smg_mp7` | MP7 | mp7_46mm.exe | Epic | 6,500₵ | 2.1kg | 26 | 0.05s | 82 | 40 | 관통력 높은 SMG |

### 샷건 (Shotguns)

| ID | 이름 | 표시명 | 등급 | 가격 | 무게 | 데미지 | 연사속도 | 정확도 | 탄창 | 설명 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `shotgun_870` | Remington 870 | rem870_12ga.exe | Common | 1,500₵ | 3.6kg | 80 | 1.00s | 45 | 6 | 펌프액션 샷건 |
| `shotgun_saiga` | Saiga-12 | saiga12_12ga.exe | Rare | 5,200₵ | 4.8kg | 70 | 0.40s | 50 | 8 | 반자동 샷건 |

---

## 🛡️ 방어구 (Armor)

### 헬멧 (Helmets)

| ID | 이름 | 표시명 | 등급 | 가격 | 방어력 | 내구도 | 무게 | 설명 |
|---|---|---|---|---|---|---|---|---|
| `helmet_basic` | Basic Helmet | helmet_lv1.dat | Common | 450₵ | 15 | 100 | 1.2kg | 기본 전술 헬멧 |
| `helmet_kevlar` | Kevlar Helmet | helmet_lv2.dat | Uncommon | 1,200₵ | 25 | 150 | 1.5kg | 케블라 강화 헬멧 |
| `helmet_tactical` | Tactical Helmet | helmet_lv3.dat | Rare | 2,800₵ | 40 | 200 | 1.8kg | 나이트비전 장착 가능 |
| `helmet_heavy` | Heavy Helmet | helmet_lv4.dat | Epic | 5,500₵ | 60 | 250 | 2.5kg | 중장갑 전투 헬멧 |

### 방탄복/조끼 (Body Armor)

| ID | 이름 | 표시명 | 등급 | 가격 | 방어력 | 내구도 | 무게 | 설명 |
|---|---|---|---|---|---|---|---|---|
| `armor_vest_light` | Light Vest | vest_lv1.dat | Common | 800₵ | 20 | 120 | 3.0kg | 경량 방탄 조끼 |
| `armor_vest_medium` | Medium Vest | vest_lv2.dat | Uncommon | 2,200₵ | 40 | 180 | 5.0kg | 중형 전술 조끼 |
| `armor_plate_carrier` | Plate Carrier | vest_lv3.dat | Rare | 4,800₵ | 65 | 250 | 8.0kg | 세라믹 플레이트 |
| `armor_heavy` | Heavy Armor | vest_lv4.dat | Epic | 9,500₵ | 95 | 320 | 12.0kg | 중장갑 전투복 |
| `armor_exo` | Exo Suit | vest_lv5.dat | Legendary | 18,000₵ | 130 | 400 | 15.0kg | 실험적 외골격 슈트 |

### 배낭 (Backpacks)

| ID | 이름 | 표시명 | 등급 | 가격 | 운반력 | 무게 | 설명 |
|---|---|---|---|---|---|---|---|
| `backpack_small` | Small Pack | pack_6kg.dat | Common | 300₵ | +6kg | 0.5kg | 소형 배낭 |
| `backpack_medium` | Medium Pack | pack_12kg.dat | Uncommon | 800₵ | +12kg | 1.0kg | 중형 배낭 |
| `backpack_large` | Large Pack | pack_20kg.dat | Rare | 1,800₵ | +20kg | 1.5kg | 대형 전술 배낭 |
| `backpack_military` | Military Pack | pack_30kg.dat | Epic | 3,500₵ | +30kg | 2.0kg | 군용 대형 배낭 |

---

## 💊 소모품 (Consumables)

### 의료품 (Medical)

| ID | 이름 | 표시명 | 등급 | 가격 | 무게 | 효과 | 사용시간 | 설명 |
|---|---|---|---|---|---|---|---|---|---|
| `medkit_basic` | Basic Medkit | medkit_basic.dll | Common | 120₵ | 0.4kg | HP +30 | 5초 | 기본 구급상자 |
| `medkit_advanced` | Advanced Medkit | medkit_adv.dll | Uncommon | 280₵ | 0.5kg | HP +60 | 4초 | 향상된 의료 키트 |
| `medkit_military` | Military Medkit | medkit_mil.dll | Rare | 650₵ | 0.6kg | HP +100 | 3초 | 군용 응급처치 세트 |
| `medkit_surgery` | Surgery Kit | medkit_surgery.dll | Epic | 1,200₵ | 0.8kg | HP +150, 출혈 치료 | 8초 | 수술 키트 |
| `stimpack` | Stimpack | stim_combat.dll | Rare | 800₵ | 0.1kg | HP +40, 스태미나 +50 | 즉시 | 전투 자극제 |
| `painkiller` | Painkillers | painkiller.tmp | Common | 80₵ | 0.05kg | 통증 무시 60초 | 2초 | 진통제 |

### 식량 (Food & Water)

| ID | 이름 | 표시명 | 등급 | 가격 | 무게 | 효과 | 설명 |
|---|---|---|---|---|---|---|---|---|
| `food_ration` | MRE Ration | food_mre.tmp | Common | 50₵ | 0.4kg | 스태미나 +20 | 전투식량 |
| `food_energybar` | Energy Bar | food_energy.tmp | Common | 35₵ | 0.1kg | 스태미나 +15 | 에너지바 |
| `water_bottle` | Water Bottle | water_500ml.tmp | Common | 25₵ | 0.5kg | 스태미나 +10 | 생수 500ml |
| `food_tactical` | Tactical Meal | food_tactical.tmp | Uncommon | 120₵ | 0.6kg | 스태미나 +40 | 고급 전술 식량 |

### 탄약 (Ammunition)

| ID | 이름 | 표시명 | 등급 | 가격 | 무게 | 설명 |
|---|---|---|---|---|---|---|---|
| `ammo_9mm` | 9mm Box | ammo_9mm_50rnd.dat | Common | 45₵ | 0.6kg | 50발들이 9mm |
| `ammo_45acp` | .45 ACP Box | ammo_45acp_50rnd.dat | Common | 60₵ | 0.7kg | 50발들이 .45구경 |
| `ammo_556` | 5.56mm Box | ammo_556_60rnd.dat | Uncommon | 85₵ | 0.8kg | 60발들이 5.56mm |
| `ammo_762` | 7.62mm Box | ammo_762_60rnd.dat | Uncommon | 95₵ | 1.0kg | 60발들이 7.62mm |
| `ammo_50ae` | .50 AE Box | ammo_50ae_30rnd.dat | Rare | 180₵ | 0.9kg | 30발들이 .50구경 |
| `ammo_12ga` | 12 Gauge Box | ammo_12ga_25rnd.dat | Common | 70₵ | 0.8kg | 25발들이 샷건탄 |

---

## 🔧 부착물 (Attachments)

### 조준경 (Sights & Scopes)

| ID | 이름 | 표시명 | 등급 | 가격 | 무게 | 효과 | 설명 |
|---|---|---|---|---|---|---|---|---|
| `sight_reddot` | Red Dot Sight | sight_reddot.dll | Common | 280₵ | 0.2kg | 정확도 +5 | 기본 레드닷 |
| `sight_holo` | Holographic Sight | sight_holo.dll | Uncommon | 550₵ | 0.3kg | 정확도 +8 | 홀로그래픽 조준경 |
| `scope_2x` | 2x Scope | scope_2x.dll | Uncommon | 480₵ | 0.3kg | 정확도 +10 | 2배율 스코프 |
| `scope_4x` | 4x Scope | scope_4x.dll | Rare | 920₵ | 0.4kg | 정확도 +15 | 4배율 저격 스코프 |
| `scope_thermal` | Thermal Scope | scope_thermal.dll | Epic | 3,200₵ | 0.8kg | 정확도 +20, 야간 시야 | 열화상 스코프 |

### 총구 부착물 (Muzzle)

| ID | 이름 | 표시명 | 등급 | 가격 | 무게 | 효과 | 설명 |
|---|---|---|---|---|---|---|---|---|
| `muzzle_suppressor` | Suppressor | suppressor.dll | Rare | 1,500₵ | 0.4kg | 은폐 +30%, 반동 -10% | 소음기 |
| `muzzle_compensator` | Compensator | compensator.dll | Uncommon | 420₵ | 0.2kg | 반동 -20% | 보정기 |
| `muzzle_brake` | Muzzle Brake | muzzle_brake.dll | Common | 280₵ | 0.2kg | 반동 -15% | 총구 제동기 |

### 기타 부착물 (Others)

| ID | 이름 | 표시명 | 등급 | 가격 | 무게 | 효과 | 설명 |
|---|---|---|---|---|---|---|---|---|
| `grip_vertical` | Vertical Grip | grip_vert.dll | Common | 220₵ | 0.1kg | 정확도 +3, 반동 -5% | 수직 손잡이 |
| `grip_angled` | Angled Grip | grip_angled.dll | Uncommon | 350₵ | 0.1kg | 정확도 +5, 반동 -8% | 각진 그립 |
| `laser_sight` | Laser Sight | laser_red.dll | Uncommon | 380₵ | 0.1kg | 정확도 +7 | 레이저 조준기 |
| `flashlight` | Tactical Flashlight | flashlight.dll | Common | 150₵ | 0.2kg | 야간 시야 | 전술 손전등 |

---

## 🎁 특수 아이템 (Special Items)

### 회복 도구 (Recovery)

| ID | 이름 | 표시명 | 등급 | 가격 | 무게 | 효과 | 설명 |
|---|---|---|---|---|---|---|---|---|
| `repair_kit_basic` | Basic Repair Kit | repair_basic.sys | Uncommon | 250₵ | 0.8kg | 내구도 +30% | 기본 수리 키트 |
| `repair_kit_advanced` | Advanced Repair Kit | repair_adv.sys | Rare | 650₵ | 1.2kg | 내구도 +60% | 고급 수리 키트 |
| `repair_kit_full` | Full Repair Kit | repair_full.sys | Epic | 1,500₵ | 1.5kg | 내구도 100% | 완전 수리 키트 |

### 유틸리티 (Utility)

| ID | 이름 | 표시명 | 등급 | 가격 | 무게 | 효과 | 설명 |
|---|---|---|---|---|---|---|---|---|
| `grenade_frag` | Frag Grenade | grenade_frag.exe | Uncommon | 380₵ | 0.4kg | 범위 데미지 120 | 파편 수류탄 |
| `grenade_flash` | Flashbang | grenade_flash.exe | Common | 180₵ | 0.3kg | 적 기절 5초 | 섬광탄 |
| `grenade_smoke` | Smoke Grenade | grenade_smoke.exe | Common | 150₵ | 0.3kg | 은폐 +80% 10초 | 연막탄 |
| `lockpick` | Lockpick Set | lockpick.dll | Rare | 420₵ | 0.2kg | 잠긴 방 개방 | 자물쇠 따기 도구 |
| `keycard_blue` | Blue Keycard | keycard_blue.key | Rare | N/A | 0.01kg | 특정 구역 접근 | 파란색 키카드 |
| `keycard_red` | Red Keycard | keycard_red.key | Epic | N/A | 0.01kg | 고급 구역 접근 | 빨간색 키카드 |

---

## 💎 전리품 전용 아이템 (Loot Only)

던전에서만 획득 가능하며 상점에서 구매 불가. 판매하여 자금 확보에 사용.

| ID | 이름 | 표시명 | 등급 | 무게 | 판매가 | 가치/무게 | 설명 |
|---|---|---|---|---|---|---|---|---|
| `loot_dogtag` | Dog Tag | dogtag_soldier.dat | Common | 0.02kg | 180₵ | 9,000₵/kg | 전사의 인식표 |
| `loot_intel` | Intelligence Folder | intel_docs.pdf | Uncommon | 0.3kg | 420₵ | 1,400₵/kg | 기밀 문서 |
| `loot_bitcoin` | Bitcoin | bitcoin_wallet.dat | Rare | 0.1kg | 1,200₵ | 12,000₵/kg ⭐ | 암호화폐 지갑 |
| `loot_goldbar` | Gold Bar | gold_bar_100g.dat | Epic | 5.0kg | 2,800₵ | 560₵/kg | 100g 금괴 |
| `loot_artifact` | Ancient Artifact | artifact_relic.dat | Legendary | 2.5kg | 8,500₵ | 3,400₵/kg | 고대 유물 |
| `loot_usb` | USB Drive | usb_encrypted.dat | Uncommon | 0.05kg | 350₵ | 7,000₵/kg | 암호화된 USB |
| `loot_processor` | CPU Chip | cpu_military.dat | Rare | 0.15kg | 950₵ | 6,333₵/kg | 군용 프로세서 |
| `loot_battery` | Military Battery | battery_lithium.dat | Uncommon | 1.2kg | 280₵ | 233₵/kg | 고성능 배터리 |
| `loot_optics` | Rare Optics | optics_night.dat | Epic | 0.8kg | 1,850₵ | 2,312₵/kg | 희귀 광학 장비 |
| `loot_container` | Secure Container | container_secure.dat | Rare | 3.5kg | 1,500₵ | 428₵/kg | 보안 컨테이너 |

---

## 📦 시작 장비 세트 (Starting Loadout)

신규 플레이어에게 제공되는 기본 장비:

```
무기:
- pistol_glock17 (Glock 17)
- ammo_9mm x2

방어구:
- helmet_basic (Basic Helmet)
- armor_vest_light (Light Vest)
- backpack_small (Small Pack)

소모품:
- medkit_basic x2
- food_ration x3
- water_bottle x3

자금:
- 5,000₵
```

---

## 📊 아이템 밸런스 요약

### 무기 가격대별 분류
- **입문 (500-1,500₵)**: Glock 17, M1911, Remington 870
- **중급 (2,000-5,000₵)**: AK-47, MP5, Saiga-12
- **고급 (5,000-10,000₵)**: M4A1, SCAR-H, MP7, HK416
- **최고급 (10,000₵+)**: 향후 추가 예정

### 방어구 가격대별 분류
- **입문 (300-1,500₵)**: 기본 헬멧/조끼/배낭
- **중급 (1,500-5,000₵)**: Kevlar 헬멧, Medium Vest, Large Pack
- **고급 (5,000-10,000₵)**: Tactical Helmet, Plate Carrier, Heavy Armor
- **최고급 (10,000₵+)**: Heavy Helmet, Exo Suit

### 소모품 권장 가격 (원정당)
- **20분 원정**: ~300₵ (Medkit x2, Food x3)
- **30분 원정**: ~500₵ (Medkit x3, Food x5, Stim x1)
- **40분 원정**: ~800₵ (Advanced Medkit x3, Food x7, Stim x2)

---

**문서 버전**: 1.0
**총 아이템 수**: 89개
**최종 수정**: 2025-10-15
