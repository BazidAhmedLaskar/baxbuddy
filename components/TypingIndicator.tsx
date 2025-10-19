import React from 'react';
import { BotAvatar } from './icons.tsx';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-2.5 justify-start">
      <div className="p-0.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-full flex-shrink-0">
        <BotAvatar className="w-8 h-8 border-2 border-black"/>
      </div>
      <div className="bg-[#262626] p-3 rounded-t-2xl rounded-br-2xl">
        <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;