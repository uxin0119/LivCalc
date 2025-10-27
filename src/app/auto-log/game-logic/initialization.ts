// 게임 초기화 모듈

import { GameState, LogEntry } from '../types/game';
import { createStarterLibrary } from './cards';
import { createLog } from './combat';
import { generateNetworkMap } from './network';
import { generateStarterItems } from './items';

// 게임 초기화
export function initializeGame(): GameState {
  const logs: LogEntry[] = [];
  logs.push(createLog('system', '[SYSTEM_BOOT] Initializing SPOIL THE SERVER v1.0...'));
  logs.push(createLog('system', '[SYSTEM_BOOT] Loading hacking modules... [OK]'));
  logs.push(createLog('system', '[SYSTEM_BOOT] Bypassing security protocols... [OK]'));
  logs.push(createLog('success', '[SYSTEM_BOOT] System compromised. Access granted.'));
  logs.push(createLog('system', ''));
  logs.push(createLog('success', '=== MISSION BRIEFING ==='));
  logs.push(createLog('player', 'Objective: Infiltrate servers and extract classified data'));
  logs.push(createLog('player', 'Method: Deploy exploit cards to breach security systems'));
  logs.push(createLog('system', '========================'));
  logs.push(createLog('system', ''));
  logs.push(createLog('player', 'Available commands:'));
  logs.push(createLog('player', '  /start  - Begin network infiltration'));
  logs.push(createLog('player', '  /help   - Show all available commands'));
  logs.push(createLog('system', ''));

  const library = createStarterLibrary();

  return {
    phase: 'menu',
    player: {
      integrity: 80,
      maxIntegrity: 80,
      threads: 3,
      maxThreads: 3,
      library: library,
      queue: [],
      terminated: [],
      firewall: 0,
      items: [],
      btc: 10, // 시작 재화 10 BTC
      consumables: [],
      buffs: [],
      debuffs: []
    },
    currentEnemy: null,
    currentNode: null,
    networkMap: null,
    logs: logs,
    turn: 0,
    combatCount: 0,
    progression: {
      level: 1,
      experience: 0,
      gold: 0,
      unlocks: {
        scriptEditor: false,
        macroSystem: false,
        advancedCommands: false,
        aiAutopilot: false,
        customCommands: false
      },
      permanentUpgrades: [],
      runsCompleted: 0,
      highestFloor: 0
    }
  };
}

// 런 시작 (시작 아이템 선택)
export function startNewRun(currentState: GameState): GameState {
  const starterOptions = generateStarterItems();

  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '[INITIALIZATION] Preparing infiltration tools...'),
    createLog('system', '[SYSTEM] Select your starting equipment'),
    createLog('system', ''),
    createLog('player', 'Choose one starter item: /select [name]'),
    createLog('player', `  - ${starterOptions[0].icon} ${starterOptions[0].name}`),
    createLog('combat', `       ${starterOptions[0].description}`),
    createLog('player', `  - ${starterOptions[1].icon} ${starterOptions[1].name}`),
    createLog('combat', `       ${starterOptions[1].description}`),
    createLog('system', '')
  ];

  return {
    ...currentState,
    phase: 'starter_selection',
    starterOptions,
    logs: [...currentState.logs, ...logs]
  };
}

// 시작 아이템 선택 후 네트워크 시작
export function beginNetworkInfiltration(currentState: GameState): GameState {
  const floor = 1;
  const networkMap = generateNetworkMap(floor);
  const currentNode = networkMap.nodes.find(n => n.status === 'current') || null;

  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '[RUN_START] Initiating network infiltration...'),
    createLog('system', `[NETWORK] Connecting to subnet 192.168.${floor}.0/24...`),
    createLog('success', `[CONNECTION] Entry point compromised!`),
    createLog('system', ''),
    createLog('player', '[TIP] Use /scan to view available targets'),
    createLog('player', '[TIP] Use /connect [ip] to infiltrate a server'),
    createLog('player', '[TIP] Use /ping [ip] to gather intel on a target'),
    createLog('system', '')
  ];

  return {
    ...currentState,
    phase: 'map',
    networkMap,
    currentNode,
    starterOptions: undefined,
    logs: [...currentState.logs, ...logs]
  };
}
