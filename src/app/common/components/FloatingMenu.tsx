"use client";
import React, { useState } from 'react';
import { TokenStyles } from '@/app/common/tokens/TokenStyles';

interface FloatingMenuProps {
  onExport: () => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-6 sm:right-6 z-50">
      {/* 메뉴 아이템들 */}
      {isOpen && (
        <div className="absolute bottom-12 sm:bottom-16 right-0 flex flex-col gap-2 sm:gap-3 mb-1">
          {/* 내보내기 버튼 */}
          <button
            onClick={() => {
              onExport();
              setIsOpen(false);
            }}
            className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
            title="데이터 내보내기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186z"
              />
            </svg>
          </button>

          {/* 향후 확장을 위한 추가 버튼들 */}
          {/*
          <button
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
            title="기타 기능"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="..." />
            </svg>
          </button>
          */}
        </div>
      )}

      {/* 메인 플로팅 버튼 */}
      <button
        onClick={toggleMenu}
        className={`flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-xl transition-all duration-300 transform ${
          isOpen ? 'rotate-45 scale-110' : 'hover:scale-105'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 sm:w-6 sm:h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>

      {/* 오버레이 (메뉴가 열렸을 때 배경 클릭하면 닫기) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingMenu;