import type { Meta, StoryObj } from '@storybook/react';
import CButton from './CButton';

const meta: Meta<typeof CButton> = {
  title: 'UI/CButton',
  component: CButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: '버튼 스타일 변형',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof CButton>;

export const Primary: Story = {
  args: {
    children: '기본 버튼',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: '보조 버튼',
    variant: 'secondary',
    size: 'md',
  },
};

export const Danger: Story = {
  args: {
    children: '삭제',
    variant: 'danger',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    children: '작은 버튼',
    variant: 'primary',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: '큰 버튼',
    variant: 'primary',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    children: '비활성화',
    variant: 'primary',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <CButton variant="primary">Primary</CButton>
      <CButton variant="secondary">Secondary</CButton>
      <CButton variant="danger">Danger</CButton>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CButton size="sm">Small</CButton>
      <CButton size="md">Medium</CButton>
      <CButton size="lg">Large</CButton>
    </div>
  ),
};
