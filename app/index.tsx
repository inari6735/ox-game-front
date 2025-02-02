import { Image, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { Colors } from "@/constants/Colors"
import CurvedContainer from "@/components/CurvedContainer"
import UserProfile from "@/components/UserProfile"
import GameHistory from "@/components/GameHistory/GameHistory"
import MainButton from "@/components/MainButton"
import { useSafeAreaFrame } from "react-native-safe-area-context"
import OptionButton from "@/components/OptionButton"

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
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <OptionButton
              icon="cart"
              iconColor={Colors.main.text}
              iconSize={24}
            />
            <MainButton
              style={{ marginLeft: 30, marginRight: 30 }}
              text="PLAY"
              href="/games"
            />
            <OptionButton
              icon="settings"
              iconColor={Colors.main.text}
              iconSize={24}
            />
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
