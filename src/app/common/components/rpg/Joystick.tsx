import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from './gameStore';

export const Joystick = () => {
  const setMoveVector = useGameStore((state) => state.setMoveVector);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  
  // Configuration
  const maxRadius = 40; // Max distance for the knob

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setActive(true);
    updatePosition(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!active) return;
    updatePosition(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setActive(false);
    setPosition({ x: 0, y: 0 });
    setMoveVector({ x: 0, z: 0 });
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Clamp to maxRadius
    if (distance > maxRadius) {
      const angle = Math.atan2(dy, dx);
      dx = Math.cos(angle) * maxRadius;
      dy = Math.sin(angle) * maxRadius;
    }
    
    setPosition({ x: dx, y: dy });
    
    // Update store with normalized vector (-1 to 1)
    // In 3D space, screen Y (up/down) maps to Z (forward/backward)
    // Screen Up (negative dy) -> 3D Forward (negative z)
    // Screen Down (positive dy) -> 3D Backward (positive z)
    // Screen Left (negative dx) -> 3D Left (negative x)
    // Screen Right (positive dx) -> 3D Right (positive x)
    
    // Note: We map dy to z directly.
    setMoveVector({ 
      x: dx / maxRadius, 
      z: dy / maxRadius 
    });
  };

  return (
    <div 
      className="absolute bottom-10 right-10 z-50 select-none touch-none"
    >
      <div 
        ref={containerRef}
        className="relative w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div 
          className="w-12 h-12 rounded-full bg-white shadow-lg absolute pointer-events-none transition-transform duration-75"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px)`,
            opacity: active ? 1 : 0.8
          }}
        />
      </div>
    </div>
  );
};
