import React, { useMemo } from "react";
import CButton from "@/app/common/ui/CButton";
import CalcItem from "@/app/livingcalculator/CalcItem";
import CalcData from "@/app/livingcalculator/CalcData";
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DefaultStyle from "@/app/common/script/DefaultStyle";
import CSection2 from "@/app/common/ui/CSection2";
import useCalcStore from './store';
import { TokenStyles } from '@/app/common/tokens/TokenStyles';

interface ItemSectionProps {
    category: "fixed" | "daily";
    title: string;
    placeholder: string;
}

const ItemSection: React.FC<ItemSectionProps> = ({ category, title, placeholder }) => {
    const { items, addItem, updateItemField, monthTotal, fixedTotal } = useCalcStore();

    const safeItems: CalcData[] = Array.isArray(items) ? items : [];
    const categoryItems: CalcData[] = safeItems.filter(item => item && item.category === category);

    const sectionTotal = useMemo(() => {
        let total = 0;
        safeItems.forEach(item => {
            if (item && typeof item === 'object' && item.category === category && item.type !== undefined && item.value !== undefined) {
                const amount = item.type === "plus" ? item.value : -item.value;
                total += amount;
            }
        });
        return total;
    }, [safeItems, category]);

    const categoryItemIds = categoryItems.map(item => item.id);

    return (
        <div className="mt-6">
            {/* 섹션 헤더 */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className={TokenStyles.livingCalculator.sectionTitle}>{title}</h2>
                <div className={sectionTotal >= 0 ? TokenStyles.livingCalculator.sectionTotal.positive : TokenStyles.livingCalculator.sectionTotal.negative}>
                    {sectionTotal.toLocaleString()}원
                </div>
            </div>
            
            {/* 아이템 목록 */}
            <SortableContext items={categoryItemIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-0">
                    {categoryItems.map((item) => (
                        <CalcItem
                            key={item.id}
                            id={item.id}
                            item={item}
                            placeholder={placeholder}
                        />
                    ))}
                </div>
            </SortableContext>
            
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
    );
};

ItemSection.displayName = 'DraggableItemSection';
export default ItemSection;
