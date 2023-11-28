
import { PermissionsAndroid } from "react-native";
import {
    getCurrentPositionAsync, getLastKnownPositionAsync, LocationGeocodedAddress,
    reverseGeocodeAsync
} from "expo-location";
import {GeocodedAddressType, LocationType} from "../types/places_types";
import {geocodeAsync} from "./client";
import {convertJsonToLocationGeocodeAddress} from "./convert";


export const hasLocationPermission = async () => {

    const accessFineLocationGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    // console.log(" persimission  fine location is ", accessFineLocationGranted);

    const accessCoarseLocationGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    );
    // console.log(" persimission coarse location is ", accessCoarseLocationGranted);

    return (accessFineLocationGranted || accessCoarseLocationGranted);
}


export const getLastLocation = async () => {
    const _location = await getLastKnownPositionAsync({});
    // console.debug("_location is ", _location);
    // @ts-ignore
    if(!_location || !_location.coords) return null;
    return {
        coords: {
            latitude: _location.coords.latitude,
            longitude: _location.coords.longitude
        }
    } as LocationType;
}


export const getCurrentLocation = async () => {
    const _location = await getCurrentPositionAsync({});
    // console.debug("_location is ", _location);
    // @ts-ignore
    return {
        coords: {
            latitude: _location.coords.latitude,
            longitude: _location.coords.longitude
        }
    } as LocationType;
}


const placesYLocationCache = new Map<string, GeocodedAddressType>();


export const getPlaceByLocation = async (location: LocationType) => {
   // console.debug("getPlaceByLocation is ", location.coords);

    if(placesYLocationCache.has(`${location.coords.latitude}-${location.coords.longitude}`)) {
        console.log("getPlaceByLocation from cache");
        return placesYLocationCache.get(`${location.coords.latitude}-${location.coords.longitude}`);
    }

   let geocode: LocationGeocodedAddress[];
   let first  = null;

   try {
       let response = await geocodeAsync({
              lat: location.coords.latitude,
              lng: location.coords.longitude
          });
       console.log("[ google_location | 001 ] ............................ ");
       console.log(response);
       console.log("[ google_location | 002 ] ............................ ");
       geocode = response.data.results;
       first = convertJsonToLocationGeocodeAddress(geocode[0]);
       console.log(first);
       console.log("[ google_location | 003 ] ............................ ");
       // geocode = await reverseGeocodeAsync({
       //     latitude: location.coords.latitude,
       //     longitude: location.coords.longitude
       // });
   } catch (error) {
       console.error("error is ", error);
       return null;
   }

   let geo = {
       name: "", // 2581
       street: first.street, // avenida corrientes
       streetNumber: first.streetNumber, // 2581
       postalCode: first.postalCode, // c1225
       region: first.region, // buenos aires
       subregion: first.subregion, // comuna 3
       locality: first.locality,
       district: first.district, // balvanera
       city: first.city, // buenos aires
       country: first.country, // argentina
       countryCode: first.isoCountryCode, // ar
   } as GeocodedAddressType;

   placesYLocationCache.set(`${location.coords.latitude}-${location.coords.longitude}`, geo);
   return geo;
}
