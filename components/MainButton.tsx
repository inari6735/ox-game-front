import { FunctionComponent } from "react"
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  Pressable,
} from "react-native"
import ThemedText from "@/components/ThemedText"
import { Colors } from "@/constants/Colors"
import { Link, LinkProps, Route } from "expo-router"

type Props = LinkProps & {
  text: string
  href: Route
}

const MainButton: FunctionComponent<Props> = ({ style, text, href }) => {
  return (
    <Link style={[styles.button, style]} href={href} asChild>
      <Pressable>
        <ThemedText style={styles.buttonText}>{text}</ThemedText>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.main.text,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.main.background,
    shadowColor: Colors.main.text,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0D2C3E",
  },
})

export default MainButton
