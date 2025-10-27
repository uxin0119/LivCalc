import React from 'react';

export interface RadioOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface RadioProps {
    name: string;
    options: RadioOption[];
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    direction?: 'horizontal' | 'vertical';
}

const CRadio: React.FC<RadioProps> = ({
    name,
    options,
    value,
    onChange,
    disabled = false,
    direction = 'horizontal'
}) => {
    const containerClasses = direction === 'horizontal' ? 'flex gap-4' : 'space-y-2';

    const handleChange = (optionValue: string) => {
        if (!disabled&&onChange && typeof onChange === 'function') {
            onChange(optionValue);
        }
    };

    return (
        <div className={containerClasses}>
            {options.map((option) => (
                <label
                    key={option.value}
                    className={`flex items-center cursor-pointer ${
                        (disabled || option.disabled) ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                >
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={() => handleChange(option.value)}
                        disabled={disabled || option.disabled}
                        className="mr-2 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                </label>
            ))}
        </div>
    );
};

export default CRadio;