"use client";
import React, { useState, useEffect } from 'react';
import { TokenStyles } from '@/app/common/tokens/TokenStyles';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: {
    hasSchedule: boolean;
    activationDate?: string;
    deactivationDate?: string;
  }) => void;
  initialData?: {
    hasSchedule?: boolean;
    activationDate?: string;
    deactivationDate?: string;
  };
}

const SchedulingModal: React.FC<SchedulingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [hasSchedule, setHasSchedule] = useState(initialData?.hasSchedule ?? false);
  const [activationDate, setActivationDate] = useState(
    initialData?.activationDate ? initialData.activationDate.split('T')[0] : ''
  );
  const [deactivationDate, setDeactivationDate] = useState(
    initialData?.deactivationDate ? initialData.deactivationDate.split('T')[0] : ''
  );

  useEffect(() => {
    if (isOpen) {
      setHasSchedule(initialData?.hasSchedule ?? false);
      setActivationDate(
        initialData?.activationDate ? initialData.activationDate.split('T')[0] : ''
      );
      setDeactivationDate(
        initialData?.deactivationDate ? initialData.deactivationDate.split('T')[0] : ''
      );
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    const scheduleData = {
      hasSchedule,
      activationDate: activationDate ? new Date(activationDate).toISOString() : undefined,
      deactivationDate: deactivationDate ? new Date(deactivationDate).toISOString() : undefined,
    };

    onSave(scheduleData);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={handleClose}
      />

      {/* 모달 */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">스케줄 설정</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 스케줄 활성화 체크박스 */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasSchedule}
              onChange={(e) => setHasSchedule(e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              스케줄 기능 사용
            </span>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8">
            설정한 날짜에 자동으로 활성화/비활성화됩니다
          </p>
        </div>

        {/* 날짜 선택 영역 */}
        {hasSchedule && (
          <div className="space-y-4">
            {/* 활성화 날짜 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                활성화 날짜
              </label>
              <input
                type="date"
                value={activationDate}
                onChange={(e) => setActivationDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            {/* 비활성화 날짜 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                비활성화 날짜
              </label>
              <input
                type="date"
                value={deactivationDate}
                onChange={(e) => setDeactivationDate(e.target.value)}
                min={activationDate || undefined}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              * 활성화 날짜만 설정하면 해당 날짜부터 활성화됩니다<br/>
              * 비활성화 날짜를 추가로 설정하면 해당 날짜에 비활성화됩니다
            </p>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulingModal;