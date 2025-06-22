'use client'

import Chat from "./Chat";
import MoveList from "./MoveList";
import { GameNotification } from "./Notification";
import './Sidebar.css';

export const Sidebar = ({ isGameOver, moveHistory }: { isGameOver: boolean, moveHistory: string[] }) => {
   const handleRematch = () => {
      const gameNotification: GameNotification = {
        type: 'rematch',
        message: 'Rematch request',
        from: 'b',
        needsResponse: false
      }
  
      const onAccept = () => {
  
      }
  
      const onDecline = () => {
  
      }
    }

    
  
    const handleOfferDraw = () => {
      const gameNotification: GameNotification = {
        type: 'draw',
        message: 'Draw offered',
        from: 'b',
        needsResponse: false
      }
  
      const onAccept = () => {
  
      }
  
      const onDecline = () => {
        
      }
    }

    const handleResign = () => {
      const gameNotification: GameNotification = {
        type: 'resign',
        message: 'Are you sure you want to resign?',
        from: 'b',
        needsResponse: true
      }

      const onAccept = () => {

      }

      const onDecline = () => {
        
      }
  }
  
  return (
    <div className='sidebar-component'>
        <div className='operationbutton-component'>
          <button className="rematch-button button-primary" onClick={handleRematch} disabled={!isGameOver}>Rematch</button>
          <button className="draw-button button-primary" onClick={handleOfferDraw}>Draw</button>
          <button className="resign-button button-primary" onClick={handleResign}>Resign</button>
      </div>
        <MoveList 
          moveHistory={moveHistory}/>
        <Chat />
    </div>
  );
}

export default Sidebar;