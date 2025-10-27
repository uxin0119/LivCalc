'use client';

import type { OfflineProgressResult } from '@/utils/offlineProgress';
import { formatOfflineTime } from '@/utils/offlineProgress';

interface OfflineProgressModalProps {
  progress: OfflineProgressResult;
  onDismiss: () => void;
}

export default function OfflineProgressModal({ progress, onDismiss }: OfflineProgressModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 p-6 max-w-md w-full mx-4 shadow-lg">
        <div className="font-mono space-y-4">
          {/* 타이틀 */}
          <div className="text-sm text-gray-700 font-semibold">
            Background Process Complete
          </div>

          {/* 시간 */}
          <div className="text-xs text-gray-500">
            Time elapsed: {formatOfflineTime(progress.timeAwaySeconds)}
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-200" />

          {/* 진행 결과 */}
          <div className="space-y-2 text-xs">
            <ResultItem label="Gold Earned" value={Math.floor(progress.goldEarned)} />
            <ResultItem label="Experience Gained" value={Math.floor(progress.expEarned)} />
            <ResultItem label="Targets Eliminated" value={progress.enemiesDefeated} />
            {progress.levelsGained > 0 && (
              <ResultItem
                label="Levels Gained"
                value={progress.levelsGained}
                highlight
              />
            )}
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={onDismiss}
            className="w-full mt-4 px-4 py-2 bg-gray-100 border border-gray-300
                       hover:bg-gray-200 transition-colors text-xs font-mono"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={highlight ? 'text-gray-700 font-semibold' : 'text-gray-500'}>
        {label}:
      </span>
      <span className={highlight ? 'text-gray-800 font-bold' : 'text-gray-700'}>
        {value.toLocaleString()}
      </span>
    </div>
  );
}
