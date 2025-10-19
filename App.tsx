import React, { useState, useEffect, useRef } from 'react';
import { initializeChat, sendMessageToBot, getChat } from './services/geminiService';
import type { Message } from './types';
import ChatBubble from './components/ChatBubble';
import MessageInput from './components/MessageInput';
import TypingIndicator from './components/TypingIndicator';
import { BotAvatar } from './components/icons';

const ApiKeyInput = ({ onApiKeySubmit }: { onApiKeySubmit: (key: string) => void }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onApiKeySubmit(apiKey.trim());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-4">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-xl text-center">
                <BotAvatar className="w-16 h-16 mx-auto mb-4" />
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
                        className="w-full bg-gray-700 border border-gray-600 rounded-full py-3 px-5 mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                        type="submit"
                        disabled={!apiKey.trim()}
                        className="w-full p-3 rounded-full bg-sky-600 text-white font-bold hover:bg-sky-500 disabled:bg-gray-600 transition-colors"
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
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-800 shadow-2xl rounded-lg my-0 md:my-4">
      <header className="flex items-center p-4 bg-gray-900 border-b border-gray-700 shadow-md">
        <BotAvatar className="w-10 h-10 mr-4"/>
        <div>
            <h1 className="text-xl font-bold text-white">Bazid</h1>
            <p className="text-sm text-sky-400">Online 24/7 for timepass 😜</p>
        </div>
      </header>

      <main ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
      </main>

      <MessageInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default App;