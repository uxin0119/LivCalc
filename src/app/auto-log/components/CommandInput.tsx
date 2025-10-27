'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Process } from '../types/game';

interface CommandInputProps {
  onCommand: (command: string) => void;
  availableCommands: string[];
  hand?: Process[];
  disabled?: boolean;
}

export interface CommandInputRef {
  focus: () => void;
}

const CommandInput = forwardRef<CommandInputRef, CommandInputProps>(({
  onCommand,
  availableCommands,
  hand = [],
  disabled = false
}, ref) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const suggestionsContainerRef = useRef<HTMLDivElement>(null);

  // 외부에서 포커스를 제어할 수 있도록 ref 노출
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  // 선택된 항목이 보이도록 스크롤 조정
  useEffect(() => {
    if (showSuggestions && suggestionRefs.current[selectedSuggestion] && suggestionsContainerRef.current) {
      const selectedElement = suggestionRefs.current[selectedSuggestion];
      const container = suggestionsContainerRef.current;

      if (selectedElement) {
        const elementTop = selectedElement.offsetTop;
        const elementBottom = elementTop + selectedElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        // 선택된 요소가 컨테이너 위쪽 밖에 있으면
        if (elementTop < containerTop) {
          container.scrollTop = elementTop;
        }
        // 선택된 요소가 컨테이너 아래쪽 밖에 있으면
        else if (elementBottom > containerBottom) {
          container.scrollTop = elementBottom - container.clientHeight;
        }
      }
    }
  }, [selectedSuggestion, showSuggestions]);

  useEffect(() => {
    if (input.length > 0) {
      const filtered = availableCommands.filter(cmd =>
        cmd.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestion(0);
    } else {
      setSuggestions(availableCommands);
      setShowSuggestions(false);
    }
  }, [input, availableCommands]);

  // disabled 해제 시 포커스 유지
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 제안이 표시되고 있으면 선택된 제안을 입력창에 채우기만 함
    if (showSuggestions && suggestions.length > 0) {
      setInput(suggestions[selectedSuggestion]);
      setShowSuggestions(false);
      return;
    }

    // 제안이 없을 때만 실제로 명령 실행
    const commandToExecute = input.trim();
    if (commandToExecute && !disabled) {
      onCommand(commandToExecute);
      setInput('');
      setShowSuggestions(false);

      // 명령 실행 후 포커스 유지
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        let selectedText = suggestions[selectedSuggestion];
        const descriptionIndex = selectedText.indexOf(' - ');
        if (descriptionIndex !== -1) {
          selectedText = selectedText.substring(0, descriptionIndex);
        }
        const cleanedSuggestion = selectedText;
        setInput(cleanedSuggestion);
        setShowSuggestions(false);
      }
    }
  };

  const selectSuggestion = (suggestion: string) => {
    let selectedText = suggestion;
    const descriptionIndex = selectedText.indexOf(' - ');
    if (descriptionIndex !== -1) {
      selectedText = selectedText.substring(0, descriptionIndex);
    }
    const cleanedSuggestion = selectedText;
    setInput(cleanedSuggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-green-400 font-mono text-lg">{'>'}</span>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? "Processing..." : "Enter command..."}
            className="w-full bg-transparent border-none outline-none text-green-400 font-mono text-lg placeholder-gray-600 disabled:text-gray-600"
            autoFocus
          />
        </div>
      </form>

      {/* 자동완성 제안 */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsContainerRef}
          className="absolute bottom-full left-8 mb-2 bg-black border border-green-500/50 rounded-lg p-2 min-w-64 max-h-80 overflow-y-auto z-50 shadow-lg shadow-green-500/20"
        >
          <div className="text-gray-500 text-xs mb-2 font-mono">Suggestions ({suggestions.length}):</div>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => {
              // 명령어가 카드인지 확인
              const cleanSuggestion = suggestion.replace(/^\//, '');
              const process = hand.find(c => c.executable === cleanSuggestion);

              // 타입 표시
              const getTypeTag = (type: string) => {
                switch(type) {
                  case 'attack': return '[ATK]';
                  case 'defend': return '[DEF]';
                  case 'heal': return '[HEAL]';
                  case 'utility': return '[UTIL]';
                  default: return '';
                }
              };

              const getTypeColor = (type: string) => {
                switch(type) {
                  case 'attack': return 'text-red-400';
                  case 'defend': return 'text-blue-400';
                  case 'heal': return 'text-green-400';
                  case 'utility': return 'text-purple-400';
                  default: return 'text-gray-400';
                }
              };

              const displayParts = suggestion.split(' - ');
              const commandPart = displayParts[0];
              const descriptionPart = displayParts.length > 1 ? displayParts.slice(1).join(' - ') : '';

              return (
                <div
                  key={`${suggestion}-${index}`}
                  ref={(el) => { suggestionRefs.current[index] = el; }}
                  onClick={() => selectSuggestion(suggestion)}
                  className={`px-3 py-2 rounded cursor-pointer font-mono text-sm transition-colors ${
                    index === selectedSuggestion
                      ? 'bg-green-500/20 text-green-300 border-l-2 border-green-400'
                      : 'text-green-400 hover:bg-green-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {process && (
                        <span className={`text-xs font-bold ${getTypeColor(process.type)}`}>
                          {getTypeTag(process.type)}
                        </span>
                      )}
                      <span>{commandPart}</span>
                    </span>
                    {descriptionPart && (
                      <span className="text-xs text-gray-500">{descriptionPart}</span>
                    )}
                    {process && (
                      <span className="text-xs text-gray-500">
                        [Cycles: {process.cycles}] [Throughput: {process.throughput}]
                      </span>
                    )}
                  </div>
                  {process && (
                    <div className="text-xs text-gray-600 mt-1">{process.description}</div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-gray-600 text-xs mt-2 font-mono border-t border-gray-700 pt-2">
            [↑↓] navigate • [TAB] autocomplete • [ENTER] execute
          </div>
        </div>
      )}
    </div>
  );
});

CommandInput.displayName = 'CommandInput';

export default CommandInput;
