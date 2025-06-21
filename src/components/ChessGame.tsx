import ChessBoard from "./ChessBoard";
import Sidebar from "./Sidebar";
import Statusbar from "./Statusbar";
import './ChessGame.css'

export const ChessGame = () => {
  return (
    <div className="chessgame-component">
        <Statusbar />
        <ChessBoard />
        <Sidebar />
    </div>
  );
}

export default ChessGame;