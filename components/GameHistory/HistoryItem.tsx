import { FunctionComponent } from "react"
import { View, ViewProps } from "react-native"
import ThemedText from "@/components/ThemedText"
import ScoreItem from "@/components/GameHistory/ScoreItem"
import { Colors } from "@/constants/Colors"

type Props = ViewProps

const HistoryItem: FunctionComponent<Props> = ({ style }) => {
  return (
    <View
      style={[
        {
          width: "90%",
          backgroundColor: Colors.main.item,
          flexDirection: "row",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
        },
        style,
      ]}
    >
      <View
        style={{
          width: "45%",
          backgroundColor: Colors.main.item,
          height: 40,
          display: "flex",
          justifyContent: "center",
          paddingLeft: 6,
          borderRadius: 20,
        }}
      >
        <ScoreItem playerName="Inari" playerScore={5} />
      </View>
      <ThemedText
        style={{
          width: "10%",
          textAlign: "center",
          backgroundColor: Colors.main.item,
          opacity: 40,
          lineHeight: 28,
        }}
      >
        vs
      </ThemedText>
      <View
        style={{
          width: "45%",
          backgroundColor: Colors.main.item,
          opacity: 40,
          height: 40,
          display: "flex",
          justifyContent: "center",
          paddingRight: 6,
          borderRadius: 20,
        }}
      >
        <ScoreItem
          style={{ flexDirection: "row-reverse" }}
          playerName="Inari"
          playerScore={5}
        />
      </View>
    </View>
  )
}

export default HistoryItem
