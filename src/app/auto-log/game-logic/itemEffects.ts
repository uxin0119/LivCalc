// 아이템 효과 계산 유틸리티
// 플레이어의 기본 스탯 + 아이템 효과를 합산하여 실제 적용될 스탯 반환

import { Player, Item } from '../types/game';

// 아이템 효과를 고려한 실제 최대 체력 계산
export function getEffectiveMaxIntegrity(player: Player): number {
  let total = player.maxIntegrity;

  if (player.items && player.items.length > 0) {
    player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'max_integrity') {
          total += effect.value;
        }
      });
    });
  }

  return total;
}

// 아이템 효과를 고려한 실제 최대 스레드 계산
export function getEffectiveMaxThreads(player: Player): number {
  let total = player.maxThreads;

  if (player.items && player.items.length > 0) {
    player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'max_threads') {
          total += effect.value;
        }
      });
    });
  }

  return total;
}

// 아이템 효과를 고려한 전투 시작 시 방화벽
export function getStartFirewall(player: Player): number {
  let total = player.permanentFirewall || 0;

  if (player.items && player.items.length > 0) {
    player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'start_firewall') {
          total += effect.value;
        }
      });
    });
  }

  return total;
}

// 아이템 효과를 고려한 추가 드로우 카드 수
export function getExtraDrawCount(player: Player): number {
  let total = 0;

  if (player.items && player.items.length > 0) {
    player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'draw_extra') {
          total += effect.value;
        }
      });
    });
  }

  return total;
}

// 아이템 효과를 고려한 프로세스 비용 감소
export function getCyclesReduction(player: Player): number {
  let total = 0;

  if (player.items && player.items.length > 0) {
    player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'cycles_reduction') {
          total += effect.value;
        }
      });
    });
  }

  return total;
}

// 아이템 효과를 고려한 처치 시 회복량
export function getHealOnKill(player: Player): number {
  let total = 0;

  if (player.items && player.items.length > 0) {
    player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'heal_on_kill') {
          total += effect.value;
        }
      });
    });
  }

  return total;
}

// 모든 아이템 효과 요약 (디버깅/로깅용)
export function getItemEffectsSummary(player: Player): {
  maxIntegrity: number;
  maxThreads: number;
  startFirewall: number;
  extraDraw: number;
  cyclesReduction: number;
  healOnKill: number;
} {
  return {
    maxIntegrity: getEffectiveMaxIntegrity(player),
    maxThreads: getEffectiveMaxThreads(player),
    startFirewall: getStartFirewall(player),
    extraDraw: getExtraDrawCount(player),
    cyclesReduction: getCyclesReduction(player),
    healOnKill: getHealOnKill(player)
  };
}

// 아이템 획득 시 플레이어 스탯 조정
export function applyItemOnAcquisition(player: Player, item: Item): Player {
  const newPlayer = { ...player };

  item.effects.forEach(effect => {
    switch (effect.type) {
      case 'max_integrity':
        // 최대 체력은 getEffectiveMaxIntegrity에서 계산하므로, 여기서는 현재 체력만 회복시켜준다.
        newPlayer.integrity += effect.value;
        break;      case 'max_threads':
        // maxThreads 증가 + 현재 스레드도 같이 증가 (전투 중이면)
        newPlayer.maxThreads += effect.value;
        // 전투 중이라면 현재 스레드도 증가
        if (newPlayer.threads > 0) {
          newPlayer.threads += effect.value;
        }
        break;
    }
  });

  return newPlayer;
}

// 아이템 제거 시 플레이어 스탯 조정
export function applyItemOnRemoval(player: Player, item: Item): Player {
  const newPlayer = { ...player };

  item.effects.forEach(effect => {
    switch (effect.type) {
      case 'max_integrity':
        // maxIntegrity 감소 + 현재 체력도 같이 감소
        newPlayer.maxIntegrity = Math.max(1, newPlayer.maxIntegrity - effect.value);
        newPlayer.integrity = Math.max(1, Math.min(newPlayer.integrity - effect.value, newPlayer.maxIntegrity));
        break;

      case 'max_threads':
        // maxThreads 감소 + 현재 스레드도 같이 감소
        newPlayer.maxThreads = Math.max(1, newPlayer.maxThreads - effect.value);
        newPlayer.threads = Math.min(newPlayer.threads, newPlayer.maxThreads);
        break;
    }
  });

  return newPlayer;
}
