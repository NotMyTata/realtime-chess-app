'use client'

import { useState } from 'react';
import './ChatForm.css';

export const ChatForm = ({onMessageSend}: { onMessageSend: () => void}) => {
  const [ message, setMessage ] = useState<string>("");

  return (
    <div className="chatform-component">
      <input className="input-msg input-field" onChange={e => setMessage(e.target.value)} type="text" placeholder='Type a message...'/>
      <button className="send-btn button-primary" onClick={onMessageSend}>Send</button>
    </div>
  );
}

export default ChatForm;