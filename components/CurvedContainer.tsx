import { Colors } from "@/constants/Colors";
import { Fragment } from "react";
import { FunctionComponent, PropsWithChildren } from "react";
import { View } from "react-native";
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

type Props = PropsWithChildren;

const CurvedContainer: FunctionComponent<Props> = ({ children }) => {
    const { width, height } = useSafeAreaFrame();
    const insets = useSafeAreaInsets();
    const containerHeight = height * 0.75;
    const svgHeight = containerHeight + insets.top;
    const svgCurveHeight = svgHeight - 100;

    return (
        <Fragment>
            <Svg style={{ position: "absolute" }}>
                <Path
                    d={`M0,0 H${width} V${svgCurveHeight} Q${width / 2},${svgHeight} 0,${svgCurveHeight} Z`}
                    fill={Colors.main.theme}
                />
            </Svg>
            <View style={{ width: "100%", height: containerHeight, alignItems: "center" }} className="w-full h-[75vh] items-center justify-center">
                {children}
            </View>
        </Fragment>
    );
}

export default CurvedContainer;