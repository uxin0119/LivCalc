import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ItemIcon } from './ItemIcons';
import { Loot } from './gameStore';

export const LootItem = ({ loot }: { loot: Loot }) => {
  const groupRef = useRef<any>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Float animation
    groupRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    // Rotate slowly
    groupRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={groupRef} position={[loot.position.x, 0.5, loot.position.z]}>
        {/* Glow effect on ground */}
        <mesh position={[0, -0.4, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <circleGeometry args={[0.4, 16]} />
            <meshBasicMaterial color="yellow" opacity={0.3} transparent />
        </mesh>

        {/* 3D Icon using HTML overlay for crisp SVG */}
        <Html position={[0, 0, 0]} center transform sprite>
            <div className="w-12 h-12 bg-gray-900/50 rounded-full border border-yellow-400/50 flex items-center justify-center backdrop-blur-sm shadow-lg">
                <ItemIcon type={loot.type} className="w-8 h-8 drop-shadow-md" />
            </div>
        </Html>
    </group>
  );
};
