import { Text, View } from "react-native";

import DiscoverScreen from "../../features/discover/screens/Discover";
import {useUserStore} from "../../features/places/stores/user_store";
import {PlaceType} from "../../features/places/types/places_types";
import {useEffect} from "react";


export default function Page() {

    // @ts-ignore
    // const userPlace: PlaceType = useUserStore(state => state.userPlace)

    {/* <DiscoverScreen  userLocation={userLocation} userPlace={userPlace} /> */}

    useEffect(() => {
    });

    return (
        <DiscoverScreen/>
    );
}
