'use client';

interface ClickAreaProps {
  onClick: () => void;
  currentHealth: number;
  maxHealth: number;
}

export default function ClickArea({ onClick, currentHealth, maxHealth }: ClickAreaProps) {
  const healthPercentage = (currentHealth / maxHealth) * 100;

  return (
    <div className="flex flex-col gap-2">
      {/* 진행률 표시 (체력바처럼 보이지만 프로그레스바처럼 위장) */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-500 font-mono">Progress:</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-sm overflow-hidden">
          <div
            className="h-full bg-gray-400 transition-all duration-200"
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
        <span className="text-gray-600 font-mono text-xs">
          {currentHealth}/{maxHealth}
        </span>
      </div>

      {/* 클릭 영역 */}
      <button
        onClick={onClick}
        className="w-full h-48 bg-gray-100 border border-gray-300
                   hover:bg-gray-200 active:bg-gray-300
                   transition-colors duration-100
                   flex items-center justify-center
                   font-mono text-gray-600 text-sm
                   select-none cursor-pointer"
      >
        Execute
      </button>
    </div>
  );
}
