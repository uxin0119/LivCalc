// 적 정의 및 AI 패턴

import { Enemy, EnemyPattern } from '../types/game';

// 기본 적들 (약한 순서대로)
export const ENEMIES: Enemy[] = [
  // Tier 1: 초보자용 (매우 약함)
  {
    id: 'test_server',
    name: 'test_server.dev',
    integrity: 30,
    maxIntegrity: 30,
    attack: 4,
    pattern: [
      { type: 'attack', value: 4 },
      { type: 'defend', value: 3 },
      { type: 'attack', value: 4 }
    ],
    description: 'Development test server. Very weak defenses.',
    vulnerabilities: ['WEB'],
    weaknesses: ['SYSTEM', 'NETWORK'],
    resistances: [],
    firewall: 0,
    buffs: [],
    debuffs: []
  },
  {
    id: 'http_server',
    name: 'simple_http.srv',
    integrity: 35,
    maxIntegrity: 35,
    attack: 5,
    pattern: [
      { type: 'attack', value: 5 },
      { type: 'attack', value: 5 },
      { type: 'attack', value: 6 }
    ],
    description: 'Basic HTTP server. No special defenses.',
    vulnerabilities: ['NETWORK'],
    weaknesses: ['WEB'],
    resistances: [],
    firewall: 0,
    buffs: [],
    debuffs: []
  },

  // Tier 2: 초급 (약함)
  {
    id: 'database_server',
    name: 'legacy_database.sql',
    integrity: 40,
    maxIntegrity: 40,
    attack: 6,
    pattern: [
      { type: 'defend', value: 4 },
      { type: 'attack', value: 6 },
      { type: 'attack', value: 7 }
    ],
    description: 'Outdated database server. Weak to SQL attacks.',
    vulnerabilities: ['WEB'],
    weaknesses: ['SYSTEM'],
    resistances: ['NETWORK'],
    firewall: 0,
    buffs: [],
    debuffs: []
  },
  {
    id: 'web_app_server',
    name: 'webapp_server.js',
    integrity: 45,
    maxIntegrity: 45,
    attack: 7,
    pattern: [
      { type: 'attack', value: 7 },
      { type: 'defend', value: 5 },
      { type: 'attack', value: 8 }
    ],
    description: 'Web application server. Vulnerable to web exploits.',
    vulnerabilities: ['WEB'],
    weaknesses: ['NETWORK'],
    resistances: ['SYSTEM'],
    firewall: 0,
    buffs: [],
    debuffs: []
  },

  // Tier 3: 중급 (보통)
  {
    id: 'legacy_app',
    name: 'legacy_app.exe',
    integrity: 50,
    maxIntegrity: 50,
    attack: 8,
    pattern: [
      { type: 'attack', value: 8 },
      { type: 'attack', value: 9 },
      { type: 'defend', value: 6 }
    ],
    description: 'Old C++ application. Memory vulnerabilities.',
    vulnerabilities: ['SYSTEM'],
    weaknesses: ['WEB'],
    resistances: ['NETWORK'],
    firewall: 0,
    buffs: [],
    debuffs: []
  },
  {
    id: 'api_gateway',
    name: 'api_gateway.py',
    integrity: 55,
    maxIntegrity: 55,
    attack: 9,
    pattern: [
      { type: 'attack', value: 9 },
      { type: 'attack', value: 10 },
      { type: 'defend', value: 7 }
    ],
    description: 'API gateway. Weak to network attacks.',
    vulnerabilities: ['NETWORK'],
    weaknesses: ['WEB'],
    resistances: ['SYSTEM'],
    firewall: 0,
    buffs: [],
    debuffs: []
  },

  // Tier 4: 고급 (강함)
  {
    id: 'file_server',
    name: 'file_server.sh',
    integrity: 60,
    maxIntegrity: 60,
    attack: 10,
    pattern: [
      { type: 'defend', value: 8 },
      { type: 'attack', value: 10 },
      { type: 'attack', value: 11 }
    ],
    description: 'File server. Vulnerable to file inclusion.',
    vulnerabilities: ['NETWORK'],
    weaknesses: ['SYSTEM'],
    resistances: ['WEB'],
    firewall: 0,
    buffs: [],
    debuffs: []
  },
  {
    id: 'auth_server',
    name: 'auth_service.oauth',
    integrity: 65,
    maxIntegrity: 65,
    attack: 11,
    pattern: [
      { type: 'attack', value: 11 },
      { type: 'defend', value: 9 },
      { type: 'attack', value: 12 }
    ],
    description: 'Authentication server. Strong against web attacks.',
    vulnerabilities: ['SYSTEM'],
    weaknesses: ['NETWORK'],
    resistances: ['WEB'],
    firewall: 0,
    buffs: [],
    debuffs: []
  }
];

// 엘리트 적들
export const ELITE_ENEMIES: Enemy[] = [
  {
    id: 'hardened_server',
    name: 'hardened_fortress.sys',
    integrity: 90,
    maxIntegrity: 90,
    attack: 14,
    pattern: [
      { type: 'defend', value: 12 },
      { type: 'attack', value: 14 },
      { type: 'attack', value: 16 },
      { type: 'defend', value: 10 }
    ],
    description: 'Heavily secured server. Defensive pattern.',
    vulnerabilities: [],
    weaknesses: ['SYSTEM', 'WEB'],
    resistances: ['NETWORK'],
    firewall: 0,
    buffs: [],
    debuffs: []
  },
  {
    id: 'microservice_cluster',
    name: 'microservice_mesh.k8s',
    integrity: 85,
    maxIntegrity: 85,
    attack: 15,
    pattern: [
      { type: 'attack', value: 15 },
      { type: 'attack', value: 15 },
      { type: 'defend', value: 11 },
      { type: 'attack', value: 17 }
    ],
    description: 'Distributed microservices. Aggressive attacks.',
    vulnerabilities: ['NETWORK'],
    weaknesses: ['WEB'],
    resistances: [],
    firewall: 0,
    buffs: [],
    debuffs: []
  },
  {
    id: 'security_bot',
    name: 'security_ai.bot',
    integrity: 80,
    maxIntegrity: 80,
    attack: 13,
    pattern: [
      { type: 'attack', value: 13 },
      { type: 'defend', value: 13 },
      { type: 'attack', value: 13 },
      { type: 'defend', value: 13 }
    ],
    description: 'AI-powered security. Balanced offense and defense.',
    vulnerabilities: ['SYSTEM'],
    weaknesses: ['WEB', 'NETWORK'],
    resistances: [],
    firewall: 0,
    buffs: [],
    debuffs: []
  }
];

// 보스
export const BOSS_ENEMIES: Enemy[] = [
  {
    id: 'mainframe',
    name: 'MAINFRAME_CORE.mainframe',
    integrity: 150,
    maxIntegrity: 150,
    attack: 18,
    pattern: [
      { type: 'defend', value: 15 },
      { type: 'attack', value: 18 },
      { type: 'attack', value: 20 },
      { type: 'defend', value: 12 },
      { type: 'attack', value: 22 },
      { type: 'attack', value: 18 }
    ],
    description: 'Central mainframe. Multiple attack phases.',
    vulnerabilities: ['WEB', 'SYSTEM', 'NETWORK'], // 모든 속성에 약함
    weaknesses: [],
    resistances: [],
    firewall: 0,
    buffs: [],
    debuffs: []
  }
];

// 적 AI - 다음 행동 결정
export function getEnemyNextAction(
  enemy: Enemy,
  turnCount: number
): { type: string; value: number; description: string } {
  const patternIndex = turnCount % enemy.pattern.length;
  const pattern = enemy.pattern[patternIndex];

  let description = '';
  switch (pattern.type) {
    case 'attack':
      description = `Preparing attack: ${pattern.value} damage`;
      break;
    case 'defend':
      description = `Raising shields: ${pattern.value} block`;
      break;
    case 'special':
      description = `Charging special attack: ${pattern.value}x2 damage`;
      break;
  }

  return {
    type: pattern.type,
    value: pattern.value,
    description
  };
}

// 적 행동 실행
export function executeEnemyAction(
  enemy: Enemy,
  action: { type: string; value: number },
  player: { integrity: number; firewall: number }
): {
  playerIntegrity: number;
  playerFirewall: number;
  enemyFirewall: number;
  logs: string[];
} {
  const logs: string[] = [];
  let playerIntegrity = player.integrity;
  let playerFirewall = player.firewall;
  let enemyFirewall = enemy.firewall; // Initialize with current enemy firewall

  logs.push(`[ENEMY_TURN] ${enemy.name} is acting...`);

  switch (action.type) {
    case 'attack':
      const damage = Math.max(0, action.value - playerFirewall);
      const blocked = Math.min(action.value, playerFirewall);

      if (blocked > 0) {
        logs.push(`[FIREWALL] Blocked ${blocked} damage`);
        playerFirewall = Math.max(0, playerFirewall - action.value);
      }

      if (damage > 0) {
        playerIntegrity -= damage;
        logs.push(`[DAMAGE] Took ${damage} damage!`);
      }

      logs.push(`[PLAYER] Integrity: ${playerIntegrity} | Firewall: ${playerFirewall}`);
      break;

    case 'defend':
      enemyFirewall += action.value;
      logs.push(`[ENEMY_DEFEND] ${enemy.name} gained ${action.value} firewall. Total: ${enemyFirewall}`);
      break;

    case 'special':
      // 특수 공격 - 방어 무시 일부 데미지
      const specialDamage = action.value;
      const piercingDamage = Math.floor(specialDamage * 0.5);
      const regularDamage = Math.max(0, specialDamage - piercingDamage - playerFirewall);

      playerIntegrity -= piercingDamage;
      logs.push(`[SPECIAL] Armor-piercing attack: ${piercingDamage} damage!`);

      if (regularDamage > 0) {
        playerIntegrity -= regularDamage;
        logs.push(`[DAMAGE] Additional ${regularDamage} damage!`);
      }

      playerFirewall = Math.max(0, playerFirewall - (specialDamage - piercingDamage));
      logs.push(`[PLAYER] Integrity: ${playerIntegrity} | Firewall: ${playerFirewall}`);
      break;
  }

  return {
    playerIntegrity: Math.max(0, playerIntegrity),
    playerFirewall,
    enemyFirewall,
    logs
  };
}

// 랜덤 적 선택 (난이도 기반)
export function getRandomEnemy(type: 'normal' | 'elite' | 'boss' = 'normal', difficulty: number = 1): Enemy {
  let pool: Enemy[];

  switch (type) {
    case 'elite':
      pool = ELITE_ENEMIES;
      break;
    case 'boss':
      pool = BOSS_ENEMIES;
      break;
    default:
      // 일반 적은 난이도에 따라 풀 제한
      if (difficulty <= 2) {
        // 첫 2번 전투: Tier 1만 (매우 약함)
        pool = ENEMIES.slice(0, 2);
      } else if (difficulty <= 4) {
        // 3-4번 전투: Tier 1-2 (약함)
        pool = ENEMIES.slice(0, 4);
      } else if (difficulty <= 6) {
        // 5-6번 전투: Tier 1-3 (보통)
        pool = ENEMIES.slice(0, 6);
      } else {
        // 7번 이후: 모든 적
        pool = ENEMIES;
      }
  }

  const enemy = pool[Math.floor(Math.random() * pool.length)];

  // 적 복사 (원본 수정 방지)
  return {
    ...enemy,
    id: `${enemy.id}_${Date.now()}`,
    integrity: enemy.maxIntegrity
  };
}

// 적 난이도 스케일링
export function scaleEnemy(enemy: Enemy, floor: number): Enemy {
  const scaling = 1 + (floor * 0.15); // 층마다 15% 증가

  return {
    ...enemy,
    integrity: Math.floor(enemy.integrity * scaling),
    maxIntegrity: Math.floor(enemy.maxIntegrity * scaling),
    attack: Math.floor(enemy.attack * scaling),
    pattern: enemy.pattern.map(p => ({
      ...p,
      value: Math.floor(p.value * scaling)
    }))
  };
}
