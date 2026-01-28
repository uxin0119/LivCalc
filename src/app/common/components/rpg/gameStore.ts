import { create } from 'zustand';

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface EnemyData {
  id: string;
  position: Position;
  hp: number;
  maxHp: number;
  isDead: boolean;
  hitStun: number; // Timer for stun/flinching
}

export interface Obstacle {
  id: string;
  type: 'tree' | 'rock' | 'house' | 'log' | 'wagon' | 'grass' | 'dirtpath' | 'pond';
  position: Position;
  radius: number; // Collision radius
  collidable: boolean;
  rotation?: number; // Y-axis rotation
  size?: [number, number]; // For rectangular objects like paths
}

interface GameState {
  moveVector: { x: number; z: number };
  setMoveVector: (vector: { x: number; z: number }) => void;
  
  playerPosition: Position;
  setPlayerPosition: (pos: Position) => void;

  isAttacking: boolean;
  setIsAttacking: (isAttacking: boolean) => void;
  attackDamage: number;

  enemies: EnemyData[];
  setEnemies: (enemies: EnemyData[]) => void;
  damageEnemy: (id: string, damage: number) => void;

  targetEnemyId: string | null;
  setTargetEnemyId: (id: string | null) => void;
  
  spawnEnemy: () => void;
  moveEnemies: (delta: number) => void;

  obstacles: Obstacle[];
}

export const useGameStore = create<GameState>((set, get) => ({
  moveVector: { x: 0, z: 0 },
  setMoveVector: (vector) => set({ moveVector: vector }),

  playerPosition: { x: 0, y: 0, z: 0 },
  setPlayerPosition: (pos) => set({ playerPosition: pos }),

  isAttacking: false,
  setIsAttacking: (isAttacking) => set({ isAttacking }),
  attackDamage: 10,

  enemies: [
    { id: 'enemy-1', position: { x: 5, y: 0, z: 5 }, hp: 100, maxHp: 100, isDead: false, hitStun: 0 }
  ],
  setEnemies: (enemies) => set({ enemies }),
  damageEnemy: (id, damage) => set((state) => ({
    enemies: state.enemies.map(enemy => {
      if (enemy.id !== id) return enemy;
      const newHp = Math.max(0, enemy.hp - damage);
      // Set hitStun to 0.5s on hit
      return { ...enemy, hp: newHp, isDead: newHp === 0, hitStun: 0.5 };
    })
  })),

  targetEnemyId: null,
  setTargetEnemyId: (id) => set({ targetEnemyId: id }),

  spawnEnemy: () => set((state) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 10 + Math.random() * 5; 
    const x = state.playerPosition.x + Math.cos(angle) * distance;
    const z = state.playerPosition.z + Math.sin(angle) * distance;
    
    const newEnemy: EnemyData = {
        id: `enemy-${Date.now()}`,
        position: { x, y: 0, z },
        hp: 100,
        maxHp: 100,
        isDead: false,
        hitStun: 0
    };
    return { enemies: [...state.enemies, newEnemy] };
  }),

  moveEnemies: (delta: number) => set((state) => {
      const ENEMY_SPEED = 2.0;
      const STOP_DISTANCE = 1.2;

      const newEnemies = state.enemies.map(enemy => {
          if (enemy.isDead) return enemy;

          // Handle Stun Timer
          if (enemy.hitStun > 0) {
              return {
                  ...enemy,
                  hitStun: Math.max(0, enemy.hitStun - delta)
              };
          }

          const dx = state.playerPosition.x - enemy.position.x;
          const dz = state.playerPosition.z - enemy.position.z;
          const dist = Math.sqrt(dx*dx + dz*dz);

          if (dist > STOP_DISTANCE) {
              const moveX = (dx / dist) * ENEMY_SPEED * delta;
              const moveZ = (dz / dist) * ENEMY_SPEED * delta;
              
              return {
                  ...enemy,
                  position: {
                      ...enemy.position,
                      x: enemy.position.x + moveX,
                      z: enemy.position.z + moveZ
                  }
              };
          }
          return enemy;
      });
      return { enemies: newEnemies };
  }),

  obstacles: [
      // Trees
      { id: 'tree-1', type: 'tree', position: { x: -3, y: 0, z: -3 }, radius: 0.5, collidable: true },
      { id: 'tree-2', type: 'tree', position: { x: 5, y: 0, z: 2 }, radius: 0.5, collidable: true },
      { id: 'tree-3', type: 'tree', position: { x: -5, y: 0, z: 4 }, radius: 0.5, collidable: true },
      { id: 'tree-4', type: 'tree', position: { x: 2, y: 0, z: -6 }, radius: 0.5, collidable: true },
      
      // Rocks
      { id: 'rock-1', type: 'rock', position: { x: 2, y: 0.25, z: 3 }, radius: 0.5, collidable: true },
      { id: 'rock-2', type: 'rock', position: { x: -2, y: 0.4, z: 6 }, radius: 0.7, collidable: true },
      
      // Houses
      { id: 'house-1', type: 'house', position: { x: -8, y: 0, z: -8 }, radius: 2.0, collidable: true },
      
      // Wagons
      { id: 'wagon-1', type: 'wagon', position: { x: 8, y: 0, z: 8 }, radius: 1.2, collidable: true, rotation: Math.PI / 4 },
      
      // Logs
      { id: 'log-1', type: 'log', position: { x: 4, y: 0, z: -4 }, radius: 0.5, collidable: true, rotation: Math.PI / 2 },
      
      // Grass (Non-collidable)
      { id: 'grass-1', type: 'grass', position: { x: 1, y: 0, z: 1 }, radius: 0, collidable: false },
      { id: 'grass-2', type: 'grass', position: { x: 1.5, y: 0, z: 1.2 }, radius: 0, collidable: false },
      { id: 'grass-3', type: 'grass', position: { x: -1, y: 0, z: -1 }, radius: 0, collidable: false },

      // Ponds (Collidable - Water)
      { id: 'pond-1', type: 'pond', position: { x: -6, y: 0, z: 6 }, radius: 2.5, collidable: true },

      // Dirt Paths (Non-collidable)
      { id: 'path-1', type: 'dirtpath', position: { x: 0, y: 0, z: 0 }, radius: 0, collidable: false, size: [2, 10] },
      { id: 'path-2', type: 'dirtpath', position: { x: 0, y: 0, z: 0 }, radius: 0, collidable: false, size: [10, 2], rotation: Math.PI / 2 },
  ]
}));
