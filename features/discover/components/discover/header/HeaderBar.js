import {View, Text, TouchableOpacity} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../../shared/colors";
import { Image } from "react-native";

import logo from "./../../../../../assets/images/logo.png";

export default function HeaderBar({
  title = null, subtitle = null, onPress
}) {
    return (
        <View>
            <LinearGradient
                className={"rounded-br-3xl"}
                // Background Linear Gradient
                colors={[Colors.white, "transparent"]}
                style={{ padding: 20 }}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "",
                    }}
                >
                    <TouchableOpacity onPress={onPress}>
                        <Image
                            source={logo}
                            style={{ width: 50, height: 50, borderRadius: 100, marginRight: 10 }}
                        />
                    </TouchableOpacity>
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        {(subtitle) && (
                            <Text className={"right-0 top-[-10] text-lg text-gray-500 tracking-tighter py-0 my-0 absolute font-semibold"}
                            >
                                {subtitle}
                            </Text>
                        )}
                        <Text style={{ fontSize: 35, fontWeight: "bold" }}
                              className={"text-gray-700 tracking-tighter "}
                        >
                            {(title? title : "Mi Barrio")}
                        </Text>
                    </View>

                </View>
            </LinearGradient>
        </View>
    );
}
