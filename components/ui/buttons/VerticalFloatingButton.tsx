import React, { useState} from "react";
import { Text, View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import {Ionicons} from "@expo/vector-icons";

function ActionTitle(props: { text: string }) {
    return null;
}

export const VerticalFloatingButton = (
    { onPress } : { onPress: (alter_type: string) => void }
) => {

    const [icon_1] = useState(new Animated.Value(40));
    const [icon_2] = useState(new Animated.Value(40));
    const [icon_3] = useState(new Animated.Value(40));

    const [pop, setPop] = useState(false);

    const popIn = () => {
        setPop(true);
        Animated.timing(icon_1, {
            toValue: 130,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2, {
            toValue: 210,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3, {
            toValue: 290,
            duration: 500,
            useNativeDriver: false,
        }).start();

    }

    const popOut = () => {
        setPop(false);
        Animated.timing(icon_1, {
            toValue: 80,
            duration: 500,
            useNativeDriver: false,
        }).start();

        Animated.timing(icon_2, {
            toValue: 80,
            duration: 500,
            useNativeDriver: false,
        }).start();

        Animated.timing(icon_3, {
            toValue: 80,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }

    return(
        <View
            className={`
                z-30
                absolute right-0
                bg-yellow-200 
                `}
            style={{}}>


            <Animated.View className="bg-[#ffc300] border-4 border-yellow-500 " style={[styles.circle, { bottom: icon_1}]} >
                <Text className={` 
                          rounded-xl bg-white border-t-1 border-r-1
                          border-b-4 border-l-4 border-green-900
                          shadow-xl
                    align-middle text-right
                    text-2xl text-green-900
                    px-4 w-48 h-20 py-3
                    absolute right-20
                    `} style={
                    (pop === false) ? {display: 'none'} : {display: 'flex'}
                }>Accidente</Text>
                <TouchableOpacity
                    onPress={() => { onPress("accident"); }}
                >
                    <Ionicons name="sad" size={25} color="#FFFF" />
                </TouchableOpacity>
            </Animated.View>
            <Animated.View className="bg-[#ffc300] border-4 border-yellow-500 " style={[styles.circle, { bottom: icon_2}]} >
                <Text
                    numberOfLines={2}
                    className={` 
                    rounded-xl bg-white border-t-1 border-r-1
                          border-b-4 border-l-4 border-green-700
                          shadow-xl
                    align-text-bottom text-right
                    text-2xl text-green-900
                    px-4 w-48 h-22 py-3
                    absolute right-20
                    `} style={
                    (pop === false) ? {display: 'none'} : {display: 'flex'}
                }>Actividad sospechosa</Text>
                <TouchableOpacity onPress={() => { onPress("actividad_sospechosa"); }} >
                    <Ionicons name="eye" size={25} color="#FFFF" />
                </TouchableOpacity>
            </Animated.View>
            <Animated.View className="bg-red-500 border-4 border-red-700 " style={[styles.circle, { bottom: icon_3}]} >
                <Text
                    numberOfLines={2}
                    className={` 
                    rounded-xl bg-white border-t-1 border-r-1
                          border-b-4 border-l-4 border-green-700
                          shadow-xl
                    align-text-bottom text-right
                    text-2xl text-green-900
                    font-semibold
                    px-4 w-48 h-24 py-3
                    absolute right-20
                    `} style={
                    (pop === false) ? {display: 'none'} : {display: 'flex'}
                }>Saqueo en Tienda</Text>
                <TouchableOpacity onPress={() => { onPress("saqueo_en_comercio"); }} >
                    <Ionicons name="flame" size={25} color="#FFFF" />
                </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
                className={"bg-blue-500 border-4 border-blue-700"}
                style={styles.circle}
                onPress={() => {
                    pop === false ? popIn() : popOut();
                }}
            >
                <Ionicons name="notifications" size={25} color="#FFFF" />
            </TouchableOpacity>
        </View>
)

}

export default React.memo(VerticalFloatingButton);

const styles = StyleSheet.create({
    circle: {
        width: 80,
        height: 80,
        position: 'absolute',
        bottom: 40,
        right: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
