import React, { useRef, useEffect } from 'react';
import {Text, Button, StyleSheet, TouchableOpacity, View} from 'react-native';
import LottieView from 'lottie-react-native';

import _loading1 from "../../../assets/lottie/loading1.json";
import _lottie1 from '../../../assets/lottie/lottie1.json';
import _confused_mobile from '../../../assets/lottie/confused_mobile.json';
// import _angryCloud from '../../../assets/lottie/angry_cloud.json';
import Ionicons from "@expo/vector-icons/Ionicons";
export const boardLottie = _lottie1;
// export const angryCloud =  _angryCloud;
export const confusedMobile = _confused_mobile;

export enum AnimationType {
    BASE = "BASE",
    BOARD = "BOARD",
    ANGRY_CLOUD = "ANGRY_CLOUD",
    CONFUSED_MOBILE = "CONFUSED_MOBILE",
    LOADING = "LOADING"
}

export function AnimationView({ source = null,
                                  onPress = () => {},
                                  onCancel = () => {},
                                  type = AnimationType.BASE }: {
    source?: any, onPress: () => void,
    onCancel?: () => void,
    type: AnimationType,
}) {
    const animation = useRef(null);

    useEffect(() => {
        // animation.current?.play();
    }, []);

    // switch enum animation type to lottie source
    switch (type) {
        case AnimationType.LOADING:
            source = _loading1;
        case AnimationType.BASE:
            source = boardLottie;
            break;
        case AnimationType.BOARD:
            source = boardLottie;
            break;
        case AnimationType.ANGRY_CLOUD:
            source = confusedMobile;
            break;
        case AnimationType.CONFUSED_MOBILE:
            source = confusedMobile;
    }

    return (
        <View style={styles.animationContainer}>

            { type === AnimationType.ANGRY_CLOUD && (
                <View className={`
                    bg-red-50
                    px-4 py-2 rounded
                    mb-12
                    border-b-4 border-r-4 border-red-500
                    flex flex-row
                    items-center justify-center
                    gap-1
                `}>
                    <Ionicons name={"alert-circle"} size={24} color={"#F44336"} />

                    <Text className={`
                        text-red-700 font-bold    
                        uppercase
                        text-sm
                    `}>Hubo un error</Text>
                </View>
            )}

            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: 200,
                    height: 200,
                    backgroundColor: '#bae6fd',
                }}
                source={source}
            />

            { type === AnimationType.LOADING && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        className={`
                        bg-white
                        px-4 py-2 rounded
                        border-b-4 border-r-4 border-sky-500
                        `}
                        onPress={onPress}
                    >
                        <Text className={`
                            text-sky-700 font-bold    
                            uppercase
                            text-sm
                        `}>Refrescar</Text>
                    </TouchableOpacity>
                </View>
            )}

            { type === AnimationType.BOARD && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        className={`
                        bg-white
                        px-4 py-2 rounded
                        border-b-4 border-r-4 border-sky-500
                        `}
                        onPress={onPress}
                        >
                        <Text className={`
                            text-sky-700 font-bold    
                            uppercase
                            text-sm
                        `}>Cargando Mapa..</Text>
                    </TouchableOpacity>
                </View>
            )}


            { type === AnimationType.ANGRY_CLOUD && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        className={`
                        bg-green-50
                        px-4 py-2 rounded
                        mb-4
                        border-b-4 border-r-4 border-sky-500
                        flex flex-row
                        items-center justify-center
                        gap-1
                        `}
                        onPress={onCancel}
                    >
                        <Text className={`
                            text-sky-700 font-bold    
                            uppercase
                            text-sm
                        `}>Reintentar</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        className={`
                        bg-green-500
                        px-4 py-2 rounded
                        border-b-4 border-r-4 border-sky-500
                        flex flex-row
                        items-center justify-center
                        gap-1
                        `}
                        onPress={onPress}
                    >
                        <Ionicons name={"logo-whatsapp"}
                                  size={24} color={"white"} />
                        <Text className={`
                            text-white font-bold    
                            uppercase
                            text-sm
                        `}>Hablemos</Text>
                    </TouchableOpacity>

                </View>
                )
            }

        </View>
    );
}

const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#bae6fd',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    buttonContainer: {
        paddingTop: 20,
    },
});
