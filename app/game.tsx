import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaFrame,
} from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import ThemedText from "@/components/ThemedText"
import Svg, { Path } from "react-native-svg"
import LinkedOptionButton from "@/components/LinkedOptionButton"
import ActionOptionButton from "@/components/ActionOptionButton"
import GameBoard from "@/components/Game/GameBoard"
import { memo, useCallback } from "react"
import { useGame } from "@/contexts/GameContext"
import { useTheme } from "@/contexts/ThemeContext"

// Memoized player info component
const PlayerInfo = memo(({ currentPlayer, timeLeft }: { currentPlayer: string, timeLeft: number }) => (
  <View style={styles.playerInfoContainer}>
    <ThemedText style={styles.playerInfoText}>
      Player: {currentPlayer} - Time left: {timeLeft}s
    </ThemedText>
  </View>
));

// Memoized confirm button component
const ConfirmButton = memo(({ 
  onConfirm, 
  hasSelection, 
  colors 
}: { 
  onConfirm: () => void, 
  hasSelection: boolean, 
  colors: any 
}) => {
  // Pre-compute button style to avoid recreating style arrays on each render
  const buttonStyle = [
    styles.mainButton, 
    { backgroundColor: colors.theme },
    !hasSelection && styles.mainButtonDisabled
  ];
  
  return (
    <TouchableOpacity
      onPress={onConfirm}
      disabled={!hasSelection}
      style={buttonStyle}
      activeOpacity={0.7} // Improve touch feedback
    >
      <ThemedText style={styles.mainButtonText}>
        {hasSelection ? "Confirm" : "Select a cell"}
      </ThemedText>
    </TouchableOpacity>
  );
});

// Memoized options container component
const OptionsContainer = memo(({ 
  onReset, 
  colors 
}: { 
  onReset: () => void, 
  colors: any 
}) => (
  <View style={styles.optionsContainer}>
    <LinkedOptionButton
      icon="arrow-back"
      iconColor={colors.text}
      iconSize={24}
      style={styles.sideButton}
      href="/games"
    />

    <LinkedOptionButton
      icon="pause"
      iconColor={colors.text}
      iconSize={24}
      style={styles.middleButton}
      href="/games"
    />

    <ActionOptionButton
      icon="repeat"
      iconColor={colors.text}
      iconSize={24}
      style={styles.sideButton}
      onPress={onReset}
    />
  </View>
));

// Memoized game controls component to prevent unnecessary re-renders
const GameControls = memo(({ 
  onConfirm, 
  onReset,
  timeLeft,
  colors,
  currentPlayer,
  hasSelection
}: { 
  onConfirm: () => void,
  onReset: () => void,
  timeLeft: number,
  colors: any,
  currentPlayer: string,
  hasSelection: boolean
}) => (
  <View style={styles.controlsContainer}>
    <PlayerInfo currentPlayer={currentPlayer} timeLeft={timeLeft} />
    <ConfirmButton onConfirm={onConfirm} hasSelection={hasSelection} colors={colors} />
    <OptionsContainer onReset={onReset} colors={colors} />
  </View>
));

export default function Game() {
  const { width } = useSafeAreaFrame();
  const svgCurveHeight = 50;
  const svgHeight = 150;
  const { colors } = useTheme();

  const {
    board,
    winResult,
    handleCellSelect,
    handleConfirm,
    timeLeft,
    disabled,
    symbols,
    resetGame,
    selectedCell,
    currentPlayerId
  } = useGame();

  // Wrap resetGame in useCallback to prevent unnecessary re-renders
  const handleReset = useCallback(() => {
    resetGame();
  }, [resetGame]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
          className="h-full"
        >
          {/* Curved header background */}
          <Svg style={styles.headerBackground}>
            <Path
              d={`M0,0 H${width} V${svgCurveHeight} Q${
                width / 2
              },${svgHeight} 0,${svgCurveHeight} Z`}
              fill={colors.theme}
            />
          </Svg>
          
          {/* Game board */}
          <GameBoard
            board={board}
            winResult={winResult}
            symbols={symbols}
            handleCellSelect={handleCellSelect}
            selectedCell={selectedCell}
            currentPlayerId={currentPlayerId}
          />
          
          {/* Game controls */}
          <GameControls 
            onConfirm={handleConfirm}
            onReset={handleReset}
            timeLeft={timeLeft}
            colors={colors}
            currentPlayer={symbols[currentPlayerId || 1]}
            hasSelection={!!selectedCell}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex"
  },
  headerBackground: {
    position: "absolute"
  },
  controlsContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  playerInfoContainer: {
    width: "95%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255, 183, 3, 0.2)",
    alignItems: "center",
  },
  playerInfoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mainButton: {
    width: "95%",
    height: 100,
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
  optionsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  middleButton: {
    width: "30%",
    marginRight: "2.5%",
    marginLeft: "2.5%",
  },
  sideButton: {
    width: "30%"
  }
})
