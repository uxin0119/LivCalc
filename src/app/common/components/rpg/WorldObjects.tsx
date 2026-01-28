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

export const House = ({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            {/* Base */}
            <mesh position={[0, 1, 0]} castShadow receiveShadow>
                <boxGeometry args={[3, 2, 3]} />
                <meshStandardMaterial color="#e0e0e0" flatShading />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
                <coneGeometry args={[2.5, 1.5, 4]} />
                <meshStandardMaterial color="#d32f2f" flatShading />
            </mesh>
            {/* Door */}
            <mesh position={[0, 0.75, 1.51]}>
                <planeGeometry args={[0.8, 1.5]} />
                <meshStandardMaterial color="#5d4037" />
            </mesh>
        </group>
    );
};

export const Log = ({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) => {
    return (
        <group position={position} rotation={[0, rotation, 0]}>
            <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
                <meshStandardMaterial color="#5d4037" flatShading />
            </mesh>
        </group>
    );
};

export const Wagon = ({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) => {
    return (
        <group position={position} rotation={[0, rotation, 0]}>
             {/* Bed */}
            <mesh position={[0, 0.6, 0]} castShadow>
                <boxGeometry args={[2, 0.5, 1.2]} />
                <meshStandardMaterial color="#8d6e63" flatShading />
            </mesh>
            {/* Wheels */}
            <mesh position={[0.8, 0.3, 0.6]} rotation={[Math.PI/2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
                <meshStandardMaterial color="#3e2723" />
            </mesh>
            <mesh position={[-0.8, 0.3, 0.6]} rotation={[Math.PI/2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
                <meshStandardMaterial color="#3e2723" />
            </mesh>
             <mesh position={[0.8, 0.3, -0.6]} rotation={[Math.PI/2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
                <meshStandardMaterial color="#3e2723" />
            </mesh>
            <mesh position={[-0.8, 0.3, -0.6]} rotation={[Math.PI/2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
                <meshStandardMaterial color="#3e2723" />
            </mesh>
        </group>
    );
};

export const Grass = ({ position }: { position: [number, number, number] }) => {
    return (
        <group position={position}>
            <mesh position={[0, 0.25, 0]} rotation={[0, Math.random() * Math.PI, 0]}>
                <coneGeometry args={[0.2, 0.5, 3]} />
                <meshStandardMaterial color="#8bc34a" flatShading />
            </mesh>
             <mesh position={[0.1, 0.2, 0.1]} rotation={[0, Math.random() * Math.PI, 0]}>
                <coneGeometry args={[0.15, 0.4, 3]} />
                <meshStandardMaterial color="#7cb342" flatShading />
            </mesh>
        </group>
    );
};

export const DirtPath = ({ position, rotation = 0, size = [1, 1] }: { position: [number, number, number], rotation?: number, size?: [number, number] }) => {
    return (
        <mesh position={[position[0], -0.48, position[2]]} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
            <planeGeometry args={[size[0], size[1]]} />
            <meshStandardMaterial color="#795548" />
        </mesh>
    );
};

export const Pond = ({ position, radius = 2 }: { position: [number, number, number], radius?: number }) => {
    return (
        <mesh position={[position[0], -0.45, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[radius, 32]} />
            <meshStandardMaterial color="#4fc3f7" transparent opacity={0.8} />
        </mesh>
    );
};
