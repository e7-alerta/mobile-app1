import {Dimensions, View} from 'react-native'
import {useEffect, useState} from 'react'
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import PlaceMarker, {MarkerColor} from './PlaceMarker';
import {PlaceType} from "../../../../places/types/places_types";

export default function GoogleMapViewFull(
    { userPlace,
      googlePlaces,
      storePlaces
    }: {
        userPlace: PlaceType,
        googlePlaces: PlaceType[],
        storePlaces: PlaceType[]
    }) {

    const [mapRegion, setMapRegion] = useState({});

    useEffect(()=>{
        if(userPlace.coords)
        {
            setMapRegion({
                latitude: userPlace.coords.latitude,
                longitude: userPlace.coords.longitude,
                latitudeDelta: 0.0422/2.5,
                longitudeDelta: 0.0421/2.5,
            })
        }
    },[]);

    let alarmedPlaces = storePlaces
        .filter((place) => {
            return (place.alerted && place.alerted === true);
        });
    // console.log("alarmed places", alarmedPlaces.length);

    // const numOfPlaces = placeList.length + Math.random()*1000;

    return (
        <View className={"flex flex-1"}>
            { userPlace.coords?
                <MapView
                style={{
                    width: Dimensions.get("screen").width,
                    height: Dimensions.get("screen").height * 0.89,
                }}
                className={"flex flex-1"}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                region={mapRegion}
                userLocationCalloutEnabled={true}
            >

                    {
                        storePlaces.map((item,index)=> {
                            const styles  = {zIndex:90}

                            if( item.alerted ) {
                                return (
                                    <Marker
                                        key={index}
                                        pinColor={"red"}
                                        styles={styles}
                                        title={item.name ? `${item.address.split(",")[0]}, ${item.name}` : `${item.address}`}
                                        coordinate={
                                            {
                                                latitude: item.coords.latitude,
                                                longitude: item.coords.longitude,
                                                latitudeDelta: 0.0522,
                                                longitudeDelta: 0.0421,
                                            }
                                        }/>
                                );
                            } else {
                                console.log("[ GoogleMapViewFull ] item OK: ", item);
                                return (
                                    <Marker
                                        key={`${(item.id ? item.id : item.placeId)}-${item.coords.latitude}-${item.coords.longitude}`}
                                        pinColor={"green"}
                                        styles={styles}
                                        title={item.name ? `${item.address.split(",")[0]}, ${item.name}` : `${item.address}`}
                                        coordinate={
                                            {
                                                latitude: item.coords.latitude,
                                                longitude: item.coords.longitude,
                                                latitudeDelta: 0.0522,
                                                longitudeDelta: 0.0421,
                                            }
                                        }/>
                                );
                            }
                        })
                    }

                {
                    googlePlaces.map((item,index)=> {

                        let key = index+storePlaces.length+1;
                        return (
                            <PlaceMarker
                                key={item.placeId}

                                styles={{zIndex: 60}} item={item} key={index} color={MarkerColor.YELLOW} />
                        );
                    })
                }

                <Marker
                    title="Tu estás aquí"
                    key={storePlaces.length+googlePlaces.length+1}
                    style={{zIndex:95}}
                    coordinate={mapRegion}
                    pinColor={"#0496ff"}
                />

                    <Circle
                        key={storePlaces.length+googlePlaces.length+2}
                        center={mapRegion}
                        radius={1500}
                        strokeWidth={1}
                        strokeColor={'black'}
                        fillColor={
                            alarmedPlaces.length > 0 ? 'rgba(255, 0, 0,0.25)' : 'rgba(4, 255, 109,0.25)'
                        }
                    />




                </MapView>:null}
        </View>
    )
}
