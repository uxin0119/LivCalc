// 전투 노드 핸들러

import { GameState, LogEntry, Process, Enemy, Player, Consumable } from '../types/game';
import { createLog } from '../game-logic/combat';

// 소모품 사용 결과
export interface ConsumableUseResult {
  newPlayer: Player;
  newEnemy: Enemy | null;
  combatEnded: boolean;
  victory: boolean;
  logs: LogEntry[];
}

// 소모품 사용
export function useConsumable(
  gameState: GameState,
  consumableIndex: number
): ConsumableUseResult {
  const logs: LogEntry[] = [];

  if (!gameState.currentEnemy) {
    return {
      newPlayer: gameState.player,
      newEnemy: null,
      combatEnded: false,
      victory: false,
      logs: [createLog('error', '[ERROR] No enemy in combat.')]
    };
  }

  if (consumableIndex < 0 || consumableIndex >= gameState.player.consumables.length) {
    return {
      newPlayer: gameState.player,
      newEnemy: gameState.currentEnemy,
      combatEnded: false,
      victory: false,
      logs: [createLog('error', '[ERROR] Invalid consumable index.')]
    };
  }

  const consumable = gameState.player.consumables[consumableIndex];
  const newPlayer = { ...gameState.player };
  const newEnemy = { ...gameState.currentEnemy };

  logs.push(
    createLog('player', `[USE] ${consumable.name}`),
    createLog('system', consumable.description),
    createLog('system', '')
  );

  // 효과 적용
  switch (consumable.effect.type) {
    case 'instant_damage':
      const damage = consumable.effect.value;
      newEnemy.integrity = Math.max(0, newEnemy.integrity - damage);
      logs.push(
        createLog('success', `[DAMAGE] Dealt ${damage} damage to ${newEnemy.name}`),
        createLog('enemy', `[${newEnemy.name}] ${newEnemy.integrity}/${newEnemy.maxIntegrity}`)
      );
      break;

    case 'heal':
      const healAmount = Math.min(consumable.effect.value, newPlayer.maxIntegrity - newPlayer.integrity);
      newPlayer.integrity += healAmount;
      logs.push(
        createLog('success', `[REPAIR] Restored ${healAmount} integrity`),
        createLog('player', `[SYSTEM] ${newPlayer.integrity}/${newPlayer.maxIntegrity}`)
      );
      break;

    case 'gain_btc':
      newPlayer.btc = (newPlayer.btc || 0) + consumable.effect.value;
      logs.push(
        createLog('success', `[BITCOIN] Gained ${consumable.effect.value} ₿`),
        createLog('player', `[WALLET] Total: ${newPlayer.btc} ₿`)
      );
      break;

    case 'draw_cards':
      const drawCount = consumable.effect.value;
      logs.push(
        createLog('success', `[DRAW] Drawing ${drawCount} additional processes...`),
        createLog('warning', '[NOTE] Card draw mechanic needs implementation')
      );
      break;

    case 'gain_threads':
      const threadsGained = Math.min(consumable.effect.value, newPlayer.maxThreads - newPlayer.threads);
      newPlayer.threads += threadsGained;
      logs.push(
        createLog('success', `[THREADS] Gained ${threadsGained} threads`),
        createLog('player', `[CPU] ${newPlayer.threads}/${newPlayer.maxThreads}`)
      );
      break;

    case 'weaken':
      newEnemy.attack = Math.max(1, newEnemy.attack - consumable.effect.value);
      logs.push(
        createLog('success', `[DEBUFF] Enemy attack reduced by ${consumable.effect.value}`),
        createLog('enemy', `[${newEnemy.name}] Attack: ${newEnemy.attack}`)
      );
      if (consumable.effect.duration) {
        logs.push(createLog('warning', `[DURATION] Effect lasts ${consumable.effect.duration} turns`));
      }
      break;

    case 'remove_firewall':
      newEnemy.integrity = Math.max(0, newEnemy.integrity - consumable.effect.value);
      logs.push(
        createLog('success', `[BREACH] Removed ${consumable.effect.value} firewall`),
        createLog('enemy', `[${newEnemy.name}] ${newEnemy.integrity}/${newEnemy.maxIntegrity}`)
      );
      break;
  }

  // 소모품 제거
  newPlayer.consumables = newPlayer.consumables.filter((_, i) => i !== consumableIndex);
  logs.push(createLog('system', ''));

  // 전투 종료 확인
  const combatEnded = newEnemy.integrity <= 0;
  const victory = combatEnded;

  if (combatEnded) {
    logs.push(
      createLog('success', ''),
      createLog('success', '[VICTORY] Enemy system compromised!'),
      createLog('success', '')
    );
  }

  return {
    newPlayer,
    newEnemy: combatEnded ? null : newEnemy,
    combatEnded,
    victory,
    logs
  };
}

// 프로세스 실행 결과
export interface ProcessExecutionResult {
  newPlayer: Player;
  newEnemy: Enemy;
  logs: LogEntry[];
}

// 프로세스 실행
export function executeProcess(
  player: Player,
  enemy: Enemy,
  process: Process,
  queueIndex: number
): ProcessExecutionResult {
  const logs: LogEntry[] = [];
  const newPlayer = { ...player };
  const newEnemy = { ...enemy };

  logs.push(
    createLog('player', `[EXEC] ${process.executable}`),
    createLog('system', '')
  );

  switch (process.type) {
    case 'attack':
      // 데미지 계산
      let damage = process.throughput;
      let multiplier = 1.0;

      // 취약점/약점/저항 체크
      if (process.attribute) {
        if (newEnemy.vulnerabilities?.includes(process.attribute)) {
          multiplier = 2.0;
          logs.push(createLog('success', `[CRITICAL] Exploited vulnerability! 2x damage!`));
        } else if (newEnemy.weaknesses?.includes(process.attribute)) {
          multiplier = 1.5;
          logs.push(createLog('success', `[EFFECTIVE] Targeted weakness! 1.5x damage!`));
        } else if (newEnemy.resistances?.includes(process.attribute)) {
          multiplier = 0.5;
          logs.push(createLog('warning', `[RESISTED] Enemy has resistance! 0.5x damage.`));
        }
      }

      damage = Math.floor(damage * multiplier);
      newEnemy.integrity = Math.max(0, newEnemy.integrity - damage);

      logs.push(
        createLog('combat', `[DAMAGE] ${damage} to ${newEnemy.name}`),
        createLog('enemy', `[${newEnemy.name}] ${newEnemy.integrity}/${newEnemy.maxIntegrity}`)
      );
      break;

    case 'defend':
      newPlayer.firewall += process.throughput;
      logs.push(
        createLog('combat', `[FIREWALL] +${process.throughput}`),
        createLog('player', `[DEFENSE] Current: ${newPlayer.firewall}`)
      );
      break;

    case 'heal':
      const healAmount = Math.min(process.throughput, newPlayer.maxIntegrity - newPlayer.integrity);
      newPlayer.integrity += healAmount;
      logs.push(
        createLog('success', `[REPAIR] +${healAmount} integrity`),
        createLog('player', `[SYSTEM] ${newPlayer.integrity}/${newPlayer.maxIntegrity}`)
      );
      break;

    case 'utility':
      if (process.id === 'scan') {
        logs.push(createLog('combat', `[SCAN] Target vulnerabilities:`));
        if (newEnemy.vulnerabilities.length > 0) {
          logs.push(createLog('success', `  [CRITICAL] ${newEnemy.vulnerabilities.join(', ')}`));
        }
        if (newEnemy.weaknesses.length > 0) {
          logs.push(createLog('warning', `  [WEAK] ${newEnemy.weaknesses.join(', ')}`));
        }
        if (newEnemy.resistances.length > 0) {
          logs.push(createLog('error', `  [RESIST] ${newEnemy.resistances.join(', ')}`));
        }
      } else if (process.id === 'cpu_throttle' || process.id === 'memory_leak') {
        logs.push(createLog('warning', `[${process.name}] Utility effect not fully implemented yet.`));
      } else {
        logs.push(createLog('combat', `[UTILITY] ${process.name} executed.`));
      }
      break;
  }

  // 큐에서 프로세스 제거 및 종료된 프로세스로 이동
  newPlayer.queue = newPlayer.queue.filter((_, i) => i !== queueIndex);
  newPlayer.terminated = [...newPlayer.terminated, process];

  logs.push(createLog('system', ''));

  return {
    newPlayer,
    newEnemy,
    logs
  };
}
