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
    const [scrollTrigger, setScrollTrigger] = useState<'top' | 'bottom' | null>(null);

    // Memo Modal State
    const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedLog, setSelectedLog] = useState<HistoryLog | undefined>(undefined);
    const [memoContent, setMemoContent] = useState<string>('');
    const [isSavingMemo, setIsSavingMemo] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchHistory();
            fetchMemos();
        }
    }, [status, currentDate]); // currentDate 변경 시에도 메모 다시 조회 (월별)

    // 스크롤 처리 (모바일 월 이동 시)
    useEffect(() => {
        if (scrollTrigger) {
            // DOM 업데이트 후 스크롤을 위해 약간의 지연 (또는 useLayoutEffect)
            // Next.js/React 렌더링 사이클 고려
            const timer = setTimeout(() => {
                if (scrollTrigger === 'top') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (scrollTrigger === 'bottom') {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
                setScrollTrigger(null);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [scrollTrigger, logs]); // logs가 로드된 후 스크롤해야 정확함

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

    // 모바일 전용 네비게이션 핸들러
    const handleMobilePrev = () => {
        prevMonth();
        setScrollTrigger('bottom');
    };

    const handleMobileNext = () => {
        nextMonth();
        setScrollTrigger('top');
    };

    const handleDateClick = (dateStr: string) => {
        setSelectedDate(dateStr);
        setMemoContent(memos[dateStr] || '');
        setSelectedLog(getLogForDate(dateStr));
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

                {/* 요일 헤더 (PC 전용) */}
                <div className="hidden md:grid grid-cols-7 gap-2 mb-4 text-center border-b border-gray-800 pb-4">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                        <div key={day} className={`text-sm font-bold uppercase tracking-wider ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-500'}`}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* 날짜 그리드 / 리스트 */}
                <div className="flex flex-col md:grid md:grid-cols-7 gap-2">
                    {/* 모바일 전용: 이전 달 버튼 (리스트 맨 위) */}
                    <button 
                        onClick={handleMobilePrev}
                        className="md:hidden mb-2 py-4 flex items-center justify-center gap-2 text-gray-400 hover:text-white bg-gray-800/30 border border-gray-800 rounded-xl transition-all active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <span className="text-sm font-medium">이전 달로 이동</span>
                    </button>

                    {calendarDays.map((item, index) => {
                        if (!item.day) {
                            // 빈 날짜는 PC에서만 표시
                            return <div key={`empty-${index}`} className="hidden md:block aspect-square bg-transparent" />;
                        }

                        const log = getLogForDate(item.dateStr);
                        const isToday = item.dateStr === new Date().toISOString().split('T')[0];
                        const hasMemo = !!memos[item.dateStr];
                        
                        const dateObj = new Date(item.dateStr);
                        const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
                        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                        return (
                            <div 
                                key={item.dateStr} 
                                onClick={() => handleDateClick(item.dateStr)}
                                className={`
                                    relative group cursor-pointer rounded-xl border transition-all duration-200
                                    md:aspect-square md:p-2 md:flex md:flex-col md:justify-between
                                    p-4 flex flex-row items-center justify-between
                                    ${isToday ? 'bg-blue-900/20 border-blue-500 ring-1 ring-blue-500' : 'bg-gray-800/40 border-gray-800 hover:bg-gray-800 hover:border-gray-700'}
                                `}
                            >
                                {/* 날짜 표시 */}
                                <div className="flex items-center gap-3 md:items-start md:justify-between md:w-full">
                                    <div className="flex flex-col md:block">
                                        <span className={`text-lg md:text-sm font-bold md:font-medium ${
                                            isToday ? 'text-blue-400' : 
                                            dateObj.getDay() === 0 ? 'text-red-400' :
                                            dateObj.getDay() === 6 ? 'text-blue-400' : 'text-gray-200 md:text-gray-500'
                                        }`}>
                                            {item.day}
                                            <span className="md:hidden text-xs font-normal ml-1 opacity-70">{dayOfWeek}</span>
                                        </span>
                                    </div>
                                    {hasMemo && (
                                        <div className="text-yellow-500 animate-fadeIn" title="메모 있음">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                
                                {/* 데이터 표시 */}
                                {log ? (
                                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1 md:w-full">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-gray-500 font-medium hidden md:block">월 잔액</span>
                                            <span className="text-sm md:text-xs font-medium text-gray-300 md:text-right">
                                                <span className="md:hidden text-xs text-gray-500 mr-1">월</span>
                                                {formatCurrency(log.total_expense)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-gray-500 font-medium hidden md:block">일 가용</span>
                                            <span className="text-sm md:text-[11px] font-bold text-emerald-400 md:text-right">
                                                <span className="md:hidden text-xs text-gray-500 mr-1">일</span>
                                                {formatCurrency(log.daily_available)}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="hidden md:flex h-4 items-center justify-end opacity-20 mt-auto w-full">
                                        <div className="w-4 h-0.5 bg-gray-600 rounded-full" />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* 모바일 전용: 다음 달 버튼 (리스트 맨 아래) */}
                    <button 
                        onClick={handleMobileNext}
                        className="md:hidden mt-2 py-4 flex items-center justify-center gap-2 text-gray-400 hover:text-white bg-gray-800/30 border border-gray-800 rounded-xl transition-all active:scale-95"
                    >
                        <span className="text-sm font-medium">다음 달로 이동</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
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
                title={`${selectedDate} 기록`}
            >
                <div className="space-y-6">
                    {/* 자산 현황 요약 (모달 상단에 표시) */}
                    {selectedLog ? (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex justify-between items-center border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col items-center flex-1 border-r border-gray-200 dark:border-gray-700">
                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">월 잔액</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(selectedLog.total_expense)}
                                </span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">일 가용 금액</span>
                                <span className="text-lg font-bold text-emerald-500">
                                    {formatCurrency(selectedLog.daily_available)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-400 text-sm bg-gray-50 dark:bg-gray-800 rounded-xl">
                            이 날짜의 자산 기록이 없습니다.
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">메모</label>
                        <CTextarea
                            value={memoContent}
                            onChange={setMemoContent}
                            placeholder="이 날의 메모를 입력하세요 (예: 특별 지출 내역, 일기 등)"
                            rows={6}
                            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    
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
