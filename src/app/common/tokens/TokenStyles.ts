/**
 * 디자인 토큰을 Tailwind CSS 클래스로 변환하는 유틸리티
 */

export const TokenStyles = {
  // 생활비 계산기 관련 스타일
  livingCalculator: {
    // 메인 컨테이너
    container: 'bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700',

    // 헤더
    title: 'text-3xl sm:text-4xl font-light text-gray-900 dark:text-gray-100 tracking-wide',
    subtitle: 'text-sm sm:text-base text-gray-600 dark:text-gray-300 font-light',
    sectionTitle: 'text-xl sm:text-2xl font-light text-gray-900 dark:text-gray-100 tracking-wide',

    // 카드 스타일
    card: {
      // 활성화된 아이템
      active: 'bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 mb-3 overflow-hidden',
      activeHover: 'hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-500',
      activeDragging: 'z-50 shadow-2xl border-gray-400 dark:border-gray-500 opacity-95 scale-105 bg-white dark:bg-gray-700',

      // 비활성화된 아이템
      inactive: 'bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 mb-2 overflow-hidden opacity-60',
      inactiveHover: 'hover:bg-gray-200 dark:hover:bg-gray-700 hover:opacity-80',
      inactiveDragging: 'z-50 shadow-lg border-gray-400 dark:border-gray-500 opacity-80 scale-105',
    },

    // 드래그 핸들
    dragHandle: {
      base: 'cursor-grab active:cursor-grabbing w-12 flex-shrink-0 flex items-center justify-center text-gray-400 hover:text-gray-600 select-none transition-colors',
      border: 'border-r border-gray-200 dark:border-gray-600',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-600',
    },

    // 설정 버튼
    settingsButton: {
      base: 'w-12 flex-shrink-0 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer',
      border: 'border-l border-gray-200 dark:border-gray-600',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-600',
    },

    // 입력 필드
    input: {
      text: 'w-full text-base font-medium border-gray-200 dark:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-0 bg-white dark:bg-gray-700 dark:text-white',
      currency: 'w-full text-right text-base sm:text-lg font-semibold border-gray-200 dark:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-0 bg-white dark:bg-gray-700 dark:text-white',
    },

    // 타입 표시 아이콘
    typeIcon: {
      plus: 'w-6 h-6 flex items-center justify-center font-semibold rounded-md bg-gray-100 text-gray-700',
      minus: 'w-6 h-6 flex items-center justify-center font-semibold rounded-md bg-gray-900 text-white',
    },

    // 섹션 금액 표시
    sectionTotal: {
      positive: 'px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold text-base sm:text-lg border-2 transition-all duration-200 text-center bg-white text-gray-900 border-gray-900',
      negative: 'px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold text-base sm:text-lg border-2 transition-all duration-200 text-center bg-gray-900 text-white border-gray-900',
    },

    // 추가 버튼 영역
    addButtonArea: {
      container: 'mt-6 p-4 sm:p-6 bg-transparent rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300',
      label: 'text-sm text-gray-600 dark:text-gray-300 mb-4 font-light tracking-wide',
      buttonContainer: 'flex flex-col sm:flex-row gap-3 sm:gap-4',
    },

    // 버튼 스타일
    button: {
      income: 'flex-1 bg-gray-50 hover:bg-gray-900 text-gray-900 hover:text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl border-2 border-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl',
      expense: 'flex-1 bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl border-2 border-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl',
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