import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ChatPage from './pages/ChatPage';
import ContactPage from './pages/ContactPage';
import { ChatProvider } from './context/ChatContext';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ChatPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
};

export default App;
