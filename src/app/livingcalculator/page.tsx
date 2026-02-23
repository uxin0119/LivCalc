"use client"
import React, { useEffect, useState, useMemo, useRef } from "react";
import ItemSection from "./ItemSection";
import TotalArea from "./TotalArea";
import Modal from "@/app/common/components/Modal";
import useCalcStore from './store';
import { TokenStyles } from '@/app/common/tokens/TokenStyles';
import FloatingMenu from '@/app/common/components/FloatingMenu';
import CategoryManagementModal from './CategoryManagementModal';
import { useSession } from 'next-auth/react';

type SyncStatus = 'synced' | 'saving' | 'error' | 'loading';

export default function LivingCalculatorPage() {
    const { items, categories, loadFirstLivingData, checkAndApplyScheduling, setItems, setCategories, isInitialLoad, dailyAvailable, monthTotal } = useCalcStore();
    const { data: session, status } = useSession();
    const [isItemDetailOpen, setIsItemDetailOpen] = useState(false);
    const [isCategoryManagementOpen, setIsCategoryManagementOpen] = useState(false);
    
    // 동기화 상태 관리
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('loading');
    const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 정렬된 카테고리
    const sortedCategories = useMemo(() => {
        return [...categories].sort((a, b) => a.order - b.order);
    }, [categories]);

    // 1. 초기 데이터 로드 (로컬 + 서버)
    useEffect(() => {
        const initData = async () => {
            // 먼저 로컬/URL 데이터 로드
            loadFirstLivingData();

            // 로그인 상태라면 서버 데이터 조용히 로드 (Auto-Load)
            if (status === 'authenticated') {
                try {
                    setSyncStatus('loading');
                    const response = await fetch('/api/calculator/load');
                    const result = await response.json();

                    if (response.ok && result.data) {
                        // 서버 데이터가 있으면 덮어쓰기
                        setItems(result.data);
                        if (result.categories && Array.isArray(result.categories) && result.categories.length > 0) {
                            setCategories(result.categories);
                        }
                        setSyncStatus('synced');
                        setLastSavedTime(new Date());
                    } else {
                        // 데이터가 없으면 '동기화됨'으로 간주 (새로운 시작)
                        setSyncStatus('synced');
                    }
                } catch (error) {
                    console.error('Auto-load failed:', error);
                    // 실패해도 사용자에게 방해되지 않도록 조용히 처리하거나 에러 표시
                    setSyncStatus('error');
                }
            } else {
                setSyncStatus('synced'); // 비로그인 상태면 로컬만 쓰므로 synced로 간주
            }
        };

        initData();
    }, [status, loadFirstLivingData, setItems, setCategories]);

    // 2. 자동 저장 (Auto-Save with Debounce)
    useEffect(() => {
        // 초기 로드 중이거나 로그인이 안 되어 있으면 저장하지 않음
        if (isInitialLoad || status !== 'authenticated') return;

        // 변경 사항이 생기면 '저장 중...' 상태로 변경
        setSyncStatus('saving');

        // 기존 타이머 취소
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        // 2초 후 저장 실행
        autoSaveTimerRef.current = setTimeout(async () => {
            try {
                // 클라이언트의 현재 날짜 (시간대 문제 방지)
                const today = new Date();
                const clientDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

                const response = await fetch('/api/calculator/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: items,
                        categories: categories,
                        summary: {
                            dailyAvailable,
                            monthTotal
                        },
                        clientDate
                    }),
                });

                if (!response.ok) throw new Error('Auto-save failed');

                setSyncStatus('synced');
                setLastSavedTime(new Date());
            } catch (error) {
                console.error('Auto-save error:', error);
                setSyncStatus('error');
            }
        }, 2000);

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [items, categories, status, isInitialLoad, dailyAvailable, monthTotal]);

    // 3. 스케줄링 체크
    useEffect(() => {
        if (items.length > 0) {
            checkAndApplyScheduling();
        }

        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const msUntilTomorrow = tomorrow.getTime() - now.getTime();

        const timeoutId = setTimeout(() => {
            checkAndApplyScheduling();
            const intervalId = setInterval(() => {
                checkAndApplyScheduling();
            }, 24 * 60 * 60 * 1000);
            return () => clearInterval(intervalId);
        }, msUntilTomorrow);

        return () => clearTimeout(timeoutId);
    }, [items.length, checkAndApplyScheduling]);

    // 상태 아이콘 렌더링
    const renderSyncStatus = () => {
        if (status !== 'authenticated') return null;

        const containerClass = "fixed bottom-3 right-16 sm:bottom-8 sm:right-24 z-40 bg-gray-900/80 backdrop-blur px-3 py-1.5 rounded-full shadow-lg border border-gray-700 transition-all duration-300";

        switch (syncStatus) {
            case 'saving':
                return (
                    <div className={containerClass}>
                        <div className="flex items-center text-gray-200 text-xs gap-2">
                            <svg className="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>저장 중...</span>
                        </div>
                    </div>
                );
            case 'synced':
                return (
                    <div className={`${containerClass} opacity-0 pointer-events-none delay-1000`}> 
                        {/* 1초 후 사라지게 설정 (CSS transition 활용) - 실제로는 state로 제어하거나 그냥 둬도 됨. 
                            여기서는 항상 보이면 거슬리므로 저장 직후에만 잠깐 보이거나, 
                            또는 작게 체크 표시만 유지하는 것이 좋음.
                            요청 사항은 "위치 이동"이므로 일단 보여줌. 
                        */}
                        <div className="flex items-center text-green-400 text-xs gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>저장됨</span>
                        </div>
                    </div>
                );
            case 'error':
                return (
                    <div className={containerClass}>
                        <div className="flex items-center text-red-400 text-xs gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>저장 실패</span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-900">
                <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-2xl">
                    {/* 메인 헤더 */}
                    <div className="text-center mb-6 sm:mb-8 relative">
                        <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                            <h1 className={`${TokenStyles.livingCalculator.title}`}>생활비 계산기</h1>
                        </div>
                        <p className={`${TokenStyles.livingCalculator.subtitle} px-4`}>월간 수입과 지출을 관리하고 일일 사용 가능 금액을 확인하세요</p>
                    </div>

                    {/* 메인 컨텐츠 */}
                    <div className={`${TokenStyles.livingCalculator.container} p-4 sm:p-8`}>
                        {sortedCategories.map((category) => (
                            <ItemSection
                                key={category.id}
                                category={category.id}
                                title={category.name}
                                placeholder={"금액"}
                            />
                        ))}
                        <TotalArea />
                    </div>
                </div>
            </div>

            {/* 상태 표시기 (플로팅) */}
            {renderSyncStatus()}

            {/* 플로팅 메뉴 */}
            <FloatingMenu
                onManageCategories={() => setIsCategoryManagementOpen(true)}
            />

            {/* 섹션 관리 모달 */}
            <CategoryManagementModal
                isOpen={isCategoryManagementOpen}
                onClose={() => setIsCategoryManagementOpen(false)}
            />

            <Modal
                isOpen={isItemDetailOpen}
                onClose={() => { setIsItemDetailOpen(false) }}
                title={"수정"}
            >
                수정
            </Modal>
        </>
    );
}
