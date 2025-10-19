
import React from 'react';
import { BotAvatar } from './icons';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-2 justify-start">
      <BotAvatar className="w-8 h-8 flex-shrink-0" />
      <div className="bg-gray-700 p-3 rounded-2xl rounded-bl-none">
        <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">Bax is thinking</span>
            <div className="w-1 h-1 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1 h-1 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1 h-1 bg-sky-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
