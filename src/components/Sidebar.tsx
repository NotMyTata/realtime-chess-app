'use client'

import { supabase } from "app/supabase-client";
import Chat from "./Chat";
import MoveList from "./MoveList";
import './Sidebar.css';


export const Sidebar = ({ gameStatus, moveHistory, roomId, playerColor }: { gameStatus: string, moveHistory: string[], roomId: string, playerColor: string | null}) => {
  
  const handleNewRequest = async (type: 'rematch' | 'draw' | 'resign') => {
    try{
      const { error } = await supabase
        .from('game_requests')
        .insert({
          room_id: roomId,
          type: type,
          from_player: playerColor,
        })

        if (error) throw error
    } catch (error) {
      console.error('Error while handling new request: ', error);
    }
  }

  return (
    <div className='sidebar-component'>
        <div className='operationbutton-component'>
          <button className="rematch-button button-primary" onClick={e => handleNewRequest('rematch')} disabled={gameStatus !== 'finished'}>Rematch</button>
          <button className="draw-button button-primary" onClick={e => handleNewRequest('draw')} disabled={gameStatus === 'finished'}>Draw</button>
          <button className="resign-button button-primary" onClick={e => handleNewRequest('resign')} disabled={gameStatus === 'finished'}>Resign</button>
      </div>
        <MoveList 
          moveHistory={moveHistory}/>
        <Chat
          roomId={roomId}
          playerColor={playerColor} />
    </div>
  );
}

export default Sidebar;