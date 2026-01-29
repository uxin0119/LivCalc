import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { Text } from '@react-three/drei';
import { EnemyData, useGameStore } from './gameStore';

interface EnemyProps {
  data: EnemyData;
}

interface DamagePopupData {
    id: number;
    value: number;
}

const DamageNumber = ({ value, onComplete }: { value: number, onComplete: () => void }) => {
    const textRef = useRef<any>(null); // Text component ref
    const timeRef = useRef(0);

    useFrame((state, delta) => {
        timeRef.current += delta;
        if (timeRef.current > 1.0) {
            onComplete();
            return;
        }

        if (textRef.current) {
            textRef.current.position.y += delta * 1.5;
            // Update opacity via fillOpacity prop or changing state if prop binding works
            // Changing state in useFrame is bad, but for opacity on a single element it might be ok if optimized,
            // better to modify material directly if possible.
            // Text from drei uses `fillOpacity`.
            textRef.current.fillOpacity = 1 - timeRef.current;
        }
    });

    return (
        <Text
            ref={textRef}
            position={[0, 2.5, 0]}
            fontSize={0.5}
            color="yellow"
            fillOpacity={1} 
            strokeWidth={0.02}
            strokeColor="black"
        >
            {value}
        </Text>
    );
};

export const Enemy = ({ data }: EnemyProps) => {
  const visualRef = useRef<Group>(null);
  const bodyMeshRef = useRef<Mesh>(null); 
  const targetEnemyId = useGameStore((state) => state.targetEnemyId);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const isTargeted = targetEnemyId === data.id;
  
  // Hit Effects State
  const [damagePopups, setDamagePopups] = useState<DamagePopupData[]>([]);
  const prevHpRef = useRef(data.hp);
  const pulseRef = useRef(0);
  
  // Death animation state
  const deathTimerRef = useRef(0);
  const isFullyDeadRef = useRef(false);

  // Detect Damage
  useEffect(() => {
    if (data.hp < prevHpRef.current) {
        const damage = prevHpRef.current - data.hp;
        // Add new popup
        const newPopup = { id: Date.now(), value: damage };
        setDamagePopups(prev => [...prev, newPopup]);
        
        // Trigger Scale Pulse
        pulseRef.current = 1.0;
    }
    prevHpRef.current = data.hp;
  }, [data.hp]);

  const removePopup = (id: number) => {
      setDamagePopups(prev => prev.filter(p => p.id !== id));
  };

  useFrame((state, delta) => {
    if (!visualRef.current || isFullyDeadRef.current) return;

    // Remove setDamagePopups from here!

    if (data.isDead) {
        deathTimerRef.current += delta;
        
        // Death Animation: Fall back and Sink
        const progress = Math.min(deathTimerRef.current / 0.5, 1.0); 
        visualRef.current.rotation.x = -Math.PI / 2 * progress;
        
        if (progress >= 1.0) {
             visualRef.current.position.y = 0.75 - (deathTimerRef.current - 0.5);
        }

        if (deathTimerRef.current > 1.5) {
            isFullyDeadRef.current = true;
            visualRef.current.visible = false;
        }
        return; 
    }
    
    // Simple idle animation (bounce)
    visualRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;

    // Scale Pulse Logic
    if (pulseRef.current > 0) {
        pulseRef.current -= delta * 5;
        const s = 1.0 + Math.max(0, Math.sin(pulseRef.current * Math.PI) * 0.3);
        visualRef.current.scale.set(s, s, s);
    } else {
        visualRef.current.scale.set(1, 1, 1);
    }

    // Apply Rotation from AI Store
    // data.rotation is Y-axis angle in radians
    visualRef.current.rotation.y = data.rotation;

    // Hit reaction effect
    if (data.hitStun > 0 && bodyMeshRef.current) {
        const flash = Math.sin(state.clock.elapsedTime * 20) > 0;
        if (bodyMeshRef.current.material && !(Array.isArray(bodyMeshRef.current.material))) {
             (bodyMeshRef.current.material as any).color.set(flash ? 'white' : '#ef5350');
        }
    } else if (bodyMeshRef.current) {
         if (bodyMeshRef.current.material && !(Array.isArray(bodyMeshRef.current.material))) {
             (bodyMeshRef.current.material as any).color.set('#ef5350');
         }
    }
  });

  if (isFullyDeadRef.current) return null; 

  const hpRatio = data.hp / data.maxHp;
  const showHpBar = data.hp < data.maxHp && !data.isDead; 

  return (
    <group position={[data.position.x, 0, data.position.z]}>
        {/* Damage Popups */}
        {damagePopups.map(p => (
            <DamageNumber 
                key={p.id} 
                value={p.value} 
                onComplete={() => removePopup(p.id)} 
            />
        ))}

        {/* Target Highlight Ring */}
        {isTargeted && (
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.8, 1.0, 32]} />
                <meshBasicMaterial color="#ffff00" opacity={0.5} transparent />
            </mesh>
        )}

        {/* HP Bar Container - Only show when damaged */}
        {showHpBar && (
            <group position={[0, 2.2, 0]}>
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[1, 0.1]} />
                    <meshBasicMaterial color="gray" />
                </mesh>
                <mesh position={[-(1 - hpRatio) / 2, 0, 0.01]}>
                    <planeGeometry args={[hpRatio, 0.1]} />
                    <meshBasicMaterial color="#4caf50" />
                </mesh>
            </group>
        )}

        {/* Character Visuals (Body + Eyes) */}
        <group ref={visualRef} position={[0, 0.75, 0]}> 
            {/* Body */}
            <mesh ref={bodyMeshRef} castShadow>
                <boxGeometry args={[0.6, 1.2, 0.6]} />
                <meshStandardMaterial color="#ef5350" />
            </mesh>
            
            {/* Eyes */}
            <mesh position={[0.15, 0.35, 0.31]} castShadow>
                <boxGeometry args={[0.1, 0.1, 0.05]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[-0.15, 0.35, 0.31]} castShadow>
                <boxGeometry args={[0.1, 0.1, 0.05]} />
                <meshStandardMaterial color="black" />
            </mesh>
        </group>
    </group>
  );
};
