import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Group } from 'three';
import { useGameStore } from './gameStore';

const SPEED = 5;

export const Player = () => {
  const groupRef = useRef<Group>(null);
  const moveVectorState = useGameStore((state) => state.moveVector);
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const moveX = moveVectorState.x;
    const moveZ = moveVectorState.z;

    // Movement logic
    const moveVec = new Vector3(moveX, 0, moveZ);
    if (moveVec.length() > 0) {
      // If magnitude > 1 (shouldn't happen if normalized, but safety), clamp it
      if (moveVec.length() > 1) moveVec.normalize();
      
      moveVec.multiplyScalar(SPEED * delta);
      groupRef.current.position.add(moveVec);
      
      // Rotate character to face movement direction
      const angle = Math.atan2(moveX, moveZ);
      groupRef.current.rotation.y = angle; 
    }

    // Camera follow logic
    const playerPos = groupRef.current.position;
    const cameraOffset = new Vector3(0, 10, 10); // Isometric-ish view offset
    const targetCameraPos = playerPos.clone().add(cameraOffset);
    
    // Smooth camera movement
    camera.position.lerp(targetCameraPos, 0.1);
    camera.lookAt(playerPos);
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Body */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color="#1976d2" flatShading />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.25, 6, 6]} />
        <meshStandardMaterial color="#ffcc80" flatShading />
      </mesh>
    </group>
  );
};
