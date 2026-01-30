import { create } from 'zustand';
import { MAP_DATA } from './MapData';

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

export interface InventoryItem {
  id: string;
  type: 'potion' | 'sword' | 'wood' | 'stone' | 'armor' | 'gun';
  name: string;
  count: number;
  description: string;
}

export interface Loot {
  id: string;
  type: InventoryItem['type'];
  position: Position;
  createdAt: number; // For cleanup
}

export interface Projectile {
  id: string;
  position: Position;
  direction: { x: number; z: number };
  speed: number;
  damage: number;
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

export interface PortalData {
    id: string;
    position: Position;
    targetMap: 'village' | 'wild';
    targetSpawn: Position;
}

interface GameState {
  moveVector: { x: number; z: number };
  setMoveVector: (vector: { x: number; z: number }) => void;
  
  playerPosition: Position;
  setPlayerPosition: (pos: Position) => void;

  isAttacking: boolean;
  setIsAttacking: (isAttacking: boolean) => void;
  attackDamage: number;
  maxHp: number; // Player Max HP

  enemies: EnemyData[];
  setEnemies: (enemies: EnemyData[]) => void;
  damageEnemy: (id: string, damage: number) => void;

  targetEnemyId: string | null;
  setTargetEnemyId: (id: string | null) => void;
  
  // Interaction
  nearbyPortalId: string | null;
  setNearbyPortalId: (id: string | null) => void;

  spawnEnemy: () => void;
  moveEnemies: (delta: number) => void;

  // Map & Environment
  currentMap: 'village' | 'wild';
  currentMapName: string;
  mapTransitionTrigger: number; // Increment to trigger UI effect
  enterMap: (mapId: 'village' | 'wild', spawnPos: Position) => void;
  obstacles: Obstacle[];
  portals: PortalData[];
  
  // Inventory
  inventory: InventoryItem[];
  isInventoryOpen: boolean;
  toggleInventory: () => void;
  addItem: (type: InventoryItem['type'], count: number) => void;
  useItem: (itemId: string) => void;

  // Equipment
  equipment: {
      weapon: InventoryItem | null;
      armor: InventoryItem | null;
  };
  equipItem: (item: InventoryItem) => void;
  unequipItem: (slot: 'weapon' | 'armor') => void;

  // Loot
  loots: Loot[];
  collectLoot: (lootId: string) => void;
  cleanupLoots: () => void;

  // Projectiles
  projectiles: Projectile[];
  fireProjectile: (pos: Position, dir: { x: number; z: number }) => void;
  moveProjectiles: (delta: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  moveVector: { x: 0, z: 0 },
  setMoveVector: (vector) => set({ moveVector: vector }),

  // Initialize in Village
  playerPosition: { ...MAP_DATA.village.spawnPoint }, 
  setPlayerPosition: (pos) => set({ playerPosition: pos }),

  isAttacking: false,
  setIsAttacking: (isAttacking) => set({ isAttacking }),
  attackDamage: 10,
  maxHp: 100,

  enemies: [], // No enemies in village initially
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
                  position: { ...enemy.position },
                  createdAt: Date.now()
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

  nearbyPortalId: null,
  setNearbyPortalId: (id) => set({ nearbyPortalId: id }),

  spawnEnemy: () => set((state) => {
    // Only spawn in Wild
    if (state.currentMap !== 'wild') return {};

    const MAX_ENEMIES = 40;
    const BATCH_SIZE = 3;
    let activeEnemies = state.enemies.filter(e => !e.isDead);
    
    if (activeEnemies.length >= MAX_ENEMIES) return {};

    const newEnemies: EnemyData[] = [];
    
    for (let i = 0; i < BATCH_SIZE; i++) {
        if (activeEnemies.length + newEnemies.length >= MAX_ENEMIES) break;

        // Spawn around player (15m ~ 30m distance)
        const angle = Math.random() * Math.PI * 2;
        const dist = 15 + Math.random() * 15;
        const x = state.playerPosition.x + Math.sin(angle) * dist;
        const z = state.playerPosition.z + Math.cos(angle) * dist;
        
        newEnemies.push({
            id: `enemy-${Date.now()}-${i}`,
            position: { x, y: 0, z },
            hp: 100,
            maxHp: 100,
            isDead: false,
            hitStun: 0,
            aiState: 'idle',
            roamTarget: null,
            idleTimer: 1.0,
            rotation: Math.random() * Math.PI * 2
        });
    }
    
    return { enemies: [...state.enemies, ...newEnemies] };
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

  // Map Logic
  currentMap: 'village',
  currentMapName: MAP_DATA.village.name,
  mapTransitionTrigger: 0,
  obstacles: MAP_DATA.village.obstacles,
  portals: MAP_DATA.village.portals,
  
  enterMap: (mapId, spawnPos) => set((state) => {
      const mapConfig = MAP_DATA[mapId];
      return {
          currentMap: mapId,
          currentMapName: mapConfig.name,
          mapTransitionTrigger: state.mapTransitionTrigger + 1,
          obstacles: mapConfig.obstacles,
          portals: mapConfig.portals,
          playerPosition: { ...spawnPos }, // Use provided spawnPos
          enemies: [], // Clear enemies
          loots: [], // Clear floor loot
          projectiles: [] // Clear flying bullets
      };
  }),

  // Inventory Logic
  inventory: [
      { id: 'item-1', type: 'potion', name: 'Health Potion', count: 5, description: 'Restores 50 HP' },
      { id: 'item-2', type: 'gun', name: 'Assault Rifle', count: 1, description: 'Rapid fire ranged weapon. +5 DMG.' },
      { id: 'item-3', type: 'armor', name: 'Leather Armor', count: 1, description: 'Basic protection. +50 HP.' },
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
  
  useItem: (itemId) => {
      const state = get();
      const item = state.inventory.find(i => i.id === itemId);
      if (item) {
          if (item.type === 'gun' || item.type === 'sword' || item.type === 'armor') {
              state.equipItem(item);
          } else {
              console.log(`Used item: ${itemId}`);
          }
      }
  },

  // Equipment Logic
  equipment: { weapon: null, armor: null },
  equipItem: (item) => set((state) => {
      const slot = (item.type === 'gun' || item.type === 'sword') ? 'weapon' : 'armor';
      const currentEquip = state.equipment[slot];
      
      let newInventory = state.inventory.filter(i => i.id !== item.id);
      
      if (item.count > 1) {
          newInventory = state.inventory.map(i => i.id === item.id ? { ...i, count: i.count - 1 } : i);
          item = { ...item, count: 1 };
      }

      if (currentEquip) {
          newInventory.push(currentEquip);
      }

      const newEquipment = { ...state.equipment, [slot]: item };
      
      let newDamage = 10;
      let newMaxHp = 100;
      
      if (newEquipment.weapon) {
          if (newEquipment.weapon.type === 'gun') newDamage += 5;
          if (newEquipment.weapon.type === 'sword') newDamage += 3;
      }
      if (newEquipment.armor) {
          newMaxHp += 50;
      }

      return {
          inventory: newInventory,
          equipment: newEquipment,
          attackDamage: newDamage,
          maxHp: newMaxHp
      };
  }),
  unequipItem: (slot) => set((state) => {
      const item = state.equipment[slot];
      if (!item) return {};

      const newEquipment = { ...state.equipment, [slot]: null };
      const newInventory = [...state.inventory, item];

      let newDamage = 10;
      let newMaxHp = 100;
      
      if (newEquipment.weapon) {
          if (newEquipment.weapon.type === 'gun') newDamage += 5;
          if (newEquipment.weapon.type === 'sword') newDamage += 3;
      }
      if (newEquipment.armor) {
          newMaxHp += 50;
      }

      return {
          equipment: newEquipment,
          inventory: newInventory,
          attackDamage: newDamage,
          maxHp: newMaxHp
      };
  }),

  // Loot Logic
  loots: [],
  collectLoot: (lootId: string) => set((state) => {
      const lootIndex = state.loots.findIndex(l => l.id === lootId);
      if (lootIndex === -1) return {};

      const loot = state.loots[lootIndex];
      let newInventory = [...state.inventory];
      
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

      const remainingLoots = [...state.loots];
      remainingLoots.splice(lootIndex, 1);
      
      return {
          loots: remainingLoots,
          inventory: newInventory
      };
  }),
  cleanupLoots: () => set((state) => {
      const now = Date.now();
      const MAX_LOOT_AGE = 60000; 
      
      const hasOldLoot = state.loots.some(l => now - l.createdAt > MAX_LOOT_AGE);
      if (!hasOldLoot) return {};

      return {
          loots: state.loots.filter(l => now - l.createdAt <= MAX_LOOT_AGE)
      };
  }),

  // Projectiles
  projectiles: [],
  fireProjectile: (pos, dir) => set((state) => ({
      projectiles: [...state.projectiles, {
          id: `proj-${Date.now()}`,
          position: { ...pos },
          direction: { ...dir },
          speed: 40.0,
          damage: state.attackDamage 
      }]
  })),
  moveProjectiles: (delta) => set((state) => {
      const MAX_RANGE = 30.0;
      const COLLISION_DIST = 0.8;
      const newProjectiles: Projectile[] = [];
      const deadProjIds = new Set<string>();
      
      state.projectiles.forEach(p => {
          const newPos = {
              x: p.position.x + p.direction.x * p.speed * delta,
              y: p.position.y,
              z: p.position.z + p.direction.z * p.speed * delta
          };

          let hitEnemyId: string | null = null;
          state.enemies.forEach(enemy => {
              if (enemy.isDead || deadProjIds.has(p.id)) return;
              const dx = newPos.x - enemy.position.x;
              const dz = newPos.z - enemy.position.z;
              if (Math.sqrt(dx*dx + dz*dz) < COLLISION_DIST) {
                  hitEnemyId = enemy.id;
              }
          });

          if (hitEnemyId) {
              get().damageEnemy(hitEnemyId, p.damage);
              deadProjIds.add(p.id);
          } else {
              const distFromPlayer = Math.sqrt(
                  Math.pow(newPos.x - state.playerPosition.x, 2) + 
                  Math.pow(newPos.z - state.playerPosition.z, 2)
              );
              if (distFromPlayer < MAX_RANGE) {
                  newProjectiles.push({ ...p, position: newPos });
              }
          }
      });
      return { projectiles: newProjectiles };
  })
}));
