export type UpgradeType = 'clickDamage' | 'autoAttack' | 'criticalChance' | 'goldMultiplier';

//--- System Monitor Dungeon Types ---

export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
export type ItemType = 'Weapon' | 'Armor' | 'Consumable';
export type WeaponSlot = 'Primary' | 'Secondary' | 'Melee';
export type WeaponCategory = 'Rifle' | 'SMG' | 'Sniper' | 'Shotgun' | 'Pistol' | 'Melee';
export type FireMode = 'BoltAction' | 'PumpAction' | 'SemiAuto' | 'FullAuto' | 'Melee';
export type ArmorSlot = 'Helmet' | 'Body Armor' | 'Backpack';
export type ConsumableType = 'Food' | 'Medkit' | 'Bandage' | 'Splint' | 'SurgeryKit' | 'Ammo' | 'Generic' | 'Painkiller' | 'Attachment';
export type AttachmentSlot = 'Scope' | 'Muzzle' | 'Tactical' | 'Grip' | 'Stock' | 'Magazine';

export type BodyPart = 'Head' | 'Torso' | 'LeftArm' | 'RightArm' | 'LeftLeg' | 'RightLeg';
export type InjuryType = 'Bleeding' | 'Fracture' | 'Crippled' | 'IncurableBleeding';
export type RaidStatus = 'idle' | 'in-progress' | 'evacuating' | 'finished' | 'in-combat';
export type CombatAction = 'attack' | 'take_cover' | 'flee' | 'reload' | 'exposed' | 'advance' | 'retreat';
export type EncounterType = 'ambush' | 'spot_distant' | 'heard_close' | 'mutual_detection';

export interface BodyPartStatus {
    hp: number;
    maxHp: number;
    injuries: InjuryType[];
}

export interface BodyParts {
    Head: BodyPartStatus;
    Torso: BodyPartStatus;
    LeftArm: BodyPartStatus;
    RightArm: BodyPartStatus;
    LeftLeg: BodyPartStatus;
    RightLeg: BodyPartStatus;
}

export interface BaseItem {
  id: string;
  name: string;
  rarity: ItemRarity;
  value: number; // Gold value
  weight: number;
}

export interface Attachment extends BaseItem {
  type: 'Consumable';
  consumableType: 'Attachment';
  attachmentSlot: AttachmentSlot;
  accuracyBonus?: number; // Accuracy bonus in %
  recoilReduction?: number; // Recoil reduction in %
  visibilityModifier?: number; // Player visibility modifier (positive = more visible, negative = less visible)
  enemyVisibilityBonus?: number; // Enemy visibility bonus (helps spot enemies)
  magnification?: number; // Scope magnification (1 = red dot, 4 = ACOG, etc.)
  optimalRangeMin?: number; // Optimal range start in meters
  optimalRangeMax?: number; // Optimal range end in meters
  stealthOnFirstShot?: boolean; // If true, reduces detection chance on first shot (suppressors)
  effect: string;
  charges: number;
  maxCharges: number;
}

export interface WeaponAttachments {
  Scope?: Attachment | null;
  Muzzle?: Attachment | null;
  Tactical?: Attachment | null;
  Grip?: Attachment | null;
  Stock?: Attachment | null;
  Magazine?: Attachment | null;
}

export interface Weapon extends BaseItem {
  type: 'Weapon';
  slot: WeaponSlot;
  category: WeaponCategory; // Weapon category (Rifle, SMG, Sniper, Shotgun, Pistol, Melee)
  damage: number;
  caliber: string;
  durability: number;
  maxDurability: number;
  chamberedAmmo?: number;
  maxAmmo?: number;
  fireRate?: number; // Rounds per minute (RPM)
  fireMode?: FireMode; // Fire mode (BoltAction, PumpAction, SemiAuto, FullAuto, Melee)
  recoil?: number; // Recoil value (0-100, higher = more recoil)
  burstCount?: number; // Number of rounds fired per attack (1 = semi-auto, 3+ = burst/auto)
  optimalRangeMin?: number; // Optimal range start in meters (for accuracy calculation)
  optimalRangeMax?: number; // Optimal range end in meters (for accuracy calculation)
  attachments?: WeaponAttachments; // Weapon attachments
  availableSlots?: AttachmentSlot[]; // Which attachment slots this weapon supports
}

export interface Armor extends BaseItem {
  type: 'Armor';
  slot: ArmorSlot;
  defense: number;
  durability: number;
  maxDurability: number;
  carryCapacityBonus?: number; // For backpacks: additional carry capacity in kg
}

export interface Consumable extends BaseItem {
  type: 'Consumable';
  consumableType: ConsumableType;
  effect: string; 
  charges: number;
  maxCharges?: number;
  caliber?: string; // For ammo
}

export type GameItem = Weapon | Armor | Consumable;

export interface Loadout {
  Primary: Weapon | null;
  Secondary: Weapon | null;
  Melee: Weapon | null;
  Helmet: Armor | null;
  'Body Armor': Armor | null;
  Backpack: Armor | null;
}

export interface PlayerState {
  level: number;
  exp: number;
  expToNextLevel: number;
  roubles: number;
  stats: {
    maxHp: number;
    maxStamina: number;
    carryCapacity: number;
    accuracy: number;
    attackCooldown?: number; // Time in seconds until next attack
  };
  bodyParts: BodyParts;
  stash: GameItem[];
  backpack: GameItem[];
  loadout: Loadout;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  damage: number;
  accuracy: number;
  bodyParts: BodyParts;
  loadout: Loadout;
  inventory: GameItem[];
  visibility: number; // 0-100%
  distance: number; // in meters
  currentAction: CombatAction;
  detected: boolean; // Whether enemy has detected the player
  attackCooldown?: number; // Time in seconds until next attack
}

export interface Merchant {
    name: string;
    type: 'Weapons' | 'Armor' | 'Medical' | 'Junk';
    inventory: GameItem[];
}