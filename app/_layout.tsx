import { useFonts } from "expo-font"
import "@/global.css"

import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import React from "react"
SplashScreen.preventAutoHideAsync()

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
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, animation: "slide_from_left" }}
        />
        <Stack.Screen name="games" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  )
}
