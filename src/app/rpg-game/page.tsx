'use client';

import { Canvas } from '@react-three/fiber';
import { GameScene } from '../common/components/rpg/GameScene';
import { Joystick } from '../common/components/rpg/Joystick';
import { KeyboardController } from '../common/components/rpg/KeyboardController';

export default function RPGPage() {
  return (
    <div className="w-full h-screen relative bg-black touch-none">
      <KeyboardController />
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10 text-white pointer-events-none select-none">
        <h1 className="text-2xl font-bold mb-2">Mini RPG Prototype</h1>
        <p className="text-sm opacity-80 hidden lg:block">Use WASD or Arrow Keys to move.</p>
        <p className="text-sm opacity-80 lg:hidden">Use Joystick to move.</p>
      </div>

      <Joystick />

      <Canvas shadows camera={{ position: [0, 10, 10], fov: 50 }}>
        <color attach="background" args={['#87CEEB']} /> {/* Sky Blue Background */}
        <fog attach="fog" args={['#87CEEB', 10, 50]} />
        <GameScene />
      </Canvas>
      
      {/* Back Button Overlay */}
       <div className="absolute bottom-4 left-4 z-10">
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
