import { GAME_CONSTANTS } from './constants';
import type { GameState, PlayerState } from '@/types/game.types';

// 게임 저장
export function saveGame(state: GameState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(GAME_CONSTANTS.STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save game:', error);
  }
}

// 게임 로드
export function loadGame(): GameState | null {
  try {
    const serialized = localStorage.getItem(GAME_CONSTANTS.STORAGE_KEY);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as GameState;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

// System Monitor Dungeon Player State Save
export function savePlayerState(state: PlayerState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(GAME_CONSTANTS.SYSTEM_MONITOR_DUNGEON_STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save player state:', error);
  }
}

// System Monitor Dungeon Player State Load
export function loadPlayerState(): PlayerState | null {
  try {
    const serialized = localStorage.getItem(GAME_CONSTANTS.SYSTEM_MONITOR_DUNGEON_STORAGE_KEY);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as PlayerState;
  } catch (error) {
    console.error('Failed to load player state:', error);
    return null;
  }
}

// 게임 삭제
export function deleteGame(): void {
  try {
    localStorage.removeItem(GAME_CONSTANTS.STORAGE_KEY);
  } catch (error) {
    console.error('Failed to delete game:', error);
  }
}

// 저장된 게임 존재 여부 확인
export function hasSavedGame(): boolean {
  try {
    return localStorage.getItem(GAME_CONSTANTS.STORAGE_KEY) !== null;
  } catch (error) {
    return false;
  }
}
