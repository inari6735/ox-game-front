import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Colors } from "@/constants/Colors"
import Svg, { Path } from "react-native-svg"
import { View, Image, Pressable } from "react-native"
import MainButton from "@/components/MainButton"
import { Link } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import ThemedText from "@/components/ThemedText"

export default function Games() {
  const { width } = useSafeAreaFrame()
  const insets = useSafeAreaInsets()
  const svgCurveHeight = 150
  const svgHeight = 250
  const topContainerHeight = svgHeight - insets.top - 100

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
          <View
            style={{
              width: width,
              height: topContainerHeight,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 50,
            }}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              className="w-[155px] h-[85px] mt-7"
            />
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <MainButton
              style={{ width: "80%", marginTop: 20 }}
              href="/game"
              text="NORMAL"
            />
            <MainButton
              style={{ width: "80%", marginTop: 20 }}
              href="/"
              text="RANKED"
            />
            <MainButton
              style={{ width: "80%", marginTop: 20 }}
              href="/"
              text="INVITE FRIEND"
            />
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 30 + insets.bottom,
              marginLeft: 20,
            }}
          >
            <Link href="/" asChild>
              <Pressable
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="arrow-back"
                  color={Colors.main.text}
                  size={40}
                />
                <ThemedText style={{ fontSize: 30 }}>Back</ThemedText>
              </Pressable>
            </Link>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
