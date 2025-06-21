import { socket } from 'socket.js';
import ChessGame from 'components/ChessGame';

interface Params {
  roomId: string,
}

export default async function Page({ params }: { params: Params }) {
  const { roomId } = await params;

  socket.emit('join-room', roomId);

  return (
    <div className='main-container'>
      <ChessGame />;
    </div>
  );
}