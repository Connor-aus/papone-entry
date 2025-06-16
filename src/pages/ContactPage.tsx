import React from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#202123] py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex flex-col items-center justify-center text-center text-gray-400 mb-8">
          <h2 className="text-2xl font-medium mb-2">Welcome</h2>
          <p className="mb-4">Do you have a question about Connor?</p>
          <p className="text-sm">
            Ask{' '}
            <Link 
              to="/" 
              className="text-blue-400 hover:text-blue-300 underline"
              onClick={() => {
                // Store a message to auto-fill in the chat input
                localStorage.setItem('prefillMessage', 'Can you please tell Connor I need to speak with him?');
              }}
            >
              Connor's Assistant
            </Link>{' '}
            to send him a message for you, or use the form below.
          </p>
        </div>
        
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage; 