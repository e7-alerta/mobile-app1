import { Text } from 'react-native'
import React  from 'react'
import PlaceDetailItem from './PlaceDetailItem';
import Colors from '../../shared/colors';
import GoogleMapView from '../home/map/GoogleMapView';
import { TouchableOpacity } from 'react-native';
import { Platform } from 'react-native';
import { Linking } from 'react-native';
import { ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import {PlaceType} from "../../types/places_types";

export default function PlaceDetail({ place }: { place: PlaceType }) {

  const onDirectionClick=()=>{
    const url=Platform.select({
      ios:"maps:"+place.coords.latitude + "," + place.coords.longitude,
      android:"geo:"+place.coords.latitude + "," + place.coords.longitude
    });

    Linking.openURL(url)
  }
  return (
    <ScrollView style={{ padding: 20, backgroundColor: Colors.white, flex: 1 }}>
      <PlaceDetailItem
        place={place}
        onDirectionClick={() => onDirectionClick()}
      />
      <GoogleMapView placeList={[place]} />
      <TouchableOpacity
        style={{
          backgroundColor: Colors.green,
          padding: 15,
          alignContent: "center",
          alignItem: "center",
          margin: 8,
          display:'flex',
          flexDirection:'row',
          gap:10,
          justifyContent:'center',
          alignItems:'center',
          borderRadius: 50,
          paddingBottom: 15,
        }}
        onPress={() => onDirectionClick()}
      >
          <Ionicons name="navigate-circle-outline"
          size={30} color="white" />

        <Text
          style={{
            textAlign: "center",
            color: Colors.white,
          }}
        >
          Get Direction on Google Map
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
