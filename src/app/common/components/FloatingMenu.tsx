"use client";
import React, { useState } from 'react';

interface FloatingMenuProps {
  onManageCategories?: () => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ onManageCategories }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 메뉴 아이템이 하나뿐이라 토글이 굳이 필요 없지만, 추후 확장을 위해 구조 유지
  // 또는 바로 실행되게 할 수도 있음. 하지만 일관성을 위해 유지.
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-6 sm:right-6 z-50">
      {/* 메뉴 아이템들 */}
      {isOpen && (
        <div className="absolute bottom-12 sm:bottom-16 right-0 flex flex-col gap-2 sm:gap-3 mb-1">
          {/* 섹션 관리 버튼 */}
          {onManageCategories && (
            <div className="flex items-center gap-2 justify-end">
              <span className="bg-indigo-600 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap font-medium">
                섹션 관리
              </span>
              <button
                onClick={() => {
                  onManageCategories();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
                title="섹션 관리"
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
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          )}
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

      {/* 오버레이 */}
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
