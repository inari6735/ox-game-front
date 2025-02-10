import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaFrame,
} from "react-native-safe-area-context"
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler"
import { Colors } from "@/constants/Colors"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { useCallback, useEffect, useMemo, useState } from "react"
import ThemedText from "@/components/ThemedText"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import Svg, { Path } from "react-native-svg"
import LinkedOptionButton from "@/components/LinkedOptionButton"
import { useGameState } from "@/hooks/useGameState"
import GameBoard from "@/components/Game/GameBoard"

export default function Game() {
  const { width } = useSafeAreaFrame()
  const svgCurveHeight = 50
  const svgHeight = 150

  const {
    players,
    board,
    currentPlayerId,
    winResult,
    handlePress,
    handleClick,
    timeLeft,
    disabled,
    symbols,
  } = useGameState()

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SafeAreaView
          style={{ backgroundColor: Colors.main.background, display: "flex" }}
          className="h-full"
        >
          <Svg style={{ position: "absolute" }}>
            <Path
              d={`M0,0 H${width} V${svgCurveHeight} Q${
                width / 2
              },${svgHeight} 0,${svgCurveHeight} Z`}
              fill={Colors.main.theme}
            />
          </Svg>
          <GameBoard
            board={board}
            winResult={winResult}
            symbols={symbols}
            handlePress={handlePress}
          />
          <View
            style={{
              width: "100%",
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={handleClick}
              disabled={disabled}
              style={[styles.mainButton, disabled && styles.mainButtonDisabled]}
            >
              <ThemedText style={styles.mainButtonText}>
                {disabled ? `Odblokowanie za ${timeLeft}s` : "Confirm"}
              </ThemedText>
            </TouchableOpacity>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <LinkedOptionButton
                icon="arrow-back"
                iconColor={Colors.main.text}
                iconSize={24}
                style={{ width: "30%" }}
                href="/games"
              />

              <LinkedOptionButton
                icon="pause"
                iconColor={Colors.main.text}
                iconSize={24}
                style={{
                  width: "30%",
                  marginRight: "2.5%",
                  marginLeft: "2.5%",
                }}
                href="/games"
              />

              <LinkedOptionButton
                icon="repeat"
                iconColor={Colors.main.text}
                iconSize={24}
                style={{ width: "30%" }}
                href="/games"
              />
            </View>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  mainButton: {
    width: "95%",
    height: 100,
    backgroundColor: Colors.main.theme,
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
})
