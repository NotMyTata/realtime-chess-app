'use client'

import './ChatForm.css';

export const ChatForm = () => {

  function handleSend(){

  }

  return (
    <div className="chatform-component">
      <input className="input-msg input-field" type="text" placeholder='Type a message...'/>
      <button className="send-btn button-primary" onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatForm;