// 명령어 핸들러 모듈

import { GameState, LogEntry, Process, NetworkNode } from '../types/game';
import { EventChoice } from './events';
import { createLog } from './combat';
import { getEffectiveMaxIntegrity, getEffectiveMaxThreads } from './itemEffects';
import {
  getCurrentNode,
  getConnectedNodes,
  getAvailableNodes,
  findNodeByIP,
  getNodeIcon,
  getNodeStatusColor
} from './network';
import { getEnemyNextAction } from './enemies';

// /help 명령어
export function showHelp(gameState: GameState | null): LogEntry[] {
  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '========== AVAILABLE COMMANDS ==========')
  ];

  if (gameState?.phase === 'menu') {
    logs.push(createLog('player', '/start   - Begin server infiltration'));
  }

  if (gameState?.phase === 'map') {
    logs.push(createLog('player', '/scan      - Scan network for available nodes'));
    logs.push(createLog('player', '/connect [ip] - Connect to target server'));
    logs.push(createLog('player', '/ping [ip]    - Get node information'));
    logs.push(createLog('player', '/traceroute   - Show network path'));
  }

  if (gameState?.phase === 'combat') {
    logs.push(createLog('player', '/process - Show process queue'));
    logs.push(createLog('player', '/library - Show all processes in library'));
    logs.push(createLog('player', '/items   - Show consumable items'));
    logs.push(createLog('player', '/use [number] - Use consumable item'));
    logs.push(createLog('player', '/status  - Show system status'));
    logs.push(createLog('player', '/sort [type] - Sort queue (name/cost/type/attribute/throughput)'));
    logs.push(createLog('player', '/skip    - End attack sequence'));
    logs.push(createLog('player', '/[proc]  - Execute process'));
  }

  if (gameState?.phase === 'reward') {
    logs.push(createLog('player', '/select [name] - Select reward by name'));
    logs.push(createLog('player', '/skip          - Skip reward and continue'));
  }

  if (gameState?.phase === 'rest') {
    logs.push(createLog('player', '/1 - Restore 30% Integrity'));
    logs.push(createLog('player', '/2 - Upgrade a random process'));
    logs.push(createLog('player', '/3 - Mine 10 ₿ Bitcoin'));
    logs.push(createLog('player', '/4 - Gain 5 permanent Firewall'));
  }

  if (gameState?.phase === 'shop') {
    logs.push(createLog('player', '/shop    - Show Black Market inventory'));
    logs.push(createLog('player', '/buy [number] - Purchase item (e.g., /buy 1)'));
    logs.push(createLog('player', '/leave   - Exit Black Market'));
  }

  logs.push(createLog('player', '/quit    - Surrender and end run'));
  logs.push(createLog('player', '/help    - Show this help'));
  logs.push(createLog('system', '========================================'));
  logs.push(createLog('system', ''));

  return logs;
}

// /process 명령어
export function showHand(gameState: GameState | null): LogEntry[] {
  if (!gameState || gameState.phase !== 'combat') {
    return [createLog('warning', '[WARNING] Processes only available during infiltration.')];
  }

  const effectiveMaxThreads = getEffectiveMaxThreads(gameState.player);

  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '========== PROCESS QUEUE =========='),
    createLog('player', `Thread Pool: ${gameState.player.threads}/${effectiveMaxThreads}`)
  ];

  gameState.player.queue.forEach((process, index) => {
    const canPlay = gameState.player.threads >= process.cycles;
    const status = canPlay ? '[READY]' : '[LOCKED]';
    const color = canPlay ? 'success' : 'warning';

    // 타입 표시
    const typeTag = process.type === 'attack' ? '[ATK]' :
                    process.type === 'defend' ? '[DEF]' :
                    process.type === 'heal' ? '[HEAL]' : '[UTIL]';
    const attributeTag = process.attribute ? ` [${process.attribute}]` : '';

    logs.push(createLog(color as any, `${index + 1}. ${status} ${typeTag} /${process.executable}${attributeTag}`));
    logs.push(createLog('combat', `   ${process.name} | Cycles: ${process.cycles} | Throughput: ${process.throughput}`));
    logs.push(createLog('combat', `   ${process.description}`));
  });

  logs.push(createLog('system', '==================================='));
  logs.push(createLog('system', ''));

  return logs;
}

// /library 명령어 - 라이브러리에 있는 모든 프로세스 표시
export function showLibrary(gameState: GameState | null): LogEntry[] {
  if (!gameState) {
    return [createLog('warning', '[WARNING] No game state available.')];
  }

  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '========== PROCESS LIBRARY =========='),
    createLog('player', `Total Processes: ${gameState.player.library.length}`)
  ];

  if (gameState.player.library.length === 0) {
    logs.push(createLog('warning', '[EMPTY] No processes in library.'));
  } else {
    // 타입별로 그룹화
    const grouped: { [key: string]: Process[] } = {
      attack: [],
      defend: [],
      heal: [],
      utility: []
    };

    gameState.player.library.forEach(process => {
      grouped[process.type].push(process);
    });

    // 각 타입별로 표시
    const typeLabels = {
      attack: 'ATTACK PROCESSES',
      defend: 'DEFENSE PROCESSES',
      heal: 'RECOVERY PROCESSES',
      utility: 'UTILITY PROCESSES'
    };

    Object.entries(grouped).forEach(([type, processes]) => {
      if (processes.length > 0) {
        logs.push(createLog('system', ''));
        logs.push(createLog('success', `--- ${typeLabels[type as keyof typeof typeLabels]} ---`));

        processes.forEach(process => {
          const typeTag = process.type === 'attack' ? '[ATK]' :
                          process.type === 'defend' ? '[DEF]' :
                          process.type === 'heal' ? '[HEAL]' : '[UTIL]';
          const attributeTag = process.attribute ? ` [${process.attribute}]` : '';

          logs.push(createLog('player', `${typeTag} /${process.executable}${attributeTag}`));
          logs.push(createLog('combat', `   ${process.name} | Cycles: ${process.cycles} | Throughput: ${process.throughput}`));
          logs.push(createLog('combat', `   ${process.description}`));
        });
      }
    });
  }

  logs.push(createLog('system', ''));
  logs.push(createLog('system', '===================================='));
  logs.push(createLog('system', ''));

  return logs;
}

// /items 명령어 - 소모품 표시
export function showConsumables(gameState: GameState | null): LogEntry[] {
  if (!gameState) {
    return [createLog('warning', '[WARNING] No game state available.')];
  }

  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '========== CONSUMABLES =========='),
    createLog('player', `Total Items: ${gameState.player.consumables.length}`)
  ];

  if (gameState.player.consumables.length === 0) {
    logs.push(createLog('warning', '[EMPTY] No consumables in inventory.'));
    logs.push(createLog('system', ''));
    logs.push(createLog('player', '[TIP] Purchase consumables from Black Market'));
  } else {
    logs.push(createLog('system', ''));

    gameState.player.consumables.forEach((consumable, index) => {
      logs.push(createLog('player', `${index + 1}. ${consumable.icon} ${consumable.name}`));
      logs.push(createLog('combat', `   ${consumable.description}`));

      // 효과 표시
      const effectDesc = getConsumableEffectDescription(consumable);
      logs.push(createLog('combat', `   Effect: ${effectDesc}`));
      logs.push(createLog('system', ''));
    });

    logs.push(createLog('player', '[TIP] Type /use [number] to use a consumable (e.g., /use 1)'));
  }

  logs.push(createLog('system', '================================='));
  logs.push(createLog('system', ''));

  return logs;
}

// 소모품 효과 설명 생성
function getConsumableEffectDescription(consumable: any): string {
  const effect = consumable.effect;

  switch (effect.type) {
    case 'instant_damage':
      return `Deal ${effect.value} damage to enemy`;
    case 'heal':
      return `Restore ${effect.value} integrity`;
    case 'weaken':
      return `Reduce enemy attack by ${effect.value} for ${effect.duration || 1} turn(s)`;
    case 'gain_btc':
      return `Gain ${effect.value} ₿ Bitcoin`;
    case 'draw_cards':
      return `Draw ${effect.value} process(es)`;
    case 'gain_threads':
      return `Gain ${effect.value} thread(s) this turn`;
    case 'remove_firewall':
      return `Remove ${effect.value} enemy firewall`;
    default:
      return 'Unknown effect';
  }
}

// /status 명령어
export function showStatus(gameState: GameState | null, turnCount: number = 0): LogEntry[] {
  if (!gameState) return [];

  const effectiveMaxIntegrity = getEffectiveMaxIntegrity(gameState.player);
  const effectiveMaxThreads = getEffectiveMaxThreads(gameState.player);

  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '========== SYSTEM STATUS =========='),
    createLog('player', `Integrity: ${gameState.player.integrity}/${effectiveMaxIntegrity}`),
    createLog('player', `Thread Pool: ${gameState.player.threads}/${effectiveMaxThreads}`),
    createLog('player', `Firewall: ${gameState.player.firewall}`),
    createLog('player', `Bitcoin: ${gameState.player.btc || 0} ₿`),
    createLog('combat', `Queue: ${gameState.player.queue.length} | Library: ${gameState.player.library.length} | Terminated: ${gameState.player.terminated.length}`)
  ];

  // 아이템 표시
  if (gameState.player.items && gameState.player.items.length > 0) {
    logs.push(createLog('system', ''));
    logs.push(createLog('success', '========== EQUIPPED ITEMS =========='));
    gameState.player.items.forEach(item => {
      logs.push(createLog('player', `${item.icon} ${item.name}`));
      logs.push(createLog('combat', `   ${item.description}`));
    });
  }

  if (gameState.currentEnemy && gameState.phase === 'combat') {
    logs.push(createLog('system', ''));
    logs.push(createLog('error', '========== TARGET SERVER =========='));
    logs.push(createLog('enemy', `Designation: ${gameState.currentEnemy.name}`));
    logs.push(createLog('enemy', `Security: ${gameState.currentEnemy.integrity}/${gameState.currentEnemy.maxIntegrity}`));
    logs.push(createLog('enemy', `Firewall: ${gameState.currentEnemy.firewall}`));
    logs.push(createLog('enemy', `Threat Level: ${gameState.currentEnemy.attack}`));

    // 취약점 정보 표시
    if (gameState.currentEnemy.vulnerabilities.length > 0) {
      logs.push(createLog('warning', `CRITICAL: ${gameState.currentEnemy.vulnerabilities.join(', ')} ⚠️⚠️ (2.0x)`));
    }
    if (gameState.currentEnemy.weaknesses.length > 0) {
      logs.push(createLog('warning', `WEAKNESS: ${gameState.currentEnemy.weaknesses.join(', ')} ⚠️ (1.5x)`));
    }
    if (gameState.currentEnemy.resistances.length > 0) {
      logs.push(createLog('combat', `RESISTANT: ${gameState.currentEnemy.resistances.join(', ')} 🛡️ (0.5x)`));
    }

    // 적의 다음 행동 표시 (전투 중일 때만)
    if (gameState.phase === 'combat') {
      logs.push(createLog('system', ''));
      logs.push(createLog('warning', '========== ENEMY INTENT =========='));

      // 적의 다음 행동 가져오기
      const nextAction = getEnemyNextAction(gameState.currentEnemy, turnCount);

      if (nextAction.type === 'attack') {
        logs.push(createLog('error', `⚔️ ATTACK - Planning ${nextAction.value} damage`));
      } else if (nextAction.type === 'defend') {
        logs.push(createLog('warning', `🛡️ DEFEND - Raising ${nextAction.value} firewall`));
      } else if (nextAction.type === 'special') {
        logs.push(createLog('warning', `⚡ SPECIAL - ${nextAction.description || 'Unknown action'}`));
      }
    }
  }

  logs.push(createLog('system', '==================================='));
  logs.push(createLog('system', ''));

  return logs;
}

// /sort 명령어
export function handleSort(
  cmd: string,
  gameState: GameState | null
): {
  logs: LogEntry[];
  sortedQueue?: Process[];
} {
  if (!gameState || gameState.phase !== 'combat') {
    return {
      logs: [createLog('warning', '[WARNING] Sort command only available during combat.')]
    };
  }

  const parts = cmd.split(' ');
  const sortType = parts[1] || 'name';

  const sortedQueue = [...gameState.player.queue];

  switch (sortType) {
    case 'name':
      sortedQueue.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'cost':
    case 'cycles':
      sortedQueue.sort((a, b) => a.cycles - b.cycles);
      break;
    case 'type':
      // 공격 > 방어 > 치료 > 유틸리티 순
      const typeOrder = { attack: 0, defend: 1, heal: 2, utility: 3 };
      sortedQueue.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
      break;
    case 'attribute':
    case 'attr':
      sortedQueue.sort((a, b) => {
        const attrA = a.attribute || 'zzz';
        const attrB = b.attribute || 'zzz';
        return attrA.localeCompare(attrB);
      });
      break;
    case 'throughput':
    case 'power':
      sortedQueue.sort((a, b) => b.throughput - a.throughput);
      break;
    default:
      return {
        logs: [
          createLog('error', `[ERROR] Unknown sort type: ${sortType}`),
          createLog('player', 'Available: name, cost, type, attribute, throughput')
        ]
      };
  }

  return {
    logs: [
      createLog('success', `[SORTED] Queue sorted by ${sortType}`),
      createLog('system', 'Type /process to view sorted queue')
    ],
    sortedQueue
  };
}

// /quit 명령어 - 경고 로그 생성
export function getSurrenderWarningLogs(): LogEntry[] {
  return [
    createLog('warning', ''),
    createLog('warning', '[WARNING] Are you sure you want to surrender?'),
    createLog('error', '[SYSTEM] This will count as a defeat and reset your run.'),
    createLog('warning', 'Type /quit again to confirm, or continue playing.')
  ];
}

// /quit 명령어 - 확정 로그 생성
export function getSurrenderConfirmLogs(): LogEntry[] {
  return [
    createLog('error', ''),
    createLog('error', '[SURRENDER] Player surrendered the run.'),
    createLog('error', '[GAME_OVER] System terminated...'),
    createLog('system', ''),
    createLog('system', '[SYSTEM] Type /start to begin a new run.')
  ];
}

// 항복 체크 (이전 로그에서 확인 메시지가 있는지 확인)
export function shouldConfirmSurrender(logs: LogEntry[]): boolean {
  const lastLog = logs[logs.length - 1];
  return lastLog?.message.includes('Type /quit again to confirm');
}

// ========== 네트워크 명령어 ==========

// /scan 명령어 - 네트워크 스캔
export function scanNetwork(gameState: GameState | null): LogEntry[] {
  if (!gameState || !gameState.networkMap) {
    return [createLog('error', '[ERROR] No network map available')];
  }

  const currentNode = getCurrentNode(gameState.networkMap);
  if (!currentNode) {
    return [createLog('error', '[ERROR] Current position unknown')];
  }

  const availableNodes = getAvailableNodes(gameState.networkMap);
  const connectedNodes = getConnectedNodes(gameState.networkMap, currentNode.ip);

  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '[SCAN] Scanning network topology...'),
    createLog('system', `[CURRENT] ${currentNode.ip} ${getNodeIcon(currentNode.type)} ${currentNode.name}`),
    createLog('system', ''),
    createLog('success', '========== CONNECTED NODES ==========')
  ];

  if (connectedNodes.length === 0) {
    logs.push(createLog('warning', '[NO_ROUTES] No outbound connections detected'));
  } else {
    connectedNodes.forEach(node => {
      const icon = getNodeIcon(node.type);
      const statusText = node.status === 'compromised' ? '[COMPROMISED]' :
                        node.status === 'locked' ? '[LOCKED]' :
                        node.status === 'available' ? '[AVAILABLE]' : '[CURRENT]';

      const color = getNodeStatusColor(node.status);

      logs.push(createLog(color, `${node.ip} ${icon} ${statusText} ${node.name}`));

      if (node.requiresCompleted && gameState.networkMap && gameState.networkMap.completedCount < node.requiresCompleted) {
        logs.push(createLog('warning', `  ⚠ Requires ${node.requiresCompleted} nodes compromised (${gameState.networkMap.completedCount}/${node.requiresCompleted})`));
      }
    });
  }

  logs.push(createLog('system', '===================================='));
  logs.push(createLog('player', ''));
  logs.push(createLog('player', `[INFO] ${availableNodes.length} node(s) available for connection`));
  logs.push(createLog('player', `[WALLET] ${gameState.player.btc || 0} ₿ Bitcoin available`));
  logs.push(createLog('system', ''));

  return logs;
}

// /ping 명령어 - 노드 정보
export function pingNode(ip: string, gameState: GameState | null): LogEntry[] {
  if (!gameState || !gameState.networkMap) {
    return [createLog('error', '[ERROR] No network map available')];
  }

  const node = findNodeByIP(gameState.networkMap, ip);
  if (!node) {
    return [createLog('error', `[ERROR] Host ${ip} unreachable`)];
  }

  const icon = getNodeIcon(node.type);
  const typeNames = {
    combat: 'Security System',
    elite: 'Elite Security Node',
    event: 'Unknown Data Signature',
    shop: 'Black Market Server',
    rest: 'Safe Zone',
    boss: 'Primary Target'
  };

  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', `[PING] ${ip} - Response received`),
    createLog('system', ''),
    createLog('success', '========== NODE INFORMATION =========='),
    createLog('player', `IP Address: ${node.ip}`),
    createLog('player', `Hostname:   ${node.name}`),
    createLog('player', `Type:       ${icon} ${typeNames[node.type as keyof typeof typeNames]}`),
    createLog('player', `Status:     ${node.status.toUpperCase()}`),
    createLog('player', `Layer:      ${node.layer}`),
    createLog('system', ''),
    createLog('combat', `Description: ${node.description}`),
    createLog('system', '====================================='),
    createLog('system', '')
  ];

  return logs;
}

// /traceroute 명령어 - 경로 표시
export function traceroute(gameState: GameState | null): LogEntry[] {
  if (!gameState || !gameState.networkMap) {
    return [createLog('error', '[ERROR] No network map available')];
  }

  const currentNode = getCurrentNode(gameState.networkMap);
  if (!currentNode) {
    return [createLog('error', '[ERROR] Current position unknown')];
  }

  // 완료된 노드들을 레이어 순으로 정렬
  const compromisedNodes = gameState.networkMap.nodes
    .filter(n => n.status === 'compromised')
    .sort((a, b) => a.layer - b.layer);

  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '[TRACEROUTE] Tracing network path...'),
    createLog('system', '')
  ];

  compromisedNodes.forEach((node, index) => {
    const icon = getNodeIcon(node.type);
    logs.push(createLog('success', `${index + 1}. ${node.ip} ${icon} ${node.name} [Layer ${node.layer}]`));
  });

  logs.push(createLog('error', `${compromisedNodes.length + 1}. ${currentNode.ip} ${getNodeIcon(currentNode.type)} ${currentNode.name} [CURRENT]`));
  logs.push(createLog('system', ''));

  return logs;
}

// connect 명령어 결과 타입
export interface ConnectResult {
  logs: LogEntry[];
  success: boolean;
  targetNode?: NetworkNode;
}

// ========== 명령어 라우팅 ==========

// 명령어 처리 결과
export interface CommandResult {
  handled: boolean;
  logs?: LogEntry[];
  action?: 'surrender' | 'sort' | 'connect' | 'select_starter' | 'select_reward' | 'skip_reward' |
           'buy_item' | 'leave_shop' | 'select_event' | 'select_rest' | 'execute_process' | 'use_consumable' |
           'skip_turn' | 'show_shop';
  actionData?: any;
}

// /map 명령어 - 전체 네트워크 맵 표시
export function showMap(gameState: GameState | null): LogEntry[] {
  if (!gameState || !gameState.networkMap) {
    return [createLog('error', '[ERROR] No network map available')];
  }

  const { nodes } = gameState.networkMap;
  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '========== GLOBAL NETWORK MAP ==========')
  ];

  const nodesByLayer = new Map<number, NetworkNode[]>();
  nodes.forEach(node => {
    const layer = nodesByLayer.get(node.layer) || [];
    layer.push(node);
    nodesByLayer.set(node.layer, layer);
  });

  const sortedLayers = Array.from(nodesByLayer.keys()).sort((a, b) => a - b);

  for (const layer of sortedLayers) {
    logs.push(createLog('system', `
--- LAYER ${layer} ---`));
    const layerNodes = nodesByLayer.get(layer)!;

    for (const node of layerNodes) {
      const icon = getNodeIcon(node.type);
      const color = getNodeStatusColor(node.status);
      const status = `[${node.status.toUpperCase()}]`;

      logs.push(createLog(color, `> ${icon} ${node.ip} ${node.name} ${status}`));
      if (node.connections.length > 0) {
        logs.push(createLog('combat', `  └─ Connections: ${node.connections.join(', ')}`));
      }
    }
  }

  logs.push(createLog('system', '======================================'));
  logs.push(createLog('system', ''));

  return logs;
}

// 공통 명령어 처리
export function handleCommonCommands(cmd: string, gameState: GameState): CommandResult {
  if (cmd === 'help') {
    return { handled: true, logs: showHelp(gameState) };
  }

  if (cmd === 'map') {
    return { handled: true, logs: showMap(gameState) };
  }

  if (cmd === 'quit' || cmd === 'exit' || cmd === 'surrender') {
    return { handled: true, action: 'surrender' };
  }

  if (cmd === 'process' || cmd === 'processes' || cmd === 'queue') {
    return { handled: true, logs: showHand(gameState) };
  }

  if (cmd === 'library' || cmd === 'lib' || cmd === 'deck') {
    return { handled: true, logs: showLibrary(gameState) };
  }

  if (cmd === 'status') {
    if (gameState.phase === 'menu') {
        return { handled: true, logs: [createLog('warning', 'Game has not started yet. Type /start to begin.')] };
    }
    return { handled: true, logs: showStatus(gameState, gameState.turn) };
  }

  if (cmd.startsWith('sort')) {
    return { handled: true, action: 'sort', actionData: cmd };
  }

  return { handled: false };
}

// 메뉴 단계 명령어
export function handleMenuCommands(cmd: string): CommandResult {
  if (cmd === 'start' || cmd === 'begin' || cmd === 'run') {
    return { handled: true, action: 'select_starter' };
  }

  return {
    handled: true,
    logs: [createLog('warning', `[UNKNOWN_COMMAND] "/${cmd}" not recognized. Type "/help" for available commands.`)]
  };
}

// 시작 아이템 선택 단계 명령어
export function handleStarterSelectionCommands(cmd: string, gameState: GameState): CommandResult {
  if (cmd.startsWith('select ')) {
    const itemName = cmd.substring('select '.length).trim();
    if (itemName) {
        const selectedItem = gameState.starterOptions?.find(item => item.name.toLowerCase() === itemName.toLowerCase());
        if (selectedItem) {
            return {
                handled: true,
                action: 'select_starter',
                actionData: selectedItem
            };
        }
    }
  }

  return {
    handled: true,
    logs: [createLog('warning', '[WARNING] Please select an item by name, e.g., /select "CPU Cooler"')]
  };
}

// 맵 단계 명령어
export function handleMapCommands(cmd: string, gameState: GameState): CommandResult {
  if (cmd === 'scan') {
    return { handled: true, logs: scanNetwork(gameState) };
  }

  if (cmd === 'traceroute' || cmd === 'trace') {
    return { handled: true, logs: traceroute(gameState) };
  }

  if (cmd.startsWith('ping ')) {
    const ip = cmd.split(' ')[1];
    return { handled: true, logs: pingNode(ip, gameState) };
  }

  if (cmd.startsWith('connect ')) {
    const ip = cmd.split(' ')[1];
    return { handled: true, action: 'connect', actionData: ip };
  }

  return {
    handled: true,
    logs: [createLog('warning', `[UNKNOWN_COMMAND] "/${cmd}" not recognized. Type "/help" for available commands.`)]
  };
}

// 전투 단계 명령어
export function handleCombatCommands(cmd: string, gameState: GameState): CommandResult {
  if (cmd === 'items' || cmd === 'consumables') {
    return { handled: true, logs: showConsumables(gameState) };
  }

  if (cmd.startsWith('use ')) {
    const itemName = cmd.substring('use '.length).trim();
    if (itemName && gameState.player.consumables) {
      const itemIndex = gameState.player.consumables.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());
      if (itemIndex !== -1) {
        return {
          handled: true,
          action: 'use_consumable',
          actionData: itemIndex
        };
      }
    }
    return {
      handled: true,
      logs: [createLog('error', `[ERROR] Consumable "${itemName}" not found. Type /items to see your consumables.`)]
    };
  }

  if (cmd === 'skip' || cmd === 'end') {
    return { handled: true, action: 'skip_turn' };
  }

  // 프로세스 명령어 처리
  const process = gameState.player.queue.find(c =>
    c.executable.toLowerCase() === cmd || c.name.toLowerCase() === cmd || c.id === cmd
  );

  if (process) {
    return {
      handled: true,
      action: 'execute_process',
      actionData: process
    };
  }

  return {
    handled: true,
    logs: [createLog('error', `[ERROR] Command "/${cmd}" not found. Type "/process" to see available processes.`)]
  };
}

// 보상 단계 명령어
export function handleRewardCommands(cmd: string): CommandResult {
  if (cmd.startsWith('select ')) {
    const rewardName = cmd.substring('select '.length).trim();
    if (rewardName) {
        return {
            handled: true,
            action: 'select_reward',
            actionData: rewardName
        };
    }
  }

  if (cmd === 'skip') {
    return { handled: true, action: 'skip_reward' };
  }

  return {
    handled: true,
    logs: [createLog('error', `[ERROR] Invalid command. Type /select [name] or /skip.`)]
  };
}

// 상점 단계 명령어
export function handleShopCommands(cmd: string, gameState: GameState): CommandResult {
  if (cmd === 'shop' || cmd === 'list' || cmd === 'inventory') {
    return { handled: true, action: 'show_shop' };
  }

  if (cmd.startsWith('buy ')) {
    const itemName = cmd.substring('buy '.length).trim();
    if (itemName && gameState.shopInventory) {
      const itemIndex = gameState.shopInventory.findIndex(item => {
        return item.item.name.toLowerCase() === itemName.toLowerCase();
      });
      if (itemIndex !== -1) {
        return {
          handled: true,
          action: 'buy_item',
          actionData: itemIndex
        };
      }
    }
    return {
      handled: true,
      logs: [createLog('error', `[ERROR] Item "${itemName}" not found in shop. Type /shop to see available items.`)]
    };
  }

  if (cmd === 'leave') {
    return { handled: true, action: 'leave_shop' };
  }

  return {
    handled: true,
    logs: [createLog('error', '[ERROR] Use /buy [number] to purchase or /leave to exit.')]
  };
}

// 이벤트 단계 명령어
export function handleEventCommands(cmd: string, gameState: GameState): CommandResult {
  if (gameState.currentEvent) {
    const choiceTextSlug = cmd.toLowerCase();
    const choiceIndex = gameState.currentEvent.choices.findIndex((choice: EventChoice) =>
      choice.command.toLowerCase() === choiceTextSlug
    );

    if (choiceIndex !== -1) {
      return {
        handled: true,
        action: 'select_event',
        actionData: choiceIndex
      };
    }
  }

  return {
    handled: true,
    logs: [createLog('error', '[ERROR] Invalid choice. Please select an available event option.')]
  };
}

// 휴식 단계 명령어
export function handleRestCommands(cmd: string): CommandResult {
  let choiceNum: number | undefined;
  switch (cmd) {
    case 'rest_heal':
      choiceNum = 1;
      break;
    case 'rest_upgrade':
      choiceNum = 2;
      break;
    case 'rest_mine':
      choiceNum = 3;
      break;
    case 'rest_firewall':
      choiceNum = 4;
      break;
    default:
      return {
        handled: true,
        logs: [createLog('error', '[ERROR] Invalid rest choice. Use /rest_heal, /rest_upgrade, /rest_mine, or /rest_firewall.')]
      };
  }

  if (choiceNum !== undefined) {
    return {
      handled: true,
      action: 'select_rest',
      actionData: choiceNum
    };
  }

  return {
    handled: true,
    logs: [createLog('error', '[ERROR] Invalid rest choice.')]
  };
}
