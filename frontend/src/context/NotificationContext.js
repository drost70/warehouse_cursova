import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((text, type = 'info') => {
    const id = Date.now();
    setMessages(prev => [...prev, { id, text, type }]);
    setTimeout(() => setMessages(prev => prev.filter(m => m.id !== id)), 5000);
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.text) addMessage(data.text, data.type);
      } catch (e) {
        console.error('WS parse error', e);
      }
    };

    ws.onopen = () => console.log('WS connected');
    ws.onclose = () => console.log('WS disconnected');

    return () => ws.close();
  }, [addMessage]);

  return (
    <NotificationContext.Provider value={{ messages, addMessage, removeMessage }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
