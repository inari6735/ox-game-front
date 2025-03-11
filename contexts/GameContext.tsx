import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { Board, WinResult, checkFiveInARow, createInitialBoard } from '@/constants/gameLogic';

export type Player = {
  id: number;
  name: string;
  symbolIcon: string;
};

interface GameContextType {
  players: Player[];
  board: Board;
  currentPlayerId: number | null;
  winResult: WinResult;
  symbols: Record<number, string>;
  handlePress: (rowIndex: number, colIndex: number) => void;
  handleClick: () => void;
  disabled: boolean;
  timeLeft: number;
  resetGame: () => void;
}

// Create the context with a default value
const GameContext = createContext<GameContextType | null>(null);

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

// Game provider component
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Player data - in a real app, this could come from an API or user authentication
  const players: Player[] = [
    {
      id: 1,
      name: "Piotr",
      symbolIcon: "O",
    },
    {
      id: 2,
      name: "Henryk",
      symbolIcon: "X",
    }
  ];

  const symbols = Object.fromEntries(
    players.map((player) => [player.id, player.symbolIcon])
  );

  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [currentPlayerId, setCurrentPlayerId] = useState<number | null>(players[0].id);
  const [winResult, setWinResult] = useState<WinResult>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Reset game state
  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setCurrentPlayerId(players[0].id);
    setWinResult(null);
    setDisabled(false);
    setTimeLeft(0);
  }, [players]);

  // Handle cell press
  const handlePress = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (winResult || board[rowIndex][colIndex]) return;

      const nextBoard = board.map((row, r) =>
        row.map((cell, c) =>
          r === rowIndex && c === colIndex ? currentPlayerId : cell
        )
      );

      setBoard(nextBoard);

      const result = checkFiveInARow(nextBoard);

      if (result) {
        setWinResult(result);
      } else {
        const nextPlayer =
          currentPlayerId === players[0].id ? players[1].id : players[0].id;
        setCurrentPlayerId(nextPlayer);
      }
    },
    [board, currentPlayerId, winResult, players]
  );

  // Handle confirm button click
  const handleClick = useCallback(() => {
    setDisabled(true);
    setTimeLeft(20);
  }, []);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (disabled && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setDisabled(false);
    }

    return () => clearInterval(timer);
  }, [disabled, timeLeft]);

  return (
    <GameContext.Provider
      value={{
        players,
        board,
        currentPlayerId,
        winResult,
        symbols,
        handlePress,
        handleClick,
        disabled,
        timeLeft,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
