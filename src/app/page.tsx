'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChessIcon, ChatIcon, RoomIcon, DeviceIcon, CrownIcon } from '../components/Icons';

export default function Page() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleCreateRoom = () => {
    // Generate a random 6-character room ID
    const newRoomId = Math.random().toString(36).substring(2, 8);
    router.push(`/play/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.length === 6) {
      router.push(`/play/${roomId}`);
    }
  };

  return (
    <div className="container">
      <div className="logo-section">
        <div className="feature-icon">
          <CrownIcon />
        </div>
        <h2>Realtime Chess</h2>
      </div>

      <div style={{ display: 'flex', gap: '4rem' }}>
        <div style={{ flex: '1.5' }}>
          <h1 className="hero-title">
            Play Chess<br />
            in Real-Time
          </h1>
          
          <p className="hero-description">
            Experience the classic game of chess with modern real-time multiplayer features. 
            Create rooms, invite friends, and enjoy seamless gameplay with integrated chat.
          </p>

          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <ChessIcon />
              </div>
              <div>
                <h3>Real-time Gameplay</h3>
                <p>Play chess in real-time with friends</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <ChatIcon />
              </div>
              <div>
                <h3>Live Chat</h3>
                <p>Chat with your opponent while playing</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <RoomIcon />
              </div>
              <div>
                <h3>Easy Room System</h3>
                <p>Create or join rooms with simple IDs</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <DeviceIcon />
              </div>
              <div>
                <h3>Cross-Platform</h3>
                <p>Play from any device, anywhere</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: '1' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '2rem',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Start Playing</h2>
            
            <button className="button-primary" onClick={handleCreateRoom} style={{ marginBottom: '1.5rem' }}>
              Create New Room
            </button>

            <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-secondary)' }}>
              OR
            </div>

            <form onSubmit={handleJoinRoom}>
              <input
                type="text"
                placeholder="Enter 6-character room ID"
                className="input-field"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                maxLength={6}
              />
              <button 
                className="button-primary" 
                type="submit"
                disabled={roomId.length !== 6}
                style={{ opacity: roomId.length === 6 ? 1 : 0.5 }}
              >
                Join Room
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}