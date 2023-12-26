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

                let _geocodedAddress: GeocodedAddressType | undefined | null = null;
                let _location: LocationType | null = null;
                let _phoneId = null;
                let userPlace : PlaceType;

                /** check userPlaceId **/
                try {
                    _phoneId = await AsyncStorage.getItem("@alerta_pba:user_place_id");
                } catch (e) {
                    console.error("Error al obtener userPlaceId", e);
                    setHasError(true);
                    router.replace("/crash")
                }

                /** if userPlaceId is not null, get userPlace **/
                if(_phoneId != null) {
                    console.log("# [001] ################################### phoneId", _phoneId)
                    try {
                        userPlace = await DashApi.getPlaceById(_phoneId);
                        userPlace.phone_id = _phoneId;
                        userPlace.isNew = false;
                        console.log("# [002] ################################### userPlace ", [
                            userPlace.region,
                            userPlace.subregion,
                            userPlace.city,
                            userPlace.district,
                            userPlace.street,
                            userPlace.streetNumber
                            ]);
                    } catch (e) {
                        console.error("Error al obtener userPlace", e);
                        // @ts-ignore
                        userPlace = null;
                        setHasError(true);
                    }
                    /** if userPlace is not null, set userPlace and redirect to discover */
                    setUserPlace(userPlace);
                    console.info("####################### /about with existing userPlace");
                    router.replace("/discover");
                    // router.replace("/about");
                    return
                }


                /** if userPlaceId is null, get location and geocodedAddress **/
                _location  = await LocationApi.getLastLocation();
                if (!_location) {
                    _location = await LocationApi.getCurrentLocation();
                }
                console.debug("location", _location);
                if (!_location) {
                    console.log("No se pudo obtener ubicación");
                    setHasError(true);
                }
                _geocodedAddress = await LocationApi.getPlaceByLocation(_location);
                if (!_geocodedAddress) {
                    console.log("No se pudo obtener dirección");
                    setHasError(true);
                }
                console.debug("geocodedAddress.............", _geocodedAddress);


                let geocodedAddress = _geocodedAddress as GeocodedAddressType;

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

                userPlace = await DashApi.newPlace(userPlace);
                userPlace.phone_id = userPlace.id;

                try {
                    if (userPlace.phone_id != null) {
                        await AsyncStorage.setItem("@alerta_pba:user_place_id", userPlace.phone_id);
                    }
                } catch (e) {
                    console.error("Error al guardar userPlaceId", e);
                    setHasError(true);
                    router.replace("/crash")
                }

                setUserPlace(userPlace);
                console.info("####################### /about with new userPlace");
                router.replace("/discover");
                // router.replace("/about");

            }) ();
        } catch (e) {
            console.error("Error al obtener ubicación", e);
            setHasError(true);
            router.replace("/crash")
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
