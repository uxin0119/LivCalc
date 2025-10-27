import axios from "axios";

export interface ExchangeRate {
    from: string;
    to: string;
    rate: number;
}

export class ExchangeService {
    private static exchangeCache: Map<string, { rate: number; timestamp: number }> = new Map();
    private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시

    private static async fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
        const cacheKey = `${fromCurrency}-${toCurrency}`;
        const cached = this.exchangeCache.get(cacheKey);
        
        // 캐시된 데이터가 있고 5분 이내라면 반환
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.rate;
        }

        try {
            const params = {
                key: "calculator",
                pkid: 141,
                q: "%ED%99%98%EC%9C%A8&",
                where: "m",
                u1: "keb",
                u2: 1,
                u3: fromCurrency,
                u4: toCurrency,
                u6: "standardUnit",
                u7: 0,
                u8: "down",
            };

            const url = "https://m.search.naver.com/p/csearch/content/qapirender.nhn";
            const response = await axios.get(url, { params: params });
            
            console.log(`환율 API 응답 (${fromCurrency} -> ${toCurrency}):`, response.data);
            
            if (response.data && response.data.country && response.data.country.length >= 2) {
                const targetCountry = response.data.country[1];
                console.log('targetCountry:', targetCountry);
                
                // rate가 문자열일 수 있으므로 쉼표 제거 후 파싱
                let rateValue = targetCountry.value;
                if (typeof rateValue === 'string') {
                    rateValue = rateValue.replace(/,/g, '');
                }
                const rate = parseFloat(rateValue);
                
                console.log(`환율: 1 ${fromCurrency} = ${rate} ${toCurrency}`);
                
                if (!isNaN(rate) && rate > 0) {
                    // 캐시에 저장
                    this.exchangeCache.set(cacheKey, { rate, timestamp: Date.now() });
                    return rate;
                }
            }
        } catch (error) {
            console.error(`환율 조회 실패: ${fromCurrency} -> ${toCurrency}`, error);
        }
        
        // 기본값 반환 (API 실패시)
        return this.getDefaultRate(fromCurrency, toCurrency);
    }

    private static getDefaultRate(fromCurrency: string, toCurrency: string): number {
        if (fromCurrency === toCurrency) return 1;
        
        // 기본 환율 (대략적인 값, API 실패시 사용)
        const defaultRates: Record<string, Record<string, number>> = {
            USD: { KRW: 1300, JPY: 150 },
            JPY: { KRW: 8.5, USD: 0.0067 },
            KRW: { USD: 0.00077, JPY: 0.12 }
        };
        
        return defaultRates[fromCurrency]?.[toCurrency] || 1;
    }

    public static async convertToKRW(amount: number, fromCurrency: string): Promise<number> {
        if (fromCurrency === "KRW") return amount;
        
        const rate = await this.fetchExchangeRate(fromCurrency, "KRW");
        return amount * rate;
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
            KRW: "원화",
            USD: "달러",
            JPY: "엔화"
        };
        return names[currency] || currency;
    }
}