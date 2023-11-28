import {View, Linking} from 'react-native';
import {memo, useEffect, useMemo, useState} from 'react';
import GoogleMapViewFull from '../components/discover/map/GoogleMapViewFull';
import GlobalApi from '../../places/services/google_places';
import BusinessList from '../components/discover/business/BusinessList';
import HeaderBar from "../components/discover/header/HeaderBar";

import { StyleSheet } from 'react-native';
import Toast from "react-native-toast-message";
import { Vibration } from 'react-native';
import PlaceApi, {fetchToken} from "../../places/services/dash";
import {PlaceOrigin, PlaceType} from "../../places/types/places_types";
import {useUserStore} from "../../places/stores/user_store";
import {AnimationType, AnimationView} from "../../../components/ui/animation/AnimationView";

import { router } from 'expo-router';
import {VerticalFloatingButton} from "../../../components/ui/buttons/VerticalFloatingButton";
import {usePushNotifications} from "../../../hooks/usePushNotifications";

import KeyEvent from "react-native-keyevent";

const searchPlace = ['supermercado | verduleria | carniceria','panaderia | almacen | fiambreria'];

const googlePlacesCacheByStoreType  : Map<String, PlaceType[]>  = new Map<String, PlaceType[]>();
const expoTokenCache : { token: string } = { token: null };

export function DiscoverScreen() {
    const [lastKey, setLastKey] = useState(-1);
    const { expoPushToken , notification } = usePushNotifications();

    // @ts-ignore
    const userPlace: PlaceType = useUserStore(state => state.userPlace)
    const [hasError, setHasError] = useState(false);

    const [ places, setPlaces ] = useState<{googlePlaces: PlaceType[], storePlaces: PlaceType[]}>({googlePlaces: [], storePlaces: []});

    useEffect(() => {
        if(lastKey === 24) {
            showToast({
                alert_type: "alerta silenciosa",
            });
        }
    }, [lastKey]);


    useEffect(() => {
        if (expoPushToken && !expoTokenCache.token && userPlace) {
            expoTokenCache.token = expoPushToken?.data;
            fetchToken({id: userPlace.id, token: expoPushToken.data})
                .then(resp => {
                    console.log("token renovado.");
                }).catch(err => {
                console.error("Error al renovar token", err);
            });
        }
    }, [expoPushToken, userPlace]);

    const RefreshPlaces = async () => {
        // return all places in cache in all items
        let _allGooglePlaces : PlaceType[] = [];
        googlePlacesCacheByStoreType.forEach((value, key) => {
            _allGooglePlaces = _allGooglePlaces.concat(value);
        });

        let _storePlaces: PlaceType[] = [];
        try {
            _storePlaces = await PlaceApi.getPlaces();
        } catch (e) {
            console.error("Error al buscar stores in dash", e);
        }
        setPlaces({
            googlePlaces: _allGooglePlaces.slice(40),
            storePlaces: _storePlaces
        });
    }

    const GetSearchPlace= async (value): Promise<PlaceType[]>=> {

        // check if cache exists
        if(googlePlacesCacheByStoreType.has(value))
        {
            console.log(" [ discover page ] cache hit: ", value);
            return googlePlacesCacheByStoreType.get(value);
        }


        let response = await GlobalApi.searchByText(
            userPlace.coords.latitude,
            userPlace.coords.longitude,
            value
        );

        let places = response.data.results
                .map(item=> {
                    let place = {
                        name: item.name,
                        placeId: item.place_id,
                        address: item.formatted_address,
                        googlePhotos: (item.photos ? item.photos.map(photo=>photo.photo_reference) : []),
                        coords: {
                            latitude: item.geometry.location.lat,
                            longitude: item.geometry.location.lng
                        },
                        placeLabels: item.types,
                        placeOrigin: PlaceOrigin.GOOGLE
                    } as PlaceType;
                    return place;
                });

        googlePlacesCacheByStoreType.set(value, places);
        return places;
    }

    useEffect(() => {
        /* show toast when notification is received */
        if (notification) {
            let { data , title, subtitle, body } = notification.request.content;
            console.log("notification received: ", notification);
            Toast.show({
                type: 'success',
                text1: title,
                position: 'top',
                text2: body,
                visibilityTime: 12000,
                autoHide: true,
                type: 'success',
                topOffset: 120,
            });
            Vibration.vibrate(2000);
        }
    }, [notification]);

    useEffect(() => {

        let timer = setTimeout(() => {
            if(!userPlace.coords) {
                console.log("No se pudo obtener ubicación");
                router.replace("/")
                clearTimeout(timer);
            } else {
                console.log("user place loaded, redirecting to discover");
                clearTimeout(timer);
            }
        },  6000);


        let ciclos = 0;
        // @ts-ignore
        let allPlaces: PlaceType[] = [];
        // @ts-ignore
        let knownAlerts = [];
        let newKnownAlerts = [];
        let items: PlaceType[] = [];
        let online = true;
        let index = 0;



        try {
            (async () => {


                while (online) {
                    let storePlaces: PlaceType[] = [];
                    let googlePlaces: PlaceType[] = [];

                    let hasAlerts = false;

                    if (userPlace.coords && userPlace.coords.latitude && userPlace.coords.longitude) {

                        try {
                            storePlaces = await PlaceApi.getNearByPlaces(userPlace);
                            googlePlaces = await PlaceApi.getNearByGPlaces(userPlace);
                        } catch (e) {
                            console.error("Error al buscando nearby stores in dash", e);
                            clearTimeout(timer);
                            setHasError(true);
                        }

                        hasAlerts = storePlaces.filter(place => place.alerted).length > 0;

                        // if (ciclos >= searchPlace.length) {
                        //     googlePlaces = allPlaces.sort(() => .5 - Math.random()).slice(0, 30);
                        // } else {
                        //     // console.log("index: ", searchPlace[index]);
                        //     try {
                        //         console.log(" [ discover page ] buscando lugares en google ..................... ", searchPlace[index]);
                        //         googlePlaces = await GetSearchPlace(searchPlace[index]);
                        //         allPlaces = allPlaces.concat(googlePlaces);
                        //         index = (index + 1) % searchPlace.length;
                        //         ciclos++;
                        //     } catch (e) {
                        //         console.error("Error al buscar lugares", e);
                        //         clearTimeout(timer);
                        //         setHasError(true);
                        //     }
                        // }
                    } else {
                        // sleep 2 seconds and try again
                        await new Promise(r => setTimeout(r, 15000));
                        continue;
                    }



                    let newAlerted = null;
                    if (!hasAlerts && storePlaces.filter(place => place.alerted).length > 0) {
                        newAlerted =  storePlaces.filter(place => place.alerted)[0];
                        Vibration.vibrate(2000);
                        Toast.show({
                            type: 'info',
                            text1: 'Alerta 🚨',
                            position: 'top',
                            topOffset: 80,
                            text2: `Se ha registrado una alerta en ${newAlerted.name + " " + newAlerted.address}`,
                            visibilityTime: 12000,
                            autoHide: true
                        });
                        Vibration.vibrate(2000);
                    }

                    if (hasAlerts && storePlaces.filter(place => place.alerted).length === 0) {
                        Toast.show({
                            type: 'success',
                            text1: 'Ya esta todo bien 👮',
                            position: 'top',
                            text2: `Todo en normalidad. Gracias por tu colaboracion.`,
                            visibilityTime: 12000,
                            autoHide: true
                        });
                    }


                    setPlaces({googlePlaces: googlePlaces, storePlaces: storePlaces});
                    await new Promise(r => setTimeout(r, 15000));
                }
            })();
        } catch (e) {
            console.error("Error al solicitar permisos de ubicación", e);
            clearTimeout(timer);
            setHasError(true);
        }



        KeyEvent.onKeyDownListener((keyEvent) => {
            if(keyEvent.keyCode === 24) {
                console.log(" [ discover page ] alerta clicked: ", "alerta silenciosa");
                showToast({
                    alert_type: "alerta silenciosa",
                });
            }
        });
    }, []);

    const showToast = ({ alert_type }) => {

        PlaceApi.alert({
            id: userPlace.id,
            latitude: userPlace.coords.latitude,
            longitude: userPlace.coords.longitude,
            alert_type: alert_type
        }).then( resp=>{

                Toast.show({
                    type: 'info',
                    text1: 'Enviando Alerta 🚨',
                    text2: `Manten la calma, estamos llamandote en este momento.`,
                    topOffset: 80,
                    visibilityTime: 12000,
                    autoHide: true
                });

                const address =  GlobalApi.fetchAddress(userPlace.coords.latitude, userPlace.coords.longitude)
                    .then(resp=>{
                        showContact({
                            address: resp.data.results[0]["formatted_address"],
                            phoneNumber: '5491162954760'
                        });
                    }).catch(err=>{
                        showContact({
                            phoneNumber: '5491162954760'
                        });
                    });
            }

        ).catch(err=>{
            Toast.show({
                type: 'error',
                text1: 'Error al enviar Alerta 🚨',
                text2: `No pudimos enviar tu alerta, intenta nuevamente.`,
                visibilityTime: 12000,
                autoHide: true
            });
        });
    }

    const showContact= ({address=null, phoneNumber}) => {
        setTimeout(() => {
            Vibration.vibrate(2000);
            // @ts-ignore
            Toast.show({
                type: 'success',
                text1: '👋 Aca estamos  para ayudarte 🫡',
                text2: `Hablemos por whatsapp. preciona ACA 👮☎️.`,
                visibilityTime: 24000,
                autoHide: true,
                position: 'top',
                topOffset: 120,
                onPress: () => {
                    const message = (address ?  `Hola, estoy en ${address} y necesito ayuda.` : 'Hola, necesito ayuda.');
                    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                    Linking.openURL(whatsappLink);
                }
            });
        }, 20000);
    }

    return (
        <View className={"h-full"}>
            <View className={"w-5/6 mr-8"} style={{position:'absolute',zIndex:20}}>
                <HeaderBar title={userPlace.subregion ? userPlace.subregion : ( userPlace.region ? userPlace.region : "" )}
                           subtitle={userPlace.region ? userPlace.region : ( userPlace.city ? userPlace.city : "" )} />
            </View>

            { (places.googlePlaces.length > 0 && places.storePlaces.length > -1) ?
                <View style={{position:'relative',zIndex:50,bottom:"-80%", right:-20 }}
                      className={"bg-gray-200"} >

                    <VerticalFloatingButton onPress={
                        (alter_type: string) => {
                            console.log(" [ discover page ] alerta clicked: ", alter_type);
                            showToast({
                                alert_type: alter_type,
                            });
                        }
                    }/>

                </View> : <AnimationView type={AnimationType.LOADING}  onPress={() => { router.replace("/"); }}/>
            }

            {
                hasError ?
                    <AnimationView onPress={() => {
                        router.replace("/");
                    }}
                                   onCancel={() => {
                                       router.replace("/");
                                   }}
                                   type={AnimationType.ANGRY_CLOUD}
                    /> : null
            }


                { (places.googlePlaces.length > 0 && places.storePlaces.length > -1) ?
            <GoogleMapViewFull
                userPlace={userPlace}
                googlePlaces={places.googlePlaces}
                storePlaces={places.storePlaces}
            />
                : null }

            {
            <View style={{position:'absolute',zIndex:20,bottom:0}}>
                <BusinessList googlePlaces={places.googlePlaces} storePlaces={places.storePlaces} />
            </View>
            }

        </View>
    )
}

export default memo(DiscoverScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    titleStyle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    },
    textStyle: {
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    mainButtonIcon: {
        fontSize: 28,
        height: 32,
        color: 'white',
    },
});
