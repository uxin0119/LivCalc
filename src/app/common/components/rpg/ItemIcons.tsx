import React from 'react';

export const IconPotion = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 6V10C15 10 17 11 17 14C17 18 14 21 12 21C10 21 7 18 7 14C7 11 9 10 9 10V6L12 2Z" fill="#ff5252" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M10 14C10 14 11 16 14 15" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M9 10H15" stroke="white" strokeWidth="2"/>
  </svg>
);

export const IconSword = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 4.5L19.5 9.5L11 18L6 20L8 15L14.5 4.5Z" fill="#9e9e9e" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M11 18L8 21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 20L3 23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M13 6L18 11" stroke="white" strokeWidth="2" strokeOpacity="0.5"/>
  </svg>
);

export const IconWood = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="12" r="6" fill="#795548" stroke="white" strokeWidth="2"/>
    <circle cx="16" cy="12" r="6" fill="#5d4037" stroke="white" strokeWidth="2"/>
    <path d="M8 12C8 12 9 10 11 12" stroke="#d7ccc8" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 12C16 12 17 14 15 12" stroke="#d7ccc8" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const IconStone = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L18 8V16L12 20L6 16V8L12 4Z" fill="#78909c" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 4V20" stroke="white" strokeWidth="2" opacity="0.5"/>
    <path d="M12 12L18 8" stroke="white" strokeWidth="2" opacity="0.5"/>
    <path d="M12 12L6 8" stroke="white" strokeWidth="2" opacity="0.5"/>
  </svg>
);

export const IconArmor = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 4V11C4 16.5 7.5 21.5 12 22C16.5 21.5 20 16.5 20 11V4L12 2Z" fill="#5c6bc0" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 2V22" stroke="white" strokeWidth="2" opacity="0.3"/>
    <path d="M4 11H20" stroke="white" strokeWidth="2" opacity="0.3"/>
  </svg>
);

export const IconGun = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M2 14H8L10 12H20V8H10L8 6H4V10H2V14Z" fill="#424242" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <rect x="5" y="14" width="3" height="4" fill="#5d4037" stroke="white" strokeWidth="2"/>
  </svg>
);

export const IconBag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8V6C6 4.34315 7.34315 3 9 3H15C16.6569 3 18 4.34315 18 6V8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 8H20V18C20 19.6569 18.6569 21 17 21H7C5.34315 21 4 19.6569 4 18V8Z" fill="#8d6e63" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M10 12H14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ItemIcon = ({ type, className }: { type: string, className?: string }) => {
    switch(type) {
        case 'potion': return <IconPotion className={className} />;
        case 'sword': return <IconSword className={className} />;
        case 'wood': return <IconWood className={className} />;
        case 'stone': return <IconStone className={className} />;
        case 'armor': return <IconArmor className={className} />;
        case 'gun': return <IconGun className={className} />;
        default: return null;
    }
};
