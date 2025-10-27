import React from 'react';
import Modal from '@/app/common/components/Modal';
import { PlayerState, Weapon, Attachment, AttachmentSlot } from '../types/game.types';
import { getAvailableAttachmentSlots } from '../data';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWeaponForAttachments: Weapon | null;
  playerState: PlayerState;
  equipAttachment: (attachment: Attachment) => void;
  unequipAttachment: (slot: AttachmentSlot) => void;
}

const AttachmentModal: React.FC<AttachmentModalProps> = ({
  isOpen,
  onClose,
  selectedWeaponForAttachments,
  playerState,
  equipAttachment,
  unequipAttachment,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Attachments - ${selectedWeaponForAttachments?.name || ''}`} size="lg">
      <div className="text-white">
        {selectedWeaponForAttachments && (
          <div className="space-y-4">
            {/* Weapon Info */}
            <div className="border border-gray-600 p-3 rounded bg-gray-800">
              <h3 className="text-lg font-bold text-green-300 mb-2">{selectedWeaponForAttachments.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Damage: {selectedWeaponForAttachments.damage}</div>
                <div>Caliber: {selectedWeaponForAttachments.caliber}</div>
                <div>Fire Rate: {selectedWeaponForAttachments.fireRate} RPM</div>
                <div>Recoil: {selectedWeaponForAttachments.recoil}</div>
              </div>
            </div>

            {/* Attachment Slots */}
            <div className="space-y-3">
              {getAvailableAttachmentSlots(selectedWeaponForAttachments).map(slot => {
                const currentAttachment = selectedWeaponForAttachments.attachments?.[slot];
                const availableAttachments = playerState.stash.filter(
                  i => i.type === 'Consumable' &&
                  (i as any).consumableType === 'Attachment' &&
                  (i as Attachment).attachmentSlot === slot
                ) as Attachment[];

                return (
                  <div key={slot} className="border border-gray-600 p-3 rounded">
                    <h4 className="font-bold text-green-400 mb-2">{slot}</h4>

                    {/* Current Attachment */}
                    {currentAttachment ? (
                      <div className="bg-gray-700 p-2 rounded mb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{currentAttachment.name}</div>
                            <div className="text-xs text-gray-400 space-y-0.5">
                              {currentAttachment.accuracyBonus && <div>+{currentAttachment.accuracyBonus}% Accuracy</div>}
                              {currentAttachment.recoilReduction && <div>-{currentAttachment.recoilReduction}% Recoil</div>}
                              {currentAttachment.magnification && <div>{currentAttachment.magnification}x Mag ({currentAttachment.optimalRangeMin}-{currentAttachment.optimalRangeMax}m)</div>}
                              {currentAttachment.visibilityModifier && <div>{currentAttachment.visibilityModifier > 0 ? '+' : ''}{currentAttachment.visibilityModifier}% Visibility</div>}
                              {currentAttachment.enemyVisibilityBonus && <div>+{currentAttachment.enemyVisibilityBonus}% Enemy Spot</div>}
                              {currentAttachment.stealthOnFirstShot && <div className="text-green-400">Stealth First Shot</div>}
                            </div>
                          </div>
                          <button
                            onClick={() => unequipAttachment(slot)}
                            className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded"
                          >
                            Unequip
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-700 p-2 rounded mb-2 text-center text-gray-500 text-sm">
                        No attachment equipped
                      </div>
                    )}

                    {/* Available Attachments */}
                    {availableAttachments.length > 0 && (
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Available in Stash:</div>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {availableAttachments.map(attachment => (
                            <div key={attachment.id} className="bg-gray-800 p-2 rounded flex justify-between items-center text-sm">
                              <div>
                                <div>{attachment.name}</div>
                                <div className="text-xs text-gray-400 space-y-0.5">
                                  {attachment.accuracyBonus && <div>+{attachment.accuracyBonus}% Accuracy</div>}
                                  {attachment.recoilReduction && <div>-{attachment.recoilReduction}% Recoil</div>}
                                  {attachment.magnification && <div>{attachment.magnification}x Mag ({attachment.optimalRangeMin}-{attachment.optimalRangeMax}m)</div>}
                                  {attachment.visibilityModifier && <div>{attachment.visibilityModifier > 0 ? '+' : ''}{attachment.visibilityModifier}% Visibility</div>}
                                  {attachment.enemyVisibilityBonus && <div>+{attachment.enemyVisibilityBonus}% Enemy Spot</div>}
                                  {attachment.stealthOnFirstShot && <div className="text-green-400">Stealth First Shot</div>}
                                </div>
                              </div>
                              <button
                                onClick={() => equipAttachment(attachment)}
                                className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded"
                              >
                                Equip
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total Bonuses */}
            <div className="border border-green-600 p-3 rounded bg-gray-800">
              <h4 className="font-bold text-green-300 mb-2">Total Modifiers</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  Accuracy Bonus: +{
                    (selectedWeaponForAttachments.attachments?.Scope?.accuracyBonus || 0) +
                    (selectedWeaponForAttachments.attachments?.Muzzle?.accuracyBonus || 0) +
                    (selectedWeaponForAttachments.attachments?.Tactical?.accuracyBonus || 0)
                  }% {selectedWeaponForAttachments.attachments?.Scope?.magnification && `(${selectedWeaponForAttachments.attachments.Scope.magnification}x)`}
                </div>
                <div>
                  Recoil Reduction: -{
                    (selectedWeaponForAttachments.attachments?.Scope?.recoilReduction || 0) +
                    (selectedWeaponForAttachments.attachments?.Muzzle?.recoilReduction || 0) +
                    (selectedWeaponForAttachments.attachments?.Tactical?.recoilReduction || 0)
                  }%
                </div>
                <div className={
                  ((selectedWeaponForAttachments.attachments?.Muzzle?.visibilityModifier || 0) +
                  (selectedWeaponForAttachments.attachments?.Tactical?.visibilityModifier || 0)) > 0 ? 'text-red-400' : 'text-green-400'
                }>
                  Player Visibility: {
                    ((selectedWeaponForAttachments.attachments?.Muzzle?.visibilityModifier || 0) +
                    (selectedWeaponForAttachments.attachments?.Tactical?.visibilityModifier || 0)) > 0 ? '+' : ''
                  }{
                    (selectedWeaponForAttachments.attachments?.Muzzle?.visibilityModifier || 0) +
                    (selectedWeaponForAttachments.attachments?.Tactical?.visibilityModifier || 0)
                  }%
                </div>
                <div className="text-cyan-400">
                  Enemy Spotting: +{
                    (selectedWeaponForAttachments.attachments?.Tactical?.enemyVisibilityBonus || 0)
                  }%
                </div>
              </div>
              {selectedWeaponForAttachments.attachments?.Muzzle?.stealthOnFirstShot && (
                <div className="mt-2 pt-2 border-t border-gray-600 text-green-400 text-sm">
                  <span className="font-bold">Stealth:</span> 65% chance to remain undetected on first shot
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AttachmentModal;