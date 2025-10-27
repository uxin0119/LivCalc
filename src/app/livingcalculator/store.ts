import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import CalcData from './CalcData';
import util from '../common/script/Util';
import { ExchangeService } from './exchangeService';
import { loadDataFromUrl, clearDataFromUrl } from '@/app/common/utils/DataSharing';
import { applyScheduling, getScheduledStateChanges } from './schedulingUtils';

const getCurrentMonthDays = (): number => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return new Date(year, month, 0).getDate() + 1;
};

const getDaysLeftInMonth = (): number => {
    const today = new Date();
    const currentDay = today.getDate();
    const daysInCurrentMonth = getCurrentMonthDays();
    return daysInCurrentMonth - currentDay;
};

const DAYS_IN_MONTH = getCurrentMonthDays();
const DAYS_LEFT = getDaysLeftInMonth();

interface CalcState {
  items: CalcData[];
  isInitialLoad: boolean;
  monthTotal: number;
  dailyAvailable: number;
  fixedTotal: number;
  loadFirstLivingData: () => void;
  loadDataFromSharedUrl: () => boolean;
  addItem: (category: "fixed" | "daily", type: "plus" | "minus") => void;
  removeItem: (id: string) => void;
  updateItemField: <K extends keyof CalcData>(id: string, field: K, value: CalcData[K]) => void;
  updateItemFields: (id: string, fields: Partial<CalcData>) => void;
  handleDragEnd: (event: any) => void;
  setItems: (items: CalcData[]) => void;
  calculateTotals: () => void;
  applyScheduledChanges: () => void;
  checkAndApplyScheduling: () => void;
}

const useCalcStore = create<CalcState>((set, get) => ({
  items: [],
  isInitialLoad: true,
  monthTotal: 0,
  dailyAvailable: 0,
  fixedTotal: 0,
  loadFirstLivingData: () => {
    // 먼저 URL에서 공유된 데이터가 있는지 확인
    const urlDataLoaded = get().loadDataFromSharedUrl();

    if (!urlDataLoaded) {
      // URL 데이터가 없으면 로컬 스토리지에서 로드
      const jsonString: CalcData[] | null = util.loadLocalStorage("livingData");
      if (jsonString) {
        const migratedItems = jsonString.map(item => ({
          ...item,
          id: item.id || Date.now() + Math.random().toString(36).substr(2, 9),
          currency: item.currency || "KRW",
          isActive: item.isActive !== undefined ? item.isActive : true
        }));
        set({ items: migratedItems, isInitialLoad: false });
        setTimeout(() => {
          get().checkAndApplyScheduling();
          get().calculateTotals();
        }, 0);
      } else {
        set({ isInitialLoad: false });
      }
    }
  },

  loadDataFromSharedUrl: () => {
    try {
      const sharedData = loadDataFromUrl();

      if (sharedData && Array.isArray(sharedData)) {
        const migratedItems = sharedData.map(item => ({
          ...item,
          id: item.id || Date.now() + Math.random().toString(36).substr(2, 9),
          currency: item.currency || "KRW",
          isActive: item.isActive !== undefined ? item.isActive : true
        }));

        // 데이터를 상태에 설정
        set({ items: migratedItems, isInitialLoad: false });

        // 로컬 스토리지에도 저장
        util.saveLocalStorage("livingData", migratedItems);

        // URL에서 데이터 파라미터 제거 (깔끔한 URL로 만들기)
        clearDataFromUrl();

        // 스케줄링 체크 후 계산 실행
        setTimeout(() => {
          get().checkAndApplyScheduling();
          get().calculateTotals();
        }, 0);

        return true; // 데이터가 로드됨
      }

      return false; // 데이터 없음
    } catch (error) {
      console.error('공유된 데이터 로드 실패:', error);
      return false;
    }
  },
  addItem: (category, type) => {
    const newItem: CalcData = { 
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name: "", 
      value: 0, 
      type: type, 
      category,
      currency: "KRW",
      isActive: true
    };
    set(state => ({ items: [...state.items, newItem] }));
    setTimeout(() => {
      get().calculateTotals();
    }, 0);
  },
  removeItem: (id) => {
    set(state => ({
      items: state.items.filter(item => item.id !== id),
    }));
    setTimeout(() => {
      get().calculateTotals();
    }, 0);
  },
  updateItemField: <K extends keyof CalcData>(id: string, field: K, value: CalcData[K]) => {
    set(state => {
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      );
      return { items: updatedItems };
    });
    // 비동기 함수 호출
    setTimeout(() => {
      get().calculateTotals();
    }, 0);
  },
  updateItemFields: (id, fields) => {
    set(state => {
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, ...fields } : item
      );
      return { items: updatedItems };
    });
    // 비동기 함수 호출
    setTimeout(() => {
      get().calculateTotals();
    }, 0);
  },
  handleDragEnd: (event: any) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const items = get().items;
      const activeId = active.id.toString();
      const overId = over.id.toString();
      
      const activeIndex = items.findIndex(item => item.id === activeId);
      const overIndex = items.findIndex(item => item.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const activeItem = items[activeIndex];
        const overItem = items[overIndex];

        if (activeItem && overItem && activeItem.category === overItem.category) {
          const newItems = arrayMove(items, activeIndex, overIndex);
          set({ items: newItems });
          setTimeout(() => {
            get().calculateTotals();
          }, 0);
        }
      }
    }
  },
  setItems: (items) => {
      set({ items });
      setTimeout(() => {
        get().calculateTotals();
      }, 0);
  },
  calculateTotals: async () => {
    const items = get().items;
    let newMonthTotal = 0;
    let fixedTotal = 0;

    // 환율을 적용한 계산을 위해 각 아이템을 원화로 환산 (활성화된 아이템만)
    for (const item of items) {
        // 비활성화된 아이템은 계산에서 제외
        if (item.isActive === false) {
            continue;
        }

        const krwValue = await ExchangeService.convertToKRW(item.value, item.currency || 'KRW');
        
        if (item.type === "plus") {
            newMonthTotal += krwValue;
            if (item.category === "fixed") {
                fixedTotal += krwValue;
            }
        } else if (item.type === "minus") {
            newMonthTotal -= krwValue;
            if (item.category === "fixed") {
                fixedTotal -= krwValue;
            }
        }
    }

    set({
        monthTotal: Math.round(newMonthTotal),
        dailyAvailable: Math.floor(newMonthTotal / DAYS_LEFT),
        fixedTotal: Math.floor(fixedTotal / DAYS_IN_MONTH)
    });
  },

  applyScheduledChanges: () => {
    const items = get().items;
    const updatedItems = applyScheduling(items);

    // 변경사항이 있는 경우에만 상태 업데이트
    if (JSON.stringify(items) !== JSON.stringify(updatedItems)) {
      set({ items: updatedItems });
      // 계산도 다시 실행
      setTimeout(() => {
        get().calculateTotals();
      }, 0);
    }
  },

  checkAndApplyScheduling: () => {
    const items = get().items;
    const changes = getScheduledStateChanges(items);

    if (changes.length > 0) {
      // 로그 출력 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log('스케줄링으로 인한 상태 변경:', changes.map(change =>
          `${change.item.name}: ${change.reason === 'activation' ? '활성화' : '비활성화'}`
        ).join(', '));
      }

      get().applyScheduledChanges();
    }
  }
}));

useCalcStore.subscribe(
  (state, prevState) => {
    if (!state.isInitialLoad && state.items !== prevState.items) {
      util.saveLocalStorage("livingData", state.items);
    }
  },
);

export default useCalcStore;