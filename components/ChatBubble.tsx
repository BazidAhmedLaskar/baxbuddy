import React from 'react';
import { Message } from '../types';
import { BotAvatar, UserAvatar } from './icons';
import { TypingIndicator } from './TypingIndicator';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'items-start'}`}>
      {!isUser && <BotAvatar />}
      <div
        className={`rounded-2xl px-4 py-2 max-w-lg text-white ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-cyan-500'
            : 'bg-gray-800'
        }`}
      >
        {message.text ? (
          <div className="prose text-inherit whitespace-pre-wrap">{message.text}</div>
        ) : (
          <TypingIndicator />
        )}
      </div>
      {isUser && <UserAvatar />}
    </div>
  );
};