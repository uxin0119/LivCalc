import { WEAPONS } from './weapons';
import { AMMO } from './ammo';
import { ATTACHMENTS } from './attachments';
import { ARMOR } from './armor';
import { CONSUMABLES } from './consumables';

// ===== MASTER ITEM TABLE =====
// Combines all game items from separate modules
export const MASTER_ITEMS = {
  ...WEAPONS,
  ...AMMO,
  ...ATTACHMENTS,
  ...ARMOR,
  ...CONSUMABLES,
};

// ===== WEAPON ATTACHMENT COMPATIBILITY =====
// Helper function to check if a weapon can equip a specific attachment slot
import { Weapon, AttachmentSlot } from '../types/game.types';

export function canEquipAttachmentSlot(weapon: Weapon, slot: AttachmentSlot): boolean {
  if (!weapon.availableSlots) {
    // Fallback for weapons without availableSlots defined
    // Default: allow Scope, Muzzle, Tactical for non-melee weapons
    if (weapon.category === 'Melee') return false;
    return ['Scope', 'Muzzle', 'Tactical'].includes(slot);
  }

  return weapon.availableSlots.includes(slot);
}

// Get all available attachment slots for a weapon
export function getAvailableAttachmentSlots(weapon: Weapon): AttachmentSlot[] {
  if (!weapon.availableSlots) {
    // Fallback
    if (weapon.category === 'Melee') return [];
    return ['Scope', 'Muzzle', 'Tactical'];
  }

  return weapon.availableSlots;
}

// Weapon category default slots (for reference)
export const WEAPON_CATEGORY_SLOTS: Record<string, AttachmentSlot[]> = {
  'Rifle': ['Scope', 'Muzzle', 'Tactical', 'Grip', 'Stock', 'Magazine'],
  'SMG': ['Scope', 'Muzzle', 'Tactical', 'Stock', 'Magazine'],
  'Sniper': ['Scope', 'Muzzle', 'Tactical', 'Magazine'],
  'Shotgun': ['Muzzle', 'Tactical', 'Magazine'],
  'Pistol': ['Muzzle', 'Tactical'],
  'Melee': [],
};
