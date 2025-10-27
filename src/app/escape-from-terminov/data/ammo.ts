import { Consumable } from '../types/game.types';

// ===== AMMUNITION =====
// Expanded ammunition types for various calibers

export const AMMO = {
  // === 9x18mm (Makarov) ===
  Ammo_9x18_PST: {
    id: 'ammo_9x18_pst',
    name: '9x18mm PST',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '9x18mm',
    charges: 50,
    maxCharges: 50,
    effect: '',
    rarity: 'Common',
    value: 3500,
    weight: 0.5
  } as Consumable,

  Ammo_9x18_PRS: {
    id: 'ammo_9x18_prs',
    name: '9x18mm PRS',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '9x18mm',
    charges: 20,
    maxCharges: 20,
    effect: '',
    rarity: 'Common',
    value: 1500,
    weight: 0.2
  } as Consumable,

  Ammo_9x18_PMM: {
    id: 'ammo_9x18_pmm',
    name: '9x18mm PMM',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '9x18mm',
    charges: 50,
    maxCharges: 50,
    effect: '',
    rarity: 'Uncommon',
    value: 6000,
    weight: 0.5
  } as Consumable,

  // === 9x19mm (Glock, MP5, PP-19, MPX) ===
  Ammo_9x19_PST: {
    id: 'ammo_9x19_pst',
    name: '9x19mm PST',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '9x19mm',
    charges: 50,
    maxCharges: 50,
    effect: '',
    rarity: 'Common',
    value: 4000,
    weight: 0.5
  } as Consumable,

  Ammo_9x19_AP: {
    id: 'ammo_9x19_ap',
    name: '9x19mm AP 6.3',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '9x19mm',
    charges: 50,
    maxCharges: 50,
    effect: '',
    rarity: 'Rare',
    value: 15000,
    weight: 0.5
  } as Consumable,

  Ammo_9x19_RIP: {
    id: 'ammo_9x19_rip',
    name: '9x19mm RIP',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '9x19mm',
    charges: 20,
    maxCharges: 20,
    effect: '',
    rarity: 'Epic',
    value: 25000,
    weight: 0.2
  } as Consumable,

  // === 7.62x39mm (AK-47, AKM, SKS) ===
  Ammo_762x39_PS: {
    id: 'ammo_762x39_ps',
    name: '7.62x39mm PS',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '7.62x39mm',
    charges: 30,
    maxCharges: 30,
    effect: '',
    rarity: 'Common',
    value: 5000,
    weight: 0.7
  } as Consumable,

  Ammo_762x39_HP: {
    id: 'ammo_762x39_hp',
    name: '7.62x39mm HP',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '7.62x39mm',
    charges: 30,
    maxCharges: 30,
    effect: '',
    rarity: 'Uncommon',
    value: 9000,
    weight: 0.7
  } as Consumable,

  Ammo_762x39_BP: {
    id: 'ammo_762x39_bp',
    name: '7.62x39mm BP',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '7.62x39mm',
    charges: 30,
    maxCharges: 30,
    effect: '',
    rarity: 'Rare',
    value: 18000,
    weight: 0.7
  } as Consumable,

  Ammo_762x39_MAI_AP: {
    id: 'ammo_762x39_mai_ap',
    name: '7.62x39mm MAI AP',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '7.62x39mm',
    charges: 30,
    maxCharges: 30,
    effect: '',
    rarity: 'Epic',
    value: 35000,
    weight: 0.7
  } as Consumable,

  // === 5.56x45mm (M4A1, HK416) ===
  Ammo_556x45_M855: {
    id: 'ammo_556x45_m855',
    name: '5.56x45mm M855',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '5.56x45mm',
    charges: 30,
    maxCharges: 30,
    effect: '',
    rarity: 'Uncommon',
    value: 7500,
    weight: 0.4
  } as Consumable,

  Ammo_556x45_M855A1: {
    id: 'ammo_556x45_m855a1',
    name: '5.56x45mm M855A1',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '5.56x45mm',
    charges: 30,
    maxCharges: 30,
    effect: '',
    rarity: 'Rare',
    value: 16000,
    weight: 0.4
  } as Consumable,

  Ammo_556x45_M995: {
    id: 'ammo_556x45_m995',
    name: '5.56x45mm M995',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '5.56x45mm',
    charges: 30,
    maxCharges: 30,
    effect: '',
    rarity: 'Epic',
    value: 32000,
    weight: 0.4
  } as Consumable,

  Ammo_556x45_MK318: {
    id: 'ammo_556x45_mk318',
    name: '5.56x45mm MK318',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '5.56x45mm',
    charges: 30,
    maxCharges: 30,
    effect: '',
    rarity: 'Rare',
    value: 18000,
    weight: 0.4
  } as Consumable,

  // === 7.62x54mm (SVDS, Mosin) ===
  Ammo_762x54_LPS: {
    id: 'ammo_762x54_lps',
    name: '7.62x54mm LPS Gzh',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '7.62x54mm',
    charges: 20,
    maxCharges: 20,
    effect: '',
    rarity: 'Uncommon',
    value: 12000,
    weight: 0.6
  } as Consumable,

  Ammo_762x54_SNB: {
    id: 'ammo_762x54_snb',
    name: '7.62x54mm SNB',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '7.62x54mm',
    charges: 20,
    maxCharges: 20,
    effect: '',
    rarity: 'Epic',
    value: 40000,
    weight: 0.6
  } as Consumable,

  Ammo_762x54_BT: {
    id: 'ammo_762x54_bt',
    name: '7.62x54mm BT',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '7.62x54mm',
    charges: 20,
    maxCharges: 20,
    effect: '',
    rarity: 'Rare',
    value: 22000,
    weight: 0.6
  } as Consumable,

  // === .308 Win (M700) ===
  Ammo_308_FMJ: {
    id: 'ammo_308_fmj',
    name: '.308 Win FMJ',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '.308 Win',
    charges: 20,
    maxCharges: 20,
    effect: '',
    rarity: 'Rare',
    value: 25000,
    weight: 0.7
  } as Consumable,

  Ammo_308_M80: {
    id: 'ammo_308_m80',
    name: '.308 Win M80',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '.308 Win',
    charges: 20,
    maxCharges: 20,
    effect: '',
    rarity: 'Epic',
    value: 45000,
    weight: 0.7
  } as Consumable,

  Ammo_308_M61: {
    id: 'ammo_308_m61',
    name: '.308 Win M61',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '.308 Win',
    charges: 20,
    maxCharges: 20,
    effect: '',
    rarity: 'Legendary',
    value: 80000,
    weight: 0.7
  } as Consumable,

  // === .45 ACP (USP) ===
  Ammo_45ACP_FMJ: {
    id: 'ammo_45acp_fmj',
    name: '.45 ACP FMJ',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '.45 ACP',
    charges: 50,
    maxCharges: 50,
    effect: '',
    rarity: 'Common',
    value: 4500,
    weight: 0.6
  } as Consumable,

  Ammo_45ACP_AP: {
    id: 'ammo_45acp_ap',
    name: '.45 ACP AP',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '.45 ACP',
    charges: 50,
    maxCharges: 50,
    effect: '',
    rarity: 'Rare',
    value: 14000,
    weight: 0.6
  } as Consumable,

  // === .50 AE (Desert Eagle) ===
  Ammo_50AE_HP: {
    id: 'ammo_50ae_hp',
    name: '.50 AE Hollow Point',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '.50 AE',
    charges: 30,
    maxCharges: 30,
    effect: '',
    rarity: 'Rare',
    value: 20000,
    weight: 0.8
  } as Consumable,

  Ammo_50AE_FMJ: {
    id: 'ammo_50ae_fmj',
    name: '.50 AE FMJ',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '.50 AE',
    charges: 30,
    maxCharges: 30,
    effect: '',
    rarity: 'Rare',
    value: 18000,
    weight: 0.8
  } as Consumable,

  // === 12 Gauge (Shotguns) ===
  Ammo_12g_Buckshot: {
    id: 'ammo_12g_buckshot',
    name: '12g Buckshot',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '12g',
    charges: 10,
    maxCharges: 10,
    effect: '',
    rarity: 'Common',
    value: 6000,
    weight: 0.8
  } as Consumable,

  Ammo_12g_Slug: {
    id: 'ammo_12g_slug',
    name: '12g Slug',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '12g',
    charges: 10,
    maxCharges: 10,
    effect: '',
    rarity: 'Uncommon',
    value: 9000,
    weight: 0.9
  } as Consumable,

  Ammo_12g_Flechette: {
    id: 'ammo_12g_flechette',
    name: '12g Flechette',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '12g',
    charges: 10,
    maxCharges: 10,
    effect: '',
    rarity: 'Rare',
    value: 15000,
    weight: 0.85
  } as Consumable,

  Ammo_12g_AP20: {
    id: 'ammo_12g_ap20',
    name: '12g AP-20',
    type: 'Consumable',
    consumableType: 'Ammo',
    caliber: '12g',
    charges: 10,
    maxCharges: 10,
    effect: '',
    rarity: 'Epic',
    value: 28000,
    weight: 0.9
  } as Consumable,
};