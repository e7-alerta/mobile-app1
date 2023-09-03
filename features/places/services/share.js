import {Platform, Share} from "react-native"

const SharePlace=(place)=>{
    const url=Platform.select({
        ios:"maps:"+place.geometry.location.lat + "," + place.geometry.location.lng + "?q=" + place.vicinity,
        android:"geo:"+place.geometry.location.lat + "," + place.geometry.location.lng + "?q=" + place.vicinity,
    });

    console.log(place.formatted_address);
    console.log(url);

    Share.share({
        title:'Te comparto un negocio vecino',
        message:"Negocio del barrio: "+place.name+"\n"+"Address: "
        +place.vicinity?place.vicinity:place.formatted_address,
        url:url
    });


}



export default{
    SharePlace
}
