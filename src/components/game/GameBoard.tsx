'use client';

import { useGameState } from '@/hooks/useGameState';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useAutoAttack } from '@/hooks/useAutoAttack';
import ClickArea from './ClickArea';
import StatusPanel from './StatusPanel';
import UpgradePanel from './UpgradePanel';
import OfflineProgressModal from './OfflineProgressModal';

export default function GameBoard() {
  const {
    gameState,
    isLoaded,
    attack,
    buyUpgrade,
    save,
    reset,
    offlineProgress,
    dismissOfflineProgress,
  } = useGameState();

  // 자동 저장
  useAutoSave(save);

  // 자동 공격
  useAutoAttack(gameState.autoAttackDPS, attack);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 font-mono text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 오프라인 진행 모달 */}
      {offlineProgress && (
        <OfflineProgressModal
          progress={offlineProgress}
          onDismiss={dismissOfflineProgress}
        />
      )}

      <div className="max-w-2xl mx-auto space-y-4">
        {/* 헤더 */}
        <div className="bg-white border border-gray-300 p-3 flex justify-between items-center">
          <div className="font-mono text-sm text-gray-700">System Monitor</div>
          <div className="flex gap-2">
            <button
              onClick={save}
              className="px-3 py-1 text-xs font-mono bg-gray-100 border border-gray-300
                         hover:bg-gray-200 transition-colors"
            >
              Save
            </button>
            <button
              onClick={reset}
              className="px-3 py-1 text-xs font-mono bg-gray-100 border border-gray-300
                         hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* 상태 패널 */}
        <StatusPanel gameState={gameState} />

        {/* 클릭 영역 */}
        <ClickArea
          onClick={attack}
          currentHealth={gameState.enemy.currentHealth}
          maxHealth={gameState.enemy.maxHealth}
        />

        {/* 업그레이드 패널 */}
        <UpgradePanel gameState={gameState} onUpgrade={buyUpgrade} />

        {/* 통계 (숨겨진 정보) */}
        <div className="bg-white border border-gray-300 p-3">
          <details className="font-mono text-xs">
            <summary className="text-gray-500 text-[10px] uppercase tracking-wider cursor-pointer">
              Statistics
            </summary>
            <div className="mt-3 space-y-1 text-gray-600">
              <div>Total Clicks: {gameState.stats.totalClicks}</div>
              <div>Total Damage: {gameState.stats.totalDamage}</div>
              <div>Enemies Defeated: {gameState.stats.enemiesDefeated}</div>
              <div>Critical Hits: {gameState.stats.criticalHits}</div>
              <div>Total Gold: {Math.floor(gameState.stats.totalGoldEarned)}</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
