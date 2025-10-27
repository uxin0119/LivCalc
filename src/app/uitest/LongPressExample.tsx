// components/LongPressTest.tsx
import React, { useCallback } from 'react';
import useLongPress from '@/app/common/script/useLongPress';

const LongPressTest: React.FC = () => {
  const handleLongPress = useCallback(() => {
    console.log('Long press detected!');
    alert('롱 프레스 성공!');
  }, []);

  const handleClick = useCallback(() => {
    console.log('Click detected!');
  }, []);

  const { handlers, isPressed } = useLongPress({
    onLongPress: handleLongPress,
    onClick: handleClick,
    delay: 1000
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">롱 프레스 테스트</h2>
      
      <div
        {...handlers}
        className={`
          inline-block px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer
          select-none transition-all duration-150
          ${isPressed 
            ? 'bg-blue-700 scale-95' 
            : 'hover:bg-blue-600'
          }
        `}
      >
        1초간 눌러보세요
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>상태: {isPressed ? '눌림' : '대기'}</p>
        <p>콘솔을 확인해주세요.</p>
      </div>
    </div>
  );
};

export default LongPressTest;