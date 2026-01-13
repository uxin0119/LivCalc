import LZString from 'lz-string';

/**
 * 데이터 공유를 위한 유틸리티 함수들
 */

export interface ShareableData {
  items: any[];
  categories?: any[];
  timestamp: number;
  version: string;
}

/**
 * 데이터를 압축하고 URL 파라미터로 사용 가능한 문자열로 변환
 */
export const compressDataForUrl = (data: any, categories?: any[]): string => {
  try {
    const shareData: ShareableData = {
      items: data,
      categories: categories,
      timestamp: Date.now(),
      version: '1.0'
    };

    const jsonString = JSON.stringify(shareData);
    const compressed = LZString.compressToEncodedURIComponent(jsonString);

    return compressed;
  } catch (error) {
    console.error('데이터 압축 실패:', error);
    throw new Error('데이터 압축에 실패했습니다.');
  }
};

/**
 * 압축된 문자열을 원본 데이터로 복원
 */
export const decompressDataFromUrl = (compressedData: string): { items: any[]; categories?: any[] } => {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);

    if (!decompressed) {
      throw new Error('데이터 압축 해제 실패');
    }

    const shareData: ShareableData = JSON.parse(decompressed);

    // 데이터 유효성 검사
    if (!shareData.items || !Array.isArray(shareData.items)) {
      throw new Error('잘못된 데이터 형식');
    }

    // 버전 호환성 검사 (향후 확장용)
    if (shareData.version && shareData.version !== '1.0') {
      console.warn('다른 버전의 데이터입니다:', shareData.version);
    }

    return {
      items: shareData.items,
      categories: shareData.categories
    };
  } catch (error) {
    console.error('데이터 압축 해제 실패:', error);
    throw new Error('데이터를 불러올 수 없습니다. URL을 확인해주세요.');
  }
};

/**
 * 현재 페이지 URL에 데이터를 포함한 공유 URL 생성
 */
export const generateShareUrl = (data: any[], categories?: any[]): string => {
  try {
    const compressedData = compressDataForUrl(data, categories);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';

    return `${baseUrl}?data=${compressedData}`;
  } catch (error) {
    console.error('공유 URL 생성 실패:', error);
    throw new Error('공유 URL 생성에 실패했습니다.');
  }
};

/**
 * 클립보드에 공유 URL 복사
 */
export const copyShareUrlToClipboard = async (data: any[], categories?: any[]): Promise<void> => {
  try {
    const shareUrl = generateShareUrl(data, categories);

    if (typeof window !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
    } else {
      // 클립보드 API가 지원되지 않는 경우 폴백
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
    throw new Error('클립보드 복사에 실패했습니다.');
  }
};

/**
 * URL에서 데이터 파라미터를 추출하고 복원
 */
export const loadDataFromUrl = (): { items: any[]; categories?: any[] } | null => {
  try {
    if (typeof window === 'undefined') return null;

    const urlParams = new URLSearchParams(window.location.search);
    const compressedData = urlParams.get('data');

    if (!compressedData) {
      return null;
    }

    return decompressDataFromUrl(compressedData);
  } catch (error) {
    console.error('URL에서 데이터 로드 실패:', error);
    return null;
  }
};

/**
 * URL에서 데이터 파라미터 제거 (깔끔한 URL로 만들기)
 */
export const clearDataFromUrl = (): void => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.delete('data');

  // 히스토리에 영향주지 않고 URL 변경
  window.history.replaceState({}, '', url.toString());
};

/**
 * 데이터 크기 계산 (압축 전후 비교용)
 */
export const calculateDataSize = (data: any[], categories?: any[]): { original: number; compressed: number } => {
  try {
    const jsonString = JSON.stringify({ items: data, categories });
    const compressedData = compressDataForUrl(data, categories);

    return {
      original: new Blob([jsonString]).size,
      compressed: new Blob([compressedData]).size
    };
  } catch (error) {
    console.error('데이터 크기 계산 실패:', error);
    return { original: 0, compressed: 0 };
  }
};