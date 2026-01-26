import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SortableList from './SortableList';
import SortableItem from './SortableItem';
import { arrayMove } from '@dnd-kit/sortable';
import IconGrabbable from '../icon/icon_grabbable';

interface DemoItem {
  id: string;
  name: string;
  value: number;
  type: 'income' | 'expense';
}

const meta: Meta<typeof SortableList> = {
  title: 'Components/SortableList',
  component: SortableList,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SortableList>;

// 기본 데모 아이템
const createDemoItems = (): DemoItem[] => [
  { id: '1', name: '월급', value: 3000000, type: 'income' },
  { id: '2', name: '월세', value: 500000, type: 'expense' },
  { id: '3', name: '식비', value: 300000, type: 'expense' },
  { id: '4', name: '교통비', value: 100000, type: 'expense' },
  { id: '5', name: '부업 수입', value: 500000, type: 'income' },
];

// 기본 수직 리스트
const VerticalListDemo = () => {
  const [items, setItems] = useState<DemoItem[]>(createDemoItems());

  const handleDragEnd = (activeId: string, overId: string) => {
    const oldIndex = items.findIndex(item => item.id === activeId);
    const newIndex = items.findIndex(item => item.id === overId);
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className="w-80">
      <h3 className="text-white text-lg mb-4">수입/지출 목록</h3>
      <SortableList
        items={items}
        onDragEnd={handleDragEnd}
        strategy="vertical"
        className="space-y-2"
      >
        {items.map(item => (
          <SortableItem
            key={item.id}
            id={item.id}
            className="bg-gray-800 rounded-lg overflow-hidden"
            draggingClassName="opacity-70 shadow-xl ring-2 ring-blue-500"
          >
            {({ isDragging, dragHandleProps }) => (
              <div className={`flex items-center ${isDragging ? 'bg-gray-700' : ''}`}>
                {/* 드래그 핸들 */}
                <div
                  {...dragHandleProps.attributes}
                  {...dragHandleProps.listeners}
                  style={dragHandleProps.style}
                  className="flex items-center justify-center w-10 h-16 bg-gray-700 hover:bg-gray-600 cursor-grab active:cursor-grabbing"
                >
                  <IconGrabbable />
                </div>

                {/* 콘텐츠 */}
                <div className="flex-1 px-4 py-3">
                  <div className="text-white font-medium">{item.name}</div>
                  <div className={item.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                    {item.type === 'income' ? '+' : '-'}
                    {item.value.toLocaleString()}원
                  </div>
                </div>
              </div>
            )}
          </SortableItem>
        ))}
      </SortableList>
    </div>
  );
};

export const Vertical: Story = {
  render: () => <VerticalListDemo />,
};

// 수평 리스트
const HorizontalListDemo = () => {
  const [items, setItems] = useState([
    { id: 'a', label: '1월', color: 'bg-blue-500' },
    { id: 'b', label: '2월', color: 'bg-green-500' },
    { id: 'c', label: '3월', color: 'bg-yellow-500' },
    { id: 'd', label: '4월', color: 'bg-red-500' },
    { id: 'e', label: '5월', color: 'bg-purple-500' },
  ]);

  const handleDragEnd = (activeId: string, overId: string) => {
    const oldIndex = items.findIndex(item => item.id === activeId);
    const newIndex = items.findIndex(item => item.id === overId);
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div>
      <h3 className="text-white text-lg mb-4">월별 탭 (수평 드래그)</h3>
      <SortableList
        items={items}
        onDragEnd={handleDragEnd}
        strategy="horizontal"
        className="flex gap-2"
      >
        {items.map(item => (
          <SortableItem
            key={item.id}
            id={item.id}
            className={`${item.color} rounded-lg`}
            draggingClassName="opacity-70 shadow-xl scale-105"
          >
            {({ dragHandleProps }) => (
              <div
                {...dragHandleProps.attributes}
                {...dragHandleProps.listeners}
                style={dragHandleProps.style}
                className="px-6 py-3 text-white font-medium cursor-grab active:cursor-grabbing"
              >
                {item.label}
              </div>
            )}
          </SortableItem>
        ))}
      </SortableList>
    </div>
  );
};

export const Horizontal: Story = {
  render: () => <HorizontalListDemo />,
};

// 그리드 레이아웃
const GridListDemo = () => {
  const [items, setItems] = useState([
    { id: '1', icon: '🍎', name: '사과' },
    { id: '2', icon: '🍌', name: '바나나' },
    { id: '3', icon: '🍇', name: '포도' },
    { id: '4', icon: '🍊', name: '오렌지' },
    { id: '5', icon: '🍓', name: '딸기' },
    { id: '6', icon: '🥝', name: '키위' },
  ]);

  const handleDragEnd = (activeId: string, overId: string) => {
    const oldIndex = items.findIndex(item => item.id === activeId);
    const newIndex = items.findIndex(item => item.id === overId);
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div>
      <h3 className="text-white text-lg mb-4">카테고리 그리드</h3>
      <SortableList
        items={items}
        onDragEnd={handleDragEnd}
        strategy="grid"
        className="grid grid-cols-3 gap-3 w-72"
      >
        {items.map(item => (
          <SortableItem
            key={item.id}
            id={item.id}
            className="bg-gray-800 rounded-xl"
            draggingClassName="opacity-70 shadow-xl ring-2 ring-blue-500"
          >
            {({ dragHandleProps }) => (
              <div
                {...dragHandleProps.attributes}
                {...dragHandleProps.listeners}
                style={dragHandleProps.style}
                className="flex flex-col items-center justify-center p-4 cursor-grab active:cursor-grabbing"
              >
                <span className="text-3xl mb-2">{item.icon}</span>
                <span className="text-white text-sm">{item.name}</span>
              </div>
            )}
          </SortableItem>
        ))}
      </SortableList>
    </div>
  );
};

export const Grid: Story = {
  render: () => <GridListDemo />,
};

// 드래그 오버레이
const WithOverlayDemo = () => {
  const [items, setItems] = useState<DemoItem[]>(createDemoItems());

  const handleDragEnd = (activeId: string, overId: string) => {
    const oldIndex = items.findIndex(item => item.id === activeId);
    const newIndex = items.findIndex(item => item.id === overId);
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  const renderOverlay = (activeId: string | number | null) => {
    const item = items.find(i => i.id === activeId);
    if (!item) return null;

    return (
      <div className="bg-blue-600 rounded-lg px-4 py-3 shadow-2xl">
        <div className="text-white font-medium">{item.name}</div>
        <div className="text-blue-200">
          {item.type === 'income' ? '+' : '-'}
          {item.value.toLocaleString()}원
        </div>
      </div>
    );
  };

  return (
    <div className="w-80">
      <h3 className="text-white text-lg mb-4">커스텀 드래그 오버레이</h3>
      <p className="text-gray-400 text-sm mb-4">드래그 시 커스텀 오버레이가 표시됩니다</p>
      <SortableList
        items={items}
        onDragEnd={handleDragEnd}
        strategy="vertical"
        className="space-y-2"
        dragOverlay={renderOverlay}
      >
        {items.map(item => (
          <SortableItem
            key={item.id}
            id={item.id}
            className="bg-gray-800 rounded-lg"
            draggingClassName="opacity-30"
          >
            {({ dragHandleProps }) => (
              <div
                {...dragHandleProps.attributes}
                {...dragHandleProps.listeners}
                style={dragHandleProps.style}
                className="flex items-center px-4 py-3 cursor-grab active:cursor-grabbing"
              >
                <div className="flex-1">
                  <div className="text-white font-medium">{item.name}</div>
                  <div className={item.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                    {item.type === 'income' ? '+' : '-'}
                    {item.value.toLocaleString()}원
                  </div>
                </div>
                <div className="text-gray-500">
                  <IconGrabbable />
                </div>
              </div>
            )}
          </SortableItem>
        ))}
      </SortableList>
    </div>
  );
};

export const WithDragOverlay: Story = {
  render: () => <WithOverlayDemo />,
};

// 비활성화 상태
const DisabledDemo = () => {
  const [items] = useState<DemoItem[]>(createDemoItems().slice(0, 3));

  return (
    <div className="w-80">
      <h3 className="text-white text-lg mb-4">드래그 비활성화</h3>
      <SortableList
        items={items}
        onDragEnd={() => {}}
        strategy="vertical"
        className="space-y-2"
        disabled
      >
        {items.map(item => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-lg px-4 py-3 opacity-60"
          >
            <div className="text-white font-medium">{item.name}</div>
            <div className="text-gray-400">
              {item.value.toLocaleString()}원
            </div>
          </div>
        ))}
      </SortableList>
      <p className="text-gray-500 text-sm mt-2">disabled=true 상태</p>
    </div>
  );
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
};

// 드래그 이벤트 콜백
const WithCallbacksDemo = () => {
  const [items, setItems] = useState<DemoItem[]>(createDemoItems().slice(0, 4));
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-4), message]);
  };

  const handleDragStart = (activeId: string) => {
    const item = items.find(i => i.id === activeId);
    addLog(`드래그 시작: ${item?.name}`);
  };

  const handleDragEnd = (activeId: string, overId: string) => {
    const activeItem = items.find(i => i.id === activeId);
    const overItem = items.find(i => i.id === overId);
    addLog(`이동: ${activeItem?.name} → ${overItem?.name} 위치`);

    const oldIndex = items.findIndex(item => item.id === activeId);
    const newIndex = items.findIndex(item => item.id === overId);
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className="w-96">
      <h3 className="text-white text-lg mb-4">이벤트 로그</h3>
      <SortableList
        items={items}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        strategy="vertical"
        className="space-y-2 mb-4"
      >
        {items.map(item => (
          <SortableItem
            key={item.id}
            id={item.id}
            className="bg-gray-800 rounded-lg"
            draggingClassName="opacity-70 shadow-xl ring-2 ring-blue-500"
          >
            {({ dragHandleProps }) => (
              <div
                {...dragHandleProps.attributes}
                {...dragHandleProps.listeners}
                style={dragHandleProps.style}
                className="flex items-center px-4 py-3 cursor-grab active:cursor-grabbing"
              >
                <div className="flex-1 text-white">{item.name}</div>
                <IconGrabbable />
              </div>
            )}
          </SortableItem>
        ))}
      </SortableList>

      <div className="bg-gray-800 rounded-lg p-3">
        <div className="text-gray-400 text-xs mb-2">이벤트 로그:</div>
        <div className="space-y-1">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-sm">아이템을 드래그해보세요</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-green-400 text-sm font-mono">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const WithEventCallbacks: Story = {
  render: () => <WithCallbacksDemo />,
};
