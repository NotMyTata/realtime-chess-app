'use client'

import './ChatForm.css';

export const ChatForm = () => {

  function handleSend(){

  }

  return (
    <div className="chatform-component">
      <input className="input-msg" type="text" placeholder='Type a message...'/>
      <button className="send-btn" onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatForm;