// Tailwind CSS 설정 파일
import type {Config} from 'tailwindcss';

const config: Config = {
    // 기존 설정...
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