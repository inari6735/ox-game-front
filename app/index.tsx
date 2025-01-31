import { Image, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from '@/constants/Colors';
import CurvedContainer from "@/components/CurvedContainer";

export default function Index() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SafeAreaView style={{ backgroundColor: Colors.main.background }} className="h-full">
            <CurvedContainer>
              
            </CurvedContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
    
  );
}
