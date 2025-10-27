import type { GameState } from '@/types/game.types';
import { createEnemy, addExperience, calculateExpToNextLevel, getGoldMultiplier } from './gameLogic';

export interface OfflineProgressResult {
  goldEarned: number;
  expEarned: number;
  enemiesDefeated: number;
  levelsGained: number;
  timeAwaySeconds: number;
}

const MAX_OFFLINE_TIME = 8 * 60 * 60; // 최대 8시간

export function calculateOfflineProgress(
  gameState: GameState,
  currentTime: number
): { newState: GameState; progress: OfflineProgressResult } {
  const lastSaveTime = gameState.lastSaveTime || currentTime;
  const timeAwayMs = currentTime - lastSaveTime;
  const timeAwaySeconds = Math.min(Math.floor(timeAwayMs / 1000), MAX_OFFLINE_TIME);

  // Auto DPS가 없으면 오프라인 진행 없음
  if (gameState.autoAttackDPS <= 0 || timeAwaySeconds <= 0) {
    return {
      newState: { ...gameState, lastSaveTime: currentTime },
      progress: {
        goldEarned: 0,
        expEarned: 0,
        enemiesDefeated: 0,
        levelsGained: 0,
        timeAwaySeconds: 0,
      },
    };
  }

  // 시뮬레이션 시작
  const simulatedState = { ...gameState };
  let totalGoldEarned = 0;
  let totalExpEarned = 0;
  let totalEnemiesDefeated = 0;
  const startLevel = gameState.level;

  // 초당 데미지 계산
  const damagePerSecond = gameState.autoAttackDPS;
  let remainingTime = timeAwaySeconds;

  while (remainingTime > 0) {
    const currentEnemy = simulatedState.enemy;
    const timeToKillEnemy = Math.ceil(currentEnemy.currentHealth / damagePerSecond);
    const actualTime = Math.min(timeToKillEnemy, remainingTime);

    if (actualTime >= timeToKillEnemy) {
      // 적 처치
      const goldMultiplier = getGoldMultiplier(simulatedState.upgrades.goldMultiplierLevel);
      const goldEarned = Math.floor(currentEnemy.goldReward * goldMultiplier);
      const expEarned = currentEnemy.expReward;

      totalGoldEarned += goldEarned;
      totalExpEarned += expEarned;
      totalEnemiesDefeated++;

      // 경험치 및 레벨업
      const { newExp, newLevel } = addExperience(
        simulatedState.exp,
        simulatedState.level,
        expEarned
      );

      simulatedState.exp = newExp;
      simulatedState.level = newLevel;
      simulatedState.expToNextLevel = calculateExpToNextLevel(newLevel);

      // 새 적 생성
      simulatedState.enemy = createEnemy(newLevel);

      remainingTime -= timeToKillEnemy;
    } else {
      // 시간이 부족해서 적을 완전히 처치하지 못함
      const damageDealt = damagePerSecond * actualTime;
      simulatedState.enemy = {
        ...currentEnemy,
        currentHealth: currentEnemy.currentHealth - damageDealt,
      };
      remainingTime = 0;
    }
  }

  // 최종 상태 업데이트
  const newState: GameState = {
    ...simulatedState,
    gold: simulatedState.gold + totalGoldEarned,
    stats: {
      ...simulatedState.stats,
      totalGoldEarned: simulatedState.stats.totalGoldEarned + totalGoldEarned,
      enemiesDefeated: simulatedState.stats.enemiesDefeated + totalEnemiesDefeated,
      totalDamage: simulatedState.stats.totalDamage + (damagePerSecond * timeAwaySeconds),
    },
    lastSaveTime: currentTime,
  };

  return {
    newState,
    progress: {
      goldEarned: totalGoldEarned,
      expEarned: totalExpEarned,
      enemiesDefeated: totalEnemiesDefeated,
      levelsGained: simulatedState.level - startLevel,
      timeAwaySeconds,
    },
  };
}

export function formatOfflineTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}
