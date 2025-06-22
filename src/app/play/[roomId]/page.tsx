import { supabase } from 'app/supabase-client';
import ChessGame from 'components/ChessGame';

export default async function Page({ params }: {params: {roomId: string}}) {
  const roomId = (await params).roomId;

  if (roomId.length !== 6) return (
    <div className="chessgame-component">
        <div className="error-message">
          Error: Invalid Room ID
        </div>
      </div>
  )

  return (
    <div className='main-container'>
      <ChessGame roomId={roomId.toString()} />
    </div>
  );
}