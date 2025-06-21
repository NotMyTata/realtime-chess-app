import { socket } from 'socket.js';
import './page.css';
import ChessGame from 'components/ChessGame';

interface Params {
  roomId: string,
}

export default async function Page() {
  return (
    <div className='main-container'>
      <ChessGame />
    </div>
  );
}