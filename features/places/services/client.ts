import axios from "axios"

const PLACE_URL="https://maps.googleapis.com/maps/api/place"
const BASE_URL="https://maps.googleapis.com/maps/api/place"
const GEOCODE_URL="https://maps.googleapis.com/maps/api/geocode"
const API_KEY= "AIzaSyAlIDUiTW6M9p6qb7mHsMCvqk0_OMO3MV0"
const API_KEY_2 = "AIzaSyDeUa_O-593_rykVwmgJP_r_j2m5p8QWVI"
const API_KEY_3 = "AIzaSyBX-H1Lk9ubEY-tLvzgel77UFY2fIf5yzM"

// @ts-ignore
export const nearByPlace=(lat,lng,type)=>axios.get(BASE_URL+
    "/nearbysearch/json?"+
    "&location="+lat+","+lng+"&radius=1500&type="+type
    +"&key="+API_KEY)


export const searchByText=({lat, lng, searchText}: {lat: number, lng: number, searchText: string})=>axios.get(PLACE_URL+
    "/textsearch/json?query="+searchText+
    "&location="+lat+","+lng+"&radius=1000" +
    "&key="+API_KEY)


// https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
export const geocodeAsync= async ({lat, lng} : {lat: number, lng: number}) => axios.get(GEOCODE_URL+
    "/json?latlng="+lat+","+lng+
"&key="+API_KEY_3)

export default{
    geocodeAsync,
    nearByPlace,
    searchByText
}
