import { FunctionComponent, useMemo } from "react"
import { ScrollView } from "react-native-gesture-handler"
import HistoryItem from "@/components/GameHistory/HistoryItem"
import { View, ViewProps } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import ThemedText from "../ThemedText"

export type GameHistoryItem = {
  id: string
  player1: {
    name: string
    score: number
  }
  player2: {
    name: string
    score: number
  }
}

type Props = ViewProps & {
  historyItems?: GameHistoryItem[]
}

const GameHistory: FunctionComponent<Props> = ({ style, historyItems }) => {
  // Mock data - in a real app, this would come from props or API
  const mockHistoryItems = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: `game-${i}`,
      player1: {
        name: "Inari",
        score: 5
      },
      player2: {
        name: "Henryk",
        score: 3
      }
    }));
  }, []);

  const items = historyItems || mockHistoryItems;

  return (
    <View
      style={[
        {
          width: "100%",
          display: "flex",
          alignItems: "center",
          flex: 1,
          marginBottom: 50,
        },
        style,
      ]}
    >
      {items.length === 0 ? (
        <ThemedText>No game history available</ThemedText>
      ) : (
        <ScrollView
          contentContainerStyle={{
            width: "100%",
            paddingBottom: 30,
          }}
        >
          {items.map((item) => (
            <HistoryItem 
              key={item.id}
              style={{ marginBottom: 5 }} 
              player1={item.player1}
              player2={item.player2}
            />
          ))}
        </ScrollView>
      )}
      <LinearGradient
        colors={["transparent", "rgba(255, 184, 0, 0)", "rgba(255, 184, 0, 1)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 50,
        }}
      />
    </View>
  )
}

export default GameHistory
