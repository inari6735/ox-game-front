import { Board, BOARD_SIZE } from "@/constants/gameLogic"
import { FunctionComponent, useMemo } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import { useSafeAreaFrame } from "react-native-safe-area-context"
import { WinResult } from "@/constants/gameLogic"
import ThemedText from "@/components/ThemedText"
import { useTheme } from "@/contexts/ThemeContext"

interface GameBoardProps {
  board: Board
  winResult: WinResult
  handlePress: (rowIndex: number, colIndex: number) => void
  symbols: Record<number, string>
  players?: []
}

const GameBoard: FunctionComponent<GameBoardProps> = ({
  board,
  winResult,
  symbols,
  handlePress,
}) => {
  const { width } = useSafeAreaFrame();
  const { colors } = useTheme();
  const TABLE_WIDTH = width * 0.95
  const CELL_SIZE = TABLE_WIDTH / BOARD_SIZE
  const TABLE_BORDERWIDTH = 1

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

  const table = useMemo(
    () =>
      board.map((rowData: Array<number | null>, rowIndex: number) => (
        <View
          key={rowIndex}
          style={[styles.row, { width: TABLE_WIDTH }]}
        >
          {rowData.map((cell: number | null, cellIndex: number) => {
            const isWinningCell = winResult?.winningCells?.some(
              (cell: number[]) => cell[0] === rowIndex && cell[1] === cellIndex
            );
            const isLastRow = rowIndex === BOARD_SIZE - 1;
            const isLastColumn = cellIndex === BOARD_SIZE - 1;
            
            return (
              <TouchableOpacity
                key={cellIndex}
                style={[
                  styles.cell,
                  {
                    borderColor: colors.text,
                    backgroundColor: colors.background,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderLeftWidth: TABLE_BORDERWIDTH,
                    borderTopWidth: TABLE_BORDERWIDTH,
                  },
                  isWinningCell && styles.winningCell,
                  isLastRow && styles.lastRowCell,
                  isLastColumn && styles.lastColumnCell,
                ]}
                onPress={() => handlePress(rowIndex, cellIndex)}
              >
                {cell && (
                  <ThemedText style={styles.cellText}>
                    {symbols[cell]}
                  </ThemedText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )),
    [board, winResult, colors, CELL_SIZE, TABLE_BORDERWIDTH],
  );

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.boardContainer, animatedStyle]}>
        {table}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    minWidth: "auto",
    marginTop: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 10,
  },
  winningCell: {
    backgroundColor: "#d4edda",
  },
  lastRowCell: {
    borderBottomWidth: 1,
  },
  lastColumnCell: {
    borderRightWidth: 1,
  },
});

export default GameBoard
