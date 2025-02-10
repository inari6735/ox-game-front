import { Colors } from "@/constants/Colors"
import { Board, BOARD_SIZE } from "@/constants/gameLogic"
import { FunctionComponent, useMemo } from "react"
import { TouchableOpacity, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  AnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import { useSafeAreaFrame } from "react-native-safe-area-context"
import { WinResult } from "@/constants/gameLogic"
import ThemedText from "@/components/ThemedText"

type Props = AnimatedProps<View> & {
  board: Board
  winResult: WinResult
  handlePress: CallableFunction
  players: []
}

const GameBoard: FunctionComponent<Props> = ({
  board,
  winResult,
  symbols,
  handlePress,
}) => {
  const { width } = useSafeAreaFrame()
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

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[
          {
            minWidth: "auto",
            marginTop: 120,
            justifyContent: "center",
            alignItems: "center",
          },
          animatedStyle,
        ]}
      >
        {table}
      </Animated.View>
    </GestureDetector>
  )
}

export default GameBoard
