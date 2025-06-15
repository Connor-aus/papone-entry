import React from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Contact Connor</h1>
          <p className="text-gray-300 mb-6">
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