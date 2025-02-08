import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaFrame,
} from "react-native-safe-area-context"
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler"
import { Colors } from "@/constants/Colors"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { useCallback, useEffect, useMemo, useState } from "react"
import ThemedText from "@/components/ThemedText"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import Svg, { Path } from "react-native-svg"
import LinkedOptionButton from "@/components/LinkedOptionButton"

type Board = Array<Array<number | null>>
type WinResult = null | {
  winnerId: number | null
  winningCells: Array<Array<number>>
}

const BOARD_SIZE = 20
const WIN_CONDITION = 5
const TABLE_BORDERWIDTH = 1

const initialBoard: Board = Array.from({ length: BOARD_SIZE }, () =>
  Array(BOARD_SIZE).fill(null),
)

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

const symbols = {
  1: user.symbolIcon,
  2: oponnent.symbolIcon,
}

export default function Game() {
  const { width } = useSafeAreaFrame()
  const svgCurveHeight = 50
  const svgHeight = 150
  const TABLE_WIDTH = width * 0.95
  const CELL_SIZE = TABLE_WIDTH / BOARD_SIZE
  const [board, setBoard] = useState<Board>(initialBoard)

  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const offset = useSharedValue({ x: 0, y: 0 })
  const start = useSharedValue({ x: 0, y: 0 })

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale
    })
    .onEnd(() => {
      savedScale.value = scale.value
    })

  const dragGesture = Gesture.Pan()
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      }
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: offset.value.x },
      { translateY: offset.value.y },
    ],
  }))

  const composed = Gesture.Race(dragGesture, pinchGesture)

  const [currentPlayerId, setCurrentPlayerId] = useState<number | null>(user.id)
  const [winResult, setWinResult] = useState<WinResult>(null)

  const checkFiveInARow = useCallback((newBoard: Board): WinResult | null => {
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
  }, [])

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
        const nextPlayer = currentPlayerId === user.id ? oponnent.id : user.id
        setCurrentPlayerId(nextPlayer)
      }
    },
    [board, currentPlayerId, winResult, checkFiveInARow],
  )

  const table = useMemo(
    () =>
      board.map((rowData, rowIndex) => (
        <View
          key={rowIndex}
          style={{ flexDirection: "row", width: TABLE_WIDTH }}
        >
          {rowData.map((cell, cellIndex) => (
            <TouchableOpacity
              key={cellIndex}
              style={[
                {
                  borderColor: Colors.main.text,
                  backgroundColor: Colors.main.background,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  alignItems: "center",
                  justifyContent: "center",
                  borderLeftWidth: TABLE_BORDERWIDTH,
                  borderTopWidth: TABLE_BORDERWIDTH,
                },
                winResult?.winningCells?.some(
                  ([x, y]) => x === rowIndex && y === cellIndex,
                ) && { backgroundColor: "#d4edda" },
                rowIndex === BOARD_SIZE - 1 && {
                  borderBottomWidth: TABLE_BORDERWIDTH,
                },
                cellIndex === BOARD_SIZE - 1 && {
                  borderRightWidth: TABLE_BORDERWIDTH,
                },
              ]}
              onPress={() => handlePress(rowIndex, cellIndex)}
            >
              if (cell)
              {
                <ThemedText style={{ fontSize: 10 }} key={cellIndex}>
                  {symbols[cell]}
                </ThemedText>
              }
            </TouchableOpacity>
          ))}
        </View>
      )),
    [board, winResult],
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

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SafeAreaView
          style={{ backgroundColor: Colors.main.background, display: "flex" }}
          className="h-full"
        >
          <Svg style={{ position: "absolute" }}>
            <Path
              d={`M0,0 H${width} V${svgCurveHeight} Q${
                width / 2
              },${svgHeight} 0,${svgCurveHeight} Z`}
              fill={Colors.main.theme}
            />
          </Svg>
          <GestureDetector gesture={composed}>
            <Animated.View
              style={[
                {
                  minWidth: "auto",
                  marginTop: svgCurveHeight + 70,
                  justifyContent: "center",
                  alignItems: "center",
                },
                animatedStyle,
              ]}
            >
              {table}
            </Animated.View>
          </GestureDetector>
          <View
            style={{
              width: "100%",
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={handleClick}
              disabled={disabled}
              style={[styles.mainButton, disabled && styles.mainButtonDisabled]}
            >
              <ThemedText style={styles.mainButtonText}>
                {disabled ? `Odblokowanie za ${timeLeft}s` : "Confirm"}
              </ThemedText>
            </TouchableOpacity>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <LinkedOptionButton
                icon="arrow-back"
                iconColor={Colors.main.text}
                iconSize={24}
                style={{ width: "30%" }}
                href="/games"
              />

              <LinkedOptionButton
                icon="pause"
                iconColor={Colors.main.text}
                iconSize={24}
                style={{
                  width: "30%",
                  marginRight: "2.5%",
                  marginLeft: "2.5%",
                }}
                href="/games"
              />

              <LinkedOptionButton
                icon="repeat"
                iconColor={Colors.main.text}
                iconSize={24}
                style={{ width: "30%" }}
                href="/games"
              />
            </View>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  mainButton: {
    width: "95%",
    height: 100,
    backgroundColor: Colors.main.theme,
    marginBottom: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mainButtonText: {
    fontSize: 30,
  },
  mainButtonDisabled: {
    backgroundColor: "gray",
  },
})
