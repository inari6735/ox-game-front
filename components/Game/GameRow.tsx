import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { BOARD_SIZE } from "@/constants/gameLogic";
import GameCell from "./GameCell";

interface GameRowProps {
  rowData: Array<number | null>;
  rowIndex: number;
  tableWidth: number;
  cellSize: number;
  borderColor: string;
  backgroundColor: string;
  winningCellsMap: Record<string, boolean | undefined>;
  selectedCell: [number, number] | null;
  symbols: Record<number, string>;
  currentPlayerId: number | null;
  onCellPress: (rowIndex: number, cellIndex: number) => void;
}

// Optimized row component that only renders when necessary
const GameRow = memo(
  ({
    rowData,
    rowIndex,
    tableWidth,
    cellSize,
    borderColor,
    backgroundColor,
    winningCellsMap,
    selectedCell,
    symbols,
    currentPlayerId,
    onCellPress,
  }: GameRowProps) => {
    return (
      <View key={`row-${rowIndex}`} style={[styles.row, { width: tableWidth }]}>
        {rowData.map((cellValue, cellIndex) => {
          const cellKey = `${rowIndex}-${cellIndex}`;
          // Convert to boolean with double negation
          const isWinningCell = Boolean(winningCellsMap[cellKey]);
          const isLastRow = rowIndex === BOARD_SIZE - 1;
          const isLastColumn = cellIndex === BOARD_SIZE - 1;
          const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === cellIndex;
          
          return (
            <GameCell
              key={cellKey}
              rowIndex={rowIndex}
              cellIndex={cellIndex}
              cellValue={cellValue}
              cellSize={cellSize}
              isWinningCell={isWinningCell}
              isSelected={isSelected}
              isLastRow={isLastRow}
              isLastColumn={isLastColumn}
              borderColor={borderColor}
              backgroundColor={backgroundColor}
              symbol={cellValue ? symbols[cellValue] : null}
              previewSymbol={currentPlayerId ? symbols[currentPlayerId] : null}
              onPress={() => onCellPress(rowIndex, cellIndex)}
            />
          );
        })}
      </View>
    );
  },
  // Custom equality function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    // Only re-render if these props change
    if (
      prevProps.tableWidth !== nextProps.tableWidth ||
      prevProps.cellSize !== nextProps.cellSize ||
      prevProps.borderColor !== nextProps.borderColor ||
      prevProps.backgroundColor !== nextProps.backgroundColor ||
      prevProps.currentPlayerId !== nextProps.currentPlayerId
    ) {
      return false;
    }
    
    // Check if row data has changed
    if (prevProps.rowData.length !== nextProps.rowData.length) {
      return false;
    }
    
    for (let i = 0; i < prevProps.rowData.length; i++) {
      if (prevProps.rowData[i] !== nextProps.rowData[i]) {
        return false;
      }
    }
    
    // Check if selected cell in this row has changed
    const prevSelectedInThisRow = 
      prevProps.selectedCell && 
      prevProps.selectedCell[0] === prevProps.rowIndex;
    
    const nextSelectedInThisRow = 
      nextProps.selectedCell && 
      nextProps.selectedCell[0] === nextProps.rowIndex;
    
    if (prevSelectedInThisRow !== nextSelectedInThisRow) {
      return false;
    }
    
    if (
      prevSelectedInThisRow && 
      nextSelectedInThisRow && 
      prevProps.selectedCell![1] !== nextProps.selectedCell![1]
    ) {
      return false;
    }
    
    // Check if winning cells in this row have changed
    const prevWinningKeys = Object.keys(prevProps.winningCellsMap)
      .filter(key => key.startsWith(`${prevProps.rowIndex}-`));
    
    const nextWinningKeys = Object.keys(nextProps.winningCellsMap)
      .filter(key => key.startsWith(`${nextProps.rowIndex}-`));
    
    if (prevWinningKeys.length !== nextWinningKeys.length) {
      return false;
    }
    
    for (const key of prevWinningKeys) {
      if (!nextProps.winningCellsMap[key]) {
        return false;
      }
    }
    
    return true;
  }
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});

export default GameRow;
