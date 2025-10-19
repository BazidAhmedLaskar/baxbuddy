import React, { useState, useEffect, useRef } from 'react';
import { initializeChat, sendMessageToBot, getChat } from './services/geminiService.ts';
import type { Message } from './types.ts';
import ChatBubble from './components/ChatBubble.tsx';
import MessageInput from './components/MessageInput.tsx';
import TypingIndicator from './components/TypingIndicator.tsx';
import { BotAvatar, InfoIcon, VideoIcon } from './components/icons.tsx';

const ApiKeyInput = ({ onApiKeySubmit }: { onApiKeySubmit: (key: string) => void }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onApiKeySubmit(apiKey.trim());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black p-4">
            <div className="w-full max-w-md p-8 bg-[#121212] border border-gray-800/50 rounded-2xl shadow-xl text-center">
                 <div className="p-1 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <BotAvatar className="w-full h-full border-4 border-black" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Enter Gemini API Key</h1>
                <p className="text-gray-400 mb-6">
                    To chat with me, you need a Google Gemini API key. Get yours for free from the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">AI Studio</a>.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Paste your API key here"
                        className="w-full bg-[#262626] border border-gray-700/50 rounded-full py-3 px-5 mb-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!apiKey.trim()}
                        className="w-full p-3 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        Start Chatting
                    </button>
                </form>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    const storedMessagesJSON = localStorage.getItem('chat-messages');
    if (storedMessagesJSON) {
        try {
            const storedMessages = JSON.parse(storedMessagesJSON);
            if (Array.isArray(storedMessages) && storedMessages.length > 0) {
                return storedMessages;
            }
        } catch (error) {
            console.error("Failed to parse messages from localStorage:", error);
            localStorage.removeItem('chat-messages'); // Clear corrupted data
        }
    }
    return [
      {
        id: 'init',
        text: "Kya kar raha hai bro? Main Bazid. Bata, kya scene? 😂",
        sender: 'bot',
      },
    ];
  });
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
        setApiKey(storedApiKey);
        initializeChat(storedApiKey);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('gemini-api-key', key);
    setApiKey(key);
    initializeChat(key);
  };

  const handleSendMessage = async (userMessage: string) => {
    if (!getChat()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: userMessage, sender: 'user' },
    ]);
    setIsLoading(true);

    const botResponseText = await sendMessageToBot(userMessage);

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + '-bot', text: botResponseText, sender: 'bot' },
    ]);
    setIsLoading(false);
  };
  
  if (!apiKey) {
    return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-black">
      <header className="flex items-center justify-between p-3 bg-black border-b border-gray-800/50 shadow-md sticky top-0">
        <div className="flex items-center gap-3">
            <div className="p-0.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-full">
                <BotAvatar className="w-10 h-10 border-2 border-black"/>
            </div>
            <div>
                <h1 className="text-lg font-bold text-white">Bazid</h1>
                <p className="text-sm text-gray-400">Active now</p>
            </div>
        </div>
        <div className="flex items-center gap-4 text-white">
            <VideoIcon className="w-7 h-7" />
            <InfoIcon className="w-7 h-7" />
        </div>
      </header>

      <main ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatBubble 
            key={msg.id} 
            message={msg} 
            isLastMessage={index === messages.length - 1}
            isLoading={isLoading}
          />
        ))}
        {isLoading && <TypingIndicator />}
      </main>

      <MessageInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default App;