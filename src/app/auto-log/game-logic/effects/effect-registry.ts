// effects/effect-registry.ts

import { EffectHandler } from './effect-types';
import {
  handleAttackAndDefend,
  handleDefendAndThread,
  handleDefendAndHeal,
  handleBonusVsFirewall,
  handleScaleWithHand,
  handleDrawNextTurn,
  handleWeakenNextAttack,
  handleBuffNextAttack,
  handleMemoryLeak,
} from './effect-handlers';

/**
 * 특수 효과 문자열과 핸들러 함수를 매핑하는 레지스트리입니다.
 * 여기에 모든 커스텀 카드 효과를 등록합니다.
 */
export const effectRegistry: Record<string, EffectHandler> = {
  attack_and_defend: handleAttackAndDefend,
  defend_and_thread: handleDefendAndThread,
  defend_and_heal: handleDefendAndHeal,
  bonus_vs_firewall: handleBonusVsFirewall,
  scale_with_hand: handleScaleWithHand,
  draw_next_turn: handleDrawNextTurn,
  weaken_next_attack: handleWeakenNextAttack,
  buff_next_attack: handleBuffNextAttack,
  memory_leak: handleMemoryLeak,
};
