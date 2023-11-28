import { View, Text } from 'react-native'
import React from 'react'
import Colors from '../../../shared/colors'
import { Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FlatList } from 'react-native'
import BusinessItem from './BusinessItem'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'
import {PlaceType} from "../../../../places/types/places_types";
import {GooglePlaceType} from "../../../../places/types/google_types";
import {useUserStore} from "../../../../places/stores/user_store";
import {router} from "expo-router";

export default function BusinessList({googlePlaces, storePlaces} : {googlePlaces: PlaceType[], storePlaces: PlaceType[]}) {

    // @ts-ignore
    const setFocusPlace = useUserStore( state => state.setFocusPlace );


    const navigation=useNavigation();
    let allPlaces = googlePlaces.concat(storePlaces).sort((a,b)=>{ return a.alerted && b.alerted ? 0 : a.alerted ? -1 : 1 });
    // sort by alertes
    allPlaces.sort((a,b)=>{
        if(a.alerted && b.alerted)
        {
            return 0;
        }
        else if(a.alerted)
        {
            return -1;
        }
        else if(b.alerted)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    });
  return (
    <View >
      <LinearGradient
        colors={["transparent", Colors.white]}
        className={"w-full h-48"}
      >
        <FlatList
        data={allPlaces}
        horizontal={true}
        keyExtractor={(item,index)=> `${( item.id ? item.id : item.placeId)}-${item.coords.latitude}-${item.coords.longitude}` }
        renderItem={({item,index})=>(
        <TouchableOpacity
            onPress={()=> {
            setFocusPlace(item);
            router.push("/place-detail");
            // navigation.navigate('place-detail');
        }}>
            <BusinessItem key={index} place={item} />
        </TouchableOpacity>
        )}
        />
      </LinearGradient>
    </View>
  )
}
