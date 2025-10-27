import React from 'react';
import DefaultStyle from "@/app/common/script/DefaultStyle";

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    className?: string;
}

const CButton: React.FC<ButtonProps> = ({
                                           children,
                                           onClick,
                                           variant = 'primary',
                                           size = 'md',
                                           disabled = false,
                                           className = ''
                                       }) => {
    const baseClasses = 'rounded-md font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
        primary: DefaultStyle.buttonColor1,
        secondary: DefaultStyle.buttonColor2,
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const combinedClasses = `
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <button
            className={combinedClasses}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default CButton;