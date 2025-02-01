import { FunctionComponent } from "react"
import { TouchableOpacity, TouchableOpacityProps } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

type Props = TouchableOpacityProps & {
  icon: keyof typeof Ionicons.glyphMap
  iconColor: string
  iconSize: number
}

const OptionButton: FunctionComponent<Props> = ({
  style,
  icon,
  iconColor,
  iconSize,
}) => {
  return (
    <TouchableOpacity
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
    >
      <Ionicons name={icon} color={iconColor} size={iconSize} />
    </TouchableOpacity>
  )
}

export default OptionButton
