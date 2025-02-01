import { Image, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { Colors } from "@/constants/Colors"
import CurvedContainer from "@/components/CurvedContainer"
import UserProfile from "@/components/UserProfile"
import GameHistory from "@/components/GameHistory/GameHistory"
import MainButton from "@/components/MainButton"
import { useSafeAreaFrame } from "react-native-safe-area-context"

export default function Index() {
  const { height } = useSafeAreaFrame()

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SafeAreaView
          style={{ backgroundColor: Colors.main.background, display: "flex" }}
          className="h-full"
        >
          <CurvedContainer>
            <Image
              source={require("@/assets/images/logo.png")}
              className="w-[155px] h-[85px] mt-7"
            />
            <UserProfile />
            <GameHistory style={{ marginTop: 20 }} />
          </CurvedContainer>
          <View
            style={{
              height: height * 0.2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MainButton text="PLAY" />
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
