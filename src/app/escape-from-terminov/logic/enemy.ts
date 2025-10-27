import { Enemy, Loadout, BodyParts, Weapon, Armor } from '../types/game.types';
import { MASTER_ITEMS } from '../data';

export const enemyNames = ['Scav', 'Raider', 'Cultist', 'PMC'];

export const weaponPool: Weapon[] = [
    MASTER_ITEMS.Makarov,
    MASTER_ITEMS.SKS,
    MASTER_ITEMS.MP153,
];

export const armorPool: Armor[] = [
    MASTER_ITEMS.PACA,
    MASTER_ITEMS.Helmet_6B47,
];

export const initialBodyParts: BodyParts = {
    Head: { hp: 35, maxHp: 35, injuries: [] },
    Torso: { hp: 80, maxHp: 80, injuries: [] },
    LeftArm: { hp: 60, maxHp: 60, injuries: [] },
    RightArm: { hp: 60, maxHp: 60, injuries: [] },
    LeftLeg: { hp: 65, maxHp: 65, injuries: [] },
    RightLeg: { hp: 65, maxHp: 65, injuries: [] },
};

// Helper function to clone item with new ID and optional overrides
export const cloneItem = <T extends { id: string }>(item: T, overrides?: Partial<T>): T => {
    return { ...JSON.parse(JSON.stringify(item)), ...overrides, id: `${item.id}_${Date.now()}_${Math.random()}` };
};

export const generateHumanEnemy = (): Enemy => {
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

    // 80% chance to have a weapon
    if (Math.random() < 0.8) {
        const weapon = cloneItem(weaponPool[Math.floor(Math.random() * weaponPool.length)], {
            chamberedAmmo: Math.floor(Math.random() * 20) + 5 // 5-24 rounds
        });
        (loadout as any)[weapon.slot] = weapon;
        damage = weapon.damage;
        accuracy = 65; // Higher accuracy with a gun
    }

    // 50% chance to have armor
    if (Math.random() < 0.5) {
        const armor = cloneItem(armorPool[Math.floor(Math.random() * armorPool.length)]);
        (loadout as any)[armor.slot] = armor;
    }

    // Generate random visibility and distance
    const visibility = Math.floor(Math.random() * 40) + 60; // 60-100%
    const distance = Math.floor(Math.random() * 45) + 5; // 5-50m

    // 30% chance enemy starts undetected (hasn't noticed the player yet)
    const detected = Math.random() > 0.3;

    return {
        id: `enemy_${Date.now()}`,
        name,
        hp,
        maxHp: hp,
        bodyParts,
        loadout,
        damage,
        accuracy,
        visibility,
        distance,
        currentAction: 'attack',
        detected,
        inventory: [],
    };
};
