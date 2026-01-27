/**
 * 아이템 포맷
 */
type CalcData = {
    id: string;
    name: string;
    value: number;
    type: string;
    category: string;  // 카테고리 ID (동적 섹션 지원)
    currency?: "KRW" | "USD" | "JPY";
    isActive?: boolean;
    activationDate?: string;  // Legacy: ISO 8601 날짜 문자열
    deactivationDate?: string;  // Legacy: ISO 8601 날짜 문자열
    activationDay?: number; // 자동 활성화일 (매월 1-31일)
    deactivationDay?: number; // 자동 비활성화일 (매월 1-31일)
    modificationDay?: number; // 수정 권고일 (매월 1-31일)
    hasSchedule?: boolean;  // 스케줄링 기능 사용 여부
};
export default CalcData;