import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Svg, { Path } from "react-native-svg"
import { View, Image, Pressable, StyleSheet } from "react-native"
import MainButton from "@/components/MainButton"
import { Link } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import ThemedText from "@/components/ThemedText"
import { memo } from "react"
import { useTheme } from "@/contexts/ThemeContext"

// Game mode options component
const GameModeOptions = memo(() => (
  <View style={styles.optionsContainer}>
    <MainButton
      style={styles.modeButton}
      href="/game"
      text="NORMAL"
    />
    <MainButton
      style={styles.modeButton}
      href="/"
      text="RANKED"
    />
    <MainButton
      style={styles.modeButton}
      href="/"
      text="INVITE FRIEND"
    />
  </View>
));

// Back button component
const BackButton = memo(({ bottomInset, textColor }: { bottomInset: number, textColor: string }) => (
  <View
    style={[
      styles.backButtonContainer,
      { bottom: 30 + bottomInset }
    ]}
  >
    <Link href="/" asChild>
      <Pressable style={styles.backButton}>
        <Ionicons
          name="arrow-back"
          color={textColor}
          size={40}
        />
        <ThemedText style={styles.backButtonText}>Back</ThemedText>
      </Pressable>
    </Link>
  </View>
));

export default function Games() {
  const { width } = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  const svgCurveHeight = 150;
  const svgHeight = 250;
  const topContainerHeight = svgHeight - insets.top - 100;

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
          
          {/* Logo container */}
          <View
            style={[
              styles.logoContainer,
              {
                width,
                height: topContainerHeight,
              }
            ]}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              className="w-[155px] h-[85px] mt-7"
            />
          </View>
          
          {/* Game mode options */}
          <GameModeOptions />
          
          {/* Back button */}
          <BackButton 
            bottomInset={insets.bottom} 
            textColor={colors.text}
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
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  optionsContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  modeButton: {
    width: "80%",
    marginTop: 20
  },
  backButtonContainer: {
    position: "absolute",
    marginLeft: 20,
  },
  backButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 30
  }
});
