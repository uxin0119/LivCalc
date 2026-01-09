import React, { useState, useEffect } from "react";
import CInput from "@/app/common/ui/CInput";
import CButton from "@/app/common/ui/CButton";
import IconGear from "@/app/common/icon/icon_gear";
import { useSortable } from '@dnd-kit/sortable';
import CalcData from "@/app/livingcalculator/CalcData";
import { CSS } from '@dnd-kit/utilities';
import IconGrabbable from "@/app/common/icon/icon_grabbable";
import useCalcStore from './store';
import CInputCurrency from "@/app/common/ui/CInputCurrency";
import Icon_x from "@/app/common/icon/icon_x";
import Modal from "@/app/common/components/Modal";
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
 * 드래그 가능한 아이템 폼 컴포넌트
 */
const CalcItem: React.FC<CalcItemProps> = ({
    id,
    item, 
    placeholder
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isSorting,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
    };

    const { updateItemField, updateItemFields, removeItem } = useCalcStore();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const getTypeLabel = (typeValue: string): string => {
        return typeValue === "plus" ? "수입(+)" : "지출(-)";
    };

    // 비활성화된 아이템은 작은 크기로 표시
    const isDeactivated = !item.isActive;

    if (isDeactivated) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`${TokenStyles.livingCalculator.card.inactive} ${isDragging ? TokenStyles.livingCalculator.card.inactiveDragging : TokenStyles.livingCalculator.card.inactiveHover} ${isSorting ? TokenStyles.transitions.none : TokenStyles.transitions.default}`}
            >
                <div className="flex min-h-12">
                    {/* 드래그 핸들 - 작은 크기 */}
                    <div
                        {...attributes}
                        {...listeners}
                        className={`${TokenStyles.livingCalculator.dragHandle.base} ${TokenStyles.livingCalculator.dragHandle.border} ${TokenStyles.livingCalculator.dragHandle.hover}`}
                        style={{ 
                            touchAction: 'none',
                            WebkitUserSelect: 'none',
                            userSelect: 'none' 
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label="드래그하여 순서 변경"
                    >
                        <IconGrabbable />
                    </div>

                    {/* 항목명만 표시 - 작은 크기 */}
                    <div className="flex-1 px-3 py-2 flex items-center">
                        <span className="text-sm text-gray-600 truncate">
                            {item.name || "이름 없는 항목"}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">(비활성화)</span>
                    </div>

                    {/* 설정 버튼 - 작은 크기 */}
                    <div
                        className={`${TokenStyles.livingCalculator.settingsButton.base} ${TokenStyles.livingCalculator.settingsButton.border} ${TokenStyles.livingCalculator.settingsButton.hover}`}
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        <IconGear />
                    </div>
                </div>

                {/* 설정 모달 - 모든 설정 옵션 포함 */}
                <Modal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    title="아이템 설정"
                >
                    <div className="space-y-4 sm:space-y-6">
                        {/* 항목명 표시 */}
                        <div className="text-center p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <h2 className={TokenStyles.modal.itemTitle}>
                                {item.name || "이름 없는 항목"}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">현재 설정을 수정할 수 있습니다</p>
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
                                    className={'relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ' + (item.isActive ? 'bg-gray-900' : 'bg-gray-300 dark:bg-gray-600')}
                                    onClick={() => {
                                        updateItemField(item.id, 'isActive', !item.isActive);
                                    }}
                                >
                                    <div
                                        className={'h-6 w-6 rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ' + (item.isActive ? 'translate-x-6' : 'translate-x-0')}
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
                                    onClick={() => {
                                        updateItemField(item.id, 'type', 'plus');
                                    }}
                                    className={'flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl border-2 font-medium transition-all duration-200 text-sm sm:text-base ' + (item.type === 'plus' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600')}
                                >
                                    ✚ 수입으로 설정
                                </CButton>
                                <CButton
                                    onClick={() => {
                                        updateItemField(item.id, 'type', 'minus');
                                    }}
                                    className={'flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl border-2 font-medium transition-all duration-200 text-sm sm:text-base ' + (item.type === 'minus' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600')}
                                >
                                    − 지출로 설정
                                </CButton>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                현재: {item.type === 'plus' ? '수입' : '지출'}
                            </p>
                        </div>

                        {/* 삭제 */}
                        <div>
                            <h3 className={TokenStyles.modal.sectionTitle}>위험한 작업</h3>
                            <CButton
                                onClick={() => {
                                    removeItem(item.id);
                                    setIsSettingsOpen(false);
                                }}
                                className="w-full py-2 sm:py-3 px-2 sm:px-4 rounded-xl border-2 border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600 text-white font-medium transition-all duration-200 text-sm sm:text-base"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Icon_x className="w-4 h-4"/>
                                    아이템 삭제
                                </div>
                            </CButton>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${TokenStyles.livingCalculator.card.active} ${isDragging ? TokenStyles.livingCalculator.card.activeDragging : TokenStyles.livingCalculator.card.activeHover} ${isSorting ? TokenStyles.transitions.none : TokenStyles.transitions.default}`}
        >
            <div className="flex min-h-20">
                {/* 드래그 핸들 - 왼쪽 전체 */}
                <div
                    {...attributes}
                    {...listeners}
                    className={`${TokenStyles.livingCalculator.dragHandle.base} ${TokenStyles.livingCalculator.dragHandle.border} ${TokenStyles.livingCalculator.dragHandle.hover}`}
                    style={{ 
                        touchAction: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none' 
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="드래그하여 순서 변경"
                >
                    <IconGrabbable />
                </div>

                {/* 중앙 컨텐츠 영역 */}
                <div className="flex-1 p-4 space-y-3">
                    {/* 항목명 */}
                    <CInput
                        type="text"
                        value={item.name}
                        onChange={(value) => updateItemField(item.id, 'name', value)}
                        placeholder="항목명 입력"
                        className={TokenStyles.livingCalculator.input.text}
                        disabled={isDragging}
                    />
                    
                    {/* 수입/지출 타입 + 금액 */}
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="flex-shrink-0">
                            <div className={item.type === "plus" ? TokenStyles.livingCalculator.typeIcon.plus : TokenStyles.livingCalculator.typeIcon.minus}>
                                {item.type === "plus" ? "+" : "−"}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <CInputCurrency
                                value={item.value}
                                onChange={(value) => updateItemField(item.id, 'value', Number(value))}
                                placeholder={placeholder}
                                min={0}
                                className={TokenStyles.livingCalculator.input.currency}
                                selectOnFocus={true}
                                disabled={isDragging}
                            />
                        </div>
                    </div>
                </div>

                {/* 설정 버튼 - 오른쪽 전체 */}
                <div
                    className={`${TokenStyles.livingCalculator.settingsButton.base} ${TokenStyles.livingCalculator.settingsButton.border} ${TokenStyles.livingCalculator.settingsButton.hover}`}
                    onClick={() => setIsSettingsOpen(true)}
                >
                    <IconGear />
                </div>
            </div>

            {/* 설정 모달 - 활성화/비활성화 모든 아이템 공통 */}
            <Modal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                title="아이템 설정"
            >
                <div className="space-y-4 sm:space-y-6">
                    {/* 항목명 표시 */}
                    <div className="text-center p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <h2 className={TokenStyles.modal.itemTitle}>
                            {item.name || "이름 없는 항목"}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">현재 설정을 수정할 수 있습니다</p>
                    </div>

                    {/* 활성화/비활성화 설정 */}
                    <div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">아이템 상태</h3>
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
                                className={'relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ' + (item.isActive ? 'bg-gray-900' : 'bg-gray-300 dark:bg-gray-600')}
                                onClick={() => {
                                    updateItemField(item.id, 'isActive', !item.isActive);
                                }}
                            >
                                <div
                                    className={'h-6 w-6 rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ' + (item.isActive ? 'translate-x-6' : 'translate-x-0')}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                            * 스위치를 클릭하여 상태를 변경할 수 있습니다
                        </p>
                    </div>

                    {/* 수입/지출 설정 */}
                    <div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">수입/지출 설정</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <CButton
                                onClick={() => {
                                    updateItemField(item.id, 'type', 'plus');
                                }}
                                className={'flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl border-2 font-medium transition-all duration-200 text-sm sm:text-base ' + (item.type === 'plus' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600')}
                            >
                                ✚ 수입으로 설정
                            </CButton>
                            <CButton
                                onClick={() => {
                                    updateItemField(item.id, 'type', 'minus');
                                }}
                                className={'flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-xl border-2 font-medium transition-all duration-200 text-sm sm:text-base ' + (item.type === 'minus' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600')}
                            >
                                − 지출로 설정
                            </CButton>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                            현재: {item.type === 'plus' ? '수입' : '지출'}
                        </p>
                    </div>

                    {/* 삭제 */}
                    <div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">위험한 작업</h3>
                        <CButton
                            onClick={() => {
                                removeItem(item.id);
                                setIsSettingsOpen(false);
                            }}
                            className="w-full py-2 sm:py-3 px-2 sm:px-4 rounded-xl border-2 border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600 text-white font-medium transition-all duration-200 text-sm sm:text-base"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Icon_x className="w-4 h-4"/>
                                아이템 삭제
                            </div>
                        </CButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default CalcItem;