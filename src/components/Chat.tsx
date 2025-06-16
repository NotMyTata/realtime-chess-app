'use client'

import Chatbox from "./Chatbox";
import ChatForm from "./ChatForm";
import './Chat.css';

export const Chat = () => {
  return (
    <div className="chat-component">
      <Chatbox />
      <ChatForm />
    </div>
  );
}

export default Chat;