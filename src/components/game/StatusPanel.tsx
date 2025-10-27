'use client';

import type { GameState } from '@/types/game.types';

interface StatusPanelProps {
  gameState: GameState;
}

export default function StatusPanel({ gameState }: StatusPanelProps) {
  return (
    <div className="bg-white border border-gray-300 p-4">
      <div className="space-y-2 font-mono text-xs">
        {/* 타이틀 */}
        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">
          System Status
        </div>

        {/* 스탯 표시 */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
          <StatusItem label="Level" value={gameState.level} />
          <StatusItem label="Gold" value={Math.floor(gameState.gold)} />
          <StatusItem
            label="Experience"
            value={`${gameState.exp}/${gameState.expToNextLevel}`}
          />
          <StatusItem label="Click DMG" value={gameState.clickDamage} />
          <StatusItem
            label="Auto DPS"
            value={gameState.autoAttackDPS > 0 ? gameState.autoAttackDPS : '-'}
          />
          <StatusItem
            label="Crit Rate"
            value={gameState.criticalChance > 0 ? `${gameState.criticalChance}%` : '-'}
          />
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 pt-2 mt-3">
          <div className="text-gray-400 text-[10px]">
            Target: Level {gameState.enemy.level}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}:</span>
      <span className="text-gray-700 font-semibold">{value}</span>
    </div>
  );
}
