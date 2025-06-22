import ChessGame from 'components/ChessGame';

export default async function Page({ params }: {params: Promise<{roomId: string}>}) {
  const { roomId } = await params;

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