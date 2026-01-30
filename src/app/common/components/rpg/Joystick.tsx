import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from './gameStore';

export const Joystick = () => {
  const setMoveVector = useGameStore((state) => state.setMoveVector);
  
  // State for joystick visual
  const [isVisible, setIsVisible] = useState(false);
  const [basePos, setBasePos] = useState({ x: 0, y: 0 });
  const [handlePos, setHandlePos] = useState({ x: 0, y: 0 });
  
  const activePointerId = useRef<number | null>(null);
  
  // Configuration
  const maxRadius = 40; 

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only accept left click or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    // Ignore if clicking on UI elements (buttons)
    // Simple check: if target is a button, ignore.
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;

    e.currentTarget.setPointerCapture(e.pointerId);
    activePointerId.current = e.pointerId;
    
    setIsVisible(true);
    setBasePos({ x: e.clientX, y: e.clientY });
    setHandlePos({ x: 0, y: 0 });
    setMoveVector({ x: 0, z: 0 });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activePointerId.current !== e.pointerId) return;

    const dx = e.clientX - basePos.x;
    const dy = e.clientY - basePos.y;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    let limitedDx = dx;
    let limitedDy = dy;

    if (distance > maxRadius) {
      const angle = Math.atan2(dy, dx);
      limitedDx = Math.cos(angle) * maxRadius;
      limitedDy = Math.sin(angle) * maxRadius;
    }
    
    setHandlePos({ x: limitedDx, y: limitedDy });
    
    // Normalize vector for movement
    // Screen Y is inverted in 3D Z? No, Screen Down (+Y) -> Back (+Z)
    setMoveVector({ 
      x: dx / maxRadius, 
      z: dy / maxRadius 
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activePointerId.current === e.pointerId) {
        activePointerId.current = null;
        setIsVisible(false);
        setHandlePos({ x: 0, y: 0 });
        setMoveVector({ x: 0, z: 0 });
    }
  };

  return (
    <div 
      className="absolute inset-0 z-40 touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {isVisible && (
        <div 
            className="absolute w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center pointer-events-none transition-opacity duration-75"
            style={{ 
                left: basePos.x - 48, // Center the 96px div
                top: basePos.y - 48,
            }}
        >
            <div 
                className="w-10 h-10 rounded-full bg-white/80 shadow-lg absolute"
                style={{ 
                    transform: `translate(${handlePos.x}px, ${handlePos.y}px)`,
                }}
            />
        </div>
      )}
    </div>
  );
};