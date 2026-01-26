"use client";
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers';

export type SortingStrategy = 'vertical' | 'horizontal' | 'grid';

export interface SortableListProps<T extends { id: string }> {
  /** 정렬할 아이템 목록 */
  items: T[];
  /** 드래그 종료 시 호출되는 콜백 */
  onDragEnd: (activeId: string, overId: string) => void;
  /** 드래그 시작 시 호출되는 콜백 (선택) */
  onDragStart?: (activeId: string) => void;
  /** 정렬 방향 */
  strategy?: SortingStrategy;
  /** 아이템 렌더링 함수 */
  children: React.ReactNode;
  /** 드래그 중 보여줄 오버레이 (선택) */
  dragOverlay?: (activeId: UniqueIdentifier | null) => React.ReactNode;
  /** 컨테이너 className */
  className?: string;
  /** 부모 요소 내로 드래그 제한 여부 */
  restrictToParent?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
}

function SortableList<T extends { id: string }>({
  items,
  onDragEnd,
  onDragStart,
  strategy = 'vertical',
  children,
  dragOverlay,
  className = '',
  restrictToParent = false,
  disabled = false,
}: SortableListProps<T>) {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동 후 드래그 시작
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getStrategy = () => {
    switch (strategy) {
      case 'horizontal':
        return horizontalListSortingStrategy;
      case 'grid':
        return rectSortingStrategy;
      default:
        return verticalListSortingStrategy;
    }
  };

  const getModifiers = () => {
    const modifiers = [];

    if (restrictToParent) {
      modifiers.push(restrictToParentElement);
    }

    if (strategy === 'vertical') {
      modifiers.push(restrictToVerticalAxis);
    } else if (strategy === 'horizontal') {
      modifiers.push(restrictToHorizontalAxis);
    }

    return modifiers;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
    onDragStart?.(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      onDragEnd(active.id.toString(), over.id.toString());
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const itemIds = items.map(item => item.id);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={getModifiers()}
    >
      <SortableContext items={itemIds} strategy={getStrategy()}>
        <div className={className}>
          {children}
        </div>
      </SortableContext>

      {dragOverlay && (
        <DragOverlay>
          {activeId ? dragOverlay(activeId) : null}
        </DragOverlay>
      )}
    </DndContext>
  );
}

export default SortableList;
