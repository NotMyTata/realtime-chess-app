'use client'

import './Chat.css';
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { supabase } from 'app/supabase-client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  room_id: string,
  sender: string,
  message: string,
}

export const Chat = ({ roomId, playerColor }: { roomId: string, playerColor: string | null }) => {
  const [ input, setInput ] = useState<string>("");
  const [ messages, setMessages ] = useState<Message[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    fetchChat();
    subscribeToChatUpdates();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [roomId]);

  useEffect(() => {
    renderChat();
  }, [messages])

  const fetchChat = async() => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId);
    
    if (error) {
      console.error('Error fetching chat: ', error);
      return;
    }

    setMessages(data || []);
  }

  const handleMessageSend = async () => {
    if(!input.trim() || !playerColor) return;

    const newMessage = {room_id: roomId, sender: playerColor === 'w'? 'White' : 'Black', message: input.trim()};
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([newMessage]);

      if (error) {
        console.error("Error while sending message: ", error);
        return;
      }

      setInput("");
    } catch (error) {
      console.error("Error while sending message: ", error)
    }
  }

  const renderChat = () => {
    if (messages.length === 0) {
      return <div className="no-messages">No messages yet. Start the conversation!</div>;
    }

    return (
      <div>
        {messages.map(({sender, message}, index) => (
          <ChatMessage key={index} sender={sender} message={message} />
        ))}
      </div>
    );
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleMessageSend();
    }
  };

  const subscribeToChatUpdates = () => {
    channelRef.current = supabase
      .channel(`chat-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const message = payload.new as Message;
          setMessages(prev => [...prev, message]);
        }
      )
      .subscribe();
  }

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
        {renderChat()}
      </div>
      <div className="chatform-component">
        <input className="input-msg input-field" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          type="text" 
          placeholder='Type a message...'/>
        <button className="send-btn button-primary" onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;