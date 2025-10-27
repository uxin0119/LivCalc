// 전투 시스템 로직

import { Player, Enemy, Process, LogEntry } from '../types/game';
import { executeProcessEffect } from './cards';
import { executeEnemyAction, getEnemyNextAction } from './enemies';
import {
  getEffectiveMaxIntegrity,
  getEffectiveMaxThreads,
  getStartFirewall,
  getExtraDrawCount,
  getCyclesReduction
} from './itemEffects';

// 전투 초기화
export function initializeCombat(player: Player, enemy: Enemy): {
  player: Player;
  enemy: Enemy;
  logs: LogEntry[];
} {
  const logs: LogEntry[] = [];

  logs.push(createLog('system', '[COMBAT_START] Initializing combat module...'));

  const combatMaxIntegrity = getEffectiveMaxIntegrity(player);
  const combatMaxThreads = getEffectiveMaxThreads(player);
  const initialFirewall = getStartFirewall(player);

  const allProcesses = [...player.library, ...player.queue, ...player.terminated];
  const shuffledLibrary = [...allProcesses].sort(() => Math.random() - 0.5);
  const drawCount = 5 + getExtraDrawCount(player);
  const initialQueue = shuffledLibrary.slice(0, drawCount);
  const remainingLibrary = shuffledLibrary.slice(drawCount);

  logs.push(createLog('system', '[LIBRARY] Shuffling process library...'));
  logs.push(createLog('success', `[DRAW] Drawing ${initialQueue.length} processes`));
  logs.push(createLog('enemy', `[SSH_CONNECTION] Establishing secure shell to ${enemy.name}...`));

  if (initialFirewall > 0) {
    logs.push(createLog('success', `[FIREWALL] Defense systems activated: +${initialFirewall} Firewall`));
  }

  const adjustedIntegrity = Math.min(player.integrity, combatMaxIntegrity);

  return {
    player: {
      ...player,
      integrity: adjustedIntegrity,
      threads: combatMaxThreads,
      firewall: initialFirewall,
      library: remainingLibrary,
      queue: initialQueue,
      terminated: [],
      buffs: [],
      debuffs: []
    },
    enemy: {
      ...enemy,
      firewall: 0,
      buffs: [],
      debuffs: []
    },
    logs
  };
}

// 턴 시작
export function startTurn(player: Player, enemy: Enemy): {
  player: Player;
  enemy: Enemy;
  logs: LogEntry[];
} {
  const turnLogs: LogEntry[] = [];

  // 1. 상태 효과 처리 (지속시간 감소, 턴 시작 효과 적용)
  const statusResult = processStatusEffects(player, enemy);
  let updatedPlayer = statusResult.player;
  let updatedEnemy = statusResult.enemy;
  turnLogs.push(...statusResult.logs);

  // 2. 스레드 리셋
  const effectiveMaxThreads = getEffectiveMaxThreads(updatedPlayer);
  updatedPlayer = { ...updatedPlayer, threads: effectiveMaxThreads };

  turnLogs.push(createLog('system', ''));
  turnLogs.push(createLog('system', `[TURN_START] ========== NEW TURN ==========`));
  turnLogs.push(createLog('player', `[THREADS] Restored to ${effectiveMaxThreads}`));

  // 3. 기본 카드 드로우 + 버프/아이템 효과
  let drawCount = 2; // 기본 2장
  const drawBuff = updatedPlayer.buffs.find(b => b.type === 'draw_next_turn');
  if (drawBuff) {
    drawCount += drawBuff.value;
    turnLogs.push(createLog('success', `[BUFF] Drawing ${drawBuff.value} extra processes from ${drawBuff.source}!`));
  }
  // 아이템 효과 추가
  drawCount += getExtraDrawCount(updatedPlayer);


  for (let i = 0; i < drawCount; i++) {
    const drawResult = drawProcess(updatedPlayer);
    updatedPlayer = drawResult.player;
    if (drawResult.logs.length > 0) {
      turnLogs.push(...drawResult.logs);
    }
  }

  turnLogs.push(createLog('system', `[QUEUE] ${updatedPlayer.queue.length} processes available`));

  return {
    player: updatedPlayer,
    enemy: updatedEnemy,
    logs: turnLogs
  };
}

// 프로세스 실행 (사용 시 즉시 버림)
export function playProcess(
  process: Process,
  player: Player,
  enemy: Enemy
): {
  player: Player;
  enemy: Enemy;
  logs: LogEntry[];
} {
  const logs: LogEntry[] = [];

  const cyclesReduction = getCyclesReduction(player);
  const adjustedCycles = Math.max(1, process.cycles - cyclesReduction);

  if (player.threads < adjustedCycles) {
    logs.push(createLog('error', `[ERROR] Insufficient threads. Need ${adjustedCycles}, have ${player.threads}`));
    return { player, enemy, logs };
  }

  logs.push(createLog('player', `[COMMAND] > ${process.executable}`));
  logs.push(createLog('system', `[PROCESSING] Running ${process.executable}...`));

  let playerAfterCost = { ...player, threads: player.threads - adjustedCycles };

  // 공격 전 버프 적용 (damage_boost)
  let throughput = process.throughput;
  const damageBuff = playerAfterCost.buffs.find(b => b.type === 'damage_boost');
  if (process.type === 'attack' && damageBuff) {
    if (damageBuff.value < 2) { // 50% 증폭 같은 배율
      throughput = Math.floor(throughput * damageBuff.value);
    } else { // +5 같은 고정값
      throughput += damageBuff.value;
    }
    logs.push(createLog('success', `[BUFF] ${damageBuff.source} is amplifying damage!`));
    // 1회용 버프 제거 (duration이 1인 경우)
    if (damageBuff.duration === 1) {
        playerAfterCost.buffs = playerAfterCost.buffs.filter(b => b.id !== damageBuff.id);
    }
  }

  const result = executeProcessEffect(
    { ...process, throughput },
    playerAfterCost,
    enemy,
    player.queue.length - 1
  );

  logs.push(...result.logs.map(log => createLog('combat', log)));

  const finalPlayer = {
    ...result.player,
    queue: player.queue.filter(c => c.id !== process.id),
    terminated: [...player.terminated, process],
  };

  return {
    player: finalPlayer,
    enemy: result.enemy,
    logs
  };
}

// 적 턴 실행
export function executeEnemyTurn(
  player: Player,
  enemy: Enemy,
  turnCount: number
): {
  player: Player;
  enemy: Enemy;
  logs: LogEntry[];
  isPlayerDefeated: boolean;
} {
  const logs: LogEntry[] = [];
  let updatedEnemy = { ...enemy }; // 적 턴 시작 시 방어력 초기화 제거

  logs.push(createLog('system', ''));
  logs.push(createLog('error', '[SERVER_RESPONSE] ========== COUNTER-ATTACK =========='));

  const action = getEnemyNextAction(updatedEnemy, turnCount);

  // 디버프 적용 (weaken)
  let attackValue = action.value;
  const weakenDebuff = updatedEnemy.debuffs.find(d => d.type === 'weaken');
  if (action.type === 'attack' && weakenDebuff) {
    attackValue = Math.floor(attackValue * weakenDebuff.value);
    logs.push(createLog('success', `[DEBUFF] ${weakenDebuff.source} is weakening enemy attack!`));
  }

  const result = executeEnemyAction(
    updatedEnemy,
    { ...action, value: attackValue },
    player
  );

  logs.push(...result.logs.map(log => createLog('error', log)));

  updatedEnemy.firewall = result.enemyFirewall;

  // 플레이어의 방어력은 적의 공격 후에 0으로 리셋됩니다.
  const newPlayer = { ...player, integrity: result.playerIntegrity, firewall: 0 };
  logs.push(createLog('system', '[FIREWALL] Player defense systems reset for next turn'));

  const isPlayerDefeated = newPlayer.integrity <= 0;
  if (isPlayerDefeated) {
    logs.push(createLog('error', '[SYSTEM_FAILURE] Critical damage! System compromised!'));
  }

  return {
    player: newPlayer,
    enemy: updatedEnemy,
    logs,
    isPlayerDefeated
  };
}

// 전투 종료 체크
export function checkCombatEnd(player: Player, enemy: Enemy): {
  isEnded: boolean;
  result: 'victory' | 'defeat' | null;
  logs: LogEntry[];
} {
  const logs: LogEntry[] = [];

  if (enemy.integrity <= 0) {
    logs.push(createLog('success', ''));
    logs.push(createLog('success', '[COMBAT_END] ==================================='));
    logs.push(createLog('success', '[VICTORY] Threat neutralized!'));
    logs.push(createLog('success', `[ENEMY] ${enemy.name} terminated`));
    logs.push(createLog('success', '[SYSTEM] Returning to normal operations...'));
    return { isEnded: true, result: 'victory', logs };
  }

  if (player.integrity <= 0) {
    logs.push(createLog('error', ''));
    logs.push(createLog('error', '[COMBAT_END] ==================================='));
    logs.push(createLog('error', '[DEFEAT] System compromised!'));
    logs.push(createLog('error', '[GAME_OVER] Rebooting required...'));
    return { isEnded: true, result: 'defeat', logs };
  }

  return { isEnded: false, result: null, logs };
}



// 상태 효과 처리 (턴 시작 시)
function processStatusEffects(player: Player, enemy: Enemy): {
  player: Player;
  enemy: Enemy;
  logs: LogEntry[];
} {
  const logs: LogEntry[] = [];
  let updatedPlayer = { ...player };
  let updatedEnemy = { ...enemy };

  // 지속시간 1 감소 및 만료된 효과 제거
  const updateEffects = (effects: StatusEffect[]) => {
    return effects
      .map(e => ({ ...e, duration: e.duration - 1 }))
      .filter(e => e.duration > 0);
  };

  updatedPlayer.buffs = updateEffects(player.buffs);
  updatedPlayer.debuffs = updateEffects(player.debuffs);
  updatedEnemy.buffs = updateEffects(enemy.buffs);
  updatedEnemy.debuffs = updateEffects(enemy.debuffs);

  return { player: updatedPlayer, enemy: updatedEnemy, logs };
}

// 라이브러리에서 프로세스 드로우
export function drawProcess(player: Player): {
  player: Player;
  logs: LogEntry[];
} {
  const logs: LogEntry[] = [];

  if (player.library.length === 0) {
    // 라이브러리가 비었으면 종료된 프로세스를 셔플해서 라이브러리로
    if (player.terminated.length > 0) {
      logs.push(createLog('system', '[LIBRARY_EMPTY] Shuffling terminated processes...'));
      const shuffled = [...player.terminated].sort(() => Math.random() - 0.5);

      return {
        player: {
          ...player,
          library: shuffled.slice(1),
          queue: [...player.queue, shuffled[0]],
          terminated: []
        },
        logs
      };
    }

    logs.push(createLog('warning', '[WARNING] No processes to draw'));
    return { player, logs };
  }

  const [drawnProcess, ...remainingLibrary] = player.library;

  logs.push(createLog('system', `[DRAW] ${drawnProcess.name}`));

  return {
    player: {
      ...player,
      library: remainingLibrary,
      queue: [...player.queue, drawnProcess]
    },
    logs
  };
}

// 헬퍼: 로그 엔트리 생성
export function createLog(
  type: 'system' | 'player' | 'enemy' | 'combat' | 'error' | 'success' | 'warning',
  message: string
): LogEntry {
  const now = new Date();
  const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return {
    id: `${Date.now()}_${Math.random()}`,
    timestamp,
    type,
    message,
    animate: true
  };
}

// 전투 보상 계산
export function calculateRewards(enemy: Enemy): {
  btc: number;
  experience: number;
} {
  let btc = 0;
  let experience = 0;

  // 적의 최대 체력을 기반으로 티어 결정
  const maxHp = enemy.maxIntegrity;

  if (maxHp <= 40) {
    // Tier 1: 초보자용 (30-40 HP)
    btc = 8 + Math.floor(Math.random() * 3); // 8-10 BTC
    experience = 15;
  } else if (maxHp <= 60) {
    // Tier 2-3: 초급~중급 (41-60 HP)
    btc = 12 + Math.floor(Math.random() * 4); // 12-15 BTC
    experience = 25;
  } else if (maxHp <= 90) {
    // Tier 4-5: 중상급 (61-90 HP)
    btc = 18 + Math.floor(Math.random() * 5); // 18-22 BTC
    experience = 40;
  } else if (maxHp <= 120) {
    // Tier 6+: 고급 (91-120 HP)
    btc = 25 + Math.floor(Math.random() * 8); // 25-32 BTC
    experience = 60;
  } else {
    // Elite/Boss: 매우 강함 (120+ HP)
    btc = 40 + Math.floor(Math.random() * 15); // 40-54 BTC
    experience = 100;
  }

  return { btc, experience };
}
