import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Group, Mesh } from 'three';
import { useGameStore } from './gameStore';

const SPEED = 5;
const ATTACK_RANGE = 2.0;
const DETECTION_RANGE = 8.0;
const PLAYER_RADIUS = 0.3; // Collision size

export const Player = () => {
  const groupRef = useRef<Group>(null);
  const weaponRef = useRef<Group>(null);
  const moveVectorState = useGameStore((state) => state.moveVector);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setIsAttacking = useGameStore((state) => state.setIsAttacking);
  const isAttacking = useGameStore((state) => state.isAttacking);
  const damageEnemy = useGameStore((state) => state.damageEnemy);
  const attackDamage = useGameStore((state) => state.attackDamage);
  const fireProjectile = useGameStore((state) => state.fireProjectile);
  const setTargetEnemyId = useGameStore((state) => state.setTargetEnemyId);
  const { camera } = useThree();

  // Attack animation state (Recoil)
  const recoilAnimRef = useRef(0);
  const isFiringRef = useRef(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const enemies = useGameStore.getState().enemies; 
    const obstacles = useGameStore.getState().obstacles; 

    const moveX = moveVectorState.x;
    const moveZ = moveVectorState.z;
    const playerPos = groupRef.current.position;

    // 1. Find Nearest Enemy (Target Locking)
    let nearestEnemyId: string | null = null;
    let nearestEnemyDist = Infinity;
    let targetEnemyPos: Vector3 | null = null;
    
    enemies.forEach(enemy => {
        if (enemy.isDead) return;
        const enemyPos = new Vector3(enemy.position.x, enemy.position.y, enemy.position.z);
        const dist = playerPos.distanceTo(enemyPos);
        if (dist < nearestEnemyDist) {
            nearestEnemyDist = dist;
            nearestEnemyId = enemy.id;
            targetEnemyPos = enemyPos;
        }
    });

    // Ranged Detection Range (Always Ranged now)
    const lockRange = 15.0;
    const attackRange = 12.0;

    if (nearestEnemyDist < lockRange && nearestEnemyId) {
        setTargetEnemyId(nearestEnemyId);
    } else {
        setTargetEnemyId(null);
        nearestEnemyId = null; 
    }

    // 2. Movement Logic (Sliding Collision)
    const moveVec = new Vector3(moveX, 0, moveZ);
    if (moveVec.length() > 0) {
      if (moveVec.length() > 1) moveVec.normalize();
      moveVec.multiplyScalar(SPEED * delta);

      // Try X axis movement
      const nextPosX = playerPos.clone().add(new Vector3(moveVec.x, 0, 0));
      let canMoveX = true;
      for (const obs of obstacles) {
          if (!obs.collidable) continue;
          const dx = nextPosX.x - obs.position.x;
          const dz = nextPosX.z - obs.position.z;
          const dist = Math.sqrt(dx*dx + dz*dz);
          if (dist < (PLAYER_RADIUS + obs.radius)) {
              canMoveX = false;
              break;
          }
      }
      if (canMoveX) groupRef.current.position.x += moveVec.x;

      // Try Z axis movement (using potentially updated X)
      const nextPosZ = groupRef.current.position.clone().add(new Vector3(0, 0, moveVec.z));
      let canMoveZ = true;
      for (const obs of obstacles) {
          if (!obs.collidable) continue;
          const dx = nextPosZ.x - obs.position.x;
          const dz = nextPosZ.z - obs.position.z;
          const dist = Math.sqrt(dx*dx + dz*dz);
          if (dist < (PLAYER_RADIUS + obs.radius)) {
              canMoveZ = false;
              break;
          }
      }
      if (canMoveZ) groupRef.current.position.z += moveVec.z;
    }

    groupRef.current.position.y = 0.5;

    // 3. Rotation Logic
    const isWithinAttackRange = nearestEnemyId !== null && nearestEnemyDist < attackRange;

    if (targetEnemyPos && isWithinAttackRange) {
        const target = targetEnemyPos as Vector3;
        groupRef.current.lookAt(target.x, groupRef.current.position.y, target.z);
    } else if (moveVec.length() > 0) {
        const angle = Math.atan2(moveX, moveZ);
        groupRef.current.rotation.y = angle; 
    }

    // Camera follow logic
    const currentPos = groupRef.current.position;
    const cameraOffset = new Vector3(0, 10, 10);
    const targetCameraPos = currentPos.clone().add(cameraOffset);
    camera.position.lerp(targetCameraPos, 0.2);
    camera.lookAt(currentPos);

    // 4. Auto-Attack Logic
    const shouldAttack = nearestEnemyId !== null && nearestEnemyDist < attackRange;

    if (shouldAttack && !isAttacking) {
        setIsAttacking(true);
    } else if (!shouldAttack && isAttacking && recoilAnimRef.current === 0) {
         setIsAttacking(false);
    }

    // Gun Animation & Firing
    if (weaponRef.current) {
        if (isAttacking) {
            // Recoil Animation: Slide back and kick up
            recoilAnimRef.current += delta * 20; // Speed
            
            // Fire at start of recoil
            if (!isFiringRef.current && recoilAnimRef.current < 0.5) {
                const dir = new Vector3(0, 0, 1).applyQuaternion(groupRef.current!.quaternion);
                fireProjectile(
                    { x: playerPos.x, y: 1.0, z: playerPos.z },
                    { x: dir.x, z: dir.z }
                );
                isFiringRef.current = true;
            }

            // Animation Curve: 0 -> 1 -> 0
            // Simple recoil: z position moves back, rotation x kicks up
            if (recoilAnimRef.current < Math.PI) {
                const kick = Math.sin(recoilAnimRef.current);
                weaponRef.current.position.z = 0.3 - kick * 0.2; // Slide back (base 0.3)
                weaponRef.current.rotation.x = -kick * 0.2; // Kick up (negative x is up in this orientation?)
                // If Gun points +Z. +X rotation tips it down. -X tips it up.
            } else {
                // Reset
                recoilAnimRef.current = 0;
                isFiringRef.current = false;
            }
        } else {
            // Idle
            weaponRef.current.position.z = 0.3;
            weaponRef.current.rotation.x = 0;
            recoilAnimRef.current = 0;
            isFiringRef.current = false;
        }
    }
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
      
      {/* Eyes */}
      <mesh position={[0.1, 1.45, 0.2]} castShadow>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.1, 1.45, 0.2]} castShadow>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Gun Weapon Group */}
      <group position={[0.2, 0.8, 0.3]} ref={weaponRef}>
          <group rotation={[Math.PI / 2, 0, 0]}> 
            {/* Rotate internal parts to point Z forward (Cylinder default is Y up) */}
            
            {/* Stock */}
            <mesh position={[0, -0.2, 0]} castShadow>
                <boxGeometry args={[0.08, 0.4, 0.15]} />
                <meshStandardMaterial color="#5d4037" />
            </mesh>
            {/* Barrel */}
            <mesh position={[0, 0.4, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.05, 1.0]} />
                <meshStandardMaterial color="#37474f" />
            </mesh>
            {/* Magazine */}
            <mesh position={[0, 0.1, 0.15]} rotation={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.06, 0.3, 0.1]} />
                <meshStandardMaterial color="#212121" />
            </mesh>
          </group>
      </group>
    </group>
  );
};
