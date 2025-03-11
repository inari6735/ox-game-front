import { Image, View, StyleSheet } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider, SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context"
import { Colors } from "@/constants/Colors"
import CurvedContainer from "@/components/CurvedContainer"
import UserProfile from "@/components/UserProfile"
import GameHistory from "@/components/GameHistory/GameHistory"
import MainButton from "@/components/MainButton"
import OptionButton from "@/components/OptionButton"
import { memo } from "react"

// Memoized footer component to prevent unnecessary re-renders
const HomeFooter = memo(({ height }: { height: number }) => (
  <View style={[styles.footerContainer, { height: height * 0.2 }]}>
    <OptionButton
      icon="cart"
      iconColor={Colors.main.text}
      iconSize={24}
    />
    <MainButton
      style={styles.playButton}
      text="PLAY"
      href="/games"
    />
    <OptionButton
      icon="settings"
      iconColor={Colors.main.text}
      iconSize={24}
    />
  </View>
));

export default function Index() {
  const { height } = useSafeAreaFrame()

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SafeAreaView
          style={styles.container}
          className="h-full"
        >
          {/* Main content area */}
          <CurvedContainer>
            <Image
              source={require("@/assets/images/logo.png")}
              className="w-[155px] h-[85px] mt-7"
            />
            <UserProfile />
            <GameHistory style={{ marginTop: 20 }} />
          </CurvedContainer>
          
          {/* Footer with navigation buttons */}
          <HomeFooter height={height} />
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.background,
    display: "flex"
  },
  footerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    marginLeft: 30,
    marginRight: 30
  }
});
