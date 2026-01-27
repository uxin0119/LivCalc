import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ExchangeRate {
    currency: 'USD' | 'JPY';
    rate: number;
}

export async function GET() {
    try {
        // 네이버 금융 모바일 API를 사용하여 환율 정보 조회
        // USD
        const usdRes = await fetch('https://m.stock.naver.com/front-api/marketIndex/productDetail?category=exchange&reutersCode=FX_USDKRW');
        const usdData = await usdRes.json();
        
        // JPY
        const jpyRes = await fetch('https://m.stock.naver.com/front-api/marketIndex/productDetail?category=exchange&reutersCode=FX_JPYKRW');
        const jpyData = await jpyRes.json();

        // 데이터 파싱 (실시간 환율인 closePrice 사용)
        // 응답 구조: result: { closePrice: "1,430.50", ... }
        
        const usdRate = parseFloat(usdData.result.closePrice.replace(/,/g, ''));
        const jpyRate = parseFloat(jpyData.result.closePrice.replace(/,/g, ''));

        return NextResponse.json({
            rates: {
                USD: usdRate,
                JPY: jpyRate, // JPY는 보통 100엔 기준이므로 클라이언트에서 /100 처리하거나 여기서 처리
                // 네이버 API의 JPYKRW는 100엔당 원화 가격을 줌 (예: 900.50)
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Exchange rate fetch error:', error);
        // 에러 시 기본값 반환 (앱이 멈추지 않도록)
        return NextResponse.json({
            rates: {
                USD: 1400,
                JPY: 900
            },
            timestamp: new Date().toISOString(),
            error: true
        });
    }
}
