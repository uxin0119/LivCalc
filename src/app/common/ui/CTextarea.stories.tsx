import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CTextarea from './CTextarea';

const meta: Meta<typeof CTextarea> = {
  title: 'UI/CTextarea',
  component: CTextarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '텍스트 영역 크기',
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: '표시할 줄 수',
    },
    resize: {
      control: 'boolean',
      description: '크기 조절 가능 여부',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    readOnly: {
      control: 'boolean',
      description: '읽기 전용',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CTextarea>;

// 상태 관리를 위한 래퍼 컴포넌트
const TextareaWrapper = (args: Parameters<typeof CTextarea>[0]) => {
  const [value, setValue] = useState(args.value || '');
  return <CTextarea {...args} value={value} onChange={setValue} className="w-64" />;
};

export const Default: Story = {
  args: {
    placeholder: '내용을 입력하세요...',
    size: 'md',
    rows: 4,
    value: '',
  },
  render: (args) => <TextareaWrapper {...args} />,
};

export const WithValue: Story = {
  args: {
    value: '이미 입력된 텍스트입니다.\n여러 줄로 작성할 수 있습니다.',
    size: 'md',
    rows: 4,
  },
  render: (args) => <TextareaWrapper {...args} />,
};

export const Small: Story = {
  args: {
    placeholder: '작은 텍스트 영역',
    size: 'sm',
    rows: 3,
    value: '',
  },
  render: (args) => <TextareaWrapper {...args} />,
};

export const Large: Story = {
  args: {
    placeholder: '큰 텍스트 영역',
    size: 'lg',
    rows: 6,
    value: '',
  },
  render: (args) => <TextareaWrapper {...args} />,
};

export const NoResize: Story = {
  args: {
    placeholder: '크기 조절 불가',
    size: 'md',
    rows: 4,
    resize: false,
    value: '',
  },
  render: (args) => <TextareaWrapper {...args} />,
};

export const Disabled: Story = {
  args: {
    value: '비활성화된 텍스트 영역',
    disabled: true,
    size: 'md',
    rows: 4,
  },
  render: (args) => <TextareaWrapper {...args} />,
};

export const ReadOnly: Story = {
  args: {
    value: '읽기 전용 텍스트 영역입니다.\n수정할 수 없습니다.',
    readOnly: true,
    size: 'md',
    rows: 4,
  },
  render: (args) => <TextareaWrapper {...args} />,
};

export const ManyRows: Story = {
  args: {
    placeholder: '많은 줄을 표시합니다',
    size: 'md',
    rows: 10,
    value: '',
  },
  render: (args) => <TextareaWrapper {...args} />,
};

export const AllSizes: Story = {
  render: () => {
    const [sm, setSm] = useState('');
    const [md, setMd] = useState('');
    const [lg, setLg] = useState('');

    return (
      <div className="flex flex-col gap-4 w-64">
        <CTextarea size="sm" value={sm} onChange={setSm} placeholder="Small" rows={2} />
        <CTextarea size="md" value={md} onChange={setMd} placeholder="Medium" rows={3} />
        <CTextarea size="lg" value={lg} onChange={setLg} placeholder="Large" rows={4} />
      </div>
    );
  },
};
