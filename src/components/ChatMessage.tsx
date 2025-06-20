import { FC } from 'react';

interface ChatMessageProps {
  sender: string,
  message: string,
}

export const ChatMessage: FC<ChatMessageProps> = ({ sender, message }) => {
  return (
    <div className="chatmessage-component" style={{ color: 'white', marginBottom: 4 }}>
      <p>
        <strong style={{ color: '#7c3aed' }}>{sender}:</strong> {message}
      </p>
    </div>
  );
}

export default ChatMessage;