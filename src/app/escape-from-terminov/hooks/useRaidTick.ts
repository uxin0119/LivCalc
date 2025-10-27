import { useEffect, useRef } from 'react';
import { RaidStatus, BodyParts, GameItem, Loadout, Enemy, CombatAction, Consumable, ConsumableType, BodyPartStatus } from '../types/game.types';
import { PlayerState } from '../types/game.types';
import { formatTime } from '../logic/player';
import { processLootPickup, shouldAutoEvacuate } from '../logic/raid';
import { chooseCombatAction, calculateAccuracyModifier, calculateFleeChance, hasSuppressor, COMBAT_CONSTANTS } from '../logic/combat';

interface UseRaidTickParams {
  raidStatus: RaidStatus;
  missionDuration: number;
  elapsedTime: number;
  raidBodyParts: BodyParts;
  raidBackpack: GameItem[];
  raidLoadout: Loadout;
  raidInventory: GameItem[];
  combatState: { status: 'none' | 'heard' | 'engaged'; enemy: Enemy | null };
  evacTime: number;
  painkillerTime: number;
  preCombatStatus: RaidStatus;
  playerState: PlayerState;
  overallHpPercent: number;
  currentWeight: number;
  carryCapacity: number;
  progressLog: string | null;

  handlePlayerDeath: () => void;
  handleMissionSuccess: () => void;
  triggerEvacuation: (isAuto: boolean, reason?: string) => void;

  setElapsedTime: React.Dispatch<React.SetStateAction<number>>;
  setPainkillerTime: React.Dispatch<React.SetStateAction<number>>;
  setEvacTime: React.Dispatch<React.SetStateAction<number>>;
  setLog: React.Dispatch<React.SetStateAction<string[]>>;
  setRaidBodyParts: React.Dispatch<React.SetStateAction<BodyParts>>;
  setRaidBackpack: React.Dispatch<React.SetStateAction<GameItem[]>>;
  setRaidLoadout: React.Dispatch<React.SetStateAction<Loadout>>;
  setRaidInventory: React.Dispatch<React.SetStateAction<GameItem[]>>;
  setCombatState: React.Dispatch<React.SetStateAction<{ status: 'none' | 'heard' | 'engaged'; enemy: Enemy | null }>>;
  setPlayerAction: React.Dispatch<React.SetStateAction<CombatAction>>;
  setRaidStatus: React.Dispatch<React.SetStateAction<RaidStatus>>;
  setPreCombatStatus: React.Dispatch<React.SetStateAction<RaidStatus>>;
  setProgressLog: React.Dispatch<React.SetStateAction<string | null>>;

  generateHumanEnemy: () => Enemy;
  lootTable: GameItem[];
  areaNames: string[];
  containerNames: string[];
}

export const useRaidTick = (params: UseRaidTickParams) => {
  const {
    raidStatus,
    missionDuration,
    elapsedTime,
    raidBodyParts,
    raidBackpack,
    raidLoadout,
    raidInventory,
    combatState,
    evacTime,
    painkillerTime,
    preCombatStatus,
    playerState,
    overallHpPercent,
    currentWeight,
    carryCapacity,
    progressLog,
    handlePlayerDeath,
    handleMissionSuccess,
    triggerEvacuation,
    setElapsedTime,
    setPainkillerTime,
    setEvacTime,
    setLog,
    setRaidBodyParts,
    setRaidBackpack,
    setRaidLoadout,
    setRaidInventory,
    setCombatState,
    setPlayerAction,
    setRaidStatus,
    setPreCombatStatus,
    setProgressLog,
    generateHumanEnemy,
    lootTable,
    areaNames,
    containerNames
  } = params;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (raidStatus === 'idle' || raidStatus === 'finished') return;

    const gameTick = () => {
        if (raidBodyParts.Head.hp <= 0 || raidBodyParts.Torso.hp <= 0) {
            handlePlayerDeath();
            return;
        }

        setElapsedTime(prev => prev + 1);
        if (painkillerTime > 0) setPainkillerTime(prev => prev - 1);

        if (raidStatus === 'evacuating') {
            setEvacTime(prev => prev - 1);
            if (evacTime <= 1) {
                setLog(prev => [...prev, `[${formatTime(elapsedTime)}] Extraction successful!`]);
                handleMissionSuccess();
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }
        }

        const logEntries: string[] = [];
        const newParts = JSON.parse(JSON.stringify(raidBodyParts));
        const newBackpack = [...raidBackpack];
        const newLoadout = JSON.parse(JSON.stringify(raidLoadout));
        const newRaidInventory = [...raidInventory];
        let somethingHappened = false;

        const consumeRaidItem = (consumableType: ConsumableType, onUse: (item: Consumable) => void) => {
            const allConsumables = [...newBackpack, ...newRaidInventory];
            const itemIndex = allConsumables.findIndex(i => i.type === 'Consumable' && i.consumableType === consumableType);
            if (itemIndex > -1) {
                const item = allConsumables[itemIndex] as Consumable;
                item.charges -= 1;
                onUse(item);
                if (item.charges <= 0) {
                    const originalLocation = newBackpack.find(i => i.id === item.id) ? newBackpack : newRaidInventory;
                    const originalIndex = originalLocation.findIndex(i => i.id === item.id);
                    originalLocation.splice(originalIndex, 1);
                }
                somethingHappened = true;
                return true;
            }
            return false;
        };

        const handleLootProcessing = (lootItem: GameItem) => {
            const finalCarryCapacity = playerState.stats.carryCapacity + (newLoadout.Backpack?.carryCapacityBonus || 0);
            const loadoutItems = Object.values(newLoadout).filter(Boolean) as GameItem[];

            const result = processLootPickup(
                lootItem,
                newRaidInventory,
                newBackpack,
                loadoutItems,
                finalCarryCapacity,
                formatTime,
                elapsedTime
            );

            newRaidInventory.length = 0;
            newRaidInventory.push(...result.inventory);
            newBackpack.length = 0;
            newBackpack.push(...result.backpack);
            logEntries.push(...result.logMessages);
        };

        if (raidStatus === 'in-progress') {
            const currentMedkitCharges = newBackpack.filter(item => item.type === 'Consumable' && item.consumableType === 'Medkit').reduce((acc, item) => acc + (item as Consumable).charges, 0);
            const evacCheck = shouldAutoEvacuate(overallHpPercent, currentMedkitCharges, currentWeight, carryCapacity);
            if (evacCheck.shouldEvac) {
                triggerEvacuation(true, evacCheck.reason);
                return;
            }
        }

        if (combatState.enemy) {
            const currentEnemy = { ...combatState.enemy };
            logEntries.push(`[${formatTime(elapsedTime)}] --- Combat Turn ---`);

            // Player AI decision
            const playerWeapon = (newLoadout as any)['Primary'] || (newLoadout as any)['Secondary'];
            const playerHp = (Object.values(newParts) as BodyPartStatus[]).reduce((sum, part) => sum + part.hp, 0);
            const playerMaxHp = (Object.values(newParts) as BodyPartStatus[]).reduce((sum, part) => sum + part.maxHp, 0);
            const autoPlayerAction = chooseCombatAction(playerHp, playerMaxHp, playerWeapon, currentEnemy.hp, currentEnemy.maxHp);

            // Enemy AI decision (only if detected)
            const enemyWeapon = (currentEnemy.loadout as any)['Primary'] || (currentEnemy.loadout as any)['Secondary'];
            if (currentEnemy.detected) {
                currentEnemy.currentAction = chooseCombatAction(currentEnemy.hp, currentEnemy.maxHp, enemyWeapon, playerHp, playerMaxHp);
            } else {
                // Undetected enemies don't attack
                currentEnemy.currentAction = 'exposed'; // Vulnerable, not aware of player
            }

            // Player turn (AI controlled)
            const weapon = newLoadout.Primary || newLoadout.Secondary;
            let playerDamage = 0;
            let playerFled = false;

            logEntries.push(`> Agent action: ${autoPlayerAction}`);

            if (autoPlayerAction === 'flee') {
                const areLegsImpaired = false; // TODO: Check player's leg status
                const fleeChance = calculateFleeChance(currentEnemy.distance, currentEnemy.visibility, areLegsImpaired);
                if (Math.random() * 100 < fleeChance) {
                    logEntries.push(`> Agent successfully fled! (${fleeChance.toFixed(1)}% chance)`);
                    setCombatState({ status: 'none', enemy: null });
                    setRaidStatus(preCombatStatus);
                    playerFled = true;
                } else {
                    logEntries.push(`> Failed to flee! (${fleeChance.toFixed(1)}% chance)`);
                }
            } else if (autoPlayerAction === 'reload') {
                if (weapon && weapon.caliber !== 'N/A') {
                    const ammoNeeded = weapon.maxAmmo! - (weapon.chamberedAmmo || 0);
                    let ammoReloaded = 0;
                    for (let i = newBackpack.length - 1; i >= 0; i--) {
                        const item = newBackpack[i];
                        if (item.type === 'Consumable' && item.consumableType === 'Ammo' && item.caliber === weapon.caliber) {
                            const ammoToTake = Math.min(ammoNeeded - ammoReloaded, item.charges);
                            weapon.chamberedAmmo = (weapon.chamberedAmmo || 0) + ammoToTake;
                            item.charges -= ammoToTake;
                            ammoReloaded += ammoToTake;
                            if (item.charges <= 0) {
                                newBackpack.splice(i, 1);
                            }
                            if (ammoReloaded >= ammoNeeded) break;
                        }
                    }
                    logEntries.push(`> Agent reloaded ${ammoReloaded} rounds. (${weapon.chamberedAmmo}/${weapon.maxAmmo})`);
                } else {
                    logEntries.push(`> No weapon to reload!`);
                }
            } else if (autoPlayerAction === 'take_cover') {
                logEntries.push(`> Agent takes cover, reducing incoming accuracy.`);
            } else if (autoPlayerAction === 'attack') {
                // Check if enemy is undetected for weak point attack
                if (!currentEnemy.detected) {
                    const weaponHasSuppressor = hasSuppressor(weapon);

                    if (weapon && weapon.chamberedAmmo && weapon.chamberedAmmo > 0) {
                        weapon.chamberedAmmo -= 1;
                        if(Math.random() > 0.1) weapon.durability -=1;

                        if (Math.random() * 100 < COMBAT_CONSTANTS.WEAK_POINT_CHANCE) {
                            playerDamage = Math.floor(weapon.damage * COMBAT_CONSTANTS.WEAK_POINT_DAMAGE_MULTIPLIER);
                            if (weaponHasSuppressor) {
                                logEntries.push(`> [WEAK_POINT.CRITICAL] Agent struck undetected ${currentEnemy.name} with suppressed ${weapon.name}, dealing ${playerDamage} damage! (Stealth maintained)`);
                            } else {
                                logEntries.push(`> [WEAK_POINT.CRITICAL] Agent struck undetected ${currentEnemy.name} with ${weapon.name}, dealing ${playerDamage} damage! (${COMBAT_CONSTANTS.WEAK_POINT_CHANCE}% chance)`);
                            }
                        } else {
                            logEntries.push(`> Agent missed weak point attack! (${COMBAT_CONSTANTS.WEAK_POINT_CHANCE}% chance)`);
                        }
                    } else {
                        playerDamage = newLoadout.Melee ? Math.floor(newLoadout.Melee.damage * COMBAT_CONSTANTS.WEAK_POINT_DAMAGE_MULTIPLIER) : 2;
                        logEntries.push(`> [WEAK_POINT.CRITICAL] Agent struck undetected ${currentEnemy.name} with ${newLoadout.Melee ? newLoadout.Melee.name : 'fists'}!`);
                    }

                    // Enemy detection after being attacked
                    if (weaponHasSuppressor) {
                        if (Math.random() * 100 > COMBAT_CONSTANTS.SUPPRESSOR_STEALTH_CHANCE) {
                            currentEnemy.detected = true;
                            logEntries.push(`> Enemy detected the suppressed shot! (${100 - COMBAT_CONSTANTS.SUPPRESSOR_STEALTH_CHANCE}% chance)`);
                        } else {
                            logEntries.push(`> [STEALTH] Enemy remains unaware. (${COMBAT_CONSTANTS.SUPPRESSOR_STEALTH_CHANCE}% stealth chance)`);
                        }
                    } else {
                        currentEnemy.detected = true;
                    }
                } else {
                    // Normal combat when enemy is detected - BURST FIRE MECHANISM
                    const playerAccuracyMod = calculateAccuracyModifier(currentEnemy.distance, currentEnemy.visibility, autoPlayerAction);

                    // Calculate attachment bonuses
                    let attachmentAccuracyBonus = 0;
                    let attachmentRecoilReduction = 0;
                    let playerVisibilityModifier = 0;
                    let enemyVisibilityBonus = 0;

                    if (weapon && weapon.attachments) {
                        const scope = weapon.attachments.Scope;
                        const muzzle = weapon.attachments.Muzzle;
                        const tactical = weapon.attachments.Tactical;

                        // Scope effects - distance-based accuracy
                        if (scope) {
                            const distance = currentEnemy.distance;
                            const mag = scope.magnification || 1;
                            const optimalMin = scope.optimalRangeMin || 0;
                            const optimalMax = scope.optimalRangeMax || 100;

                            // Check if in optimal range
                            if (distance >= optimalMin && distance <= optimalMax) {
                                // In optimal range - full bonus
                                attachmentAccuracyBonus += scope.accuracyBonus || 0;
                            } else if (distance < optimalMin) {
                                // Too close for high magnification
                                const penalty = mag > 2 ? (optimalMin - distance) * (mag - 1) * 0.5 : 0;
                                attachmentAccuracyBonus += Math.max(2, (scope.accuracyBonus || 0) - penalty);
                            } else {
                                // Too far - gradual falloff
                                const falloff = (distance - optimalMax) * 0.2;
                                attachmentAccuracyBonus += Math.max(3, (scope.accuracyBonus || 0) - falloff);
                            }
                        }

                        // Muzzle effects
                        if (muzzle) {
                            attachmentRecoilReduction += muzzle.recoilReduction || 0;
                            playerVisibilityModifier += muzzle.visibilityModifier || 0;
                        }

                        // Tactical effects
                        if (tactical) {
                            attachmentAccuracyBonus += tactical.accuracyBonus || 0;
                            playerVisibilityModifier += tactical.visibilityModifier || 0;
                            enemyVisibilityBonus += tactical.enemyVisibilityBonus || 0;
                        }
                    }

                    const baseAccuracy = playerState.stats.accuracy * playerAccuracyMod + attachmentAccuracyBonus;

                    if (weapon && weapon.chamberedAmmo && weapon.chamberedAmmo > 0) {
                        // Calculate how many rounds to fire (burst count)
                        const roundsToFire = Math.min(weapon.burstCount || 1, weapon.chamberedAmmo);
                        let totalDamage = 0;
                        let hitsLanded = 0;
                        let cumulativeRecoil = 0;

                        // Update enemy visibility based on attachments
                        const modifiedEnemyVisibility = Math.min(100, Math.max(0, currentEnemy.visibility + enemyVisibilityBonus));

                        // Fire each round in the burst
                        for (let i = 0; i < roundsToFire; i++) {
                            weapon.chamberedAmmo -= 1;
                            if(Math.random() > 0.1) weapon.durability -= 1;

                            // Calculate accuracy for this shot (decreases with recoil)
                            // Apply recoil reduction from attachments
                            const effectiveRecoil = Math.max(0, (weapon.recoil || 0) - (weapon.recoil || 0) * (attachmentRecoilReduction / 100));
                            const recoilPenalty = effectiveRecoil * cumulativeRecoil * 0.01; // 1% penalty per recoil point per shot
                            const shotAccuracy = Math.max(10, baseAccuracy - recoilPenalty);

                            const playerHitRoll = Math.random() * 100;
                            if (playerHitRoll < shotAccuracy) {
                                hitsLanded++;
                                let shotDamage = weapon.damage;
                                // Enemy taking cover reduces damage
                                if (currentEnemy.currentAction === 'take_cover') {
                                    shotDamage = Math.floor(shotDamage * 0.6); // 40% damage reduction when in cover
                                }
                                totalDamage += shotDamage;
                            }

                            // Accumulate recoil for next shot
                            cumulativeRecoil += 1;
                        }

                        playerDamage = totalDamage;

                        // Log the burst results
                        if (roundsToFire > 1) {
                            const coverMsg = currentEnemy.currentAction === 'take_cover' ? ' (in cover)' : '';
                            logEntries.push(`> Agent fired ${roundsToFire} rounds at ${currentEnemy.name}${coverMsg} with ${weapon.name}.`);
                            logEntries.push(`> ${hitsLanded}/${roundsToFire} rounds hit, dealing ${totalDamage} total damage. (Base accuracy: ${baseAccuracy.toFixed(1)}%, Recoil: ${weapon.recoil})`);
                            logEntries.push(`> [AMMO] ${weapon.chamberedAmmo}/${weapon.maxAmmo} rounds remaining in ${weapon.name}`);
                        } else {
                            if (hitsLanded > 0) {
                                const coverMsg = currentEnemy.currentAction === 'take_cover' ? ' (in cover)' : '';
                                logEntries.push(`> Agent fired at ${currentEnemy.name}${coverMsg} with ${weapon.name}, dealing ${totalDamage} damage. (Hit: ${baseAccuracy.toFixed(1)}%)`);
                            } else {
                                logEntries.push(`> Agent missed! (Hit chance: ${baseAccuracy.toFixed(1)}%)`);
                            }
                            logEntries.push(`> [AMMO] ${weapon.chamberedAmmo}/${weapon.maxAmmo} rounds remaining`);
                        }
                    } else {
                        playerDamage = newLoadout.Melee ? newLoadout.Melee.damage : 1;
                        logEntries.push(`> Agent is out of ammo! Attacked with ${newLoadout.Melee ? newLoadout.Melee.name : 'fists'}.`);
                    }
                }
            }

            if (!playerFled) {
                currentEnemy.hp -= playerDamage;
                if (playerDamage > 0) {
                    logEntries.push(`> ${currentEnemy.name} HP is now ${currentEnemy.hp}/${currentEnemy.maxHp}.`);
                }
            }

            if (currentEnemy.hp <= 0 && !playerFled) {
                logEntries.push(`> VICTORY. ${currentEnemy.name} eliminated.`);

                // Loot equipment
                Object.values(currentEnemy.loadout).filter(Boolean).forEach(lootItem => handleLootProcessing({ ...(lootItem as GameItem), id: `loot_${Date.now()}_${Math.random()}` }));

                // Loot ammo from weapons
                const enemyPrimaryWeapon = (currentEnemy.loadout as any)['Primary'];
                const enemySecondaryWeapon = (currentEnemy.loadout as any)['Secondary'];

                if (enemyPrimaryWeapon && enemyPrimaryWeapon.caliber !== 'N/A' && enemyPrimaryWeapon.chamberedAmmo && enemyPrimaryWeapon.chamberedAmmo > 0) {
                    const ammoLoot: Consumable = {
                        id: `ammo_loot_${Date.now()}_${Math.random()}`,
                        name: `${enemyPrimaryWeapon.caliber} rounds`,
                        type: 'Consumable',
                        consumableType: 'Ammo',
                        caliber: enemyPrimaryWeapon.caliber,
                        charges: enemyPrimaryWeapon.chamberedAmmo,
                        maxCharges: enemyPrimaryWeapon.chamberedAmmo,
                        effect: '',
                        rarity: 'Common',
                        value: 2,
                        weight: 0.1
                    };
                    handleLootProcessing(ammoLoot);
                    logEntries.push(`> Looted ${enemyPrimaryWeapon.chamberedAmmo} rounds of ${enemyPrimaryWeapon.caliber} ammo.`);
                }

                if (enemySecondaryWeapon && enemySecondaryWeapon.caliber !== 'N/A' && enemySecondaryWeapon.chamberedAmmo && enemySecondaryWeapon.chamberedAmmo > 0) {
                    const ammoLoot: Consumable = {
                        id: `ammo_loot_${Date.now()}_${Math.random()}`,
                        name: `${enemySecondaryWeapon.caliber} rounds`,
                        type: 'Consumable',
                        consumableType: 'Ammo',
                        caliber: enemySecondaryWeapon.caliber,
                        charges: enemySecondaryWeapon.chamberedAmmo,
                        maxCharges: enemySecondaryWeapon.chamberedAmmo,
                        effect: '',
                        rarity: 'Common',
                        value: 2,
                        weight: 0.1
                    };
                    handleLootProcessing(ammoLoot);
                    logEntries.push(`> Looted ${enemySecondaryWeapon.chamberedAmmo} rounds of ${enemySecondaryWeapon.caliber} ammo.`);
                }

                setCombatState({ status: 'none', enemy: null });
                setRaidStatus(preCombatStatus);
                setPlayerAction('attack'); // Reset action
            } else if (!playerFled) {
                // Skip enemy turn if they're undetected
                if (!currentEnemy.detected) {
                    logEntries.push(`> ${currentEnemy.name} is unaware of your presence... [UNDETECTED]`);
                    setCombatState({ status: 'engaged', enemy: currentEnemy });
                } else {
                    logEntries.push(`> ${currentEnemy.name} action: ${currentEnemy.currentAction}`);

                    // Enemy turn
                    if (currentEnemy.currentAction === 'flee') {
                    // Base flee chance + distance bonus - visibility penalty
                    // Higher visibility makes it harder to flee
                    const baseChance = 30;
                    const distanceBonus = currentEnemy.distance * 0.3;
                    const visibilityPenalty = currentEnemy.visibility * 0.3;
                    const enemyFleeChance = Math.max(5, baseChance + distanceBonus - visibilityPenalty);

                    if (Math.random() * 100 < enemyFleeChance) {
                        logEntries.push(`> ${currentEnemy.name} fled! (${enemyFleeChance.toFixed(1)}% chance)`);
                        setCombatState({ status: 'none', enemy: null });
                        setRaidStatus(preCombatStatus);
                        setPlayerAction('attack'); // Reset action
                    } else {
                        logEntries.push(`> ${currentEnemy.name} failed to flee!`);
                        setCombatState({ status: 'engaged', enemy: currentEnemy });
                    }
                } else if (currentEnemy.currentAction === 'reload') {
                    const enemyWeapon = (currentEnemy.loadout as any)['Primary'] || (currentEnemy.loadout as any)['Secondary'];
                    if (enemyWeapon && enemyWeapon.caliber !== 'N/A') {
                        const reloadAmount = Math.min(enemyWeapon.maxAmmo!, 30); // Assume enemy has ammo
                        enemyWeapon.chamberedAmmo = reloadAmount;
                        logEntries.push(`> ${currentEnemy.name} reloaded! (${reloadAmount} rounds)`);
                    }
                    setCombatState({ status: 'engaged', enemy: currentEnemy });
                } else if (currentEnemy.currentAction === 'take_cover') {
                    logEntries.push(`> ${currentEnemy.name} takes cover!`);
                    setCombatState({ status: 'engaged', enemy: currentEnemy });
                } else if (currentEnemy.currentAction === 'attack') {
                    const enemyWeapon = (currentEnemy.loadout as any)['Primary'] || (currentEnemy.loadout as any)['Secondary'];

                    if (enemyWeapon && enemyWeapon.chamberedAmmo && enemyWeapon.chamberedAmmo > 0) {
                        // BURST FIRE MECHANISM for enemy
                        const roundsToFire = Math.min(enemyWeapon.burstCount || 1, enemyWeapon.chamberedAmmo);
                        let totalHits = 0;
                        let totalDamageTaken = 0;
                        let cumulativeRecoil = 0;

                        const enemyAccuracyMod = calculateAccuracyModifier(currentEnemy.distance, currentEnemy.visibility, currentEnemy.currentAction);
                        let baseEnemyAccuracy = currentEnemy.accuracy * enemyAccuracyMod;

                        // Player in cover reduces enemy accuracy
                        if (autoPlayerAction === 'take_cover') {
                            baseEnemyAccuracy *= 0.5; // 50% less accurate against cover
                        }

                        // Fire each round in the burst
                        for (let i = 0; i < roundsToFire; i++) {
                            enemyWeapon.chamberedAmmo -= 1;

                            // Calculate accuracy for this shot (decreases with recoil)
                            const recoilPenalty = (enemyWeapon.recoil || 0) * cumulativeRecoil * 0.01;
                            const shotAccuracy = Math.max(10, baseEnemyAccuracy - recoilPenalty);

                            const enemyHitChance = shotAccuracy / 100;
                            const hit = Math.random() < enemyHitChance;

                            if (hit) {
                                totalHits++;
                                const bodyPartKeys = Object.keys(newParts) as (keyof typeof newParts)[];
                                const hitPart = bodyPartKeys[Math.floor(Math.random() * bodyPartKeys.length)];
                                let damageTaken = currentEnemy.damage;

                                // Player in cover reduces damage
                                if (autoPlayerAction === 'take_cover') {
                                    damageTaken = Math.floor(damageTaken * 0.7); // 30% damage reduction
                                }

                                const armor = hitPart === 'Head' ? newLoadout.Helmet : newLoadout["Body Armor"];
                                if(armor && armor.durability > 0){
                                    const damageReduction = armor.defense;
                                    damageTaken = Math.max(0, damageTaken - damageReduction);
                                    armor.durability -= 1;
                                    if (i === 0) logEntries.push(`> ${armor.name} absorbed damage.`);
                                }
                                newParts[hitPart].hp = Math.max(0, newParts[hitPart].hp - damageTaken);
                                totalDamageTaken += damageTaken;

                                if (newParts.Head.hp <= 0 || newParts.Torso.hp <= 0) {
                                    handlePlayerDeath();
                                    return;
                                }
                            }

                            // Accumulate recoil for next shot
                            cumulativeRecoil += 1;
                        }

                        // Log the enemy burst results
                        if (roundsToFire > 1) {
                            logEntries.push(`> ${currentEnemy.name} fired ${roundsToFire} rounds with ${enemyWeapon.name}.`);
                            if (totalHits > 0) {
                                logEntries.push(`> ${totalHits}/${roundsToFire} rounds hit Agent, dealing ${totalDamageTaken} total damage.`);
                            } else {
                                logEntries.push(`> All rounds missed! [EVADE.SUCCESS]`);
                            }
                            logEntries.push(`> [ENEMY AMMO] ${enemyWeapon.chamberedAmmo}/${enemyWeapon.maxAmmo} rounds remaining in ${enemyWeapon.name}`);
                        } else {
                            if (totalHits > 0) {
                                logEntries.push(`> ${currentEnemy.name} fired ${enemyWeapon.name} at Agent, dealing ${totalDamageTaken} damage. (Hit: ${baseEnemyAccuracy.toFixed(1)}%)`);
                            } else {
                                logEntries.push(`> ${currentEnemy.name} fired ${enemyWeapon.name} but missed! [EVADE.SUCCESS] (Hit: ${baseEnemyAccuracy.toFixed(1)}%)`);
                            }
                            logEntries.push(`> [ENEMY AMMO] ${enemyWeapon.chamberedAmmo}/${enemyWeapon.maxAmmo} rounds remaining`);
                        }
                    } else {
                        logEntries.push(`> ${currentEnemy.name} is out of ammo!`);
                    }
                    setCombatState({ status: 'engaged', enemy: currentEnemy });
                }
                }
            }
            somethingHappened = true;
        } else {
            const eventChance = raidStatus === 'evacuating' ? 0.05 : 0.2;
            if (Math.random() < eventChance) {
                somethingHappened = true;
                const eventRoll = Math.random();
                if (eventRoll < 0.4) {
                    const enemy = generateHumanEnemy();
                    setPreCombatStatus(raidStatus);
                    setCombatState({ status: 'engaged', enemy: enemy });
                    setRaidStatus('in-combat');
                    setProgressLog(null);
                    logEntries.push(`[${formatTime(elapsedTime)}] Encountered a ${enemy.name}!`);
                } else if (eventRoll < 0.7) {
                    const container = containerNames[Math.floor(Math.random() * containerNames.length)];
                    const loot = { ...lootTable[Math.floor(Math.random() * lootTable.length)], id: `loot_${Date.now()}` };
                    setProgressLog(`INVESTIGATING.${container}`);
                    handleLootProcessing(loot);
                } else {
                    const area = areaNames[Math.floor(Math.random() * areaNames.length)];
                    setProgressLog('MOVING.FORWARD');
                    logEntries.push(`[${formatTime(elapsedTime)}] Entered ${area}.`);
                }
            } else if (!progressLog) {
                // Set default exploration progress when nothing is happening
                setProgressLog('SEARCHING.AREA');
            }
        }

        let totalBleeds = 0;
        for (const part of Object.values(newParts) as BodyPartStatus[]) {
            if (part.injuries.includes('Bleeding')) totalBleeds++;
        }
        if (totalBleeds > 0) {
            newParts.Torso.hp = Math.max(0, newParts.Torso.hp - totalBleeds);
            somethingHappened = true;
        }

        let isHealing = false;
        for (const partName in newParts) {
            const part = newParts[partName as keyof typeof newParts];
            if (part.injuries.includes('Bleeding')) {
                if(consumeRaidItem('Bandage', () => part.injuries = part.injuries.filter((i: string) => i !== 'Bleeding'))) {
                    setProgressLog('TREATING.BLEEDING');
                    logEntries.push(`[${formatTime(elapsedTime)}] Used Bandage on ${partName}.`);
                    isHealing = true;
                    break;
                }
            }
            if (part.injuries.includes('Fracture')) {
                if(consumeRaidItem('Splint', () => part.injuries = part.injuries.filter((i: string) => i !== 'Fracture'))) {
                    setProgressLog('TREATING.FRACTURE');
                    logEntries.push(`[${formatTime(elapsedTime)}] Used Splint on ${partName}.`);
                    isHealing = true;
                    break;
                }
            }
        }
        const injuredPart = (Object.values(newParts) as BodyPartStatus[]).find(p => p.hp < p.maxHp && p.hp > 0);
        if (injuredPart && !isHealing) {
            if(consumeRaidItem('Medkit', (item) => {
                const healAmount = 25;
                const needed = injuredPart.maxHp - injuredPart.hp;
                const actualHeal = Math.min(needed, healAmount, item.charges);
                injuredPart.hp += actualHeal;
                logEntries.push(`[${formatTime(elapsedTime)}] Used ${actualHeal} charges from Medkit.`);
            })) {
                setProgressLog('TREATING.WOUNDS');
                isHealing = true;
            }
        }

        if (!isHealing && !combatState.enemy) {
            setProgressLog(null);
        }

        if (somethingHappened) {
            setRaidBodyParts(newParts);
            setRaidBackpack(newBackpack);
            setRaidLoadout(newLoadout);
            setRaidInventory(newRaidInventory);
            if (logEntries.length > 0) setLog(prev => [...prev, ...logEntries]);
        }

        if (raidStatus === 'in-progress' && elapsedTime >= missionDuration) {
            triggerEvacuation(false, "Mission time is up! ");
        }
    };

    intervalRef.current = setInterval(gameTick, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [raidStatus, missionDuration, elapsedTime, raidBodyParts, raidBackpack, raidLoadout, raidInventory, combatState]);

  return intervalRef;
};
