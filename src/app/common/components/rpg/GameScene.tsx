import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Player } from './Player';
import { Ground, Tree, Rock, House, Wagon, Log, Grass, DirtPath, Pond } from './WorldObjects';
import { Enemy } from './Enemy';
import { LootItem } from './LootItem';
import { useGameStore } from './gameStore';

export const GameScene = () => {
  const enemies = useGameStore((state) => state.enemies);
  const moveEnemies = useGameStore((state) => state.moveEnemies);
  const spawnEnemy = useGameStore((state) => state.spawnEnemy);
  const obstacles = useGameStore((state) => state.obstacles);
  const loots = useGameStore((state) => state.loots);
  const checkLootCollection = useGameStore((state) => state.checkLootCollection);
  
  const spawnTimerRef = useRef(0);

  useFrame((state, delta) => {
    // 1. Move Enemies
    moveEnemies(delta);

    // 2. Spawn Logic (every 3.8 seconds - 30% faster than 5.0s)
    spawnTimerRef.current += delta;
    if (spawnTimerRef.current > 3.8) {
        spawnEnemy();
        spawnTimerRef.current = 0;
    }

    // 3. Loot Collection
    checkLootCollection();
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />

      {/* Game Objects */}
      <Player />
      <Ground />
      
      {/* Enemies */}
      {enemies.map(enemy => (
          <Enemy key={enemy.id} data={enemy} />
      ))}

      {/* Loot Drops */}
      {loots.map(loot => (
          <LootItem key={loot.id} loot={loot} />
      ))}

      {/* Environment Obstacles */}
      {obstacles.map(obs => {
          const pos: [number, number, number] = [obs.position.x, obs.position.y, obs.position.z];
          switch(obs.type) {
              case 'tree': return <Tree key={obs.id} position={pos} />;
              case 'rock': return <Rock key={obs.id} position={pos} scale={obs.radius * 2} />;
              case 'house': return <House key={obs.id} position={pos} />;
              case 'wagon': return <Wagon key={obs.id} position={pos} rotation={obs.rotation || 0} />;
              case 'log': return <Log key={obs.id} position={pos} rotation={obs.rotation || 0} />;
              case 'grass': return <Grass key={obs.id} position={pos} />;
              case 'dirtpath': return <DirtPath key={obs.id} position={pos} rotation={obs.rotation || 0} size={obs.size} />;
              case 'pond': return <Pond key={obs.id} position={pos} radius={obs.radius} />;
              default: return null;
          }
      })}

      {/* Optional: Orbit controls for debugging, though Player handles camera */}
      {/* <OrbitControls /> */} 
    </>
  );
};
