import React from 'react';
import { PlayerState, RaidStatus, CombatAction, Enemy, GameItem, InjuryType, BodyPart, Weapon, BodyPartStatus } from '../types/game.types';
import { formatTime, getItemTypeDisplay } from '../utils/helpers';

interface RaidViewProps {
  playerState: PlayerState;
  raidStatus: RaidStatus;
  overallHpPercent: number;
  displayedBodyParts: any;
  raidLoadout: any;
  currentWeight: number;
  carryCapacity: number;
  progressLog: string | null;
  dotCount: number;
  log: string[];
  groupedRaidLoot: any;
  elapsedTime: number;
  missionDuration: number;
  evacTime: number;
  combatState: { status: 'none' | 'heard' | 'engaged'; enemy: Enemy | null };
  playerAction: CombatAction;
}

const RaidView: React.FC<RaidViewProps> = ({
  playerState,
  raidStatus,
  overallHpPercent,
  displayedBodyParts,
  raidLoadout,
  currentWeight,
  carryCapacity,
  progressLog,
  dotCount,
  log,
  groupedRaidLoot,
  elapsedTime,
  missionDuration,
  evacTime,
  combatState,
  playerAction,
}) => {
  return (
    <>
      <div className="w-1/2 flex flex-col space-y-2">
        <div className="border border-green-400 p-2 flex-grow">
          <h2 className="text-green-300 mb-2">Agent Stats</h2>
          <div>Level: {playerState.level} | Roubles: {playerState.roubles}</div>
          <div>EXP: [{''.padStart(Math.floor((playerState.exp / playerState.expToNextLevel) * 10), '█').padEnd(10, '░')}] {playerState.exp} / {playerState.expToNextLevel}</div>
          <h2 className="text-green-300 mt-2 mb-2">Agent Vital Signs</h2>
          <div>HP: [{''.padStart(Math.floor(overallHpPercent/10), '█').padEnd(10, '░')}] {overallHpPercent}%</div>
          <div className="grid grid-cols-2 gap-x-4 mt-2">
            {Object.entries(displayedBodyParts).map(([part, status]: [string, any]) => (
                <div key={part}>{part}: {status.hp}/{status.maxHp}
                    {status.injuries.map((injury: InjuryType) => <span key={injury} className='text-red-500 ml-1'>{injury}</span>)}
                </div>
            ))}
          </div>
          <h2 className="text-green-300 mt-2 mb-2">Current Weapon</h2>
          {(() => {
            const weapon = (raidLoadout as any)['Primary'] || (raidLoadout as any)['Secondary'] || (raidLoadout as any)['Melee'];
            if (weapon && weapon.type === 'Weapon') {
              const w = weapon as Weapon;
              return (
                <div>
                  <div className="text-yellow-300">{w.name}</div>
                  {w.caliber !== 'N/A' && <div className="text-sm">Caliber: {w.caliber}</div>}
                  {w.chamberedAmmo !== undefined && (
                    <div className="text-sm">Ammo: [{w.chamberedAmmo}/{w.maxAmmo}]</div>
                  )}
                  {w.attachments && (
                    <div className="text-xs text-gray-400 mt-1">
                      {w.attachments.Scope && <div>• {w.attachments.Scope.name}</div>}
                      {w.attachments.Muzzle && <div>• {w.attachments.Muzzle.name}</div>}
                      {w.attachments.Tactical && <div>• {w.attachments.Tactical.name}</div>}
                    </div>
                  )}
                </div>
              );
            }
            return <div className="text-gray-500">No weapon equipped</div>;
          })()}
          <h2 className="text-green-300 mt-2 mb-2">Supplies & Weight</h2>
          <div>Weight: {currentWeight.toFixed(2)} / {carryCapacity.toFixed(2)} kg</div>
        </div>
        <div className="border border-green-400 p-2 flex-grow h-1/2 overflow-y-auto">
          <h2 className="text-green-300 mb-2">Activity Log</h2>
          {progressLog && (
            <div className="text-yellow-300 mb-2">
              &gt; {progressLog}{'.'.repeat(dotCount)}
            </div>
          )}
          {log.slice().reverse().map((entry, i) => <div key={i}>{entry}</div>)}
        </div>
      </div>
      <div className="w-1/2 flex flex-col space-y-2">
        <div className="border border-green-400 p-2 h-1/2 overflow-y-auto">
          <h2 className="text-green-300 mb-2">Raid Loot</h2>
          {Object.entries(groupedRaidLoot).map(([key, itemData]: [string, any]) => {
            const hasCharges = itemData.type === 'Consumable' && 'charges' in itemData;
            const chargesDisplay = hasCharges ? ` (${itemData.charges}/${itemData.maxCharges})` : '';
            return (
              <div key={key}>
                [{getItemTypeDisplay(itemData)}] {itemData.name}{chargesDisplay} {(itemData.count || 0) > 1 && !hasCharges ? `x${itemData.count}` : ''}
              </div>
            );
          })}
        </div>
        <div className="border border-green-400 p-2 flex-grow">
          <h2 className="text-green-300 mb-2">Mission Status</h2>
          <div className="overflow-y-auto max-h-48">
            <div>Status: {raidStatus}</div>
            {(raidStatus === 'in-progress' || raidStatus === 'evacuating' || raidStatus === 'in-combat') && (
                <>
                    <div>Elapsed Time: {formatTime(elapsedTime)} / {formatTime(missionDuration)}</div>
                    {raidStatus === 'evacuating' && (
                        <div className="text-yellow-400">Evac Time: {formatTime(evacTime)}</div>
                    )}
                </>
            )}
            {combatState.enemy && (
                <div className="mt-2 p-2 border border-gray-600">
                    <h3 className="text-red-500 font-bold">-- ENEMY ENGAGED --</h3>
                    <div>Name: {combatState.enemy.name}</div>
                    {!combatState.enemy.detected && (
                        <div className="text-green-400 font-bold">[UNDETECTED] Enemy unaware!</div>
                    )}
                    <div className="text-orange-300">Condition: {(() => {
                        const hpPercent = (combatState.enemy.hp / combatState.enemy.maxHp) * 100;
                        const hasInjuries = Object.values(combatState.enemy.bodyParts).some(part => (part as BodyPartStatus).injuries.length > 0);
                        const isBleeding = Object.values(combatState.enemy.bodyParts).some(part => (part as BodyPartStatus).injuries.includes('Bleeding'));

                        if (hpPercent > 80 && !hasInjuries) return "STATUS_OK";
                        if (hpPercent > 60 && !isBleeding) return "MINOR_DMG";
                        if (hpPercent > 40) return isBleeding ? "BLEEDING.CRITICAL" : "HEAVY_BREATHING";
                        if (hpPercent > 20) return "SEVERE_INJURY";
                        return "DYING.SYS";
                    })()}</div>
                    <div className="text-yellow-300">Distance: {combatState.enemy.distance}m</div>
                    <div className="text-cyan-300">Visibility: {combatState.enemy.visibility}%</div>
                    <div className="text-purple-300">Enemy Action: <span className={`font-bold text-lg ${combatState.enemy.currentAction === 'attack' ? 'text-red-500' : combatState.enemy.currentAction === 'flee' ? 'text-blue-400' : 'text-yellow-300'}`}>{combatState.enemy.currentAction}</span></div>
                    <div className="text-green-300">Player Action: <span className={`font-bold text-lg ${playerAction === 'attack' ? 'text-red-500' : playerAction === 'flee' ? 'text-blue-400' : 'text-yellow-300'}`}>{playerAction}</span></div>
                    <h4 className="font-bold mt-1 text-red-400">Current Weapon:</h4>
                    {(() => {
                      const weapon = (combatState.enemy.loadout as any)['Primary'] || (combatState.enemy.loadout as any)['Secondary'] || (combatState.enemy.loadout as any)['Melee'];
                      if (weapon && weapon.type === 'Weapon') {
                        const w = weapon as Weapon;
                        return (
                          <div className="text-xs ml-2">
                            <div className="text-yellow-300">{w.name}</div>
                            {w.caliber !== 'N/A' && <div>Caliber: {w.caliber}</div>}
                            {w.chamberedAmmo !== undefined && (
                              <div>Ammo: [{w.chamberedAmmo}/{w.maxAmmo}]</div>
                            )}
                          </div>
                        );
                      }
                      return <div className="text-xs ml-2 text-gray-500">Melee only</div>;
                    })()}
                    <h4 className="font-bold mt-1">All Equipment:</h4>
                    {Object.values(combatState.enemy.loadout).filter(Boolean).map((item: any) => (
                        <div key={item.id} className="text-xs">- {item.name}</div>
                    ))}
                    <div className="mt-2 border-t border-gray-600 pt-2">
                        <h4 className="font-bold mb-1 text-green-400">Combat (AI Controlled)</h4>
                        <div className="text-xs text-gray-400">
                            Player and Enemy actions are automatically decided based on HP, ammo, and tactical situation.
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default RaidView;