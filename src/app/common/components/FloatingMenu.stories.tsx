import type { Meta, StoryObj } from '@storybook/react';
import FloatingMenu from './FloatingMenu';

const meta: Meta<typeof FloatingMenu> = {
  title: 'Components/FloatingMenu',
  component: FloatingMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onManageCategories: { action: 'onManageCategories' },
  },
};

export default meta;
type Story = StoryObj<typeof FloatingMenu>;

export const Default: Story = {
  args: {
    onManageCategories: () => console.log('Manage Categories clicked'),
  },
};