"use client";
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

export interface SortableItemProps {
  /** 고유 ID */
  id: string;
  /** 드래그 비활성화 여부 */
  disabled?: boolean;
  /** 자식 요소 렌더링 (드래그 상태 전달) */
  children: (props: SortableItemRenderProps) => React.ReactNode;
  /** 컨테이너 className */
  className?: string;
  /** 드래그 중 className */
  draggingClassName?: string;
}

export interface SortableItemRenderProps {
  /** 드래그 중 여부 */
  isDragging: boolean;
  /** 정렬 중 여부 */
  isSorting: boolean;
  /** 드래그 핸들에 적용할 props */
  dragHandleProps: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
    style: React.CSSProperties;
  };
  /** ref 설정 함수 */
  setNodeRef: (node: HTMLElement | null) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  disabled = false,
  children,
  className = '',
  draggingClassName = 'opacity-50 shadow-lg',
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({
    id,
    disabled,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  const dragHandleProps = {
    attributes,
    listeners,
    style: {
      touchAction: 'none' as const,
      WebkitUserSelect: 'none' as const,
      userSelect: 'none' as const,
      cursor: disabled ? 'default' : 'grab',
    },
  };

  const combinedClassName = `${className} ${isDragging ? draggingClassName : ''}`.trim();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={combinedClassName}
    >
      {children({
        isDragging,
        isSorting,
        dragHandleProps,
        setNodeRef,
      })}
    </div>
  );
};

export default SortableItem;
