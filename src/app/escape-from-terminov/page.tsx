"use client";

import React, { useState, useEffect } from 'react';
import Modal from '@/app/common/components/Modal';
import { PlayerState, Loadout, GameItem, Weapon, Armor, Consumable, WeaponSlot, ArmorSlot, ItemType, BodyParts, BodyPart, BodyPartStatus, InjuryType, ConsumableType, AttachmentSlot, Attachment, FireMode, Enemy, EncounterType, Merchant } from './types/game.types';
import { savePlayerState, loadPlayerState } from '@/utils/storage';
import { MASTER_ITEMS, canEquipAttachmentSlot, getAvailableAttachmentSlots } from './data';
import { initialPlayerState, merchants } from './constants';
import { groupItems, getItemTypeDisplay, filterItemsByCategory } from './utils/helpers';
import { useGameLoop } from './hooks/useGameLoop';
import HideoutView from './components/HideoutView';
import RaidView from './components/RaidView';
import LoadoutModal from './components/LoadoutModal';
import ShopModal from './components/ShopModal';
import AttachmentModal from './components/AttachmentModal';

const EscapeFromTerminov = () => {
  const [playerState, setPlayerState] = useState<PlayerState>(initialPlayerState);

  const {
    raidStatus,
    preCombatStatus,
    elapsedTime,
    missionDuration,
    evacTime,
    log,
    raidInventory,
    raidBackpack,
    raidLoadout,
    combatState,
    playerAction,
    painkillerTime,
    intervalRef,
    raidBodyParts,
    progressLog,
    isPlayerExposed,
    raidProgress,
    postCombatTimer,
    overallHpPercent,
    handleStartMission,
    triggerEvacuation,
  } = useGameLoop(playerState, setPlayerState);

  const [isLoadoutModalOpen, setIsLoadoutModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [selectedWeaponForAttachments, setSelectedWeaponForAttachments] = useState<Weapon | null>(null);
  const [activeMerchantIndex, setActiveMerchantIndex] = useState(0);
  const [buyQuantities, setBuyQuantities] = useState<Record<string, number>>({});
  const [moveQuantities, setMoveQuantities] = useState<Record<string, number>>({});
  const [loadoutStashCategory, setLoadoutStashCategory] = useState<'All' | 'Weapons' | 'Armor' | 'Consumables' | 'Medical' | 'Junk'>('All');
  const [shopSellCategory, setShopSellCategory] = useState<'All' | 'Weapons' | 'Armor' | 'Consumables' | 'Medical' | 'Junk'>('All');
  const [dotCount, setDotCount] = useState(0);

  const displayedBodyParts = raidStatus === 'idle' || raidStatus === 'finished' ? playerState.bodyParts : raidBodyParts;
  const carryCapacity = playerState.stats.carryCapacity + ((raidLoadout as any)['Backpack']?.carryCapacityBonus || 0);
  const currentWeight = (Object.values(raidLoadout).filter(Boolean) as GameItem[]).concat(raidBackpack, raidInventory).reduce((sum, item) => sum + item.weight, 0);

  const groupedRaidLoot = groupItems([...raidInventory, ...raidBackpack], false);
  const groupedStash = groupItems(playerState.stash);
  const groupedBackpack = groupItems(playerState.backpack);

  useEffect(() => {
    const savedState = loadPlayerState();
    if (savedState) {
        setPlayerState(prevState => ({
            ...initialPlayerState, 
            ...savedState,
            stats: { ...initialPlayerState.stats, ...savedState.stats },
            bodyParts: savedState.bodyParts || initialPlayerState.bodyParts,
        }));
    }
  }, []);

  useEffect(() => {
    savePlayerState(playerState as any);
  }, [playerState]);

  const addExp = (amount: number) => {
    setPlayerState(prevState => {
      let newExp = prevState.exp + amount;
      let newLevel = prevState.level;
      let newExpToNextLevel = prevState.expToNextLevel;

      while (newExp >= newExpToNextLevel) {
        newExp -= newExpToNextLevel;
        newLevel++;
        newExpToNextLevel = Math.floor(newExpToNextLevel * 1.5);
      }

      return { ...prevState, level: newLevel, exp: newExp, expToNextLevel: newExpToNextLevel };
    });
  };

  const unequipItem = (slot: WeaponSlot | ArmorSlot) => {
    setPlayerState(prevState => {
      const newState = { ...prevState, stash: [...prevState.stash], loadout: { ...prevState.loadout } };
      const item = (newState.loadout as any)[slot];
      if (item) {
        newState.stash.push(item as GameItem);
        (newState.loadout as any)[slot] = null;
      }
      return newState;
    });
  };

  const equipItem = (item: GameItem, slot: WeaponSlot | ArmorSlot) => {
    setPlayerState(prevState => {
      const newState = { ...prevState, stash: [...prevState.stash], loadout: { ...prevState.loadout } };
      const currentlyEquipped = (newState.loadout as any)[slot];
      if (currentlyEquipped) newState.stash.push(currentlyEquipped as GameItem);
      (newState.loadout as any)[slot] = item;
      newState.stash = newState.stash.filter(i => i.id !== item.id);
      return newState;
    });
  };

  const handleLoadoutChange = (e: React.ChangeEvent<HTMLSelectElement>, slot: WeaponSlot | ArmorSlot) => {
    const selectedValue = e.target.value;
    if (selectedValue === '') {
        unequipItem(slot);
    } else {
        const itemToEquip = playerState.stash.find(i => i.id === selectedValue);
        if (itemToEquip) equipItem(itemToEquip, slot);
    }
  };

  const openAttachmentModal = (weapon: Weapon) => {
    setSelectedWeaponForAttachments(weapon);
    setIsAttachmentModalOpen(true);
  };

  const equipAttachment = (attachment: Attachment) => {
    if (!selectedWeaponForAttachments) return;

    const slot = attachment.attachmentSlot;

    setPlayerState(prevState => {
      const newState = { ...prevState };

      let weaponInLoadout: Weapon | null = null;
      let loadoutSlot: WeaponSlot | null = null;

      for (const [key, value] of Object.entries(newState.loadout)) {
        if (value && value.id === selectedWeaponForAttachments.id && value.type === 'Weapon') {
          weaponInLoadout = value as Weapon;
          loadoutSlot = key as WeaponSlot;
          break;
        }
      }

      if (!weaponInLoadout || !loadoutSlot) return prevState;

      if (!weaponInLoadout.attachments) {
        weaponInLoadout.attachments = { Scope: null, Muzzle: null, Tactical: null };
      }

      const existingAttachment = weaponInLoadout.attachments[slot];
      if (existingAttachment) {
        newState.stash.push(existingAttachment);
      }

      weaponInLoadout.attachments[slot] = attachment;

      const attachmentIndex = newState.stash.findIndex(i => i.id === attachment.id);
      if (attachmentIndex !== -1) {
        newState.stash.splice(attachmentIndex, 1);
      }

      (newState.loadout as any)[loadoutSlot] = weaponInLoadout;

      setSelectedWeaponForAttachments(weaponInLoadout);

      return newState;
    });
  };

  const unequipAttachment = (slot: AttachmentSlot) => {
    if (!selectedWeaponForAttachments) return;

    setPlayerState(prevState => {
      const newState = { ...prevState };

      let weaponInLoadout: Weapon | null = null;
      let loadoutSlot: WeaponSlot | null = null;

      for (const [key, value] of Object.entries(newState.loadout)) {
        if (value && value.id === selectedWeaponForAttachments.id && value.type === 'Weapon') {
          weaponInLoadout = value as Weapon;
          loadoutSlot = key as WeaponSlot;
          break;
        }
      }

      if (!weaponInLoadout || !loadoutSlot || !weaponInLoadout.attachments) return prevState;

      const attachment = weaponInLoadout.attachments[slot];
      if (attachment) {
        newState.stash.push(attachment);

        weaponInLoadout.attachments[slot] = null;

        (newState.loadout as any)[loadoutSlot] = weaponInLoadout;

        setSelectedWeaponForAttachments(weaponInLoadout);
      }

      return newState;
    });
  };

  const moveToBackpack = (itemName: string, quantity: number = 1) => {
    setPlayerState(prevState => {
        const newState = { ...prevState, stash: [...prevState.stash], backpack: [...prevState.backpack] };
        let movedCount = 0;
        for (let i = newState.stash.length - 1; i >= 0 && movedCount < quantity; i--) {
            if (newState.stash[i].name === itemName) {
                const [itemToMove] = newState.stash.splice(i, 1);
                newState.backpack.push(itemToMove);
                movedCount++;
            }
        }
        return newState;
    });
    setMoveQuantities(prev => ({ ...prev, [`stash_${itemName}`]: 1 }));
  };

  const moveFromBackpack = (itemName: string, quantity: number = 1) => {
    setPlayerState(prevState => {
        const newState = { ...prevState, stash: [...prevState.stash], backpack: [...prevState.backpack] };
        let movedCount = 0;
        for (let i = newState.backpack.length - 1; i >= 0 && movedCount < quantity; i--) {
            if (newState.backpack[i].name === itemName) {
                const [itemToMove] = newState.backpack.splice(i, 1);
                newState.stash.push(itemToMove);
                movedCount++;
            }
        }
        return newState;
    });
    setMoveQuantities(prev => ({ ...prev, [`backpack_${itemName}`]: 1 }));
  };

  const buyItem = (item: GameItem, quantity: number = 1) => {
    setPlayerState(prevState => {
        const totalCost = item.value * quantity;
        if (prevState.roubles < totalCost) {
            return prevState;
        }
        const newItems = Array.from({ length: quantity }, (_, i) => ({
            ...item,
            id: item.id + Date.now() + i
        }));
        return {
            ...prevState,
            roubles: prevState.roubles - totalCost,
            stash: [...prevState.stash, ...newItems]
        };
    });
    setBuyQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  const sellItem = (item: GameItem) => {
    setPlayerState(prevState => {
        const sellPrice = Math.floor(item.value * 0.5);
        return {
            ...prevState,
            roubles: prevState.roubles + sellPrice,
            stash: prevState.stash.filter(i => i.id !== item.id)
        };
    });
  };

  const healWithStashItem = (consumableType: ConsumableType, partToHeal: BodyPart) => {
    setPlayerState(prevState => {
        const newState = { ...prevState, stash: [...prevState.stash], bodyParts: { ...prevState.bodyParts } };
        const itemIndex = newState.stash.findIndex(i => i.type === 'Consumable' && (i as Consumable).consumableType === consumableType);

        if (itemIndex === -1) return prevState;

        const item = newState.stash[itemIndex] as Consumable;
        const part = { ...newState.bodyParts[partToHeal] };

        let healed = false;
        if (consumableType === 'Medkit' && part.hp < part.maxHp) {
            const healAmount = 25;
            const needed = part.maxHp - part.hp;
            const actualHeal = Math.min(needed, healAmount, item.charges);
            part.hp += actualHeal;
            item.charges -= actualHeal;
            healed = true;
        } else if (consumableType === 'Bandage' && part.injuries.includes('Bleeding')) {
            part.injuries = part.injuries.filter(i => i !== 'Bleeding');
            item.charges -= 1;
            healed = true;
        } else if (consumableType === 'Splint' && part.injuries.includes('Fracture')) {
            part.injuries = part.injuries.filter(i => i !== 'Fracture');
            item.charges -= 1;
            healed = true;
        } else if (consumableType === 'SurgeryKit' && part.injuries.includes('Crippled')) {
            part.injuries = part.injuries.filter(i => i !== 'Crippled');
            part.hp = 1;
            item.charges -= 1;
            healed = true;
        }

        if (healed) {
            if (item.charges <= 0) {
                newState.stash.splice(itemIndex, 1);
            }
            newState.bodyParts[partToHeal] = part;
        }

        return newState;
    });
  };

  return (
    <>
      <div className="bg-black text-green-400 font-mono text-sm h-screen p-2 flex flex-col">
        <div className="border border-green-400 mb-2">
          <div className="flex justify-between items-center bg-green-900 text-green-200 p-1">
            <span>Escape From Terminov</span>
            <div className="flex space-x-2"><span>_</span><span>□</span><span>X</span></div>
          </div>
        </div>
        <div className="flex flex-grow space-x-2" style={{maxHeight: 'calc(100vh - 100px)'}}>
          {raidStatus === 'idle' || raidStatus === 'finished' ? (
            <HideoutView 
                playerState={playerState} 
                overallHpPercent={overallHpPercent} 
                displayedBodyParts={displayedBodyParts} 
                groupedStash={groupedStash} 
                log={log} 
                healWithStashItem={healWithStashItem} 
              />
          ) : (
            <RaidView 
                playerState={playerState}
                raidStatus={raidStatus}
                overallHpPercent={overallHpPercent}
                displayedBodyParts={displayedBodyParts}
                raidLoadout={raidLoadout}
                currentWeight={currentWeight}
                carryCapacity={carryCapacity}
                progressLog={progressLog}
                dotCount={dotCount}
                log={log}
                groupedRaidLoot={groupedRaidLoot}
                elapsedTime={elapsedTime}
                missionDuration={missionDuration}
                evacTime={evacTime}
                combatState={combatState}
                playerAction={playerAction}
              />
          )}
        </div>
        <div className="border border-green-400 mt-2 p-2 flex justify-start space-x-4">
          {raidStatus === 'idle' || raidStatus === 'finished' ? (
            <button onClick={handleStartMission} className="bg-green-700 text-white px-4 py-1 border border-green-400 hover:bg-green-600">Start Mission</button>
          ) : (
            <button onClick={() => triggerEvacuation(false)} className="bg-yellow-600 text-white px-4 py-1 border border-yellow-400 hover:bg-yellow-500" disabled={raidStatus === 'evacuating' || raidStatus === 'in-combat'}>Manual Evac</button>
          )}
          <button onClick={() => setIsLoadoutModalOpen(true)} className="bg-gray-700 text-gray-300 px-4 py-1 border border-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed" disabled={raidStatus !== 'idle' && raidStatus !== 'finished'}>Loadout Config</button>
          <button onClick={() => setIsShopModalOpen(true)} className="bg-blue-700 text-white px-4 py-1 border border-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed" disabled={raidStatus !== 'idle' && raidStatus !== 'finished'}>Shop</button>
        </div>
      </div>
      
      <LoadoutModal
        isOpen={isLoadoutModalOpen}
        onClose={() => setIsLoadoutModalOpen(false)}
        playerState={playerState}
        groupedStash={groupedStash}
        groupedBackpack={groupedBackpack}
        loadoutStashCategory={loadoutStashCategory}
        setLoadoutStashCategory={setLoadoutStashCategory}
        handleLoadoutChange={handleLoadoutChange}
        openAttachmentModal={openAttachmentModal}
        moveToBackpack={moveToBackpack}
        moveFromBackpack={moveFromBackpack}
        moveQuantities={moveQuantities}
        setMoveQuantities={setMoveQuantities}
        currentWeight={currentWeight}
        carryCapacity={carryCapacity}
      />

      <ShopModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
        playerState={playerState}
        merchants={merchants}
        activeMerchantIndex={activeMerchantIndex}
        setActiveMerchantIndex={setActiveMerchantIndex}
        buyItem={buyItem}
        sellItem={sellItem}
        buyQuantities={buyQuantities}
        setBuyQuantities={setBuyQuantities}
        shopSellCategory={shopSellCategory}
        setShopSellCategory={setShopSellCategory}
        groupedStash={groupedStash}
        filterItemsByCategory={filterItemsByCategory}
        getItemTypeDisplay={getItemTypeDisplay}
      />

      <AttachmentModal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        selectedWeaponForAttachments={selectedWeaponForAttachments}
        playerState={playerState}
        equipAttachment={equipAttachment}
        unequipAttachment={unequipAttachment}
      />
    </>
  );
};

export default EscapeFromTerminov;