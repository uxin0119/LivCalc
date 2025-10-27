import React from "react";
import CSection2 from "@/app/common/ui/CSection2";
import useCalcStore from "./store";

const TotalArea: React.FC = () => {
    const { monthTotal, dailyAvailable, fixedTotal } = useCalcStore();

    return (
        <div className="mt-10 space-y-6">
            {/* 월 가용 금액 */}
            <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl border border-gray-800">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-light opacity-90 tracking-wide">월 가용 금액</h3>
                        <p className="text-sm opacity-75 font-light mt-1">이번 달 총 수입 - 지출</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-light">{monthTotal.toLocaleString()}</div>
                        <div className="text-sm opacity-90 font-light">원</div>
                    </div>
                </div>
            </div>

            {/* 일일 금액 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 일일 추천 사용 금액 */}
                <div className="bg-white border-2 border-gray-900 p-6 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h4 className="text-lg font-light text-gray-900 mb-3 tracking-wide">일일 추천 사용 금액</h4>
                        <div className="text-3xl font-light text-gray-900">{fixedTotal.toLocaleString()}원</div>
                        <p className="text-sm text-gray-600 font-light mt-2">고정비 기준</p>
                    </div>
                </div>

                {/* 일일 가용 금액 */}
                <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg border border-gray-800">
                    <div className="text-center">
                        <h4 className="text-lg font-light opacity-90 mb-3 tracking-wide">일일 가용 금액</h4>
                        <div className="text-3xl font-light">{dailyAvailable.toLocaleString()}원</div>
                        <p className="text-sm opacity-75 font-light mt-2">남은 일수 기준</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

TotalArea.displayName = 'TotalArea';
export default TotalArea;