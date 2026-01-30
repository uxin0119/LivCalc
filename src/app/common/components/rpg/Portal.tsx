import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PortalData } from './gameStore';

export const Portal = ({ data }: { data: PortalData }) => {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.02;
    meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
  });

  return (
    <group position={[data.position.x, 0, data.position.z]}>
      {/* Magic Circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.5, 2, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.5} side={2} />
      </mesh>
      
      {/* Pillar of Light */}
      <mesh position={[0, 1.5, 0]} ref={meshRef}>
        <cylinderGeometry args={[1.5, 1.5, 3, 32, 1, true]} />
        <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.2} 
            side={2}
            blending={2} // Additive blending for glow
        />
      </mesh>

      {/* Floating Particles (Simplified) */}
      <mesh position={[0, 2, 0]}>
         <octahedronGeometry args={[0.5]} />
         <meshStandardMaterial color="white" emissive="cyan" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};
