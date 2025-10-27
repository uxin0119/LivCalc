// 보상 처리 핸들러

import { GameState, LogEntry, Process, Item, Consumable } from '../types/game';
import { createLog, calculateRewards } from '../game-logic/combat';
import { generateProcessRewards } from '../game-logic/cards';
import { generateItemRewards, ALL_CONSUMABLES } from '../game-logic/items';
import { completeNode } from '../game-logic/network';

type RewardOption = Process | Item | Consumable | { type: 'currency'; name: string; value: number, icon: string, description: string };

// 다양한 종류의 보상 생성
export function generateMixedRewards(playerItems: Item[]): RewardOption[] {
    const rewardTypes = ['process', 'item', 'consumable', 'currency'];
    const rewards: RewardOption[] = [];
    const selectedRewards = new Set<string>();

    for (let i = 0; i < 3; i++) {
        const rand = Math.random();
        let rewardType: string;

        if (rand < 0.5) rewardType = 'process'; // 50%
        else if (rand < 0.75) rewardType = 'item'; // 25%
        else if (rand < 0.9) rewardType = 'consumable'; // 15%
        else rewardType = 'currency'; // 10%

        let reward: RewardOption | undefined;

        switch (rewardType) {
            case 'process':
                const processReward = generateProcessRewards(1)[0];
                if (processReward && !selectedRewards.has(processReward.name)) {
                    reward = processReward;
                    selectedRewards.add(processReward.name);
                }
                break;
            case 'item':
                const itemReward = generateItemRewards('common', playerItems)[0];
                if (itemReward && !selectedRewards.has(itemReward.name)) {
                    reward = itemReward;
                    selectedRewards.add(itemReward.name);
                }
                break;
            case 'consumable':
                const consumablePool = ALL_CONSUMABLES.filter(c => !selectedRewards.has(c.name));
                if (consumablePool.length > 0) {
                    const consumableReward = consumablePool[Math.floor(Math.random() * consumablePool.length)];
                    reward = consumableReward;
                    selectedRewards.add(consumableReward.name);
                }
                break;
            case 'currency':
                const currencyValue = Math.floor(Math.random() * 10) + 5; // 5-14 BTC
                const currencyName = `${currencyValue} BTC`;
                if (!selectedRewards.has(currencyName)) {
                    reward = { type: 'currency', name: currencyName, value: currencyValue, icon: '₿', description: `Adds ${currencyValue} BTC to your wallet.` };
                    selectedRewards.add(currencyName);
                }
                break;
        }

        if (reward) {
            rewards.push(reward);
        } else {
            // 보상 생성에 실패하면 다른 유형으로 다시 시도 (간단하게 처리)
            i--;
        }
    }
    return rewards;
}


// 전투 승리 보상 생성
export function generateCombatRewards(enemy: any, playerItems: Item[]): {
  btc: number;
  experience: number;
  offeredRewards: RewardOption[];
  logs: LogEntry[];
} {
  const rewards = calculateRewards(enemy);
  const offeredRewards = generateMixedRewards(playerItems);

  const rewardLogs: LogEntry[] = [
    createLog('success', ''),
    createLog('success', '[REWARDS] Calculating battle rewards...'),
    createLog('success', `[BTC] +${rewards.btc} ₿ Bitcoin`),
    createLog('success', `[EXP] +${rewards.experience} experience`),
    createLog('system', ''),
    createLog('success', '========== REWARDS ==========')
  ];

  offeredRewards.forEach((reward) => {
    if ('type' in reward) {
        switch (reward.type) {
            case 'attack':
            case 'defend':
            case 'heal':
            case 'utility':
                const process = reward as Process;
                const attributeTag = process.attribute ? ` [${process.attribute}]` : '';
                rewardLogs.push(createLog('player', `[PROCESS] ${process.name}${attributeTag}`));
                rewardLogs.push(createLog('combat', `  ${process.description}`));
                break;
            case 'currency':
                rewardLogs.push(createLog('player', `[CURRENCY] ${reward.name}`));
                rewardLogs.push(createLog('combat', `  ${reward.description}`));
                break;
            default: // Item or Consumable
                 const item = reward as Item | Consumable;
                 const itemType = 'rarity' in item ? 'ITEM' : 'CONSUMABLE';
                 rewardLogs.push(createLog('player', `[${itemType}] ${item.name}`));
                 rewardLogs.push(createLog('combat', `  ${item.description}`));
                break;
        }
        rewardLogs.push(createLog('system', ''));
    }
  });

  rewardLogs.push(createLog('system', '====================================='));
  rewardLogs.push(createLog('player', 'Type /select [name] to choose a reward'));
  rewardLogs.push(createLog('player', 'Type /skip to continue without reward'));

  return {
    btc: rewards.btc,
    experience: rewards.experience,
    offeredRewards,
    logs: rewardLogs
  };
}

// 보상 선택 처리
export function selectReward(selectedReward: RewardOption, player: any): { logs: LogEntry[], updatedPlayer: any } {
    const updatedPlayer = { ...player };
    let logMessage = '';

    if ('type' in selectedReward) {
        switch (selectedReward.type) {
            case 'attack':
            case 'defend':
            case 'heal':
            case 'utility':
                updatedPlayer.library = [...updatedPlayer.library, selectedReward as Process];
                logMessage = `[SELECTED] Added process "${selectedReward.name}" to library!`;
                break;
            case 'currency':
                updatedPlayer.btc += (selectedReward as any).value;
                logMessage = `[SELECTED] Gained ${(selectedReward as any).value} BTC!`;
                break;
            default:
                if ('effects' in selectedReward) { // Item
                    updatedPlayer.items = [...updatedPlayer.items, selectedReward as unknown as Item];
                    logMessage = `[SELECTED] Equipped item "${selectedReward.name}"!`;
                } else { // Consumable
                    updatedPlayer.consumables = [...updatedPlayer.consumables, selectedReward as unknown as Consumable];
                    logMessage = `[SELECTED] Acquired consumable "${selectedReward.name}"!`;
                }
                break;
        }
    }


  const logs = [
    createLog('success', logMessage),
    createLog('system', ''),
    createLog('system', '[SYSTEM] Node compromised. Returning to network map...')
  ];

  return { logs, updatedPlayer };
}

// 보상 스킵 처리
export function skipRewardProcess(): LogEntry[] {
  return [
    createLog('warning', '[SKIPPED] No reward selected.'),
    createLog('system', ''),
    createLog('system', '[SYSTEM] Node compromised. Returning to network map...')
  ];
}

// 게임 오버 로그
export function getGameOverLogs(): LogEntry[] {
  return [
    createLog('error', ''),
    createLog('error', '========== SYSTEM FAILURE =========='),
    createLog('error', '[CRITICAL] Integrity compromised'),
    createLog('error', '[SYSTEM] Connection terminated'),
    createLog('error', '[GAME_OVER] Mission failed'),
    createLog('error', '===================================='),
    createLog('system', ''),
    createLog('warning', '[TIP] Type /start to begin a new run'),
    createLog('system', '')
  ];
}

// ========== 보상 선택 완전 처리 ==========

export interface RewardSelectionResult {
  updatedPlayer: any;
  updatedMap: any;
  logs: LogEntry[];
  offeredRewards?: RewardOption[];
}

// 보상 선택 및 상태 업데이트
export function handleSelectReward(
  rewardName: string,
  gameState: GameState,
  offeredRewards: RewardOption[]
): RewardSelectionResult {
  const selectedReward = offeredRewards.find(r => r.name.toLowerCase() === rewardName.toLowerCase());

  if (!selectedReward) {
      return {
          updatedPlayer: gameState.player,
          updatedMap: gameState.networkMap,
          logs: [createLog('error', `[ERROR] Reward "${rewardName}" not found.`)]
      };
  }

  const { logs, updatedPlayer } = selectReward(selectedReward, gameState.player);
  const updatedMap = completeNode(gameState.networkMap!, gameState.currentNode!.id);

  return {
    updatedPlayer,
    updatedMap,
    logs
  };
}

// 보상 스킵 및 상태 업데이트
export function handleSkipReward(gameState: GameState): RewardSelectionResult {
  const logs = skipRewardProcess();
  const updatedMap = completeNode(gameState.networkMap!, gameState.currentNode!.id);

  return {
    updatedPlayer: gameState.player,
    updatedMap,
    logs
  };
}
