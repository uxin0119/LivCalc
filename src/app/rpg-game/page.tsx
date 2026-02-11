'use client';

import { Canvas } from '@react-three/fiber';
import { GameScene } from '../common/components/rpg/GameScene';
import { Joystick } from '../common/components/rpg/Joystick';
import { KeyboardController } from '../common/components/rpg/KeyboardController';
import { Inventory } from '../common/components/rpg/Inventory';
import { IconBag } from '../common/components/rpg/ItemIcons';
import { MapNameDisplay } from '../common/components/rpg/MapNameDisplay';
import { useGameStore } from '../common/components/rpg/gameStore';

export default function RPGPage() {
  const toggleInventory = useGameStore((state) => state.toggleInventory);
  
  // Interaction State
  const nearbyPortalId = useGameStore((state) => state.nearbyPortalId);
  const portals = useGameStore((state) => state.portals);
  const enterMap = useGameStore((state) => state.enterMap);

  const handleInteraction = () => {
      if (nearbyPortalId) {
          const portal = portals.find(p => p.id === nearbyPortalId);
          if (portal) {
              enterMap(portal.targetMap, portal.targetSpawn);
          }
      }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black touch-none overflow-hidden">
      <KeyboardController />
      <Inventory />
      <MapNameDisplay />
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10 text-white pointer-events-none select-none">
        <h1 className="text-2xl font-bold mb-2">Mini RPG Prototype</h1>
        <p className="text-sm opacity-80 hidden lg:block">Use WASD or Arrow Keys to move. Press 'I' for Bag.</p>
        <p className="text-sm opacity-80 lg:hidden">Use Joystick to move.</p>
      </div>

      {/* Interaction Button */}
      {nearbyPortalId && (
          <button
            onClick={handleInteraction}
            className="absolute bottom-24 right-4 z-50 bg-blue-600/90 hover:bg-blue-500 text-white p-4 rounded-full border-2 border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse-glow transition-all active:scale-95"
          >
            <span className="text-2xl">🚪</span>
          </button>
      )}

      {/* Inventory Toggle Button (Mobile & Desktop) */}
      <button
        onClick={toggleInventory}
        className="absolute top-4 right-4 z-50 bg-gray-900/80 hover:bg-gray-800 text-white p-3 rounded-full border border-gray-700 shadow-xl transition-all active:scale-95"
      >
        <IconBag className="w-8 h-8" />
      </button>

      <Joystick />

      <Canvas shadows camera={{ position: [0, 10, 10], fov: 50 }}>
        <color attach="background" args={['#87CEEB']} /> {/* Sky Blue Background */}
        <fog attach="fog" args={['#87CEEB', 10, 50]} />
        <GameScene />
      </Canvas>
      
      {/* Back Button Overlay */}
       <div className="absolute bottom-4 left-4 z-50">
        <a
          href="/"
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded backdrop-blur-sm transition-colors"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
