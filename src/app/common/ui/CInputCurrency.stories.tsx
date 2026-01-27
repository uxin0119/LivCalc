import type { Meta, StoryObj } from '@storybook/react';
import CInputCurrency from './CInputCurrency';

const meta: Meta<typeof CInputCurrency> = {
  title: 'Common/UI/CInputCurrency',
  component: CInputCurrency,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CInputCurrency>;

export const Default: Story = {
  args: {
    value: 0,
    placeholder: '금액을 입력하세요',
    onChange: (val) => console.log('Changed:', val),
  },
};

export const WithInitialValue: Story = {
  args: {
    value: 1234567,
    placeholder: '금액을 입력하세요',
    onChange: (val) => console.log('Changed:', val),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    value: 1000,
    onChange: (val) => console.log('Changed:', val),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    value: 10000000,
    onChange: (val) => console.log('Changed:', val),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 50000,
    onChange: (val) => console.log('Changed:', val),
  },
};
