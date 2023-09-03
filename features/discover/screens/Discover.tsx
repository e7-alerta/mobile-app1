import {View, Linking} from 'react-native';
import {useEffect, useState} from 'react';
import GoogleMapViewFull from '../components/discover/map/GoogleMapViewFull';
import GlobalApi from '../../places/services/google_places';
import BusinessList from '../components/discover/business/BusinessList';
import HeaderBar from "../components/discover/header/HeaderBar";

import { StyleSheet } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import ActionButton from "../../../ui/buttons/actionbutton/ActionButton";
import ActionButtonItem from "../../../ui/buttons/actionbutton/ActionButtonItem";
import Toast from "react-native-toast-message";
import { Vibration } from 'react-native';
import PlaceApi from "../../places/services/dash";
import {PlaceType} from "../../places/types/places_types";
import {useUserStore} from "../../places/stores/user_store";


const searchPlace = ['supermercado','tienda', 'verduleria | carniceria','panaderia | almacen'];

export default function DiscoverScreen() {

    // @ts-ignore
    const userPlace: PlaceType = useUserStore(state => state.userPlace)

    const [ storePlaces, setStorePlaces ] = useState([]);
    const [ placeList,setPlaceList ]=useState([]);

    const GetSearchPlace=(value, onSuccess = {})=>{
        GlobalApi.searchByText(
            userPlace.coords.latitude,
            userPlace.coords.longitude,
            value
        ).then(resp=>{
            setPlaceList(resp.data.results);
            onSuccess(resp.data.results);
        })
    }
    const GetNearPlace=(value)=>{
        GlobalApi.nearByPlace(userPlace.coords.latitude,
            userPlace.coords.longitude,value).then(resp=>{
            setPlaceList(resp.data.results);
        })
    }

    useEffect(() => {
        let index = 0;
        let ciclos = 0;
        // @ts-ignore
        let allPlaces = [];
        // @ts-ignore
        let knownAlerts = [];
        if(userPlace.coords && userPlace.coords.latitude && userPlace.coords.longitude) {
            GetSearchPlace('supermercado | verduleria | carniceria | panaderia | almacen', (items) => {
                allPlaces = allPlaces.concat(items);
            });
            index = (index + 1) % searchPlace.length;
            ciclos++;
        }
        const interval = setInterval(() => {
            if(userPlace.coords && userPlace.coords.latitude && userPlace.coords.longitude) {
                if (ciclos >= 5) {
                    let randomPlaces = allPlaces.sort(() => .5 - Math.random()).slice(0, 30);
                    setPlaceList(randomPlaces);
                } else {
                    GetSearchPlace(searchPlace[index], (items) => {
                        allPlaces = allPlaces.concat(items);
                    });
                    index = (index + 1) % searchPlace.length;
                    ciclos++;
                }
            }

            let newAlerted = null;

            PlaceApi.getPlaces().then(resp=>{
                const items = [];
                resp.data.data.map(inPlace=>{
                    if(inPlace.alerted && !knownAlerts.includes(inPlace.id)) {
                        console.log(inPlace.alerted);
                        newAlerted = inPlace;
                        knownAlerts.push(inPlace.id);
                    }

                    items.push(inPlace);
                });
                setStorePlaces(items);
                if (newAlerted) {
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

                const newKnownAlerts = [];
                knownAlerts.map(id=>{
                    const place = items.find(item=>item.id===id);
                    if (place && place.alerted) {
                        newKnownAlerts.push(id);
                    }
                });

                if (newKnownAlerts.length === 0) {
                    if (knownAlerts.length > 0 && newKnownAlerts.length === 0) {
                        Toast.show({
                            type: 'success',
                            text1: 'Ya esta todo bien 👮',
                            position: 'top',
                            text2: `Todo en normalidad. Gracias por tu colaboracion.`,
                            visibilityTime: 12000,
                            autoHide: true
                        });
                    }
                }
                knownAlerts = newKnownAlerts;

            }).catch(err=>{  });

        },  15000);

        return () => clearInterval(interval);
    }, [userPlace]);

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
                <HeaderBar title={userPlace.district} subtitle={userPlace.subregion} />
            </View>

            <View style={{position:'relative',zIndex:50,bottom:"-55%", right:-20 }}
                  className={"bg-yellow-200"} >

                <ActionButton size={80} renderIcon={() =>
                    ( <Ionicons name="notifications" style={styles.mainButtonIcon} />)
                    } buttonColor="#0496ff">
                    <ActionButtonItem
                        buttonColor="#ef233c"
                        title="Entraron en mi local"
                        onPress={() => showToast({
                            alert_type: 'saqueo_en_comercio',
                        })}>
                        <Ionicons name="flame" style={styles.actionButtonIcon} />
                    </ActionButtonItem>
                    <ActionButtonItem
                        buttonColor="#ef233c"
                        title="Saqueo en local vecino"
                        onPress={() => showToast({
                            alert_type: 'saqueo_en_comercio',
                        })}>
                        <Ionicons name="eye" style={styles.actionButtonIcon} />
                    </ActionButtonItem>
                    <ActionButtonItem
                        buttonColor="#ef476f"
                        title="Robo a casa"
                        onPress={() => showToast( {
                            alert_type: 'robo_a_casa',
                        })}>
                        <Ionicons name="home" style={styles.actionButtonIcon} />
                    </ActionButtonItem>
                    <ActionButtonItem
                        buttonColor="#ffc300"
                        title="Actividad sospechosa"
                        onPress={() => showToast({
                            alert_type: 'actividad_sospechosa',
                        })}>
                        <Ionicons name="sad" style={styles.actionButtonIcon} />
                    </ActionButtonItem>
                </ActionButton>
            </View>
            <GoogleMapViewFull
                userPlace={userPlace}
                placeList={placeList}
                storePlaces={storePlaces}
            />

            <View style={{position:'absolute',zIndex:20,bottom:0}}>
                <BusinessList placeList={placeList} />
            </View>

        </View>
    )
}
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
