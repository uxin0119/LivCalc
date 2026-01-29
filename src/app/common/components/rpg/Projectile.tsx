import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Projectile as ProjectileData } from './gameStore';

export const Projectile = ({ data }: { data: ProjectileData }) => {
  const meshRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Glow/Pulse animation
    meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 10) * 0.2);
  });

  return (
    <mesh position={[data.position.x, 1.0, data.position.z]} ref={meshRef}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshStandardMaterial 
        color="#ffeb3b" 
        emissive="#fbc02d" 
        emissiveIntensity={2} 
      />
      <pointLight color="#ffeb3b" intensity={0.5} distance={2} />
    </mesh>
  );
};
