'use client';

import type { GameState, UpgradeType } from '@/types/game.types';
import { calculateUpgradeCost } from '@/utils/gameLogic';

interface UpgradePanelProps {
  gameState: GameState;
  onUpgrade: (type: UpgradeType) => void;
}

export default function UpgradePanel({ gameState, onUpgrade }: UpgradePanelProps) {
  const upgrades: Array<{
    type: UpgradeType;
    label: string;
    currentLevel: number;
    description: string;
  }> = [
    {
      type: 'clickDamage',
      label: 'Process Power',
      currentLevel: gameState.upgrades.clickDamageLevel,
      description: `+1 DMG (Current: ${gameState.clickDamage})`,
    },
    {
      type: 'autoAttack',
      label: 'Auto Process',
      currentLevel: gameState.upgrades.autoAttackLevel,
      description: `+1 DPS (Current: ${gameState.autoAttackDPS})`,
    },
    {
      type: 'criticalChance',
      label: 'Optimization',
      currentLevel: gameState.upgrades.criticalChanceLevel,
      description: `+5% Crit (Current: ${gameState.criticalChance}%)`,
    },
    {
      type: 'goldMultiplier',
      label: 'Efficiency',
      currentLevel: gameState.upgrades.goldMultiplierLevel,
      description: `+10% Gold`,
    },
  ];

  return (
    <div className="bg-white border border-gray-300 p-4">
      <div className="space-y-3 font-mono text-xs">
        {/* 타이틀 */}
        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">
          Configuration
        </div>

        {/* 업그레이드 버튼들 */}
        <div className="space-y-2">
          {upgrades.map((upgrade) => {
            const cost = calculateUpgradeCost(upgrade.type, upgrade.currentLevel);
            const canAfford = gameState.gold >= cost;

            return (
              <button
                key={upgrade.type}
                onClick={() => onUpgrade(upgrade.type)}
                disabled={!canAfford}
                className={`
                  w-full px-3 py-2 border text-left
                  transition-colors duration-100
                  ${
                    canAfford
                      ? 'bg-white border-gray-300 hover:bg-gray-50 active:bg-gray-100 cursor-pointer'
                      : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-gray-700 font-semibold">
                      {upgrade.label}
                      <span className="text-gray-400 ml-1.5 font-normal">
                        Lv.{upgrade.currentLevel}
                      </span>
                    </div>
                    <div className="text-gray-500 text-[10px] mt-0.5">
                      {upgrade.description}
                    </div>
                  </div>
                  <div className={`text-[10px] ml-2 ${canAfford ? 'text-gray-600' : 'text-gray-400'}`}>
                    {cost}g
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
