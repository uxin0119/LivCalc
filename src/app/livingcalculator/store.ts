import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import CalcData from './CalcData';
import CategoryData from './CategoryData';
import util from '../common/script/Util';
import { ExchangeService } from './exchangeService';
import { loadDataFromUrl, clearDataFromUrl } from '@/app/common/utils/DataSharing';
import { applyScheduling, getScheduledStateChanges } from './schedulingUtils';

const getCurrentMonthDays = (settlementDay?: number): number => {
    const now = new Date();
    if (settlementDay && settlementDay > 0) {
        // 정산일 기준: 정산일~다음 정산일까지의 일수
        const currentDay = now.getDate();
        const year = now.getFullYear();
        const month = now.getMonth();
        if (currentDay >= settlementDay) {
            // 이번 달 정산일 ~ 다음 달 정산일
            const start = new Date(year, month, settlementDay);
            const end = new Date(year, month + 1, settlementDay);
            return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        } else {
            // 지난 달 정산일 ~ 이번 달 정산일
            const start = new Date(year, month - 1, settlementDay);
            const end = new Date(year, month, settlementDay);
            return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }
    }
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return new Date(year, month, 0).getDate() + 1;
};

const getDaysLeftInMonth = (settlementDay?: number): number => {
    const today = new Date();
    const currentDay = today.getDate();
    if (settlementDay && settlementDay > 0) {
        // 정산일 기준 남은 일수
        if (currentDay >= settlementDay) {
            // 다음 달 정산일까지
            const year = today.getFullYear();
            const month = today.getMonth();
            const nextSettlement = new Date(year, month + 1, settlementDay);
            return Math.round((nextSettlement.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        } else {
            // 이번 달 정산일까지
            return settlementDay - currentDay;
        }
    }
    const daysInCurrentMonth = getCurrentMonthDays();
    return daysInCurrentMonth - currentDay;
};


interface CalcState {
  items: CalcData[];
  categories: CategoryData[];
  isInitialLoad: boolean;
  monthTotal: number;
  dailyAvailable: number;
  fixedTotal: number;
  settlementDay: number; // 정산일 (매월 1-31일)
  setSettlementDay: (day: number) => void;
  loadFirstLivingData: () => void;
  loadDataFromSharedUrl: () => boolean;
  addItem: (category: string, type: "plus" | "minus") => void;
  removeItem: (id: string) => void;
  updateItemField: <K extends keyof CalcData>(id: string, field: K, value: CalcData[K]) => void;
  updateItemFields: (id: string, fields: Partial<CalcData>) => void;
  handleDragEnd: (event: any) => void;
  reorderItemsInCategory: (category: string, activeId: string, overId: string) => void;
  setItems: (items: CalcData[]) => void;
  setCategories: (categories: CategoryData[]) => void;
  calculateTotals: () => void;
  applyScheduledChanges: () => void;
  checkAndApplyScheduling: () => void;
  // 카테고리 관리 함수
  addCategory: (name: string, color: string, icon: string) => void;
  removeCategory: (categoryId: string) => void;
  updateCategory: (categoryId: string, updates: Partial<CategoryData>) => void;
  reorderCategories: (newOrder: CategoryData[]) => void;
  initializeDefaultCategories: () => void;
}

const useCalcStore = create<CalcState>((set, get) => ({
  items: [],
  categories: [],
  isInitialLoad: true,
  monthTotal: 0,
  dailyAvailable: 0,
  fixedTotal: 0,
  settlementDay: 0, // 0 = 미설정
  setSettlementDay: (day: number) => {
    set({ settlementDay: day });
    util.saveLocalStorage("livingSettlementDay", day);
    // 정산일 변경 시 총액 재계산
    setTimeout(() => get().calculateTotals(), 0);
  },
  loadFirstLivingData: () => {
    // 먼저 URL에서 공유된 데이터가 있는지 확인
    const urlDataLoaded = get().loadDataFromSharedUrl();

    if (!urlDataLoaded) {
      // URL 데이터가 없으면 로컬 스토리지에서 로드
      const jsonString: CalcData[] | null = util.loadLocalStorage("livingData");
      const savedCategories: CategoryData[] | null = util.loadLocalStorage("livingCategories");
      const savedSettlementDay: number | null = util.loadLocalStorage("livingSettlementDay");
      if (savedSettlementDay) {
        set({ settlementDay: savedSettlementDay });
      }

      // 카테고리 마이그레이션
      if (!savedCategories || savedCategories.length === 0) {
        // 기존 사용자를 위한 기본 카테고리 생성
        get().initializeDefaultCategories();
      } else {
        set({ categories: savedCategories });
      }

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

      if (sharedData && sharedData.items) {
        const migratedItems = sharedData.items.map(item => ({
          ...item,
          id: item.id || Date.now() + Math.random().toString(36).substr(2, 9),
          currency: item.currency || "KRW",
          isActive: item.isActive !== undefined ? item.isActive : true
        }));

        // 카테고리 데이터가 있으면 설정, 없으면 기본 카테고리 초기화
        if (sharedData.categories && Array.isArray(sharedData.categories) && sharedData.categories.length > 0) {
          set({ categories: sharedData.categories });
          util.saveLocalStorage("livingCategories", sharedData.categories);
        } else {
          get().initializeDefaultCategories();
        }

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
    // debounce된 계산 함수 호출 (타이핑 중 과도한 계산 방지)
    if (!debouncedCalculate) {
      debouncedCalculate = debounce(() => get().calculateTotals(), 300);
    }
    debouncedCalculate();
  },
  updateItemFields: (id, fields) => {
    set(state => {
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, ...fields } : item
      );
      return { items: updatedItems };
    });
    // debounce된 계산 함수 호출
    if (!debouncedCalculate) {
      debouncedCalculate = debounce(() => get().calculateTotals(), 300);
    }
    debouncedCalculate();
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
  reorderItemsInCategory: (category: string, activeId: string, overId: string) => {
    const items = get().items;
    const activeIndex = items.findIndex(item => item.id === activeId);
    const overIndex = items.findIndex(item => item.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) {
      const activeItem = items[activeIndex];
      const overItem = items[overIndex];

      // 같은 카테고리 내에서만 이동
      if (activeItem && overItem && activeItem.category === category && overItem.category === category) {
        const newItems = arrayMove(items, activeIndex, overIndex);
        set({ items: newItems });
        setTimeout(() => {
          get().calculateTotals();
        }, 0);
      }
    }
  },
  setItems: (items) => {
      set({ items });
      setTimeout(() => {
        get().calculateTotals();
      }, 0);
  },
  setCategories: (categories) => {
      set({ categories });
  },
  calculateTotals: async () => {
    const items = get().items;
    const settlementDay = get().settlementDay;
    let newMonthTotal = 0;
    let fixedTotal = 0;

    // 매번 호출 시 현재 날짜 기준으로 계산 (날짜가 바뀌면 자동 반영)
    const daysLeft = getDaysLeftInMonth(settlementDay);
    const daysInMonth = getCurrentMonthDays(settlementDay);

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
        dailyAvailable: newMonthTotal < 0 ? 0 : Math.floor(newMonthTotal / daysLeft),
        fixedTotal: Math.floor(fixedTotal / daysInMonth)
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
    
    // 1. 기존 스케줄링 변경사항 확인
    const scheduleChanges = getScheduledStateChanges(items);
    
    // 2. 월간 자동화 (Monthly Recurring)
    const today = new Date();
    const todayDay = today.getDate(); // 1-31

    // 자동 활성화 대상 (비활성 상태 & 오늘이 활성화일)
    const activationTargets = items.filter(item => 
        !item.isActive && item.activationDay === todayDay
    );

    // 자동 비활성화 대상 (활성 상태 & 오늘이 비활성화일)
    const deactivationTargets = items.filter(item => 
        item.isActive && item.deactivationDay === todayDay
    );

    if (scheduleChanges.length > 0 || activationTargets.length > 0 || deactivationTargets.length > 0) {
      if (process.env.NODE_ENV === 'development') {
        if (scheduleChanges.length > 0) {
            console.log('스케줄링 변경:', scheduleChanges.map(c => c.item.name).join(', '));
        }
        if (activationTargets.length > 0) {
            console.log('매월 자동 활성화:', activationTargets.map(i => i.name).join(', '));
        }
        if (deactivationTargets.length > 0) {
            console.log('매월 자동 비활성화:', deactivationTargets.map(i => i.name).join(', '));
        }
      }

      // 변경사항 적용
      const updatedItems = items.map(item => {
          let newItem = item;
          let changed = false;

          // 1. 스케줄링 적용 (레거시/복합 스케줄링)
          if (item.hasSchedule) {
             const scheduleChange = scheduleChanges.find(c => c.item.id === item.id);
             if (scheduleChange) {
                 newItem = { ...newItem, isActive: scheduleChange.newState };
                 changed = true;
             }
          }

          // 2. 매월 자동 활성화 (Recurring)
          if (!newItem.isActive && newItem.activationDay === todayDay) {
              newItem = { ...newItem, isActive: true };
              changed = true;
          }

          // 3. 매월 자동 비활성화 (Recurring)
          if (newItem.isActive && newItem.deactivationDay === todayDay) {
              newItem = { ...newItem, isActive: false };
              changed = true;
          }

          return newItem;
      });

      // 실제로 변경된 경우에만 업데이트
      if (JSON.stringify(items) !== JSON.stringify(updatedItems)) {
          set({ items: updatedItems });
          setTimeout(() => {
            get().calculateTotals();
          }, 0);
      }
    }
  },

  // 카테고리 관리 함수들
  addCategory: (name: string, color: string, icon: string) => {
    const newCategory: CategoryData = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name,
      color,
      icon,
      order: get().categories.length,
      createdAt: new Date().toISOString()
    };
    set(state => ({ categories: [...state.categories, newCategory] }));
  },

  removeCategory: (categoryId: string) => {
    // 해당 카테고리의 아이템도 삭제
    set(state => ({
      categories: state.categories.filter(c => c.id !== categoryId),
      items: state.items.filter(item => item.category !== categoryId)
    }));
    setTimeout(() => {
      get().calculateTotals();
    }, 0);
  },

  updateCategory: (categoryId: string, updates: Partial<CategoryData>) => {
    set(state => ({
      categories: state.categories.map(c =>
        c.id === categoryId ? { ...c, ...updates } : c
      )
    }));
  },

  reorderCategories: (newOrder: CategoryData[]) => {
    const reordered = newOrder.map((cat, index) => ({
      ...cat,
      order: index
    }));
    set({ categories: reordered });
  },

  initializeDefaultCategories: () => {
    const defaultCategories: CategoryData[] = [
      {
        id: 'fixed',
        name: '고정 수입/지출',
        color: 'blue',
        icon: '💰',
        order: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 'card',
        name: '카드 고정지출',
        color: 'purple',
        icon: '💳',
        order: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: 'daily',
        name: '유동적 수입/지출',
        color: 'green',
        icon: '📊',
        order: 2,
        createdAt: new Date().toISOString()
      }
    ];
    set({ categories: defaultCategories });
  }
}));

// Debounce 함수
const debounce = <T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Debounced 저장 함수 (1초 딜레이)
const debouncedSaveItems = debounce((items: CalcData[]) => {
  util.saveLocalStorage("livingData", items);
}, 1000);

const debouncedSaveCategories = debounce((categories: CategoryData[]) => {
  util.saveLocalStorage("livingCategories", categories);
}, 1000);

// Debounced 계산 함수 (300ms 딜레이 - 타이핑 중 과도한 계산 방지)
let debouncedCalculate: (() => void) | null = null;

useCalcStore.subscribe(
  (state, prevState) => {
    if (!state.isInitialLoad && state.items !== prevState.items) {
      debouncedSaveItems(state.items);
    }
    if (!state.isInitialLoad && state.categories !== prevState.categories) {
      debouncedSaveCategories(state.categories);
    }
    if (!state.isInitialLoad && state.settlementDay !== prevState.settlementDay) {
      util.saveLocalStorage("livingSettlementDay", state.settlementDay);
    }
  },
);

export default useCalcStore;