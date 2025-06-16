'use client'

import { Chessboard } from "react-chessboard";
import { Chess } from 'chess.js';
import { useState } from 'react';
import './ChessBoard.css';

export const ChessBoard = () => {

  const [game, setGame] = useState<Chess>(new Chess());
  const [history, setHistory] = useState<string[]>([]);

  function getGameStatus(){
    
    if (game.isGameOver()){
      if(game.isCheckmate()) return 'Checkmate ' + (game.turn() === 'w' ? 'Black Wins' : 'White Wins');
      if(game.isDraw()) return 'Draw';
      if(game.isStalemate()) return 'Stalemate';
      if(game.isThreefoldRepetition()) return 'Three Fold Repetition';
      if(game.isInsufficientMaterial()) return 'Insufficient Material';

      return 'Game Over';
    }

    return game.inCheck() 
      ? game.turn() === 'w' ? 'White Check' : 'Black Check'
      : game.turn() === 'w' ? 'White Turn' : 'Black Turn';
  }

  function onDrop(source: string, target: string, piece?: string): boolean {
    try {
      const move = game.move({from: source, to: target});
      
      if(move){
        setGame(new Chess(game.fen()));
        setHistory(history => [...history, target])
        return true;
      }

    } catch (err) {
      return false;
    }
    return false;
  }

  // TODO: fix promotion
  // TODO: fix game.history

  return (
    <div className='chessboard-component'>
      {getGameStatus()}
      <Chessboard 
        position={ game.fen() }
        arePremovesAllowed={true}
        clearPremovesOnRightClick={true}
        snapToCursor={true}
        onPieceDrop={ onDrop } />
    </div>
  );
}

export default ChessBoard;