import CalcData from './CalcData';

/**
 * 현재 날짜를 기준으로 스케줄링된 아이템들의 활성화 상태를 자동으로 업데이트
 */
export const applyScheduling = (items: CalcData[]): CalcData[] => {
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 시간 제거, 날짜만

  return items.map(item => {
    if (!item.hasSchedule) {
      return item; // 스케줄링이 비활성화된 아이템은 그대로 반환
    }

    let shouldBeActive = item.isActive ?? false; // 기본값은 현재 상태

    // 활성화 날짜 체크
    if (item.activationDate) {
      const activationDate = new Date(item.activationDate);
      const activationDateOnly = new Date(activationDate.getFullYear(), activationDate.getMonth(), activationDate.getDate());

      if (currentDate >= activationDateOnly) {
        shouldBeActive = true;
      }
    }

    // 비활성화 날짜 체크 (활성화 날짜보다 우선순위 높음)
    if (item.deactivationDate) {
      const deactivationDate = new Date(item.deactivationDate);
      const deactivationDateOnly = new Date(deactivationDate.getFullYear(), deactivationDate.getMonth(), deactivationDate.getDate());

      if (currentDate >= deactivationDateOnly) {
        shouldBeActive = false;
      }
    }

    // 상태가 변경되어야 하는 경우에만 새 객체 반환
    if (shouldBeActive !== item.isActive) {
      return {
        ...item,
        isActive: shouldBeActive
      };
    }

    return item;
  });
};

/**
 * 스케줄링에 따라 상태가 변경된 아이템들의 목록을 반환
 */
export const getScheduledStateChanges = (items: CalcData[]): Array<{
  item: CalcData;
  oldState: boolean;
  newState: boolean;
  reason: 'activation' | 'deactivation';
}> => {
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const changes: Array<{
    item: CalcData;
    oldState: boolean;
    newState: boolean;
    reason: 'activation' | 'deactivation';
  }> = [];

  items.forEach(item => {
    if (!item.hasSchedule) return;

    let shouldBeActive = item.isActive ?? false;
    let reason: 'activation' | 'deactivation' | null = null;

    // 활성화 날짜 체크
    if (item.activationDate) {
      const activationDate = new Date(item.activationDate);
      const activationDateOnly = new Date(activationDate.getFullYear(), activationDate.getMonth(), activationDate.getDate());

      if (currentDate >= activationDateOnly && !item.isActive) {
        shouldBeActive = true;
        reason = 'activation';
      }
    }

    // 비활성화 날짜 체크
    if (item.deactivationDate) {
      const deactivationDate = new Date(item.deactivationDate);
      const deactivationDateOnly = new Date(deactivationDate.getFullYear(), deactivationDate.getMonth(), deactivationDate.getDate());

      if (currentDate >= deactivationDateOnly && item.isActive) {
        shouldBeActive = false;
        reason = 'deactivation';
      }
    }

    if (shouldBeActive !== (item.isActive ?? false) && reason) {
      changes.push({
        item,
        oldState: item.isActive ?? false,
        newState: shouldBeActive,
        reason
      });
    }
  });

  return changes;
};

/**
 * 다음 스케줄링 이벤트까지의 날짜 계산
 */
export const getNextSchedulingEvent = (items: CalcData[]): {
  date: Date;
  type: 'activation' | 'deactivation';
  item: CalcData;
} | null => {
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let nextEvent: {
    date: Date;
    type: 'activation' | 'deactivation';
    item: CalcData;
  } | null = null;

  items.forEach(item => {
    if (!item.hasSchedule) return;

    // 활성화 날짜 체크
    if (item.activationDate) {
      const activationDate = new Date(item.activationDate);
      const activationDateOnly = new Date(activationDate.getFullYear(), activationDate.getMonth(), activationDate.getDate());

      if (activationDateOnly > currentDate) {
        if (!nextEvent || activationDateOnly < nextEvent.date) {
          nextEvent = {
            date: activationDateOnly,
            type: 'activation',
            item
          };
        }
      }
    }

    // 비활성화 날짜 체크
    if (item.deactivationDate) {
      const deactivationDate = new Date(item.deactivationDate);
      const deactivationDateOnly = new Date(deactivationDate.getFullYear(), deactivationDate.getMonth(), deactivationDate.getDate());

      if (deactivationDateOnly > currentDate) {
        if (!nextEvent || deactivationDateOnly < nextEvent.date) {
          nextEvent = {
            date: deactivationDateOnly,
            type: 'deactivation',
            item
          };
        }
      }
    }
  });

  return nextEvent;
};