import { GAME_CONSTANTS } from './constants';
import type { Enemy, GameState, UpgradeType } from '@/types/game.types';

// 적 생성
export function createEnemy(playerLevel: number): Enemy {
  const level = playerLevel;
  const maxHealth = Math.floor(
    GAME_CONSTANTS.ENEMY_BASE_HEALTH * Math.pow(GAME_CONSTANTS.ENEMY_HEALTH_SCALING, level - 1)
  );
  const goldReward = Math.floor(
    GAME_CONSTANTS.ENEMY_GOLD_REWARD * Math.pow(GAME_CONSTANTS.ENEMY_GOLD_SCALING, level - 1)
  );
  const expReward = Math.floor(
    GAME_CONSTANTS.ENEMY_EXP_REWARD * Math.pow(GAME_CONSTANTS.ENEMY_EXP_SCALING, level - 1)
  );

  return {
    currentHealth: maxHealth,
    maxHealth,
    level,
    goldReward,
    expReward,
  };
}

// 크리티컬 판정
export function isCriticalHit(criticalChance: number): boolean {
  return Math.random() * 100 < criticalChance;
}

// 데미지 계산 (크리티컬 포함)
export function calculateDamage(
  baseDamage: number,
  criticalChance: number,
  criticalMultiplier: number
): { damage: number; isCritical: boolean } {
  const isCritical = isCriticalHit(criticalChance);
  const damage = isCritical ? baseDamage * criticalMultiplier : baseDamage;

  return { damage: Math.floor(damage), isCritical };
}

// 업그레이드 비용 계산
export function calculateUpgradeCost(upgradeType: UpgradeType, currentLevel: number): number {
  const config = GAME_CONSTANTS.UPGRADE_COSTS[upgradeType];
  return Math.floor(config.base * Math.pow(config.multiplier, currentLevel));
}

// 레벨업에 필요한 경험치 계산
export function calculateExpToNextLevel(level: number): number {
  return Math.floor(
    GAME_CONSTANTS.BASE_EXP_TO_LEVEL * Math.pow(GAME_CONSTANTS.EXP_SCALING, level - 1)
  );
}

// 경험치 획득 및 레벨업 체크
export function addExperience(
  currentExp: number,
  currentLevel: number,
  expToAdd: number
): { newExp: number; newLevel: number; leveledUp: boolean } {
  let newExp = currentExp + expToAdd;
  let newLevel = currentLevel;
  let leveledUp = false;

  while (newExp >= calculateExpToNextLevel(newLevel)) {
    newExp -= calculateExpToNextLevel(newLevel);
    newLevel++;
    leveledUp = true;
  }

  return { newExp, newLevel, leveledUp };
}

// 초기 게임 상태 생성
export function createInitialGameState(): GameState {
  return {
    clickDamage: GAME_CONSTANTS.INITIAL_CLICK_DAMAGE,
    autoAttackDPS: GAME_CONSTANTS.INITIAL_AUTO_ATTACK_DPS,
    criticalChance: GAME_CONSTANTS.INITIAL_CRITICAL_CHANCE,
    criticalMultiplier: GAME_CONSTANTS.INITIAL_CRITICAL_MULTIPLIER,

    gold: GAME_CONSTANTS.INITIAL_GOLD,
    level: GAME_CONSTANTS.INITIAL_LEVEL,
    exp: GAME_CONSTANTS.INITIAL_EXP,
    expToNextLevel: calculateExpToNextLevel(GAME_CONSTANTS.INITIAL_LEVEL),

    enemy: createEnemy(GAME_CONSTANTS.INITIAL_LEVEL),

    upgrades: {
      clickDamageLevel: 0,
      autoAttackLevel: 0,
      criticalChanceLevel: 0,
      goldMultiplierLevel: 0,
    },

    stats: {
      totalClicks: 0,
      totalDamage: 0,
      enemiesDefeated: 0,
      criticalHits: 0,
      totalGoldEarned: 0,
      playtime: 0,
    },
  };
}

// 업그레이드 적용
export function applyUpgrade(state: GameState, upgradeType: UpgradeType): GameState {
  const cost = calculateUpgradeCost(upgradeType, state.upgrades[`${upgradeType}Level`]);

  if (state.gold < cost) {
    return state; // 골드 부족
  }

  const newState = {
    ...state,
    upgrades: { ...state.upgrades },
    stats: { ...state.stats },
    enemy: { ...state.enemy },
  };
  newState.gold -= cost;

  switch (upgradeType) {
    case 'clickDamage':
      newState.clickDamage += GAME_CONSTANTS.UPGRADE_EFFECTS.clickDamageIncrease;
      newState.upgrades.clickDamageLevel++;
      break;
    case 'autoAttack':
      newState.autoAttackDPS += GAME_CONSTANTS.UPGRADE_EFFECTS.autoAttackIncrease;
      newState.upgrades.autoAttackLevel++;
      break;
    case 'criticalChance':
      newState.criticalChance = Math.min(
        100,
        newState.criticalChance + GAME_CONSTANTS.UPGRADE_EFFECTS.criticalChanceIncrease
      );
      newState.upgrades.criticalChanceLevel++;
      break;
    case 'goldMultiplier':
      newState.upgrades.goldMultiplierLevel++;
      break;
  }

  return newState;
}

// 골드 배율 계산
export function getGoldMultiplier(goldMultiplierLevel: number): number {
  return 1 + goldMultiplierLevel * GAME_CONSTANTS.UPGRADE_EFFECTS.goldMultiplierIncrease;
}
