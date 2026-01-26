"use client"
import React, { useEffect, useState, useMemo } from "react";
import ItemSection from "./ItemSection";
import TotalArea from "./TotalArea";
import Modal from "@/app/common/components/Modal";
import useCalcStore from './store';
import { TokenStyles } from '@/app/common/tokens/TokenStyles';
import FloatingMenu from '@/app/common/components/FloatingMenu';
import CategoryManagementModal from './CategoryManagementModal';
import { copyShareUrlToClipboard } from '@/app/common/utils/DataSharing';
import { useSession } from 'next-auth/react';

export default function LivingCalculatorPage() {
    const { items, categories, loadFirstLivingData, checkAndApplyScheduling, setItems, setCategories } = useCalcStore();
    const { data: session, status } = useSession();
    const [isItemDetailOpen, setIsItemDetailOpen] = useState(false);
    const [isCategoryManagementOpen, setIsCategoryManagementOpen] = useState(false);
    const [showExportSuccess, setShowExportSuccess] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [showLoadSuccess, setShowLoadSuccess] = useState(false);
    const [showError, setShowError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 정렬된 카테고리
    const sortedCategories = useMemo(() => {
        return [...categories].sort((a, b) => a.order - b.order);
    }, [categories]);

    useEffect(() => {
        loadFirstLivingData();
    }, [loadFirstLivingData]);

    // 컴포넌트 마운트 시와 정기적으로 스케줄링 체크
    useEffect(() => {
        // 초기 로딩 후 스케줄링 체크
        if (items.length > 0) {
            checkAndApplyScheduling();
        }

        // 하루에 한 번씩 스케줄링 체크 (자정에 실행되도록)
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const msUntilTomorrow = tomorrow.getTime() - now.getTime();

        const timeoutId = setTimeout(() => {
            checkAndApplyScheduling();

            // 그 이후로는 24시간마다 체크
            const intervalId = setInterval(() => {
                checkAndApplyScheduling();
            }, 24 * 60 * 60 * 1000); // 24시간

            return () => clearInterval(intervalId);
        }, msUntilTomorrow);

        return () => clearTimeout(timeoutId);
    }, [items.length, checkAndApplyScheduling]);

    const handleExport = async () => {
        try {
            await copyShareUrlToClipboard(items, categories);
            setShowExportSuccess(true);
            setTimeout(() => setShowExportSuccess(false), 3000);
        } catch (error) {
            console.error('내보내기 실패:', error);
            alert('내보내기에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleSave = async () => {
        if (status !== 'authenticated') {
            setShowError('로그인이 필요합니다.');
            setTimeout(() => setShowError(''), 3000);
            return;
        }

        if (isSaving) return;

        setIsSaving(true);
        try {
            const response = await fetch('/api/calculator/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: items, categories: categories }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '저장 실패');
            }

            setShowSaveSuccess(true);
            setTimeout(() => setShowSaveSuccess(false), 3000);
        } catch (error) {
            console.error('저장 실패:', error);
            setShowError(error instanceof Error ? error.message : '저장에 실패했습니다.');
            setTimeout(() => setShowError(''), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLoad = async () => {
        if (status !== 'authenticated') {
            setShowError('로그인이 필요합니다.');
            setTimeout(() => setShowError(''), 3000);
            return;
        }

        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/calculator/load');
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '불러오기 실패');
            }

            if (result.data) {
                setItems(result.data);
                if (result.categories && Array.isArray(result.categories) && result.categories.length > 0) {
                    setCategories(result.categories);
                }
                setShowLoadSuccess(true);
                setTimeout(() => setShowLoadSuccess(false), 3000);
            } else {
                setShowError('저장된 데이터가 없습니다.');
                setTimeout(() => setShowError(''), 3000);
            }
        } catch (error) {
            console.error('불러오기 실패:', error);
            setShowError(error instanceof Error ? error.message : '불러오기에 실패했습니다.');
            setTimeout(() => setShowError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-900">
                <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-2xl">
                    {/* 메인 헤더 */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className={`${TokenStyles.livingCalculator.title} mb-2 sm:mb-3`}>생활비 계산기</h1>
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
                                color={category.color}
                                icon={category.icon}
                            />
                        ))}
                        <TotalArea />
                    </div>
                </div>
            </div>

            {/* 플로팅 메뉴 */}
            <FloatingMenu
                onExport={handleExport}
                onSave={status === 'authenticated' ? handleSave : undefined}
                onLoad={status === 'authenticated' ? handleLoad : undefined}
                onManageCategories={() => setIsCategoryManagementOpen(true)}
            />

            {/* 토스트 메시지들 */}
            {showExportSuccess && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        공유 링크가 클립보드에 복사되었습니다!
                    </div>
                </div>
            )}

            {showSaveSuccess && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        DB에 저장되었습니다!
                    </div>
                </div>
            )}

            {showLoadSuccess && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        DB에서 불러왔습니다!
                    </div>
                </div>
            )}

            {showError && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {showError}
                    </div>
                </div>
            )}

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
