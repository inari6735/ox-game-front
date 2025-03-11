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

// Memoized game controls component to prevent unnecessary re-renders
const GameControls = memo(({ 
  onConfirm, 
  onReset,
  disabled, 
  timeLeft,
  colors
}: { 
  onConfirm: () => void,
  onReset: () => void,
  disabled: boolean, 
  timeLeft: number,
  colors: any
}) => (
  <View style={styles.controlsContainer}>
    <TouchableOpacity
      onPress={onConfirm}
      disabled={disabled}
      style={[
        styles.mainButton, 
        { backgroundColor: colors.theme },
        disabled && styles.mainButtonDisabled
      ]}
    >
      <ThemedText style={styles.mainButtonText}>
        {disabled ? `Unlocking in ${timeLeft}s` : "Confirm"}
      </ThemedText>
    </TouchableOpacity>
    <View style={styles.optionsContainer}>
      <LinkedOptionButton
        icon="arrow-back"
        iconColor={colors.text}
        iconSize={24}
        style={{ width: "30%" }}
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
        style={{ width: "30%" }}
        onPress={onReset}
      />
    </View>
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
    handlePress,
    handleClick,
    timeLeft,
    disabled,
    symbols,
    resetGame
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
            handlePress={handlePress}
          />
          
          {/* Game controls */}
          <GameControls 
            onConfirm={handleClick}
            onReset={handleReset}
            disabled={disabled}
            timeLeft={timeLeft}
            colors={colors}
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
  }
})
