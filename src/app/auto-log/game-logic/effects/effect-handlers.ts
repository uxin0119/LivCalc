// effects/effect-handlers.ts

import { EffectContext, EffectResult, EffectHandler } from './effect-types';
import { Player, Enemy, StatusEffect } from '../../types/game';
import { createLog } from '../combat';
import { v4 as uuidv4 } from 'uuid';

// --- 유틸리티 함수 ---
function addBuff(player: Player, buff: StatusEffect): Player {
  return { ...player, buffs: [...player.buffs, buff] };
}

function addDebuff(enemy: Enemy, debuff: StatusEffect): Enemy {
  return { ...enemy, debuffs: [...enemy.debuffs, debuff] };
}


// --- 핸들러 구현 ---

/**
 * 공격과 방어를 동시에 수행 (ping_flood.py)
 */
export const handleAttackAndDefend: EffectHandler = (context: EffectContext): EffectResult => {
  const { player, enemy, logs } = context;
  player.firewall += 3;
  logs.push(createLog('combat', `[HYBRID] Defensive flood protocol activated`));
  logs.push(createLog('combat', `[FIREWALL] +3 defense`));
  return { player, enemy, logs };
};

/**
 * 방어 후 스레드 1개 즉시 회복 (packet_filter.bat)
 * @fix - 이 핸들러는 이제 스레드를 직접 수정하는 대신, combat 루프에서 처리할 수 있도록 값을 반환합니다.
 */
export const handleDefendAndThread: EffectHandler = (context: EffectContext): EffectResult => {
  const { player, enemy, logs } = context;
  // combat.ts에서 이 값을 사용하여 스레드를 환불합니다.
  player.threads += 1;
  logs.push(createLog('combat', `[OPTIMIZE] Efficient filtering freed up resources`));
  logs.push(createLog('combat', `[THREADS] +1 Thread this turn`));
  return { player, enemy, logs };
};

/**
 * 방어와 체력 회복을 동시에 수행 (access_control.sh)
 */
export const handleDefendAndHeal: EffectHandler = (context: EffectContext): EffectResult => {
  const { player, enemy, logs } = context;
  const healAmount = Math.min(3, player.maxIntegrity - player.integrity);
  if (healAmount > 0) {
    player.integrity += healAmount;
    logs.push(createLog('combat', `[STABILIZE] System stabilization protocol`));
    logs.push(createLog('combat', `[REPAIR] Restored ${healAmount} Integrity`));
  }
  return { player, enemy, logs };
};

export const handleBonusVsFirewall: EffectHandler = (context: EffectContext): EffectResult => {
  const { player, enemy, logs } = context;
  let damageModifier = 0;
  if (enemy.firewall > 0) {
    damageModifier = 6;
    logs.push(createLog('combat', `[EXPLOIT] Target firewall detected!`));
    logs.push(createLog('combat', `[BONUS] +${damageModifier} damage from session hijacking`));
  }
  return { player, enemy, logs, damageModifier };
};

/**
 * 핸드에 있는 카드 수만큼 추가 피해 (file_inclusion.sh)
 */
export const handleScaleWithHand: EffectHandler = (context: EffectContext): EffectResult => {
  const { player, enemy, logs, handSize } = context;
  const bonusDamage = Math.min(handSize, 8);
  let damageModifier = 0;
  if (bonusDamage > 0) {
    damageModifier = bonusDamage;
    logs.push(createLog('combat', `[SCALE] File access scales with loaded processes`));
    logs.push(createLog('combat', `[BONUS] +${damageModifier} damage (${handSize} cards in hand)`));
  }
  return { player, enemy, logs, damageModifier };
};

/**
 * 다음 턴에 카드 추가 드로우 (packet_send.sh)
 * @fix - 2장 드로우하도록 수정하고, 새로운 버프 시스템을 사용합니다.
 */
export const handleDrawNextTurn: EffectHandler = (context: EffectContext): EffectResult => {
  let { player } = context;
  const { enemy, logs, process } = context;
  const newBuff = {
    id: uuidv4(),
    type: 'draw_next_turn' as const,
    value: 2, // 2장 드로우
    duration: 2, // 다음 턴 시작 시 적용되고 바로 사라지므로 2로 설정
    source: process.id,
  };
  player = addBuff(player, newBuff);
  logs.push(createLog('combat', `[BUFFER] Packet transmission will load extra processes next turn`));
  return { player, enemy, logs };
};

/**
 * 적의 다음 공격력을 약화시킴 (mitm_attack.exe)
 * @fix - 새로운 디버프 시스템을 사용합니다.
 */
export const handleWeakenNextAttack: EffectHandler = (context: EffectContext): EffectResult => {
  let { enemy } = context;
  const { player, logs, process } = context;
  const newDebuff = {
    id: uuidv4(),
    type: 'weaken' as const,
    value: 0.5, // 50% 감소
    duration: 1,
    source: process.id,
  };
  enemy = addDebuff(enemy, newDebuff);
  logs.push(createLog('combat', `[INTERCEPT] Enemy communication disrupted`));
  logs.push(createLog('combat', `[DEBUFF] Next enemy attack reduced by 50%`));
  return { player, enemy, logs };
};

/**
 * 다음 자신의 공격을 강화 (advanced_shield.exe)
 * @fix - 새로운 버프 시스템을 사용합니다.
 */
export const handleBuffNextAttack: EffectHandler = (context: EffectContext): EffectResult => {
  let { player } = context;
  const { enemy, logs, process } = context;
  const newBuff = {
    id: uuidv4(),
    type: 'damage_boost' as const,
    value: 5, // +5 데미지
    duration: 1, // 다음 한 번의 공격에만 적용
    source: process.id,
  };
  player = addBuff(player, newBuff);
  logs.push(createLog('combat', `[STANCE] Defensive stance - preparing counter-attack`));
  logs.push(createLog('combat', `[BUFF] Next attack deals +5 damage`));
  return { player, enemy, logs };
};

export const handleMemoryLeak: EffectHandler = (context: EffectContext): EffectResult => {
  let { player } = context;
  const { enemy, logs, process } = context;
  const newBuff = {
    id: uuidv4(),
    type: 'damage_boost' as const,
    value: 1.5, // 50% 증폭
    duration: 2, // 다음 한 번의 공격에만 적용 (2턴 지속으로 넉넉하게 설정)
    source: process.id,
  };
  player = addBuff(player, newBuff);
  logs.push(createLog('combat', `[EXPLOIT] Injecting memory leak...`));
  logs.push(createLog('combat', `[BUFF] Next attack will deal 50% more damage`));
  return { player, enemy, logs };
};
