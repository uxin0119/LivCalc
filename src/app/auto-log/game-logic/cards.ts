// 프로세스 정의 및 관리

import { Process, Player, Enemy } from '../types/game';
import { effectRegistry } from './effects/effect-registry';
import { createLog } from './combat';

export const BASE_PROCESSES: Process[] = [
  // 저코스트 공격 프로세스
  {
    id: 'packet_send',
    name: 'packet_send',
    type: 'attack',
    cycles: 1,
    throughput: 5,
    description: 'Fast packet transmission. Draw 1 extra next turn.',
    executable: 'packet_send.sh',
    specialEffect: 'draw_next_turn'
  },
  {
    id: 'ping_flood',
    name: 'ping_flood',
    type: 'attack',
    cycles: 1,
    throughput: 4,
    description: 'Defensive flood. Deals 4 damage and gains 3 Firewall.',
    executable: 'ping_flood.py',
    specialEffect: 'attack_and_defend'
  },

  // 저코스트 방어 프로세스
  {
    id: 'packet_filter',
    name: 'packet_filter',
    type: 'defend',
    cycles: 1,
    throughput: 5,
    description: 'Efficient filtering. Gain 5 Firewall and +1 Thread this turn.',
    executable: 'packet_filter.bat',
    specialEffect: 'defend_and_thread'
  },
  {
    id: 'access_control',
    name: 'access_control',
    type: 'defend',
    cycles: 1,
    throughput: 3,
    description: 'Access control. Gain 3 Firewall and heal 3 Integrity.',
    executable: 'access_control.sh',
    specialEffect: 'defend_and_heal'
  },

  // 특수 공격 프로세스
  {
    id: 'buffer_overflow',
    name: 'buffer_overflow',
    type: 'attack',
    cycles: 2,
    throughput: 15,
    description: 'Memory corruption exploit.',
    executable: 'buffer_overflow.c',
    attribute: 'SYSTEM'
  },
  {
    id: 'sql_injection',
    name: 'sql_injection',
    type: 'attack',
    cycles: 2,
    throughput: 12,
    description: 'Database query injection.',
    executable: 'sql_injection.py',
    attribute: 'WEB'
  },
  {
    id: 'ddos_attack',
    name: 'ddos_attack',
    type: 'attack',
    cycles: 3,
    throughput: 20,
    description: 'Distributed denial of service.',
    executable: 'ddos_attack.exe',
    attribute: 'NETWORK'
  },

  // 디버프 프로세스
  {
    id: 'memory_leak',
    name: 'memory_leak',
    type: 'utility',
    cycles: 1,
    throughput: 0,
    description: 'Inject memory leak. Next attack deals 50% more damage.',
    executable: 'memory_leak.py',
    specialEffect: 'memory_leak'
  },
  {
    id: 'cpu_throttle',
    name: 'cpu_throttle',
    type: 'utility',
    cycles: 1,
    throughput: 0,
    description: 'Reduce enemy CPU performance. Attack reduced by 3 for 2 turns.',
    executable: 'cpu_throttle.sh'
  },
  {
    id: 'stack_smash',
    name: 'stack_smash',
    type: 'utility',
    cycles: 1,
    throughput: 0,
    description: 'Corrupt stack protection. Remove firewall and prevent defense for 1 turn.',
    executable: 'stack_smash.bat'
  },

  // 고급 공격 프로세스 (보상용)
  {
    id: 'xss_payload',
    name: 'xss_payload',
    type: 'attack',
    cycles: 1,
    throughput: 8,
    description: 'Inject malicious script.',
    executable: 'xss_payload.js',
    attribute: 'WEB'
  },
  {
    id: 'csrf_attack',
    name: 'csrf_attack',
    type: 'attack',
    cycles: 2,
    throughput: 12,
    description: 'Session hijacking. Deal +6 damage if enemy has Firewall.',
    executable: 'csrf_attack.sh',
    attribute: 'WEB',
    specialEffect: 'bonus_vs_firewall'
  },
  {
    id: 'remote_shell',
    name: 'remote_shell',
    type: 'attack',
    cycles: 3,
    throughput: 20,
    description: 'Execute arbitrary code.',
    executable: 'remote_shell.exe',
    attribute: 'SYSTEM'
  },
  {
    id: 'privilege_escalate',
    name: 'privilege_escalation',
    type: 'attack',
    cycles: 2,
    throughput: 14,
    description: 'Gain root access.',
    executable: 'priv_escalate.bat',
    attribute: 'SYSTEM'
  },
  {
    id: 'ssrf_exploit',
    name: 'ssrf_exploit',
    type: 'attack',
    cycles: 2,
    throughput: 13,
    description: 'Server-side request forgery.',
    executable: 'ssrf_exploit.py',
    attribute: 'NETWORK'
  },
  {
    id: 'file_inclusion',
    name: 'file_inclusion',
    type: 'attack',
    cycles: 2,
    throughput: 8,
    description: 'File access. Deal +1 damage per card in hand (max +8).',
    executable: 'file_inclusion.sh',
    attribute: 'NETWORK',
    specialEffect: 'scale_with_hand'
  },
  {
    id: 'mitm_attack',
    name: 'mitm_attack',
    type: 'attack',
    cycles: 3,
    throughput: 14,
    description: 'Intercept and disrupt. Reduce enemy next attack by 50%.',
    executable: 'mitm_attack.exe',
    attribute: 'NETWORK',
    specialEffect: 'weaken_next_attack'
  },

  // 고급 방어 프로세스 (보상용)
  {
    id: 'firewall',
    name: 'firewall',
    type: 'defend',
    cycles: 2,
    throughput: 15,
    description: 'Deploy strong defensive barrier.',
    executable: 'firewall.bat'
  },
  {
    id: 'advanced_shield',
    name: 'advanced_shield',
    type: 'defend',
    cycles: 2,
    throughput: 10,
    description: 'Defensive stance. Gain 10 Firewall. Next attack +5 damage.',
    executable: 'advanced_shield.exe',
    specialEffect: 'buff_next_attack'
  },

  // 유틸리티 프로세스 (보상용)
  {
    id: 'repair',
    name: 'system_repair',
    type: 'heal',
    cycles: 2,
    throughput: 12,
    description: 'Restore system integrity.',
    executable: 'repair.py'
  },
  {
    id: 'vulnerability_scan',
    name: 'vulnerability_scan',
    type: 'utility',
    cycles: 1,
    throughput: 0,
    description: 'Analyze target weaknesses. Draw 1 process.',
    executable: 'vuln_scan.exe'
  }
];

// 시작 라이브러리 생성
export function createStarterLibrary(): Process[] {
  const packetSend = BASE_PROCESSES.find(p => p.id === 'packet_send')!;
  const pingFlood = BASE_PROCESSES.find(p => p.id === 'ping_flood')!;
  const packetFilter = BASE_PROCESSES.find(p => p.id === 'packet_filter')!;
  const accessControl = BASE_PROCESSES.find(p => p.id === 'access_control')!;
  const bufferOverflow = BASE_PROCESSES.find(p => p.id === 'buffer_overflow')!;
  const sqlInjection = BASE_PROCESSES.find(p => p.id === 'sql_injection')!;
  const ddosAttack = BASE_PROCESSES.find(p => p.id === 'ddos_attack')!;

  return [
    // 6 Simple Attack Cards
    { ...packetSend, id: 'packet_send_0' },
    { ...packetSend, id: 'packet_send_1' },
    { ...packetSend, id: 'packet_send_2' },
    { ...pingFlood, id: 'ping_flood_0' },
    { ...pingFlood, id: 'ping_flood_1' },
    { ...pingFlood, id: 'ping_flood_2' },

    // 6 Simple Defense Cards
    { ...packetFilter, id: 'packet_filter_0' },
    { ...packetFilter, id: 'packet_filter_1' },
    { ...packetFilter, id: 'packet_filter_2' },
    { ...accessControl, id: 'access_control_0' },
    { ...accessControl, id: 'access_control_1' },
    { ...accessControl, id: 'access_control_2' },

    // 3 Special Cards
    { ...bufferOverflow, id: 'buffer_overflow_0' },
    { ...sqlInjection, id: 'sql_injection_0' },
    { ...ddosAttack, id: 'ddos_attack_0' },
  ];
}

// 프로세스를 라이브러리에서 랜덤하게 뽑기
export function drawProcesses(library: Process[], count: number): { drawn: Process[], remaining: Process[] } {
  const shuffled = [...library].sort(() => Math.random() - 0.5);
  const drawn = shuffled.slice(0, count);
  const remaining = shuffled.slice(count);
  return { drawn, remaining };
}

// 프로세스 효과 실행 (리팩토링된 버전)
export function executeProcessEffect(
  process: Process,
  player: Player,
  enemy: Enemy,
  handSize: number = 0
): {
  player: Player;
  enemy: Enemy;
  logs: string[];
} {
  const logs: string[] = [];
  let updatedPlayer = { ...player };
  let updatedEnemy = { ...enemy };

  // 1. 기본 효과 적용 (공격, 방어, 힐)
  switch (process.type) {
    case 'attack': {
      const damage = process.throughput;
      let multiplier = 1.0;
      let matchType = '';

      // 취약점/약점/저항 적용
      if (process.attribute) {
        if (updatedEnemy.vulnerabilities?.includes(process.attribute)) {
          multiplier = 2.0;
          matchType = 'CRITICAL';
        } else if (updatedEnemy.weaknesses?.includes(process.attribute)) {
          multiplier = 1.5;
          matchType = 'EFFECTIVE';
        } else if (updatedEnemy.resistances?.includes(process.attribute)) {
          multiplier = 0.5;
          matchType = 'RESISTED';
        }
      }

      const finalDamage = Math.floor(damage * multiplier);
      updatedEnemy.integrity = Math.max(0, updatedEnemy.integrity - finalDamage);

      logs.push(`[EXEC] ${process.executable}${process.attribute ? ` [${process.attribute}]` : ''}`);
      if (matchType) {
        logs.push(`[${matchType}] ${process.attribute} property matched!`);
        logs.push(`[DAMAGE] ${finalDamage} damage (${damage} base x ${multiplier})`);
      } else {
        logs.push(`[DAMAGE] ${finalDamage} damage`);
      }
      logs.push(`[TARGET] Security: ${updatedEnemy.integrity}/${updatedEnemy.maxIntegrity}`);
      break;
    }
    case 'defend':
      updatedPlayer.firewall += process.throughput;
      logs.push(`[EXEC] ${process.executable}`);
      logs.push(`[FIREWALL] +${process.throughput} defense`);
      break;
    case 'heal': {
      const healAmount = Math.min(process.throughput, updatedPlayer.maxIntegrity - updatedPlayer.integrity);
      if (healAmount > 0) {
        updatedPlayer.integrity += healAmount;
        logs.push(`[EXEC] ${process.executable}`);
        logs.push(`[REPAIR] Restored ${healAmount} Integrity`);
      }
      break;
    }
    case 'utility':
      // 유틸리티 카드는 주로 특수 효과 핸들러에서 모든 로직을 처리합니다.
      logs.push(`[EXEC] ${process.executable}`);
      break;
  }

  // 2. 특수 효과 핸들러 실행
  if (process.specialEffect && effectRegistry[process.specialEffect]) {
    const handler = effectRegistry[process.specialEffect];
    const context = {
      player: updatedPlayer,
      enemy: updatedEnemy,
      process,
      handSize,
      logs: [], // 핸들러 내에서 발생한 로그만 따로 받기
    };

    const result = handler(context);
    updatedPlayer = result.player;
    updatedEnemy = result.enemy;
    logs.push(...result.logs.map(l => l.message)); // 핸들러 로그를 메인 로그에 추가
  }

  return {
    player: updatedPlayer,
    enemy: updatedEnemy,
    logs,
  };
}

// 레어도별 프로세스 풀
export const COMMON_PROCESSES = BASE_PROCESSES.slice(0, 3);
export const UNCOMMON_PROCESSES = BASE_PROCESSES.slice(3, 6);
export const RARE_PROCESSES = BASE_PROCESSES.slice(6, 8);

// 보상 프로세스 선택지 생성 (모든 고급 프로세스에서 선택)
export function generateProcessRewards(count: number = 3): Process[] {
  // 보상 풀 = 고급 프로세스들 (인덱스 10부터)
  const rewardPool = BASE_PROCESSES.slice(10);

  const rewards: Process[] = [];
  const availableProcesses = [...rewardPool];

  for (let i = 0; i < count && availableProcesses.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableProcesses.length);
    const selectedProcess = availableProcesses[randomIndex];

    rewards.push({
      ...selectedProcess,
      id: `${selectedProcess.id}_reward_${Date.now()}_${i}`
    });

    // 중복 방지를 위해 선택된 프로세스 제거
    availableProcesses.splice(randomIndex, 1);
  }

  return rewards;
}
