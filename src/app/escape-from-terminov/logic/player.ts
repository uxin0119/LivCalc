import { PlayerState, GameItem, Weapon, Armor, WeaponSlot, ArmorSlot, AttachmentSlot, Attachment, Consumable, ConsumableType, BodyPart, BodyParts } from '../types/game.types';

/**
 * Calculate experience and level progression
 */
export const calculateLevelUp = (
    currentExp: number,
    currentLevel: number,
    currentExpToNextLevel: number,
    expGained: number
): { level: number; exp: number; expToNextLevel: number } => {
    let newExp = currentExp + expGained;
    let newLevel = currentLevel;
    let newExpToNextLevel = currentExpToNextLevel;

    while (newExp >= newExpToNextLevel) {
        newExp -= newExpToNextLevel;
        newLevel++;
        newExpToNextLevel = Math.floor(newExpToNextLevel * 1.5);
    }

    return { level: newLevel, exp: newExp, expToNextLevel: newExpToNextLevel };
};

/**
 * Unequip an item from loadout and add to stash
 */
export const unequipItemFromLoadout = (
    state: PlayerState,
    slot: WeaponSlot | ArmorSlot
): PlayerState => {
    const newState = { ...state, stash: [...state.stash], loadout: { ...state.loadout } };
    const item = (newState.loadout as any)[slot];
    if (item) {
        newState.stash.push(item as GameItem);
        (newState.loadout as any)[slot] = null;
    }
    return newState;
};

/**
 * Equip an item to loadout from stash
 */
export const equipItemToLoadout = (
    state: PlayerState,
    item: GameItem,
    slot: WeaponSlot | ArmorSlot
): PlayerState => {
    const newState = { ...state, stash: [...state.stash], loadout: { ...state.loadout } };
    const currentlyEquipped = (newState.loadout as any)[slot];
    if (currentlyEquipped) newState.stash.push(currentlyEquipped as GameItem);
    (newState.loadout as any)[slot] = item;
    newState.stash = newState.stash.filter(i => i.id !== item.id);
    return newState;
};

/**
 * Equip an attachment to a weapon
 */
export const equipAttachmentToWeapon = (
    state: PlayerState,
    weaponId: string,
    attachment: Attachment
): { state: PlayerState; updatedWeapon: Weapon | null } => {
    const newState = { ...state };
    const slot = attachment.attachmentSlot;

    // Find the weapon in loadout
    let weaponInLoadout: Weapon | null = null;
    let loadoutSlot: WeaponSlot | null = null;

    for (const [key, value] of Object.entries(newState.loadout)) {
        if (value && value.id === weaponId && value.type === 'Weapon') {
            weaponInLoadout = { ...value } as Weapon;
            loadoutSlot = key as WeaponSlot;
            break;
        }
    }

    if (!weaponInLoadout || !loadoutSlot) {
        return { state, updatedWeapon: null };
    }

    // Initialize attachments if not present
    if (!weaponInLoadout.attachments) {
        weaponInLoadout.attachments = { Scope: null, Muzzle: null, Tactical: null, Grip: null, Stock: null, Magazine: null };
    }

    // If there's already an attachment in this slot, return it to stash
    const existingAttachment = weaponInLoadout.attachments[slot];
    if (existingAttachment) {
        newState.stash.push(existingAttachment);
    }

    // Equip the new attachment
    weaponInLoadout.attachments[slot] = attachment;

    // Remove attachment from stash
    const attachmentIndex = newState.stash.findIndex(i => i.id === attachment.id);
    if (attachmentIndex !== -1) {
        newState.stash.splice(attachmentIndex, 1);
    }

    // Update the weapon in loadout
    (newState.loadout as any)[loadoutSlot] = weaponInLoadout;

    return { state: newState, updatedWeapon: weaponInLoadout };
};

/**
 * Unequip an attachment from a weapon
 */
export const unequipAttachmentFromWeapon = (
    state: PlayerState,
    weaponId: string,
    slot: AttachmentSlot
): { state: PlayerState; updatedWeapon: Weapon | null } => {
    const newState = { ...state };

    // Find the weapon in loadout
    let weaponInLoadout: Weapon | null = null;
    let loadoutSlot: WeaponSlot | null = null;

    for (const [key, value] of Object.entries(newState.loadout)) {
        if (value && value.id === weaponId && value.type === 'Weapon') {
            weaponInLoadout = { ...value } as Weapon;
            loadoutSlot = key as WeaponSlot;
            break;
        }
    }

    if (!weaponInLoadout || !loadoutSlot || !weaponInLoadout.attachments) {
        return { state, updatedWeapon: null };
    }

    const attachment = weaponInLoadout.attachments[slot];
    if (attachment) {
        // Return attachment to stash
        newState.stash.push(attachment);

        // Remove from weapon
        weaponInLoadout.attachments[slot] = null;

        // Update the weapon in loadout
        (newState.loadout as any)[loadoutSlot] = weaponInLoadout;
    }

    return { state: newState, updatedWeapon: weaponInLoadout };
};

/**
 * Move items from stash to backpack
 */
export const moveItemsToBackpack = (
    state: PlayerState,
    itemName: string,
    quantity: number = 1
): PlayerState => {
    const newState = { ...state, stash: [...state.stash], backpack: [...state.backpack] };
    let movedCount = 0;
    for (let i = newState.stash.length - 1; i >= 0 && movedCount < quantity; i--) {
        if (newState.stash[i].name === itemName) {
            const [itemToMove] = newState.stash.splice(i, 1);
            newState.backpack.push(itemToMove);
            movedCount++;
        }
    }
    return newState;
};

/**
 * Move items from backpack to stash
 */
export const moveItemsFromBackpack = (
    state: PlayerState,
    itemName: string,
    quantity: number = 1
): PlayerState => {
    const newState = { ...state, stash: [...state.stash], backpack: [...state.backpack] };
    let movedCount = 0;
    for (let i = newState.backpack.length - 1; i >= 0 && movedCount < quantity; i--) {
        if (newState.backpack[i].name === itemName) {
            const [itemToMove] = newState.backpack.splice(i, 1);
            newState.stash.push(itemToMove);
            movedCount++;
        }
    }
    return newState;
};

/**
 * Buy an item from merchant
 */
export const buyItemFromMerchant = (
    state: PlayerState,
    item: GameItem,
    quantity: number = 1
): PlayerState | null => {
    const totalCost = item.value * quantity;
    if (state.roubles < totalCost) {
        return null; // Not enough money
    }
    const newItems = Array.from({ length: quantity }, (_, i) => ({
        ...item,
        id: item.id + Date.now() + i
    }));
    return {
        ...state,
        roubles: state.roubles - totalCost,
        stash: [...state.stash, ...newItems]
    };
};

/**
 * Sell an item to merchant
 */
export const sellItemToMerchant = (
    state: PlayerState,
    item: GameItem
): PlayerState => {
    const sellPrice = Math.floor(item.value * 0.5);
    return {
        ...state,
        roubles: state.roubles + sellPrice,
        stash: state.stash.filter(i => i.id !== item.id)
    };
};

/**
 * Heal a body part with a consumable from stash
 */
export const healBodyPartWithItem = (
    state: PlayerState,
    consumableType: ConsumableType,
    partToHeal: BodyPart
): PlayerState | null => {
    const newState = { ...state, stash: [...state.stash], bodyParts: { ...state.bodyParts } };
    const itemIndex = newState.stash.findIndex(i => i.type === 'Consumable' && i.consumableType === consumableType);

    if (itemIndex === -1) return null;

    const item = newState.stash[itemIndex] as Consumable;
    const part = { ...newState.bodyParts[partToHeal] };

    let healed = false;
    if (consumableType === 'Medkit' && part.hp < part.maxHp) {
        const healAmount = 25;
        const needed = part.maxHp - part.hp;
        const actualHeal = Math.min(needed, healAmount, item.charges);
        part.hp += actualHeal;
        item.charges -= actualHeal;
        healed = true;
    } else if (consumableType === 'Bandage' && part.injuries.includes('Bleeding')) {
        part.injuries = part.injuries.filter(inj => inj !== 'Bleeding');
        item.charges -= 1;
        healed = true;
    } else if (consumableType === 'Splint' && part.injuries.includes('Fracture')) {
        part.injuries = part.injuries.filter(inj => inj !== 'Fracture');
        item.charges -= 1;
        healed = true;
    } else if (consumableType === 'SurgeryKit' && part.injuries.includes('Crippled')) {
        part.injuries = part.injuries.filter(inj => inj !== 'Crippled');
        part.hp = Math.max(1, part.hp);
        item.charges -= 1;
        healed = true;
    }

    if (!healed) return null;

    if (item.charges <= 0) {
        newState.stash.splice(itemIndex, 1);
    } else {
        newState.stash[itemIndex] = item;
    }

    newState.bodyParts[partToHeal] = part;
    return newState;
};

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Group items by name and sum their counts
 */
export const groupItems = (items: GameItem[], groupConsumables: boolean = true): Record<string, GameItem & { count?: number }> => {
    return items.reduce((acc, item) => {
        const key = item.name;
        if (!acc[key]) {
            acc[key] = { ...item };
            if (item.type === 'Consumable' && groupConsumables) {
                acc[key].count = 1;
            }
        } else {
            if (item.type === 'Consumable' && groupConsumables) {
                acc[key].count = (acc[key].count || 0) + 1;
            }
        }
        return acc;
    }, {} as Record<string, GameItem & { count?: number }>);
};
