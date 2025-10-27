'use client';

import { Player, Enemy } from '../types/game';
import { getEnemyNextAction } from '../game-logic/enemies';
import { getEffectiveMaxIntegrity, getEffectiveMaxThreads } from '../game-logic/itemEffects';

interface StatusDisplayProps {
  player: Player;
  enemy: Enemy | null;
  turn: number;
}

export default function StatusDisplay({ player, enemy, turn }: StatusDisplayProps) {
  const getHealthBar = (current: number, max: number, color: string): string => {
    const percentage = Math.max(0, Math.min(100, (current / max) * 100));
    const filled = Math.floor((percentage / 100) * 20);
    const empty = 20 - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${Math.floor(percentage)}%`;
  };

  // 아이템 효과를 고려한 실제 최대값 계산
  const effectiveMaxIntegrity = getEffectiveMaxIntegrity(player);
  const effectiveMaxThreads = getEffectiveMaxThreads(player);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
      {/* Player Status */}
      <div className="bg-black border border-cyan-500/50 rounded-lg p-4 shadow-lg shadow-cyan-500/20">
        <div className="text-cyan-400 text-lg font-bold mb-3 flex items-center gap-2">
          <span className="text-2xl">⚙</span>
          <span>PLAYER SYSTEM</span>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <div className="text-gray-500 text-xs">INTEGRITY:</div>
            <div className="text-cyan-300">
              {getHealthBar(player.integrity, effectiveMaxIntegrity, 'cyan')} {player.integrity}/{effectiveMaxIntegrity}
            </div>
          </div>

          <div>
            <div className="text-gray-500 text-xs">THREADS:</div>
            <div className="text-blue-300">
              {getHealthBar(player.threads, effectiveMaxThreads, 'blue')} {player.threads}/{effectiveMaxThreads}
            </div>
          </div>

          {player.firewall > 0 && (
            <div>
              <div className="text-gray-500 text-xs">FIREWALL:</div>
              <div className="text-green-300 font-bold">
                {player.firewall} DEF
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-cyan-500/30">
            <div className="text-gray-500 text-xs">PROCESSES:</div>
            <div className="text-cyan-400">
              Queue: {player.queue.length} | Library: {player.library.length} | Terminated: {player.terminated.length}
            </div>
          </div>
        </div>
      </div>

      {/* Enemy Status */}
      {enemy && (
        <div className="bg-black border border-red-500/50 rounded-lg p-4 shadow-lg shadow-red-500/20">
          <div className="text-red-400 text-lg font-bold mb-3 flex items-center gap-2">
            <span className="text-2xl">☠</span>
            <span>THREAT DETECTED</span>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-500 text-xs">TARGET:</div>
              <div className="text-red-300 font-bold">{enemy.name}</div>
            </div>

            <div>
              <div className="text-gray-500 text-xs">INTEGRITY:</div>
              <div className="text-red-300">
                {getHealthBar(enemy.integrity, enemy.maxIntegrity, 'red')} {enemy.integrity}/{enemy.maxIntegrity}
              </div>
            </div>

            <div>
              <div className="text-gray-500 text-xs">ATTACK:</div>
              <div className="text-orange-300">{enemy.attack} DMG</div>
            </div>

            {/* 적의 다음 행동 표시 */}
            <div className="pt-2 border-t border-yellow-500/30">
              <div className="text-yellow-500 text-xs font-bold mb-1">⚠️ NEXT ACTION:</div>
              <div className="text-yellow-300 text-xs font-mono">
                {getEnemyNextAction(enemy, turn).description}
              </div>
            </div>

            <div className="pt-2 border-t border-red-500/30">
              <div className="text-gray-500 text-xs">INFO:</div>
              <div className="text-gray-400 text-xs">{enemy.description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Turn Counter - Full width on mobile, spanning both columns on desktop */}
      <div className="md:col-span-2 bg-black border border-green-500/50 rounded-lg p-3 shadow-lg shadow-green-500/20">
        <div className="flex items-center justify-between font-mono">
          <div className="text-green-400">
            <span className="text-gray-500">TURN:</span> <span className="font-bold text-lg">{turn}</span>
          </div>
          <div className="text-gray-500 text-sm">
            [SYSTEM_STATUS: OPERATIONAL]
          </div>
        </div>
      </div>
    </div>
  );
}
