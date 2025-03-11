import React, { memo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import ThemedText from "@/components/ThemedText";

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

// Highly optimized cell component with PureComponent-like behavior
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
        {symbol ? (
          <ThemedText style={styles.cellText}>{symbol}</ThemedText>
        ) : isSelected && previewSymbol ? (
          <ThemedText style={[styles.cellText, styles.selectedCellText]}>
            {previewSymbol}
          </ThemedText>
        ) : null}
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
