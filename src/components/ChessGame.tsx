'use client'

import Sidebar from "./Sidebar";
import Statusbar from "./Statusbar";
import './ChessGame.css'
import { Chessboard } from "react-chessboard";
import { Chess, Piece, Square } from 'chess.js';
import { useEffect, useRef, useState } from 'react';
import { supabase } from "app/supabase-client";
import type { RealtimeChannel } from '@supabase/supabase-js';
import { Message } from "./Chat";
import Banner from "./Banner";

export interface GameData {
  fen: string;
  room_id: string;
  white_time: number;
  black_time: number;
  turn: string;
  white_player_id: string | null;
  black_player_id: string | null;
  status: 'waiting' | 'active' | 'finished';
  winner: string | null;
  move_history: string[];
  last_move_time: string;
}

const ChessGame = ({ roomId }: { roomId: string }) => {
  const [gameState, setGameState] = useState(new Chess());
  const [whiteTime, setWhiteTime] = useState(5 * 60);
  const [blackTime, setBlackTime] = useState(5 * 60);
  const [playerColor, setPlayerColor] = useState<'w' | 'b' | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'active' | 'finished'>('waiting');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const moveSoundRef = useRef<HTMLAudioElement | null>(null);
  const captureSoundRef = useRef<HTMLAudioElement | null>(null);
  const notifySoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    moveSoundRef.current = new Audio('/sounds/move-self.mp3');
    captureSoundRef.current = new Audio('/sounds/capture.mp3');
    notifySoundRef.current = new Audio('/sounds/notify.mp3');
  }, []);

  // Initialize player and join game
  useEffect(() => {
    initializeGame();
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [roomId]);

  // Timer logic
  useEffect(() => {
    if (gameStatus !== 'active') return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (gameState.turn() === 'w') {
        setWhiteTime(prev => {
          const newTime = Math.max(prev - 1, 0);
          if (newTime === 0) {
            handleTimeOut('w');
          }
          return newTime;
        });
      } else {
        setBlackTime(prev => {
          const newTime = Math.max(prev - 1, 0);
          if (newTime === 0) {
            handleTimeOut('b');
          }
          return newTime;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, gameStatus]);

  async function initializeGame() {
    try {
      // Subscribe to realtime updates
      subscribeToGameUpdates();

      const { data: { user } } = await supabase.auth.getUser();
      let userId = user === null? null : user!.id;
      if (!userId) {
        userId = localStorage.getItem('user_id');
        if(!userId) {
          userId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('user_id', userId);
        }
      }
      
      setPlayerId(userId);

      const { data: existingGame, error: fetchError } = await supabase
        .from('games')
        .select('*')
        .eq('room_id', roomId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let gameData: GameData;

      if (existingGame) {
        // Join existing game
        if (!existingGame.white_player_id) {
          // Join as white
          const { data, error } = await supabase
            .from('games')
            .update({ white_player_id: userId })
            .eq('room_id', roomId)
            .select()
            .single();
          
          if (error) throw error;
          gameData = data;
          setPlayerColor('w');

        } else if (!existingGame.black_player_id && existingGame.white_player_id !== userId) {
          // Join as black
          const { data, error } = await supabase
            .from('games')
            .update({ 
              black_player_id: userId,
              status: 'active',
              last_move_time: new Date().toISOString(),
            })
            .eq('room_id', roomId)
            .select()
            .single();
          
          if (error) throw error;
          gameData = data;
          setPlayerColor('b');

        } else {
          // Determine player color for existing player
          gameData = existingGame;
          if (existingGame.white_player_id === userId) {
            setPlayerColor('w');
          } else if (existingGame.black_player_id === userId) {
            setPlayerColor('b');
          } else {
            setErrorMessage('Game is full');
            return;
          }
        }
      } else {
        // Create new game
        const { data, error } = await supabase
          .from('games')  
          .insert({
            room_id: roomId,
            fen: gameState.fen(),
            move_history: moveHistory,
            white_time: 5 * 60,
            black_time: 5 * 60,
            white_player_id: userId,
            status: 'waiting',
            last_move_time: new Date().toISOString()
          })
          .select()
          .single();

          if (error) {
            if (error.code === '23505' || error.message.includes('duplicate key')) {
              // Room was created by another client in the meantime
              // Re-fetch the existing game and continue
              const { data: retryGame, error: retryError } = await supabase
                .from('games')
                .select('*')
                .eq('room_id', roomId)
                .single();

              if (retryError) throw retryError;
              gameData = retryGame;
            } else {
              throw error;
            }
          } else {
            gameData = data;
            setPlayerColor('w');
          }
      }
      
      const now = new Date().getTime();
      const lastMove = new Date(gameData.last_move_time).getTime();
      const elapsed = Math.floor((now - lastMove) / 1000);
      
      // Update game state
      setGameState(new Chess(gameData.fen));
      setWhiteTime(gameData.status === 'active' && gameData.turn === 'w'? Math.max(gameData.white_time - elapsed, 0) : gameData.white_time);
      setBlackTime(gameData.status === 'active' && gameData.turn === 'b'? Math.max(gameData.black_time - elapsed, 0) : gameData.black_time);
      setGameStatus(gameData.status);
      setMoveHistory(gameData.move_history);

    } catch (error) {
      console.error('Error initializing game:', error);
      setErrorMessage('Failed to initialize game');
    }
  }

  function subscribeToGameUpdates() {
    channelRef.current = supabase
      .channel(`chess_game_${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const updatedGame = payload.new as GameData;
          const now = new Date().getTime();
          const lastMove = new Date(updatedGame.last_move_time).getTime();
          const elapsed = Math.floor((now - lastMove) / 1000);
          
          // Update game state
          setGameState(new Chess(updatedGame.fen));
          setWhiteTime(updatedGame.turn === 'w'? Math.max(updatedGame.white_time - elapsed, 0) : updatedGame.white_time);
          setBlackTime(updatedGame.turn === 'b'? Math.max(updatedGame.black_time - elapsed, 0) : updatedGame.black_time);
          setGameStatus(updatedGame.status);
          setMoveHistory(updatedGame.move_history);

          // Check for game over conditions
          if (updatedGame.status === 'finished' && updatedGame.winner) {
            handleGameEnd(updatedGame.winner);
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });
  }

  async function handleTimeOut(color: 'w' | 'b') {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const winner = color === 'w' ? 'b' : 'w';
    
    try {
      await supabase
        .from('games')
        .update({
          status: 'finished',
          winner: winner,
        })
        .eq('room_id', roomId);
      
      alert(`${winner === 'w' ? 'White' : 'Black'} won by timeout`);
    } catch (error) {
      console.error('Error updating game after timeout:', error);
    }
  }

  function handleGameEnd(winner: string) {
    if (timerRef.current) clearInterval(timerRef.current);
    
    let message = '';
    if (winner === 'draw') {
      message = 'Game ended in a draw!';
    } else {
      message = `${winner === 'w'? 'White' : 'Black'} wins!`;
    }
    
    setTimeout(() => alert(message), 100);
  }

  async function checkForGameOver(chess: Chess) {
    let gameEndData: { status: string; winner: string | null } | null = null;

    if (chess.isCheckmate()) {
      const winner = chess.turn().toString() === 'w'? 'b' : 'w';
      gameEndData = { status: 'finished', winner };
    } else if (chess.isDraw()) {
      gameEndData = { status: 'finished', winner: 'draw' };
    }

    if (gameEndData) {
      try {
        await supabase
          .from('games')
          .update({
            ...gameEndData,
          })
          .eq('room_id', roomId);
      } catch (error) {
        console.error('Error updating game end:', error);
      }
    }
  }

  function onPieceDrop(source: string, target: string): boolean {
    try {
      // Check if it's the player's turn
      const currentTurn = gameState.turn().toString();
      if (
        (currentTurn === 'w' && playerColor !== 'w') ||
        (currentTurn === 'b' && playerColor !== 'b')
      ) {
        return false;
      }

      // Check if game is active
      if (gameStatus !== 'active') {
        return false;
      }

      // Create a copy of the game state to test the move
      const gameCopy = new Chess(gameState.fen());
      const move = gameCopy.move({ from: source, to: target });

      if (move) {
        // Valid move - update the database asynchronously
        updateGameState(gameCopy, currentTurn, move.san);
        
        if(move.captured) captureSoundRef.current?.play();
        else moveSoundRef.current?.play();

        return true;
      }
    } catch (error) {
      console.error('Error making move:', error);
      return false;
    }
    
    return false;
  }

  async function updateGameState(gameCopy: Chess, currentTurn: string, moveSan: string) {
    try {
      const newTime = currentTurn === 'w' ? whiteTime : blackTime;
      
      const { error } = await supabase
        .from('games')
        .update({
          fen: gameCopy.fen(),
          turn: gameCopy.turn(),
          move_history: [...moveHistory, moveSan],
          white_time: currentTurn === 'w' ? newTime : whiteTime,
          black_time: currentTurn === 'b' ? newTime : blackTime,
          last_move_time: new Date().toISOString()
        })
        .eq('room_id', roomId);

      if (error) {
        console.error('Error updating move:', error);
        // Optionally revert the move or show error to user
        return;
      }

      // Check for game over conditions
      await checkForGameOver(gameCopy);
      
    } catch (error) {
      console.error('Error updating game state:', error);
    }
  }

  const renderBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('game_requests')
        .select()
        .eq('room_id', roomId)
        .single();

      if (error) throw error;

      return (
        <Banner
          roomId={roomId}
          playerColor={playerColor} />
      );
    } catch (error) {
      console.error('Error while rendering banner: ', error);
    }
    return(<div></div>);
  }

  if (errorMessage) {
    return (
      <div className="chessgame-component">
        <div className="error-message">
          Error: {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="chessgame-component">
      <Banner
        roomId={roomId}
        playerColor={playerColor} 
      />
      <Statusbar 
        whiteTime={whiteTime}
        blackTime={blackTime}
        currentTurn={gameState.turn().toString()}
        playerColor={playerColor} 
      />
      <div className="chessboard">
        <Chessboard
          position={gameState.fen()}
          onPieceDrop={onPieceDrop}
          autoPromoteToQueen={true}
          arePiecesDraggable={gameStatus === 'finished' ? false : true}
          arePremovesAllowed={false}
          clearPremovesOnRightClick={true}
          snapToCursor={true}
          boardOrientation={playerColor === 'w' ? 'white' : 'black'}
        />
      </div>
      <Sidebar
        gameStatus={gameStatus}
        moveHistory={moveHistory}
        roomId={roomId}
        playerColor={playerColor}
      />
    </div>
  );
}

export default ChessGame;