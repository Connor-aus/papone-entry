import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatMessage from './ChatMessage';

describe('ChatMessage', () => {
  const mockTimestamp = new Date('2023-01-01T12:00:00');
  
  test('renders user message correctly', () => {
    render(
      <ChatMessage 
        message="Hello, this is a test message" 
        isUser={true} 
        timestamp={mockTimestamp} 
      />
    );
    
    // Check if the message content is rendered
    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
    
    // Check if the user label is rendered
    expect(screen.getByText('You')).toBeInTheDocument();
    
    // Check if the timestamp is rendered (12:00 PM)
    const timeFormat = mockTimestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    expect(screen.getByText(timeFormat)).toBeInTheDocument();
  });
  
  test('renders assistant message correctly', () => {
    render(
      <ChatMessage 
        message="I am the assistant" 
        isUser={false} 
        timestamp={mockTimestamp} 
      />
    );
    
    // Check if the message content is rendered
    expect(screen.getByText('I am the assistant')).toBeInTheDocument();
    
    // Check if the assistant label is rendered
    expect(screen.getByText('Assistant')).toBeInTheDocument();
  });
}); 