import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CInput from './CInput';

const meta: Meta<typeof CInput> = {
  title: 'UI/CInput',
  component: CInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'number', 'password', 'currency'],
      description: '입력 타입',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '입력창 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    readOnly: {
      control: 'boolean',
      description: '읽기 전용',
    },
    selectOnFocus: {
      control: 'boolean',
      description: '포커스 시 전체 선택',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CInput>;

// 상태 관리를 위한 래퍼 컴포넌트
const InputWrapper = (args: Parameters<typeof CInput>[0]) => {
  const [value, setValue] = useState(args.value?.toString() || '');
  return <CInput {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: '텍스트를 입력하세요',
    size: 'md',
    value: '',
  },
  render: (args) => <InputWrapper {...args} />,
};

export const WithValue: Story = {
  args: {
    type: 'text',
    value: '입력된 텍스트',
    size: 'md',
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '숫자 입력',
    size: 'md',
    value: '',
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '비밀번호',
    size: 'md',
    value: '',
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Currency: Story = {
  args: {
    type: 'currency',
    placeholder: '금액 입력',
    size: 'md',
    value: "1000000",
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Small: Story = {
  args: {
    type: 'text',
    placeholder: '작은 입력창',
    size: 'sm',
    value: '',
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Large: Story = {
  args: {
    type: 'text',
    placeholder: '큰 입력창',
    size: 'lg',
    value: '',
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Disabled: Story = {
  args: {
    type: 'text',
    value: '비활성화됨',
    disabled: true,
    size: 'md',
  },
  render: (args) => <InputWrapper {...args} />,
};

export const ReadOnly: Story = {
  args: {
    type: 'text',
    value: '읽기 전용',
    readOnly: true,
    size: 'md',
  },
  render: (args) => <InputWrapper {...args} />,
};

export const SelectOnFocus: Story = {
  args: {
    type: 'text',
    value: '클릭하면 전체 선택',
    selectOnFocus: true,
    size: 'md',
  },
  render: (args) => <InputWrapper {...args} />,
};

export const AllTypes: Story = {
  render: () => {
    const [text, setText] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [currency, setCurrency] = useState('');

    return (
      <div className="flex flex-col gap-4 w-64">
        <CInput type="text" value={text} onChange={setText} placeholder="Text" />
        <CInput type="number" value={number} onChange={setNumber} placeholder="Number" />
        <CInput type="password" value={password} onChange={setPassword} placeholder="Password" />
        <CInput type="currency" value={currency} onChange={setCurrency} placeholder="Currency" />
      </div>
    );
  },
};

export const AllSizes: Story = {
  render: () => {
    const [sm, setSm] = useState('');
    const [md, setMd] = useState('');
    const [lg, setLg] = useState('');

    return (
      <div className="flex flex-col gap-4 w-64">
        <CInput size="sm" value={sm} onChange={setSm} placeholder="Small" />
        <CInput size="md" value={md} onChange={setMd} placeholder="Medium" />
        <CInput size="lg" value={lg} onChange={setLg} placeholder="Large" />
      </div>
    );
  },
};
