import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { Link, LinkProps, Route } from "expo-router"
import { FunctionComponent } from "react"
import { Pressable, TouchableOpacityProps } from "react-native"

type Props = LinkProps & {
  icon: keyof typeof Ionicons.glyphMap
  iconColor: string
  iconSize: number
  href: Route
}

const LinkedOptionButton: FunctionComponent<Props> = ({
  style,
  icon,
  iconColor,
  iconSize,
  href,
}) => {
  return (
    <Link
      href={href}
      style={[
        {
          width: 70,
          height: 70,
          borderRadius: 20,
          backgroundColor: Colors.main.option,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
      asChild
    >
      <Pressable>
        <Ionicons name={icon} color={iconColor} size={iconSize} />
      </Pressable>
    </Link>
  )
}

export default LinkedOptionButton
