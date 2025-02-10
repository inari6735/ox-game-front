import {
  Board,
  checkFiveInARow,
  createInitialBoard,
  WinResult,
} from "@/constants/gameLogic"
import { useCallback, useEffect, useState } from "react"

export const useGameState = () => {
  const user = {
    id: 1,
    name: "Piotr",
    symbolIcon: "O",
  }

  const oponnent = {
    id: 2,
    name: "Henryk",
    symbolIcon: "X",
  }

  const players = [user, oponnent]
  const symbols = Object.fromEntries(
    players.map((player) => [player.id, player.symbolIcon]),
  )
  const [board, setBoard] = useState<Board>(createInitialBoard())
  const [currentPlayerId, setCurrentPlayerId] = useState<number | null>(
    players[0].id,
  )
  const [winResult, setWinResult] = useState<WinResult>(null)
  const handlePress = useCallback(
    (rowIndexParameter: number, colIndexParameter: number) => {
      if (winResult || board[rowIndexParameter][colIndexParameter]) return

      const nextBoard = board.map((row, rowIndex) =>
        row.map((col, colIndex) =>
          rowIndex === rowIndexParameter && colIndex === colIndexParameter
            ? currentPlayerId
            : col,
        ),
      )

      setBoard(nextBoard)

      const result = checkFiveInARow(nextBoard)

      if (result) {
        setWinResult(result)
      } else {
        const nextPlayer =
          currentPlayerId === players[0].id ? players[1].id : players[0].id
        setCurrentPlayerId(nextPlayer)
      }
    },
    [board, currentPlayerId, winResult, checkFiveInARow],
  )

  const [disabled, setDisabled] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (disabled && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setDisabled(false)
    }

    return () => clearInterval(timer)
  }, [disabled, timeLeft])

  const handleClick = (): void => {
    setDisabled(true)
    setTimeLeft(20)
  }

  return {
    players,
    board,
    currentPlayerId,
    winResult,
    handlePress,
    handleClick,
    disabled,
    timeLeft,
    symbols,
  }
}
