import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CSelect, { SelectOption } from './CSelect';

const sampleOptions: SelectOption[] = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
  { value: 'option4', label: '옵션 4 (비활성화)', disabled: true },
];

const categoryOptions: SelectOption[] = [
  { value: 'food', label: '식비' },
  { value: 'transport', label: '교통비' },
  { value: 'housing', label: '주거비' },
  { value: 'entertainment', label: '여가비' },
  { value: 'etc', label: '기타' },
];

const meta: Meta<typeof CSelect> = {
  title: 'UI/CSelect',
  component: CSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '선택창 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    required: {
      control: 'boolean',
      description: '필수 입력',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CSelect>;

// 상태 관리를 위한 래퍼 컴포넌트
const SelectWrapper = (args: Parameters<typeof CSelect>[0]) => {
  const [value, setValue] = useState(args.value || '');
  return <CSelect {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  args: {
    options: sampleOptions,
    placeholder: '선택하세요',
    size: 'md',
    value: '',
  },
  render: (args) => <SelectWrapper {...args} />,
};

export const WithValue: Story = {
  args: {
    options: sampleOptions,
    value: 'option2',
    size: 'md',
  },
  render: (args) => <SelectWrapper {...args} />,
};

export const CategorySelect: Story = {
  args: {
    options: categoryOptions,
    placeholder: '카테고리 선택',
    size: 'md',
    value: '',
  },
  render: (args) => <SelectWrapper {...args} />,
};

export const Small: Story = {
  args: {
    options: sampleOptions,
    placeholder: '작은 선택창',
    size: 'sm',
    value: '',
  },
  render: (args) => <SelectWrapper {...args} />,
};

export const Large: Story = {
  args: {
    options: sampleOptions,
    placeholder: '큰 선택창',
    size: 'lg',
    value: '',
  },
  render: (args) => <SelectWrapper {...args} />,
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    value: 'option1',
    disabled: true,
    size: 'md',
  },
  render: (args) => <SelectWrapper {...args} />,
};

export const Required: Story = {
  args: {
    options: sampleOptions,
    placeholder: '필수 선택',
    required: true,
    size: 'md',
    value: '',
  },
  render: (args) => <SelectWrapper {...args} />,
};

export const AllSizes: Story = {
  render: () => {
    const [sm, setSm] = useState('');
    const [md, setMd] = useState('');
    const [lg, setLg] = useState('');

    return (
      <div className="flex flex-col gap-4 w-64">
        <CSelect
          options={sampleOptions}
          size="sm"
          value={sm}
          onChange={setSm}
          placeholder="Small"
        />
        <CSelect
          options={sampleOptions}
          size="md"
          value={md}
          onChange={setMd}
          placeholder="Medium"
        />
        <CSelect
          options={sampleOptions}
          size="lg"
          value={lg}
          onChange={setLg}
          placeholder="Large"
        />
      </div>
    );
  },
};
