import React, { useState, useEffect, useRef } from 'react';
import { Message } from './types';
import { ChatBubble } from './components/ChatBubble';
import { MessageInput } from './components/MessageInput';
import { getStreamingResponse } from './services/geminiService';
import { BotAvatar } from './components/icons';

const ApiKeyScreen = ({ onApiKeySubmit }: { onApiKeySubmit: (key: string) => void }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onApiKeySubmit(apiKey);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="p-8 bg-gray-900 rounded-lg shadow-md w-full max-w-md border border-gray-700">
                <div className="flex flex-col items-center mb-6">
                    <BotAvatar />
                    <h2 className="text-2xl font-bold mt-4">Enter Gemini API Key</h2>
                </div>
                <p className="text-gray-400 mb-6 text-center">
                    You can get a free API key from{' '}
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Google AI Studio
                    </a>.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
                        placeholder="Your API Key"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-600"
                        disabled={!apiKey.trim()}
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: 'Yo, kya scene?',
      sender: 'model'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
        setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('gemini-api-key', key);
    setApiKey(key);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!apiKey) return;
    
    setError(null);
    const userMessage: Message = { id: Date.now().toString(), text, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const modelMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
        ...prev,
        { id: modelMessageId, text: '', sender: 'model' },
    ]);

    let fullResponse = '';
    try {
        await getStreamingResponse(apiKey, text, (chunk) => {
            fullResponse += chunk;
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === modelMessageId ? { ...msg, text: fullResponse } : msg
                )
            );
        });
    } catch (err) {
        console.error("Error getting response from Gemini:", err);
        const errorMessage = err instanceof Error ? err.message : 'Sorry, something went wrong.';
        setError(`Error: ${errorMessage}`);
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === modelMessageId ? { ...msg, text: `Error: ${errorMessage}` } : msg
            )
        );
         if (errorMessage.includes("Invalid API Key")) {
            localStorage.removeItem('gemini-api-key');
            setApiKey(null);
        }
    } finally {
        setIsLoading(false);
    }
  };
  
  if (!apiKey) {
    return <ApiKeyScreen onApiKeySubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="p-4 border-b border-gray-800 bg-black flex items-center gap-4">
        <BotAvatar />
        <h1 className="text-xl font-semibold">Bazid</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {error && (
            <div className="text-red-400 text-center text-sm p-2 bg-red-900/50 rounded-md">{error}</div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <MessageInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
};

export default App;