import React, { useState, useRef, useEffect } from 'react';
import logger from '../utils/logger';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const HELP_OPTIONS = [
  { id: 'hi', text: 'Hi' },
  { id: 'job', text: 'Job' },
  { id: 'experience', text: 'Experience' },
  { id: 'contact', text: 'Contact Connor' },
];

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState<string>('');
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close help menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setShowHelp(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      logger.warn('Attempted to send empty message');
      return;
    }
    
    if (isLoading) {
      logger.warn('Message submission blocked - already processing a request');
      return;
    }
    
    logger.info('Sending message');
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const selectHelpOption = (option: string) => {
    setMessage(option);
    setShowHelp(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <form onSubmit={handleSubmit} className="flex items-end">
        <div className="flex-grow relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full p-3 pr-12 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`absolute right-3 bottom-3 rounded-md p-1 ${
              !message.trim() || isLoading 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-blue-500 hover:text-blue-400'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <div className="ml-2 relative" ref={helpRef}>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          {showHelp && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
              <div className="p-2 text-sm text-gray-300 border-b border-gray-700">
                Quick options
              </div>
              <div>
                {HELP_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectHelpOption(option.text)}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 focus:outline-none"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
      
      {isLoading && (
        <div className="absolute -top-8 left-0 w-full text-center text-sm text-gray-400">
          Assistant is typing...
        </div>
      )}
    </div>
  );
};

export default ChatInput; 