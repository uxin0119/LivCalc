import type { Meta, StoryObj } from '@storybook/react';
import FloatingMenu from './FloatingMenu';

const meta: Meta<typeof FloatingMenu> = {
  title: 'Components/FloatingMenu',
  component: FloatingMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onExport: { action: 'onExport' },
    onSave: { action: 'onSave' },
    onLoad: { action: 'onLoad' },
    onManageCategories: { action: 'onManageCategories' },
  },
  args: {
    onExport: () => console.log('Export clicked'),
    onSave: () => console.log('Save clicked'),
    onLoad: () => console.log('Load clicked'),
    onManageCategories: () => console.log('Manage Categories clicked'),
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-[400px] bg-gray-900">
        <div className="p-4 text-gray-400">
          <p>오른쪽 하단의 + 버튼을 클릭하여 메뉴를 열어보세요.</p>
          <p className="mt-2 text-sm">메뉴가 열리면 버튼이 45도 회전합니다.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FloatingMenu>;

export const Default: Story = {};

export const ExportOnly: Story = {
  args: {
    onSave: undefined,
    onLoad: undefined,
    onManageCategories: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: '공유 버튼만 표시됩니다.',
      },
    },
  },
};

export const WithSaveLoad: Story = {
  args: {
    onManageCategories: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: '공유, 저장, 불러오기 버튼이 표시됩니다.',
      },
    },
  },
};

export const AllFeatures: Story = {
  parameters: {
    docs: {
      description: {
        story: '모든 기능(공유, 저장, 불러오기, 섹션 관리)이 활성화된 상태입니다.',
      },
    },
  },
};

export const InContext: Story = {
  decorators: [
    (Story) => (
      <div className="relative w-full h-[600px] bg-gray-900 overflow-auto">
        <div className="p-4">
          <h1 className="text-white text-xl mb-4">생활비 계산기</h1>
          <div className="space-y-4">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-300">항목 {i + 1}</p>
                <p className="text-gray-500 text-sm">금액: ₩{(10000 * (i + 1)).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '실제 사용 컨텍스트를 시뮬레이션합니다. 스크롤해도 플로팅 메뉴가 고정됩니다.',
      },
    },
  },
};
