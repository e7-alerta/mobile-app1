import {TouchableOpacity, Text, Touchable, View, PermissionsAndroid} from "react-native";
import {router} from "expo-router";
import {useEffect, useState} from "react";
import {hasLocationPermission} from "../features/places/services/google_location";

export default function Page() {
    const [hasLocation, setHasLocation] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [retry, setRetry] = useState(false);

    useEffect(() => {

        const timer = setTimeout(() => {
            console.log("setRetry to true");
            setRetry(true);
        }, 7500);

        try {
            (async () => {
                const hasLocationGranted  = await hasLocationPermission();
                console.log("hasLocationGranted", hasLocationGranted);

                function askForLocationPermission() {
                    PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    ).then((result) => {
                        if (result) {
                            console.log("User accept");
                            setHasLocation(true);
                        } else {
                            console.log("User refuse");
                            setHasLocation(false);
                        }
                    });
                }

                if(!hasLocationGranted) {
                    askForLocationPermission();
                }
                setHasLocation(hasLocationGranted);
            })();
        } catch (e) {
            console.error("Error al solicitar permisos de ubicación", e);
        }
    }, []);

    useEffect(() => {
        if (hasLocation) {
            router.push("/boarding");
        }
    }, [hasLocation]);

    return (
        <View className={`
            flex-1
            w-full h-full
            bg-sky-200
            items-center justify-center
        `}>
        </View>
    )
}
