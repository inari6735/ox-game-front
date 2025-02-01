import { FunctionComponent } from "react"
import { View, Image, ViewProps } from "react-native"
import ThemedText from "@/components/ThemedText"
import { Colors } from "@/constants/Colors"

type Props = ViewProps & {
  playerName: string
  playerScore: number
}

const ScoreItem: FunctionComponent<Props> = ({
  style,
  playerName,
  playerScore,
}) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
          height: 28,
          maxWidth: "100%",
        },
        style,
      ]}
    >
      <View
        style={{
          height: 28,
          width: 28,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.main.background,
          borderRadius: 14,
        }}
      >
        <ThemedText style={{ textAlign: "center" }}>{playerScore}</ThemedText>
      </View>
      <Image
        style={{
          width: 28,
          height: 28,
          backgroundColor: Colors.main.background,
          borderRadius: 14,
          marginLeft: 4,
          marginRight: 4,
        }}
        source={require("@/assets/images/profile.png")}
      />
      <ThemedText
        style={{
          textAlign: "center",
          lineHeight: 28,
        }}
      >
        {playerName}
      </ThemedText>
    </View>
  )
}

export default ScoreItem
