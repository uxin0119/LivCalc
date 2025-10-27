// components/DragDropTest.tsx
import React, { useState } from 'react';
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
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    restrictToVerticalAxis,
    restrictToWindowEdges,
} from '@dnd-kit/modifiers';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IconGrabbable from "@/app/common/icon/icon_grabbable";

interface Item {
    id: string;
    name: string;
    value: number;
}

interface SortableItemProps {
    id: string;
    children:React.ReactNode;
}

const DragDropTest: React.FC = () => {
    const [items, setItems] = useState<Item[]>([
        { id: '1', name: '급여', value: 3000000 },
        { id: '2', name: '부업', value: 500000 },
        { id: '3', name: '식비', value: 400000 },
        { id: '4', name: '교통비', value: 150000 },
        { id: '5', name: '통신비', value: 80000 },
    ]);

    const [activeItem, setActiveItem] = useState<Item | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const activeItem = items.find(item => item.id === active.id);
        setActiveItem(activeItem || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveItem(null);

        if (!over) return;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const SortableItem: React.FC<SortableItemProps> = ({ id,children }) => {
        const {
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`
                flex items-center gap-3 p-4 bg-white border rounded-lg cursor-default
                ${isDragging? 'opacity-50 shadow-2xl z-50 border-blue-300'
                            : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                        }
                transition-all duration-200`}
            >
                {/* 드래그 핸들 */}
                <div
                    {...listeners}
                    className="
                      cursor-grab active:cursor-grabbing flex-none w-8 h-8
                      flex items-center justify-center text-gray-400 hover:text-gray-600
                      rounded hover:bg-gray-100 select-none transition-colors
                    "
                    style={{ touchAction: 'none' }}
                >
                    <IconGrabbable/>
                </div>

                {children}
            </div>
        );
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Drag and Drop 테스트</h2>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            >
                <SortableContext
                    items={items.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <SortableItem
                                key={index}
                                id={item.id}
                            >
                                {item.name}
                                <span className="text-blue-600 font-semibold"></span>
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeItem ? (
                        <div className="bg-white border-2 border-blue-300 rounded-lg p-4 shadow-lg opacity-90">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{activeItem.name}</span>
                                <span className="text-blue-600 font-semibold">
                  {activeItem.value.toLocaleString()}원
                </span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">사용법:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 항목을 드래그해서 순서를 변경하세요</li>
                    <li>• 드래그 핸들(≡)을 클릭하고 드래그하세요</li>
                    <li>• 키보드로도 조작 가능합니다</li>
                </ul>
            </div>
        </div>
    );
};

export default DragDropTest;