import React from 'react'
import { Marker } from 'react-native-maps'
import {PlaceType} from "../../../types/places_types";

export default function PlaceMarker({item}: {item: PlaceType}) {
  return (
    <Marker
    title={item.name ? `${item.address}, ${item.name}` :  `${item.address}`}
    coordinate={
        {
            latitude: item.coords.latitude,
            longitude: item.coords.longitude,
            latitudeDelta: 0.0522,
            longitudeDelta: 0.0421,
          }
    }
     >

        </Marker>
  )
}
