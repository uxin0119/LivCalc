"use client";
import React, { useState } from 'react';
import { TokenStyles } from '@/app/common/tokens/TokenStyles';

interface FloatingMenuProps {
  onExport: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  onManageCategories?: () => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ onExport, onSave, onLoad, onManageCategories }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-6 sm:right-6 z-50">
      {/* 메뉴 아이템들 */}
      {isOpen && (
        <div className="absolute bottom-12 sm:bottom-16 right-0 flex flex-col gap-2 sm:gap-3 mb-1">
          {/* 불러오기 버튼 */}
          {onLoad && (
            <div className="flex items-center gap-2 justify-end">
              <span className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap font-medium">
                불러오기
              </span>
              <button
                onClick={() => {
                  onLoad();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
                title="DB에서 불러오기"
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
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* 저장 버튼 */}
          {onSave && (
            <div className="flex items-center gap-2 justify-end">
              <span className="bg-green-600 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap font-medium">
                저장
              </span>
              <button
                onClick={() => {
                  onSave();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
                title="DB에 저장"
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
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* 내보내기 버튼 */}
          <div className="flex items-center gap-2 justify-end">
            <span className="bg-gray-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap font-medium">
              공유
            </span>
            <button
              onClick={() => {
                onExport();
                setIsOpen(false);
              }}
              className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
              title="데이터 공유"
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
          </div>

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