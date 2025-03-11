import { FunctionComponent } from "react"
import { View, ViewProps } from "react-native"
import ThemedText from "@/components/ThemedText"
import ScoreItem from "@/components/GameHistory/ScoreItem"
import { Colors } from "@/constants/Colors"

type Props = ViewProps & {
  player1: {
    name: string
    score: number
  }
  player2: {
    name: string
    score: number
  }
}

const HistoryItem: FunctionComponent<Props> = ({ style, player1, player2 }) => {
  const isWinner = player1.score > player2.score;
  const isDraw = player1.score === player2.score;
  
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
        <ScoreItem 
          playerName={player1.name} 
          playerScore={player1.score} 
        />
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
          opacity: isDraw ? 40 : (isWinner ? 40 : 100),
          height: 40,
          display: "flex",
          justifyContent: "center",
          paddingRight: 6,
          borderRadius: 20,
        }}
      >
        <ScoreItem
          style={{ flexDirection: "row-reverse" }}
          playerName={player2.name}
          playerScore={player2.score}
        />
      </View>
    </View>
  )
}

export default HistoryItem
