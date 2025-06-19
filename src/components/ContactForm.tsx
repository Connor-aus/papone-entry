import React, { useState } from 'react';
import { contactConnor } from '../services/api';
import logger from '../utils/logger';

const ContactForm: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    
    // Validate inputs
    if (!subject.trim()) {
      setError('Please enter a subject');
      return;
    }
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      logger.info('Submitting contact form');
      
      await contactConnor(subject, message, email);
      
      // Reset form on success
      setSubject('');
      setMessage('');
      setEmail('');
      setSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      logger.error('Error submitting contact form', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-[#202123] rounded-lg px-8 pt-6 pb-6">
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-800 text-white rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-800 text-white rounded-md">
            Your message has been sent successfully!
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="appearance-none rounded w-full py-2 px-3 bg-[#2a2b32] text-white leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Message Subject"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none rounded w-full py-2 px-3 bg-[#2a2b32] text-white leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="appearance-none rounded w-full py-2 px-3 bg-[#2a2b32] text-white leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 h-36 resize-none"
            placeholder="Your message here..."
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#2a2b32] hover:bg-[#40414f] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </div>
        
        <div className="text-center text-gray-400 text-xs">
          This message will be sent to Connor only. We do NOT store or share your details.
        </div>
      </form>
    </div>
  );
};

export default ContactForm; 