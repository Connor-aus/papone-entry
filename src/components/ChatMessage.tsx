import React from 'react';

export interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  // Format timestamp to display only hours and minutes
  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser 
            ? 'bg-gray-700 text-white' 
            : 'bg-gray-800 text-white'
        }`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-sm">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-gray-400 ml-2">{formattedTime}</span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage; 