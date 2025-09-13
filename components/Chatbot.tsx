
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ChatbotProps {
  topic: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ topic }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSession = useMemo(() => createChatSession(topic), [topic]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    setMessages([{ sender: 'bot', text: `Hi there! Do you have any questions about ${topic}? Ask me anything!` }]);
  }, [topic]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    const botMessage: ChatMessage = { sender: 'bot', text: '' };
    setMessages(prev => [...prev, botMessage]);

    try {
        const stream = chatSession.sendMessageStream(userInput);
        let currentText = '';
        for await (const chunk of stream) {
            currentText += chunk;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { sender: 'bot', text: currentText };
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Chat error:", error);
        setMessages(prev => {
             const newMessages = [...prev];
             newMessages[newMessages.length - 1] = { sender: 'bot', text: "Sorry, I'm having trouble connecting right now." };
             return newMessages;
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mt-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-4">Have a Question? Ask Me!</h3>
      <div className="h-80 bg-slate-50 rounded-lg p-4 overflow-y-auto flex flex-col space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
             {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-sky-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">AI</div>}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-sky-500 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors disabled:bg-slate-400 flex items-center justify-center"
          disabled={isLoading || !userInput.trim()}
        >
          {isLoading ? <LoadingSpinner /> : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
