// Black Market 상점 시스템

import { ShopItem, Item, Process, Consumable, GameState, LogEntry } from '../types/game';
import { ALL_ITEMS, ALL_CONSUMABLES } from './items';
import { BASE_PROCESSES } from './cards';
import { createLog } from './combat';
import { applyItemOnAcquisition } from './itemEffects';
import { completeNode } from './network';

// 상점 인벤토리 생성
export function generateShopInventory(playerItems?: Item[]): ShopItem[] {
  const inventory: ShopItem[] = [];
  const ownedItemIds = new Set((playerItems || []).map(item => {
    const originalId = item.id.replace(/^shop_/, '').replace(/_\d+(_\d+)?$/, '');
    return originalId;
  }));

  const uncommonItems = ALL_ITEMS.filter(i => i.rarity === 'uncommon' && !ownedItemIds.has(i.id));
  const rareItems = ALL_ITEMS.filter(i => i.rarity === 'rare' && !ownedItemIds.has(i.id));

  if (uncommonItems.length > 0) {
    const randomUncommon = uncommonItems[Math.floor(Math.random() * uncommonItems.length)];
    if (randomUncommon) {
      inventory.push({
        item: { ...randomUncommon, id: `shop_${randomUncommon.id}_${Date.now()}` },
        itemType: 'item',
        price: 8
      });
    }
  }

  if (rareItems.length > 0) {
    const randomRare = rareItems[Math.floor(Math.random() * rareItems.length)];
    if (randomRare) {
      inventory.push({
        item: { ...randomRare, id: `shop_${randomRare.id}_${Date.now()}` },
        itemType: 'item',
        price: 15
      });
    }
  }

  const advancedProcesses = BASE_PROCESSES.slice(10);
  const shuffledProcesses = [...advancedProcesses].sort(() => Math.random() - 0.5);

  for (let i = 0; i < 2 && i < shuffledProcesses.length; i++) {
    const process = shuffledProcesses[i];
    if (process) {
      inventory.push({
        item: { ...process, id: `shop_${process.id}_${Date.now()}_${i}` },
        itemType: 'process',
        price: 6
      });
    }
  }

  const shuffledConsumables = [...ALL_CONSUMABLES].sort(() => Math.random() - 0.5);

  for (let i = 0; i < 3 && i < shuffledConsumables.length; i++) {
    const consumable = shuffledConsumables[i];
    if (consumable) {
      let price = 3;
      if (consumable.effect.type === 'instant_damage') {
        price = Math.floor(consumable.effect.value / 8) + 2;
      } else if (consumable.effect.type === 'heal') {
        price = Math.floor(consumable.effect.value / 6) + 2;
      } else if (consumable.effect.type === 'gain_btc') {
        price = Math.floor(consumable.effect.value * 1.5);
      } else {
        price = 4;
      }
      inventory.push({
        item: { ...consumable, id: `shop_${consumable.id}_${Date.now()}_${i}` },
        itemType: 'consumable',
        price
      });
    }
  }

  return inventory;
}


// 상점 인벤토리 표시 로그 생성
export function showShopInventory(gameState: GameState): LogEntry[] {
  if (!gameState.shopInventory || gameState.shopInventory.length === 0) {
    return [createLog('warning', '[WARNING] No shop inventory available.')];
  }

  const logs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', '========== BLACK MARKET =========='),
    createLog('player', `Your Bitcoin: ${gameState.player.btc} ₿`),
    createLog('system', ''),
    createLog('warning', '[INVENTORY] Available items:'),
    createLog('system', '')
  ];

  gameState.shopInventory.forEach((shopItem, index) => {
    const { item, itemType, price } = shopItem;
    if (itemType === 'item') {
      const relicItem = item as any;
      logs.push(
        createLog('success', `[${index + 1}] ${relicItem.name} - ${price} ₿`),
        createLog('system', `    ${relicItem.icon} ${relicItem.description}`),
        createLog('player', `    Rarity: ${relicItem.rarity.toUpperCase()}`),
        createLog('system', '')
      );
    } else if (itemType === 'process') {
      const process = item as any;
      const typeTag = process.type === 'attack' ? '[ATK]' : process.type === 'defend' ? '[DEF]' : process.type === 'heal' ? '[HEAL]' : '[UTIL]';
      const attrTag = process.attribute ? `[${process.attribute}]` : '';
      logs.push(
        createLog('success', `[${index + 1}] ${process.name} - ${price} ₿`),
        createLog('system', `    ${typeTag}${attrTag} ${process.executable}`),
        createLog('player', `    Cycles: ${process.cycles} | Throughput: ${process.throughput}`),
        createLog('system', `    ${process.description}`),
        createLog('system', '')
      );
    } else if (itemType === 'consumable') {
      const consumable = item as any;
      logs.push(
        createLog('success', `[${index + 1}] ${consumable.name} - ${price} ₿`),
        createLog('system', `    ${consumable.icon} ${consumable.description}`),
        createLog('player', `    Type: ${consumable.type.toUpperCase()}`),
        createLog('system', '')
      );
    }
  });

  logs.push(
    createLog('warning', '[COMMANDS]'),
    createLog('system', '  /buy [number] - Purchase item'),
    createLog('system', '  /shop, /list, /inventory - Show items'),
    createLog('system', '  /leave - Exit shop'),
    createLog('system', '')
  );

  return logs;
}

// 상점 아이템 구매 처리 결과
export interface PurchaseResult {
  success: boolean;
  newPlayer: any;
  newShopInventory?: ShopItem[];
  logs: LogEntry[];
}

// 상점 아이템 구매 처리
export function handleShopPurchase(
  gameState: GameState,
  itemIndex: number
): PurchaseResult {
  const logs: LogEntry[] = [];

  if (!gameState.shopInventory || itemIndex < 0 || itemIndex >= gameState.shopInventory.length) {
    return {
      success: false,
      newPlayer: gameState.player,
      logs: [createLog('error', '[ERROR] Invalid item number.')]
    };
  }

  const shopItem = gameState.shopInventory[itemIndex];
  const { item, itemType, price } = shopItem;

  if (gameState.player.btc < price) {
    return {
      success: false,
      newPlayer: gameState.player,
      logs: [
        createLog('error', '[INSUFFICIENT FUNDS] Not enough Bitcoin.'),
        createLog('player', `Required: ${price} ₿ | Available: ${gameState.player.btc} ₿`)
      ]
    };
  }

  let newPlayer = { ...gameState.player };
  newPlayer.btc -= price;

  if (itemType === 'item') {
    const relicItem = item as Item;
    newPlayer = applyItemOnAcquisition(newPlayer, relicItem);
    newPlayer.items = [...newPlayer.items, relicItem];
    logs.push(
      createLog('success', `[PURCHASED] ${relicItem.name}`),
      createLog('system', `[PAYMENT] -${price} ₿`),
      createLog('player', `[WALLET] Remaining: ${newPlayer.btc} ₿`),
      createLog('success', '[EQUIPPED] Item effects are now active!')
    );
    const integrityEffect = relicItem.effects.find(e => e.type === 'max_integrity');
    if (integrityEffect) {
      logs.push(createLog('success', `[INTEGRITY] Increased by ${integrityEffect.value}`));
    }
    const threadsEffect = relicItem.effects.find(e => e.type === 'max_threads');
    if (threadsEffect) {
      logs.push(createLog('success', `[THREADS] Max increased by ${threadsEffect.value}`));
    }
  } else if (itemType === 'process') {
    newPlayer.library = [...newPlayer.library, item as any];
    logs.push(
      createLog('success', `[PURCHASED] ${(item as any).name}`),
      createLog('system', `[PAYMENT] -${price} ₿`),
      createLog('player', `[WALLET] Remaining: ${newPlayer.btc} ₿`),
      createLog('success', '[ADDED] Process added to library!')
    );
  } else if (itemType === 'consumable') {
    newPlayer.consumables = [...newPlayer.consumables, item as any];
    logs.push(
      createLog('success', `[PURCHASED] ${(item as any).name}`),
      createLog('system', `[PAYMENT] -${price} ₿`),
      createLog('player', `[WALLET] Remaining: ${newPlayer.btc} ₿`),
      createLog('success', '[ADDED] Consumable added to inventory!')
    );
  }

  const newShopInventory = gameState.shopInventory.filter((_, i) => i !== itemIndex);

  return {
    success: true,
    newPlayer,
    newShopInventory,
    logs
  };
}

// 상점 진입 처리
export function handleEnterBlackMarket(gameState: GameState): { shopInventory: ShopItem[], logs: LogEntry[] } {
  const shopInventory = generateShopInventory(gameState.player.items);
  const shopLogs = [
    createLog('system', ''),
    createLog('success', '[CONNECTING] Accessing Black Market server...'),
    createLog('success', '[CONNECTED] Welcome to the Black Market'),
    createLog('player', `[WALLET] Your balance: ${gameState.player.btc || 0} ₿`),
    createLog('system', ''),
    createLog('success', '========== BLACK MARKET INVENTORY ==========')
  ];

  shopInventory.forEach((shopItem, index) => {
    const item = shopItem.item;
    const typePrefix = shopItem.itemType === 'item' ? '🔧' : shopItem.itemType === 'process' ? '💻' : '📦';
    shopLogs.push(createLog('player', `${index + 1}. ${typePrefix} ${item.name} - ${shopItem.price} ₿`));
    if (shopItem.itemType === 'process') {
      const process = item as any;
      const typeTag = process.type === 'attack' ? '[ATK]' : process.type === 'defend' ? '[DEF]' : process.type === 'heal' ? '[HEAL]' : '[UTIL]';
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

  return {
    shopInventory,
    logs: shopLogs
  };
}

// 상점 나가기 처리
export function handleLeaveShop(gameState: GameState): { logs: LogEntry[], updatedMap: any } {
  const updatedMap = completeNode(gameState.networkMap!, gameState.currentNode!.id);
  const logs = [
    createLog('system', ''),
    createLog('success', '[DISCONNECTED] Leaving Black Market...'),
    createLog('system', '[SYSTEM] Node compromised. Returning to network map...')
  ];
  return { logs, updatedMap };
}