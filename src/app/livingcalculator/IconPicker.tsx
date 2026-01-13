"use client";
import React from 'react';

const ICONS: string[] = [
  '💰', '💳', '📊', '💵', '💴', '🏠', '🚗',
  '🍔', '🎮', '📱', '💻', '👕', '✈️', '🏥',
  '📚', '🎓', '💡', '🔧', '🎨', '🏃', '🎵',
  '🍕', '☕', '🎁', '📦', '🔑', '⚡', '🌟'
];

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (icon: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelect }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-300 font-light">아이콘 선택</label>
      <div className="grid grid-cols-7 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-800/50 rounded-lg">
        {ICONS.map((icon, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(icon)}
            className={`
              aspect-square flex items-center justify-center text-2xl rounded-lg transition-all duration-200
              ${selectedIcon === icon
                ? 'bg-gray-600 ring-2 ring-white scale-110'
                : 'bg-gray-700/50 hover:bg-gray-600 hover:scale-105'}
            `}
            title={icon}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconPicker;
