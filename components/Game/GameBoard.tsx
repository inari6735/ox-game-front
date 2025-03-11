import { Board, BOARD_SIZE } from "@/constants/gameLogic";
import { FunctionComponent, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { WinResult } from "@/constants/gameLogic";
import { useTheme } from "@/contexts/ThemeContext";
import GameRow from "./GameRow";

interface GameBoardProps {
  board: Board;
  winResult: WinResult;
  handleCellSelect: (rowIndex: number, colIndex: number) => void;
  selectedCell: [number, number] | null;
  symbols: Record<number, string>;
  currentPlayerId?: number | null;
  players?: [];
}

const GameBoard: FunctionComponent<GameBoardProps> = ({
  board,
  winResult,
  symbols,
  handleCellSelect,
  selectedCell,
  currentPlayerId,
}) => {
  const { width } = useSafeAreaFrame();
  const { colors } = useTheme();
  const TABLE_WIDTH = width * 0.95;
  const CELL_SIZE = TABLE_WIDTH / BOARD_SIZE;

  // Simplified zoom and pan controls for better performance
  const scale = useSharedValue(1);
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  // Simple pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      // Limit scale between 0.5 and 2 for better control
      scale.value = Math.min(Math.max(e.scale, 0.5), 2);
    })
    .onEnd(() => {
      // Reset scale to 1 if it's close to 1 for better UX
      if (scale.value > 0.8 && scale.value < 1.2) {
        scale.value = 1;
      }
    });

  // Simple pan gesture
  const dragGesture = Gesture.Pan()
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });

  // Double tap to reset
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = 1;
      offset.value = { x: 0, y: 0 };
      start.value = { x: 0, y: 0 };
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: offset.value.x },
      { translateY: offset.value.y },
    ],
  }));

  // Combine gestures
  const composed = Gesture.Exclusive(
    doubleTapGesture,
    Gesture.Simultaneous(dragGesture, pinchGesture)
  );

  // Pre-calculate winning cells map for O(1) lookup
  const winningCellsMap = useMemo(() => {
    if (!winResult?.winningCells) return {};
    
    const map: Record<string, boolean> = {};
    winResult.winningCells.forEach(([x, y]) => {
      map[`${x}-${y}`] = true;
    });
    return map;
  }, [winResult]);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.boardContainer, animatedStyle]}>
        {board.map((rowData, rowIndex) => (
          <GameRow
            key={`row-${rowIndex}`}
            rowData={rowData}
            rowIndex={rowIndex}
            tableWidth={TABLE_WIDTH}
            cellSize={CELL_SIZE}
            borderColor={colors.text}
            backgroundColor={colors.background}
            winningCellsMap={winningCellsMap}
            selectedCell={selectedCell}
            symbols={symbols}
            currentPlayerId={currentPlayerId || null}
            onCellPress={handleCellSelect}
          />
        ))}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    minWidth: "auto",
    marginTop: 120,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default GameBoard;
