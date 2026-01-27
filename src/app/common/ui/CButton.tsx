import React from 'react';
import { TokenStyles } from "@/app/common/tokens/TokenStyles";

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
    const baseClasses = TokenStyles.common.button.base;

    const variantClasses = {
        primary: TokenStyles.common.button.primary,
        secondary: TokenStyles.common.button.secondary,
        danger: TokenStyles.common.button.danger
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