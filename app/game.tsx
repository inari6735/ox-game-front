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
import { memo, useCallback, useEffect, useRef } from "react"
import { useGame } from "@/contexts/GameContext"
import { useTheme } from "@/contexts/ThemeContext"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  interpolateColor
} from "react-native-reanimated"

// Animated player info component
const PlayerInfo = memo(({ currentPlayer, timeLeft }: { currentPlayer: string, timeLeft: number }) => {
  // Animation values
  const scale = useSharedValue(1);
  const textColor = useSharedValue(0);
  
  // Animate when time is running low
  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0) {
      // Urgent pulsing animation for low time
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        -1, // Infinite repeat
        true // Reverse
      );
      
      // Color transition from normal to red
      textColor.value = withTiming(1, { duration: 500 });
    } else {
      // Reset animations
      scale.value = withTiming(1);
      textColor.value = withTiming(0);
    }
  }, [timeLeft]);
  
  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      textColor.value,
      [0, 1],
      ["rgba(255, 183, 3, 0.2)", "rgba(255, 0, 0, 0.2)"]
    );
    
    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });
  
  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      textColor.value,
      [0, 1],
      ["#000000", "#FF0000"]
    );
    
    return {
      color,
    };
  });
  
  return (
    <Animated.View style={[styles.playerInfoContainer, animatedContainerStyle]}>
      <Animated.Text style={[styles.playerInfoText, animatedTextStyle]}>
        Player: {currentPlayer} - Time left: {timeLeft}s
      </Animated.Text>
    </Animated.View>
  );
});

// Animated confirm button component
const ConfirmButton = memo(({ 
  onConfirm, 
  hasSelection, 
  colors 
}: { 
  onConfirm: () => void, 
  hasSelection: boolean, 
  colors: any 
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const elevation = useSharedValue(0);
  
  // Animate when selection changes
  useEffect(() => {
    if (hasSelection) {
      // Button becomes available animation
      scale.value = withSequence(
        withTiming(1.05, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
      
      // Add subtle pulsing effect to draw attention
      elevation.value = withRepeat(
        withSequence(
          withTiming(5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite repeat
        true // Reverse
      );
    } else {
      // Reset animations
      scale.value = withTiming(1);
      elevation.value = withTiming(0);
    }
  }, [hasSelection]);
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      elevation: elevation.value,
      backgroundColor: hasSelection ? colors.theme : 'gray',
    };
  });
  
  return (
    <Animated.View style={{ width: "95%" }}>
      <TouchableOpacity
        onPress={onConfirm}
        disabled={!hasSelection}
        activeOpacity={0.7} // Improve touch feedback
      >
        <Animated.View style={[styles.mainButton, animatedStyle]}>
          <ThemedText style={styles.mainButtonText}>
            {hasSelection ? "Confirm" : "Select a cell"}
          </ThemedText>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// Memoized options container component
const OptionsContainer = memo(({ 
  onReset, 
  colors,
  onResetBoardPosition
}: { 
  onReset: () => void, 
  colors: any,
  onResetBoardPosition: () => void
}) => (
  <View style={styles.optionsContainer}>
    <LinkedOptionButton
      icon="arrow-back"
      iconColor={colors.text}
      iconSize={24}
      style={styles.sideButton}
      href="/games"
    />

    <ActionOptionButton
      icon="refresh"
      iconColor={colors.text}
      iconSize={24}
      style={styles.middleButton}
      onPress={onResetBoardPosition}
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
  hasSelection,
  onResetBoardPosition
}: { 
  onConfirm: () => void,
  onReset: () => void,
  timeLeft: number,
  colors: any,
  currentPlayer: string,
  hasSelection: boolean,
  onResetBoardPosition: () => void
}) => (
  <View style={styles.controlsContainer}>
    <PlayerInfo currentPlayer={currentPlayer} timeLeft={timeLeft} />
    <ConfirmButton onConfirm={onConfirm} hasSelection={hasSelection} colors={colors} />
    <OptionsContainer 
      onReset={onReset} 
      colors={colors} 
      onResetBoardPosition={onResetBoardPosition} 
    />
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
  
  // Create a ref to store the reset function
  const resetBoardPositionRef = useRef<() => void>(() => {});
  
  // Function to reset the board position
  const handleResetBoardPosition = useCallback(() => {
    console.log("Reset board position called");
    // Call the function stored in the ref
    resetBoardPositionRef.current();
  }, []);

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
            onResetPosition={(resetFn) => {
              resetBoardPositionRef.current = resetFn;
            }}
          />
          
          {/* Game controls */}
          <GameControls 
            onConfirm={handleConfirm}
            onReset={handleReset}
            timeLeft={timeLeft}
            colors={colors}
            currentPlayer={symbols[currentPlayerId || 1]}
            hasSelection={!!selectedCell}
            onResetBoardPosition={handleResetBoardPosition}
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
