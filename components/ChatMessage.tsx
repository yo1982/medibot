import React from 'react';
import { type Message } from '../types';
import { BotIcon, UserIcon } from './Icons';
import BarChart from './BarChart';

interface ChatMessageProps {
  message?: Message;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  if (isLoading) {
    return (
        <div className="flex items-start gap-3 animate-pulse">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <BotIcon className="w-5 h-5 text-primary"/>
            </div>
            <div className="flex-1 pt-1.5 space-y-2">
                <div className="h-3 bg-slate-700 rounded w-1/4"></div>
                <div className="h-3 bg-slate-700 rounded w-3/4"></div>
            </div>
        </div>
    );
  }

  if (!message) return null;
  
  const isModel = message.role === 'model';
  const textContent = message.parts.map(part => part.text).join('').trim();

  return (
    <div className={`flex items-start gap-3 md:gap-4 ${isModel ? '' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <BotIcon className="w-5 h-5 text-primary"/>
        </div>
      )}
      
      <div className={`max-w-xl w-full p-3 rounded-xl ${isModel ? 'bg-brand-bg' : 'bg-primary text-white'}`}>
        {textContent && <p className="text-sm whitespace-pre-wrap">{textContent}</p>}
        {message.visualizationData && (
          <div className="mt-4 bg-surface/50 p-4 rounded-lg border border-border-color">
            <BarChart data={message.visualizationData} />
          </div>
        )}
      </div>

      {!isModel && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-surface flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-text-secondary"/>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;