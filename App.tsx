
import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { initializeChat, sendMessageToBot } from './services/geminiService';
import type { Message } from './types';
import ChatBubble from './components/ChatBubble';
import MessageInput from './components/MessageInput';
import TypingIndicator from './components/TypingIndicator';
import { BotAvatar } from './components/icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: "Hey bro! I'm BaxBuddy, an AI version of Bax. What's up? Ask me about my projects like EduPhones, my coding journey, or anything else. Let's build something smarter.",
      sender: 'bot',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = initializeChat();
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (userMessage: string) => {
    if (!chatRef.current) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: userMessage, sender: 'user' },
    ]);
    setIsLoading(true);

    const botResponseText = await sendMessageToBot(chatRef.current, userMessage);

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + '-bot', text: botResponseText, sender: 'bot' },
    ]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-800 shadow-2xl rounded-lg my-0 md:my-4">
      <header className="flex items-center p-4 bg-gray-900 border-b border-gray-700 shadow-md">
        <BotAvatar className="w-10 h-10 mr-4"/>
        <div>
            <h1 className="text-xl font-bold text-white">BaxBuddy AI</h1>
            <p className="text-sm text-sky-400">Your friendly neighborhood coder</p>
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
