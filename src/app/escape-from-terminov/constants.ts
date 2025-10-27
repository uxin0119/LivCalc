import { PlayerState, Loadout, GameItem, Weapon, Armor, BodyParts, Merchant } from './types/game.types';
import { MASTER_ITEMS } from './data';
import { cloneItem } from './utils/helpers';

export const MISSION_START_LOGO = ["Mission Started"];
export const COMBAT_START_LOGO = ["Combat Started"];
export const COMBAT_END_LOGO = ["Combat Ended"];
export const EVAC_START_LOGO = ["Evacuation Started"];
export const EVAC_SUCCESS_LOGO = ["Evacuation Successful"];

// Aliases for backwards compatibility
export const deployLogo = MISSION_START_LOGO;
export const evacLogo = EVAC_START_LOGO;
export const kiaLogo = ["Agent KIA"];
export const extLogo = EVAC_SUCCESS_LOGO;

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

export const initialPlayerState: PlayerState = {
  level: 1,
  exp: 0,
  expToNextLevel: 100,
  roubles: 500000,
  stats: {
    maxHp: 100,
    maxStamina: 100,
    carryCapacity: 30,
    accuracy: 85, // Player base accuracy
    attackCooldown: 0,
  },
  bodyParts: initialBodyParts,
  stash: [
    cloneItem(MASTER_ITEMS.Makarov, { chamberedAmmo: 0 }),
    cloneItem(MASTER_ITEMS.PACA),
    cloneItem(MASTER_ITEMS.FoodRation),
    cloneItem(MASTER_ITEMS.Medkit),
    cloneItem(MASTER_ITEMS.Bandage),
    cloneItem(MASTER_ITEMS.Splint),
    cloneItem(MASTER_ITEMS.Painkiller),
    cloneItem(MASTER_ITEMS.Ammo_9x18_PST),
    cloneItem(MASTER_ITEMS.Ammo_762x39_PS),
  ],
  backpack: [],
  loadout: {
    'Primary': cloneItem(MASTER_ITEMS.AK47, { chamberedAmmo: 0 }),
    'Secondary': null,
    'Melee': cloneItem(MASTER_ITEMS.CombatKnife),
    'Helmet': cloneItem(MASTER_ITEMS.Helmet_T3),
    'Body Armor': null,
    'Backpack': cloneItem(MASTER_ITEMS.Backpack_Scav),
  } as Loadout,
};

export const lootTable: GameItem[] = [
    // Common Junk (60% total - 6 items, each 10%)
    MASTER_ITEMS.ScrapMetal,
    MASTER_ITEMS.RustyPipe,
    MASTER_ITEMS.BrokenCircuit,
    MASTER_ITEMS.OldBattery,
    MASTER_ITEMS.DamagedCable,
    MASTER_ITEMS.CrackedScreen,

    // Uncommon Junk (30% total - duplicated for higher probability)
    MASTER_ITEMS.GPUFragment,
    MASTER_ITEMS.GPUFragment,
    MASTER_ITEMS.CorruptedDrive,
    MASTER_ITEMS.EncryptedChip,
    MASTER_ITEMS.PowerCore,
    MASTER_ITEMS.MemoryModule,

    // Rare Junk (9% total)
    MASTER_ITEMS.QuantumProcessor,
    MASTER_ITEMS.NeuralInterface,
    MASTER_ITEMS.HolographicCore,

    // Epic Junk (1% - very rare)
    MASTER_ITEMS.CryptoKey,

    // Ammo (Common consumables)
    MASTER_ITEMS.Ammo_9x18_PRS,
    MASTER_ITEMS.Ammo_762x39_HP,
    MASTER_ITEMS.Ammo_12g_Buckshot,

    // Medical (Common/Uncommon)
    MASTER_ITEMS.Bandage,
    MASTER_ITEMS.Splint,
    MASTER_ITEMS.Medkit,
];

export const areaNames = ['corridor_a', 'mess_hall', 'server_room_03', 'medical_bay', 'barracks_west', 'storage_closet', 'main_control_room'];
export const containerNames = ['weapon_crate', 'ammo_box', 'supply_cache', 'toolbox', 'medical_kit', 'duffel_bag', 'safe', 'locker', 'PC_unit', 'desk_drawer'];

export const merchants: Merchant[] = [
    {
        name: 'Prapor',
        type: 'Weapons' as const,
        inventory: [
            MASTER_ITEMS.Makarov,
            MASTER_ITEMS.Glock17,
            MASTER_ITEMS.SKS,
            MASTER_ITEMS.M4A1,
            MASTER_ITEMS.Axe,
            MASTER_ITEMS.Ammo_9x18_PST,
            MASTER_ITEMS.Ammo_9x19_PST,
            MASTER_ITEMS.Ammo_762x39_PS,
            MASTER_ITEMS.Ammo_762x39_HP,
            MASTER_ITEMS.Ammo_556x45_M855,
            MASTER_ITEMS.Ammo_12g_Buckshot,
        ]
    },
    {
        name: 'Ragman',
        type: 'Armor' as const,
        inventory: [
            MASTER_ITEMS.PACA,
            MASTER_ITEMS.Helmet_6B47,
            MASTER_ITEMS.Backpack_Scav,
            MASTER_ITEMS.Backpack_Berkut,
            MASTER_ITEMS.Backpack_TV110,
        ]
    },
    {
        name: 'Therapist',
        type: 'Medical' as const,
        inventory: [
            MASTER_ITEMS.Medkit_AI2,
            MASTER_ITEMS.Tushonka,
            MASTER_ITEMS.Bandage,
            MASTER_ITEMS.Splint,
            MASTER_ITEMS.Painkiller,
            MASTER_ITEMS.SurgeryKit,
        ]
    },
    {
        name: 'Mechanic',
        type: 'Weapons' as const,
        inventory: [
            MASTER_ITEMS.RedDot,
            MASTER_ITEMS.Holo,
            MASTER_ITEMS.ACOG,
            MASTER_ITEMS.Suppressor,
            MASTER_ITEMS.Compensator,
            MASTER_ITEMS.FlashHider,
            MASTER_ITEMS.Laser,
            MASTER_ITEMS.Flashlight,
            MASTER_ITEMS.VerticalGrip,
        ]
    },
    {
        name: 'Fence',
        type: 'Junk' as const,
        inventory: [
            // Common Junk - Always available at low price
            MASTER_ITEMS.ScrapMetal,
            MASTER_ITEMS.RustyPipe,
            MASTER_ITEMS.BrokenCircuit,
            MASTER_ITEMS.OldBattery,
            MASTER_ITEMS.DamagedCable,
            MASTER_ITEMS.CrackedScreen,
            // Uncommon Junk - Medium price
            MASTER_ITEMS.GPUFragment,
            MASTER_ITEMS.CorruptedDrive,
            MASTER_ITEMS.EncryptedChip,
            MASTER_ITEMS.PowerCore,
            MASTER_ITEMS.MemoryModule,
            // Rare Junk - High price
            MASTER_ITEMS.QuantumProcessor,
            MASTER_ITEMS.NeuralInterface,
            MASTER_ITEMS.HolographicCore,
            MASTER_ITEMS.AIDataMatrix,
            // Epic Junk - Very high price
            MASTER_ITEMS.CryptoKey,
        ]
    }
];