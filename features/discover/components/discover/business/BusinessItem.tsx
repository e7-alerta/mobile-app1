import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import Colors from '../../../shared/colors';

import store from "../../../../../assets/images/empty.png";
import {PlaceType} from "../../../../places/types/places_types";

export default function BusinessItem({place}: {place: PlaceType}) {
    return (
        <View className={` ${(place.alerted ? 'border-red-500 border-r-4 border-t-4 border-l-2 h-44 ' : "h-44")}` } style={{
            width:150,backgroundColor:Colors.white,
            borderRadius:10,padding:10,margin:5,elevation:0.4
        }}>
            {(place.alerted) ? <View className={"z-50 absolute top-10 right-0 bg-red-500 h-8 p-0 "}><Text className={"font-bold text-white  text-sm"}>ALERTA</Text></View> : null}
            {(place?.photo) ?  <Image
                    source={{uri: "https://dash.vecinos.com.ar/assets/" + place?.photo }}
                    style={{ width: 135, height: 80, borderRadius: 6 }}
                /> :
                (place?.googlePhotos) ?  <Image
                    source={{uri:
                            "https://maps.googleapis.com/maps/api/place/photo" +
                            "?maxwidth=400" +
                            "&photo_reference=" +
                            place?.googlePhotos[0] +
                            "&key=AIzaSyAlIDUiTW6M9p6qb7mHsMCvqk0_OMO3MV0",
                    }}
                    style={{ width: 120, height: 80, borderRadius: 10 }}
                />:
                <Image source={store}
                       style={{ width: 120, height: 80, borderRadius: 9 }}
                /> }
            <Text
                numberOfLines={2}
                style={{fontSize:16,marginTop:5}}>{place.name}</Text>
            <Text
                numberOfLines={2}
                style={{ fontSize:13,marginTop:5,color:Colors.darkGray}}>
                {place.address}</Text>
            <View
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginTop:5,
                    flexDirection: "row",
                    marginBottom:-5
                }}
            >
            </View>
        </View>
    )
}
