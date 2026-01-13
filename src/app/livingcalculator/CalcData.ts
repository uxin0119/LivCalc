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
    activationDate?: string;  // ISO 8601 날짜 문자열
    deactivationDate?: string;  // ISO 8601 날짜 문자열
    hasSchedule?: boolean;  // 스케줄링 기능 사용 여부
};
export default CalcData;