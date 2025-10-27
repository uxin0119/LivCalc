import { Consumable } from '../types/game.types';

// ===== CONSUMABLES =====
// Medical items, food, and junk

export const CONSUMABLES = {
  // === MEDICAL ===
  Medkit: {
    id: 'cons_medkit',
    name: 'Medkit.dll',
    type: 'Consumable',
    consumableType: 'Medkit',
    effect: 'heal_25',
    charges: 100,
    maxCharges: 100,
    rarity: 'Common',
    value: 7000,
    weight: 0.8
  } as Consumable,

  Medkit_AI2: {
    id: 'cons_medkit_ai2',
    name: 'AI-2 Medkit',
    type: 'Consumable',
    consumableType: 'Medkit',
    effect: 'heal_50',
    charges: 100,
    maxCharges: 100,
    rarity: 'Common',
    value: 10000,
    weight: 0.5
  } as Consumable,

  Bandage: {
    id: 'cons_bandage',
    name: 'Bandage.sys',
    type: 'Consumable',
    consumableType: 'Bandage',
    effect: 'stop_bleeding',
    charges: 5,
    maxCharges: 5,
    rarity: 'Common',
    value: 3500,
    weight: 0.1
  } as Consumable,

  Splint: {
    id: 'cons_splint',
    name: 'Splint.lib',
    type: 'Consumable',
    consumableType: 'Splint',
    effect: 'fix_fracture',
    charges: 2,
    maxCharges: 2,
    rarity: 'Common',
    value: 4000,
    weight: 0.6
  } as Consumable,

  Painkiller: {
    id: 'cons_painkiller',
    name: 'Painkiller.pill',
    type: 'Consumable',
    consumableType: 'Painkiller',
    effect: 'ignore_pain_180',
    charges: 4,
    maxCharges: 4,
    rarity: 'Common',
    value: 3800,
    weight: 0.1
  } as Consumable,

  // === FOOD ===
  FoodRation: {
    id: 'cons_food_ration',
    name: 'FoodRation.dat',
    type: 'Consumable',
    consumableType: 'Food',
    effect: 'eat',
    charges: 2,
    maxCharges: 2,
    rarity: 'Common',
    value: 3500,
    weight: 0.5
  } as Consumable,

  Tushonka: {
    id: 'cons_tushonka',
    name: 'Tushonka',
    type: 'Consumable',
    consumableType: 'Food',
    effect: 'eat',
    charges: 1,
    maxCharges: 1,
    rarity: 'Common',
    value: 4500,
    weight: 0.4
  } as Consumable,

  // === JUNK - Common (3,500 - 7,500 Roubles) ===
  ScrapMetal: {
    id: 'junk_scrap_metal',
    name: 'Scrap.metal',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Common',
    value: 3500,
    weight: 4.7
  } as Consumable,

  BrokenCircuit: {
    id: 'junk_broken_circuit',
    name: 'Broken_Circuit.bin',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Common',
    value: 4200,
    weight: 0.8
  } as Consumable,

  OldBattery: {
    id: 'junk_old_battery',
    name: 'Old_Battery.pwr',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Common',
    value: 5500,
    weight: 1.2
  } as Consumable,

  DamagedCable: {
    id: 'junk_damaged_cable',
    name: 'Damaged_Cable.wire',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Common',
    value: 6800,
    weight: 0.5
  } as Consumable,

  CrackedScreen: {
    id: 'junk_cracked_screen',
    name: 'Cracked_Screen.lcd',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Common',
    value: 7500,
    weight: 1.5
  } as Consumable,

  // === JUNK - Uncommon (15,000 - 42,000 Roubles) ===
  GPUFragment: {
    id: 'junk_gpu_fragment',
    name: 'GPU_Fragment.chip',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Uncommon',
    value: 15000,
    weight: 0.3
  } as Consumable,

  CorruptedDrive: {
    id: 'junk_corrupted_drive',
    name: 'Corrupted_Drive.hdd',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Uncommon',
    value: 22000,
    weight: 1.8
  } as Consumable,

  EncryptedChip: {
    id: 'junk_encrypted_chip',
    name: 'Encrypted_Chip.sec',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Uncommon',
    value: 28000,
    weight: 0.2
  } as Consumable,

  PowerCore: {
    id: 'junk_power_core',
    name: 'Power_Core.energy',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Uncommon',
    value: 35000,
    weight: 2.5
  } as Consumable,

  MemoryModule: {
    id: 'junk_memory_module',
    name: 'Memory_Module.ram',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Uncommon',
    value: 42000,
    weight: 0.6
  } as Consumable,

  // === JUNK - Rare (58,000 - 95,000 Roubles) ===
  QuantumProcessor: {
    id: 'junk_quantum_processor',
    name: 'Quantum_Processor.qpu',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 58000,
    weight: 0.4
  } as Consumable,

  NeuralInterface: {
    id: 'junk_neural_interface',
    name: 'Neural_Interface.bio',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 72000,
    weight: 0.8
  } as Consumable,

  HolographicCore: {
    id: 'junk_holographic_core',
    name: 'Holographic_Core.holo',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 85000,
    weight: 1.2
  } as Consumable,

  AIDataMatrix: {
    id: 'junk_ai_data_matrix',
    name: 'AI_Data_Matrix.ai',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Rare',
    value: 95000,
    weight: 0.5
  } as Consumable,

  // === JUNK - Epic (Special high-value items) ===
  CryptoKey: {
    id: 'junk_crypto_key',
    name: 'Crypto_Key.vault',
    type: 'Consumable',
    consumableType: 'Generic',
    effect: '',
    charges: 1,
    maxCharges: 1,
    rarity: 'Epic',
    weight: 0.1
  } as Consumable,

  SurgeryKit: {
    id: 'cons_surgery_kit',
    name: 'Surgery Kit',
    type: 'Consumable',
    consumableType: 'SurgeryKit',
    effect: 'fix_crippled',
    charges: 5,
    maxCharges: 5,
    rarity: 'Epic',
    value: 150000,
    weight: 1.0
  } as Consumable,
};