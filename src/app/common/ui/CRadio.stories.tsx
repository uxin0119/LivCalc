import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CRadio, { RadioOption } from './CRadio';

const basicOptions: RadioOption[] = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
];

const paymentOptions: RadioOption[] = [
  { value: 'card', label: '신용카드' },
  { value: 'bank', label: '계좌이체' },
  { value: 'cash', label: '현금' },
  { value: 'point', label: '포인트', disabled: true },
];

const frequencyOptions: RadioOption[] = [
  { value: 'daily', label: '매일' },
  { value: 'weekly', label: '매주' },
  { value: 'monthly', label: '매월' },
  { value: 'yearly', label: '매년' },
];

const meta: Meta<typeof CRadio> = {
  title: 'UI/CRadio',
  component: CRadio,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '배치 방향',
    },
    disabled: {
      control: 'boolean',
      description: '전체 비활성화',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CRadio>;

// 상태 관리를 위한 래퍼 컴포넌트
const RadioWrapper = (args: Parameters<typeof CRadio>[0]) => {
  const [value, setValue] = useState(args.value || '');
  return <CRadio {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  args: {
    name: 'default-radio',
    options: basicOptions,
    direction: 'horizontal',
  },
  render: (args) => <RadioWrapper {...args} />,
};

export const WithSelection: Story = {
  args: {
    name: 'selected-radio',
    options: basicOptions,
    value: 'option2',
    direction: 'horizontal',
  },
  render: (args) => <RadioWrapper {...args} />,
};

export const Vertical: Story = {
  args: {
    name: 'vertical-radio',
    options: basicOptions,
    direction: 'vertical',
  },
  render: (args) => <RadioWrapper {...args} />,
};

export const PaymentMethod: Story = {
  args: {
    name: 'payment-radio',
    options: paymentOptions,
    direction: 'horizontal',
  },
  render: (args) => <RadioWrapper {...args} />,
};

export const Frequency: Story = {
  args: {
    name: 'frequency-radio',
    options: frequencyOptions,
    direction: 'vertical',
  },
  render: (args) => <RadioWrapper {...args} />,
};

export const Disabled: Story = {
  args: {
    name: 'disabled-radio',
    options: basicOptions,
    value: 'option1',
    disabled: true,
    direction: 'horizontal',
  },
  render: (args) => <RadioWrapper {...args} />,
};

export const WithDisabledOption: Story = {
  args: {
    name: 'partial-disabled-radio',
    options: paymentOptions,
    direction: 'horizontal',
  },
  render: (args) => <RadioWrapper {...args} />,
};

export const BothDirections: Story = {
  render: () => {
    const [horizontal, setHorizontal] = useState('');
    const [vertical, setVertical] = useState('');

    return (
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-gray-400 text-sm mb-2">Horizontal</p>
          <CRadio
            name="horizontal-demo"
            options={basicOptions}
            value={horizontal}
            onChange={setHorizontal}
            direction="horizontal"
          />
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-2">Vertical</p>
          <CRadio
            name="vertical-demo"
            options={basicOptions}
            value={vertical}
            onChange={setVertical}
            direction="vertical"
          />
        </div>
      </div>
    );
  },
};
