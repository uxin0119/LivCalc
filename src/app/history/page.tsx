"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { TokenStyles } from '@/app/common/tokens/TokenStyles';
import Modal from '@/app/common/components/Modal';
import CButton from '@/app/common/ui/CButton';
import CTextarea from '@/app/common/ui/CTextarea';

interface HistoryLog {
    id: string;
    date: string;
    daily_available: number;
    total_expense: number;
}

interface MemoMap {
    [date: string]: string;
}

export default function HistoryPage() {
    const { status } = useSession();
    const [logs, setLogs] = useState<HistoryLog[]>([]);
    const [memos, setMemos] = useState<MemoMap>({});
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Memo Modal State
    const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [memoContent, setMemoContent] = useState<string>('');
    const [isSavingMemo, setIsSavingMemo] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchHistory();
            fetchMemos();
        }
    }, [status, currentDate]); // currentDate 변경 시에도 메모 다시 조회 (월별)

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

    const fetchMemos = async () => {
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const response = await fetch(`/api/history/memo?year=${year}&month=${month}`);
            const result = await response.json();
            
            if (result.memos) {
                const memoMap: MemoMap = {};
                result.memos.forEach((m: { date: string, content: string }) => {
                    memoMap[m.date] = m.content;
                });
                setMemos(memoMap);
            }
        } catch (error) {
            console.error('Failed to fetch memos:', error);
        }
    };

    const handleDateClick = (dateStr: string) => {
        setSelectedDate(dateStr);
        setMemoContent(memos[dateStr] || '');
        setIsMemoModalOpen(true);
    };

    const handleSaveMemo = async () => {
        if (!selectedDate) return;
        
        setIsSavingMemo(true);
        try {
            const response = await fetch('/api/history/memo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: selectedDate, content: memoContent })
            });

            if (response.ok) {
                // 로컬 상태 업데이트
                setMemos(prev => {
                    const next = { ...prev };
                    if (memoContent.trim()) {
                        next[selectedDate] = memoContent;
                    } else {
                        delete next[selectedDate];
                    }
                    return next;
                });
                setIsMemoModalOpen(false);
            } else {
                alert('메모 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Save memo error:', error);
            alert('오류가 발생했습니다.');
        } finally {
            setIsSavingMemo(false);
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
                        const hasMemo = !!memos[item.dateStr];

                        return (
                            <div 
                                key={item.dateStr} 
                                onClick={() => handleDateClick(item.dateStr)}
                                className={`
                                    aspect-square p-2 rounded-xl border flex flex-col justify-between relative group cursor-pointer
                                    ${isToday ? 'bg-blue-900/20 border-blue-500 ring-1 ring-blue-500' : 'bg-gray-800/40 border-gray-800 hover:bg-gray-800 hover:border-gray-700'}
                                    transition-all duration-200
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-sm font-medium ${isToday ? 'text-blue-400' : 'text-gray-500'}`}>
                                        {item.day}
                                    </span>
                                    {hasMemo && (
                                        <div className="text-yellow-500 animate-fadeIn" title="메모 있음">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                    )}
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
                    <div className="flex items-center gap-1.5 text-yellow-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        메모 있음
                    </div>
                </div>
            </div>

            {/* 메모 작성 모달 */}
            <Modal
                isOpen={isMemoModalOpen}
                onClose={() => setIsMemoModalOpen(false)}
                title={`${selectedDate} 메모`}
            >
                <div className="space-y-4">
                    <CTextarea
                        value={memoContent}
                        onChange={setMemoContent}
                        placeholder="이 날의 메모를 입력하세요 (예: 특별 지출 내역, 일기 등)"
                        rows={6}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <div className="flex justify-end gap-2">
                        <CButton variant="secondary" onClick={() => setIsMemoModalOpen(false)}>
                            취소
                        </CButton>
                        <CButton variant="primary" onClick={handleSaveMemo} disabled={isSavingMemo}>
                            {isSavingMemo ? '저장 중...' : '저장'}
                        </CButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
