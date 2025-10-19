import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-black">
        <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
            <textarea
                className="flex-1 bg-transparent text-white resize-none focus:outline-none placeholder-gray-500"
                placeholder="Message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={disabled}
            />
            <button
                className="ml-4 font-bold text-blue-500 disabled:text-gray-500 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={disabled || !input.trim()}
            >
                Send
            </button>
        </div>
    </div>
  );
};