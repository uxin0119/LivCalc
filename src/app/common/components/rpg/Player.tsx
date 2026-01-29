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
  const weaponType = useGameStore((state) => state.weaponType);
  const fireProjectile = useGameStore((state) => state.fireProjectile);
  const setTargetEnemyId = useGameStore((state) => state.setTargetEnemyId);
  const { camera } = useThree();

  // Attack animation state
  const attackAnimRef = useRef(0);
  const hasDealtDamageRef = useRef(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const enemies = useGameStore.getState().enemies; // Read fresh state directly
    const obstacles = useGameStore.getState().obstacles; // Read fresh state directly

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

    // Ranged vs Melee Detection & Attack Range
    const lockRange = weaponType === 'ranged' ? 15.0 : DETECTION_RANGE;
    const currentAttackRange = weaponType === 'ranged' ? 12.0 : ATTACK_RANGE;

    if (nearestEnemyDist < lockRange && nearestEnemyId) {
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
      const nextPos = playerPos.clone().add(moveVec);
      
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
      if (canMove) groupRef.current.position.add(moveVec);
    }

    groupRef.current.position.y = 0.5;

    // 3. Rotation Logic (Face Target if exists AND within currentAttackRange, else face movement)
    const isWithinAttackRange = nearestEnemyId !== null && nearestEnemyDist < currentAttackRange;

    if (targetEnemyPos && isWithinAttackRange) {
        const target = targetEnemyPos as Vector3;
        groupRef.current.lookAt(target.x, groupRef.current.position.y, target.z);
    } else if (moveVec.length() > 0) {
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
    const shouldAttack = nearestEnemyId !== null && nearestEnemyDist < currentAttackRange;

    if (shouldAttack && !isAttacking) {
        setIsAttacking(true);
        hasDealtDamageRef.current = false;
    } else if (!shouldAttack && isAttacking && attackAnimRef.current === 0) {
         setIsAttacking(false);
    }

    // Weapon Animation & Damage Dealing
    if (weaponRef.current) {
        if (isAttacking) {
            // Animation Phase: 0 -> PI
            // Phase 1: Swing Down (0 -> PI/2) - Fast
            // Phase 2: Return (PI/2 -> PI) - Slow
            
            const isSwingDown = attackAnimRef.current < Math.PI / 2;
            const speed = isSwingDown ? 25 : 5; // Fast down, slow up
            
            attackAnimRef.current += delta * speed;

            // Swing Logic
            // Swing from rest (PI/3) to hit (PI/3 + range)
            const range = Math.PI / 2.5; // Narrower range
            const swing = Math.sin(attackAnimRef.current) * range;
            weaponRef.current.rotation.x = Math.PI / 3 + swing;

            // Deal damage at the peak (approx PI/2)
            if (!hasDealtDamageRef.current && attackAnimRef.current >= Math.PI / 2) {
                if (weaponType === 'melee') {
                    enemies.forEach(enemy => {
                        if (enemy.isDead) return;
                        const enemyPos = new Vector3(enemy.position.x, enemy.position.y, enemy.position.z);
                        const dist = groupRef.current!.position.distanceTo(enemyPos);
                        
                        if (dist <= ATTACK_RANGE) {
                            damageEnemy(enemy.id, attackDamage);
                        }
                    });
                } else {
                    // Ranged: Fire Projectile
                    // Calculate forward direction based on player rotation
                    const dir = new Vector3(0, 0, 1).applyQuaternion(groupRef.current!.quaternion);
                    fireProjectile(
                        { x: playerPos.x, y: 1.0, z: playerPos.z },
                        { x: dir.x, z: dir.z }
                    );
                }
                hasDealtDamageRef.current = true;
            }

            // Reset animation at end of cycle
             if (attackAnimRef.current > Math.PI) {
                 attackAnimRef.current = 0;
                 hasDealtDamageRef.current = false; 
                 // Note: We don't set isAttacking=false here, loop continues if enemy near.
                 // But logic above handles auto-attack stop.
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
          {weaponType === 'melee' ? (
              <>
                <mesh position={[0, 0.4, 0]} castShadow>
                    <boxGeometry args={[0.1, 0.8, 0.1]} />
                    <meshStandardMaterial color="#8d6e63" />
                </mesh>
                <mesh position={[0, 0.9, 0]} castShadow>
                    <boxGeometry args={[0.2, 0.4, 0.2]} />
                    <meshStandardMaterial color="silver" />
                </mesh>
              </>
          ) : (
              <>
                {/* Magic Staff */}
                <mesh position={[0, 0.6, 0]} castShadow>
                    <cylinderGeometry args={[0.05, 0.05, 1.2]} />
                    <meshStandardMaterial color="#5d4037" />
                </mesh>
                <mesh position={[0, 1.2, 0]} castShadow>
                    <sphereGeometry args={[0.15, 8, 8]} />
                    <meshStandardMaterial color="#ffeb3b" emissive="#fbc02d" emissiveIntensity={2} />
                </mesh>
              </>
          )}
      </group>
    </group>
  );
};
