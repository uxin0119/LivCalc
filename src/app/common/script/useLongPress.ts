// hooks/useLongPress.ts
import { useCallback, useRef, useState } from 'react';

interface UseLongPressOptions {
  onLongPress?: () => void; // optional로 변경
  delay?: number;
  onClick?: () => void;
}

interface UseLongPressReturn {
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onTouchCancel: (e: React.TouchEvent) => void;
  };
  isPressed: boolean;
}

const useLongPress = ({
  onLongPress,
  delay = 1000,
  onClick
}: UseLongPressOptions): UseLongPressReturn => {
  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const preventClickRef = useRef(false);

  const start = useCallback(() => {
    if (!onLongPress) return; // 안전 체크 추가
    
    setIsPressed(true);
    preventClickRef.current = false;
    
    timerRef.current = setTimeout(() => {
      if (typeof onLongPress === 'function') { // 함수인지 확인
        onLongPress();
        preventClickRef.current = true;
      }
    }, delay);
  }, [onLongPress, delay]);

  const clear = useCallback(() => {
    setIsPressed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    start();
  }, [start]);

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    clear();
    
    // 롱 프레스가 발생하지 않았고 onClick이 있으면 실행
    if (!preventClickRef.current && onClick && typeof onClick === 'function') {
      onClick();
    }
  }, [clear, onClick]);

  const onMouseLeave = useCallback((e: React.MouseEvent) => {
    clear();
  }, [clear]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    start();
  }, [start]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    clear();
    
    // 롱 프레스가 발생하지 않았고 onClick이 있으면 실행
    if (!preventClickRef.current && onClick && typeof onClick === 'function') {
      onClick();
    }
  }, [clear, onClick]);

  const onTouchCancel = useCallback((e: React.TouchEvent) => {
    clear();
  }, [clear]);

  return {
    handlers: {
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onTouchStart,
      onTouchEnd,
      onTouchCancel,
    },
    isPressed
  };
};

export default useLongPress;