import { useState } from 'react';
import { PlayerState, GameItem, Weapon, WeaponSlot, ArmorSlot, Attachment, AttachmentSlot, ConsumableType, BodyPart } from '../types/game.types';
import {
  unequipItemFromLoadout,
  equipItemToLoadout,
  equipAttachmentToWeapon,
  unequipAttachmentFromWeapon,
  moveItemsToBackpack,
  moveItemsFromBackpack,
  buyItemFromMerchant,
  sellItemToMerchant,
  healBodyPartWithItem
} from '../logic/player';

export const useInventoryHandlers = (
  playerState: PlayerState,
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>
) => {
  const unequipItem = (slot: WeaponSlot | ArmorSlot) => {
    setPlayerState(prevState => unequipItemFromLoadout(prevState, slot));
  };

  const equipItem = (item: GameItem, slot: WeaponSlot | ArmorSlot) => {
    setPlayerState(prevState => equipItemToLoadout(prevState, item, slot));
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

  const equipAttachment = (
    attachment: Attachment,
    selectedWeaponForAttachments: Weapon | null,
    setSelectedWeaponForAttachments: React.Dispatch<React.SetStateAction<Weapon | null>>
  ) => {
    if (!selectedWeaponForAttachments) return;

    setPlayerState(prevState => {
      const { state, updatedWeapon } = equipAttachmentToWeapon(
        prevState,
        selectedWeaponForAttachments.id,
        attachment
      );
      if (updatedWeapon) {
        setSelectedWeaponForAttachments(updatedWeapon);
      }
      return state;
    });
  };

  const unequipAttachment = (
    slot: AttachmentSlot,
    selectedWeaponForAttachments: Weapon | null,
    setSelectedWeaponForAttachments: React.Dispatch<React.SetStateAction<Weapon | null>>
  ) => {
    if (!selectedWeaponForAttachments) return;

    setPlayerState(prevState => {
      const { state, updatedWeapon } = unequipAttachmentFromWeapon(
        prevState,
        selectedWeaponForAttachments.id,
        slot
      );
      if (updatedWeapon) {
        setSelectedWeaponForAttachments(updatedWeapon);
      }
      return state;
    });
  };

  const moveToBackpack = (
    itemName: string,
    quantity: number = 1,
    setMoveQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>
  ) => {
    setPlayerState(prevState => moveItemsToBackpack(prevState, itemName, quantity));
    setMoveQuantities(prev => ({ ...prev, [`stash_${itemName}`]: 1 }));
  };

  const moveFromBackpack = (
    itemName: string,
    quantity: number = 1,
    setMoveQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>
  ) => {
    setPlayerState(prevState => moveItemsFromBackpack(prevState, itemName, quantity));
    setMoveQuantities(prev => ({ ...prev, [`backpack_${itemName}`]: 1 }));
  };

  const buyItem = (
    item: GameItem,
    quantity: number = 1,
    setBuyQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>
  ) => {
    setPlayerState(prevState => {
        const newState = buyItemFromMerchant(prevState, item, quantity);
        return newState || prevState; // Return original state if purchase failed
    });
    setBuyQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  const sellItem = (item: GameItem) => {
    setPlayerState(prevState => sellItemToMerchant(prevState, item));
  };

  const healWithStashItem = (consumableType: ConsumableType, partToHeal: BodyPart) => {
    setPlayerState(prevState => {
        const newState = healBodyPartWithItem(prevState, consumableType, partToHeal);
        return newState || prevState; // Return original state if healing failed
    });
  };

  const filterItemsByCategory = (items: GameItem[], category: 'All' | 'Weapons' | 'Armor' | 'Consumables' | 'Medical' | 'Junk') => {
    if (category === 'All') return items;

    return items.filter(item => {
      if (category === 'Weapons') {
        return item.type === 'Weapon';
      } else if (category === 'Armor') {
        return item.type === 'Armor';
      } else if (category === 'Medical') {
        return item.type === 'Consumable' && (
          item.consumableType === 'Medkit' ||
          item.consumableType === 'Bandage' ||
          item.consumableType === 'Splint' ||
          item.consumableType === 'SurgeryKit' ||
          item.consumableType === 'Painkiller'
        );
      } else if (category === 'Consumables') {
        return item.type === 'Consumable' && (
          item.consumableType === 'Food' ||
          item.consumableType === 'Ammo' ||
          item.consumableType === 'Attachment'
        );
      } else if (category === 'Junk') {
        return item.type === 'Consumable' && item.consumableType === 'Generic';
      }
      return false;
    });
  };

  return {
    unequipItem,
    equipItem,
    handleLoadoutChange,
    equipAttachment,
    unequipAttachment,
    moveToBackpack,
    moveFromBackpack,
    buyItem,
    sellItem,
    healWithStashItem,
    filterItemsByCategory
  };
};
