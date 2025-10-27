import { Weapon, CombatAction, FireMode } from '../types/game.types';

/**
 * Calculate accuracy modifiers based on distance, visibility, and action
 */
export const calculateAccuracyModifier = (
    distance: number,
    visibility: number,
    action: CombatAction
): number => {
    let modifier = 1.0;

    // Distance penalty: beyond 15m, accuracy drops
    if (distance > 15) {
        modifier -= (distance - 15) * 0.015; // -1.5% per meter beyond 15m
    }

    // Visibility penalty
    const visibilityModifier = visibility / 100;
    modifier *= visibilityModifier;

    // Action modifiers
    if (action === 'take_cover') modifier *= 0.5; // 50% less accurate when covering
    if (action === 'flee') modifier *= 0.2; // 20% accurate when fleeing
    if (action === 'reload') modifier = 0; // Cannot attack while reloading
    if (action === 'exposed') modifier *= 0.3; // 30% accurate when exposed

    return Math.max(0, modifier); // Minimum 0% accuracy
};

/**
 * AI Decision making for combat actions
 * Determines what action a combatant should take based on their current state
 */
export const chooseCombatAction = (
    hp: number,
    maxHp: number,
    weapon: Weapon | null,
    enemyHp: number,
    enemyMaxHp: number
): CombatAction => {
    const hpPercent = (hp / maxHp) * 100;
    const enemyHpPercent = (enemyHp / enemyMaxHp) * 100;

    // Force flee if no weapon or no ammo at all
    if (!weapon || (weapon.caliber !== 'N/A' && (!weapon.chamberedAmmo || weapon.chamberedAmmo === 0))) {
        return 'flee';
    }

    if (weapon && weapon.chamberedAmmo && weapon.chamberedAmmo <= 3) {
        return Math.random() < 0.6 ? 'reload' : 'attack'; // 60% chance to reload when low ammo
    }
    if (hpPercent < 30) {
        return Math.random() < 0.7 ? 'flee' : 'take_cover'; // Try to flee or take cover when low HP
    }
    if (hpPercent < 50) {
        return Math.random() < 0.5 ? 'take_cover' : 'attack'; // More defensive when damaged
    }
    if (enemyHpPercent < 30 && hpPercent > 50) {
        return 'attack'; // Aggressive when enemy is weak and we're healthy
    }
    return Math.random() < 0.8 ? 'attack' : 'take_cover'; // Mostly attack when healthy
};

/**
 * Calculate flee success chance based on distance and visibility
 */
export const calculateFleeChance = (distance: number, visibility: number, areLegsImpaired: boolean): number => {
    const baseChance = 40;
    const distanceBonus = distance * 0.5;
    const visibilityPenalty = visibility * 0.4; // High visibility = harder to flee
    let finalChance = Math.max(5, baseChance + distanceBonus - visibilityPenalty);

    if (areLegsImpaired) {
        finalChance /= 2; // Halve the chance if legs are impaired
    }

    return finalChance;
};

/**
 * Check if a weapon has a suppressor equipped
 */
export const hasSuppressor = (weapon: Weapon | null): boolean => {
    return !!(weapon && weapon.attachments?.Muzzle?.stealthOnFirstShot);
};

/**
 * Calculate burst count based on fire mode and fire rate
 */
export const calculateBurstCount = (fireMode: FireMode | undefined, fireRate: number | undefined): number => {
    if (!fireMode) return 1;

    switch (fireMode) {
        case 'BoltAction':
        case 'PumpAction':
        case 'SemiAuto':
        case 'Melee':
            return 1;
        case 'FullAuto':
            // Full auto burst size depends on fire rate
            if (!fireRate) return 3;
            if (fireRate >= 900) return 6; // Very high RPM (900+)
            if (fireRate >= 750) return 5; // High RPM (750-899)
            if (fireRate >= 600) return 4; // Medium RPM (600-749)
            return 3; // Low RPM (300-599)
        default:
            return 1;
    }
};

/**
 * Calculate modified fire rate based on fire mode
 */
export const getModifiedFireRate = (weapon: Weapon | null): number => {
    if (!weapon || typeof weapon.fireRate === 'undefined') {
        return 100; // Default RPM if no weapon or fire rate
    }

    switch (weapon.fireMode) {
        case 'BoltAction':
            return 40; // Slowest RPM
        case 'PumpAction':
            return 70; // Slow RPM
        case 'SemiAuto':
            // Semi-auto is limited by how fast you can click, but we can cap it
            return Math.min(weapon.fireRate, 450);
        case 'FullAuto':
            return weapon.fireRate; // Use the weapon's native fire rate
        case 'Melee':
            return 80; // Fixed RPM for melee attacks
        default:
            return weapon.fireRate;
    }
};

/**
 * Calculate weapon accuracy modifier based on optimal range
 */
export const calculateWeaponRangeModifier = (
    weapon: Weapon | null,
    currentDistance: number
): number => {
    if (!weapon) {
        return 1.0; // No penalty if no weapon
    }

    const scope = weapon.attachments?.Scope;

    // Use scope's optimal range if available, otherwise use weapon's
    const optimalMin = scope?.optimalRangeMin ?? weapon.optimalRangeMin;
    const optimalMax = scope?.optimalRangeMax ?? weapon.optimalRangeMax;

    if (typeof optimalMin === 'undefined' || typeof optimalMax === 'undefined') {
        return 1.0; // No penalty if no range is specified on weapon or scope
    }

    // In optimal range - full accuracy
    if (currentDistance >= optimalMin && currentDistance <= optimalMax) {
        return 1.0;
    }

    // Too close - penalty based on how far below minimum
    if (currentDistance < optimalMin) {
        const distanceBelow = optimalMin - currentDistance;
        const penalty = distanceBelow * 0.02; // 2% penalty per meter below optimal
        return Math.max(0.5, 1.0 - penalty); // Minimum 50% accuracy
    }

    // Too far - penalty based on how far above maximum
    if (currentDistance > optimalMax) {
        const distanceAbove = currentDistance - optimalMax;
        const penalty = distanceAbove * 0.03; // 3% penalty per meter above optimal
        return Math.max(0.3, 1.0 - penalty); // Minimum 30% accuracy
    }

    return 1.0;
};

/**
 * Constants for combat mechanics
 */
export const COMBAT_CONSTANTS = {
    WEAK_POINT_CHANCE: 85,
    WEAK_POINT_DAMAGE_MULTIPLIER: 1.5,
    SUPPRESSOR_STEALTH_CHANCE: 65,
    COVER_DAMAGE_REDUCTION: 0.4, // 40% damage reduction
    ARMOR_DAMAGE_REDUCTION: 0.5, // 50% damage reduction
} as const;
