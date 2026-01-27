import axios from "axios";

export interface ExchangeRate {
    USD: number;
    JPY: number;
}

export class ExchangeService {
    private static rates: ExchangeRate | null = null;
    private static lastFetch: number = 0;
    private static readonly CACHE_DURATION = 10 * 60 * 1000; // 10분 캐시

    private static async getRates(): Promise<ExchangeRate> {
        // 캐시 유효 확인
        if (this.rates && Date.now() - this.lastFetch < this.CACHE_DURATION) {
            return this.rates;
        }

        try {
            const response = await axios.get('/api/exchange');
            if (response.data && response.data.rates) {
                this.rates = response.data.rates;
                this.lastFetch = Date.now();
                return this.rates!;
            }
        } catch (error) {
            console.error('Failed to fetch exchange rates:', error);
        }

        // 실패 시 또는 초기값 (기본값)
        return this.rates || {
            USD: 1400,
            JPY: 900
        };
    }

    public static async convertToKRW(amount: number, fromCurrency: string): Promise<number> {
        if (fromCurrency === "KRW") return amount;
        
        const rates = await this.getRates();
        
        if (fromCurrency === "USD") {
            return amount * rates.USD;
        } else if (fromCurrency === "JPY") {
            // JPY는 보통 100엔 단위로 환율이 제공됨 (API 응답이 900원대라면 100엔당 가격)
            return amount * (rates.JPY / 100);
        }
        
        return amount;
    }

    public static getCurrencySymbol(currency: string): string {
        const symbols: Record<string, string> = {
            KRW: "₩",
            USD: "$",
            JPY: "¥"
        };
        return symbols[currency] || "";
    }

    public static getCurrencyName(currency: string): string {
        const names: Record<string, string> = {
            KRW: "대한민국 원",
            USD: "미국 달러",
            JPY: "일본 엔"
        };
        return names[currency] || currency;
    }
}