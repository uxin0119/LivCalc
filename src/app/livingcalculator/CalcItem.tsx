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
 * 월간 자동화 타임라인 바 컴포넌트
 */
const MonthTimeline = ({ activationDay, deactivationDay, isActive }: { activationDay?: number; deactivationDay?: number; isActive?: boolean }) => {
    if (!activationDay && !deactivationDay) return null;

    const today = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    const getBarColor = (day: number) => {
        if (activationDay && deactivationDay) {
            if (activationDay < deactivationDay) {
                // 예: 5일 활성화 ~ 20일 비활성화 → 5~19일 활성
                return day >= activationDay && day < deactivationDay ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600';
            } else if (activationDay > deactivationDay) {
                // 예: 20일 활성화 ~ 5일 비활성화 → 20~31, 1~4일 활성 (wrap)
                return day >= activationDay || day < deactivationDay ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600';
            } else {
                // 같은 날: 활성화 후 바로 비활성화 → 사실상 비활성
                return 'bg-gray-300 dark:bg-gray-600';
            }
        } else if (activationDay) {
            // 활성화만 설정: 해당 일에 활성화
            return day === activationDay ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700';
        } else if (deactivationDay) {
            // 비활성화만 설정: 해당 일에 비활성화
            return day === deactivationDay ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700';
        }
        return 'bg-gray-200 dark:bg-gray-700';
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1.5 h-5">
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                    <div
                        key={day}
                        className={`flex-1 rounded-sm transition-all duration-200 ${getBarColor(day)} ${
                            day === today ? 'ring-2 ring-blue-400 ring-offset-1 dark:ring-offset-gray-800 h-5' : 'h-3'
                        } ${day === activationDay ? 'ring-1 ring-green-400' : ''} ${day === deactivationDay ? 'ring-1 ring-red-400' : ''}`}
                        title={`${day}일${day === today ? ' (오늘)' : ''}${day === activationDay ? ' - 활성화' : ''}${day === deactivationDay ? ' - 비활성화' : ''}`}
                    />
                ))}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
                <span>1일</span>
                <span>{today}일 (오늘)</span>
                <span>{daysInMonth}일</span>
            </div>
        </div>
    );
};

/**
 * 월간 자동화 상태 요약 컴포넌트
 */
const ScheduleStatusSummary = ({ activationDay, deactivationDay, isActive }: { activationDay?: number; deactivationDay?: number; isActive?: boolean }) => {
    if (!activationDay && !deactivationDay) return null;

    const today = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    const getDaysUntil = (targetDay: number) => {
        if (targetDay > today) return targetDay - today;
        return daysInMonth - today + targetDay; // 다음 달로 넘어감
    };

    // 충돌 경고
    if (activationDay && deactivationDay && activationDay === deactivationDay) {
        return (
            <div className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    활성화일과 비활성화일이 같습니다. 같은 날 활성화 후 바로 비활성화됩니다.
                </span>
            </div>
        );
    }

    const lines: { icon: string; text: string; color: string }[] = [];

    if (activationDay) {
        const daysUntil = getDaysUntil(activationDay);
        const isToday = activationDay === today;
        lines.push({
            icon: '▲',
            text: isToday ? '오늘 자동 활성화됨' : `매월 ${activationDay}일 활성화 (${daysUntil}일 후)`,
            color: isToday ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-green-600 dark:text-green-400',
        });
    }

    if (deactivationDay) {
        const daysUntil = getDaysUntil(deactivationDay);
        const isToday = deactivationDay === today;
        lines.push({
            icon: '▼',
            text: isToday ? '오늘 자동 비활성화됨' : `매월 ${deactivationDay}일 비활성화 (${daysUntil}일 후)`,
            color: isToday ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-red-600 dark:text-red-400',
        });
    }

    // 활성 기간 설명
    if (activationDay && deactivationDay && activationDay !== deactivationDay) {
        if (activationDay < deactivationDay) {
            lines.push({
                icon: '◈',
                text: `활성 기간: 매월 ${activationDay}일 ~ ${deactivationDay}일`,
                color: 'text-gray-500 dark:text-gray-400',
            });
        } else {
            lines.push({
                icon: '◈',
                text: `활성 기간: 매월 ${activationDay}일 ~ 다음달 ${deactivationDay}일`,
                color: 'text-gray-500 dark:text-gray-400',
            });
        }
    }

    return (
        <div className="p-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 mb-1.5">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    현재: {isActive ? '활성' : '비활성'}
                </span>
            </div>
            {lines.map((line, i) => (
                <div key={i} className={`flex items-center gap-1.5 text-xs ${line.color}`}>
                    <span className="w-3 text-center">{line.icon}</span>
                    <span>{line.text}</span>
                </div>
            ))}
        </div>
    );
};

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
            {/* 항목명 및 금액 */}
            <div className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <h2 className={`${TokenStyles.modal.itemTitle} flex-1 truncate`}>
                        {item.name || "이름 없는 항목"}
                    </h2>
                    <div
                        className={`relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 flex-shrink-0 ${
                            item.isActive ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        onClick={() => onUpdateField('isActive', !item.isActive)}
                        title={item.isActive ? '활성화됨 - 클릭하여 비활성화' : '비활성화됨 - 클릭하여 활성화'}
                    >
                        <div
                            className={`h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                                item.isActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onUpdateField('type', item.type === 'plus' ? 'minus' : 'plus')}
                        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg transition-colors ${item.type === 'plus' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                        title="클릭하여 수입/지출 전환"
                    >
                        {item.type === 'plus' ? '+' : '−'}
                    </button>
                    <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium z-10">
                            {item.currency === 'USD' ? '$' : item.currency === 'JPY' ? '¥' : '₩'}
                        </span>
                        <CInputCurrency
                            value={item.value}
                            onChange={(value) => onUpdateField('value', Number(value))}
                            placeholder="금액 입력"
                            min={0}
                            className="w-full text-right text-lg font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg pl-8"
                            selectOnFocus={true}
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                    * +/- 버튼: 수입/지출 전환 | 토글: {item.isActive ? '활성화됨' : '비활성화됨'}
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
                                        selectOnFocus={true}
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
                                        selectOnFocus={true}
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

                    {/* 타임라인 시각화 & 상태 요약 */}
                    {(item.activationDay || item.deactivationDay) && (
                        <>
                            <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                            <MonthTimeline activationDay={item.activationDay} deactivationDay={item.deactivationDay} isActive={item.isActive} />
                            <ScheduleStatusSummary activationDay={item.activationDay} deactivationDay={item.deactivationDay} isActive={item.isActive} />
                        </>
                    )}

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
                                        selectOnFocus={true}
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

            {/* 할부 설정 */}
            <div>
                <h3 className={TokenStyles.modal.sectionTitle}>할부 설정</h3>
                <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                                할부 결제
                            </span>
                            <div
                                className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ${
                                    item.isInstallment ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                                onClick={() => {
                                    const newVal = !item.isInstallment;
                                    onUpdateField('isInstallment', newVal);
                                    if (!newVal) {
                                        onUpdateField('installmentStartMonth', undefined);
                                        onUpdateField('installmentEndMonth', undefined);
                                    } else if (!item.installmentStartMonth) {
                                        const now = new Date();
                                        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                                        onUpdateField('installmentStartMonth', currentMonth);
                                    }
                                }}
                            >
                                <div
                                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                                        item.isInstallment ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </div>
                        </div>
                        {item.isInstallment && (
                            <div className="animate-fadeIn pl-2 border-l-2 border-blue-500 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">시작월</span>
                                    <input
                                        type="month"
                                        value={item.installmentStartMonth || ''}
                                        onChange={(e) => onUpdateField('installmentStartMonth', e.target.value)}
                                        className={TokenStyles.common.input.base + " flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">종료월</span>
                                    <input
                                        type="month"
                                        value={item.installmentEndMonth || ''}
                                        onChange={(e) => onUpdateField('installmentEndMonth', e.target.value)}
                                        min={item.installmentStartMonth || ''}
                                        className={TokenStyles.common.input.base + " flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"}
                                    />
                                </div>
                                {item.installmentStartMonth && item.installmentEndMonth && (() => {
                                    const [sy, sm] = item.installmentStartMonth.split('-').map(Number);
                                    const [ey, em] = item.installmentEndMonth.split('-').map(Number);
                                    const totalMonths = (ey - sy) * 12 + (em - sm) + 1;
                                    const now = new Date();
                                    const currentYM = now.getFullYear() * 12 + now.getMonth();
                                    const startYM = sy * 12 + (sm - 1);
                                    const endYM = ey * 12 + (em - 1);
                                    const paidMonths = Math.max(0, Math.min(currentYM - startYM + 1, totalMonths));
                                    const remainingMonths = Math.max(0, endYM - currentYM);
                                    const isCompleted = currentYM > endYM;
                                    return (
                                        <div className={`text-xs p-2 rounded-lg ${isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                                            {isCompleted ? (
                                                <span>할부 완료 (총 {totalMonths}개월)</span>
                                            ) : (
                                                <span>총 {totalMonths}개월 중 {paidMonths}개월 납부 / 잔여 {remainingMonths}개월</span>
                                            )}
                                        </div>
                                    );
                                })()}
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    * 할부 기간을 설정하면 아이템에 잔여 개월이 표시됩니다.
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
                <InstallmentIndicator item={item} />
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
 * 할부 잔여 정보 인디케이터
 */
const InstallmentIndicator = ({ item }: { item: CalcData }) => {
    if (!item.isInstallment || !item.installmentStartMonth || !item.installmentEndMonth) return null;

    const [sy, sm] = item.installmentStartMonth.split('-').map(Number);
    const [ey, em] = item.installmentEndMonth.split('-').map(Number);
    const totalMonths = (ey - sy) * 12 + (em - sm) + 1;
    const now = new Date();
    const currentYM = now.getFullYear() * 12 + now.getMonth();
    const endYM = ey * 12 + (em - 1);
    const remainingMonths = Math.max(0, endYM - currentYM);
    const isCompleted = currentYM > endYM;

    if (isCompleted) {
        return (
            <span className="text-[10px] sm:text-xs bg-green-900/60 text-green-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                할부완료
            </span>
        );
    }

    return (
        <span className="text-[10px] sm:text-xs bg-blue-900/60 text-blue-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">
            할부 {remainingMonths}/{totalMonths}개월
        </span>
    );
};

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
                <div className="flex items-center gap-2">
                    <CInput
                        type="text"
                        value={item.name}
                        onChange={onNameChange}
                        placeholder="항목명 입력"
                        className={TokenStyles.livingCalculator.input.text + " flex-1"}
                        disabled={isDragging}
                    />
                    <InstallmentIndicator item={item} />
                </div>
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
