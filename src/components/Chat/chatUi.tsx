'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Send } from 'lucide-react';

const loadingMessages = [
  "Analyzing your request...",
  "Preparing your response...",
  "Applying legal reasoning...",
  "Formulating expert opinion...",
  "Preparing your response...",
];

export default function CustomGPTUI() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const LoadingIndicator = () => (
    <div className="py-8 px-4 dark:bg-slate-800">
      <div className="max-w-3xl mx-auto flex space-x-6">
        <div className="w-8 h-8 rounded-sm bg-[#10A37F] flex items-center justify-center text-white">
          Lex
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
          </div>
          <p className="text-gray-400">{loadingMessages[loadingMessageIndex]}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white dark:bg-[#1d1f1e]">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.map((m, index) => (
            <div 
              key={index} 
              className={`py-8 px-20 pt-20${
                m.role === 'assistant' ? 'dark:bg-slate-800' : ''
              }`}
            >
              <div className="max-w-3xl mx-auto flex space-x-6">
                <div className={`w-8 h-8 rounded-sm ${
                  m.role === 'user' ? 'bg-blue-600' : 'bg-green-600'
                } flex items-center justify-center text-white`}>
                  {m.role === 'user' ? 'U' : 'Lex'}
                </div>
                <div className="flex-1 space-y-2">
                  {m.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 max-w-3xl mx-auto w-full">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="w-full p-4 rounded-lg border bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700 resize-y"
                rows={8}
              />
              <button
                type="submit"
                className="absolute bottom-4 right-4 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}