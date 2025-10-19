import React from 'react';
import type { Message } from '../types.ts';
import { BotAvatar } from './icons.tsx';

interface ChatBubbleProps {
  message: Message;
  isLastMessage?: boolean;
  isLoading?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLastMessage, isLoading }) => {
  const isUser = message.sender === 'user';
  const isPulsing = isUser && isLastMessage && isLoading;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-t-2xl rounded-bl-2xl text-white whitespace-pre-wrap bg-gradient-to-tr from-sky-500 to-indigo-600 ${isPulsing ? 'animate-pulse' : ''}`}
        >
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2.5 justify-start">
       <div className="p-0.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-full flex-shrink-0">
          <BotAvatar className="w-8 h-8 border-2 border-black"/>
       </div>
      <div
        className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-t-2xl rounded-br-2xl bg-[#262626] text-white whitespace-pre-wrap"
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatBubble;