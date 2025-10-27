'use client';

import { useEffect, useRef } from 'react';
import { GAME_CONSTANTS } from '@/utils/constants';

export function useAutoAttack(dps: number, attackFunction: () => void) {
  const attackRef = useRef(attackFunction);

  // attackFunction이 변경될 때마다 ref 업데이트
  useEffect(() => {
    attackRef.current = attackFunction;
  }, [attackFunction]);

  useEffect(() => {
    if (dps <= 0) return;

    const interval = setInterval(() => {
      attackRef.current();
    }, GAME_CONSTANTS.AUTO_ATTACK_INTERVAL);

    return () => clearInterval(interval);
  }, [dps]); // attackFunction을 의존성에서 제거
}
