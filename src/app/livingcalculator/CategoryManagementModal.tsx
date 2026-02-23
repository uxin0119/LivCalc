"use client";
import React, { useState } from 'react';
import Modal from '@/app/common/components/Modal';
import CategoryData from './CategoryData';
import ColorPicker from './ColorPicker';
import IconPicker from './IconPicker';
import CategoryEditModal from './CategoryEditModal';
import useCalcStore from './store';
import CButton from '@/app/common/ui/CButton';
import { DndContext, closestCenter, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IconGrabbable from '@/app/common/icon/icon_grabbable';

interface SortableCategoryItemProps {
  category: CategoryData;
  onEdit: () => void;
}

const SortableCategoryItem: React.FC<SortableCategoryItemProps> = ({ category, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-gray-800 rounded-lg border border-gray-700 ${
        isDragging ? 'opacity-50 scale-105 shadow-2xl' : 'hover:bg-gray-750'
      }`}
    >
      {/* 드래그 핸들 */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300 p-3 -m-1"
        style={{ touchAction: 'none' }}
      >
        <IconGrabbable />
      </div>

      {/* 아이콘 */}
      <span className="text-2xl">{category.icon}</span>

      {/* 이름 */}
      <span className="flex-1 text-white font-medium">{category.name}</span>

      {/* 편집 버튼 */}
      <button
        onClick={onEdit}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 text-sm"
      >
        편집
      </button>
    </div>
  );
};

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryManagementModal: React.FC<CategoryManagementModalProps> = ({ isOpen, onClose }) => {
  const { categories, addCategory, reorderCategories } = useCalcStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('blue');
  const [newIcon, setNewIcon] = useState('📊');
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedCategories.findIndex((cat) => cat.id === active.id);
      const newIndex = sortedCategories.findIndex((cat) => cat.id === over.id);

      const newOrder = [...sortedCategories];
      const [movedItem] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedItem);

      reorderCategories(newOrder);
    }
  };

  const handleAddCategory = () => {
    if (newName.trim()) {
      addCategory(newName.trim(), newColor, newIcon);
      setNewName('');
      setNewColor('blue');
      setNewIcon('📊');
      setShowAddForm(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="섹션 관리">
        <div className="space-y-6">
          {/* 섹션 목록 */}
          <div className="space-y-2">
            <div className="text-sm text-gray-400 mb-3">드래그하여 순서 변경</div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sortedCategories.map(cat => cat.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {sortedCategories.map((category) => (
                    <SortableCategoryItem
                      key={category.id}
                      category={category}
                      onEdit={() => setEditingCategory(category)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* 새 섹션 추가 */}
          {!showAddForm ? (
            <CButton
              onClick={() => setShowAddForm(true)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 border-2 border-dashed border-gray-600 hover:border-gray-500"
            >
              + 새 섹션 추가
            </CButton>
          ) : (
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-light">섹션 이름</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-0 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  placeholder="예: 저축, 투자, 취미 등"
                  autoFocus
                />
              </div>

              <ColorPicker selectedColor={newColor} onSelect={setNewColor} />

              <IconPicker selectedIcon={newIcon} onSelect={setNewIcon} />

              <div className="flex gap-2">
                <CButton
                  onClick={() => {
                    setShowAddForm(false);
                    setNewName('');
                    setNewColor('blue');
                    setNewIcon('📊');
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  취소
                </CButton>
                <CButton
                  onClick={handleAddCategory}
                  disabled={!newName.trim()}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  추가
                </CButton>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* 편집 모달 */}
      {editingCategory && (
        <CategoryEditModal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          category={editingCategory}
        />
      )}
    </>
  );
};

export default CategoryManagementModal;
