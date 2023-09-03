import axios from "axios"

const PLACE_URL="https://maps.googleapis.com/maps/api/place"
const GEOCODE_URL="https://maps.googleapis.com/maps/api/geocode";
const API_KEY="AIzaSyALoBC6-jqcHFm5tuGUC3JihKRkn_hMpW0"

const nearByPlace=(lat,lng,type)=>axios.get(PLACE_URL+
    "/nearbysearch/json?"+
    "&location="+lat+","+lng+"&radius=800&query="+type
    +"&key="+API_KEY)


const searchByText=(lat, lng, searchText)=>axios.get(PLACE_URL+
    "/textsearch/json?query="+searchText+
    "&location="+lat+","+lng+"&radius=600" +
    "&key="+API_KEY)


const fetchAddress = (latitude, longitude) => axios.get(GEOCODE_URL+
    `/json?latlng=${latitude},${longitude}&key=${API_KEY}`)

export default{
    nearByPlace,
    searchByText,
    fetchAddress,
    fetchAlerts: (lat, lng) => axios.post(`https://dash.vecinos.com.ar/api/alerts/active?point=${lat},${lng}`),
}
