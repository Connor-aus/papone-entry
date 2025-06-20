import React, { createContext, useState, useContext, ReactNode } from 'react';
import { sendRequestToAgent } from '../services/api';
import logger from '../utils/logger';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    try {
      logger.info('Sending message to agent API');
      const response = await sendRequestToAgent(text);
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        text: response.response || 'Sorry, I couldn\'t process that request.',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      logger.error('Error sending message to agent', error);
      
      // Check if it's a 429 (rate limit) error
      let errorText = 'Sorry, there was an error processing your request. Please try again later.';
      
      if (error && typeof error === 'object') {
        const axiosError = error as any;
        // Check for direct 429 response
        if (axiosError.response?.status === 429) {
          errorText = 'Sorry, the agent quota has been reached for the day. You can still use the Contact page to contact Connor. Otherwise, you can try again tomorrow.';
        }
        // Check for network error that might be a masked 429 (common with rate limiting)
        else if (axiosError.code === 'ERR_NETWORK' && axiosError.name === 'AxiosError') {
          // Network errors from rate limiting often appear as generic network errors
          // We'll assume this is likely a quota issue based on the context
          errorText = 'Sorry, the agent quota has been reached for the day. You can still use the Contact page to contact Connor. Otherwise, you can try again tomorrow.';
        }
      }
      
      if (error && typeof error === 'object') {
        const axiosError = error as any;
        // Check for direct 429 response
        if (axiosError.response?.status === 429) {
          errorText = 'Sorry, the agent quota has been reached for the day. You can still use the Contact page to contact Connor. Otherwise, you can try again tomorrow.';
        }
        // Check for network error that might be a masked 429 (common with rate limiting)
        else if (axiosError.code === 'ERR_NETWORK' && axiosError.name === 'AxiosError') {
          // Network errors from rate limiting often appear as generic network errors
          // We'll assume this is likely a quota issue based on the context
          errorText = 'Sorry, the agent quota has been reached for the day. You can still use the Contact page to contact Connor. Otherwise, you can try again tomorrow.';
        }
      }
      
      // Add error message to chat
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: errorText,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}; 