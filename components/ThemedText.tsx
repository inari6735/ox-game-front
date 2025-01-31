import { Colors } from "@/constants/Colors";
import { FunctionComponent } from "react";
import { Text, TextProps } from "react-native";

type Props = TextProps;

const ThemedText: FunctionComponent<Props> = ({ style, ...rest }) => {
    return (
        <Text
            style={[
                {
                    fontFamily: "Carter-One",
                    color: Colors.main.text
                },
                style
            ]}
        {...rest}
        />
    );
}

export default ThemedText;