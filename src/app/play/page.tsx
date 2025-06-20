import ChessBoard from 'components/ChessBoard';
import Sidebar from 'components/Sidebar';
import './[roomId]/page.css';

export default function Page() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background:'#26272b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0'
    }}>
      <div className="main-container" style={{
        maxWidth: 1300,
        width: '100%',
        boxShadow: '0 10px 32px 0 rgba(80, 0, 120, 0)',
        border: '#302e2b',
        background: '#302e2b',
        padding: 40,
        borderRadius: 18
      }}>
        <div className="game-title" style={{ fontSize: 32, color: '#7c3aed', marginBottom: 8 }}>
          Static Chess Game
        </div>
        <div className="game-container" style={{ gap: 32, minHeight: 500 }}>
          <ChessBoard />
          <Sidebar />
        </div>
      </div>
    </div>
  );
}