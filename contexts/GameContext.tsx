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
  selectedCell: [number, number] | null;
  handleCellSelect: (rowIndex: number, colIndex: number) => void;
  handleConfirm: () => void;
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
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  // Reset game state
  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setCurrentPlayerId(players[0].id);
    setWinResult(null);
    setDisabled(false);
    setTimeLeft(0);
  }, [players]);

  // Handle cell selection
  const handleCellSelect = useCallback(
    (rowIndex: number, colIndex: number) => {
      // Don't allow selection if the game is over or the cell is already filled
      if (winResult || board[rowIndex][colIndex] || disabled) return;
      
      // Set the selected cell
      setSelectedCell([rowIndex, colIndex]);
    },
    [board, winResult, disabled]
  );

  // Handle confirm button click
  const handleConfirm = useCallback(() => {
    // If no cell is selected or the game is over, do nothing
    if (!selectedCell || winResult) return;
    
    const [rowIndex, colIndex] = selectedCell;
    
    // Don't allow confirmation if the cell is already filled
    if (board[rowIndex][colIndex]) return;

    // Update the board with the current player's mark
    const nextBoard = board.map((row, r) =>
      row.map((cell, c) =>
        r === rowIndex && c === colIndex ? currentPlayerId : cell
      )
    );

    setBoard(nextBoard);
    
    // Check for a win
    const result = checkFiveInARow(nextBoard);

    if (result) {
      setWinResult(result);
      // Stop the timer if the game is over
      setTimeLeft(0);
      setDisabled(false);
    } else {
      // Switch to the next player
      const nextPlayer =
        currentPlayerId === players[0].id ? players[1].id : players[0].id;
      setCurrentPlayerId(nextPlayer);
      
      // Reset the timer for the next player
      setTimeLeft(20);
    }
    
    // Reset the selected cell
    setSelectedCell(null);
    
  }, [board, currentPlayerId, selectedCell, winResult, players]);

  // Start the game with a timer for the first player
  useEffect(() => {
    setTimeLeft(20);
  }, []);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timeLeft > 0 && !winResult) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !winResult) {
      // Time's up, switch to the next player
      const nextPlayer =
        currentPlayerId === players[0].id ? players[1].id : players[0].id;
      setCurrentPlayerId(nextPlayer);
      setSelectedCell(null);
      setTimeLeft(20); // Reset timer for next player
    }

    return () => clearInterval(timer);
  }, [timeLeft, winResult, currentPlayerId, players]);

  return (
    <GameContext.Provider
      value={{
        players,
        board,
        currentPlayerId,
        winResult,
        symbols,
        selectedCell,
        handleCellSelect,
        handleConfirm,
        disabled,
        timeLeft,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
