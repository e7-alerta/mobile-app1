import { View, Text, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import PlaceMarker from "./PlaceMarker";
import {useUserStore} from "../../../stores/user_store";

export default function GoogleMapView({placeList}) {
  const [mapRegion, setmapRegion] = useState([]);
  // @ts-ignore
  const userPlace = useUserStore(state=> state.userPlace);


  useEffect(()=>{
    if(userPlace.coords)
    {
        setmapRegion({
            latitude: userPlace.coords.latitude,
            longitude: userPlace.coords.longitude,
            latitudeDelta: 0.0180,
            longitudeDelta: 0.0180,
        })
    }
  },[userPlace])


  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 20,
        marginBottom: 10, fontWeight: "600", fontVariant: "bold" }}>
        Top Near By Places
      </Text>
      <View style={{ borderRadius: 20, overflow: "hidden" }}>
    {userPlace.coords?    <MapView
          style={{
            width: Dimensions.get("screen").width * 0.89,
            height: Dimensions.get("screen").height * 0.23,
          }}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={mapRegion}
        >
            <Marker
            title="Aca estas vos"
            coordinate={mapRegion}
            markerStyle={{backgroundColor:'blue'}}
            pinColor={'blue'}
             />
            {placeList.map((item,index)=>index<=4&&(
                <PlaceMarker item={item} key={index} />
            ))}

        </MapView>:null}

      </View>

    </View>
  );
}
