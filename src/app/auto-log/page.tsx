'use client';

import { useState, useEffect, useRef } from 'react';
import Terminal from './components/Terminal';
import CommandInput, { CommandInputRef } from './components/CommandInput';
import { GameState, LogEntry, Process, ItemEffect } from './types/game';
import { EventChoice } from './game-logic/events';
import { getRandomEnemy, getEnemyNextAction } from './game-logic/enemies';
import {
  initializeCombat,
  startTurn,
  playProcess,
  executeEnemyTurn,
  checkCombatEnd,
  drawProcess,
  createLog,
} from './game-logic/combat';
import {
  getEffectiveMaxIntegrity,
  getEffectiveMaxThreads,
  getHealOnKill,
  applyItemOnAcquisition
} from './game-logic/itemEffects';
import { initializeGame, startNewRun, beginNetworkInfiltration } from './game-logic/initialization';
import {
  handleSort,
  getSurrenderWarningLogs,
  getSurrenderConfirmLogs,
  shouldConfirmSurrender,
  handleCommonCommands,
  handleMenuCommands,
  handleStarterSelectionCommands,
  handleMapCommands,
  handleCombatCommands,
  handleRewardCommands,
  handleShopCommands,
  handleEventCommands,
  handleRestCommands
} from './game-logic/commands';
import { getAvailableNodes, handleConnect as processConnect, completeNode } from './game-logic/network';
import {
  showShopInventory as getShopInventoryLogs,
  handleShopPurchase as processPurchase,
  handleEnterBlackMarket,
  handleLeaveShop,
} from './game-logic/shop';
import { handleEventChoice as processEventChoiceFull } from './handlers/eventHandlers';
import { useConsumable as processConsumableUse } from './handlers/combatHandlers';
import {
  enterCombatNode,
  handleStartCombat,
  enterRestNode as getRestNodeLogs,
  handleRestChoice,
  handleEnterEvent,
  getProgressLogs
} from './handlers/nodeHandlers';
import {
  generateCombatRewards,
  handleSelectReward,
  handleSkipReward,
} from './handlers/rewardHandlers';

export default function AutoLogGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rewardChoices, setRewardChoices] = useState<any[]>([]);
  const commandInputRef = useRef<CommandInputRef>(null);

  useEffect(() => {
    setGameState(initializeGame());
  }, []);

  const addLogs = (newLogs: LogEntry[]) => {
    setGameState(prev => {
      if (!prev) return prev;
      return { ...prev, logs: [...prev.logs, ...newLogs] };
    });
  };

  const handleContainerClick = () => {
    commandInputRef.current?.focus();
  };

  const handleCommand = async (command: string) => {
    if (!gameState || isProcessing) return;
    const cmd = command.toLowerCase().trim().replace(/^\//, '');
    const commonResult = handleCommonCommands(cmd, gameState);
    if (commonResult.handled) {
      if (commonResult.logs) addLogs(commonResult.logs);
      if (commonResult.action === 'surrender') handleSurrenderCommand();
      if (commonResult.action === 'sort') handleSortCommand(commonResult.actionData);
      return;
    }

    if (gameState.phase === 'menu') {
      const result = handleMenuCommands(cmd);
      if (result.logs) addLogs(result.logs);
      if (result.action === 'select_starter') setGameState(startNewRun(gameState));
      return;
    }

    if (gameState.phase === 'starter_selection') {
      const result = handleStarterSelectionCommands(cmd, gameState);
      if (result.logs) addLogs(result.logs);
      if (result.action === 'select_starter' && result.actionData !== undefined) {
        const selectedItem = result.actionData;
        const playerAfterHeal = applyItemOnAcquisition(gameState.player, selectedItem);
        const playerWithItem = { ...playerAfterHeal, items: [...gameState.player.items, selectedItem] };
        const logs: LogEntry[] = [
          createLog('success', `[SELECTED] ${selectedItem.icon} ${selectedItem.name}`),
          createLog('system', `[EQUIPPED] ${selectedItem.description}`),
        ];
        const integrityEffect = selectedItem.effects.find((e: ItemEffect) => e.type === 'max_integrity');
        if (integrityEffect) {
          const oldEffectiveMax = getEffectiveMaxIntegrity(gameState.player);
          const newEffectiveMax = getEffectiveMaxIntegrity(playerWithItem);
          logs.push(createLog('success', `[INTEGRITY] Healed: +${integrityEffect.value} | Max Integrity: ${oldEffectiveMax} → ${newEffectiveMax}` ));
        }
        const threadsEffect = selectedItem.effects.find((e: ItemEffect) => e.type === 'max_threads');
        if (threadsEffect) {
          logs.push(createLog('success', `[THREADS] Max +${threadsEffect.value} (${gameState.player.maxThreads} → ${playerWithItem.maxThreads})`));
        }
        logs.push(createLog('system', ''));
        const updatedState = { ...gameState, player: playerWithItem, logs: [...gameState.logs, ...logs] };
        setGameState(beginNetworkInfiltration(updatedState));
      }
      return;
    }

    if (gameState.phase === 'map') {
      const result = handleMapCommands(cmd, gameState);
      if (result.logs) addLogs(result.logs);
      if (result.action === 'connect') handleConnect(result.actionData);
      return;
    }

    if (gameState.phase === 'combat') {
      const result = handleCombatCommands(cmd, gameState);
      if (result.logs) addLogs(result.logs);
      if (result.action === 'use_consumable') applyConsumable(result.actionData);
      if (result.action === 'skip_turn') endPlayerTurn();
      if (result.action === 'execute_process') await executeProcess(result.actionData);
      return;
    }

    if (gameState.phase === 'reward') {
      const result = handleRewardCommands(cmd);
      if (result.logs) addLogs(result.logs);
      if (result.action === 'select_reward') selectReward(result.actionData);
      if (result.action === 'skip_reward') skipReward();
      return;
    }

    if (gameState.phase === 'shop') {
      const result = handleShopCommands(cmd, gameState);
      if (result.logs) addLogs(result.logs);
      if (result.action === 'show_shop') addLogs(getShopInventoryLogs(gameState));
      if (result.action === 'buy_item') handleShopPurchase(result.actionData);
      if (result.action === 'leave_shop') leaveShopHandler();
      return;
    }

    if (gameState.phase === 'event') {
      const result = handleEventCommands(cmd, gameState);
      if (result.logs) addLogs(result.logs);
      if (result.action === 'select_event') handleEventChoice(result.actionData);
      return;
    }

    if (gameState.phase === 'rest') {
      const result = handleRestCommands(cmd);
      if (result.logs) addLogs(result.logs);
      if (result.action === 'select_rest') handleRestSelection(result.actionData);
      return;
    }
  };

  const handleSurrenderCommand = () => {
    if (!gameState) return;
    if (shouldConfirmSurrender(gameState.logs)) {
      const defeatLogs = getSurrenderConfirmLogs();
      setGameState(prev => ({ ...initializeGame(), logs: [...(prev?.logs || []), ...defeatLogs] }));
      setIsProcessing(false);
      setRewardChoices([]);
    } else {
      addLogs(getSurrenderWarningLogs());
    }
  };

  const handleSortCommand = (cmd: string) => {
    if (!gameState) return;
    const result = handleSort(cmd, gameState);
    addLogs(result.logs);
    if (result.sortedQueue) {
      setGameState(prev => ({ ...prev!, player: { ...prev!.player, queue: result.sortedQueue! } }));
    }
  };

  const handleConnect = (ip: string) => {
    if (!gameState || !gameState.networkMap) return;
    const result = processConnect(gameState.networkMap, ip);
    addLogs(result.logs);
    if (result.success && result.updatedMap && result.targetNode) {
      enterNode(result.targetNode, result.updatedMap);
    }
  };

  const enterNode = (node: any, updatedMap?: any) => {
    if (!gameState) return;
    const map = updatedMap || gameState.networkMap;
    switch (node.type) {
      case 'combat':
      case 'elite':
      case 'boss':
        startCombatFromNode(node, map);
        break;
      case 'event':
        setGameState(prev => ({ ...prev!, phase: 'event', currentNode: node, currentEvent: handleEnterEvent().event, logs: [...prev!.logs, ...handleEnterEvent().logs] }));
        break;
      case 'shop':
        setGameState(prev => ({ ...prev!, phase: 'shop', shopInventory: handleEnterBlackMarket(prev!).shopInventory, logs: [...prev!.logs, ...handleEnterBlackMarket(prev!).logs] }));
        break;
      case 'rest':
        setGameState(prev => ({ ...prev!, phase: 'rest', logs: [...prev!.logs, ...getRestNodeLogs(prev!)] }));
        break;
    }
  };

  const startCombatFromNode = (node: any, map: any) => {
    if (!gameState) return;
    const { combatInit, logs } = enterCombatNode(gameState, node, gameState.combatCount + 1);
    setGameState(prev => {
        if (!prev) return prev;
        const newLogs = [...prev.logs, ...logs];
        const finalState = {
            ...prev,
            networkMap: map,
            currentNode: node,
            phase: 'combat' as const,
            player: combatInit.player,
            currentEnemy: combatInit.enemy,
            logs: newLogs,
            turn: 1,
            combatCount: prev.combatCount + 1
        };
        setTimeout(() => {
            const startResult = handleStartCombat(combatInit);
            setGameState(current => ({
                ...current!,
                player: startResult.updatedPlayer,
                currentEnemy: startResult.updatedEnemy,
                logs: [...newLogs, ...startResult.firstTurnLogs]
            }));
        }, 10);
        return finalState;
    });
  };

  const executeProcess = async (process: Process) => {
    if (!gameState || !gameState.currentEnemy || isProcessing) return;
    setIsProcessing(true);
    const result = playProcess(process, gameState.player, gameState.currentEnemy);
    const threadsLog = createLog('player', `[THREADS] Remaining: ${result.player.threads}/${getEffectiveMaxThreads(result.player)}`);
    setGameState(prev => ({ ...prev!, player: result.player, currentEnemy: result.enemy, logs: [...prev!.logs, ...result.logs, threadsLog] }));
    setTimeout(() => {
      const endCheck = checkCombatEnd(result.player, result.enemy);
      if (endCheck.isEnded) {
        handleCombatEnd(endCheck.result!, result.enemy);
        setIsProcessing(false);
        return;
      }
      const canPlayAnyProcess = result.player.queue.some(c => c.cycles <= result.player.threads);
      if (!canPlayAnyProcess) {
        addLogs([createLog('warning', '[AUTO_SKIP] No executable processes. Ending turn automatically...')]);
        setTimeout(() => endPlayerTurn(), 1000);
      }
      setIsProcessing(false);
    }, 500);
  };

  const endPlayerTurn = async () => {
    if (!gameState || !gameState.currentEnemy || isProcessing) return;
    setIsProcessing(true);
    addLogs([createLog('system', '[END_TURN] Ending player turn...')]);
    setTimeout(() => {
      if (!gameState || !gameState.currentEnemy) return;
      const enemyResult = executeEnemyTurn(gameState.player, gameState.currentEnemy, gameState.turn);
      setGameState(prev => ({ ...prev!, player: enemyResult.player, currentEnemy: enemyResult.enemy, logs: [...prev!.logs, ...enemyResult.logs] }));
      if (enemyResult.isPlayerDefeated) {
        setTimeout(() => handleCombatEnd('defeat', enemyResult.enemy), 1000);
      } else {
        setTimeout(() => {
          setGameState(prev => {
            if (!prev || !prev.currentEnemy) return prev;
            const turnStart = startTurn(prev.player, prev.currentEnemy);
            const nextTurn = prev.turn + 1;
            const enemyIntent = getEnemyNextAction(turnStart.enemy, nextTurn);
            const intentLogs: LogEntry[] = [createLog('system', ''), createLog('warning', '========== ENEMY INTENT =========='), createLog('error', `[NEXT_ACTION] ${enemyIntent.description}`), createLog('warning', '=================================='), createLog('system', '')];
            return { ...prev, player: turnStart.player, currentEnemy: turnStart.enemy, turn: nextTurn, logs: [...prev.logs, ...turnStart.logs, ...intentLogs] };
          });
          setIsProcessing(false);
        }, 1000);
      }
    }, 1000);
  };

  const selectReward = (rewardName: string) => {
    if (!gameState || !gameState.networkMap || !gameState.currentNode) return;
    const result = handleSelectReward(rewardName, gameState, rewardChoices);
    setGameState(prev => ({ ...prev!, phase: 'map', networkMap: result.updatedMap, player: result.updatedPlayer, logs: [...prev!.logs, ...result.logs] }));
    setRewardChoices([]);
    setTimeout(() => addLogs(getProgressLogs(result.updatedMap.completedCount, result.updatedMap.nodes.length, result.updatedPlayer.btc || 0)), 500);
  };

  const skipReward = () => {
    if (!gameState || !gameState.networkMap || !gameState.currentNode) return;
    const result = handleSkipReward(gameState);
    setGameState(prev => ({ ...prev!, phase: 'map', networkMap: result.updatedMap, logs: [...prev!.logs, ...result.logs] }));
    setRewardChoices([]);
    setTimeout(() => addLogs(getProgressLogs(result.updatedMap.completedCount, result.updatedMap.nodes.length, gameState.player.btc || 0)), 500);
  };

  const handleShopPurchase = (itemIndex: number) => {
    if (!gameState) return;
    const result = processPurchase(gameState, itemIndex);
    if (result.success) {
      setGameState(prev => ({ ...prev!, player: result.newPlayer, shopInventory: result.newShopInventory, logs: [...prev!.logs, ...result.logs] }));
    } else {
      addLogs(result.logs);
    }
  };

  const leaveShopHandler = () => {
    if (!gameState || !gameState.networkMap) return;
    const result = handleLeaveShop(gameState);
    setGameState(prev => ({ ...prev!, phase: 'map', shopInventory: undefined, networkMap: result.updatedMap, logs: [...prev!.logs, ...result.logs] }));
    setTimeout(() => {
        if (!gameState) return;
        addLogs(getProgressLogs(result.updatedMap.completedCount, result.updatedMap.nodes.length, gameState.player.btc || 0))
    }, 500);
  };

  const handleRestSelection = (choice: number) => {
    if (!gameState) return;
    const result = handleRestChoice(choice, gameState);
    setGameState(prev => ({ ...prev!, player: result.updatedPlayer, phase: 'map', networkMap: result.updatedMap, logs: [...prev!.logs, ...result.logs] }));
    setTimeout(() => {
        if (!gameState) return;
        addLogs(getProgressLogs(result.updatedMap.completedCount, result.updatedMap.nodes.length, result.updatedPlayer.btc || 0))
    }, 500);
  };

  const handleEventChoice = async (choiceIndex: number) => {
    if (!gameState || !gameState.currentEvent || isProcessing) return;
    setIsProcessing(true);
    const result = processEventChoiceFull(gameState, choiceIndex);
    if (!result.shouldStartCombat) {
      setGameState(prev => ({ ...prev!, player: result.updatedPlayer, networkMap: result.updatedMap, phase: 'map', currentEvent: undefined, logs: [...prev!.logs, ...result.logs] }));
      setTimeout(() => {
        addLogs(getProgressLogs(result.updatedMap.completedCount, result.updatedMap.nodes.length, result.updatedPlayer.btc));
        setIsProcessing(false);
      }, 500);
      return;
    }
    setGameState(prev => ({ ...prev!, phase: 'combat', player: result.combatInit.player, currentEnemy: result.combatInit.enemy, currentEvent: undefined, turn: 1, combatCount: prev!.combatCount + 1, logs: [...prev!.logs, ...result.logs] }));
    setTimeout(() => {
      const startResult = handleStartCombat(result.combatInit);
      setGameState(prev => ({ ...prev!, player: startResult.updatedPlayer, currentEnemy: startResult.updatedEnemy, logs: [...prev!.logs, ...startResult.firstTurnLogs] }));
      setIsProcessing(false);
    }, 500);
  };

  const applyConsumable = (consumableIndex: number) => {
    if (!gameState || !gameState.currentEnemy || isProcessing) return;
    setIsProcessing(true);
    const result = processConsumableUse(gameState, consumableIndex);
    setGameState(prev => ({ ...prev!, player: result.newPlayer, currentEnemy: result.newEnemy, logs: [...prev!.logs, ...result.logs] }));
    setTimeout(() => {
      setIsProcessing(false);
      if (result.combatEnded && result.victory) {
        addLogs([createLog('success', ''), createLog('success', '[VICTORY] Enemy system compromised!'), createLog('success', '')]);
        setTimeout(() => handleCombatEnd('victory', result.newEnemy || gameState.currentEnemy!), 1000);
      }
    }, 500);
  };

  const handleCombatEnd = (result: 'victory' | 'defeat', enemy: any) => {
    if (!gameState) return;
    if (result === 'victory') {
      const { btc, experience, offeredRewards, logs: rewardLogs } = generateCombatRewards(enemy, gameState.player.items);
      setRewardChoices(offeredRewards);
      const healAmount = getHealOnKill(gameState.player);
      const healLogs: LogEntry[] = [];
      if (healAmount > 0) {
        healLogs.push(createLog('success', `[ITEM_EFFECT] Restored ${healAmount} Integrity from heal_on_kill items`));
      }
      const effectiveMaxIntegrity = getEffectiveMaxIntegrity(gameState.player);
      const newIntegrity = Math.min(effectiveMaxIntegrity, gameState.player.integrity + healAmount);
      setGameState(prev => ({ ...prev!, phase: 'reward', player: { ...prev!.player, integrity: newIntegrity, btc: (prev!.player.btc || 0) + btc }, logs: [...prev!.logs, ...healLogs, ...rewardLogs], progression: { ...prev!.progression, experience: prev!.progression.experience + experience } }));
    } else {
      setTimeout(() => {
        const defeatLogs: LogEntry[] = [createLog('error', ''), createLog('error', '[GAME_OVER] System critically damaged...'), createLog('system', '[REPAIR] Running emergency recovery protocols...'), createLog('success', '[RESTORED] Integrity restored to maximum'), createLog('system', ''), createLog('player', '[TIP] Continue from the network map'), createLog('system', '')];
        const updatedMap = gameState.networkMap ? completeNode(gameState.networkMap, gameState.currentNode?.id || '') : null;
        setGameState(prev => ({ ...prev!, phase: 'map', player: { ...prev!.player, integrity: prev!.player.maxIntegrity, firewall: 0, btc: prev!.player.btc || 0, consumables: prev!.player.consumables || [] }, currentEnemy: null, networkMap: updatedMap, logs: [...prev!.logs, ...defeatLogs] }));
      }, 1000);
    }
    setIsProcessing(false);
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-green-400 font-mono text-xl animate-pulse">
          [LOADING] Initializing system...
        </div>
      </div>
    );
  }

  const availableCommands = [
    '/help',
    '/map',
    '/quit',
    ...(gameState.phase !== 'menu' ? ['/status'] : []),
    ...(gameState.phase === 'menu' ? ['/start'] : []),
    ...(gameState.phase === 'starter_selection' && gameState.starterOptions
        ? gameState.starterOptions.map(item => `/select ${item.name}`)
        : []
    ),
    ...(gameState.phase === 'map' && gameState.networkMap
      ? [
          '/scan',
          '/traceroute',
          ...getAvailableNodes(gameState.networkMap).map(n => `/connect ${n.ip}`),
          ...gameState.networkMap.nodes.map(n => `/ping ${n.ip}`)
        ]
      : []),
    ...(gameState.phase === 'combat'
      ? [
          '/process',
          '/library',
          '/items',
          ...gameState.player.consumables.map(c => `/use ${c.name}`),
          '/sort name',
          '/sort cost',
          '/sort type',
          '/sort attribute',
          '/sort throughput',
          ...Array.from(new Set(gameState.player.queue.map(c => `/${c.executable}`))),
          '/skip'
        ]
      : []),
    ...(gameState.phase === 'reward' && rewardChoices
        ? [...rewardChoices.map(r => `/select ${r.name}`), '/skip']
        : []
    ),
    ...(gameState.phase === 'rest'
        ? ['/rest_heal', '/rest_upgrade', '/rest_mine', '/rest_firewall']
        : []
    ),
    ...(gameState.phase === 'shop' && gameState.shopInventory
      ? [
          ...gameState.shopInventory.map(shopItem => `/buy ${shopItem.item.name}`),
          '/leave'
        ]
      : []),
    ...(gameState.phase === 'event' && gameState.currentEvent
        ? gameState.currentEvent.choices.map((choice: EventChoice) => `/${choice.command} - ${choice.text}`)
        : []
    ),
  ];

  return (
    <div
      className="fixed inset-0 bg-black text-green-400 overflow-hidden flex flex-col"
      style={{ margin: '-1rem', width: 'calc(100% + 2rem)', height: 'calc(100vh + 2rem)' }}
      onClick={handleContainerClick}
    >
      <div className="flex-1 flex flex-col overflow-hidden p-4 max-w-7xl mx-auto w-full">
        <div className="flex-1 overflow-hidden">
          <Terminal logs={gameState.logs}>
            <CommandInput
              ref={commandInputRef}
              onCommand={handleCommand}
              availableCommands={availableCommands}
              hand={gameState.player.queue}
              disabled={isProcessing}
            />
          </Terminal>
        </div>

        <div className="mt-2 text-center text-xs font-mono text-gray-600">
          Type &quot;/&quot; for command menu • Use arrows to navigate • Press ENTER to execute
        </div>
      </div>
    </div>
  );
}
