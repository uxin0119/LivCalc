import { Obstacle, Position } from './gameStore';

export interface MapConfig {
    id: 'village' | 'wild';
    name: string; // Display Name
    spawnPoint: Position; // Default spawn (e.g. game start)
    obstacles: Obstacle[];
    portals: { 
        id: string; 
        position: Position; 
        targetMap: 'village' | 'wild'; 
        targetSpawn: Position; // Where player lands in target map
    }[];
}

export const MAP_DATA: Record<'village' | 'wild', MapConfig> = {
    village: {
        id: 'village',
        name: 'Peaceful Village',
        spawnPoint: { x: 0, y: 0, z: 0 },
        obstacles: [
            // Houses
            { id: 'v-house-1', type: 'house', position: { x: -5, y: 0, z: -5 }, radius: 2.0, collidable: true },
            { id: 'v-house-2', type: 'house', position: { x: 5, y: 0, z: -5 }, radius: 2.0, collidable: true },
            { id: 'v-house-3', type: 'house', position: { x: -8, y: 0, z: 2 }, radius: 2.0, collidable: true },
            
            // Path to Wild
            { id: 'v-path-1', type: 'dirtpath', position: { x: 0, y: 0, z: 5 }, radius: 0, collidable: false, size: [2, 15] },
            
            // Decor
            { id: 'v-wagon', type: 'wagon', position: { x: 3, y: 0, z: 2 }, radius: 1.2, collidable: true, rotation: -0.5 },
            { id: 'v-log', type: 'log', position: { x: -2, y: 0, z: 3 }, radius: 0.5, collidable: true },
            { id: 'v-pond', type: 'pond', position: { x: 8, y: 0, z: 5 }, radius: 2.0, collidable: true },
        ],
        portals: [
            { 
                id: 'p-to-wild', 
                position: { x: 0, y: 0, z: 12 }, 
                targetMap: 'wild',
                targetSpawn: { x: 0, y: 0, z: -12 } // Arrive at Wild South
            }
        ]
    },
    wild: {
        id: 'wild',
        name: 'Dangerous Wilds',
        spawnPoint: { x: 0, y: 0, z: -10 },
        obstacles: [
            // Trees & Rocks (Dense)
            { id: 'w-tree-1', type: 'tree', position: { x: -5, y: 0, z: 5 }, radius: 0.5, collidable: true },
            { id: 'w-tree-2', type: 'tree', position: { x: 8, y: 0, z: -2 }, radius: 0.5, collidable: true },
            { id: 'w-tree-3', type: 'tree', position: { x: -10, y: 0, z: -10 }, radius: 0.5, collidable: true },
            { id: 'w-rock-1', type: 'rock', position: { x: 3, y: 0.2, z: 8 }, radius: 0.5, collidable: true },
            { id: 'w-rock-2', type: 'rock', position: { x: -6, y: 0.3, z: -5 }, radius: 0.7, collidable: true },
            
            // Grass
            { id: 'w-grass-1', type: 'grass', position: { x: 2, y: 0, z: 2 }, radius: 0, collidable: false },
            { id: 'w-grass-2', type: 'grass', position: { x: -2, y: 0, z: -2 }, radius: 0, collidable: false },
            
            // Path back to village
            { id: 'w-path', type: 'dirtpath', position: { x: 0, y: 0, z: -12 }, radius: 0, collidable: false, size: [2, 5] },
        ],
        portals: [
            { 
                id: 'p-to-village', 
                position: { x: 0, y: 0, z: -14 }, 
                targetMap: 'village',
                targetSpawn: { x: 0, y: 0, z: 10 } // Arrive at Village North
            }
        ]
    }
};
