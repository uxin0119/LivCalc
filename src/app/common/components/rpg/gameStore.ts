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
  hitStun: number;
  // AI State
  aiState: 'idle' | 'roam' | 'chase';
  roamTarget: Position | null;
  idleTimer: number;
  rotation: number; // Y-axis rotation in radians
}

export interface Loot {
  id: string;
  type: InventoryItem['type'];
  position: Position;
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
  
  // Inventory
  inventory: InventoryItem[];
  isInventoryOpen: boolean;
  toggleInventory: () => void;
  addItem: (type: InventoryItem['type'], count: number) => void;
  useItem: (itemId: string) => void;

  loots: Loot[];
  checkLootCollection: () => void;
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
    { 
        id: 'enemy-1', position: { x: 5, y: 0, z: 5 }, hp: 100, maxHp: 100, isDead: false, hitStun: 0,
        aiState: 'idle', roamTarget: null, idleTimer: 2.0, rotation: 0 
    }
  ],
  setEnemies: (enemies) => set({ enemies }),
  damageEnemy: (id, damage) => set((state) => {
    let lootToAdd: Loot | null = null;
    const newEnemies = state.enemies.map(enemy => {
      if (enemy.id !== id) return enemy;
      const newHp = Math.max(0, enemy.hp - damage);
      
      // On Death: 50% chance to drop loot
      if (newHp === 0 && !enemy.isDead) {
          if (Math.random() > 0.5) {
              const types: InventoryItem['type'][] = ['potion', 'wood', 'stone'];
              const randomType = types[Math.floor(Math.random() * types.length)];
              lootToAdd = {
                  id: `loot-${Date.now()}-${Math.random()}`,
                  type: randomType,
                  position: { ...enemy.position }
              };
          }
      }

      const newState = newHp > 0 ? 'chase' : enemy.aiState;
      return { ...enemy, hp: newHp, isDead: newHp === 0, hitStun: 0.5, aiState: newState };
    });

    return { 
        enemies: newEnemies,
        loots: lootToAdd ? [...state.loots, lootToAdd] : state.loots
    };
  }),

  targetEnemyId: null,
  setTargetEnemyId: (id) => set({ targetEnemyId: id }),

  spawnEnemy: () => set((state) => {
    const MAX_ENEMIES = 40;
    const activeEnemies = state.enemies.filter(e => !e.isDead);
    if (activeEnemies.length >= MAX_ENEMIES) return {};

    // Random position on map (approx -50 to 50)
    const x = (Math.random() - 0.5) * 80; 
    const z = (Math.random() - 0.5) * 80;
    
    const newEnemy: EnemyData = {
        id: `enemy-${Date.now()}`,
        position: { x, y: 0, z },
        hp: 100,
        maxHp: 100,
        isDead: false,
        hitStun: 0,
        aiState: 'idle',
        roamTarget: null,
        idleTimer: 1.0,
        rotation: Math.random() * Math.PI * 2
    };
    return { enemies: [...state.enemies, newEnemy] };
  }),

  moveEnemies: (delta: number) => set((state) => {
      const CHASE_SPEED = 2.5;
      const ROAM_SPEED = 1.0;
      const STOP_DISTANCE = 1.2;
      const DETECTION_RANGE = 4.5;
      const FOV = Math.PI / 2; // 90 degrees total (45 left, 45 right)

      const newEnemies = state.enemies.map(enemy => {
          if (enemy.isDead) return enemy;

          // Stun check
          if (enemy.hitStun > 0) {
              return { ...enemy, hitStun: Math.max(0, enemy.hitStun - delta) };
          }

          const dxToPlayer = state.playerPosition.x - enemy.position.x;
          const dzToPlayer = state.playerPosition.z - enemy.position.z;
          const distToPlayer = Math.sqrt(dxToPlayer * dxToPlayer + dzToPlayer * dzToPlayer);

          // AI Logic
          let nextState = enemy.aiState;
          let nextRoamTarget = enemy.roamTarget;
          let nextIdleTimer = enemy.idleTimer;
          let nextRotation = enemy.rotation;
          let moveX = 0;
          let moveZ = 0;

          // 1. Detection Check (Transition to Chase)
          // Calculate angle to player
          const angleToPlayer = Math.atan2(dxToPlayer, dzToPlayer); // Result is -PI to PI
          
          // Calculate difference between current rotation and angle to player
          // Normalize enemy.rotation to -PI to PI for easier math? No, just handle diff.
          // Standardize rotation:
          let currentRot = enemy.rotation % (Math.PI * 2);
          if (currentRot > Math.PI) currentRot -= Math.PI * 2;
          if (currentRot < -Math.PI) currentRot += Math.PI * 2;

          let angleDiff = angleToPlayer - currentRot;
          // Normalize diff to -PI to PI
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          
          const isPlayerInFOV = Math.abs(angleDiff) < (FOV / 2);
          const isDetected = distToPlayer < DETECTION_RANGE && isPlayerInFOV;

          // If detected, switch to chase. If already chasing, stay chasing until far away.
          if (nextState !== 'chase' && isDetected) {
              nextState = 'chase';
          } else if (nextState === 'chase' && distToPlayer > DETECTION_RANGE * 1.2) {
              // Lost target
              nextState = 'idle';
              nextIdleTimer = 2.0;
          }

          // 2. State Actions
          if (nextState === 'chase') {
              // Look at player
              // Interpolate rotation smoothly
              const targetRot = Math.atan2(dxToPlayer, dzToPlayer);
              // Simple lerp for rotation could be tricky with wrapping, just snap or basic turn for now
              nextRotation = targetRot;

              if (distToPlayer > STOP_DISTANCE) {
                  moveX = (dxToPlayer / distToPlayer) * CHASE_SPEED * delta;
                  moveZ = (dzToPlayer / distToPlayer) * CHASE_SPEED * delta;
              }
          } 
          else if (nextState === 'roam') {
              if (!nextRoamTarget) {
                  // Pick random target nearby
                  const angle = Math.random() * Math.PI * 2;
                  const dist = 3 + Math.random() * 5;
                  nextRoamTarget = {
                      x: enemy.position.x + Math.sin(angle) * dist,
                      y: 0,
                      z: enemy.position.z + Math.cos(angle) * dist
                  };
              }

              const dx = nextRoamTarget.x - enemy.position.x;
              const dz = nextRoamTarget.z - enemy.position.z;
              const dist = Math.sqrt(dx*dx + dz*dz);

              if (dist < 0.5) {
                  // Reached target -> Idle
                  nextState = 'idle';
                  nextIdleTimer = 1.0 + Math.random() * 2.0;
                  nextRoamTarget = null;
              } else {
                  // Move to target
                  moveX = (dx / dist) * ROAM_SPEED * delta;
                  moveZ = (dz / dist) * ROAM_SPEED * delta;
                  nextRotation = Math.atan2(dx, dz);
              }
          } 
          else if (nextState === 'idle') {
              nextIdleTimer -= delta;
              if (nextIdleTimer <= 0) {
                  // Switch to roam
                  nextState = 'roam';
                  nextRoamTarget = null; // Will pick new target next frame
              }
          }

          return {
              ...enemy,
              aiState: nextState,
              roamTarget: nextRoamTarget,
              idleTimer: nextIdleTimer,
              rotation: nextRotation,
              position: {
                  ...enemy.position,
                  x: enemy.position.x + moveX,
                  z: enemy.position.z + moveZ
              }
          };
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
  ],

  // Inventory Logic
  inventory: [
      { id: 'item-1', type: 'potion', name: 'Health Potion', count: 5, description: 'Restores 50 HP' },
      { id: 'item-2', type: 'sword', name: 'Rusty Sword', count: 1, description: 'Basic weapon' },
      { id: 'item-3', type: 'wood', name: 'Log', count: 3, description: 'Crafting material' },
      { id: 'item-4', type: 'stone', name: 'Pebble', count: 10, description: 'Useless stone' },
  ],
  isInventoryOpen: false,
  toggleInventory: () => set((state) => ({ isInventoryOpen: !state.isInventoryOpen })),
  
  addItem: (type, count) => set((state) => {
      const existing = state.inventory.find(i => i.type === type);
      if (existing) {
          return {
              inventory: state.inventory.map(i => 
                  i.type === type ? { ...i, count: i.count + count } : i
              )
          };
      } else {
          // Simple ID gen
          const newItem: InventoryItem = {
              id: `item-${Date.now()}`,
              type,
              name: type.charAt(0).toUpperCase() + type.slice(1),
              count,
              description: 'New Item'
          };
          return { inventory: [...state.inventory, newItem] };
      }
  }),
  
  useItem: (itemId) => set((state) => {
      // Placeholder for item usage logic
      console.log(`Used item: ${itemId}`);
      return state;
  }),

  // Loot Logic
  loots: [],
  checkLootCollection: () => set((state) => {
      const PICKUP_RADIUS = 1.0;
      const collectedLoots = state.loots.filter(loot => {
          const dx = state.playerPosition.x - loot.position.x;
          const dz = state.playerPosition.z - loot.position.z;
          const dist = Math.sqrt(dx*dx + dz*dz);
          return dist < PICKUP_RADIUS;
      });

      if (collectedLoots.length === 0) return {};

      let newInventory = [...state.inventory];
      
      collectedLoots.forEach(loot => {
          const existingIdx = newInventory.findIndex(i => i.type === loot.type);
          if (existingIdx >= 0) {
              newInventory[existingIdx] = { 
                  ...newInventory[existingIdx], 
                  count: newInventory[existingIdx].count + 1 
              };
          } else {
              newInventory.push({
                  id: `item-${Date.now()}-${Math.random()}`,
                  type: loot.type,
                  name: loot.type.charAt(0).toUpperCase() + loot.type.slice(1),
                  count: 1,
                  description: 'Found on ground'
              });
          }
      });

      const remainingLoots = state.loots.filter(loot => !collectedLoots.includes(loot));
      
      return {
          loots: remainingLoots,
          inventory: newInventory
      };
  })
}));
