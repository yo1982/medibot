
import React, { useState, useRef, useEffect } from 'react';
import { type Message } from '../types';
import ChatMessage from './ChatMessage';
import { SendIcon, LoadingSpinner } from './Icons';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (prompt: string) => void;
  isFileLoaded: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage, isFileLoaded }) => {
  const [prompt, setPrompt] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && isFileLoaded) {
      onSendMessage(prompt);
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-surface rounded-xl border border-border-color overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 && isFileLoaded && (
          <div className="text-center text-text-secondary">
            <p>Document loaded. Ask a question to start the analysis.</p>
            <p className="text-xs mt-2">e.g., "Summarize the key findings of this paper."</p>
          </div>
        )}
        {messages.length === 0 && !isFileLoaded && (
             <div className="text-center text-text-secondary h-full flex flex-col justify-center items-center">
                <p className="text-lg">Welcome to DocuMind</p>
                <p className="text-sm mt-2">Please upload a document to begin.</p>
            </div>
        )}
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && messages.length > 0 && <ChatMessage isLoading={true} />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border-color bg-surface/50">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isFileLoaded ? "Ask a follow-up question..." : "Please upload a document first"}
            className="flex-1 bg-brand-bg border border-border-color rounded-lg p-2 resize-none focus:ring-2 focus:ring-primary focus:outline-none transition-all disabled:opacity-50"
            rows={1}
            disabled={!isFileLoaded || isLoading}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading || !isFileLoaded}
            className="h-10 w-10 flex items-center justify-center bg-primary text-white rounded-full transition-colors duration-200 enabled:hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {isLoading ? <LoadingSpinner className="w-5 h-5"/> : <SendIcon className="w-5 h-5"/>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
