import React from 'react';

export const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#4caf50" />
    </mesh>
  );
};

export const Tree = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.4, 1.5, 5]} />
        <meshStandardMaterial color="#8d6e63" flatShading />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 2, 0]} castShadow>
        <coneGeometry args={[1, 2, 5]} />
        <meshStandardMaterial color="#2e7d32" flatShading />
      </mesh>
      <mesh position={[0, 3, 0]} castShadow>
        <coneGeometry args={[0.8, 1.5, 5]} />
        <meshStandardMaterial color="#388e3c" flatShading />
      </mesh>
    </group>
  );
};

export const Rock = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  return (
    <mesh position={position} scale={scale} castShadow>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#757575" flatShading />
    </mesh>
  );
};
