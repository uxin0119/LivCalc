import React, { useState, useEffect } from "react";
import CButton from "@/app/common/ui/CButton";
import CalcItem from "@/app/livingcalculator/CalcItem";
import CalcData from "@/app/livingcalculator/CalcData";
import SortableList from "@/app/common/components/SortableList";
import useCalcStore from './store';
import { TokenStyles } from '@/app/common/tokens/TokenStyles';
import { ExchangeService } from './exchangeService';

interface ItemSectionProps {
    category: string;
    title: string;
    placeholder: string;
}

const ItemSection: React.FC<ItemSectionProps> = ({ category, title, placeholder }) => {
    const { items, addItem, reorderItemsInCategory } = useCalcStore();

    const safeItems: CalcData[] = Array.isArray(items) ? items : [];
    const categoryItems: CalcData[] = safeItems.filter(item => item && item.category === category);

    const [sectionTotal, setSectionTotal] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        // 초기값을 localStorage에서 불러오기
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`section-collapsed-${category}`);
            return saved === 'true';
        }
        return false;
    });

    // 접기 상태 변경 시 localStorage에 저장
    const handleToggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem(`section-collapsed-${category}`, String(newState));
    };

    // 환율을 적용한 섹션 합계 계산
    useEffect(() => {
        const calculateSectionTotal = async () => {
            let total = 0;
            for (const item of safeItems) {
                if (item && typeof item === 'object' && item.category === category && item.type !== undefined && item.value !== undefined) {
                    // 비활성화된 아이템은 섹션 합계에서도 제외
                    if (item.isActive === false) continue;
                    // 원화로 환산
                    const krwValue = await ExchangeService.convertToKRW(item.value, item.currency || 'KRW');
                    const amount = item.type === "plus" ? krwValue : -krwValue;
                    total += amount;
                }
            }
            setSectionTotal(Math.round(total));
        };
        calculateSectionTotal();
    }, [safeItems, category]);

    const handleDragEnd = (activeId: string, overId: string) => {
        reorderItemsInCategory(category, activeId, overId);
    };

    // 스케줄 알림 계산 (오늘만)
    const getScheduleNotifications = () => {
        const today = new Date().getDate();
        const notifications: { type: 'activation' | 'deactivation' | 'modification'; count: number }[] = [];

        let activationCount = 0;
        let deactivationCount = 0;
        let modificationCount = 0;

        categoryItems.forEach(item => {
            if (item.activationDay === today) activationCount++;
            if (item.deactivationDay === today) deactivationCount++;
            if (item.modificationDay === today) modificationCount++;
        });

        if (activationCount > 0) notifications.push({ type: 'activation', count: activationCount });
        if (deactivationCount > 0) notifications.push({ type: 'deactivation', count: deactivationCount });
        if (modificationCount > 0) notifications.push({ type: 'modification', count: modificationCount });

        return notifications;
    };

    const notifications = getScheduleNotifications();

    return (
        <div className="mt-6">
            {/* 섹션 헤더 */}
            <div
                className="flex justify-between items-center gap-4 mb-4 cursor-pointer select-none"
                onClick={handleToggleCollapse}
            >
                <div className="flex items-center gap-2">
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <h2 className={TokenStyles.livingCalculator.sectionTitle}>
                        {title}
                    </h2>
                    {isCollapsed && (
                        <span className="text-sm text-gray-500">({categoryItems.length})</span>
                    )}
                    {/* 스케줄 알림 배지 (오늘) */}
                    {notifications.length > 0 && (
                        <div className="flex items-center gap-1">
                            {notifications.map((notif) => (
                                <span
                                    key={notif.type}
                                    className={`text-xs px-1.5 py-0.5 rounded-full font-medium animate-pulse ${
                                        notif.type === 'activation'
                                            ? 'bg-green-500 text-white'
                                            : notif.type === 'deactivation'
                                                ? 'bg-red-500 text-white'
                                                : 'bg-purple-500 text-white'
                                    }`}
                                    title={
                                        notif.type === 'activation'
                                            ? `오늘 ${notif.count}개 항목 활성화`
                                            : notif.type === 'deactivation'
                                                ? `오늘 ${notif.count}개 항목 종료`
                                                : `오늘 ${notif.count}개 항목 수정 권고`
                                    }
                                >
                                    {notif.type === 'activation' ? '▲' : notif.type === 'deactivation' ? '▼' : '✎'}
                                    {notif.count}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className={sectionTotal >= 0 ? TokenStyles.livingCalculator.sectionTotal.positive : TokenStyles.livingCalculator.sectionTotal.negative}>
                    {sectionTotal.toLocaleString()}원
                </div>
            </div>

            {/* 접기/펼치기 영역 */}
            <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[5000px] opacity-100'}`}>
                {/* 아이템 목록 */}
                <SortableList
                    items={categoryItems}
                    onDragEnd={handleDragEnd}
                    strategy="vertical"
                    className="space-y-0"
                >
                    {categoryItems.map((item) => (
                        <CalcItem
                            key={item.id}
                            id={item.id}
                            item={item}
                            placeholder={placeholder}
                        />
                    ))}
                </SortableList>

                {/* 항목 추가 버튼 */}
                <div className={TokenStyles.livingCalculator.addButtonArea.container}>
                    <div className={TokenStyles.livingCalculator.addButtonArea.label}>항목 추가</div>
                    <div className={TokenStyles.livingCalculator.addButtonArea.buttonContainer}>
                        <CButton
                            onClick={() => addItem(category, "plus")}
                            className={TokenStyles.livingCalculator.button.income}
                        >
                            ✚ 수입
                        </CButton>
                        <CButton
                            onClick={() => addItem(category, "minus")}
                            className={TokenStyles.livingCalculator.button.expense}
                        >
                            − 지출
                        </CButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

ItemSection.displayName = 'DraggableItemSection';
export default ItemSection;
