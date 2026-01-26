import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from './Modal';
import CButton from '../ui/CButton';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '70', 'full'],
      description: '모달 크기',
    },
    isOpen: {
      control: 'boolean',
      description: '모달 열림 상태',
    },
    title: {
      control: 'text',
      description: '모달 제목',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// 인터랙티브 모달 래퍼
const ModalWrapper = ({
  size = 'md',
  title = '모달 제목',
  children,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '70' | 'full';
  title?: string;
  children?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CButton onClick={() => setIsOpen(true)}>모달 열기</CButton>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title} size={size}>
        {children || (
          <div className="text-gray-300">
            <p>모달 내용입니다.</p>
            <p className="mt-2">ESC 키 또는 배경 클릭으로 닫을 수 있습니다.</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: () => <ModalWrapper />,
};

export const SmallSize: Story = {
  render: () => <ModalWrapper size="sm" title="작은 모달" />,
};

export const LargeSize: Story = {
  render: () => <ModalWrapper size="lg" title="큰 모달" />,
};

export const ExtraLargeSize: Story = {
  render: () => <ModalWrapper size="xl" title="아주 큰 모달" />,
};

export const SeventyPercent: Story = {
  render: () => <ModalWrapper size="70" title="70% 너비 모달" />,
};

export const FullSize: Story = {
  render: () => <ModalWrapper size="full" title="전체 너비 모달" />,
};

export const WithForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <CButton onClick={() => setIsOpen(true)}>폼 모달 열기</CButton>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="새 항목 추가" size="md">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">항목명</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-gray-800 text-white"
                placeholder="항목명을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">금액</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-gray-800 text-white"
                placeholder="금액을 입력하세요"
              />
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <CButton variant="secondary" onClick={() => setIsOpen(false)}>
                취소
              </CButton>
              <CButton variant="primary" onClick={() => setIsOpen(false)}>
                저장
              </CButton>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

export const WithLongContent: Story = {
  render: () => (
    <ModalWrapper title="스크롤 가능한 모달">
      <div className="text-gray-300 space-y-4">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>
            이것은 긴 내용입니다. 모달 내용이 길어지면 스크롤이 가능합니다. ({i + 1}/20)
          </p>
        ))}
      </div>
    </ModalWrapper>
  ),
};

export const ConfirmDialog: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <CButton variant="danger" onClick={() => setIsOpen(true)}>
          삭제하기
        </CButton>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="삭제 확인" size="sm">
          <div className="text-center">
            <p className="text-gray-300 mb-6">정말로 이 항목을 삭제하시겠습니까?</p>
            <div className="flex gap-2 justify-center">
              <CButton variant="secondary" onClick={() => setIsOpen(false)}>
                취소
              </CButton>
              <CButton variant="danger" onClick={() => setIsOpen(false)}>
                삭제
              </CButton>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};
