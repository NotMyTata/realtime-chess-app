import './Statusbar.css';

export const Statusbar = ({ whiteTime, blackTime, currentTurn }: { whiteTime: number, blackTime: number, currentTurn: string}) => {
  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className='statusbar-component'>
      <div className='clock-component'>
        <p className="clock-text opponent-clock">{formatTime(blackTime)}</p>
      </div>

      <div className='turn-component'>
        <p className="turn-title">Turn</p>
        <div className={`turn-text-${currentTurn}-container`}>
          <p className="turn-text">{currentTurn === 'w'? 'White' : 'Black'}</p>
        </div>
      </div>

      <div className='clock-component'>
        <p className="clock-text player-clock">{formatTime(whiteTime)}</p>
      </div>
    </div>
  );
}

export default Statusbar;