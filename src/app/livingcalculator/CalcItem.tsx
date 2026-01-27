import React, { useState } from "react";
import CInput from "@/app/common/ui/CInput";
import CButton from "@/app/common/ui/CButton";
import IconGear from "@/app/common/icon/icon_gear";
import CalcData from "@/app/livingcalculator/CalcData";
import IconGrabbable from "@/app/common/icon/icon_grabbable";
import useCalcStore from './store';
import CInputCurrency from "@/app/common/ui/CInputCurrency";
import Icon_x from "@/app/common/icon/icon_x";
import Modal from "@/app/common/components/Modal";
import SortableItem, { SortableItemRenderProps } from "@/app/common/components/SortableItem";
import { TokenStyles } from '@/app/common/tokens/TokenStyles';

/**
 * 드래그 가능한 아이템 인터페이스
 */
interface CalcItemProps {
    id: string;
    item: CalcData;
    placeholder: string;
}

/**
 * 설정 모달 Props
 */
interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: CalcData;
    onUpdateField: <K extends keyof CalcData>(field: K, value: CalcData[K]) => void;
    onRemove: () => void;
}

/**
 * 아이템 설정 모달 컴포넌트
 */
const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    item,
    onUpdateField,
    onRemove,
}) => (
    <Modal isOpen={isOpen} onClose={onClose} title="아이템 설정">
        <div className="space-y-4 sm:space-y-6">
            {/* 항목명 표시 */}
            <div className="text-center p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h2 className={TokenStyles.modal.itemTitle}>
                    {item.name || "이름 없는 항목"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                    현재 설정을 수정할 수 있습니다
                </p>
            </div>

            {/* 활성화/비활성화 설정 */}
            <div>
                <h3 className={TokenStyles.modal.sectionTitle}>아이템 상태</h3>
                <div className="flex items-center justify-between p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex flex-col">
                        <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                            {item.isActive ? '활성화됨' : '비활성화됨'}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {item.isActive ? '계산에 포함됩니다' : '계산에서 제외됩니다'}
                        </span>
                    </div>
                    <div
                        className={`relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ${
                            item.isActive ? 'bg-gray-900' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        onClick={() => onUpdateField('isActive', !item.isActive)}
                    >
                        <div
                            className={`h-6 w-6 rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                                item.isActive ? 'translate-x-6' : 'translate-x-0'
                            }`}
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                    * 스위치를 클릭하여 상태를 변경할 수 있습니다
                </p>
            </div>

            {/* 수입/지출 설정 */}
            <div>
                <h3 className={TokenStyles.modal.sectionTitle}>수입/지출 설정</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <CButton
                        onClick={() => onUpdateField('type', 'plus')}
                        className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl border-2 font-medium transition-all duration-200 text-sm sm:text-base ${
                            item.type === 'plus'
                                ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    >
                        ✚ 수입으로 설정
                    </CButton>
                    <CButton
                        onClick={() => onUpdateField('type', 'minus')}
                        className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl border-2 font-medium transition-all duration-200 text-sm sm:text-base ${
                            item.type === 'minus'
                                ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    >
                        − 지출로 설정
                    </CButton>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    현재: {item.type === 'plus' ? '수입' : '지출'}
                </p>
            </div>

            {/* 화폐 단위 설정 */}
            <div>
                <h3 className={TokenStyles.modal.sectionTitle}>화폐 단위 설정</h3>
                <div className="flex gap-2">
                    {(['KRW', 'USD', 'JPY'] as const).map((currency) => (
                        <button
                            key={currency}
                            onClick={() => onUpdateField('currency', currency)}
                            className={`flex-1 py-2 sm:py-3 rounded-xl border-2 font-medium transition-all duration-200 text-sm sm:text-base ${
                                (item.currency || 'KRW') === currency
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                    : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            {currency}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    * {item.currency === 'USD' ? '달러' : item.currency === 'JPY' ? '엔화' : '원화'}로 계산되며, 총액에는 환율이 적용되어 합산됩니다.
                </p>
            </div>

            {/* 유효 기간 설정 */}
            <div>
                <h3 className={TokenStyles.modal.sectionTitle}>월간 자동화 설정</h3>
                <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-4">
                    {/* 자동 활성화 */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                                자동 활성화 (매월)
                            </span>
                            <div
                                className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ${
                                    item.activationDay ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                                onClick={() => onUpdateField('activationDay', item.activationDay ? undefined : 1)}
                            >
                                <div
                                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                                        item.activationDay ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </div>
                        </div>
                        {item.activationDay && (
                            <div className="animate-fadeIn pl-2 border-l-2 border-green-500">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">매월</span>
                                    <CInput
                                        type="number"
                                        value={item.activationDay}
                                        onChange={(val) => onUpdateField('activationDay', Number(val))}
                                        min={1}
                                        max={31}
                                        className={TokenStyles.common.input.base + " w-20 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">일에 활성화</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    * 해당 일자가 되면 자동으로 항목이 켜집니다.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                    {/* 자동 비활성화 */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                                자동 비활성화 (매월)
                            </span>
                            <div
                                className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ${
                                    item.deactivationDay ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                                onClick={() => onUpdateField('deactivationDay', item.deactivationDay ? undefined : 1)}
                            >
                                <div
                                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                                        item.deactivationDay ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </div>
                        </div>
                        {item.deactivationDay && (
                            <div className="animate-fadeIn pl-2 border-l-2 border-red-500">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">매월</span>
                                    <CInput
                                        type="number"
                                        value={item.deactivationDay}
                                        onChange={(val) => onUpdateField('deactivationDay', Number(val))}
                                        min={1}
                                        max={31}
                                        className={TokenStyles.common.input.base + " w-20 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">일에 종료</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    * 해당 일자가 되면 자동으로 항목이 꺼집니다.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                    {/* 수정 권고 알림 */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                                수정 권고 알림 (매월)
                            </span>
                            <div
                                className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ${
                                    item.modificationDay ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                                onClick={() => onUpdateField('modificationDay', item.modificationDay ? undefined : 1)}
                            >
                                <div
                                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                                        item.modificationDay ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </div>
                        </div>
                        {item.modificationDay && (
                            <div className="animate-fadeIn pl-2 border-l-2 border-purple-500">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">매월</span>
                                    <CInput
                                        type="number"
                                        value={item.modificationDay}
                                        onChange={(val) => onUpdateField('modificationDay', Number(val))}
                                        min={1}
                                        max={31}
                                        className={TokenStyles.common.input.base + " w-20 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">일에 확인</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    * 해당 일자가 되면 '금액 확인 필요' 알림이 표시됩니다.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 삭제 */}
            <div>
                <h3 className={TokenStyles.modal.sectionTitle}>위험한 작업</h3>
                <CButton
                    onClick={onRemove}
                    className="w-full py-2 sm:py-3 px-2 sm:px-4 rounded-xl border-2 border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600 text-white font-medium transition-all duration-200 text-sm sm:text-base"
                >
                    <div className="flex items-center justify-center gap-2">
                        <Icon_x className="w-4 h-4" />
                        아이템 삭제
                    </div>
                </CButton>
            </div>
        </div>
    </Modal>
);

/**
 * 드래그 핸들 컴포넌트
 */
interface DragHandleProps {
    dragHandleProps: SortableItemRenderProps['dragHandleProps'];
}

const DragHandle: React.FC<DragHandleProps> = ({ dragHandleProps }) => (
    <div
        {...dragHandleProps.attributes}
        {...dragHandleProps.listeners}
        style={dragHandleProps.style}
        className={`${TokenStyles.livingCalculator.dragHandle.base} ${TokenStyles.livingCalculator.dragHandle.border} ${TokenStyles.livingCalculator.dragHandle.hover}`}
        role="button"
        tabIndex={0}
        aria-label="드래그하여 순서 변경"
    >
        <IconGrabbable />
    </div>
);

/**
 * 설정 버튼 컴포넌트
 */
interface SettingsButtonProps {
    onClick: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => (
    <div
        className={`${TokenStyles.livingCalculator.settingsButton.base} ${TokenStyles.livingCalculator.settingsButton.border} ${TokenStyles.livingCalculator.settingsButton.hover}`}
        onClick={onClick}
    >
        <IconGear />
    </div>
);

/**
 * 비활성화된 아이템 콘텐츠
 */
interface InactiveItemContentProps {
    item: CalcData;
    dragHandleProps: SortableItemRenderProps['dragHandleProps'];
    onSettingsClick: () => void;
}

const InactiveItemContent: React.FC<InactiveItemContentProps> = ({
    item,
    dragHandleProps,
    onSettingsClick,
}) => (
    <div className="flex min-h-12 items-center">
        <DragHandle dragHandleProps={dragHandleProps} />
        <div className="flex-1 px-3 py-2 flex flex-col justify-center overflow-hidden">
            <div className="flex items-center">
                <span className="text-sm text-gray-600 truncate">
                    {item.name || "이름 없는 항목"}
                </span>
                <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                    (비활성화{item.currency && item.currency !== 'KRW' ? ` - ${item.currency}` : ''})
                </span>
            </div>
            {item.activationDay && (
                <div className="text-[10px] text-green-500 flex items-center gap-1 mt-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    매월 {item.activationDay}일 활성화
                </div>
            )}
            {item.deactivationDay && (
                <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    매월 {item.deactivationDay}일 종료
                </div>
            )}
        </div>
        <SettingsButton onClick={onSettingsClick} />
    </div>
);

/**
 * 활성화된 아이템 콘텐츠
 */
interface ActiveItemContentProps {
    item: CalcData;
    placeholder: string;
    isDragging: boolean;
    dragHandleProps: SortableItemRenderProps['dragHandleProps'];
    onNameChange: (value: string) => void;
    onValueChange: (value: number) => void;
    onSettingsClick: () => void;
}


/**
 * 날짜 표시 인디케이터
 */
const ScheduleIndicator = ({ activationDay, deactivationDay, modificationDay }: { activationDay?: number, deactivationDay?: number, modificationDay?: number }) => {
    if (!activationDay && !deactivationDay && !modificationDay) return null;
    
    const today = new Date().getDate();

    // 수정 권고 표시 (가장 높은 우선순위)
    if (modificationDay) {
        const isToday = today === modificationDay;
        const diff = modificationDay - today;
        
        if (isToday) {
            return (
                <div className="text-[10px] sm:text-xs flex items-center gap-1 text-purple-300 font-bold animate-pulse absolute right-2 top-2 bg-purple-900/80 px-2 py-0.5 rounded-full backdrop-blur-sm z-10 border border-purple-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    금액 확인 필요
                </div>
            );
        } else if (diff > 0 && diff <= 3) {
             return (
                <div className="text-[10px] sm:text-xs flex items-center gap-1 text-purple-400 font-medium absolute right-2 top-2 bg-gray-900/50 px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {diff}일 후 확인
                </div>
            );
        }
    }
    
    // 매월 활성화 표시
    if (activationDay) {
        const isToday = today === activationDay;
        const diff = activationDay - today;
        let text = `매월 ${activationDay}일 시작`;
        let colorClass = "text-green-400 font-medium";

        if (isToday) {
            text = "오늘 활성화";
            colorClass = "text-green-300 font-bold animate-pulse";
        } else if (diff > 0 && diff <= 3) {
            text = `${diff}일 후 시작`;
        }

        return (
            <div className={`text-[10px] sm:text-xs flex items-center gap-1 ${colorClass} absolute right-2 top-2 bg-gray-900/50 px-2 py-0.5 rounded-full backdrop-blur-sm z-10`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {text}
            </div>
        );
    }

    // 매월 비활성화 표시
    if (deactivationDay) {
        const isToday = today === deactivationDay;
        const diff = deactivationDay - today;
        let text = `매월 ${deactivationDay}일 종료`;
        let colorClass = "text-gray-400";
        
        if (isToday) {
            text = "오늘 종료";
            colorClass = "text-red-400 font-bold animate-pulse";
        } else if (diff > 0 && diff <= 3) {
            text = `${diff}일 후 종료`;
            colorClass = "text-orange-400 font-medium";
        }

        return (
            <div className={`text-[10px] sm:text-xs flex items-center gap-1 ${colorClass} absolute right-2 top-2 bg-gray-900/50 px-2 py-0.5 rounded-full backdrop-blur-sm z-10`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {text}
            </div>
        );
    }

    return null;
};

import MergeTooltip from './MergeTooltip';

// ... (other imports)

import { ExchangeService } from './exchangeService';

// ...

const ActiveItemContent: React.FC<ActiveItemContentProps> = ({
    item,
    placeholder,
    isDragging,
    dragHandleProps,
    onNameChange,
    onValueChange,
    onSettingsClick,
}) => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    const handleMerge = (amount: number) => {
        const currentVal = item.value || 0;
        // 수입이든 지출이든 입력된 금액만큼 더함 (지출도 절대값으로 관리되므로)
        onValueChange(currentVal + amount);
    };
    
    const symbol = ExchangeService.getCurrencySymbol(item.currency || 'KRW');

    return (
        <div className="flex min-h-20 relative">
            <ScheduleIndicator 
                activationDay={item.activationDay} 
                deactivationDay={item.deactivationDay} 
                modificationDay={item.modificationDay}
            />
            <DragHandle dragHandleProps={dragHandleProps} />
            <div className="flex-1 p-4 space-y-3">
                <CInput
                    type="text"
                    value={item.name}
                    onChange={onNameChange}
                    placeholder="항목명 입력"
                    className={TokenStyles.livingCalculator.input.text}
                    disabled={isDragging}
                />
                <div className="flex items-center gap-2 min-w-0">
                    <div className="flex-shrink-0 relative z-20">
                        <div 
                            className={`${item.type === "plus" ? TokenStyles.livingCalculator.typeIcon.plus : TokenStyles.livingCalculator.typeIcon.minus} cursor-pointer hover:opacity-80 transition-opacity`}
                            onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                            title="클릭하여 금액 합산"
                        >
                            {item.type === "plus" ? "+" : "−"}
                        </div>
                        <MergeTooltip
                            isOpen={isTooltipOpen}
                            onClose={() => setIsTooltipOpen(false)}
                            onConfirm={handleMerge}
                            currentType={item.type}
                        />
                    </div>
                    <div className="flex-1 min-w-0 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium z-10 select-none">
                            {symbol}
                        </span>
                        <CInputCurrency
                            value={item.value}
                            onChange={(value) => onValueChange(Number(value))}
                            placeholder={placeholder}
                            min={0}
                            className={`${TokenStyles.livingCalculator.input.currency} pl-8`}
                            selectOnFocus={true}
                            disabled={isDragging}
                        />
                    </div>
                </div>
            </div>
            <SettingsButton onClick={onSettingsClick} />
        </div>
    );
};

/**
 * 드래그 가능한 아이템 폼 컴포넌트
 */
const CalcItem: React.FC<CalcItemProps> = ({ id, item, placeholder }) => {
    const { updateItemField, removeItem } = useCalcStore();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const isDeactivated = !item.isActive;

    const getCardClassName = (isDragging: boolean, isSorting: boolean) => {
        const baseClass = isDeactivated
            ? TokenStyles.livingCalculator.card.inactive
            : TokenStyles.livingCalculator.card.active;

        const dragClass = isDragging
            ? isDeactivated
                ? TokenStyles.livingCalculator.card.inactiveDragging
                : TokenStyles.livingCalculator.card.activeDragging
            : isDeactivated
                ? TokenStyles.livingCalculator.card.inactiveHover
                : TokenStyles.livingCalculator.card.activeHover;

        const transitionClass = isSorting
            ? TokenStyles.transitions.none
            : TokenStyles.transitions.default;

        return `${baseClass} ${dragClass} ${transitionClass}`;
    };

    const handleUpdateField = <K extends keyof CalcData>(field: K, value: CalcData[K]) => {
        updateItemField(item.id, field, value);
    };

    const handleRemove = () => {
        removeItem(item.id);
        setIsSettingsOpen(false);
    };

    return (
        <>
            <SortableItem
                id={id}
                className=""
                draggingClassName=""
            >
                {({ isDragging, isSorting, dragHandleProps }) => (
                    <div className={getCardClassName(isDragging, isSorting)}>
                        {isDeactivated ? (
                            <InactiveItemContent
                                item={item}
                                dragHandleProps={dragHandleProps}
                                onSettingsClick={() => setIsSettingsOpen(true)}
                            />
                        ) : (
                            <ActiveItemContent
                                item={item}
                                placeholder={placeholder}
                                isDragging={isDragging}
                                dragHandleProps={dragHandleProps}
                                onNameChange={(value) => handleUpdateField('name', value)}
                                onValueChange={(value) => handleUpdateField('value', value)}
                                onSettingsClick={() => setIsSettingsOpen(true)}
                            />
                        )}
                    </div>
                )}
            </SortableItem>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                item={item}
                onUpdateField={handleUpdateField}
                onRemove={handleRemove}
            />
        </>
    );
};

export default CalcItem;
