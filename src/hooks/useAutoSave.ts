'use client';

import { useEffect } from 'react';
import { GAME_CONSTANTS } from '@/utils/constants';

export function useAutoSave(saveFunction: () => void) {
  useEffect(() => {
    const interval = setInterval(() => {
      saveFunction();
    }, GAME_CONSTANTS.AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [saveFunction]);
}
