import { useEffect } from 'react';
import { useGameStore } from './gameStore';

export const KeyboardController = () => {
  const setMoveVector = useGameStore((state) => state.setMoveVector);

  useEffect(() => {
    const keys = {
      ArrowUp: false, KeyW: false,
      ArrowDown: false, KeyS: false,
      ArrowLeft: false, KeyA: false,
      ArrowRight: false, KeyD: false,
    };

    const updateVector = () => {
      const z = (keys.ArrowUp || keys.KeyW ? -1 : 0) + (keys.ArrowDown || keys.KeyS ? 1 : 0);
      const x = (keys.ArrowLeft || keys.KeyA ? -1 : 0) + (keys.ArrowRight || keys.KeyD ? 1 : 0);
      
      // Normalize if diagonal to prevent faster speed
      const length = Math.sqrt(x * x + z * z);
      if (length > 0) {
        setMoveVector({ x: x / length, z: z / length });
      } else {
        setMoveVector({ x: 0, z: 0 });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code in keys) {
        (keys as any)[e.code] = true;
        updateVector();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code in keys) {
        (keys as any)[e.code] = false;
        updateVector();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setMoveVector]);

  return null;
};
