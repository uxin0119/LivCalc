"use client";
import React, { useState } from 'react';
import Modal from '@/app/common/components/Modal';
import CategoryData from './CategoryData';
import useCalcStore from './store';
import CButton from '@/app/common/ui/CButton';

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryData;
}

const CategoryEditModal: React.FC<CategoryEditModalProps> = ({ isOpen, onClose, category }) => {
  const { updateCategory, removeCategory, items } = useCalcStore();
  const [name, setName] = useState(category.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const itemCount = items.filter(item => item.category === category.id).length;

  const handleSave = () => {
    updateCategory(category.id, { name });
    onClose();
  };

  const handleDelete = () => {
    removeCategory(category.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="섹션 편집">
      <div className="space-y-6">
        {/* 섹션 이름 */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300 font-light">섹션 이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-0 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            placeholder="섹션 이름을 입력하세요"
          />
        </div>

        {/* 저장 버튼 */}
        <CButton
          onClick={handleSave}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
        >
          저장
        </CButton>

        {/* 삭제 영역 */}
        <div className="pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-3">위험한 작업</div>
          {!showDeleteConfirm ? (
            <CButton
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-gray-800 hover:bg-red-900 text-white border border-gray-600 hover:border-red-800 font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              섹션 삭제
            </CButton>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-300">
                <p className="font-medium mb-1">정말 삭제하시겠습니까?</p>
                <p>이 섹션에 속한 {itemCount}개의 항목도 함께 삭제됩니다.</p>
              </div>
              <div className="flex gap-2">
                <CButton
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  취소
                </CButton>
                <CButton
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  삭제 확인
                </CButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CategoryEditModal;
