/**
 * 디자인 토큰 정의
 * 앱 전체에서 사용하는 색상, 간격, 타이포그래피 등을 중앙에서 관리
 */

export const DesignTokens = {
  colors: {
    // 기본 색상 팔레트
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    white: '#ffffff',
    black: '#000000',

    // 시맨틱 컬러 - 라이트 모드
    light: {
      background: {
        primary: '#ffffff',
        secondary: '#fafafa',
        tertiary: '#f5f5f5',
        card: '#f5f5f5',
        cardHover: '#ffffff',
        cardDisabled: '#f5f5f5',
        input: '#ffffff',
        buttonArea: 'transparent',
        buttonAreaHover: '#fafafa',
      },
      text: {
        primary: '#171717',
        secondary: '#525252',
        tertiary: '#737373',
        placeholder: '#a3a3a3',
        inverse: '#ffffff',
      },
      border: {
        light: '#e5e5e5',
        medium: '#d4d4d4',
        strong: '#a3a3a3',
        primary: '#171717',
        card: '#e5e5e5',
        cardHover: '#d4d4d4',
        input: '#e5e5e5',
        inputFocus: '#a3a3a3',
        dashed: '#d4d4d4',
        dashedHover: '#a3a3a3',
      },
      interactive: {
        hover: '#f5f5f5',
        active: '#e5e5e5',
        disabled: '#a3a3a3',
        dragHandle: '#f5f5f5',
        dragHandleHover: '#e5e5e5',
      },
    },

    // 시맨틱 컬러 - 다크 모드
    dark: {
      background: {
        primary: '#171717',
        secondary: '#262626',
        tertiary: '#404040',
        card: '#262626',
        cardHover: '#404040',
        cardDisabled: '#262626',
        input: '#404040',
        buttonArea: 'transparent',
        buttonAreaHover: '#262626',
      },
      text: {
        primary: '#f5f5f5',
        secondary: '#d4d4d4',
        tertiary: '#a3a3a3',
        placeholder: '#737373',
        inverse: '#171717',
      },
      border: {
        light: '#404040',
        medium: '#525252',
        strong: '#737373',
        primary: '#f5f5f5',
        card: '#525252',
        cardHover: '#737373',
        input: '#525252',
        inputFocus: '#737373',
        dashed: '#525252',
        dashedHover: '#737373',
      },
      interactive: {
        hover: '#404040',
        active: '#525252',
        disabled: '#525252',
        dragHandle: '#525252',
        dragHandleHover: '#737373',
      },
    },

    // 특수 용도 색상
    semantic: {
      positive: {
        light: '#171717',
        dark: '#f5f5f5',
      },
      negative: {
        light: '#171717',
        dark: '#f5f5f5',
      },
      danger: {
        light: '#dc2626',
        dark: '#ef4444',
        background: '#fee2e2',
        backgroundDark: '#450a0a',
      },
    },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '3rem',
  },

  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '1.75rem',
    full: '9999px',
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
};

export type DesignTokensType = typeof DesignTokens;