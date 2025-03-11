import { Board, BOARD_SIZE } from "@/constants/gameLogic";
import { FunctionComponent, useMemo, useEffect, useImperativeHandle, forwardRef } from "react";
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
  onResetPosition?: (resetFn: () => void) => void;
}

const GameBoard: FunctionComponent<GameBoardProps> = ({
  board,
  winResult,
  symbols,
  handleCellSelect,
  selectedCell,
  currentPlayerId,
  onResetPosition,
}) => {
  const { width } = useSafeAreaFrame();
  const { colors } = useTheme();
  const TABLE_WIDTH = width * 0.95;
  const CELL_SIZE = TABLE_WIDTH / BOARD_SIZE;

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });

  // Function to reset board position
  const resetPosition = () => {
    console.log("Resetting board position");
    scale.value = 1;
    savedScale.value = 1;
    offset.value = { x: 0, y: 0 };
    start.value = { x: 0, y: 0 };
  };
  
  // Register the reset function with the parent component
  useEffect(() => {
    if (onResetPosition) {
      onResetPosition(resetPosition);
    }
  }, [onResetPosition]);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: offset.value.x },
      { translateY: offset.value.y },
    ],
  }))

  const composed = Gesture.Race(dragGesture, pinchGesture)

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
