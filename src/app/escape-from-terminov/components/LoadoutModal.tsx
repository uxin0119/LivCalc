import React from 'react';
import Modal from '@/app/common/components/Modal';
import { PlayerState, Weapon, Armor, GameItem, WeaponSlot, ArmorSlot } from '../types/game.types';
import LoadoutSlot from './LoadoutSlot';
import { filterItemsByCategory, getItemTypeDisplay } from '../utils/helpers';

interface LoadoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerState: PlayerState;
  groupedStash: Record<string, GameItem & { count?: number }>;
  groupedBackpack: Record<string, GameItem & { count?: number }>;
  loadoutStashCategory: 'All' | 'Weapons' | 'Armor' | 'Consumables' | 'Medical' | 'Junk';
  setLoadoutStashCategory: (category: 'All' | 'Weapons' | 'Armor' | 'Consumables' | 'Medical' | 'Junk') => void;
  handleLoadoutChange: (e: React.ChangeEvent<HTMLSelectElement>, slot: WeaponSlot | ArmorSlot) => void;
  openAttachmentModal: (weapon: Weapon) => void;
  moveToBackpack: (itemName: string, quantity?: number) => void;
  moveFromBackpack: (itemName: string, quantity?: number) => void;
  moveQuantities: Record<string, number>;
  setMoveQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  currentWeight: number;
  carryCapacity: number;
}

const LoadoutModal: React.FC<LoadoutModalProps> = ({
  isOpen,
  onClose,
  playerState,
  groupedStash,
  groupedBackpack,
  loadoutStashCategory,
  setLoadoutStashCategory,
  handleLoadoutChange,
  openAttachmentModal,
  moveToBackpack,
  moveFromBackpack,
  moveQuantities,
  setMoveQuantities,
  currentWeight,
  carryCapacity,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Loadout Configuration" size="70">
      <div className="text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left Panel - Stats */}
              <div className="border border-gray-600 p-3 rounded">
                  <h3 className="text-lg font-bold mb-3 text-green-300">Stats</h3>
                  <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                          <span className="text-gray-400">Accuracy:</span>
                          <span className="text-green-400">{playerState.stats.accuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-gray-400">Defense:</span>
                          <span className="text-green-400">
                              {(((playerState.loadout as any)['Helmet']?.defense || 0) + ((playerState.loadout as any)['Body Armor']?.defense || 0))}
                          </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-600 pt-2">
                          <span className="text-gray-400">Total Weight:</span>
                          <span className={`${currentWeight > carryCapacity ? 'text-red-400' : 'text-green-400'}`}>
                              {currentWeight.toFixed(1)} / {carryCapacity.toFixed(1)} kg
                          </span>
                      </div>
                  </div>

                  <h3 className="text-lg font-bold mt-4 mb-2 text-green-300">Equipment</h3>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-green-400">Weapons</h4>
                    {(['Primary', 'Secondary', 'Melee'] as WeaponSlot[]).map(slot => (
                        <LoadoutSlot
                            key={slot}
                            slot={slot}
                            item={(playerState.loadout as any)[slot]}
                            availableItems={playerState.stash.filter(i => (i as any).slot === slot)}
                            handleLoadoutChange={handleLoadoutChange}
                            openAttachmentModal={openAttachmentModal}
                        />
                    ))}
                    <h4 className="font-bold text-xs text-green-400 mt-2">Armor</h4>
                    {(['Helmet', 'Body Armor', 'Backpack'] as ArmorSlot[]).map(slot => (
                        <LoadoutSlot
                            key={slot}
                            slot={slot}
                            item={(playerState.loadout as any)[slot]}
                            availableItems={playerState.stash.filter(i => (i as any).slot === slot)}
                            handleLoadoutChange={handleLoadoutChange}
                            openAttachmentModal={openAttachmentModal}
                        />
                    ))}
                  </div>
              </div>

              {/* Middle Panel - Stash */}
              <div>
                  <h3 className="text-lg font-bold mb-2 text-green-300">Stash</h3>

                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-1 mb-2">
                      {(['All', 'Weapons', 'Armor', 'Medical', 'Consumables', 'Junk'] as const).map(category => (
                          <button
                              key={category}
                              onClick={() => setLoadoutStashCategory(category)}
                              className={`px-2 py-1 text-xs rounded border transition-colors ${
                                  loadoutStashCategory === category
                                      ? 'bg-green-700 border-green-400 text-white'
                                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                              }`}
                          >
                              {category}
                          </button>
                      ))}
                  </div>

                  <ul className="space-y-2 overflow-y-auto max-h-96 bg-gray-800 p-2 border border-gray-600 rounded">
                      {Object.values(groupedStash).filter(item => {
                          const filteredItems = filterItemsByCategory([item], loadoutStashCategory);
                          return filteredItems.length > 0;
                      }).map(item => {
                              const quantity = moveQuantities[`stash_${item.name}`] || 1;
                              const maxQuantity = item.count || 1;
                              return (
                              <li key={item.id} className="border-b border-gray-700 pb-2">
                                  <div className="text-sm">
                                      <span className="font-semibold">[{getItemTypeDisplay(item)}] {item.name}</span>
                                      {item.count && item.count > 1 && <span className="text-gray-400"> x{item.count}</span>}
                                      <div className="text-xs text-gray-400">{item.weight.toFixed(1)}kg</div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                      <input
                                          type="number"
                                          min="1"
                                          max={maxQuantity}
                                          value={Math.min(quantity, maxQuantity)}
                                          onChange={(e) => setMoveQuantities(prev => ({ ...prev, [`stash_${item.name}`]: Math.min(parseInt(e.target.value) || 1, maxQuantity) }))}
                                          className="w-12 bg-gray-700 text-white px-1 py-0.5 text-xs rounded border border-gray-600"
                                      />
                                      <button
                                          onClick={() => moveToBackpack(item.name, Math.min(quantity, maxQuantity))}
                                          className="text-blue-400 hover:text-blue-300 text-xs px-2 py-0.5 border border-blue-500 rounded"
                                      >
                                          →
                                      </button>
                                  </div>
                              </li>
                          );
                      })}
                  </ul>
              </div>

              {/* Right Panel - Backpack */}
              <div>
                  <h3 className="text-lg font-bold mb-2 text-green-300">Backpack</h3>
                  <ul className="space-y-2 overflow-y-auto max-h-96 bg-gray-800 p-2 border border-gray-600 rounded">
                      {Object.values(groupedBackpack).map(item => {
                          const quantity = moveQuantities[`backpack_${item.name}`] || 1;
                          const maxQuantity = item.count || 1;
                          return (
                              <li key={item.id} className="border-b border-gray-700 pb-2">
                                  <div className="text-sm">
                                      <span className="font-semibold">[{getItemTypeDisplay(item)}] {item.name}</span>
                                      {item.count && item.count > 1 && <span className="text-gray-400"> x{item.count}</span>}
                                      <div className="text-xs text-gray-400">{item.weight.toFixed(1)}kg</div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                      <button
                                          onClick={() => moveFromBackpack(item.name, Math.min(quantity, maxQuantity))}
                                          className="text-yellow-400 hover:text-yellow-300 text-xs px-2 py-0.5 border border-yellow-500 rounded"
                                      >
                                          ←
                                      </button>
                                      <input
                                          type="number"
                                          min="1"
                                          max={maxQuantity}
                                          value={Math.min(quantity, maxQuantity)}
                                          onChange={(e) => setMoveQuantities(prev => ({ ...prev, [`backpack_${item.name}`]: Math.min(parseInt(e.target.value) || 1, maxQuantity) }))}
                                          className="w-12 bg-gray-700 text-white px-1 py-0.5 text-xs rounded border border-gray-600"
                                      />
                                  </div>
                              </li>
                          );
                      })}
                  </ul>
              </div>
          </div>
      </div>
    </Modal>
  );
};

export default LoadoutModal;
