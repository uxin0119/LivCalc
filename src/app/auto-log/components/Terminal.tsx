'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { LogEntry } from '../types/game';

interface TerminalProps {
  logs: LogEntry[];
  autoScroll?: boolean;
  children?: ReactNode;
}

export default function Terminal({ logs, autoScroll = true, children }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const getLogColor = (type: LogEntry['type']): string => {
    switch (type) {
      case 'system':
        return 'text-green-400';
      case 'player':
        return 'text-cyan-400';
      case 'enemy':
        return 'text-red-400';
      case 'combat':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-500 font-bold';
      case 'success':
        return 'text-green-500 font-bold';
      case 'warning':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatMessage = (message: string): string => {
    // 프로그레스 바 처리
    if (message.includes('[') && message.includes(']') && message.includes('█')) {
      return message;
    }
    return message;
  };

  return (
    <div
      className="bg-black rounded-lg border border-green-500/30 shadow-lg shadow-green-500/20 h-full flex flex-col"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(0,255,0,0.03) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      {/* 로그 영역 - 스크롤 가능 */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm terminal-scrollbar"
      >
        {logs.length === 0 && (
          <div className="text-gray-600 italic">
            [SYSTEM] Awaiting initialization...
          </div>
        )}

        {logs.map((log, index) => (
          <div
            key={log.id}
            className={`${getLogColor(log.type)} ${log.animate ? 'animate-fadeIn' : ''} mb-1`}
            style={{
              animationDelay: `${index * 50}ms`,
              textShadow: log.type === 'error' || log.type === 'success'
                ? '0 0 5px currentColor'
                : 'none'
            }}
          >
            <span className="text-gray-600">{log.timestamp}</span>
            <span className="ml-2">{formatMessage(log.message)}</span>
          </div>
        ))}
      </div>

      {/* 명령어 입력 영역 - 하단 고정 */}
      {children && (
        <div className="p-4 pt-0">
          {children}
        </div>
      )}
    </div>
  );
}
