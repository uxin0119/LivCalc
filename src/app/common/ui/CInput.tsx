import React from 'react';
import DefaultStyle from "@/app/common/script/DefaultStyle";

type InputType = 'text' | 'number' |'password'|'currency';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps {
    type?: InputType;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    size?: InputSize;
    className?: string;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    selectOnFocus?: boolean; // 새로 추가된 prop
}


const CInput: React.FC<InputProps> = ({
                                        type = 'text',
                                        value,
                                        onChange,
                                        placeholder,
                                        disabled = false,
                                        readOnly = false,
                                        size = 'md',
                                        className = '',
                                        required = false,
                                        min,
                                        max,
                                        step,
                                        onFocus,
                                        selectOnFocus = false

                                      }) => {
    const baseClasses = '' +
        'border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
        'focus:border-transparent transition duration-200' +
        DefaultStyle.backgroundColor1;

    const sizeClasses = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    const disabledClasses = disabled || readOnly
        ? DefaultStyle.backgroundColor2
        : DefaultStyle.backgroundColor1;

    const combinedClasses = `
        ${baseClasses}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${className}
        ${type==="currency"?"text-right":""}
    `.trim().replace(/\s+/g, ' ');

// handleChange 함수를 다음과 같이 수정합니다
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'currency') {
        // 숫자와 콤마만 허용
        const inputValue:string = e.target.value.replace(/[^\d,]/g, '');
        // 콤마 제거
        const numericValue:string = inputValue.replace(/,/g, '');
        
        // 빈 문자열 체크
        if (!numericValue) {
            onChange('');
            return;
        }

        try {
            // 숫자로 변환하고 포맷팅
            const formatted = Number(numericValue).toLocaleString('ko-KR');
            onChange(formatted);
        } catch {
            // 변환 실패 시 이전 값 유지
            onChange(e.target.value);
        }
        return;
    }

    if (typeof onChange === 'function') {
        onChange(e.target.value);
    }
};

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (selectOnFocus) {
            e.target.select(); // 내용 전체 선택
        }
        if (onFocus) {
            onFocus(e);
        }
    };


    return (
            <input
                type={type==="currency"?"text":type}
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                min={min}
                max={max}
                step={step}
                className={combinedClasses}
            />
    );
};

export default CInput;