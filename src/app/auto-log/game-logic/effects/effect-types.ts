// effects/effect-types.ts

import { Player, Enemy, Process, LogEntry } from '../../types/game';

/**
 * 이펙트 핸들러에 전달되는 컨텍스트 정보
 */
export interface EffectContext {
  player: Player;
  enemy: Enemy;
  process: Process;
  handSize: number;
  logs: LogEntry[];
}

/**
 * 이펙트 핸들러가 반환하는 결과
 */
export interface EffectResult {
  player: Player;
  enemy: Enemy;
  logs: LogEntry[];
  damageModifier?: number;
  firewallModifier?: number;
}

/**
 * 개별 이펙트 핸들러 함수의 시그니처
 */
export type EffectHandler = (context: EffectContext) => EffectResult;
