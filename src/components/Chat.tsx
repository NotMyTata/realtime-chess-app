'use client'

import './Chat.css';
import { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import { supabase } from 'app/supabase-client';

interface Message {
  sender: string,
  message: string,
}

export const Chat = () => {
  const [ input, setInput ] = useState<string>("");
  const [ messages, setMessages ] = useState<Message[]>([]);

  const handleMessageSend = () => {
    const newMessage = {sender: 'a', message: input};

    setMessages(messages => [...messages, newMessage]);
    setInput("");
  }

  const updateChat = () => {
    return (
      <div>
        {messages.map(({sender, message}, index) => (
          <ChatMessage key={index} sender={sender} message={message} />
        ))}
      </div>
    );
  }

  useEffect(() => {
    updateChat();
  }, [messages]);

  return (
    <div className="chat-component">
      <div className="chatbox-component"
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
        {updateChat()}
      </div>
      <div className="chatform-component">
        <input className="input-msg input-field" value={input} onChange={e => setInput(e.target.value)} type="text" placeholder='Type a message...'/>
        <button className="send-btn button-primary" onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;