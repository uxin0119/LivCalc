// 노드 진입 및 처리 핸들러

import { GameState, LogEntry, NetworkNode } from '../types/game';
import { createLog } from '../game-logic/combat';
import { initializeCombat, startTurn } from '../game-logic/combat';
import { getRandomEnemy, getEnemyNextAction } from '../game-logic/enemies';
import { generateShopInventory } from '../game-logic/shop';
import { getRandomEvent } from '../game-logic/events';
import { getEffectiveMaxIntegrity } from '../game-logic/itemEffects';
import { completeNode } from '../game-logic/network';

// 노드 진입 결과
export interface NodeEnterResult {
  phase: 'combat' | 'shop' | 'rest' | 'event';
  logs: LogEntry[];
  updatedState?: any; // 업데이트된 게임 상태 (필요한 경우)
}

// 전투 노드 진입
export function enterCombatNode(
  gameState: GameState,
  node: NetworkNode,
  difficulty: number
): { combatInit: any; logs: LogEntry[] } {
  const enemyType = node.type === 'elite' ? 'elite' : node.type === 'boss' ? 'boss' : 'normal';
  const enemy = getRandomEnemy(enemyType as any, difficulty);
  const combatInit = initializeCombat(gameState.player, enemy);

  return {
    combatInit,
    logs: combatInit.logs
  };
}

// 첫 턴 시작 로그 생성
export function getFirstTurnLogs(enemy: any): LogEntry[] {
  const enemyIntent = getEnemyNextAction(enemy, 1);

  const intentLogs: LogEntry[] = [
    createLog('system', ''),
    createLog('warning', '========== ENEMY INTENT =========='),
    createLog('error', `[NEXT_ACTION] ${enemyIntent.description}`),
    createLog('warning', '=================================='),
    createLog('system', '')
  ];

  const tutorialLogs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '========== HOW TO PLAY =========='),
    createLog('player', '[TIP] Type "/process" to see your queue'),
    createLog('player', '[TIP] Type process names to execute them (e.g., "/firewall.bat")'),
    createLog('player', '[TIP] Start typing "/" for autocomplete menu'),
    createLog('player', '[TIP] Type "/skip" to end your turn'),
    createLog('player', '[TIP] Type "/help" for all commands'),
    createLog('system', '================================='),
    createLog('system', '')
  ];

  return [...intentLogs, ...tutorialLogs];
}

// 상점 노드 진입
export function enterShopNode(gameState: GameState): LogEntry[] {
  const shopInventory = generateShopInventory();

  const shopLogs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '[CONNECTING] Accessing Black Market server...'),
    createLog('success', '[CONNECTED] Welcome to the Black Market'),
    createLog('player', `[WALLET] Your balance: ${gameState.player.btc || 0} ₿`),
    createLog('system', ''),
    createLog('success', '========== BLACK MARKET INVENTORY ==========')
  ];

  shopInventory.forEach((shopItem, index) => {
    const item = shopItem.item;
    const typePrefix = shopItem.itemType === 'item' ? '🔧' :
                       shopItem.itemType === 'process' ? '💻' : '📦';

    shopLogs.push(createLog('player', `${index + 1}. ${typePrefix} ${item.name} - ${shopItem.price} ₿`));

    if (shopItem.itemType === 'process') {
      const process = item as any;
      const typeTag = process.type === 'attack' ? '[ATK]' :
                      process.type === 'defend' ? '[DEF]' :
                      process.type === 'heal' ? '[HEAL]' : '[UTIL]';
      const attributeTag = process.attribute ? ` [${process.attribute}]` : '';

      shopLogs.push(createLog('combat', `   ${typeTag}${attributeTag} Cycles: ${process.cycles} | Throughput: ${process.throughput}`));
      shopLogs.push(createLog('combat', `   ${item.description}`));
    } else {
      shopLogs.push(createLog('combat', `   ${item.description}`));
    }

    shopLogs.push(createLog('system', ''));
  });

  shopLogs.push(createLog('system', '=========================================='));
  shopLogs.push(createLog('player', 'Type /buy [number] to purchase (e.g., /buy 1)'));
  shopLogs.push(createLog('player', 'Type /shop to view inventory again'));
  shopLogs.push(createLog('player', 'Type /leave to exit the Black Market'));
  shopLogs.push(createLog('system', ''));

  return shopLogs;
}

// 휴식 노드 진입 - 선택지 표시
export function enterRestNode(gameState: GameState): LogEntry[] {
  const restLogs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '[REST] Entering safe zone...'),
    createLog('system', '[SAFE] No security systems detected'),
    createLog('system', '[IDLE] System idle. Choose your downtime activity:'),
    createLog('system', ''),
    createLog('success', '========== REST OPTIONS =========='),
    createLog('player', '[1] 시스템 회복 - Restore 30% Integrity'),
    createLog('player', '[2] 라이브러리 강화 - Upgrade a random process'),
    createLog('player', '[3] 비트코인 채굴 - Mine 10 ₿ Bitcoin'),
    createLog('player', '[4] 보안 강화 - Gain 5 permanent Firewall'),
    createLog('system', '=================================='),
    createLog('system', ''),
    createLog('player', 'Type /1, /2, /3, or /4 to choose')
  ];

  return restLogs;
}

export interface RestChoiceResult {
  updatedPlayer: any;
  updatedMap: any;
  logs: LogEntry[];
}

export function handleRestChoice(
  choice: number,
  gameState: GameState
): RestChoiceResult {
  const logs: LogEntry[] = [];
  const updatedPlayer = { ...gameState.player };

  switch (choice) {
    case 1: // 시스템 회복
      const healAmount = Math.floor(getEffectiveMaxIntegrity(updatedPlayer) * 0.3);
      updatedPlayer.integrity = Math.min(getEffectiveMaxIntegrity(updatedPlayer), updatedPlayer.integrity + healAmount);
      logs.push(
        createLog('success', '[RECOVERY] Running system diagnostics...'),
        createLog('success', `[REPAIR] Restored ${healAmount} Integrity`),
        createLog('player', `[SYSTEM] ${updatedPlayer.integrity}/${getEffectiveMaxIntegrity(updatedPlayer)}`)
      );
      break;

    case 2: // 라이브러리 강화
      if (updatedPlayer.library.length > 0) {
        const randomIndex = Math.floor(Math.random() * updatedPlayer.library.length);
        const process = updatedPlayer.library[randomIndex];

        const upgradeType = Math.random() < 0.5 ? 'throughput' : 'cycles';

        if (upgradeType === 'throughput') {
          process.throughput += 2;
          logs.push(
            createLog('success', '[UPGRADE] Process optimization complete!'),
            createLog('player', `[ENHANCED] ${process.name} +2 Throughput`)
          );
        } else if (process.cycles > 1) {
          process.cycles -= 1;
          logs.push(
            createLog('success', '[OPTIMIZE] Process streamlined!'),
            createLog('player', `[FASTER] ${process.name} -1 Cycle cost`)
          );
        } else {
          process.throughput += 2;
          logs.push(
            createLog('success', '[UPGRADE] Process optimization complete!'),
            createLog('player', `[ENHANCED] ${process.name} +2 Throughput`)
          );
        }
      } else {
        logs.push(createLog('warning', '[EMPTY] No processes to upgrade'));
      }
      break;

    case 3: // 비트코인 채굴
      updatedPlayer.btc = (updatedPlayer.btc || 0) + 10;
      logs.push(
        createLog('success', '[MINING] Running crypto mining operation...'),
        createLog('success', '[PROFIT] Mined 10 ₿ Bitcoin'),
        createLog('player', `[WALLET] Total: ${updatedPlayer.btc} ₿`)
      );
      break;

    default:
      logs.push(createLog('error', '[ERROR] Invalid choice'));
      return { updatedPlayer: gameState.player, logs, updatedMap: gameState.networkMap };
  }

  logs.push(
    createLog('system', ''),
    createLog('success', '[REST_COMPLETE] Downtime activities complete. Exiting safe zone...'),
    createLog('system', '')
  );

  const updatedMap = completeNode(gameState.networkMap!, gameState.currentNode!.id);

  return {
    updatedPlayer,
    updatedMap,
    logs
  };
}

// 이벤트 노드 진입
export function enterEventNode(): {
  event: any;
  logs: LogEntry[];
} {
  const event = getRandomEvent();

  const eventLogs: LogEntry[] = [
    createLog('system', ''),
    createLog('warning', `[EVENT] ${event.icon} ${event.title}`),
    createLog('system', '')
  ];

  // 이벤트 설명 추가
  event.description.forEach(desc => {
    eventLogs.push(createLog('combat', desc));
  });

  eventLogs.push(createLog('system', ''));
  eventLogs.push(createLog('success', '========== CHOICES =========='));

  // 선택지 표시
  event.choices.forEach((choice: any, index: number) => {
    eventLogs.push(createLog('player', `/${index + 1} - ${choice.text}`));
  });

  eventLogs.push(createLog('system', '================================'));
  eventLogs.push(createLog('player', 'Type /1 or /2 to make your choice'));
  eventLogs.push(createLog('system', ''));

  return {
    event,
    logs: eventLogs
  };
}

// 상점 나가기
export function leaveShopNode(gameState: GameState): LogEntry[] {
  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '[DISCONNECTED] Leaving Black Market...'),
    createLog('system', '[SYSTEM] Shop visit does not progress the node.'),
    createLog('system', '[SYSTEM] Returning to network map...')
  ];

  return logs;
}

// 노드 완료 후 진행 상황 로그
export function getProgressLogs(completedCount: number, totalNodes: number, btc: number): LogEntry[] {
  return [
    createLog('system', ''),
    createLog('success', `[PROGRESS] Nodes compromised: ${completedCount}/${totalNodes}`),
    createLog('player', `[WALLET] ${btc} ₿ Bitcoin available`),
    createLog('player', '[TIP] Use /scan to view available nodes'),
    createLog('player', '[TIP] Use /connect [ip] to continue infiltration'),
    createLog('system', '')
  ];
}

export interface CombatStartResult {
  firstTurnLogs: LogEntry[];
  updatedPlayer: any;
  updatedEnemy: any;
}

// 전투 시작 완전 처리 (첫 턴 시작 포함)
export function handleStartCombat(combatInit: any): CombatStartResult {
  // `initializeCombat`가 이미 첫 핸드를 드로우했으므로, 여기서는 추가 로그만 생성합니다.
  const additionalLogs = getFirstTurnLogs(combatInit.enemy);

  return {
    firstTurnLogs: additionalLogs, // `startTurn`의 중복 로그를 제거합니다.
    updatedPlayer: combatInit.player,
    updatedEnemy: combatInit.enemy,
  };
}
export interface EventNodeResult {
  event: any;
  logs: LogEntry[];
}

// 이벤트 노드 진입 완전 처리
export function handleEnterEvent(): EventNodeResult {
  return enterEventNode();
}
