"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { TokenStyles } from '@/app/common/tokens/TokenStyles';

interface HistoryLog {
    id: string;
    date: string;
    daily_available: number;
    total_expense: number;
}

export default function HistoryPage() {
    const { status } = useSession();
    const [logs, setLogs] = useState<HistoryLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (status === 'authenticated') {
            fetchHistory();
        }
    }, [status]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/calculator/history');
            const result = await response.json();
            if (result.logs) {
                setLogs(result.logs);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push({ day: null, dateStr: '' });
        }
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({ day: i, dateStr });
        }
        return days;
    };

    const calendarDays = generateCalendarDays();
    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const getLogForDate = (dateStr: string) => logs.find(log => log.date === dateStr);

    if (status === 'unauthenticated') {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
                로그인이 필요한 서비스입니다.
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl py-8 px-4">
            <div className="mb-8">
                <h1 className={`${TokenStyles.livingCalculator.title} mb-2`}>자산 기록 달력</h1>
                <p className="text-gray-400">지난 2개월간의 일일 사용 가능 금액 변화를 확인하세요.</p>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-xl">
                {/* 달력 헤더 */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={prevMonth} className="p-3 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                    </h2>
                    <button onClick={nextMonth} className="p-3 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-2 mb-4 text-center border-b border-gray-800 pb-4">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                        <div key={day} className={`text-sm font-bold uppercase tracking-wider ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-500'}`}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* 날짜 그리드 */}
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((item, index) => {
                        if (!item.day) {
                            return <div key={`empty-${index}`} className="aspect-square bg-transparent" />;
                        }

                        const log = getLogForDate(item.dateStr);
                        const isToday = item.dateStr === new Date().toISOString().split('T')[0];

                        return (
                            <div 
                                key={item.dateStr} 
                                className={`
                                    aspect-square p-2 rounded-xl border flex flex-col justify-between relative group
                                    ${isToday ? 'bg-blue-900/20 border-blue-500 ring-1 ring-blue-500' : 'bg-gray-800/40 border-gray-800 hover:bg-gray-800 hover:border-gray-700'}
                                    transition-all duration-200
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-sm font-medium ${isToday ? 'text-blue-400' : 'text-gray-500'}`}>
                                        {item.day}
                                    </span>
                                </div>
                                
                                {log ? (
                                    <div className="flex flex-col items-end w-full gap-1">
                                        <div className="flex flex-col items-end w-full">
                                            <div className="text-[9px] sm:text-[10px] text-gray-500 font-medium">월 잔액</div>
                                            <div className="text-[10px] sm:text-xs font-medium text-gray-300 truncate w-full text-right">
                                                {formatCurrency(log.total_expense)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end w-full">
                                            <div className="text-[9px] sm:text-[10px] text-gray-500 font-medium">일 가용</div>
                                            <div className="text-[11px] sm:text-sm font-bold text-emerald-400 truncate w-full text-right">
                                                {formatCurrency(log.daily_available)}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-4 flex items-center justify-end opacity-20 mt-auto">
                                        <div className="w-4 h-0.5 bg-gray-600 rounded-full" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        기록 있음
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-700" />
                        기록 없음
                    </div>
                    <span className="ml-4 italic">* 매 저장 시점의 최종 잔액이 기록됩니다.</span>
                </div>
            </div>
        </div>
    );
}
