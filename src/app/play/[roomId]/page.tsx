import ChessBoard from 'components/ChessBoard';
import Sidebar from 'components/Sidebar';
import { socket } from 'socket.js';
import './page.css';

interface Params {
  roomId: string,
}

export default async function Page({ params }: { params: Params }) {
  const { roomId } = await params;

  socket.emit('join-room', roomId);

  return (
    <div className='main-container'>
      <div className='game-title'>
        Current Room: {roomId}
      </div>
      <div className='game-container'>
        <ChessBoard />
        <Sidebar />
      </div>
    </div>
  );
}