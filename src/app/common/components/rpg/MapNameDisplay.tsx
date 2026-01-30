import React, { useEffect, useState } from 'react';
import { useGameStore } from './gameStore';

export const MapNameDisplay = () => {
  const currentMapName = useGameStore((state) => state.currentMapName);
  const mapTransitionTrigger = useGameStore((state) => state.mapTransitionTrigger);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
        setVisible(false);
    }, 2000); // Show for 2 seconds
    return () => clearTimeout(timer);
  }, [currentMapName, mapTransitionTrigger]); // Trigger on map change

  return (
    <div 
        className={`fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 100 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-widest text-center">
        {currentMapName}
      </h1>
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-white to-transparent mt-2 opacity-50" />
    </div>
  );
};
