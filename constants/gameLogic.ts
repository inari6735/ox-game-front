export type Board = Array<Array<number | null>>
export type WinResult = null | {
  winnerId: number | null
  winningCells: Array<Array<number>>
}

export const BOARD_SIZE = 20
const WIN_CONDITION = 5

export const createInitialBoard = (): Board =>
  Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null))

export const checkFiveInARow = (newBoard: Board): WinResult | null => {
  const directions = [
    { name: "horizontal", dx: 0, dy: 1 },
    { name: "vertical", dx: 1, dy: 0 },
    { name: "diag-down-right", dx: 1, dy: 1 },
    { name: "diag-down-left", dx: 1, dy: -1 },
  ]

  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const playerId = newBoard[x][y]
      if (!playerId) continue

      for (let { dx, dy } of directions) {
        let count = 1
        const winningCells = [[x, y]]

        for (let step = 1; step < WIN_CONDITION; step++) {
          const nx = x + dx * step
          const ny = y + dy * step

          if (
            nx < 0 ||
            ny < 0 ||
            nx >= BOARD_SIZE ||
            ny >= BOARD_SIZE ||
            newBoard[nx][ny] !== playerId
          ) {
            break
          }
          count++
          winningCells.push([nx, ny])
        }

        if (count === WIN_CONDITION) {
          return { winnerId: playerId, winningCells }
        }
      }
    }
  }
  // Draw
  if (newBoard.flat().every((cell) => cell !== null)) {
    return { winnerId: null, winningCells: [] }
  }

  return null
}
