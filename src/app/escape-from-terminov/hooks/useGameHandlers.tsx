import { useState, useRef, useEffect } from 'react';
import { PlayerState, Loadout, GameItem, BodyParts, RaidStatus, Enemy, CombatAction } from '../types/game.types';
import { calculateLevelUp, formatTime } from '../logic/player';
import { evacLogo, kiaLogo, deployLogo, extLogo } from '../constants';

export const useGameHandlers = (
  playerState: PlayerState,
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>,
  raidStatus: RaidStatus,
  setRaidStatus: React.Dispatch<React.SetStateAction<RaidStatus>>,
  elapsedTime: number,
  setElapsedTime: React.Dispatch<React.SetStateAction<number>>,
  painkillerTime: number,
  raidBodyParts: BodyParts,
  setRaidBodyParts: React.Dispatch<React.SetStateAction<BodyParts>>,
  raidLoadout: Loadout,
  setRaidLoadout: React.Dispatch<React.SetStateAction<Loadout>>,
  raidInventory: GameItem[],
  raidBackpack: GameItem[],
  intervalRef: React.MutableRefObject<NodeJS.Timeout | null>,
  setCombatState: React.Dispatch<React.SetStateAction<{ status: 'none' | 'heard' | 'engaged'; enemy: Enemy | null }>>
) => {
  const addExp = (amount: number) => {
    setPlayerState(prevState => {
      const { level, exp, expToNextLevel } = calculateLevelUp(
        prevState.exp,
        prevState.level,
        prevState.expToNextLevel,
        amount
      );
      return { ...prevState, level, exp, expToNextLevel };
    });
  };

  const handleStartMission = (
    setMissionDuration: React.Dispatch<React.SetStateAction<number>>,
    setEvacTime: React.Dispatch<React.SetStateAction<number>>,
    setPainkillerTime: React.Dispatch<React.SetStateAction<number>>,
    setRaidInventory: React.Dispatch<React.SetStateAction<GameItem[]>>,
    setRaidBackpack: React.Dispatch<React.SetStateAction<GameItem[]>>,
    setLog: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const duration = Math.floor(Math.random() * 11) + 10;
    setMissionDuration(duration * 60);
    setRaidStatus('in-progress');
    setElapsedTime(0);
    setEvacTime(0);
    setPainkillerTime(0);
    setRaidBodyParts(JSON.parse(JSON.stringify(playerState.bodyParts)));
    setRaidInventory([]);

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
    setLog([...deployLogo, `[00:00] Mission Started. Duration: ${duration} minutes.`]);
  };

  const triggerEvacuation = (
    isAuto: boolean,
    reason: string | undefined,
    setEvacTime: React.Dispatch<React.SetStateAction<number>>,
    setLog: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (raidStatus === 'in-progress') {
        const legFractured = Object.values(raidBodyParts).some(p => p.injuries.includes('Fracture') && (p.name === 'LeftLeg' || p.name === 'RightLeg'));
        let evacDuration = Math.floor(Math.random() * 61) + 120;
        if (legFractured && painkillerTime <= 0) evacDuration *= 1.5;

        setEvacTime(evacDuration);
        setRaidStatus('evacuating');
        const reasonMsg = reason ? `${reason} ` : '';
        setLog(prev => [...prev, ...evacLogo, `[${formatTime(elapsedTime)}] ${reasonMsg}Extraction started. ETA: ${formatTime(evacDuration)}`]);
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

  const handlePlayerDeath = (
    setLog: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRaidStatus('finished');
    setCombatState({ status: 'none', enemy: null });
    setLog(prev => [...prev, ...kiaLogo, `[${formatTime(elapsedTime)}] Agent KIA. All gear and loot lost.`]);
    setPlayerState(prevState => ({
        ...prevState,
        loadout: { Primary: null, Secondary: null, Melee: null, Helmet: null, "Body Armor": null, Backpack: null },
        backpack: [],
    }));
  };

  return {
    addExp,
    handleStartMission,
    triggerEvacuation,
    handleMissionSuccess,
    handlePlayerDeath
  };
};
