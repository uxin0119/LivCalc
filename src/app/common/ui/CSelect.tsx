
import React from 'react';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    required?: boolean;
}

const CSelect: React.FC<SelectProps> = ({
                                           options,
                                           value,
                                           onChange,
                                           placeholder,
                                           disabled = false,
                                           size = 'md',
                                           className = '',
                                           required = false
                                       }) => {
    const baseClasses = 'border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white';

    const sizeClasses = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    const disabledClasses = disabled
        ? 'bg-gray-50 cursor-not-allowed opacity-60'
        : 'bg-white cursor-pointer';

    const combinedClasses = `
        ${baseClasses}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    return (
            <select
                value={value}
                onChange={handleChange}
                disabled={disabled}
                required={required}
                className={combinedClasses}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
    );
};

export default CSelect;