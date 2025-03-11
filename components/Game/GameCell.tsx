import React, { memo, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import ThemedText from "@/components/ThemedText";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing
} from "react-native-reanimated";

interface GameCellProps {
  rowIndex: number;
  cellIndex: number;
  cellValue: number | null;
  cellSize: number;
  isWinningCell: boolean;
  isSelected: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  borderColor: string;
  backgroundColor: string;
  symbol: string | null;
  previewSymbol: string | null;
  onPress: () => void;
}

// Animated cell component with enhanced visual feedback
const GameCell = memo(
  ({
    cellSize,
    isWinningCell,
    isSelected,
    isLastRow,
    isLastColumn,
    borderColor,
    backgroundColor,
    symbol,
    previewSymbol,
    onPress,
  }: GameCellProps) => {
    // Animation values
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const rotate = useSharedValue(0);
    
    // Animate when cell value changes
    useEffect(() => {
      if (symbol) {
        // Entrance animation for new symbols
        scale.value = 0.5;
        opacity.value = 0;
        rotate.value = -45;
        
        // Sequence of animations
        scale.value = withTiming(1, { duration: 300, easing: Easing.elastic(1.2) });
        opacity.value = withTiming(1, { duration: 200 });
        rotate.value = withTiming(0, { duration: 300 });
      }
    }, [symbol]);
    
    // Animate winning cells
    useEffect(() => {
      if (isWinningCell) {
        // Pulse animation for winning cells
        scale.value = withSequence(
          withTiming(1.2, { duration: 200 }),
          withTiming(1, { duration: 200 }),
          withDelay(200, withTiming(1.1, { duration: 200 })),
          withTiming(1, { duration: 200 })
        );
      }
    }, [isWinningCell]);
    
    // Animate selected cells
    useEffect(() => {
      if (isSelected && !symbol) {
        // Subtle pulse for selected cells
        scale.value = withSequence(
          withTiming(1.05, { duration: 150 }),
          withTiming(1, { duration: 150 })
        );
      }
    }, [isSelected, symbol]);
    
    // Animated styles
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { scale: scale.value },
          { rotateZ: `${rotate.value}deg` }
        ],
        opacity: opacity.value,
      };
    });
    
    // Pre-compute cell style to avoid recreating style arrays on each render
    const cellStyle = [
      styles.cell,
      {
        borderColor,
        backgroundColor,
        width: cellSize,
        height: cellSize,
      },
      styles.cellBorder,
      isWinningCell && styles.winningCell,
      isSelected && styles.selectedCell,
      isLastRow && styles.lastRowCell,
      isLastColumn && styles.lastColumnCell,
    ];

    return (
      <TouchableOpacity
        style={cellStyle}
        onPress={onPress}
        activeOpacity={0.7}
        // Use hitSlop to make it easier to tap small cells
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
      >
        <Animated.View style={[styles.symbolContainer, animatedStyle]}>
          {symbol ? (
            <ThemedText style={styles.cellText}>{symbol}</ThemedText>
          ) : isSelected && previewSymbol ? (
            <ThemedText style={[styles.cellText, styles.selectedCellText]}>
              {previewSymbol}
            </ThemedText>
          ) : null}
        </Animated.View>
      </TouchableOpacity>
    );
  },
  // Custom equality function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.cellValue === nextProps.cellValue &&
      prevProps.isWinningCell === nextProps.isWinningCell &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.cellSize === nextProps.cellSize &&
      prevProps.borderColor === nextProps.borderColor &&
      prevProps.backgroundColor === nextProps.backgroundColor &&
      prevProps.symbol === nextProps.symbol &&
      prevProps.previewSymbol === nextProps.previewSymbol
    );
  }
);

const styles = StyleSheet.create({
  cell: {
    alignItems: "center",
    justifyContent: "center",
  },
  cellBorder: {
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  symbolContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  selectedCell: {
    backgroundColor: "rgba(255, 183, 3, 0.2)",
  },
  selectedCellText: {
    opacity: 0.5,
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

export default GameCell;
