import React from 'react';
import { useNotifications } from '../context/NotificationContext';

export default function Notification() {
  const { messages, removeMessage } = useNotifications();

  return (
    <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
      {messages.map(msg => (
        <div key={msg.id} 
             style={{ 
               marginBottom: 10, 
               padding: '10px 20px', 
               borderRadius: 5, 
               color: '#fff', 
               backgroundColor: msg.type === 'error' ? '#e74c3c' 
                                 : msg.type === 'success' ? '#2ecc71' 
                                 : '#f1c40f' 
             }}>
          {msg.text}
          <button onClick={() => removeMessage(msg.id)} style={{ marginLeft: 10, cursor: 'pointer' }}>✖</button>
        </div>
      ))}
    </div>
  );
}
