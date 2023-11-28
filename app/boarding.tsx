import { View} from 'react-native';
import {useUserStore} from "../features/places/stores/user_store";
import {useEffect, useState} from "react";
import {router} from "expo-router";
import * as LocationApi from "../features/places/services/google_location";
import DashApi from "../features/places/services/dash";
import {CoordsType, GeocodedAddressType, LocationType, PlaceType} from "../features/places/types/places_types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AnimationView, AnimationType} from "../components/ui/animation/AnimationView";






export default function Page() {
    // @ts-ignore
    const userPlace  = useUserStore(state => state.userPlace)
    // @ts-ignore
    const setUserPlace = useUserStore(state => state.setUserPlace)
    const [hasError, setHasError] = useState(false);


    useEffect(() => {
        try {
            (async () => {
                let _location: LocationType | null = await LocationApi.getLastLocation();
                if(!_location) { _location = await LocationApi.getCurrentLocation(); }
                console.debug("location", _location);
                if(!_location) {
                    console.log("No se pudo obtener ubicación");
                    setHasError(true);
                }
                let _geocodedAddress : GeocodedAddressType | null = await LocationApi.getPlaceByLocation(_location);
                if (!_geocodedAddress) {
                    console.log("No se pudo obtener dirección");
                    setHasError(true);
                }
                let geocodedAddress = _geocodedAddress as GeocodedAddressType;
                console.debug("geocodedAddress.............", _geocodedAddress);

                let _userPlaceId = null;
                try {
                    _userPlaceId = await AsyncStorage.getItem("@alerta_pba:user_place_id");
                    if(_userPlaceId) {
                        console.debug("userPlaceId", _userPlaceId);
                    }
                } catch (e) {
                    console.error("Error al obtener userPlaceId", e);
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
                        if(geocodedAddress.subregion != null) {
                            userPlace.subregion = geocodedAddress.subregion;
                        } else {
                            userPlace.subregion = geocodedAddress.locality;
                        }
                        userPlace.region = geocodedAddress.region;
                        userPlace.country = geocodedAddress.country;
                        userPlace.countryCode = geocodedAddress.countryCode;
                        userPlace.status = "online";

                        userPlace = await DashApi.updatePlace(userPlace);

                        // supaPlace = await SupaApi.savePlace(userPlace, true);
                        // console.debug("create a supaPlace", supaPlace);
                    } catch (e) {
                        console.error("Error al obtener userPlace", e);
                        // @ts-ignore
                        userPlace = null;
                        setHasError(true);
                    }

                }

                // @ts-ignore
                if(!_userPlaceId || !userPlace) {

                    let subregion =  ""
                    if(geocodedAddress.subregion != null) {
                       subregion = geocodedAddress.subregion;
                    } else {
                        subregion = geocodedAddress.locality;
                    }


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
                        subregion: subregion,
                        region: geocodedAddress.region,
                        country: geocodedAddress.country,
                        countryCode: geocodedAddress.countryCode
                    } as PlaceType;

                    console.debug("[001] ................... userPlace : ", userPlace);
                    userPlace = await DashApi.newPlace(userPlace);
                    console.debug("[002] ................... userPlace : ", userPlace);

                    try {
                        if (userPlace.id != null) {
                            await AsyncStorage.setItem("@alerta_pba:user_place_id", userPlace.id);
                        }
                    } catch (e) {
                        console.error("Error al guardar userPlaceId", e);
                        setHasError(true);
                    }
                }
                setUserPlace(userPlace);
                router.replace("/discover");

            }) ();
        } catch (e) {
            console.error("Error al obtener ubicación", e);
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
