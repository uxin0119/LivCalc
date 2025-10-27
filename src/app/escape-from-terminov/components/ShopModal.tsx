
"use client";

import React from 'react';
import Modal from '@/app/common/components/Modal';
import { GameItem, PlayerState } from '../types/game.types';

// Define a more specific type for merchants if available
interface Merchant {
    name: string;
    type: 'Weapons' | 'Armor' | 'Medical' | 'Junk';
    inventory: GameItem[];
}

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    playerState: PlayerState;
    merchants: Merchant[];
    activeMerchantIndex: number;
    setActiveMerchantIndex: (index: number) => void;
    buyItem: (item: GameItem, quantity: number) => void;
    sellItem: (item: GameItem) => void;
    buyQuantities: Record<string, number>;
    setBuyQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    shopSellCategory: 'All' | 'Weapons' | 'Armor' | 'Consumables' | 'Medical' | 'Junk';
    setShopSellCategory: (category: 'All' | 'Weapons' | 'Armor' | 'Consumables' | 'Medical' | 'Junk') => void;
    groupedStash: Record<string, GameItem & { count?: number }>;
    filterItemsByCategory: (items: GameItem[], category: 'All' | 'Weapons' | 'Armor' | 'Consumables' | 'Medical' | 'Junk') => GameItem[];
    getItemTypeDisplay: (item: GameItem) => string;
}

const ShopModal: React.FC<ShopModalProps> = ({
    isOpen,
    onClose,
    playerState,
    merchants,
    activeMerchantIndex,
    setActiveMerchantIndex,
    buyItem,
    sellItem,
    buyQuantities,
    setBuyQuantities,
    shopSellCategory,
    setShopSellCategory,
    groupedStash,
    filterItemsByCategory,
    getItemTypeDisplay
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Traders" size="xl">
            <div className="text-white">
                {/* Tabs */}
                <div className="flex border-b border-gray-600 mb-4">
                    {merchants.map((merchant, index) => (
                        <button
                            key={merchant.name}
                            onClick={() => setActiveMerchantIndex(index)}
                            className={`px-4 py-2 font-bold transition-colors ${
                                activeMerchantIndex === index
                                    ? 'text-green-400 border-b-2 border-green-400'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            {merchant.name}
                            <div className="text-xs font-normal">{merchant.type}</div>
                        </button>
                    ))}
                </div>

                {/* Active Merchant Content */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-green-300">Your Roubles: {playerState.roubles}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-bold mb-2 text-green-400">Buy</h4>
                        <ul className="space-y-2 overflow-y-auto max-h-60 bg-gray-800 p-2 border border-gray-600 rounded">
                            {merchants[activeMerchantIndex].inventory.map(item => {
                                const quantity = buyQuantities[item.id] || 1;
                                const totalCost = item.value * quantity;
                                const canAfford = playerState.roubles >= totalCost;
                                return (
                                    <li key={item.id} className="border-b border-gray-700 pb-2">
                                        <div
                                            className={`cursor-pointer hover:text-green-300 ${!canAfford ? 'text-gray-500' : ''}`}
                                            onClick={() => canAfford && buyItem(item, quantity)}
                                        >
                                            <span className="font-semibold">[{getItemTypeDisplay(item)}] {item.name}</span>
                                            <div className="text-xs text-gray-400">
                                                {item.weight.toFixed(1)}kg - {item.value} R each
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <input
                                                type="number"
                                                min="1"
                                                max="99"
                                                value={quantity}
                                                onChange={(e) => setBuyQuantities(prev => ({ ...prev, [item.id]: parseInt(e.target.value) || 1 }))}
                                                className="w-16 bg-gray-700 text-white px-2 py-1 text-xs rounded border border-gray-600"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span className="text-xs text-gray-400">
                                                Total: {totalCost} R
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2 text-green-400">Sell</h4>

                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-1 mb-2">
                            {(['All', 'Weapons', 'Armor', 'Medical', 'Consumables', 'Junk'] as const).map(category => (
                                <button
                                    key={category}
                                    onClick={() => setShopSellCategory(category)}
                                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                                        shopSellCategory === category
                                            ? 'bg-green-700 border-green-400 text-white'
                                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <ul className="space-y-2 overflow-y-auto max-h-60 bg-gray-800 p-2 border border-gray-600 rounded">
                            {Object.values(groupedStash).filter(item => {
                                const filteredItems = filterItemsByCategory([item], shopSellCategory);
                                return filteredItems.length > 0;
                            }).map(item => (
                                <li key={item.id} className="flex justify-between items-center">
                                    <span>[{getItemTypeDisplay(item)}] {item.name} {(item.count || 0) > 1 ? `x${item.count}`: ''} ({item.weight.toFixed(1)}kg) - {Math.floor(item.value * 0.5)} R</span>
                                    <button onClick={() => sellItem(item)} className="text-yellow-400 hover:text-yellow-300 text-xs">Sell</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ShopModal;
