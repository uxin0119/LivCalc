import React from 'react';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps {
    value: string | number;
    onChange: (value2:number) => void;
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


const CInputCurrency: React.FC<InputProps> = ({
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
        'text-right border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
        'focus:border-transparent transition duration-200';

    const sizeClasses = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    // 숫자를 콤마 포맷으로 변환하는 헬퍼 함수
    const formatNumber = (val: string | number) => {
        if (val === undefined || val === null || val === '') return '';
        const numericValue = typeof val === 'string' ? val.replace(/,/g, '') : String(val);
        const num = Number(numericValue);
        if (isNaN(num)) return val;
        return num.toLocaleString('ko-KR');
    };

    const [showValue, setShowValue] = React.useState(() => formatNumber(value));

    // 외부에서 value 프로프가 변경될 때 표시되는 값 동기화
    React.useEffect(() => {
        setShowValue(formatNumber(value));
    }, [value]);

    const disabledClasses = disabled || readOnly
        ? 'opacity-50 cursor-not-allowed'
        : '';

    const combinedClasses = `
        ${baseClasses}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 숫자와 콤마만 허용
        const inputValue:string = e.target.value.replace(/[^\d,]/g, '');
        // 콤마 제거
        const numericValue:string = inputValue.replace(/,/g, '');

        // 빈 문자열 체크
        if (!numericValue) {
            onChange(0);
            setShowValue(0)
            return;
        }

        // 숫자로 변환하고 포맷팅
        const formatted = Number(numericValue).toLocaleString('ko-KR');
        setShowValue(formatted)
        onChange(Number(numericValue));

        return;
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
                type="text"
                value={showValue}
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

export default CInputCurrency;

