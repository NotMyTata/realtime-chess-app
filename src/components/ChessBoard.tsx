'use client'

import { Chessboard } from "react-chessboard";
import { Chess } from 'chess.js';
import { useState } from 'react';
import './ChessBoard.css';

export const ChessBoard = () => {

  const [game, setGame] = useState<Chess>(new Chess());
  const [moves, setMoves] = useState<string[]>([]);

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

  function onDrop(source: string, target: string): boolean {
    try {
      const isValidMove = game.move({from: source, to: target});
      
      if(isValidMove){
        setGame(new Chess(game.fen()));
        setMoves(moves => [...moves, target])
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
      <Chessboard 
        position={ game.fen() }
        arePremovesAllowed={true}
        clearPremovesOnRightClick={true}
        snapToCursor={true}
        onPieceDrop={ onDrop }
         />
    </div>
  );
}

export default ChessBoard;