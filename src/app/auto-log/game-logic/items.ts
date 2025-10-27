// 아이템 (렐릭) 정의 및 관리

import { Item, Consumable } from '../types/game';

// 모든 아이템 정의
export const ALL_ITEMS: Item[] = [
  // Common Items
  {
    id: 'cpu_cooler',
    name: 'cpu_cooler',
    description: '+10 Max Integrity. Keeps your system running cool under pressure.',
    icon: '🌡️',
    rarity: 'common',
    effects: [{ type: 'max_integrity', value: 10 }]
  },
  {
    id: 'ram_stick',
    name: 'extra_ram_stick',
    description: '+1 Max Threads. More memory for concurrent operations.',
    icon: '💾',
    rarity: 'common',
    effects: [{ type: 'max_threads', value: 1 }]
  },
  {
    id: 'antivirus',
    name: 'basic_antivirus',
    description: 'Start each combat with 3 Firewall.',
    icon: '🛡️',
    rarity: 'common',
    effects: [{ type: 'start_firewall', value: 3 }]
  },
  {
    id: 'cache_module',
    name: 'cache_module',
    description: 'Draw 1 extra process at the start of each turn.',
    icon: '📦',
    rarity: 'common',
    effects: [{ type: 'draw_extra', value: 1 }]
  },

  // Uncommon Items
  {
    id: 'overclock_chip',
    name: 'overclock_chip',
    description: '+3 Throughput to all attack processes.',
    icon: '⚡',
    rarity: 'uncommon',
    effects: [{ type: 'throughput_boost', value: 3 }]
  },
  {
    id: 'kernel_optimizer',
    name: 'kernel_optimizer',
    description: 'All processes cost 1 less Cycle (minimum 1).',
    icon: '⚙️',
    rarity: 'uncommon',
    effects: [{ type: 'cycles_reduction', value: 1 }]
  },
  {
    id: 'recovery_daemon',
    name: 'recovery_daemon',
    description: 'Restore 10 Integrity after defeating an enemy.',
    icon: '💚',
    rarity: 'uncommon',
    effects: [{ type: 'heal_on_kill', value: 10 }]
  },
  {
    id: 'encryption_key',
    name: 'encryption_key',
    description: '+5 Firewall at the start of each combat.',
    icon: '🔑',
    rarity: 'uncommon',
    effects: [{ type: 'start_firewall', value: 5 }]
  },
  {
    id: 'solid_state_drive',
    name: 'solid_state_drive',
    description: '+20 Max Integrity. High-speed, high-capacity storage.',
    icon: '💽',
    rarity: 'uncommon',
    effects: [{ type: 'max_integrity', value: 20 }]
  },

  // Rare Items
  {
    id: 'quantum_processor',
    name: 'quantum_processor',
    description: '+2 Max Threads. Parallel processing at quantum speeds.',
    icon: '🔮',
    rarity: 'rare',
    effects: [{ type: 'max_threads', value: 2 }]
  },
  {
    id: 'neural_network',
    name: 'neural_network',
    description: 'WEB attacks deal 50% more damage.',
    icon: '🧠',
    rarity: 'rare',
    effects: [{ type: 'damage_boost', value: 50, attribute: 'WEB' }]
  },
  {
    id: 'root_access_token',
    name: 'root_access_token',
    description: 'SYSTEM attacks deal 50% more damage.',
    icon: '🔐',
    rarity: 'rare',
    effects: [{ type: 'damage_boost', value: 50, attribute: 'SYSTEM' }]
  },
  {
    id: 'network_card',
    name: 'advanced_network_card',
    description: 'NETWORK attacks deal 50% more damage.',
    icon: '📡',
    rarity: 'rare',
    effects: [{ type: 'damage_boost', value: 50, attribute: 'NETWORK' }]
  },
  {
    id: 'firewall_appliance',
    name: 'hardware_firewall',
    description: 'All defense processes grant 50% more Firewall.',
    icon: '🧱',
    rarity: 'rare',
    effects: [{ type: 'defense_boost', value: 50 }]
  },
  {
    id: 'redundant_array',
    name: 'redundant_array',
    description: '+30 Max Integrity. RAID configuration for maximum reliability.',
    icon: '📚',
    rarity: 'rare',
    effects: [{ type: 'max_integrity', value: 30 }]
  },

  // Boss Items
  {
    id: 'master_boot_record',
    name: 'master_boot_record',
    description: '+50 Max Integrity, +1 Max Threads. Total system control.',
    icon: '👑',
    rarity: 'boss',
    effects: [
      { type: 'max_integrity', value: 50 },
      { type: 'max_threads', value: 1 }
    ]
  },
  {
    id: 'zero_day_exploit',
    name: 'zero_day_exploit',
    description: '+5 Throughput to all attacks, -1 Cycle cost to all processes.',
    icon: '💀',
    rarity: 'boss',
    effects: [
      { type: 'throughput_boost', value: 5 },
      { type: 'cycles_reduction', value: 1 }
    ]
  },
  {
    id: 'honeypot_system',
    name: 'honeypot_system',
    description: 'Start combat with 10 Firewall. Immune to WEB vulnerabilities.',
    icon: '🍯',
    rarity: 'boss',
    effects: [
      { type: 'start_firewall', value: 10 },
      { type: 'vulnerability_immunity', value: 0, attribute: 'WEB' }
    ]
  }
];

// 레어도별 아이템 풀
export const COMMON_ITEMS = ALL_ITEMS.filter(i => i.rarity === 'common');
export const UNCOMMON_ITEMS = ALL_ITEMS.filter(i => i.rarity === 'uncommon');
export const RARE_ITEMS = ALL_ITEMS.filter(i => i.rarity === 'rare');
export const BOSS_ITEMS = ALL_ITEMS.filter(i => i.rarity === 'boss');

// 랜덤 아이템 선택
export function getRandomItem(rarity: 'common' | 'uncommon' | 'rare' | 'boss'): Item {
  const pool = rarity === 'common' ? COMMON_ITEMS :
                rarity === 'uncommon' ? UNCOMMON_ITEMS :
                rarity === 'rare' ? RARE_ITEMS : BOSS_ITEMS;

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

// 아이템 선택지 생성 (3개) - 이미 소유한 아이템 제외
export function generateItemRewards(rarity: 'common' | 'uncommon' | 'rare' = 'common', playerItems?: Item[]): Item[] {
  const pool = rarity === 'common' ? COMMON_ITEMS :
                rarity === 'uncommon' ? UNCOMMON_ITEMS : RARE_ITEMS;

  // 플레이어가 이미 소유한 아이템 ID 목록
  const ownedItemIds = new Set((playerItems || []).map(item => {
    // reward_xxx_timestamp 또는 shop_xxx_timestamp 형태에서 원본 ID 추출
    const originalId = item.id.replace(/^(shop|reward)_/, '').replace(/_\d+(_\d+)?$/, '');
    return originalId;
  }));

  // 이미 소유한 아이템 제외
  const availableItems = pool.filter(item => !ownedItemIds.has(item.id));

  const rewards: Item[] = [];
  const itemsCopy = [...availableItems];

  for (let i = 0; i < 3 && itemsCopy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * itemsCopy.length);
    const selectedItem = itemsCopy[randomIndex];

    rewards.push({
      ...selectedItem,
      id: `${selectedItem.id}_reward_${Date.now()}_${i}`
    });

    // 중복 방지
    itemsCopy.splice(randomIndex, 1);
  }

  return rewards;
}

// ========== 소모품 정의 ==========

export const ALL_CONSUMABLES: Consumable[] = [
  // Social Engineering (사회공학)
  {
    id: 'phishing_email',
    name: 'Phishing_Email',
    description: 'Send a convincing phishing email. Deal 15 damage instantly.',
    icon: '📧',
    type: 'social_engineering',
    effect: { type: 'instant_damage', value: 15 }
  },
  {
    id: 'social_exploit',
    name: 'Social_Exploit',
    description: 'Manipulate an insider. Deal 20 damage instantly.',
    icon: '🎭',
    type: 'social_engineering',
    effect: { type: 'instant_damage', value: 20 }
  },
  {
    id: 'credential_theft',
    name: 'Credential_Theft',
    description: 'Steal login credentials. Weaken enemy by 5 attack for 3 turns.',
    icon: '🔑',
    type: 'social_engineering',
    effect: { type: 'weaken', value: 5, duration: 3 }
  },

  // Sabotage (사보타주)
  {
    id: 'power_surge',
    name: 'Power_Surge',
    description: 'Overload the power supply. Deal 25 damage instantly.',
    icon: '⚡',
    type: 'sabotage',
    effect: { type: 'instant_damage', value: 25 }
  },
  {
    id: 'hardware_damage',
    name: 'Hardware_Damage',
    description: 'Physically damage server hardware. Deal 30 damage instantly.',
    icon: '🔨',
    type: 'sabotage',
    effect: { type: 'instant_damage', value: 30 }
  },
  {
    id: 'cooling_failure',
    name: 'Cooling_System_Failure',
    description: 'Disable cooling systems. Weaken enemy by 8 attack for 2 turns.',
    icon: '🌡️',
    type: 'sabotage',
    effect: { type: 'weaken', value: 8, duration: 2 }
  },
  {
    id: 'firewall_disrupt',
    name: 'Firewall_Disruptor',
    description: 'Remove all enemy firewall protection.',
    icon: '💥',
    type: 'sabotage',
    effect: { type: 'remove_firewall', value: 999 }
  },

  // Exploits (익스플로잇)
  {
    id: 'zero_day',
    name: 'Zero-Day_Package',
    description: 'Use an unknown vulnerability. Deal 35 damage instantly.',
    icon: '💀',
    type: 'exploit',
    effect: { type: 'instant_damage', value: 35 }
  },
  {
    id: 'backdoor_access',
    name: 'Backdoor_Access',
    description: 'Exploit a hidden backdoor. Gain 2 BTC.',
    icon: '🚪',
    type: 'exploit',
    effect: { type: 'gain_btc', value: 2 }
  },

  // Utility (유틸리티)
  {
    id: 'system_patch',
    name: 'emergency_patch',
    description: 'Apply emergency system repairs. Restore 20 Integrity.',
    icon: '🩹',
    type: 'utility',
    effect: { type: 'heal', value: 20 }
  },
  {
    id: 'overclock_consumable',
    name: 'overclock_injection',
    description: 'Temporarily boost performance. Gain 2 Threads this combat.',
    icon: '⚡',
    type: 'utility',
    effect: { type: 'gain_threads', value: 2 }
  },
  {
    id: 'process_cache',
    name: 'process_cache',
    description: 'Load processes from cache. Draw 3 processes.',
    icon: '📦',
    type: 'utility',
    effect: { type: 'draw_cards', value: 3 }
  },
  {
    id: 'crypto_miner',
    name: 'quick_crypto_mine',
    description: 'Run a quick mining operation. Gain 3 BTC.',
    icon: '⛏️',
    type: 'utility',
    effect: { type: 'gain_btc', value: 3 }
  }
];

// 시작 아이템 선택지 (2개)
export function generateStarterItems(): Item[] {
  const starterPool = [
    ALL_ITEMS.find(i => i.id === 'cpu_cooler')!,
    ALL_ITEMS.find(i => i.id === 'ram_stick')!,
    ALL_ITEMS.find(i => i.id === 'antivirus')!,
    ALL_ITEMS.find(i => i.id === 'cache_module')!
  ];

  // 랜덤으로 2개 선택
  const shuffled = [...starterPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}
