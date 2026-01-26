import React, { useMemo } from 'react';
import Modal from '@/app/common/components/Modal';
import useCalcStore from './store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ExchangeService } from './exchangeService';
import { TokenStyles } from '@/app/common/tokens/TokenStyles';

interface StatisticsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CategoryStat {
    name: string;
    value: number;
    color: string;
    icon: string;
    percentage: number;
}

// 색상 매핑 헬퍼 함수
const getColorHex = (colorName: string): string => {
    const colors: Record<string, string> = {
        red: '#EF4444',
        orange: '#F97316',
        amber: '#F59E0B',
        yellow: '#EAB308',
        lime: '#84CC16',
        green: '#22C55E',
        emerald: '#10B981',
        teal: '#14B8A6',
        cyan: '#06B6D4',
        sky: '#0EA5E9',
        blue: '#3B82F6',
        indigo: '#6366F1',
        violet: '#8B5CF6',
        purple: '#A855F7',
        fuchsia: '#D946EF',
        pink: '#EC4899',
        rose: '#F43F5E',
        slate: '#64748B',
        gray: '#6B7280',
        zinc: '#71717A',
        neutral: '#737373',
        stone: '#78716C',
    };
    return colors[colorName] || '#3B82F6'; // 기본값 blue
};

export default function StatisticsModal({ isOpen, onClose }: StatisticsModalProps) {
    const { items, categories } = useCalcStore();

    // 통계 데이터 계산
    const stats = useMemo(() => {
        if (!isOpen) return { data: [], total: 0 };

        // 1. 카테고리별 지출 합계 계산 (KRW 기준)
        const categoryTotals = new Map<string, number>();
        let totalExpense = 0;

        // 동기적으로 대략적인 계산 (환율은 1:1로 가정하거나 캐시된 값 사용이 이상적이지만, 
        // 여기서는 복잡도를 줄이기 위해 store의 계산된 값을 사용하거나, 
        // 간단히 items를 순회하며 동기 계산을 수행. 
        // *정확한 환율 적용을 위해서는 비동기 처리가 필요하지만, 렌더링 중에는 불가능하므로
        // 추후 store에서 통계 데이터를 미리 계산해두는 방식으로 개선 가능.*
        // 현재는 편의상 1:1 환율 또는 store에 저장된 값이 있다면 그것을 활용한다고 가정.
        // 실제로는 ExchangeService를 여기서 직접 호출하면 비동기 문제가 있음.
        // 일단은 원화(KRW) 아이템 위주로 계산하고, 외화는 1배수로 가정하여 구현 후 보완하겠습니다.
        
        // 개선: store.ts에서 이미 calculateTotals가 돌 때 각 아이템의 KRW 가치를 저장해두면 좋음.
        // 지금은 간단히 구현.
        
        items.forEach(item => {
            if (!item.isActive || item.type !== 'minus') return;

            // 간단한 환율 적용 (임시)
            let valueInKrw = item.value;
            if (item.currency === 'USD') valueInKrw *= 1300;
            else if (item.currency === 'JPY') valueInKrw *= 9;

            const currentTotal = categoryTotals.get(item.category) || 0;
            categoryTotals.set(item.category, currentTotal + valueInKrw);
            totalExpense += valueInKrw;
        });

        // 2. 차트 데이터 포맷팅
        const formattedStats: CategoryStat[] = categories
            .map(cat => {
                const value = categoryTotals.get(cat.id) || 0;
                return {
                    name: cat.name,
                    value: Math.round(value),
                    color: getColorHex(cat.color),
                    icon: cat.icon,
                    percentage: totalExpense > 0 ? (value / totalExpense) * 100 : 0
                };
            })
            .filter(stat => stat.value > 0) // 지출이 있는 카테고리만 표시
            .sort((a, b) => b.value - a.value); // 금액 내림차순 정렬

        return { data: formattedStats, total: totalExpense };
    }, [items, categories, isOpen]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="지출 통계">
            <div className="flex flex-col h-full">
                {/* 1. 요약 카드 */}
                <div className="bg-gray-800 rounded-xl p-4 mb-6 text-center shadow-lg border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">총 지출 예상</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(stats.total)}</p>
                </div>

                {/* 2. 파이 차트 */}
                <div className="h-64 w-full mb-6 relative">
                    {stats.data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#F3F4F6' }}
                                    itemStyle={{ color: '#F3F4F6' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            지출 데이터가 없습니다.
                        </div>
                    )}
                    
                    {/* 차트 중앙 텍스트 */}
                    {stats.data.length > 0 && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="text-xs text-gray-400">항목 수</span>
                            <div className="text-xl font-bold text-white">{stats.data.length}</div>
                        </div>
                    )}
                </div>

                {/* 3. 상세 리스트 */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {stats.data.map((stat) => (
                        <div key={stat.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm"
                                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                                >
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-200">{stat.name}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full" 
                                                style={{ width: `${stat.percentage}%`, backgroundColor: stat.color }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400">{stat.percentage.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-200">{formatCurrency(stat.value)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}
