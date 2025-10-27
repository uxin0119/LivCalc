import React from 'react';

interface IconProps {
    className?: string;
}

const IconKebab: React.FC<IconProps> = ({ className }) => {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6h.01M12 12h.01M12 18h.01"
            />
        </svg>
    );
};

export default IconKebab;
