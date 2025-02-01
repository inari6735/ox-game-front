import { FunctionComponent } from "react"
import { ScrollView } from "react-native-gesture-handler"
import HistoryItem from "@/components/GameHistory/HistoryItem"
import { View, ViewProps } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

type Props = ViewProps

const GameHistory: FunctionComponent<Props> = ({ style }) => {
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
      <ScrollView
        contentContainerStyle={{
          width: "100%",
          paddingBottom: 30,
        }}
      >
        <HistoryItem style={{ marginBottom: 5 }} />
        <HistoryItem style={{ marginBottom: 5 }} />
        <HistoryItem style={{ marginBottom: 5 }} />
        <HistoryItem style={{ marginBottom: 5 }} />
        <HistoryItem style={{ marginBottom: 5 }} />
        <HistoryItem style={{ marginBottom: 5 }} />
        <HistoryItem style={{ marginBottom: 5 }} />
        <HistoryItem style={{ marginBottom: 5 }} />
        <HistoryItem style={{ marginBottom: 5 }} />
        <HistoryItem style={{ marginBottom: 5 }} />
        <HistoryItem style={{ marginBottom: 5 }} />
        <HistoryItem style={{ marginBottom: 5 }} />
      </ScrollView>
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
