"use client"
import React from "react";

const ColorTokensPage: React.FC = () => {
    const colorTokens = {
        primary: {
            name: "Primary Colors",
            colors: [
                { name: "Gray 50", value: "#fafafa", class: "bg-gray-50" },
                { name: "Gray 100", value: "#f5f5f5", class: "bg-gray-100" },
                { name: "Gray 200", value: "#e5e5e5", class: "bg-gray-200" },
                { name: "Gray 300", value: "#d4d4d4", class: "bg-gray-300" },
                { name: "Gray 400", value: "#a3a3a3", class: "bg-gray-400" },
                { name: "Gray 500", value: "#737373", class: "bg-gray-500" },
                { name: "Gray 600", value: "#525252", class: "bg-gray-600" },
                { name: "Gray 700", value: "#404040", class: "bg-gray-700" },
                { name: "Gray 800", value: "#262626", class: "bg-gray-800" },
                { name: "Gray 900", value: "#171717", class: "bg-gray-900" },
            ]
        },
        text: {
            name: "Text Colors",
            colors: [
                { name: "Text Primary", value: "#171717", class: "text-gray-900" },
                { name: "Text Secondary", value: "#525252", class: "text-gray-600" },
                { name: "Text Muted", value: "#737373", class: "text-gray-500" },
                { name: "Text Light", value: "#a3a3a3", class: "text-gray-400" },
            ]
        },
        background: {
            name: "Background Colors",
            colors: [
                { name: "Background Primary", value: "#ffffff", class: "bg-white" },
                { name: "Background Secondary", value: "#fafafa", class: "bg-gray-50" },
                { name: "Background Tertiary", value: "#f5f5f5", class: "bg-gray-100" },
                { name: "Background Dark", value: "#171717", class: "bg-gray-900" },
            ]
        },
        border: {
            name: "Border Colors",
            colors: [
                { name: "Border Light", value: "#e5e5e5", class: "border-gray-200" },
                { name: "Border Medium", value: "#d4d4d4", class: "border-gray-300" },
                { name: "Border Strong", value: "#a3a3a3", class: "border-gray-400" },
                { name: "Border Dark", value: "#171717", class: "border-gray-900" },
            ]
        },
        states: {
            name: "State Colors",
            colors: [
                { name: "Hover Light", value: "#f5f5f5", class: "hover:bg-gray-100" },
                { name: "Hover Medium", value: "#e5e5e5", class: "hover:bg-gray-200" },
                { name: "Active Dark", value: "#171717", class: "bg-gray-900" },
                { name: "Focus Ring", value: "rgba(163, 163, 163, 0.2)", class: "focus:ring-gray-400" },
            ]
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const ColorCard: React.FC<{ color: any }> = ({ color }) => (
        <div 
            className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-200 cursor-pointer p-4"
            onClick={() => copyToClipboard(color.class)}
        >
            <div className={`w-full h-16 rounded-lg ${color.class} border border-gray-300 mb-3`}></div>
            <div className="space-y-1">
                <h4 className="font-medium text-gray-900 text-sm">{color.name}</h4>
                <p className="text-xs text-gray-600 font-mono">{color.value}</p>
                <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">{color.class}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* 헤더 */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-light text-gray-900 mb-3 tracking-wide">Color Tokens</h1>
                    <p className="text-gray-600 font-light">사이트 전체에서 사용하는 색상 토큰입니다. 카드를 클릭하면 클래스명이 복사됩니다.</p>
                </div>

                {/* 색상 토큰 섹션들 */}
                <div className="space-y-12">
                    {Object.values(colorTokens).map((section, index) => (
                        <div key={index} className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
                            <h2 className="text-2xl font-light text-gray-900 tracking-wide mb-6">{section.name}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {section.colors.map((color, colorIndex) => (
                                    <ColorCard key={colorIndex} color={color} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 사용 가이드 */}
                <div className="mt-12 bg-gray-900 text-white rounded-3xl shadow-2xl border border-gray-800 p-8">
                    <h2 className="text-2xl font-light opacity-90 tracking-wide mb-6">사용 가이드</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-light mb-4 opacity-90">색상 철학</h3>
                            <ul className="space-y-2 text-sm font-light opacity-75 leading-relaxed">
                                <li>• 미니멀하고 고급스러운 흑백 톤 사용</li>
                                <li>• 계층적 시각 구조를 위한 그레이 스케일 활용</li>
                                <li>• 높은 대비로 가독성 확보</li>
                                <li>• 일관된 색상 적용으로 브랜드 통일성 유지</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-light mb-4 opacity-90">적용 원칙</h3>
                            <ul className="space-y-2 text-sm font-light opacity-75 leading-relaxed">
                                <li>• Primary: Gray-900 (검정) - 제목, 강조 요소</li>
                                <li>• Secondary: Gray-600 - 본문 텍스트</li>
                                <li>• Tertiary: Gray-400 - 보조 정보</li>
                                <li>• Background: White, Gray-50, Gray-100</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorTokensPage;