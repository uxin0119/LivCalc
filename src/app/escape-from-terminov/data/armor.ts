import { Armor } from '../types/game.types';

// ===== ARMOR =====
// Helmets, Body Armor, and Backpacks

export const ARMOR = {
  // === HELMETS ===
  Helmet_T3: {
    id: 'arm_helmet_t3',
    name: 'Helmet_T3.dat',
    type: 'Armor',
    slot: 'Helmet',
    defense: 10,
    rarity: 'Uncommon',
    value: 35000,
    weight: 1.5,
    durability: 80,
    maxDurability: 80
  } as Armor,

  Helmet_6B47: {
    id: 'arm_helmet_6b47',
    name: '6B47 Helmet',
    type: 'Armor',
    slot: 'Helmet',
    defense: 12,
    rarity: 'Common',
    value: 15000,
    weight: 1.2,
    durability: 60,
    maxDurability: 60
  } as Armor,

  Helmet_SSh68: {
    id: 'arm_helmet_ssh68',
    name: 'SSh-68 Helmet',
    type: 'Armor',
    slot: 'Helmet',
    defense: 18,
    rarity: 'Rare',
    value: 75000,
    weight: 2.0,
    durability: 100,
    maxDurability: 100
  } as Armor,

  Helmet_Altyn: {
    id: 'arm_helmet_altyn',
    name: 'Altyn Helmet',
    type: 'Armor',
    slot: 'Helmet',
    defense: 25,
    rarity: 'Epic',
    value: 180000,
    weight: 3.5,
    durability: 120,
    maxDurability: 120
  } as Armor,

  // === BODY ARMOR ===
  PACA: {
    id: 'arm_paca',
    name: 'PACA.dat',
    type: 'Armor',
    slot: 'Body Armor',
    defense: 15,
    rarity: 'Common',
    value: 22000,
    weight: 3.0,
    durability: 60,
    maxDurability: 60
  } as Armor,

  Armor_6B13: {
    id: 'arm_6b13',
    name: '6B13 Armor',
    type: 'Armor',
    slot: 'Body Armor',
    defense: 22,
    rarity: 'Uncommon',
    value: 68000,
    weight: 8.5,
    durability: 80,
    maxDurability: 80
  } as Armor,

  Armor_Trooper: {
    id: 'arm_trooper',
    name: 'Trooper Armor',
    type: 'Armor',
    slot: 'Body Armor',
    defense: 28,
    rarity: 'Rare',
    value: 150000,
    weight: 10.2,
    durability: 100,
    maxDurability: 100
  } as Armor,

  Armor_Tactec: {
    id: 'arm_tactec',
    name: 'TACTEC Plate Carrier',
    type: 'Armor',
    slot: 'Body Armor',
    defense: 35,
    rarity: 'Epic',
    value: 350000,
    weight: 12.5,
    durability: 130,
    maxDurability: 130
  } as Armor,

  Armor_Slick: {
    id: 'arm_slick',
    name: 'Slick Plate Carrier',
    type: 'Armor',
    slot: 'Body Armor',
    defense: 32,
    rarity: 'Epic',
    value: 290000,
    weight: 7.8,
    durability: 120,
    maxDurability: 120
  } as Armor,

  // === BACKPACKS ===
  Backpack_Scav: {
    id: 'arm_backpack_scav',
    name: 'Scav Backpack',
    type: 'Armor',
    slot: 'Backpack',
    defense: 0,
    rarity: 'Common',
    value: 8000,
    weight: 1.5,
    durability: 100,
    maxDurability: 100,
    carryCapacityBonus: 15
  } as Armor,

  Backpack_Berkut: {
    id: 'arm_backpack_berkut',
    name: 'Berkut Backpack',
    type: 'Armor',
    slot: 'Backpack',
    defense: 0,
    rarity: 'Uncommon',
    value: 25000,
    weight: 2.0,
    durability: 100,
    maxDurability: 100,
    carryCapacityBonus: 25
  } as Armor,

  Backpack_TV110: {
    id: 'arm_backpack_tv110',
    name: 'Wartech TV-110 Rig',
    type: 'Armor',
    slot: 'Backpack',
    defense: 5,
    rarity: 'Rare',
    value: 60000,
    weight: 2.5,
    durability: 100,
    maxDurability: 100,
    carryCapacityBonus: 35
  } as Armor,

  Backpack_Trizip: {
    id: 'arm_backpack_trizip',
    name: 'Trizip Backpack',
    type: 'Armor',
    slot: 'Backpack',
    defense: 0,
    rarity: 'Rare',
    value: 85000,
    weight: 3.2,
    durability: 100,
    maxDurability: 100,
    carryCapacityBonus: 45
  } as Armor,

  Backpack_Blackjack: {
    id: 'arm_backpack_blackjack',
    name: 'Blackjack Backpack',
    type: 'Armor',
    slot: 'Backpack',
    defense: 0,
    rarity: 'Epic',
    value: 150000,
    weight: 4.5,
    durability: 100,
    maxDurability: 100,
    carryCapacityBonus: 60
  } as Armor,
};