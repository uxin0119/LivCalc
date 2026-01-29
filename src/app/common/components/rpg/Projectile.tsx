import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Projectile as ProjectileData } from './gameStore';
import * as THREE from 'three';

// Bullet Geometry
const projectileGeometry = new THREE.CapsuleGeometry(0.05, 0.2, 4, 8);
const projectileMaterial = new THREE.MeshStandardMaterial({
  color: "#ffeb3b", 
  emissive: "#ffc107", 
  emissiveIntensity: 3
});

export const Projectile = ({ data }: { data: ProjectileData }) => {
  const meshRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Rotate to face direction
    const angle = Math.atan2(data.direction.x, data.direction.z);
    meshRef.current.rotation.y = angle;
    meshRef.current.rotation.x = Math.PI / 2; // Lay flat to fly
  });

  return (
    <mesh 
      position={[data.position.x, 1.0, data.position.z]} 
      ref={meshRef}
      geometry={projectileGeometry}
      material={projectileMaterial}
    >
      <pointLight color="#ffeb3b" intensity={0.5} distance={3} />
    </mesh>
  );
};
