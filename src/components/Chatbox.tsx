'use client'

import './Chatbox.css';
import ChatMessage from './ChatMessage';

export const Chatbox = () => {
  return (
    <div className="chatbox-component">
      This is chatbox component
      <ChatMessage />
    </div>
  );
}

export default Chatbox;