'use client';

import React from 'react';

export interface GameNotification {
  type: 'rematch' | 'draw' | 'resign';
  message: string;
  from: string;
  needsResponse?: boolean;
}

interface GameNotificationProps {
  notification: GameNotification;
  onAccept?: () => void;
  onDecline?: () => void;
}

export const Notification: React.FC<GameNotificationProps> = ({
  notification,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="notification-component">
      <p>{notification.message}</p>
      {notification.needsResponse && (
        <div style={{ marginTop: '8px' }}>
          <button onClick={onAccept}>Accept</button>
          <button onClick={onDecline}>Decline</button>
        </div>
      )}
    </div>
  );
};

export default Notification;
