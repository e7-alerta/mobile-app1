import { View, Text } from 'react-native'
import React from 'react'
import { AntDesign } from "@expo/vector-icons";
import Colors from '../../shared/colors';
import { Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import Share from '../../services/share';
import {PlaceType} from "../../types/places_types";

export default function PlaceDetailItem( {place,onDirectionClick}: { place: PlaceType, onDirectionClick:()=>void }) {
    return (
        <View>
            <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                {place.name}
            </Text>
            <View
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginTop: 5,
                    flexDirection: "row",
                }}
            >
                <AntDesign name="message1" size={20} color={Colors.yellow} />
                <Text>{place.rating}</Text>
            </View>
            {place.photo ? (
                <Image
                    source={{
                        uri:
                            "https://maps.googleapis.com/maps/api/place/photo" +
                            "?maxwidth=400" +
                            "&photo_reference=" +
                            place?.photos[0]?.photo_reference +
                            "&key=AIzaSyAlIDUiTW6M9p6qb7mHsMCvqk0_OMO3MV0",
                    }}
                    style={{
                        width: "100%",
                        height: 160,
                        borderRadius: 15,
                        marginTop: 10,
                    }}
                />
            ) : null }
            {place?.photos ? (
                <Image
                    source={{
                        uri:
                            "https://maps.googleapis.com/maps/api/place/photo" +
                            "?maxwidth=400" +
                            "&photo_reference=" +
                            place?.photos[0]?.photo_reference +
                            "&key=AIzaSyAlIDUiTW6M9p6qb7mHsMCvqk0_OMO3MV0",
                    }}
                    style={{
                        width: "100%",
                        height: 160,
                        borderRadius: 15,
                        marginTop: 10,
                    }}
                />
            ) : null}


            <Text
                style={{ fontSize: 16, marginTop: 10, color: Colors.DARK_GRAY }}
                numberOfLines={2}
            >
                {place.vicinity?place.vicinity:place.formatted_address}
            </Text>
            {place?.opening_hours ? (
                <Text className={"font-semibold"}>
                    {place?.opening_hours?.open_now == true ?
                        "(Open)" :
                        "(Closed)"}
                </Text>
            ) : null}

            <View style={{marginTop:10,flexDirection:'row',
                display:'flex', gap:10}}>
                <TouchableOpacity onPress={()=>onDirectionClick()}
                                  style={{
                                      direction: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      gap: 5,
                                      backgroundColor:Colors.GRAY,
                                      width:110,
                                      padding:3,
                                      borderRadius:40,
                                      justifyContent:'center'
                                  }}
                >
                    <Ionicons name="navigate-circle-outline" size={24} color="black" />
                    <Text style={{ fontSize: 16 }} className={"font-semibold  tracking-tight"}>Direction</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>Share.SharePlace(place)}
                                  style={{
                                      direction: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      gap: 5,
                                      backgroundColor:Colors.GRAY,
                                      width:90,
                                      padding:3,
                                      borderRadius:40,
                                      justifyContent:'center'
                                  }}
                >
                    <Ionicons name="md-share-outline" size={24} color="black" />
                    <Text style={{ fontSize: 16 }} className={"font-semibold tracking-tight"}>Share</Text>
                </TouchableOpacity>
            </View>


        </View>
    )
}
