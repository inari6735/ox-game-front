import { Image, Text } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { Colors } from "@/constants/Colors"
import CurvedContainer from "@/components/CurvedContainer"
import UserProfile from "@/components/UserProfile"

export default function Index() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SafeAreaView
          style={{ backgroundColor: Colors.main.background }}
          className="h-full"
        >
          <CurvedContainer>
            <Image
              source={require("@/assets/images/logo.png")}
              className="w-[155px] h-[85px] mt-7"
            />
            <UserProfile />
          </CurvedContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
