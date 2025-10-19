
import React from 'react';
import type { Message } from '../types';
import { BotAvatar } from './icons';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleClasses = isUser
    ? 'bg-sky-600 rounded-br-none'
    : 'bg-gray-700 rounded-bl-none';
  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex items-end gap-2 ${containerClasses}`}>
      {!isUser && <BotAvatar className="w-8 h-8 flex-shrink-0" />}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl text-white whitespace-pre-wrap ${bubbleClasses}`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatBubble;
