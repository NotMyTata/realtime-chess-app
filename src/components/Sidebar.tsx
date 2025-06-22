'use client'

import Chat, { Message } from "./Chat";
import MoveList from "./MoveList";
import './Sidebar.css';

export const Sidebar = ({ isGameOver, moveHistory, roomId, playerColor }: { isGameOver: boolean, moveHistory: string[], roomId: string, playerColor: string | null}) => {
  return (
    <div className='sidebar-component'>
        <div className='operationbutton-component'>
          <button className="rematch-button button-primary" disabled={!isGameOver}>Rematch</button>
          <button className="draw-button button-primary" >Draw</button>
          <button className="resign-button button-primary" >Resign</button>
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