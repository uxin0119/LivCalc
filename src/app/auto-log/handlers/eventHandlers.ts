// 이벤트 노드 핸들러

import { GameState, LogEntry, Process } from '../types/game';
import { GameEvent, EventChoice } from '../game-logic/events';
import { createLog, initializeCombat } from '../game-logic/combat';
import { getRandomEnemy } from '../game-logic/enemies';
import { completeNode } from '../game-logic/network';

// 이벤트 선택 처리 결과
export interface EventChoiceResult {
  newPlayer: any;
  shouldStartCombat: boolean;
  combatDifficulty: 'normal' | 'elite' | 'boss';
  logs: LogEntry[];
}

// 이벤트 선택 처리
export function processEventChoice(
  event: GameEvent,
  choice: EventChoice,
  player: any
): EventChoiceResult {
  const logs: LogEntry[] = [
    createLog('player', `[CHOICE] ${choice.text}`),
    createLog('system', ''),
    createLog('combat', choice.outcome.description),
    createLog('system', '')
  ];

  let newPlayer = { ...player };
  let shouldStartCombat = false;
  let combatDifficulty: 'normal' | 'elite' | 'boss' = 'normal';

  // 결과 처리
  switch (choice.outcome.type) {
    case 'gain_btc':
      newPlayer.btc = (newPlayer.btc || 0) + (choice.outcome.value || 0);
      logs.push(createLog('success', `[BTC] +${choice.outcome.value} ₿ Bitcoin`));
      logs.push(createLog('player', `[WALLET] Total: ${newPlayer.btc} ₿`));
      break;

    case 'lose_btc':
      const lostBTC = Math.min(newPlayer.btc || 0, choice.outcome.value || 0);
      newPlayer.btc = (newPlayer.btc || 0) - lostBTC;
      logs.push(createLog('error', `[LOSS] -${lostBTC} ₿ Bitcoin`));
      logs.push(createLog('player', `[WALLET] Remaining: ${newPlayer.btc} ₿`));
      break;

    case 'gain_integrity':
      const healAmount = Math.min(choice.outcome.value || 0, newPlayer.maxIntegrity - newPlayer.integrity);
      newPlayer.integrity += healAmount;
      logs.push(createLog('success', `[REPAIR] +${healAmount} Integrity`));
      logs.push(createLog('player', `[SYSTEM] ${newPlayer.integrity}/${newPlayer.maxIntegrity}`));
      break;

    case 'lose_integrity':
      const damage = choice.outcome.value || 0;
      newPlayer.integrity = Math.max(0, newPlayer.integrity - damage);
      logs.push(createLog('error', `[DAMAGE] -${damage} Integrity`));
      logs.push(createLog('player', `[SYSTEM] ${newPlayer.integrity}/${newPlayer.maxIntegrity}`));
      break;

    case 'lose_process':
      if (newPlayer.library.length > 0) {
        const removedIndex = Math.floor(Math.random() * newPlayer.library.length);
        const removedProcess = newPlayer.library[removedIndex];
        newPlayer.library = newPlayer.library.filter((_: any, i: number) => i !== removedIndex);
        logs.push(createLog('warning', `[REMOVED] Lost process: ${removedProcess.name}`));

        // BTC 보상이 있으면
        if (choice.outcome.value) {
          newPlayer.btc = (newPlayer.btc || 0) + choice.outcome.value;
          logs.push(createLog('success', `[PAYMENT] +${choice.outcome.value} ₿ Bitcoin`));
        }
      } else {
        logs.push(createLog('warning', '[EMPTY] No processes to remove'));
      }
      break;

    case 'start_combat':
      shouldStartCombat = true;
      combatDifficulty = choice.outcome.combatDifficulty || 'normal';
      logs.push(createLog('error', '[COMBAT] Preparing for battle...'));
      break;

    case 'mixed':
      const mixedResult = processMixedOutcome(event, choice, newPlayer);
      newPlayer = mixedResult.newPlayer;
      logs.push(...mixedResult.logs);
      break;

    case 'gain_consumable':
      logs.push(createLog('success', '[GIFT] Received a consumable item!'));
      logs.push(createLog('warning', '[NOTE] Consumable system active - check /items'));
      break;
  }

  return {
    newPlayer,
    shouldStartCombat,
    combatDifficulty,
    logs
  };
}

// Mixed 타입 결과 처리
function processMixedOutcome(
  event: GameEvent,
  choice: EventChoice,
  player: any
): { newPlayer: any; logs: LogEntry[] } {
  const logs: LogEntry[] = [];
  const newPlayer = { ...player };
  const roll = Math.random() * 100;

  if (event.id === 'phishing_scam' && choice.id === 'install') {
    // 피싱 - 50% 확률로 프로세스 획득 또는 손실
    if (roll < 50) {
      // 좋은 결과: 실제로 정상 업데이트였음
      logs.push(createLog('success', '[LEGITIMATE] It was a real update!'));
      logs.push(createLog('success', '[UPGRADE] System performance improved'));
      logs.push(createLog('success', '[REWARD] Gained an optimized process!'));
      logs.push(createLog('warning', '[NOTE] New process will be added to library'));
    } else {
      // 나쁜 결과: 랜덤 프로세스 도난
      if (newPlayer.library.length > 0) {
        const stolenIndex = Math.floor(Math.random() * newPlayer.library.length);
        const stolenProcess = newPlayer.library[stolenIndex];
        newPlayer.library = newPlayer.library.filter((_: any, i: number) => i !== stolenIndex);
        logs.push(createLog('error', '[MALWARE] It was a trojan!'));
        logs.push(createLog('error', `[STOLEN] Lost process: ${stolenProcess.name}`));
        logs.push(createLog('warning', '[SYSTEM] Process file corrupted and removed'));
      } else {
        // 프로세스가 없으면 BTC 손실
        const btcLoss = Math.min(10, newPlayer.btc || 0);
        newPlayer.btc = (newPlayer.btc || 0) - btcLoss;
        logs.push(createLog('error', '[MALWARE] It was ransomware!'));
        logs.push(createLog('error', `[RANSOM] Lost ${btcLoss} ₿ Bitcoin`));
      }
    }
  } else if (event.id === 'anonymous_helper' && choice.id === 'accept') {
    // 체력 50% 손실, 강력한 프로세스 획득
    const healthLoss = Math.floor(newPlayer.integrity * 0.5);
    newPlayer.integrity -= healthLoss;
    logs.push(createLog('error', `[SACRIFICE] -${healthLoss} Integrity`));
    logs.push(createLog('success', '[REWARD] Gained a powerful process!'));
    logs.push(createLog('warning', '[NOTE] Process will be added to library'));
  } else if (event.id === 'darkweb_exploit' && choice.id === 'download') {
    if (roll < 50) {
      logs.push(createLog('success', '[SUCCESS] Legitimate exploit downloaded!'));
      logs.push(createLog('success', '[REWARD] Gained a powerful attack process'));
    } else {
      const damage = 20;
      newPlayer.integrity = Math.max(0, newPlayer.integrity - damage);
      logs.push(createLog('error', '[MALWARE] It was a trap!'));
      logs.push(createLog('error', `[DAMAGE] -${damage} Integrity`));
    }
  } else if (event.id === 'mystery_packet' && choice.id === 'execute') {
    if (roll < 50) {
      const btcGain = 15;
      newPlayer.btc = (newPlayer.btc || 0) + btcGain;
      logs.push(createLog('success', `[JACKPOT] Found ${btcGain} ₿ Bitcoin!`));
    } else {
      const damage = 15;
      newPlayer.integrity = Math.max(0, newPlayer.integrity - damage);
      logs.push(createLog('error', `[VIRUS] Infected! -${damage} Integrity`));
    }
  } else if (event.id === 'hacker_forum_trade' && choice.id === 'trade') {
    if (newPlayer.library.length > 0) {
      const removedIndex = Math.floor(Math.random() * newPlayer.library.length);
      const removedProcess = newPlayer.library[removedIndex];
      newPlayer.library = newPlayer.library.filter((_: any, i: number) => i !== removedIndex);
      logs.push(createLog('warning', `[TRADED] Gave: ${removedProcess.name}`));
      logs.push(createLog('success', '[RECEIVED] Rare process incoming!'));
    }
  } else if (event.id === 'data_broker' && choice.id === 'sell_bulk') {
    const processesToSell = Math.min(3, newPlayer.library.length);
    for (let i = 0; i < processesToSell; i++) {
      newPlayer.library.shift();
    }
    const btcGain = choice.outcome.value || 25;
    newPlayer.btc = (newPlayer.btc || 0) + btcGain;
    logs.push(createLog('warning', `[SOLD] ${processesToSell} processes`));
    logs.push(createLog('success', `[PAYMENT] +${btcGain} ₿ Bitcoin`));
  }

  return { newPlayer, logs };
}

// ========== 이벤트 선택 완전 처리 ==========

export interface EventHandleResult {
  shouldStartCombat: boolean;
  combatInit?: any;
  updatedPlayer: any;
  updatedMap?: any;
  phaseAfter: 'combat' | 'map';
  logs: LogEntry[];
}

// 이벤트 선택 및 후속 처리
export function handleEventChoice(
  gameState: GameState,
  choiceIndex: number
): EventHandleResult {
  const event: GameEvent = gameState.currentEvent!;
  const choice = event.choices[choiceIndex];

  // 이벤트 선택 처리
  const result = processEventChoice(event, choice, gameState.player);
  const { newPlayer, shouldStartCombat, combatDifficulty, logs } = result;

  if (shouldStartCombat) {
    // 전투 시작
    const enemy = getRandomEnemy(combatDifficulty as any, gameState.combatCount + 1);
    const combatInit = initializeCombat(newPlayer, enemy);

    return {
      shouldStartCombat: true,
      combatInit,
      updatedPlayer: combatInit.player,
      phaseAfter: 'combat',
      logs: [...logs, ...combatInit.logs]
    };
  } else {
    // 이벤트 종료, 맵으로 복귀
    const updatedMap = completeNode(gameState.networkMap!, gameState.currentNode!.id);

    return {
      shouldStartCombat: false,
      updatedPlayer: newPlayer,
      updatedMap,
      phaseAfter: 'map',
      logs: [
        ...logs,
        createLog('system', ''),
        createLog('success', '[EVENT_END] Returning to network map...'),
        createLog('system', '')
      ]
    };
  }
}
