/**
 * 디자인 토큰을 Tailwind CSS 클래스로 변환하는 유틸리티
 */

export const TokenStyles = {
  // 생활비 계산기 관련 스타일
  livingCalculator: {
    // 메인 컨테이너
    container: 'bg-gray-800/50 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-700/50 backdrop-blur-sm',

    // 헤더
    title: 'text-3xl sm:text-4xl font-light text-gray-100 tracking-wide',
    subtitle: 'text-sm sm:text-base text-gray-300 font-light',
    sectionTitle: 'text-xl sm:text-2xl font-light text-gray-100 tracking-wide',

    // 카드 스타일
    card: {
      // 활성화된 아이템
      active: 'bg-gray-800/50 rounded-xl border border-gray-700/50 mb-3 overflow-hidden backdrop-blur-sm',
      activeHover: 'hover:bg-gray-800/70 hover:shadow-lg hover:border-gray-600',
      activeDragging: 'z-50 shadow-2xl border-gray-600 opacity-95 scale-105 bg-gray-800/70',

      // 비활성화된 아이템
      inactive: 'bg-gray-800/30 rounded-lg border border-gray-700/30 mb-2 overflow-hidden opacity-60',
      inactiveHover: 'hover:bg-gray-800/50 hover:opacity-80',
      inactiveDragging: 'z-50 shadow-lg border-gray-600 opacity-80 scale-105',
    },

    // 드래그 핸들
    dragHandle: {
      base: 'cursor-grab active:cursor-grabbing w-12 flex-shrink-0 flex items-center justify-center text-gray-400 hover:text-gray-300 select-none transition-colors',
      border: 'border-r border-gray-600',
      hover: 'hover:bg-gray-700',
    },

    // 설정 버튼
    settingsButton: {
      base: 'w-12 flex-shrink-0 flex items-center justify-center text-gray-400 hover:text-gray-300 transition-colors cursor-pointer',
      border: 'border-l border-gray-600',
      hover: 'hover:bg-gray-700',
    },

    // 입력 필드
    input: {
      text: 'w-full text-base font-medium border-0 focus:ring-0 bg-gray-900/80 text-white placeholder-gray-500 px-3 py-2 rounded-lg',
      currency: 'w-full text-right text-base sm:text-lg font-semibold border-0 focus:ring-0 bg-gray-900/80 text-white px-3 py-2 rounded-lg',
    },

    // 타입 표시 아이콘
    typeIcon: {
      plus: 'w-6 h-6 flex items-center justify-center font-semibold rounded-md bg-gray-600 text-white',
      minus: 'w-6 h-6 flex items-center justify-center font-semibold rounded-md bg-gray-700 text-white border border-gray-500',
    },

    // 섹션 금액 표시
    sectionTotal: {
      positive: 'px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-base sm:text-lg transition-all duration-200 text-center bg-gray-700/50 text-white backdrop-blur-sm',
      negative: 'px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-base sm:text-lg transition-all duration-200 text-center bg-gray-800/50 text-white border border-gray-600 backdrop-blur-sm',
    },

    // 추가 버튼 영역
    addButtonArea: {
      container: 'mt-6 p-4 sm:p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-300',
      label: 'text-sm text-gray-400 mb-4 font-light tracking-wide',
      buttonContainer: 'flex flex-col sm:flex-row gap-3 sm:gap-4',
    },

    // 버튼 스타일
    button: {
      income: 'flex-1 bg-gray-700 hover:bg-gray-500 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-200',
      expense: 'flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg border border-gray-600 transition-all duration-200',
    },
  },

  // 공통 UI 스타일 (DefaultStyle 대체)
  common: {
    // 배경색
    background: {
      primary: 'bg-white dark:bg-black',
      secondary: 'bg-gray-50 dark:bg-gray-700',
      base: 'bg-gray-950 text-white', // App Layout Base
    },
    // 텍스트 스타일
    text: {
      primary: 'text-gray-800 dark:text-gray-500',
      secondary: 'text-sm font-medium text-gray-500 dark:text-gray-400',
      head1: 'text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-300',
      head2: 'text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300',
      body1: 'text-sm font-medium',
      body2: 'font-semibold text-gray-600 dark:text-gray-400',
      inverse: 'text-lg font-semibold text-gray-900 dark:text-white',
    },
    // 버튼 스타일
    button: {
      base: 'rounded-md font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      primary: 'bg-gray-700 text-white hover:bg-gray-500 focus:ring-gray-500',
      secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    },
    // 입력 필드 스타일
    input: {
      base: 'border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200',
    },
  },

  // 모달 스타일
  modal: {
    overlay: 'fixed inset-0 bg-black/50 transition-opacity',
    container: 'fixed inset-0 z-50 flex items-start sm:items-center justify-center p-1 sm:p-4 pt-4 sm:pt-4',
    content: 'relative rounded-lg shadow-xl w-full max-h-[96vh] sm:max-h-[90vh] overflow-y-auto',
    header: 'flex items-center justify-between p-2 sm:p-4 border-b border-gray-200',
    title: 'text-sm sm:text-base truncate flex-1 mr-2',
    body: 'p-2 sm:p-4',

    // 모달 내부 요소들
    itemTitle: 'text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate',
    itemSubtitle: 'text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1',
    sectionTitle: 'text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 sm:mb-3',
    statusText: 'text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100',
    helperText: 'text-xs sm:text-sm text-gray-500 dark:text-gray-400',
    smallText: 'text-xs text-gray-500 dark:text-gray-400 mt-2 text-center',
    verySmallText: 'text-xs text-gray-400 dark:text-gray-500 mt-2 text-center',

    // 모달 버튼
    modalButton: {
      primary: 'flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl border-2 font-medium transition-all duration-200 text-sm sm:text-base',
      secondary: 'flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl border-2 font-medium transition-all duration-200 text-sm sm:text-base bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-500 hover:bg-gray-100',
      selected: 'bg-gray-900 text-white border-gray-900 shadow-md',
      danger: 'w-full py-2 sm:py-3 px-2 sm:px-4 rounded-xl border-2 border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600 text-white font-medium transition-all duration-200 text-sm sm:text-base',
    },

    // 모달 섹션
    section: {
      container: 'space-y-4 sm:space-y-6',
      itemDisplay: 'text-center p-2 sm:p-4 bg-gray-50 rounded-xl',
      statusControl: 'flex items-center justify-between p-2 sm:p-4 bg-gray-50 rounded-xl',
      buttonGroup: 'flex flex-col sm:flex-row gap-3',
    },
  },

  // 전환 효과
  transitions: {
    default: 'transition-all duration-300 ease-out',
    fast: 'transition-all duration-200',
    none: 'transition-none',
  },
};

export type TokenStylesType = typeof TokenStyles;