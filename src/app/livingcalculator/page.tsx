"use client"
import React, { useEffect, useState } from "react";
import ItemSection from "./ItemSection";
import TotalArea from "./TotalArea";
import { DndContext, closestCenter } from '@dnd-kit/core';
import DefaultStyle from "@/app/common/script/DefaultStyle";
import Modal from "@/app/common/components/Modal";
import CSection1 from "@/app/common/ui/CSection1";
import useCalcStore from './store';
import { TokenStyles } from '@/app/common/tokens/TokenStyles';
import FloatingMenu from '@/app/common/components/FloatingMenu';
import { copyShareUrlToClipboard } from '@/app/common/utils/DataSharing';

export default function LivingCalculatorPage() {
    const { items, loadFirstLivingData, handleDragEnd, checkAndApplyScheduling } = useCalcStore();
    const [isItemDetailOpen, setIsItemDetailOpen] = useState(false);
    const [showExportSuccess, setShowExportSuccess] = useState(false);

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
            await copyShareUrlToClipboard(items);
            setShowExportSuccess(true);
            setTimeout(() => setShowExportSuccess(false), 3000);
        } catch (error) {
            console.error('내보내기 실패:', error);
            alert('내보내기에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-2xl">
                    {/* 메인 헤더 */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className={`${TokenStyles.livingCalculator.title} mb-2 sm:mb-3`}>생활비 계산기</h1>
                        <p className={`${TokenStyles.livingCalculator.subtitle} px-4`}>월간 수입과 지출을 관리하고 일일 사용 가능 금액을 확인하세요</p>
                    </div>

                    {/* 메인 컨텐츠 */}
                    <div className={`${TokenStyles.livingCalculator.container} p-4 sm:p-8`}>
                        <ItemSection
                            category={"fixed"}
                            title={"고정 수입/지출"}
                            placeholder={"금액"}
                        />
                        <ItemSection
                            category={"daily"}
                            title={"유동적 수입/지출"}
                            placeholder={"유동적 금액"}
                        />
                        <TotalArea />
                    </div>
                </div>
            </div>

            {/* 플로팅 메뉴 */}
            <FloatingMenu onExport={handleExport} />

            {/* 내보내기 성공 토스트 */}
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

            <Modal
                isOpen={isItemDetailOpen}
                onClose={() => { setIsItemDetailOpen(false) }}
                title={"수정"}
            >
                수정
            </Modal>
        </DndContext>
    );
}
