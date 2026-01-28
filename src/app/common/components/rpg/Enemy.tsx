import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { EnemyData, useGameStore } from './gameStore';

interface EnemyProps {
  data: EnemyData;
}

export const Enemy = ({ data }: EnemyProps) => {
  const visualRef = useRef<Group>(null);
  const bodyMeshRef = useRef<Mesh>(null); // Ref for material color change
  const targetEnemyId = useGameStore((state) => state.targetEnemyId);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const isTargeted = targetEnemyId === data.id;

  useFrame((state) => {
    if (!visualRef.current || data.isDead) return;
    
    // Simple idle animation (bounce)
    visualRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;

    // Look at player
    visualRef.current.lookAt(playerPosition.x, visualRef.current.position.y + 0.75, playerPosition.z);

    // Hit reaction effect
    if (data.hitStun > 0 && bodyMeshRef.current) {
        // Flash white/red rapidly
        const flash = Math.sin(state.clock.elapsedTime * 20) > 0;
        if (Array.isArray(bodyMeshRef.current.material)) {
             // If multiple materials, handle accordingly
        } else {
             (bodyMeshRef.current.material as any).color.set(flash ? 'white' : '#ef5350');
        }
    } else if (bodyMeshRef.current) {
         // Reset color
         if (bodyMeshRef.current.material && !(Array.isArray(bodyMeshRef.current.material))) {
             (bodyMeshRef.current.material as any).color.set('#ef5350');
         }
    }
  });

  if (data.isDead) return null;

  const hpRatio = data.hp / data.maxHp;
  const showHpBar = data.hp < data.maxHp;

  return (
    <group position={[data.position.x, 0, data.position.z]}>
        {/* Target Highlight Ring */}
        {isTargeted && (
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.8, 1.0, 32]} />
                <meshBasicMaterial color="#ffff00" opacity={0.5} transparent />
            </mesh>
        )}

        {/* HP Bar Container - Only show when damaged */}
        {showHpBar && (
            <group position={[0, 2.2, 0]}>
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[1, 0.1]} />
                    <meshBasicMaterial color="gray" />
                </mesh>
                <mesh position={[-(1 - hpRatio) / 2, 0, 0.01]}>
                    <planeGeometry args={[hpRatio, 0.1]} />
                    <meshBasicMaterial color="#4caf50" />
                </mesh>
            </group>
        )}

        {/* Character Visuals (Body + Eyes) */}
        <group ref={visualRef} position={[0, 0.75, 0]}> 
            {/* Body */}
            <mesh ref={bodyMeshRef} castShadow>
                <boxGeometry args={[0.6, 1.2, 0.6]} />
                <meshStandardMaterial color="#ef5350" />
            </mesh>
            
            {/* Eyes */}
            <mesh position={[0.15, 0.35, 0.31]} castShadow>
                <boxGeometry args={[0.1, 0.1, 0.05]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[-0.15, 0.35, 0.31]} castShadow>
                <boxGeometry args={[0.1, 0.1, 0.05]} />
                <meshStandardMaterial color="black" />
            </mesh>
        </group>
    </group>
  );
};
