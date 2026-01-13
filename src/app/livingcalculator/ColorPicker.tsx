"use client";
import React from 'react';

interface ColorOption {
  name: string;
  class: string;
  label: string;
}

const COLORS: ColorOption[] = [
  { name: 'blue', class: 'bg-blue-600', label: '파랑' },
  { name: 'green', class: 'bg-green-600', label: '초록' },
  { name: 'purple', class: 'bg-purple-600', label: '보라' },
  { name: 'pink', class: 'bg-pink-600', label: '분홍' },
  { name: 'orange', class: 'bg-orange-600', label: '주황' },
  { name: 'red', class: 'bg-red-600', label: '빨강' },
  { name: 'yellow', class: 'bg-yellow-600', label: '노랑' },
  { name: 'teal', class: 'bg-teal-600', label: '청록' }
];

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelect }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-300 font-light">색상 선택</label>
      <div className="grid grid-cols-4 gap-2">
        {COLORS.map((color) => (
          <button
            key={color.name}
            type="button"
            onClick={() => onSelect(color.name)}
            className={`
              relative w-full aspect-square rounded-lg transition-all duration-200
              ${color.class}
              ${selectedColor === color.name ? 'ring-4 ring-white ring-offset-2 ring-offset-gray-800 scale-110' : 'hover:scale-105'}
            `}
            title={color.label}
          >
            {selectedColor === color.name && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
