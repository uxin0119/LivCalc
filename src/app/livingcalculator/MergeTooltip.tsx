import React, { useState, useEffect, useRef } from 'react';
import CInputCurrency from '@/app/common/ui/CInputCurrency';
import CButton from '@/app/common/ui/CButton';

interface MergeTooltipProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
    currentType: string; // 'plus' | 'minus'
}

const MergeTooltip: React.FC<MergeTooltipProps> = ({ isOpen, onClose, onConfirm, currentType }) => {
    const [amount, setAmount] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setAmount(0);
            // 약간의 지연 후 포커스 (애니메이션 등 고려)
            setTimeout(() => {
                const input = containerRef.current?.querySelector('input');
                if (input) input.focus();
            }, 50);
        }
    }, [isOpen]);

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleConfirm = () => {
        if (amount !== 0) {
            onConfirm(amount);
        }
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleConfirm();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            ref={containerRef}
            className="absolute left-0 top-10 z-50 p-3 bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-48 animate-fadeIn"
            style={{ marginTop: '4px' }}
        >
            <div className="flex flex-col gap-2">
                <div className="text-xs text-gray-400 font-medium">
                    금액 더하기 ({currentType === 'plus' ? '수입' : '지출'})
                </div>
                <CInputCurrency
                    value={amount}
                    onChange={(val) => setAmount(val)}
                    placeholder="0"
                    size="sm"
                    className="bg-gray-900 border-gray-600 text-white"
                    onKeyDown={handleKeyDown}
                />
                <div className="flex gap-2"> 
                    <CButton 
                        size="sm" 
                        variant="primary" 
                        onClick={handleConfirm}
                        className="w-full py-1 text-xs"
                    >
                        합산
                    </CButton>
                </div>
            </div>
            
            {/* 화살표 (Tooltip Arrow) */}
            <div className="absolute -top-1.5 left-4 w-3 h-3 bg-gray-800 border-t border-l border-gray-700 transform rotate-45"></div>
        </div>
    );
};

export default MergeTooltip;
