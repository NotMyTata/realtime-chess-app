'use client'

import Sidebar from "./Sidebar";
import Statusbar from "./Statusbar";
import './ChessGame.css'
import { Chessboard } from "react-chessboard";
import { Chess } from 'chess.js';
import { useEffect, useRef, useState } from 'react';
import { supabase } from "app/supabase-client";

const ChessGame = ({ roomId }: { roomId: string }) => {
  const [ gameState, setGameState ] = useState(new Chess());
  const [ moveHistory, setMoveHistory ] = useState<string[]>([]);
  const [ whiteTime, setWhiteTime ] = useState(5*60);
  const [ blackTime, setBlackTime ] = useState(5*60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    

    timerRef.current = setInterval(() => {
      if (gameState.turn().toString() === 'w') {
        setWhiteTime(prev => Math.max(prev - 1, 0));
      } else {
        setBlackTime(prev => Math.max(prev - 1, 0));
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    checkForTimeOut();
  }, [whiteTime, blackTime]);

  function checkForTimeOut() {
    if (whiteTime === 0 || blackTime === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      alert(`${whiteTime === 0 ? 'White' : 'Black'} ran out of time!`);
    }
  }

  function checkForGameOver() {
    if (gameState.isCheckmate()) {
      alert(`${gameState.turn().toString() === 'w'? 'Black' : 'White'} won by checkmate!`);
    }

    if (gameState.isDraw()) {
      let causeOfDraw = '';

      if (gameState.isDrawByFiftyMoves()) causeOfDraw = 'by Fifty Moves';
      else if (gameState.isThreefoldRepetition()) causeOfDraw = 'by Three Fold Repetition';
      else if (gameState.isInsufficientMaterial()) causeOfDraw = 'by Insufficient Material';
      else if (gameState.isStalemate()) causeOfDraw = 'by Stalemate';

      alert(`Draw! ${causeOfDraw}`);
    }
  }
  
  function onPieceDrop(source: string, target: string): boolean {
    try {
      const isValidMove = gameState.move({from: source, to: target});

      if (isValidMove) {
        setGameState(gameState);
        setMoveHistory(prev => [...prev, target]);
        checkForGameOver();
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  return (
    <div className="chessgame-component">
        <Statusbar 
          whiteTime={whiteTime}
          blackTime={blackTime}
          currentTurn={gameState.turn().toString()} />
        <div className="chessboard">
          <Chessboard
            position={gameState.fen()}
            onPieceDrop={onPieceDrop} 
            arePremovesAllowed={true}
            clearPremovesOnRightClick={true}
            snapToCursor={true} />
        </div>
        <Sidebar
          isGameOver={gameState.isGameOver()}
          moveHistory={gameState.history()} />
    </div>
  );
}

export default ChessGame;