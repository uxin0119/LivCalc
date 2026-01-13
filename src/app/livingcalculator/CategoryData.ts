type CategoryData = {
    id: string;
    name: string;
    color: string;          // Tailwind 색상 이름 (예: "blue", "green", "purple")
    icon: string;           // 이모지 문자열 (예: "💰", "💳", "📊")
    order: number;          // 표시 순서
    createdAt: string;      // ISO 8601 날짜
};

export default CategoryData;
