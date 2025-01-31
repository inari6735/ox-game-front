import { Colors } from "@/constants/Colors";
import { Fragment, FunctionComponent } from "react";
import { Image, View } from "react-native";
import ThemedText from "@/components/ThemedText";

const UserProfile: FunctionComponent = () => {
    return (
        <Fragment>
            <View style={{ marginTop: 32, width: 90, height: 90, alignItems: "center", justifyContent: "center", borderWidth: 5, borderColor: "#FFD4D4", borderRadius: 20 }}>
                <Image style={{ width: 80, height: 80, backgroundColor: Colors.main.background, borderRadius: 15 }} source={require("@/assets/images/profile.png")}/>
            </View>
            <ThemedText style={{ fontSize: 17 }}>Inari</ThemedText>
        </Fragment>
    );
}

export default UserProfile;