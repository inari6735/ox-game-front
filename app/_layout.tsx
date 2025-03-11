import { useFonts } from "expo-font"
import "@/global.css"

import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import React from "react"
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext"
import { GameProvider } from "@/contexts/GameContext"

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

// Status bar component that adapts to theme
const ThemedStatusBar = () => {
  const { isDarkMode } = useTheme();
  return <StatusBar style={isDarkMode ? "light" : "dark"} />;
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Carter-One": require("@/assets/fonts/CarterOne-Regular.ttf"),
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return (
    <ThemeProvider>
      <GameProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false, animation: "slide_from_left" }}
          />
          <Stack.Screen name="games" options={{ headerShown: false }} />
          <Stack.Screen name="game" options={{ headerShown: false }} />
        </Stack>
        <ThemedStatusBar />
      </GameProvider>
    </ThemeProvider>
  )
}
