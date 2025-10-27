import { ItemRarity, GameItem, Consumable, Weapon, Armor, Loadout, EncounterType, Enemy } from '../types/game.types';
import { MASTER_ITEMS } from '../data';
import { armorPool, initialBodyParts, weaponPool, enemyNames } from '../constants';

/**
 * Get color class based on item rarity
 */
export function getRarityColor(rarity: ItemRarity): string {
  switch (rarity) {
    case 'Common':
      return 'text-gray-400';
    case 'Uncommon':
      return 'text-green-400';
    case 'Rare':
      return 'text-blue-400';
    case 'Epic':
      return 'text-purple-400';
    case 'Legendary':
      return 'text-orange-400';
    default:
      return 'text-white';
  }
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Helper function to clone item with new ID and optional overrides
export const cloneItem = <T extends GameItem>(item: T, overrides?: Partial<T>): T => {
    return { ...JSON.parse(JSON.stringify(item)), ...overrides, id: `${item.id}_${Date.now()}_${Math.random()}` };
};

export const generateHumanEnemy = (isExposed: boolean, encounterType: EncounterType, playerVisibility: number): Enemy => {
    const name = enemyNames[Math.floor(Math.random() * enemyNames.length)];
    const bodyParts = JSON.parse(JSON.stringify(initialBodyParts));
    const hp = Object.values(bodyParts).reduce((sum: number, part: any) => sum + part.hp, 0);

    const loadout = {
      'Primary': null,
      'Secondary': null,
      'Melee': null,
      'Helmet': null,
      'Body Armor': null,
      'Backpack': null
    } as Loadout;
    let damage = 5;
    let accuracy = 50; // Base enemy accuracy

    const inventory: GameItem[] = [];

    // 80% chance to have a weapon
    if (Math.random() < 0.8) {
        const weapon = cloneItem(weaponPool[Math.floor(Math.random() * weaponPool.length)]);
        
        // Load the weapon and give spare ammo
        if (weapon.caliber && weapon.caliber !== 'N/A') {
            weapon.chamberedAmmo = weapon.maxAmmo;
            const ammoType = Object.values(MASTER_ITEMS).find(item => item.type === 'Consumable' && item.consumableType === 'Ammo' && item.caliber === weapon.caliber) as Consumable | undefined;
            if (ammoType) {
                inventory.push(cloneItem(ammoType)); // Add one stack of ammo
                if (Math.random() < 0.5) {
                    inventory.push(cloneItem(ammoType)); // 50% chance for a second stack
                }
            }
        }

        (loadout as any)[weapon.slot] = weapon;
        damage = weapon.damage;
        accuracy = 65; // Higher accuracy with a gun
    }

    // 50% chance to have armor
    if (Math.random() < 0.5) {
        const armor = cloneItem(armorPool[Math.floor(Math.random() * armorPool.length)]);
        (loadout as any)[armor.slot] = armor;
    }

    // Generate random visibility and distance based on encounter type
    let visibility = 70;
    let distance = 40;
    let detected = true;

    switch (encounterType) {
        case 'ambush':
            distance = Math.floor(Math.random() * 10) + 5; // 5-15m
            visibility = Math.floor(Math.random() * 20) + 80; // 80-100%
            detected = true;
            break;
        case 'spot_distant':
            distance = Math.floor(Math.random() * 100) + 100; // 100-200m
            visibility = Math.floor(Math.random() * 30) + 40; // 40-70%
            detected = false;
            break;
        case 'heard_close':
            distance = Math.floor(Math.random() * 7) + 3; // 3-10m
            visibility = Math.floor(Math.random() * 40) + 10; // 10-50%
            detected = false;
            break;
        case 'mutual_detection':
            distance = Math.floor(Math.random() * 40) + 20; // 20-60m
            visibility = Math.floor(Math.random() * 30) + 60; // 60-90%
            detected = true;
            break;
    }

    // If player is already exposed, the enemy is always detected, overriding the scenario default
    if (isExposed) {
        detected = true;
    } else {
        const baseDetectionChance = encounterType === 'ambush' || encounterType === 'mutual_detection' ? 100 : 30;
        const finalDetectionChance = Math.max(10, Math.min(95, baseDetectionChance + playerVisibility));
        detected = Math.random() * 100 < finalDetectionChance;
    }

    return {
        id: `enemy_${Date.now()}`,
        name,
        hp,
        maxHp: hp,
        bodyParts,
        loadout,
        inventory,
        damage,
        accuracy,
        visibility,
        distance,
        currentAction: 'attack',
        detected,
        attackCooldown: 0,
    };
};

export const groupItems = (items: GameItem[], groupConsumables: boolean = true) => {
    return items.reduce((acc, item) => {
        // For consumables with charges, use unique key including charges if not grouping
        let key = item.name;
        if (!groupConsumables && item.type === 'Consumable' && 'charges' in item) {
            key = `${item.name}_${item.id}`; // Use unique ID to prevent grouping
        }

        if (!acc[key]) {
            acc[key] = { ...item, count: 0 };
        }
        acc[key].count! += 1;
        return acc;
    }, {} as Record<string, GameItem & { count?: number }>);
  };

export const getItemTypeDisplay = (item: GameItem): string => {
    if (item.type === 'Weapon') return 'Weapon';
    if (item.type === 'Armor') return 'Armor';
    if (item.type === 'Consumable') {
        switch (item.consumableType) {
            case 'Ammo': return 'Ammo';
            case 'Medkit':
            case 'Bandage':
            case 'Splint':
            case 'SurgeryKit':
            case 'Painkiller': return 'Medical';
            case 'Food': return 'Food';
            case 'Attachment': return 'Attachment';
            default: return 'Junk';
        }
    }
    return 'Item';
  };

export const filterItemsByCategory = (items: GameItem[], category: 'All' | 'Weapons' | 'Armor' | 'Consumables' | 'Medical' | 'Junk') => {
    if (category === 'All') return items;

    return items.filter(item => {
      if (category === 'Weapons') {
        return item.type === 'Weapon';
      } else if (category === 'Armor') {
        return item.type === 'Armor';
      } else if (category === 'Medical') {
        return item.type === 'Consumable' && (
          item.consumableType === 'Medkit' ||
          item.consumableType === 'Bandage' ||
          item.consumableType === 'Splint' ||
          item.consumableType === 'SurgeryKit' ||
          item.consumableType === 'Painkiller'
        );
      } else if (category === 'Consumables') {
        return item.type === 'Consumable' && (
          item.consumableType === 'Food' ||
          item.consumableType === 'Ammo' ||
          item.consumableType === 'Attachment'
        );
      } else if (category === 'Junk') {
        return item.type === 'Consumable' && item.consumableType === 'Generic';
      }
      return false;
    });
  };