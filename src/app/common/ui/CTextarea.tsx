import React from 'react';
import DefaultStyle from "@/app/common/script/DefaultStyle";

type TextareaSize = 'sm' | 'md' | 'lg';

interface TextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    size?: TextareaSize;
    rows?: number;
    resize?: boolean;
    className?: string;
    required?: boolean;
}

const CTextarea: React.FC<TextareaProps> = ({
                                               value,
                                               onChange,
                                               placeholder,
                                               disabled = false,
                                               readOnly = false,
                                               size = 'md',
                                               rows = 4,
                                               resize = true,
                                               className = '',
                                               required = false
                                           }) => {
    const baseClasses = 'border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200';

    const sizeClasses = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    const disabledClasses = disabled || readOnly
        ? DefaultStyle.backgroundColor1+" cursor-not-allowed opacity-60"
        : DefaultStyle.backgroundColor2;

    const resizeClasses = resize ? 'resize-y' : 'resize-none';

    const combinedClasses = `
        ${baseClasses}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${resizeClasses}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
            <textarea
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                rows={rows}
                className={combinedClasses}
            />
    );
};

export default CTextarea;