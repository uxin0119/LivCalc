'use client';

import { Process } from '../types/game';

interface HandDisplayProps {
  hand: Process[];
  threads: number;
  onCardClick?: (process: Process) => void;
}

export default function HandDisplay({ hand, threads, onCardClick }: HandDisplayProps) {
  const getCardTypeColor = (type: Process['type']): string => {
    switch (type) {
      case 'attack':
        return 'border-red-500/50 bg-red-950/30 hover:bg-red-900/40';
      case 'defend':
        return 'border-blue-500/50 bg-blue-950/30 hover:bg-blue-900/40';
      case 'heal':
        return 'border-green-500/50 bg-green-950/30 hover:bg-green-900/40';
      case 'utility':
        return 'border-purple-500/50 bg-purple-950/30 hover:bg-purple-900/40';
      default:
        return 'border-gray-500/50 bg-gray-950/30 hover:bg-gray-900/40';
    }
  };

  const getCardTypeIcon = (type: Process['type']): string => {
    switch (type) {
      case 'attack':
        return '⚔️';
      case 'defend':
        return '🛡️';
      case 'heal':
        return '❤️';
      case 'utility':
        return '🔧';
      default:
        return '📄';
    }
  };

  if (hand.length === 0) {
    return (
      <div className="bg-black border border-gray-700 rounded-lg p-4 text-center">
        <div className="text-gray-600 font-mono text-sm">
          [NO_PROCESSES] Queue is empty
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-cyan-500/50 rounded-lg p-4 shadow-lg shadow-cyan-500/20">
      <div className="text-cyan-400 text-sm font-bold font-mono mb-3 flex items-center justify-between">
        <span>AVAILABLE PROCESSES [{hand.length}]</span>
        <span className="text-blue-400">THREADS: {threads}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {hand.map((process) => {
          const canPlay = threads >= process.cycles;
          const cardColor = getCardTypeColor(process.type);

          return (
            <div
              key={process.id}
              onClick={() => canPlay && onCardClick?.(process)}
              className={`
                ${cardColor}
                border-2 rounded-lg p-3 font-mono text-xs
                transition-all duration-200
                ${canPlay
                  ? 'cursor-pointer hover:scale-105 hover:shadow-lg'
                  : 'opacity-50 cursor-not-allowed grayscale'
                }
              `}
            >
              {/* 프로세스 헤더 */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{getCardTypeIcon(process.type)}</span>
                <span
                  className={`
                    px-2 py-0.5 rounded text-xs font-bold
                    ${canPlay ? 'bg-green-600/50 text-green-200' : 'bg-gray-700/50 text-gray-400'}
                  `}
                >
                  {process.cycles} ⚡
                </span>
              </div>

              {/* 프로세스 이름 */}
              <div className="text-white font-bold text-sm mb-1 truncate" title={process.name}>
                {process.name}
              </div>

              {/* 실행 파일명 */}
              <div className="text-cyan-400 text-xs mb-2 truncate font-mono" title={process.executable}>
                {'>'} {process.executable}
              </div>

              {/* 효과 */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-400 font-bold text-lg">
                  {process.throughput}
                </span>
                <span className="text-gray-500 text-xs uppercase">
                  {process.type}
                </span>
              </div>

              {/* 설명 */}
              <div className="text-gray-400 text-xs border-t border-gray-700 pt-2">
                {process.description}
              </div>

              {/* 클릭 힌트 */}
              {canPlay && (
                <div className="text-center mt-2 text-green-400 text-xs animate-pulse">
                  [CLICK or TYPE]
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 추가 정보 */}
      <div className="mt-3 pt-3 border-t border-cyan-500/30 text-xs text-gray-500 font-mono">
        <div className="flex justify-between">
          <span>Click processes to play or type their names</span>
          <span>Grayed processes = insufficient threads</span>
        </div>
      </div>
    </div>
  );
}
