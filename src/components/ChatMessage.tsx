import { useState } from 'react';

interface ChatMessageProps {
  sender: string,
  message: string,
}

export const ChatMessage = () => {
  const sender = 'John';
  const message = 'Hello there';

  return (
    <div className="chatmessage-component">
      <p>{sender}: {message}</p>
    </div>
  );
}

export default ChatMessage;