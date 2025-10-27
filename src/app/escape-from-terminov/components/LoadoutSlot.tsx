import React from 'react';
import { Weapon, Armor, GameItem, WeaponSlot, ArmorSlot } from '../types/game.types';

interface LoadoutSlotProps {
  slot: WeaponSlot | ArmorSlot;
  item: GameItem | null;
  availableItems: GameItem[];
  handleLoadoutChange: (e: React.ChangeEvent<HTMLSelectElement>, slot: WeaponSlot | ArmorSlot) => void;
  openAttachmentModal: (weapon: Weapon) => void;
}

const LoadoutSlot: React.FC<LoadoutSlotProps> = ({
  slot,
  item,
  availableItems,
  handleLoadoutChange,
  openAttachmentModal,
}) => {
  const isWeaponSlot = slot === 'Primary' || slot === 'Secondary' || slot === 'Melee';
  const weaponItem = item && item.type === 'Weapon' ? item as Weapon : null;

  return (
    <div key={slot} className="p-2 border border-gray-600 rounded mb-2">
        <div className="flex justify-between items-center">
            <span className="font-bold text-green-300">{slot}</span>
            {item && item.type !== 'Consumable' && <span className="text-xs">{(item as Weapon | Armor).durability}/{(item as Weapon | Armor).maxDurability}</span>}
        </div>
        <div className="mt-2">
            <select onChange={(e) => handleLoadoutChange(e, slot)} className="bg-gray-800 text-white w-full p-1 rounded border border-gray-500" value={item?.id || ''}>
                <option value="">- Unequipped -</option>
                {item && <option value={item.id}>{item.name}</option>}
                {availableItems.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
        </div>
        {isWeaponSlot && weaponItem && (
            <div className="mt-2">
                <button
                    onClick={() => openAttachmentModal(weaponItem)}
                    className="w-full bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded border border-blue-500"
                >
                    Attachments
                </button>
            </div>
        )}
    </div>
  );
};

export default LoadoutSlot;
