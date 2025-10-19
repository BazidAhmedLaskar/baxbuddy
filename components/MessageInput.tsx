import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-black border-t border-gray-800">
      <div className="flex items-center bg-[#262626] border border-gray-700/50 rounded-full py-1.5 px-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Message..."
          disabled={disabled}
          className="w-full bg-transparent pl-3 pr-2 text-white placeholder-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={disabled || !inputValue.trim()}
          className="px-3 py-1 font-bold text-blue-500 disabled:text-blue-500/50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;