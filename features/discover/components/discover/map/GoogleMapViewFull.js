import { View, Text } from 'react-native'
import { useContext, useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Circle } from 'react-native-maps';
import { Dimensions } from 'react-native';
import PlaceMarker from './PlaceMarker';

export default function GoogleMapViewFull(
    { userPlace,
      placeList,
      storePlaces
    }) {
    const [mapRegion, setMapRegion] = useState([]);

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
    },[userPlace])

    let alarmedPlaces = storePlaces.filter((place) => place.alerted === true);
    const numOfPlaces = placeList.length + Math.random()*1000;

    return (
        <View className={"flex flex-1"}>
            {userPlace.coords?    <MapView
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
                <Circle
                    center={mapRegion}
                    radius={1500}
                    strokeWidth={1}
                    strokeColor={'black'}
                    fillColor={
                        alarmedPlaces.length > 0 ? 'rgba(255, 0, 0,0.25)' : 'rgba(4, 255, 109,0.25)'
                    }
                />
                <Marker
                    title="You"
                    coordinate={mapRegion}
                    pinColor={'#0496ff'}
                />
                {placeList.map((item,index)=>(
                    <PlaceMarker item={item} key={index} color={"green"} />
                ))}

                {   storePlaces.map((item,index)=> {

                    return  (
                        <PlaceMarker item={{
                            name: (item.name ? item.name : item.address),
                            geometry: {
                                location: {
                                    lat: item.geopoint.coordinates[1],
                                    lng: item.geopoint.coordinates[0]
                                }
                            }
                        }}
                                     key={numOfPlaces+index}
                                     color={(item.alerted ? "red" : "green")}
                        />
                    )
                })}

            </MapView>:null}
        </View>
    )
}
