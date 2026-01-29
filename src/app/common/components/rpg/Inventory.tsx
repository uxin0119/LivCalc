import React, { useEffect } from 'react';
import { useGameStore, InventoryItem } from './gameStore';
import { ItemIcon } from './ItemIcons';

export const Inventory = () => {
  const isOpen = useGameStore((state) => state.isInventoryOpen);
  const toggleInventory = useGameStore((state) => state.toggleInventory);
  const inventory = useGameStore((state) => state.inventory);
  const useItem = useGameStore((state) => state.useItem);
  
  // Equipment State
  const equipment = useGameStore((state) => state.equipment);
  const unequipItem = useGameStore((state) => state.unequipItem);
  const attackDamage = useGameStore((state) => state.attackDamage);
  const maxHp = useGameStore((state) => state.maxHp);

  // Keyboard listener for 'I'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'i') {
        toggleInventory();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleInventory]);

  if (!isOpen) return null;

  // Grid Slots (e.g. 5x4 = 20 slots)
  const TOTAL_SLOTS = 20;
  const slots = Array.from({ length: TOTAL_SLOTS });

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
       {/* Background Overlay - clickable to close */}
       <div 
          className="absolute inset-0 bg-black/50 pointer-events-auto"
          onClick={toggleInventory}
       />

       {/* Inventory Window */}
       <div className="relative bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-xl p-4 w-[90%] max-w-md shadow-2xl pointer-events-auto flex flex-col gap-4 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                🎒 Inventory
            </h2>
            <div className="flex gap-3 text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1"><span className="text-red-400">⚔️</span> {attackDamage}</span>
                <span className="flex items-center gap-1"><span className="text-green-400">❤️</span> {maxHp}</span>
            </div>
            <button 
                onClick={toggleInventory}
                className="text-gray-400 hover:text-white transition-colors text-xl font-bold px-2"
            >
                ✕
            </button>
          </div>

          {/* Equipment Slots */}
          <div className="flex gap-4 justify-center bg-black/40 p-3 rounded-lg border border-gray-800">
              {/* Weapon Slot */}
              <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Weapon</span>
                  <div 
                    className={`w-14 h-14 rounded-lg border-2 ${equipment.weapon ? 'border-yellow-600 bg-gray-800 cursor-pointer' : 'border-dashed border-gray-700 bg-black/20'} flex items-center justify-center transition-all relative group`}
                    onClick={() => equipment.weapon && unequipItem('weapon')}
                  >
                      {equipment.weapon ? (
                          <ItemIcon type={equipment.weapon.type} className="w-10 h-10 drop-shadow-md" />
                      ) : (
                          <span className="text-gray-700 text-xl">⚔️</span>
                      )}
                      
                      {equipment.weapon && (
                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 w-32 bg-gray-900 border border-yellow-700 rounded p-2 shadow-xl">
                            <p className="font-bold text-xs text-yellow-500">{equipment.weapon.name}</p>
                            <p className="text-[10px] text-gray-400">Click to unequip</p>
                        </div>
                      )}
                  </div>
              </div>

              {/* Armor Slot */}
              <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Armor</span>
                  <div 
                    className={`w-14 h-14 rounded-lg border-2 ${equipment.armor ? 'border-blue-600 bg-gray-800 cursor-pointer' : 'border-dashed border-gray-700 bg-black/20'} flex items-center justify-center transition-all relative group`}
                    onClick={() => equipment.armor && unequipItem('armor')}
                  >
                      {equipment.armor ? (
                          <ItemIcon type={equipment.armor.type} className="w-10 h-10 drop-shadow-md" />
                      ) : (
                          <span className="text-gray-700 text-xl">🛡️</span>
                      )}

                      {equipment.armor && (
                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 w-32 bg-gray-900 border border-blue-700 rounded p-2 shadow-xl">
                            <p className="font-bold text-xs text-blue-400">{equipment.armor.name}</p>
                            <p className="text-[10px] text-gray-400">Click to unequip</p>
                        </div>
                      )}
                  </div>
              </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-5 gap-2">
            {slots.map((_, index) => {
                const item = inventory[index];
                return (
                    <div 
                        key={index}
                        className={`
                            aspect-square rounded-lg border-2 
                            ${item ? 'border-gray-600 bg-gray-800 hover:border-blue-400 cursor-pointer' : 'border-gray-800 bg-gray-900/50'}
                            relative flex items-center justify-center transition-all group
                        `}
                        onClick={() => item && useItem(item.id)}
                    >
                        {item && (
                            <>
                                {/* Icon */}
                                <div className="w-2/3 h-2/3">
                                    <ItemIcon type={item.type} className="w-full h-full drop-shadow-lg" />
                                </div>
                                
                                {/* Count Badge */}
                                {item.count > 1 && (
                                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono border border-gray-700">
                                        {item.count}
                                    </span>
                                )}

                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 w-40 bg-gray-900 border border-gray-600 rounded p-2 shadow-xl">
                                    <p className="font-bold text-sm text-white mb-0.5">{item.name}</p>
                                    <p className="text-xs text-gray-400">{item.description}</p>
                                    <p className="text-[10px] text-blue-400 mt-1">Click to use</p>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
          </div>

          {/* Footer Info */}
          <div className="text-xs text-center text-gray-500 mt-2">
             Press 'I' to close
          </div>
       </div>
    </div>
  );
};
