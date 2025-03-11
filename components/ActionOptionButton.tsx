import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { FunctionComponent } from "react"
import { Pressable, StyleProp, ViewStyle } from "react-native"
import { useTheme } from "@/contexts/ThemeContext"

type Props = {
  icon: keyof typeof Ionicons.glyphMap
  iconColor?: string
  iconSize: number
  style?: StyleProp<ViewStyle>
  onPress: () => void
}

const ActionOptionButton: FunctionComponent<Props> = ({
  style,
  icon,
  iconColor,
  iconSize,
  onPress,
}) => {
  const { colors } = useTheme();
  
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          width: 70,
          height: 70,
          borderRadius: 20,
          backgroundColor: colors.option,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <Ionicons 
        name={icon} 
        color={iconColor || colors.text} 
        size={iconSize} 
      />
    </Pressable>
  )
}

export default ActionOptionButton
