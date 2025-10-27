import React from 'react';
import { PlayerState, BodyPart, InjuryType } from '../types/game.types';

interface HideoutViewProps {
  playerState: PlayerState;
  overallHpPercent: number;
  displayedBodyParts: any;
  groupedStash: any;
  log: string[];
  healWithStashItem: (consumableType: any, partToHeal: any) => void;
}

const HideoutView: React.FC<HideoutViewProps> = ({
  playerState,
  overallHpPercent,
  displayedBodyParts,
  groupedStash,
  log,
  healWithStashItem,
}) => {
  return (
    <>
      <div className="w-1/2 flex flex-col space-y-2">
        <div className="border border-green-400 p-2 flex-grow overflow-y-auto">
          <h2 className="text-green-300 mb-2">Agent Profile</h2>
          <div>Level: {playerState.level} | Roubles: {playerState.roubles}</div>
          <div>EXP: [{''.padStart(Math.floor((playerState.exp / playerState.expToNextLevel) * 10), '█').padEnd(10, '░')}] {playerState.exp} / {playerState.expToNextLevel}</div>

          <h2 className="text-green-300 mt-4 mb-2">Medical Status</h2>
          <div>HP: [{''.padStart(Math.floor(overallHpPercent/10), '█').padEnd(10, '░')}] {overallHpPercent}%</div>
          <div className="grid grid-cols-2 gap-x-4 mt-2">
            {Object.entries(displayedBodyParts).map(([part, status]: [string, any]) => (
                <div key={part}>{part}: {status.hp}/{status.maxHp}
                    {status.injuries.map((injury: InjuryType) => <span key={injury} className='text-red-500 ml-1'>{injury}</span>)}
                    {status.hp < status.maxHp && playerState.stash.some(i => (i as any).consumableType === 'Medkit') && <button onClick={() => healWithStashItem('Medkit', part as BodyPart)} className='ml-1 text-blue-400'>[H]</button>}
                    {status.injuries.includes('Bleeding') && playerState.stash.some(i => (i as any).consumableType === 'Bandage') && <button onClick={() => healWithStashItem('Bandage', part as BodyPart)} className='ml-1 text-blue-400'>[B]</button>}
                    {status.injuries.includes('Fracture') && playerState.stash.some(i => (i as any).consumableType === 'Splint') && <button onClick={() => healWithStashItem('Splint', part as BodyPart)} className='ml-1 text-blue-400'>[S]</button>}
                    {status.injuries.includes('Crippled') && playerState.stash.some(i => (i as any).consumableType === 'SurgeryKit') && <button onClick={() => healWithStashItem('SurgeryKit', part as BodyPart)} className='ml-1 text-yellow-400'>[SURGERY]</button>}
                </div>
            ))}
          </div>

          <h2 className="text-green-300 mt-4 mb-2">Stash Inventory</h2>
          <div className="space-y-1">
            {Object.entries(groupedStash).slice(0, 20).map(([key, itemData]: [string, any]) => {
              const hasCharges = itemData.type === 'Consumable' && 'charges' in itemData;
              const chargesDisplay = hasCharges ? ` (${itemData.charges}/${itemData.maxCharges})` : '';
              return (
                <div key={key} className="text-sm">
                  [{itemData.name}]{chargesDisplay} {(itemData.count || 0) > 1 && !hasCharges ? `x${itemData.count}` : ''}
                </div>
              );
            })}
            {Object.keys(groupedStash).length > 20 && (
              <div className="text-gray-400 text-xs">... and {Object.keys(groupedStash).length - 20} more items</div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/2 flex flex-col space-y-2">
        <div className="border border-green-400 p-2 flex-grow overflow-y-auto">
          <h2 className="text-green-300 mb-2">Last Mission Log</h2>
          {log.length > 0 ? (
            log.slice().reverse().map((entry, i) => <div key={i} className="text-sm">{entry}</div>)
          ) : (
            <div className="text-gray-400 text-sm">No mission history available.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default HideoutView;