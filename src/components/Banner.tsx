'use client'

import { use, useEffect, useRef, useState } from 'react';
import './Banner.css';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from 'app/supabase-client';
import { useRouter } from 'next/navigation';
import { DEFAULT_POSITION } from 'chess.js';

interface Request {
  room_id: string,
  type: 'rematch' | 'draw' | 'resign',
  from_player: string
}

export const Banner = ({roomId, playerColor}: {roomId: string, playerColor: 'w' | 'b' | null}) => {
  const [ request , setRequest ] = useState<Request | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchRequest();
    subscribeToRequest();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [roomId]);

  useEffect(() => {
    renderBanner();
  }, [request]);

  const subscribeToRequest = () => {
    channelRef.current = supabase
          .channel(`request-${roomId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'game_requests',
              filter: `room_id=eq.${roomId}`
            },
            (payload) => {
              const requests = payload.new as Request;
              setRequest(requests);
            }
          )
          .subscribe();
  }

  const fetchRequest = async () => {
    try {
      const { data, error } = await supabase
        .from('game_requests')
        .select()
        .eq('room_id', roomId)
        .maybeSingle();

      if (error) throw error;

      setRequest(data);
    } catch (error) {
      console.error('Error while fetching request', error);
    }
  }

  const deleteRequest = async () => {
    try {
      const { error } = await supabase
        .from('game_requests')
        .delete()
        .eq('room_id', roomId);

      if (error) throw error;

      setRequest(null);
    } catch (error) {
      console.error('Error while deleting request: ', error)
    }
  }

  const handleDecline = () => {
    if(!request) return;
    
    deleteRequest();
  }

  const handleAccept = () => {
    if(!request) return;

    switch(request.type){
      case 'rematch': handleRematchAccepted(); break;
      case 'draw': handleOfferDrawAccepted(); break;
      case 'resign': handleResignAccepted(); break;
      default: console.error('No designated handler for request type: ', request.type);
    }
  }

  const handleRematchAccepted = async () => {
    try {
      const { error } = await supabase
        .from('games')  
        .update({
          fen: DEFAULT_POSITION,
          move_history: [],
          white_time: 5 * 60,
          black_time: 5 * 60,
          status: 'active',
          last_move_time: new Date().toISOString()
        })
        .eq('room_id', roomId);

      if (error) throw error;

      deleteRequest();
    } catch (error) {
      console.error('Error while handling rematch accepted: ', error);
    }
  }

  const handleOfferDrawAccepted = async () => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
          status: 'finished',
          winner: 'draw'
        })
        .eq('room_id', roomId);
      
      if (error) throw error;

      deleteRequest();
    } catch (error) {
      console.error('Error while handling offer draw accepted: ', error);
    }
  }

  const handleResignAccepted = async () => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
          status: 'finished',
          winner: playerColor === 'w' ? 'b' : 'w'
        })
        .eq('room_id', roomId);
      
      if (error) throw error;

      deleteRequest();
    } catch (error) {
      console.error('Error while handling resign accepted: ', error);
    }
  }

  const renderBanner = () => {
    if (!request) return;
    if (request.type === 'rematch' && request.from_player === playerColor) return;
    if (request.type === 'draw' && request.from_player === playerColor) return;
    if (request.type === 'resign' && request.from_player !== playerColor) return;

    return (
      <div className='banner'>
        <p className='requester'>{request.from_player === 'w'? 'White' : 'Black'}:</p>
        <p className='request'>{
          request.type === 'rematch'
          ? 'Requested a rematch, do you accept?'
          : request.type === 'draw'
          ? 'Offered a draw, do you accept?'
          : 'Are you sure you wanted to resign?'
        }</p>
        <div className='banner-buttons'>
          <button className='button-secondary banner-button button-decline' onClick={handleDecline}>No</button>
          <button className='button-primary banner-button button-accept' onClick={handleAccept}>Yes</button>
        </div>
      </div>
    );
  }

  return (
    <div className='banner-component'>
      {renderBanner()}
    </div>
  );
}

export default Banner;