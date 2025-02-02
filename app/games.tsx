import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Colors } from "@/constants/Colors"
import Svg, { Path } from "react-native-svg"
import { View, Image } from "react-native"

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
            }}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              className="w-[155px] h-[85px] mt-7"
            />
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
