import { Attachment } from '../types/game.types';

// ===== ATTACHMENTS =====
// Weapon attachments with various effects

export const ATTACHMENTS = {
  // === SCOPES ===
  RedDot: {
    id: 'attach_reddot',
    name: 'Red Dot Sight',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Scope',
    magnification: 1,
    optimalRangeMin: 0,
    optimalRangeMax: 30,
    accuracyBonus: 15,
    effect: 'Low-mag optic',
    charges: 1,
    maxCharges: 1,
    rarity: 'Common',
    value: 7500,
    weight: 0.2
  } as Attachment,

  Holo: {
    id: 'attach_holo',
    name: 'Holographic Sight',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Scope',
    magnification: 1.5,
    optimalRangeMin: 0,
    optimalRangeMax: 40,
    accuracyBonus: 18,
    effect: 'Holo optic',
    charges: 1,
    maxCharges: 1,
    rarity: 'Uncommon',
    value: 18000,
    weight: 0.3
  } as Attachment,

  ACOG: {
    id: 'attach_acog',
    name: 'ACOG 4x Scope',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Scope',
    magnification: 4,
    optimalRangeMin: 25,
    optimalRangeMax: 80,
    accuracyBonus: 25,
    effect: '4x magnification',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 65000,
    weight: 0.4
  } as Attachment,

  PSO: {
    id: 'attach_pso',
    name: 'PSO 6x Scope',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Scope',
    magnification: 6,
    optimalRangeMin: 40,
    optimalRangeMax: 120,
    accuracyBonus: 35,
    effect: '6x magnification',
    charges: 1,
    maxCharges: 1,
    rarity: 'Epic',
    value: 110000,
    weight: 0.5
  } as Attachment,

  ELCAN: {
    id: 'attach_elcan',
    name: 'ELCAN SpecterDR',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Scope',
    magnification: 4,
    optimalRangeMin: 10,
    optimalRangeMax: 70,
    accuracyBonus: 22,
    effect: 'Variable magnification',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 72000,
    weight: 0.45
  } as Attachment,

  // === MUZZLE DEVICES ===
  Suppressor: {
    id: 'attach_suppressor',
    name: 'Suppressor.sys',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Muzzle',
    recoilReduction: 15,
    stealthOnFirstShot: true,
    visibilityModifier: -30,
    effect: 'Stealth first shot',
    charges: 1,
    maxCharges: 1,
    rarity: 'Uncommon',
    value: 25000,
    weight: 0.3
  } as Attachment,

  Compensator: {
    id: 'attach_compensator',
    name: 'Compensator.dll',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Muzzle',
    recoilReduction: 20,
    effect: 'recoil-20',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 40000,
    weight: 0.2
  } as Attachment,

  FlashHider: {
    id: 'attach_flashhider',
    name: 'Flash Hider',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Muzzle',
    recoilReduction: 10,
    visibilityModifier: -10,
    effect: 'Reduced flash',
    charges: 1,
    maxCharges: 1,
    rarity: 'Common',
    value: 6000,
    weight: 0.2
  } as Attachment,

  MuzzleBrake: {
    id: 'attach_muzzle_brake',
    name: 'Muzzle Brake',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Muzzle',
    recoilReduction: 25,
    visibilityModifier: 5,
    effect: 'High recoil reduction',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 55000,
    weight: 0.25
  } as Attachment,

  // === TACTICAL DEVICES ===
  Laser: {
    id: 'attach_laser',
    name: 'Laser Sight.exe',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Tactical',
    accuracyBonus: 8,
    visibilityModifier: 15,
    effect: 'Visible laser beam',
    charges: 1,
    maxCharges: 1,
    rarity: 'Uncommon',
    value: 16000,
    weight: 0.1
  } as Attachment,

  Flashlight: {
    id: 'attach_flashlight',
    name: 'Tactical Flashlight',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Tactical',
    enemyVisibilityBonus: 20,
    visibilityModifier: 25,
    effect: 'Light up area',
    charges: 1,
    maxCharges: 1,
    rarity: 'Common',
    value: 5500,
    weight: 0.15
  } as Attachment,

  ComboDevice: {
    id: 'attach_combo_device',
    name: 'Combo Device (Laser+Light)',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Tactical',
    accuracyBonus: 6,
    enemyVisibilityBonus: 15,
    visibilityModifier: 30,
    effect: 'Laser + flashlight',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 45000,
    weight: 0.2
  } as Attachment,

  // === GRIPS (Foregrips) ===
  VerticalGrip: {
    id: 'attach_vertical_grip',
    name: 'Vertical Grip',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Grip',
    recoilReduction: 12,
    accuracyBonus: 5,
    effect: 'Vertical foregrip',
    charges: 1,
    maxCharges: 1,
    rarity: 'Common',
    value: 7000,
    weight: 0.15
  } as Attachment,

  AngledGrip: {
    id: 'attach_angled_grip',
    name: 'Angled Grip',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Grip',
    recoilReduction: 8,
    accuracyBonus: 10,
    effect: 'Angled foregrip',
    charges: 1,
    maxCharges: 1,
    rarity: 'Uncommon',
    value: 19000,
    weight: 0.12
  } as Attachment,

  TacticalGrip: {
    id: 'attach_tactical_grip',
    name: 'Tactical Grip',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Grip',
    recoilReduction: 15,
    accuracyBonus: 8,
    effect: 'Advanced grip',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 38000,
    weight: 0.18
  } as Attachment,

  // === STOCKS ===
  PolymerStock: {
    id: 'attach_polymer_stock',
    name: 'Polymer Stock',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Stock',
    recoilReduction: 10,
    effect: 'Lightweight stock',
    charges: 1,
    maxCharges: 1,
    rarity: 'Common',
    value: 6500,
    weight: 0.3
  } as Attachment,

  TacticalStock: {
    id: 'attach_tactical_stock',
    name: 'Tactical Stock',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Stock',
    recoilReduction: 18,
    accuracyBonus: 5,
    effect: 'Adjustable stock',
    charges: 1,
    maxCharges: 1,
    rarity: 'Uncommon',
    value: 22000,
    weight: 0.4
  } as Attachment,

  PrecisionStock: {
    id: 'attach_precision_stock',
    name: 'Precision Stock',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Stock',
    recoilReduction: 22,
    accuracyBonus: 10,
    effect: 'High-end stock',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 62000,
    weight: 0.5
  } as Attachment,

  // === MAGAZINES (Extended capacity) ===
  ExtendedMag_9mm: {
    id: 'attach_extended_mag_9mm',
    name: 'Extended 9mm Magazine',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Magazine',
    effect: '+10 mag capacity',
    charges: 1,
    maxCharges: 1,
    rarity: 'Uncommon',
    value: 15000,
    weight: 0.2
  } as Attachment,

  ExtendedMag_556: {
    id: 'attach_extended_mag_556',
    name: 'Extended 5.56 Magazine (60rnd)',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Magazine',
    effect: '+30 mag capacity',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 48000,
    weight: 0.4
  } as Attachment,

  ExtendedMag_762: {
    id: 'attach_extended_mag_762',
    name: 'Extended 7.62 Magazine (50rnd)',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Magazine',
    effect: '+20 mag capacity',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 45000,
    weight: 0.5
  } as Attachment,

  DrumMag_12g: {
    id: 'attach_drum_mag_12g',
    name: '12g Drum Magazine (20rnd)',
    type: 'Consumable',
    consumableType: 'Attachment',
    attachmentSlot: 'Magazine',
    effect: '+10 mag capacity',
    charges: 1,
    maxCharges: 1,
    rarity: 'Epic',
    value: 95000,
    weight: 0.8
  } as Attachment,
};