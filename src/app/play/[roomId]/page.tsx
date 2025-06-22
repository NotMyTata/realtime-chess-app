import { supabase } from 'app/supabase-client';
import ChessGame from 'components/ChessGame';

export default async function Page({ params }: {params: {roomId: string}}) {
  const roomId = (await params).roomId;

  return (
    <div className='main-container'>
      <ChessGame roomId={roomId.toString()} />
    </div>
  );
}