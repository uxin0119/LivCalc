import { useState, useEffect, useRef } from 'react';
import { PlayerState, RaidStatus, CombatAction, Enemy, GameItem, BodyParts, Consumable, InjuryType, BodyPart, Weapon, BodyPartStatus, EncounterType } from '../types/game.types';
import { EVAC_SUCCESS_LOGO, EVAC_START_LOGO, MISSION_START_LOGO, lootTable, areaNames, containerNames } from '../constants';
import { generateHumanEnemy, formatTime } from '../utils/helpers';
import { getModifiedFireRate, calculateBurstCount } from '../logic/combat';

export const useGameLoop = (playerState: PlayerState, setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>) => {
  const [raidStatus, setRaidStatus] = useState<RaidStatus>('idle');
  const [preCombatStatus, setPreCombatStatus] = useState<RaidStatus>('idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [missionDuration, setMissionDuration] = useState(0);
  const [evacTime, setEvacTime] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [raidInventory, setRaidInventory] = useState<GameItem[]>([]);
  const [raidBackpack, setRaidBackpack] = useState<GameItem[]>([]);
  const [raidLoadout, setRaidLoadout] = useState<any>(playerState.loadout);
  const [combatState, setCombatState] = useState<{ status: 'none' | 'heard' | 'engaged'; enemy: Enemy | null }>({ status: 'none', enemy: null });
  const [playerAction, setPlayerAction] = useState<CombatAction>('attack');
  const [painkillerTime, setPainkillerTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [raidBodyParts, setRaidBodyParts] = useState<BodyParts>(playerState.bodyParts);
  const [progressLog, setProgressLog] = useState<string | null>(null);
  const [isPlayerExposed, setIsPlayerExposed] = useState(false);
  const [raidProgress, setRaidProgress] = useState(0);
  const [postCombatTimer, setPostCombatTimer] = useState(0);

  const overallHpPercent = (() => {
    const totalHp = Object.values(raidBodyParts).reduce((sum, part) => sum + part.hp, 0);
    const maxTotalHp = Object.values(raidBodyParts).reduce((sum, part) => sum + part.maxHp, 0);
    return maxTotalHp > 0 ? Math.round((totalHp / maxTotalHp) * 100) : 0;
  })();

  const handleStartMission = () => {
    const duration = Math.floor(Math.random() * 11) + 10;
    setMissionDuration(duration * 60);
    setRaidStatus('in-progress');
    setElapsedTime(0);
    setEvacTime(0);
    setPainkillerTime(0);
    setRaidBodyParts(JSON.parse(JSON.stringify(playerState.bodyParts)));
    setRaidInventory([]);
    setRaidProgress(0);
    setIsPlayerExposed(false);

    const tempBackpack = JSON.parse(JSON.stringify(playerState.backpack));
    const tempLoadout = JSON.parse(JSON.stringify(playerState.loadout));

    for (const slot of ['Primary', 'Secondary'] as const) {
        const weapon = tempLoadout[slot];
        if (weapon && weapon.caliber !== 'N/A') {
            let ammoNeeded = weapon.maxAmmo! - (weapon.chamberedAmmo || 0);
            for (let i = tempBackpack.length - 1; i >= 0; i--) {
                const item = tempBackpack[i];
                if (item.type === 'Consumable' && item.consumableType === 'Ammo' && item.caliber === weapon.caliber) {
                    const ammoToTake = Math.min(ammoNeeded, item.charges);
                    weapon.chamberedAmmo = (weapon.chamberedAmmo || 0) + ammoToTake;
                    item.charges -= ammoToTake;
                    ammoNeeded -= ammoToTake;
                    if (item.charges <= 0) {
                        tempBackpack.splice(i, 1);
                    }
                    if (ammoNeeded <= 0) break;
                }
            }
        }
    }

    setRaidBackpack(tempBackpack);
    setRaidLoadout(tempLoadout);
    setLog([...MISSION_START_LOGO, `[00:00] Mission Started. Duration: ${duration} minutes.`]);
  };

  const triggerEvacuation = (isAuto: boolean, reason?: string) => {
    if (raidStatus === 'in-progress') {
        const legIsImpaired = Object.values(raidBodyParts).some((p: any) => 
            (p.name === 'LeftLeg' || p.name === 'RightLeg') && 
            (p.injuries.includes('Fracture') || p.injuries.includes('Crippled'))
        );

        const remainingProgress = 100 - raidProgress;
        let evacDuration = remainingProgress * 2; // 2 seconds per progress point

        if (legIsImpaired && painkillerTime <= 0) {
            evacDuration *= 1.5; // 50% longer if legs are impaired
        }
        evacDuration = Math.floor(evacDuration);

        setEvacTime(evacDuration);
        setRaidStatus('evacuating');
        const reasonMsg = reason ? `${reason} ` : '';
        setLog(prev => [...prev, ...EVAC_START_LOGO, `[${formatTime(elapsedTime)}] ${reasonMsg}Extraction started. ETA: ${formatTime(evacDuration)}`]);
    }
  };

  const handleMissionSuccess = () => {
    setRaidStatus('finished');
    setCombatState({ status: 'none', enemy: null });
    setPlayerState(prevState => ({
      ...prevState,
      stash: [...prevState.stash, ...raidInventory, ...raidBackpack],
      bodyParts: raidBodyParts,
      loadout: raidLoadout,
    }));
  };

  const handlePlayerDeath = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRaidStatus('finished');
    setCombatState({ status: 'none', enemy: null });
    setLog(prev => [...prev, `[${formatTime(elapsedTime)}] Agent KIA. All gear and loot lost.`]);
    setPlayerState(prevState => ({
        ...prevState,
        loadout: { Primary: null, Secondary: null, Melee: null, Helmet: null, "Body Armor": null, Backpack: null },
        backpack: [],
    }));
  };

  useEffect(() => {
    if (raidStatus === 'idle' || raidStatus === 'finished') return;

    const gameTick = () => {
        if (raidBodyParts.Head.hp <= 0 || raidBodyParts.Torso.hp <= 0) {
            handlePlayerDeath();
            return;
        }

        setElapsedTime(prev => prev + 1);
        if (painkillerTime > 0) setPainkillerTime(prev => prev - 1);
        if (postCombatTimer > 0) setPostCombatTimer(prev => prev - 1);

        if (raidStatus === 'evacuating') {
            setEvacTime(prev => prev - 1);
            if (evacTime <= 1) {
                setLog(prev => [...prev, ...EVAC_SUCCESS_LOGO, `[${formatTime(elapsedTime)}] Extraction successful!`]);
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

        const consumeRaidItem = (consumableType: any, onUse: (item: Consumable) => void) => {
            const allConsumables = [...newBackpack, ...newRaidInventory];
            const itemIndex = allConsumables.findIndex(i => i.type === 'Consumable' && (i as Consumable).consumableType === consumableType);
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

        const getValueDensity = (item: GameItem) => (item.value / item.weight) || 0;

        const handleLootProcessing = (lootItem: GameItem) => {
            const finalCarryCapacity = playerState.stats.carryCapacity + (newLoadout.Backpack?.carryCapacityBonus || 0);
            const currentRaidWeight = (Object.values(newLoadout).filter(Boolean) as GameItem[]).concat(newBackpack, newRaidInventory).reduce((sum, item) => sum + item.weight, 0);

            if (currentRaidWeight + lootItem.weight <= finalCarryCapacity) {
                newRaidInventory.push(lootItem);
                logEntries.push(`[${formatTime(elapsedTime)}] Looted [${lootItem.name}].`);
                return;
            }
            
            const droppableItems = [...newRaidInventory, ...newBackpack].filter(item => !(item.type === 'Consumable' && (item as Consumable).consumableType !== 'Generic'));

            if (droppableItems.length === 0) {
                logEntries.push(`[${formatTime(elapsedTime)}] Found [${lootItem.name}] but couldn't carry it (no droppable items).`);
                return;
            }

            const worstItem = droppableItems.reduce((worst, current) => getValueDensity(current) < getValueDensity(worst) ? current : worst);

            if (getValueDensity(lootItem) > getValueDensity(worstItem)) {
                const worstItemIndexInInv = newRaidInventory.findIndex(i => i.id === worstItem.id);
                if (worstItemIndexInInv > -1) {
                    newRaidInventory.splice(worstItemIndexInInv, 1);
                } else {
                    const worstItemIndexInBp = newBackpack.findIndex(i => i.id === worstItem.id);
                    if (worstItemIndexInBp > -1) {
                        newBackpack.splice(worstItemIndexInBp, 1);
                    }
                }
                newRaidInventory.push(lootItem);
                logEntries.push(`[${formatTime(elapsedTime)}] Dropped [${worstItem.name}] for [${lootItem.name}].`);
            } else {
                logEntries.push(`[${formatTime(elapsedTime)}] Found [${lootItem.name}] but left it (low value).`);
            }
        };

        if (raidStatus === 'in-progress') {
            const currentMedkitCharges = newBackpack.filter(item => item.type === 'Consumable' && (item as Consumable).consumableType === 'Medkit').reduce((acc, item) => acc + (item as Consumable).charges, 0);
            const isCriticalHp = overallHpPercent < 20;
            const isBleedingWithoutMeds = currentMedkitCharges === 0 && overallHpPercent < 30;
            const isOverEncumbered = (Object.values(newLoadout).filter(Boolean) as GameItem[]).concat(newBackpack, newRaidInventory).reduce((sum, item) => sum + item.weight, 0) >= (playerState.stats.carryCapacity + (newLoadout.Backpack?.carryCapacityBonus || 0));
            if (isCriticalHp || isBleedingWithoutMeds || isOverEncumbered) {
                triggerEvacuation(true, isOverEncumbered ? "Inventory full." : "Critical condition!");
                return;
            }
        }

        if (combatState.enemy) {
            const currentEnemy = { ...combatState.enemy };

            if (playerState.stats.attackCooldown && playerState.stats.attackCooldown > 0) {
                setPlayerState(prevState => ({
                    ...prevState,
                    stats: { ...prevState.stats, attackCooldown: Math.max(0, prevState.stats.attackCooldown! - 1) }
                }));
            }
            if (currentEnemy.attackCooldown && currentEnemy.attackCooldown > 0) {
                currentEnemy.attackCooldown = Math.max(0, currentEnemy.attackCooldown - 1);
            }

            logEntries.push(`[${formatTime(elapsedTime)}] --- Combat Turn ---`);

            const calculateAccuracyModifier = (distance: number, visibility: number, action: CombatAction): number => {
                let modifier = 1.0;

                if (distance > 15) {
                    modifier -= (distance - 15) * 0.015;
                }

                const visibilityModifier = visibility / 100;
                modifier *= visibilityModifier;

                if (action === 'take_cover') modifier *= 0.5;
                if (action === 'flee') modifier *= 0.2;
                if (action === 'reload') modifier = 0;
                if (action === 'exposed') modifier *= 0.3;

                return Math.max(0, modifier);
            };

            const chooseCombatAction = (
                hp: number,
                maxHp: number,
                weapon: Weapon | null,
                enemyHp: number,
                enemyMaxHp: number,
                distance: number,
                currentRaidStatus: RaidStatus,
                inventory: GameItem[]
            ): CombatAction => {
                if (currentRaidStatus === 'evacuating') {
                    return 'flee';
                }

                const hpPercent = (hp / maxHp) * 100;
                const enemyHpPercent = (enemyHp / enemyMaxHp) * 100;

                if (hpPercent < 30) {
                    return Math.random() < 0.7 ? 'flee' : 'take_cover';
                }
                if (!weapon || (weapon.caliber !== 'N/A' && (!weapon.chamberedAmmo || weapon.chamberedAmmo === 0))) {
                    const hasSpareAmmo = inventory.some(i => i.type === 'Consumable' && (i as Consumable).consumableType === 'Ammo' && (i as Consumable).caliber === weapon?.caliber);
                    if (hasSpareAmmo) {
                        return 'reload';
                    }
                    return 'flee'; 
                }
                if (weapon.chamberedAmmo && weapon.maxAmmo && weapon.chamberedAmmo <= weapon.maxAmmo * 0.1) {
                    return Math.random() < 0.8 ? 'reload' : 'attack';
                }

                const optimalMin = weapon.optimalRangeMin ?? 0;
                const optimalMax = weapon.optimalRangeMax ?? (weapon.category === 'Melee' ? 3 : 100);

                if (distance > optimalMax) {
                    return 'advance';
                }
                if (distance < optimalMin) {
                    return 'retreat';
                }

                if (hpPercent < 50) {
                    return Math.random() < 0.5 ? 'take_cover' : 'attack';
                }
                if (enemyHpPercent < 30 && hpPercent > 50) {
                    return 'attack';
                }
                
                return Math.random() < 0.8 ? 'attack' : 'take_cover';
            };

            let playerWeapon = newLoadout.Primary;
            if (!playerWeapon || (playerWeapon.caliber !== 'N/A' && (!playerWeapon.chamberedAmmo || playerWeapon.chamberedAmmo === 0))) {
                if (newLoadout.Secondary && newLoadout.Secondary.chamberedAmmo && newLoadout.Secondary.chamberedAmmo > 0) {
                    logEntries.push(`> Primary is empty, switching to ${newLoadout.Secondary.name}!`);
                    const temp = newLoadout.Primary;
                    newLoadout.Primary = newLoadout.Secondary;
                    newLoadout.Secondary = temp;
                    playerWeapon = newLoadout.Primary;
                }
            }
            const playerHp = (Object.values(newParts) as BodyPartStatus[]).reduce((sum, part) => sum + part.hp, 0);
            const playerMaxHp = (Object.values(newParts) as BodyPartStatus[]).reduce((sum, part) => sum + part.maxHp, 0);
            const autoPlayerAction = chooseCombatAction(playerHp, playerMaxHp, playerWeapon, currentEnemy.hp, currentEnemy.maxHp, currentEnemy.distance, raidStatus, [...newBackpack, ...newRaidInventory]);
            setPlayerAction(autoPlayerAction);

            const enemyWeapon = (currentEnemy.loadout as any)['Primary'] || (currentEnemy.loadout as any)['Secondary'];
            if (currentEnemy.detected) {
                currentEnemy.currentAction = chooseCombatAction(currentEnemy.hp, currentEnemy.maxHp, enemyWeapon, playerHp, playerMaxHp, currentEnemy.distance, raidStatus, currentEnemy.inventory);
            } else {
                currentEnemy.currentAction = 'exposed';
            }

            if (autoPlayerAction === 'flee' && currentEnemy.currentAction === 'flee') {
                logEntries.push(`> Both sides decide to disengage!`);
                setCombatState({ status: 'none', enemy: null });
                setRaidStatus(preCombatStatus);
                somethingHappened = true;
            } else {

            const wasEnemyUnawareBeforeAttack = !currentEnemy.detected;
            const weapon = newLoadout.Primary || newLoadout.Secondary;
            let playerDamage = 0;
            let playerFled = false;

            logEntries.push(`> Agent action: **${autoPlayerAction}**`);

                        if (autoPlayerAction === 'flee') {

                            const playerLegsImpaired = Object.values(newParts).some((p: any) => 

                                (p.name === 'LeftLeg' || p.name === 'RightLeg') && 

                                (p.injuries.includes('Fracture') || p.injuries.includes('Crippled'))

                            );

                            const fleeChance = 50;

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
                        const item = newBackpack[i] as Consumable;
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
            } else if (autoPlayerAction === 'advance' || autoPlayerAction === 'retreat') {
                const playerLegsImpaired = Object.values(newParts).some((p: any) => 
                    (p.name === 'LeftLeg' || p.name === 'RightLeg') && 
                    (p.injuries.includes('Fracture') || p.injuries.includes('Crippled'))
                );
                const moveSpeed = playerLegsImpaired ? 3 : 5;
                if (autoPlayerAction === 'advance') {
                    currentEnemy.distance = Math.max(0, currentEnemy.distance - moveSpeed);
                    logEntries.push(`> Agent advances, closing distance to ${currentEnemy.distance}m.`);
                } else {
                    currentEnemy.distance += moveSpeed;
                    logEntries.push(`> Agent retreats, increasing distance to ${currentEnemy.distance}m.`);
                }
            } else if (autoPlayerAction === 'attack') {
                if ((playerState.stats.attackCooldown || 0) <= 0) {
                if (!currentEnemy.detected) {
                    if (!isPlayerExposed) setIsPlayerExposed(true);
                    let hasSuppressor = false;
                    if (weapon && weapon.attachments?.Muzzle?.stealthOnFirstShot) {
                        hasSuppressor = true;
                    }

                    const weakPointChance = 85;

                    if (weapon && weapon.chamberedAmmo && weapon.chamberedAmmo > 0) {
                        weapon.chamberedAmmo -= 1;
                        if(Math.random() > 0.1) weapon.durability -=1;

                        if (Math.random() * 100 < weakPointChance) {
                            playerDamage = Math.floor(weapon.damage * 1.5);
                            if (hasSuppressor) {
                                logEntries.push(`> [WEAK_POINT.CRITICAL] Agent struck undetected ${currentEnemy.name} with suppressed ${weapon.name}, dealing ${playerDamage} damage! (Stealth maintained)`);
                            } else {
                                logEntries.push(`> [WEAK_POINT.CRITICAL] Agent struck undetected ${currentEnemy.name} with ${weapon.name}, dealing ${playerDamage} damage! (${weakPointChance}% chance)`);
                            }
                        } else {
                            logEntries.push(`> Agent missed weak point attack! (${weakPointChance}% chance)`);
                        }
                    } else {
                        playerDamage = newLoadout.Melee ? Math.floor(newLoadout.Melee.damage * 1.5) : 2;
                        logEntries.push(`> [WEAK_POINT.CRITICAL] Agent struck undetected ${currentEnemy.name} with ${newLoadout.Melee ? newLoadout.Melee.name : 'fists'}!`);
                    }

                    if (hasSuppressor) {
                        const stealthChance = 65;
                        if (Math.random() * 100 > stealthChance) {
                            currentEnemy.detected = true;
                            logEntries.push(`> Enemy detected the suppressed shot! (${100 - stealthChance}% chance)`);
                        } else {
                            logEntries.push(`> [STEALTH] Enemy remains unaware. (${stealthChance}% stealth chance)`);
                        }
                    } else {
                        currentEnemy.detected = true;
                    }
                } else {
                    const playerAccuracyMod = calculateAccuracyModifier(currentEnemy.distance, currentEnemy.visibility, autoPlayerAction);

                    let attachmentAccuracyBonus = 0;
                    let attachmentRecoilReduction = 0;
                    let playerVisibilityModifier = 0;
                    let enemyVisibilityBonus = 0;
                    let hasSuppressor = false;

                    if (weapon && weapon.attachments) {
                        const scope = weapon.attachments.Scope;
                        const muzzle = weapon.attachments.Muzzle;
                        const tactical = weapon.attachments.Tactical;

                        if (scope) {
                            const distance = currentEnemy.distance;
                            const mag = scope.magnification || 1;
                            const optimalMin = scope.optimalRangeMin || 0;
                            const optimalMax = scope.optimalRangeMax || 100;

                            if (distance >= optimalMin && distance <= optimalMax) {
                                attachmentAccuracyBonus += scope.accuracyBonus || 0;
                            } else if (distance < optimalMin) {
                                const penalty = mag > 2 ? (optimalMin - distance) * (mag - 1) * 0.5 : 0;
                                attachmentAccuracyBonus += Math.max(2, (scope.accuracyBonus || 0) - penalty);
                            } else {
                                const falloff = (distance - optimalMax) * 0.2;
                                attachmentAccuracyBonus += Math.max(3, (scope.accuracyBonus || 0) - falloff);
                            }
                        }

                        if (muzzle) {
                            attachmentRecoilReduction += muzzle.recoilReduction || 0;
                            playerVisibilityModifier += muzzle.visibilityModifier || 0;
                            if (muzzle.stealthOnFirstShot) hasSuppressor = true;
                        }

                        if (tactical) {
                            attachmentAccuracyBonus += tactical.accuracyBonus || 0;
                            playerVisibilityModifier += tactical.visibilityModifier || 0;
                            enemyVisibilityBonus += tactical.enemyVisibilityBonus || 0;
                        }
                    }

                    let baseAccuracy = playerState.stats.accuracy * playerAccuracyMod + attachmentAccuracyBonus;

                    if (newParts.LeftArm.injuries.includes('Crippled') || newParts.RightArm.injuries.includes('Crippled')) {
                        baseAccuracy *= 0.7;
                        logEntries.push(`> Agent's crippled arm affects their aim!`);
                    }

                    if (weapon && weapon.chamberedAmmo && weapon.chamberedAmmo > 0) {
                        const burstCount = calculateBurstCount(weapon.fireMode, weapon.fireRate);
                        const roundsToFire = Math.min(burstCount, weapon.chamberedAmmo);
                        let totalDamage = 0;
                        let hitsLanded = 0;
                        let cumulativeRecoil = 0;

                        const modifiedEnemyVisibility = Math.min(100, Math.max(0, currentEnemy.visibility + enemyVisibilityBonus));

                        const determineHitLocation = (isUnaware: boolean): BodyPart => {
                            const roll = Math.random() * 100;
                            if (isUnaware) {
                                if (roll < 70) return 'Head';
                                if (roll < 90) return 'Torso';
                                return 'LeftArm';
                            }

                            if (roll < 40) return 'Torso';
                            if (roll < 60) return 'LeftArm';
                            if (roll < 80) return 'RightArm';
                            if (roll < 90) return 'LeftLeg';
                            if (roll < 95) return 'RightLeg';
                            return 'Head';
                        };

                        for (let i = 0; i < roundsToFire; i++) {
                            weapon.chamberedAmmo -= 1;
                            if(Math.random() > 0.1) weapon.durability -= 1;

                            const effectiveRecoil = Math.max(0, (weapon.recoil || 0) - (weapon.recoil || 0) * (attachmentRecoilReduction / 100));
                            const recoilPenalty = effectiveRecoil * cumulativeRecoil * 0.01;
                            const shotAccuracy = Math.max(10, baseAccuracy - recoilPenalty);

                            const playerHitRoll = Math.random() * 100;
                            if (playerHitRoll < shotAccuracy) {
                                hitsLanded++;
                                let shotDamage = weapon.damage;

                                const hitLocation = determineHitLocation(!currentEnemy.detected);
                                const enemyArmor = hitLocation === 'Head' ? currentEnemy.loadout.Helmet : currentEnemy.loadout['Body Armor'];

                                if (enemyArmor && enemyArmor.durability > 0) {
                                    const damageReduction = enemyArmor.defense;
                                    shotDamage = Math.max(0, shotDamage - damageReduction);
                                    enemyArmor.durability -= 1;
                                    logEntries.push(`> Enemy's ${enemyArmor.name} absorbed some damage.`);
                                }

                                if (currentEnemy.currentAction === 'take_cover') {
                                    shotDamage = Math.floor(shotDamage * 0.6);
                                }

                                (currentEnemy.bodyParts as any)[hitLocation].hp = Math.max(0, (currentEnemy.bodyParts as any)[hitLocation].hp - shotDamage);
                                totalDamage += shotDamage;
                            }

                            cumulativeRecoil += 1;
                        }

                        playerDamage = totalDamage;

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

                    const newCooldown = 60 / getModifiedFireRate(weapon);
                    setPlayerState(prevState => ({
                        ...prevState,
                        stats: { ...prevState.stats, attackCooldown: newCooldown }
                    }));
                }
                } else {
                    logEntries.push(`> Agent is waiting for the right moment... (cooldown)`);
                }

            if (!playerFled) {
                currentEnemy.hp = Object.values(currentEnemy.bodyParts).reduce((sum, part: any) => sum + part.hp, 0);
                if (playerDamage > 0) {
                    logEntries.push(`> ${currentEnemy.name} HP is now ${currentEnemy.hp}/${currentEnemy.maxHp}.`);
                }
            }

            if (currentEnemy.hp <= 0 && !playerFled) {
                logEntries.push(`> VICTORY. ${currentEnemy.name} eliminated.`);
                logEntries.push(`> Searching the body of ${currentEnemy.name}...`);

                Object.values(currentEnemy.loadout).filter(Boolean).forEach(lootItem => handleLootProcessing({ ...(lootItem as GameItem), id: `loot_${Date.now()}_${Math.random()}` }));

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
                setPlayerAction('attack');
                if (!wasEnemyUnawareBeforeAttack) {
                    setPostCombatTimer(60);
                }
            } else if (!playerFled) {
                if (!currentEnemy.detected) {
                    logEntries.push(`> ${currentEnemy.name} is unaware of your presence... [UNDETECTED]`);
                    setCombatState({ status: 'engaged', enemy: currentEnemy });
                } else {
                    logEntries.push(`> ${currentEnemy.name} action: **${currentEnemy.currentAction}**`);

                    if (currentEnemy.currentAction === 'flee') {
                        const enemyLegsImpaired = Object.values(currentEnemy.bodyParts).some((p: any) => 
                            (p.name === 'LeftLeg' || p.name === 'RightLeg') && 
                            (p.injuries.includes('Fracture') || p.injuries.includes('Crippled'))
                        );
                        const enemyFleeChance = 50;

                                                                if (Math.random() * 100 < enemyFleeChance) {

                                                                    logEntries.push(`> ${currentEnemy.name} fled! (${enemyFleeChance.toFixed(1)}% chance)`);

                                                                    setCombatState({ status: 'none', enemy: null });

                                                                    setRaidStatus(preCombatStatus);

                                                                    setPlayerAction('attack');
                                                                } else {
                        logEntries.push(`> ${currentEnemy.name} failed to flee!`);
                        setCombatState({ status: 'engaged', enemy: currentEnemy });
                    }
                } else if (currentEnemy.currentAction === 'reload') {
                    const enemyWeapon = (currentEnemy.loadout as any)['Primary'] || (currentEnemy.loadout as any)['Secondary'];
                    if (enemyWeapon && enemyWeapon.caliber !== 'N/A') {
                        const ammoNeeded = enemyWeapon.maxAmmo! - (enemyWeapon.chamberedAmmo || 0);
                        let ammoReloaded = 0;

                        for (let i = currentEnemy.inventory.length - 1; i >= 0; i--) {
                            const item = currentEnemy.inventory[i] as Consumable;
                            if (item.type === 'Consumable' && item.consumableType === 'Ammo' && item.caliber === enemyWeapon.caliber) {
                                const ammoToTake = Math.min(ammoNeeded - ammoReloaded, item.charges);
                                enemyWeapon.chamberedAmmo = (enemyWeapon.chamberedAmmo || 0) + ammoToTake;
                                item.charges -= ammoToTake;
                                ammoReloaded += ammoToTake;
                                if (item.charges <= 0) {
                                    currentEnemy.inventory.splice(i, 1);
                                }
                                if (ammoReloaded >= ammoNeeded) break;
                            }
                        }

                        if (ammoReloaded > 0) {
                            logEntries.push(`> ${currentEnemy.name} reloaded ${ammoReloaded} rounds.`);
                        } else {
                            logEntries.push(`> ${currentEnemy.name} tries to reload but has no ammo!`);
                        }
                    }
                    setCombatState({ status: 'engaged', enemy: currentEnemy });
                } else if (currentEnemy.currentAction === 'take_cover') {
                    logEntries.push(`> ${currentEnemy.name} takes cover!`);
                    setCombatState({ status: 'engaged', enemy: currentEnemy });
                } else if (currentEnemy.currentAction === 'advance' || currentEnemy.currentAction === 'retreat') {
                    const enemyLegsImpaired = Object.values(currentEnemy.bodyParts).some((p: any) => 
                        (p.name === 'LeftLeg' || p.name === 'RightLeg') && 
                        (p.injuries.includes('Fracture') || p.injuries.includes('Crippled'))
                    );
                    const moveSpeed = enemyLegsImpaired ? 3 : 5;
                    if (currentEnemy.currentAction === 'advance') {
                        currentEnemy.distance = Math.max(0, currentEnemy.distance - moveSpeed);
                        logEntries.push(`> ${currentEnemy.name} advances, closing distance to ${currentEnemy.distance}m.`);
                    } else {
                        currentEnemy.distance += moveSpeed;
                        logEntries.push(`> ${currentEnemy.name} retreats, increasing distance to ${currentEnemy.distance}m.`);
                    }
                    setCombatState({ status: 'engaged', enemy: currentEnemy });
                } else if (currentEnemy.currentAction === 'attack') {
                    if ((currentEnemy.attackCooldown || 0) <= 0) {
                    const enemyWeapon = (currentEnemy.loadout as any)['Primary'] || (currentEnemy.loadout as any)['Secondary'];

                    if (enemyWeapon && enemyWeapon.chamberedAmmo && enemyWeapon.chamberedAmmo > 0) {
                        const burstCount = calculateBurstCount(enemyWeapon.fireMode, enemyWeapon.fireRate);
                        const roundsToFire = Math.min(burstCount, enemyWeapon.chamberedAmmo);
                        let totalHits = 0;
                        let totalDamageTaken = 0;
                        let cumulativeRecoil = 0;

                        const enemyAccuracyMod = calculateAccuracyModifier(currentEnemy.distance, currentEnemy.visibility, currentEnemy.currentAction);
                        let baseEnemyAccuracy = currentEnemy.accuracy * enemyAccuracyMod;

                        if (currentEnemy.bodyParts.LeftArm.injuries.includes('Crippled') || currentEnemy.bodyParts.RightArm.injuries.includes('Crippled')) {
                            baseEnemyAccuracy *= 0.7;
                            logEntries.push(`> ${currentEnemy.name}'s crippled arm affects their aim!`);
                        }

                        if (playerAction === 'take_cover') {
                            baseEnemyAccuracy *= 0.5;
                        }

                        for (let i = 0; i < roundsToFire; i++) {
                            enemyWeapon.chamberedAmmo -= 1;

                            const recoilPenalty = (enemyWeapon.recoil || 0) * cumulativeRecoil * 0.01;
                            const shotAccuracy = Math.max(10, baseEnemyAccuracy - recoilPenalty);

                            const enemyHitChance = shotAccuracy / 100;
                            const hit = Math.random() < enemyHitChance;

                            if (hit) {
                                totalHits++;
                                const bodyPartKeys = Object.keys(newParts) as BodyPart[];
                                const hitPart = bodyPartKeys[Math.floor(Math.random() * bodyPartKeys.length)];
                                let damageTaken = currentEnemy.damage;

                                if (playerAction === 'take_cover') {
                                    damageTaken = Math.floor(damageTaken * 0.7);
                                }

                                const armor = hitPart === 'Head' ? newLoadout.Helmet : newLoadout["Body Armor"];
                                if(armor && armor.durability > 0){
                                    const damageReduction = armor.defense;
                                    damageTaken = Math.max(0, damageTaken - damageReduction);
                                    armor.durability -= 1;
                                    logEntries.push(`> ${armor.name} absorbed damage.`);
                                }
                                (newParts as any)[hitPart].hp = Math.max(0, (newParts as any)[hitPart].hp - damageTaken);
                                totalDamageTaken += damageTaken;

                                if (newParts.Head.hp <= 0 || newParts.Torso.hp <= 0) {
                                    handlePlayerDeath();
                                    return;
                                }
                            }

                            cumulativeRecoil += 1;
                        }

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

                    currentEnemy.attackCooldown = 60 / getModifiedFireRate(enemyWeapon);

                    setCombatState({ status: 'engaged', enemy: currentEnemy });
                } else {
                    logEntries.push(`> ${currentEnemy.name} is waiting for the right moment... (cooldown)`);
                    setCombatState({ status: 'engaged', enemy: currentEnemy });
                }

                [newParts, currentEnemy.bodyParts].forEach((bodyParts, characterIndex) => {
                    Object.keys(bodyParts).forEach(partKey => {
                        const part = (bodyParts as any)[partKey as BodyPart];
                        if (part.hp <= 0 && !part.injuries.includes('Crippled')) {
                            part.hp = 0;
                            part.injuries.push('Crippled');
                            const characterName = characterIndex === 0 ? "Agent's" : `${currentEnemy.name}'s`;
                            logEntries.push(`> [CRITICAL] ${characterName} ${partKey} has been crippled!`);

                            if (partKey === 'Torso') {
                                part.injuries.push('IncurableBleeding');
                                logEntries.push(`> [FATAL] ${characterName} torso is destroyed, causing incurable bleeding!`);
                            }
                        }
                    });
                });

                currentEnemy.hp = Object.values(currentEnemy.bodyParts).reduce((sum, part: any) => sum + part.hp, 0);

                if (currentEnemy.bodyParts.Head.hp <= 0) {
                    currentEnemy.hp = 0;
                }

                }
            }
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
                    const encounterRoll = Math.random() * 100;
                    let encounterType: EncounterType = 'mutual_detection';
                    let encounterLog = "";

                    if (postCombatTimer > 0) {
                        if (encounterRoll < 40) encounterType = 'ambush';
                        else if (encounterRoll < 80) encounterType = 'heard_close';
                        else if (encounterRoll < 95) encounterType = 'mutual_detection';
                        else encounterType = 'spot_distant';
                    } else {
                        if (encounterRoll < 20) encounterType = 'ambush';
                        else if (encounterRoll < 40) encounterType = 'heard_close';
                        else if (encounterRoll < 60) encounterType = 'spot_distant';
                        else encounterType = 'mutual_detection';
                    }

                    switch (encounterType) {
                        case 'ambush': encounterLog = `[AMBUSH] A ${name} emerges from the shadows up close!`; break;
                        case 'spot_distant': encounterLog = `[INFO] Spotted a ${name} wandering in the distance.`; break;
                        case 'heard_close': encounterLog = `[SOUND] You hear movement nearby...`; break;
                        case 'mutual_detection': encounterLog = `[CONTACT] You and a ${name} spot each other simultaneously!`; break;
                    }
                    const enemy = generateHumanEnemy(isPlayerExposed, encounterType, 50);
                    encounterLog = encounterLog.replace('${name}', enemy.name);

                    setPreCombatStatus(raidStatus);
                    setCombatState({ status: enemy.detected ? 'engaged' : 'heard', enemy: enemy });
                    setRaidStatus('in-combat');
                    setProgressLog(null);
                    logEntries.push(`[${formatTime(elapsedTime)}] ${encounterLog}`);
                } else if (eventRoll < 0.7 && raidStatus !== 'evacuating') {
                    const container = containerNames[Math.floor(Math.random() * containerNames.length)];
                    const loot = { ...lootTable[Math.floor(Math.random() * lootTable.length)], id: `loot_${Date.now()}` };
                    setProgressLog(`Searching ${container}`);
                    handleLootProcessing(loot);
                } else {
                    const area = areaNames[Math.floor(Math.random() * areaNames.length)];
                    setProgressLog('MOVING.FORWARD');
                    logEntries.push(`[${formatTime(elapsedTime)}] Entered ${area}.`);
                    setRaidProgress(prev => Math.min(100, prev + 2));
                }
            } else if (!progressLog) {
                setRaidProgress(prev => Math.min(100, prev + 0.5));
                setProgressLog('SEARCHING.AREA');
            }
        }

        let totalBleeds = 0;
        let incurableBleeds = 0;
        for (const part of Object.values(newParts) as BodyPartStatus[]) {
            if (part.injuries.includes('IncurableBleeding')) incurableBleeds++;
            else if (part.injuries.includes('Bleeding')) totalBleeds++;
        }
        if (totalBleeds > 0 || incurableBleeds > 0) {
            const bleedDamage = totalBleeds * 1;
            const incurableBleedDamage = incurableBleeds * 3;
            (newParts.Torso as BodyPartStatus).hp = Math.max(0, (newParts.Torso as BodyPartStatus).hp - bleedDamage - incurableBleedDamage);
            if(bleedDamage > 0) logEntries.push(`> Agent is bleeding, taking ${bleedDamage} damage.`);
            if(incurableBleedDamage > 0) logEntries.push(`> [FATAL] Agent's torso is bleeding out, taking ${incurableBleedDamage} damage.`);
            somethingHappened = true;
        }

        let isHealing = false;
        for (const partName in newParts) {
            const part = (newParts as any)[partName as BodyPart];
            if (part.injuries.includes('Bleeding')) {
                if(consumeRaidItem('Bandage', () => part.injuries = part.injuries.filter((i: InjuryType) => i !== 'Bleeding'))) {
                    setProgressLog('TREATING.BLEEDING');
                    logEntries.push(`[${formatTime(elapsedTime)}] Used Bandage on ${partName}.`);
                    isHealing = true;
                    break;
                }
            }
            if (part.injuries.includes('Fracture')) {
                if(consumeRaidItem('Splint', () => part.injuries = part.injuries.filter((i: InjuryType) => i !== 'Fracture'))) {
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
  }, [raidStatus, missionDuration, elapsedTime, raidBodyParts, raidBackpack, raidLoadout, raidInventory, combatState, playerState, setPlayerState]);

  return {
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
  };
};
