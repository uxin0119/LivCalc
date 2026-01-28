import { create } from 'zustand';

interface GameState {
  moveVector: { x: number; z: number };
  setMoveVector: (vector: { x: number; z: number }) => void;
}

export const useGameStore = create<GameState>((set) => ({
  moveVector: { x: 0, z: 0 },
  setMoveVector: (vector) => set({ moveVector: vector }),
}));
