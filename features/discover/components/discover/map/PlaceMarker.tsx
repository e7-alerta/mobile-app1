import {Marker} from 'react-native-maps'
import {PlaceType} from "../../../../places/types/places_types";

export enum MarkerColor {
    GREEN = 'green',
    BLUE = 'blue',
    YELLOW = 'yellow',
    RED = 'red',
    TOMATO = 'tomato',
    ORANGE = 'orange',
    WHEAT = 'wheat',
    TAN = 'tan',
    LINEN = 'linen',
    NAVY = 'navy',
    AQUA = 'aqua',
    TEAL = 'teal',
    TURQUOISE = 'turquoise',
    VIOLET = 'violet',
    PURPLE = 'purple',
    PLUM = 'plum',
    INDIGO = 'indigo'
}
export default function PlaceMarker({item, color, styles= {}}: {item: PlaceType, color: MarkerColor, styles: {}}) {
    return (
        <Marker
            key={`${(item.id ? item.id : item.placeId)}-${item.coords.latitude}-${item.coords.longitude}`}
            pinColor={(color == MarkerColor.TOMATO ? "" : color.toString())}
            styles={styles}
            title={item.name ? `${item.address.split(",")[0]}, ${item.name}` : `${item.address}`}
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
