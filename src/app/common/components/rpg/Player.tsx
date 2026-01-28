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
  const enemies = useGameStore((state) => state.enemies);
  const obstacles = useGameStore((state) => state.obstacles);
  const isAttacking = useGameStore((state) => state.isAttacking);
  const damageEnemy = useGameStore((state) => state.damageEnemy);
  const attackDamage = useGameStore((state) => state.attackDamage);
  const setTargetEnemyId = useGameStore((state) => state.setTargetEnemyId);
  const { camera } = useThree();

  // Attack animation state
  const attackAnimRef = useRef(0);
  const hasDealtDamageRef = useRef(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

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

    // Update global target state if within detection range
    if (nearestEnemyDist < DETECTION_RANGE && nearestEnemyId) {
        setTargetEnemyId(nearestEnemyId);
    } else {
        setTargetEnemyId(null);
        nearestEnemyId = null; 
    }

    // 2. Movement Logic with Collision Detection
    const moveVec = new Vector3(moveX, 0, moveZ);
    if (moveVec.length() > 0) {
      if (moveVec.length() > 1) moveVec.normalize();
      moveVec.multiplyScalar(SPEED * delta);
      
      // Predict next position
      const nextPos = playerPos.clone().add(moveVec);
      
      // Check collision
      let canMove = true;
      for (const obs of obstacles) {
          if (!obs.collidable) continue;
          
          const dx = nextPos.x - obs.position.x;
          const dz = nextPos.z - obs.position.z;
          const dist = Math.sqrt(dx*dx + dz*dz);
          
          if (dist < (PLAYER_RADIUS + obs.radius)) {
              canMove = false;
              break;
          }
      }

      if (canMove) {
          groupRef.current.position.add(moveVec);
      }
    }

    // Force stick to ground (Y=0.5 hardcoded for now, or use raycast later)
    groupRef.current.position.y = 0.5;

    // 3. Rotation Logic (Face Target if exists AND within ATTACK_RANGE, else face movement)
    const isWithinAttackRange = nearestEnemyId !== null && nearestEnemyDist < ATTACK_RANGE;

    if (targetEnemyPos && isWithinAttackRange) {
        // Face the target
        const target = targetEnemyPos as Vector3;
        groupRef.current.lookAt(target.x, groupRef.current.position.y, target.z);
    } else if (moveVec.length() > 0) {
        // Face movement direction
        const angle = Math.atan2(moveX, moveZ);
        groupRef.current.rotation.y = angle; 
    }

    // Update global position state
    setPlayerPosition({
      x: groupRef.current.position.x,
      y: groupRef.current.position.y,
      z: groupRef.current.position.z,
    });

    // Camera follow logic
    const cameraOffset = new Vector3(0, 10, 10);
    const targetCameraPos = playerPos.clone().add(cameraOffset);
    camera.position.lerp(targetCameraPos, 0.1);
    camera.lookAt(playerPos);

    // 4. Auto-Attack Logic
    const shouldAttack = nearestEnemyId !== null && nearestEnemyDist < ATTACK_RANGE;

    if (shouldAttack && !isAttacking) {
        setIsAttacking(true);
        hasDealtDamageRef.current = false;
    } else if (!shouldAttack && isAttacking && attackAnimRef.current === 0) {
         setIsAttacking(false);
    }

    // Weapon Animation & Damage Dealing
    if (weaponRef.current) {
        if (isAttacking) {
            attackAnimRef.current += delta * 7.5; // Animation speed reduced by 50% (was 15)
            // Swing from 0 to PI
            const swing = Math.sin(attackAnimRef.current) * 2;
            // Swing on X axis from a forward lean
            weaponRef.current.rotation.x = Math.PI / 3 + swing;

            // Deal damage at the peak of the swing (Area of Effect)
            if (!hasDealtDamageRef.current && swing > 1.2) {
                enemies.forEach(enemy => {
                    if (enemy.isDead) return;
                    const enemyPos = new Vector3(enemy.position.x, enemy.position.y, enemy.position.z);
                    const dist = groupRef.current!.position.distanceTo(enemyPos);
                    
                    // AOE Range check (Basic slash range)
                    if (dist <= ATTACK_RANGE) {
                        damageEnemy(enemy.id, attackDamage);
                        console.log(`AOE Hit: ${enemy.id} for ${attackDamage}`);
                    }
                });
                hasDealtDamageRef.current = true;
            }

            // Reset animation
             if (attackAnimRef.current > Math.PI) {
                 attackAnimRef.current = 0;
                 hasDealtDamageRef.current = false; 
             }

        } else {
            // Reset to resting position: leaning forward
            weaponRef.current.rotation.x = Math.PI / 3; 
            attackAnimRef.current = 0;
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

      {/* Weapon Arm / Weapon Group */}
      <group position={[0.3, 0.8, 0.1]} ref={weaponRef} rotation={[Math.PI / 3, 0, 0]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.1, 0.8, 0.1]} />
            <meshStandardMaterial color="#8d6e63" />
          </mesh>
           <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[0.2, 0.4, 0.2]} />
            <meshStandardMaterial color="silver" />
          </mesh>
      </group>
    </group>
  );
};
