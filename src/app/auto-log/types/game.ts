// 게임 타입 정의

export type CommandType = 'attack' | 'defend' | 'heal' | 'special' | 'auto' | 'skip';

export type VulnerabilityType = 'WEB' | 'SYSTEM' | 'NETWORK';

export interface Process {
  id: string;
  name: string;
  type: 'attack' | 'defend' | 'heal' | 'utility';
  cycles: number;
  throughput: number;
  description: string;
  executable: string; // 명령어 이름 (예: attack_heavy.exe)
  attribute?: VulnerabilityType; // 공격 속성
  specialEffect?: string; // 특수 효과 식별자
}

export type StatusEffectType =
  | 'damage_boost' // 다음 공격력 증가 (advanced_shield)
  | 'weaken' // 적 공격력 감소 (mitm_attack)
  | 'draw_next_turn' // 다음 턴 드로우 (packet_send)
  | 'prevent_defense'; // 방어 불가 (stack_smash)

export interface StatusEffect {
  id: string;
  type: StatusEffectType;
  value: number; // 효과 값 (예: 데미지 증가량, 공격력 감소율)
  duration: number; // 지속 턴
  source: string; // 효과를 유발한 프로세스/아이템 ID
}

export interface Enemy {
  id: string;
  name: string;
  integrity: number;
  maxIntegrity: number;
  attack: number;
  firewall: number; // 현재 방어도
  pattern: EnemyPattern[];
  description: string;
  vulnerabilities: VulnerabilityType[]; // 취약점 (2배 데미지)
  weaknesses: VulnerabilityType[]; // 약점 (1.5배 데미지)
  resistances: VulnerabilityType[]; // 저항 (0.5배 데미지)
  buffs: StatusEffect[];
  debuffs: StatusEffect[];
}

export interface EnemyPattern {
  type: 'attack' | 'defend' | 'special';
  value: number;
  condition?: (enemy: Enemy, player: Player) => boolean;
}

export interface Player {
  integrity: number;
  maxIntegrity: number;
  threads: number;
  maxThreads: number;
  library: Process[];
  queue: Process[];
  terminated: Process[];
  firewall: number; // 현재 방어도
  permanentFirewall?: number; // 영구 방어도 (전투 시작 시 자동 부여)
  items: Item[]; // 장착한 아이템들
  btc: number; // 비트코인 화폐
  consumables: Consumable[]; // 소모품들
  buffs: StatusEffect[];
  debuffs: StatusEffect[];
}
export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'system' | 'player' | 'enemy' | 'combat' | 'error' | 'success' | 'warning';
  message: string;
  animate?: boolean;
}

export interface GameState {
  phase: 'menu' | 'deck_building' | 'starter_selection' | 'map' | 'combat' | 'reward' | 'event' | 'shop' | 'rest' | 'game_over' | 'victory';
  player: Player;
  currentEnemy: Enemy | null;
  currentNode: NetworkNode | null;
  networkMap: NetworkMap | null;
  logs: LogEntry[];
  turn: number;
  progression: Progression;
  starterOptions?: Item[]; // 시작 아이템 선택지
  shopInventory?: ShopItem[]; // 상점 인벤토리
  combatCount: number; // 전투 횟수 (난이도 조절용)
  currentEvent?: any; // 현재 이벤트 (GameEvent from events.ts)
}

export interface Progression {
  level: number;
  experience: number;
  gold: number;
  unlocks: Unlocks;
  permanentUpgrades: PermanentUpgrade[];
  runsCompleted: number;
  highestFloor: number;
}

export interface Unlocks {
  scriptEditor: boolean;
  macroSystem: boolean;
  advancedCommands: boolean;
  aiAutopilot: boolean;
  customCommands: boolean;
}

export interface PermanentUpgrade {
  id: string;
  name: string;
  description: string;
  effect: string;
  cost: number;
  purchased: boolean;
}

// 네트워크 노드 (IP 주소 기반)
export interface NetworkNode {
  id: string;
  ip: string; // 예: "192.168.1.10"
  type: 'combat' | 'elite' | 'event' | 'shop' | 'rest' | 'boss';
  name: string; // 예: "firewall_server.sys"
  description: string;
  status: 'locked' | 'available' | 'compromised' | 'current';
  connections: string[]; // 연결된 노드 IP들
  requiresCompleted?: number; // 필요한 완료 노드 수
  layer: number; // 네트워크 깊이 (0 = 시작, 1-2 = 중간, 3 = 보스)
}

export interface NetworkMap {
  floor: number;
  nodes: NetworkNode[];
  currentNodeId: string;
  completedCount: number;
}

export interface Script {
  id: string;
  name: string;
  lines: ScriptLine[];
  enabled: boolean;
}

export interface ScriptLine {
  condition: string;
  action: string;
  enabled: boolean;
}

export interface Macro {
  id: string;
  name: string;
  commands: string[];
  enabled: boolean;
}

export interface Reward {
  type: 'process' | 'gold' | 'upgrade' | 'remove';
  options: (Process | number)[];
}

// 아이템 (렐릭) 시스템
export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'boss';
  effects: ItemEffect[];
}

export interface ItemEffect {
  type: 'max_integrity' | 'max_threads' | 'start_firewall' | 'draw_extra' | 'throughput_boost' | 'cycles_reduction' | 'heal_on_kill' | 'damage_boost' | 'defense_boost' | 'vulnerability_immunity';
  value: number;
  attribute?: VulnerabilityType;
}

// 소모품 시스템 (사회공학, 사보타주 등)
export interface Consumable {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'social_engineering' | 'sabotage' | 'exploit' | 'utility';
  effect: ConsumableEffect;
}

export interface ConsumableEffect {
  type: 'instant_damage' | 'weaken' | 'heal' | 'gain_btc' | 'draw_cards' | 'gain_threads' | 'remove_firewall';
  value: number;
  duration?: number; // 턴 지속 (디버프용)
}

// 상점 아이템
export interface ShopItem {
  item: Item | Process | Consumable;
  itemType: 'item' | 'process' | 'consumable';
  price: number;
}

// 유틸리티 타입
export type GamePhase = GameState['phase'];
export type NodeType = NetworkNode['type'];
export type NodeStatus = NetworkNode['status'];
