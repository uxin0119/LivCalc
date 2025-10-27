import { GameItem, Consumable, ConsumableType } from '../types/game.types';

/**
 * Calculate value density (value per weight) of an item
 */
export const getValueDensity = (item: GameItem): number => {
    return (item.value / item.weight) || 0;
};

/**
 * Process loot pickup with smart inventory management
 * Returns updated inventory and backpack arrays, plus log messages
 */
export const processLootPickup = (
    lootItem: GameItem,
    currentInventory: GameItem[],
    currentBackpack: GameItem[],
    loadoutItems: GameItem[],
    carryCapacity: number,
    formatTime: (seconds: number) => string,
    elapsedTime: number
): {
    inventory: GameItem[];
    backpack: GameItem[];
    logMessages: string[];
} => {
    const inventory = [...currentInventory];
    const backpack = [...currentBackpack];
    const logMessages: string[] = [];

    // Calculate current weight
    const currentWeight = [...loadoutItems, ...backpack, ...inventory]
        .reduce((sum, item) => sum + item.weight, 0);

    // If can carry the item, just add it
    if (currentWeight + lootItem.weight <= carryCapacity) {
        inventory.push(lootItem);
        logMessages.push(`[${formatTime(elapsedTime)}] Looted [${lootItem.name}].`);
        return { inventory, backpack, logMessages };
    }

    // Find droppable items (non-consumable or generic consumables)
    const droppableItems = [...inventory, ...backpack].filter(
        item => !(item.type === 'Consumable' && item.consumableType !== 'Generic')
    );

    if (droppableItems.length === 0) {
        logMessages.push(`[${formatTime(elapsedTime)}] Found [${lootItem.name}] but couldn't carry it (no droppable items).`);
        return { inventory, backpack, logMessages };
    }

    // Find the worst item by value density
    const worstItem = droppableItems.reduce((worst, current) =>
        getValueDensity(current) < getValueDensity(worst) ? current : worst
    );

    // Only swap if the new item is better
    if (getValueDensity(lootItem) > getValueDensity(worstItem)) {
        // Remove the worst item
        const worstItemIndexInInv = inventory.findIndex(i => i.id === worstItem.id);
        if (worstItemIndexInInv > -1) {
            inventory.splice(worstItemIndexInInv, 1);
        } else {
            const worstItemIndexInBp = backpack.findIndex(i => i.id === worstItem.id);
            if (worstItemIndexInBp > -1) {
                backpack.splice(worstItemIndexInBp, 1);
            }
        }
        inventory.push(lootItem);
        logMessages.push(`[${formatTime(elapsedTime)}] Dropped [${worstItem.name}] for [${lootItem.name}].`);
    } else {
        logMessages.push(`[${formatTime(elapsedTime)}] Found [${lootItem.name}] but left it (low value).`);
    }

    return { inventory, backpack, logMessages };
};

/**
 * Consume a raid item (from inventory or backpack)
 * Returns updated arrays and whether consumption was successful
 */
export const consumeRaidItem = (
    consumableType: ConsumableType,
    currentInventory: GameItem[],
    currentBackpack: GameItem[],
    onUse: (item: Consumable) => void
): {
    inventory: GameItem[];
    backpack: GameItem[];
    consumed: boolean;
} => {
    const inventory = [...currentInventory];
    const backpack = [...currentBackpack];
    const allConsumables = [...backpack, ...inventory];

    const itemIndex = allConsumables.findIndex(
        i => i.type === 'Consumable' && i.consumableType === consumableType
    );

    if (itemIndex === -1) {
        return { inventory, backpack, consumed: false };
    }

    const item = allConsumables[itemIndex] as Consumable;
    item.charges -= 1;
    onUse(item);

    if (item.charges <= 0) {
        // Find and remove the item from its original location
        const backpackIndex = backpack.findIndex(i => i.id === item.id);
        if (backpackIndex > -1) {
            backpack.splice(backpackIndex, 1);
        } else {
            const invIndex = inventory.findIndex(i => i.id === item.id);
            if (invIndex > -1) {
                inventory.splice(invIndex, 1);
            }
        }
    }

    return { inventory, backpack, consumed: true };
};

/**
 * Check if player should auto-evacuate based on critical conditions
 */
export const shouldAutoEvacuate = (
    overallHpPercent: number,
    medkitCharges: number,
    currentWeight: number,
    carryCapacity: number
): {
    shouldEvac: boolean;
    reason?: string;
} => {
    const isCriticalHp = overallHpPercent < 20;
    const isBleedingWithoutMeds = medkitCharges === 0 && overallHpPercent < 30;
    const isOverEncumbered = currentWeight >= carryCapacity;

    if (isCriticalHp) {
        return { shouldEvac: true, reason: "Critical condition!" };
    }
    if (isBleedingWithoutMeds) {
        return { shouldEvac: true, reason: "Critical condition!" };
    }
    if (isOverEncumbered) {
        return { shouldEvac: true, reason: "Inventory full." };
    }

    return { shouldEvac: false };
};
