'use client';

import { useState, useCallback, useEffect } from 'react';
import type { GameState, UpgradeType } from '@/types/game.types';
import {
  createInitialGameState,
  createEnemy,
  calculateDamage,
  addExperience,
  calculateExpToNextLevel,
  applyUpgrade,
  getGoldMultiplier,
} from '@/utils/gameLogic';
import { saveGame, loadGame } from '@/utils/storage';
import { calculateOfflineProgress, type OfflineProgressResult } from '@/utils/offlineProgress';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [offlineProgress, setOfflineProgress] = useState<OfflineProgressResult | null>(null);

  // 초기 로드 및 오프라인 진행 계산
  useEffect(() => {
    const savedGame = loadGame();
    if (savedGame) {
      const currentTime = Date.now();
      const { newState, progress } = calculateOfflineProgress(savedGame, currentTime);

      setGameState(newState);

      // 오프라인 진행이 있었다면 표시
      if (progress.timeAwaySeconds > 60) {
        setOfflineProgress(progress);
      }
    }
    setIsLoaded(true);
  }, []);

  // 클릭 공격
  const attack = useCallback(() => {
    setGameState((prev) => {
      const { damage, isCritical } = calculateDamage(
        prev.clickDamage,
        prev.criticalChance,
        prev.criticalMultiplier
      );

      const newHealth = Math.max(0, prev.enemy.currentHealth - damage);
      const enemyDefeated = newHealth === 0;

      const newState = { ...prev };
      newState.enemy = { ...prev.enemy, currentHealth: newHealth };
      newState.stats = {
        ...prev.stats,
        totalClicks: prev.stats.totalClicks + 1,
        totalDamage: prev.stats.totalDamage + damage,
        criticalHits: prev.stats.criticalHits + (isCritical ? 1 : 0),
      };

      // 적 처치
      if (enemyDefeated) {
        const goldMultiplier = getGoldMultiplier(prev.upgrades.goldMultiplierLevel);
        const goldEarned = Math.floor(prev.enemy.goldReward * goldMultiplier);
        const expEarned = prev.enemy.expReward;

        newState.gold += goldEarned;
        newState.stats.totalGoldEarned += goldEarned;
        newState.stats.enemiesDefeated += 1;

        // 경험치 획득 및 레벨업
        const { newExp, newLevel, leveledUp } = addExperience(
          prev.exp,
          prev.level,
          expEarned
        );

        newState.exp = newExp;
        newState.level = newLevel;
        newState.expToNextLevel = calculateExpToNextLevel(newLevel);

        // 새로운 적 생성
        newState.enemy = createEnemy(newLevel);
      }

      return newState;
    });
  }, []);

  // 업그레이드 구매
  const buyUpgrade = useCallback((upgradeType: UpgradeType) => {
    setGameState((prev) => applyUpgrade(prev, upgradeType));
  }, []);

  // 게임 저장
  const save = useCallback(() => {
    const stateToSave = {
      ...gameState,
      lastSaveTime: Date.now(),
    };
    saveGame(stateToSave);
    setGameState(stateToSave);
  }, [gameState]);

  // 게임 리셋
  const reset = useCallback(() => {
    const newState = createInitialGameState();
    setGameState(newState);
    saveGame(newState);
  }, []);

  // 오프라인 진행 메시지 닫기
  const dismissOfflineProgress = useCallback(() => {
    setOfflineProgress(null);
  }, []);

  return {
    gameState,
    isLoaded,
    attack,
    buyUpgrade,
    save,
    reset,
    offlineProgress,
    dismissOfflineProgress,
  };
}
