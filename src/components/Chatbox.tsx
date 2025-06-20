'use client'

import './Chatbox.css';
import ChatMessage from './ChatMessage';

export const Chatbox = () => {
  return (
    <div
      className="chatbox-component"
      style={{
        background: '#262522',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}
    >
      <ChatMessage sender="John" message="Hello there!" />
      <ChatMessage sender="Jane" message="Hi, ready to play?" />
    </div>
  );
}

export default Chatbox;