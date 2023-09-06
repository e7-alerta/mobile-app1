import {Text, TouchableOpacity, View} from 'react-native';
import {useUserStore} from "../features/places/stores/user_store";
import {useEffect, useState} from "react";
import {router} from "expo-router";
import * as LocationApi from "../features/places/services/google_location";
import DashApi from "../features/places/services/dash";
import SupaApi from "../features/places/services/supa";
import {CoordsType, GeocodedAddressType, LocationType, PlaceType} from "../features/places/types/places_types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AnimationView, AnimationType} from "../components/ui/animation/AnimationView";
import {set} from "yaml/dist/schema/yaml-1.1/set";






export default function Page() {
    // @ts-ignore
    const userPlace  = useUserStore(state => state.userPlace)
    // @ts-ignore
    const setUserPlace = useUserStore(state => state.setUserPlace)
    const [hasError, setHasError] = useState(false);


    useEffect(() => {
        console.log("has user place ? :", (userPlace.coords? "si" : "no"));

        let timer = setTimeout(() => {
            if(!userPlace.coords) {
                console.log("No se pudo obtener ubicación");
                router.replace("/")
                clearTimeout(timer);
            } else {
                console.log("user place loaded, redirecting to discover");
                router.replace("/discover")
                clearTimeout(timer);
            }
        },  2000);

        try {
            (async () => {
                let _location: LocationType = await LocationApi.getCurrentLocation();
                console.debug("location", _location);
                if(!_location) {
                    console.log("No se pudo obtener ubicación");
                    setHasError(true);
                }
                let _geocodedAddress : GeocodedAddressType | null = await LocationApi.getPlaceByLocation(_location);
                if (!_geocodedAddress) {
                    console.log("No se pudo obtener dirección");
                    clearTimeout(timer);
                    setHasError(true);
                }
                let geocodedAddress = _geocodedAddress as GeocodedAddressType;
                console.debug("geocodedAddress", _geocodedAddress);

                let _userPlaceId = null;
                try {
                    _userPlaceId = await AsyncStorage.getItem("@alerta_pba:user_place_id");
                    if(_userPlaceId) {
                        console.debug("userPlaceId", _userPlaceId);
                    }
                } catch (e) {
                    console.error("Error al obtener userPlaceId", e);
                    clearTimeout(timer);
                    setHasError(true);
                }


                let userPlace : PlaceType;
                let supaPlace : PlaceType;

                if(_userPlaceId) {
                    try {
                        userPlace = await DashApi.getPlaceById(_userPlaceId);
                        // console.debug("_userPlace", userPlace);

                        userPlace.coords = {
                            latitude: _location.coords.latitude,
                            longitude: _location.coords.longitude
                        } as CoordsType;

                        userPlace.street = geocodedAddress.street;
                        userPlace.streetNumber = geocodedAddress.streetNumber;
                        userPlace.postalCode = geocodedAddress.postalCode;
                        userPlace.district = geocodedAddress.district;
                        userPlace.city = geocodedAddress.city;
                        userPlace.subregion = geocodedAddress.subregion;
                        userPlace.region = geocodedAddress.region;
                        userPlace.country = geocodedAddress.country;
                        userPlace.countryCode = geocodedAddress.countryCode;
                        userPlace.status = "online";

                        userPlace = await DashApi.updatePlace(userPlace);

                        supaPlace = await SupaApi.savePlace(userPlace, true);
                        // console.debug("create a supaPlace", supaPlace);
                    } catch (e) {
                        console.error("Error al obtener userPlace", e);
                        // @ts-ignore
                        userPlace = null;
                        clearTimeout(timer);
                        setHasError(true);
                    }

                }

                // @ts-ignore
                if(!_userPlaceId || !userPlace) {

                    userPlace = {
                        status: "online",
                        name: geocodedAddress.name,
                        address: `${geocodedAddress.street} ${geocodedAddress.streetNumber}, ${geocodedAddress.district}`,
                        coords: {
                            latitude: _location.coords.latitude,
                            longitude: _location.coords.longitude
                        } as CoordsType,
                        street: geocodedAddress.street,
                        streetNumber: geocodedAddress.streetNumber,
                        postalCode: geocodedAddress.postalCode,
                        district: geocodedAddress.district,
                        city: geocodedAddress.city,
                        subregion: geocodedAddress.subregion,
                        region: geocodedAddress.region,
                        country: geocodedAddress.country,
                        countryCode: geocodedAddress.countryCode
                    } as PlaceType;

                    // console.debug("userPlace", userPlace);
                    userPlace = await DashApi.newPlace(userPlace);
                    // console.debug("storedPlace", userPlace);
                    supaPlace = await SupaApi.savePlace(userPlace, false);
                    // console.debug("update a supaPlace", supaPlace);

                    try {
                        if (userPlace.id != null) {
                            await AsyncStorage.setItem("@alerta_pba:user_place_id", userPlace.id);
                        }
                    } catch (e) {
                        console.error("Error al guardar userPlaceId", e);
                        clearTimeout(timer);
                        setHasError(true);
                    }
                }
                setUserPlace(userPlace);
                console.log(`userPlace : ${userPlace.id} | ${userPlace.address}`);
                clearTimeout(timer);
                router.replace("/discover");

//                let supaPlaces = await SupaApi.getPlaces();
//                console.log("supaPlaces", supaPlaces);
//                let nearestPlaces = await SupaApi.getNearestPlacesByLocation(_location)
//                console.debug("nearestPlaces", nearestPlaces);
//
                // let alert = await SupaApi.saveAlert({
                //     title: "Alerta de prueba",
                //     done: false
                // })

            }) ();
        } catch (e) {
            console.error("Error al obtener ubicación", e);
            clearTimeout(timer);
            setHasError(true);
            // router.replace("/")
        }
    }, []);





    return (
        <View className={`
            flex-1
            w-full h-full
            bg-sky-200
            `}>

            {( !hasError ?
                    <AnimationView onPress={() => {
                        router.replace("/");
                    }}
                    type={AnimationType.BOARD}
                    />
                    :
                    <AnimationView onPress={() => {
                        router.replace("/modal");
                    }}
                    onCancel={() => {
                        router.replace("/");
                    }}
                    type={AnimationType.ANGRY_CLOUD}
                    />
            )}

        </View>
    );
}
