// Tailwind CSS 설정 파일
import type {Config} from 'tailwindcss';

const config: Config = {
    // 기존 설정...
    safelist: [
        // 섹션 배경 색상 (600 shades)
        'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-pink-600',
        'bg-orange-600', 'bg-red-600', 'bg-yellow-600', 'bg-teal-600',
        // 섹션 hover 색상 (700 shades)
        'hover:bg-blue-700', 'hover:bg-green-700', 'hover:bg-purple-700', 'hover:bg-pink-700',
        'hover:bg-orange-700', 'hover:bg-red-700', 'hover:bg-yellow-700', 'hover:bg-teal-700',
        // 텍스트 배경 색상 (100 shades)
        'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100',
        'bg-orange-100', 'bg-red-100', 'bg-yellow-100', 'bg-teal-100',
        // 텍스트 색상 (800 shades)
        'text-blue-800', 'text-green-800', 'text-purple-800', 'text-pink-800',
        'text-orange-800', 'text-red-800', 'text-yellow-800', 'text-teal-800',
        // border 색상 (600 shades)
        'border-blue-600', 'border-green-600', 'border-purple-600', 'border-pink-600',
        'border-orange-600', 'border-red-600', 'border-yellow-600', 'border-teal-600',
    ],
    theme: {
        extend: {
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            animation: {
                float: 'float 1s ease-in-out infinite',
            },
        },
    },
    plugins: [
        // 기존 플러그인...
    ],
};

export default config;