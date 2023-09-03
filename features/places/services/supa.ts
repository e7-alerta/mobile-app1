import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js';
import {LocationType, PlaceType} from "../types/places_types";
import {PostgrestQueryBuilder} from "@supabase/postgrest-js";

const SUPABASE_URL = "https://xlxttiqwznfwkliclggb.supabase.co"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhseHR0aXF3em5md2tsaWNsZ2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5Mzg1NzMzMSwiZXhwIjoyMDA5NDMzMzMxfQ.csl6W2cphfYbgrI8YOpV7l3lxsp3K9oromqcgGb2a2o"

const supabase = createClient(SUPABASE_URL, API_KEY, {
    auth: {
        persistSession: false
    }
});

const places = supabase.from("ave_places");


const getNearestPlacesByLocation = async (location: LocationType) => {
    console.debug("get nearest places by location ", location.coords);

    const { data, error } = await supabase.rpc("nearest_places", {
        lat: location.coords.latitude,
        long: location.coords.longitude
    });

    console.debug("data is ", data);
    return data;
}


const savePlace = async (place: PlaceType, update=false) => {
    console.debug("[supa] save place ", place);

    if (!update) {
      let place_id = `${Math.random().toString(16).substring(2, 10)}-${Math.random().toString(16).substring(2, 6)}-${Math.random().toString(16).substring(2, 6)}-${Math.random().toString(16).substring(2, 6)}-${Math.random().toString(16).substring(2, 14)}`;

      const { data, error } = await places.insert([{
          "id": place_id,
            "name": place.name,
            "address": place.address,
            "location": `POINT(${place.coords.longitude} ${place.coords.latitude})`,
            "street": place.street,
            "street_number": place.streetNumber,
            "s_postal_code": place.postalCode,
            "s_city": place.city,
            "s_district": place.district,
            "s_region": place.region,
            "s_subregion": place.subregion,
            "s_country": place.country,
            "country_code": place.countryCode,
            "status": "online"
      }]).select();

      return data;

    } else {

        const { data, error } = await places.update({
            "id": place.id,
            "name": place.name,
            "address": place.address,
            "location": `POINT(${place.coords.longitude} ${place.coords.latitude})`,
            "street": place.street,
            "street_number": place.streetNumber,
            "s_postal_code": place.postalCode,
            "s_city": place.city,
            "s_district": place.district,
            "s_region": place.region,
            "s_subregion": place.subregion,
            "s_country": place.country,
            "country_code": place.countryCode,
            "status": "online"
        }).eq("id", place.id).select();

        if(error) {
            console.error("[supa] error is ", error);
        }

        return data;
    }



}

const getPlaces = async () => {
    console.debug("[supa] get places");

    const { data, error } = await places.select("*");
    console.debug("[supa] data is ", data);
    if(error) {
        console.error("[supa] error is ", error);
    }
    return data;
}

const saveAlert = async (alert: any) => {

    console.log("save alert ", alert);
    const { data, error } = await supabase.from("alerts").insert([{
        ...alert
    }]).select();
    console.log("data is ", data);
    console.log("error is ", error);
}


interface SupaApi {
    getNearestPlacesByLocation: (location: LocationType) => Promise<any>;
    savePlace: (place: PlaceType, update: boolean ) => Promise<any>;
    getPlaces: () => Promise<any>;
    saveAlert: (alert: any) => Promise<any>;
}


const BaseSupaApi: SupaApi = {
    getNearestPlacesByLocation,
    savePlace,
    getPlaces,
    saveAlert
}

export default BaseSupaApi;
