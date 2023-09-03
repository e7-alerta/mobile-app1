
import { PermissionsAndroid } from "react-native";
import {
    getCurrentPositionAsync, LocationGeocodedAddress,
    reverseGeocodeAsync
} from "expo-location";
import {GeocodedAddressType, LocationType} from "../types/places_types";


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


export const getPlaceByLocation = async (location: LocationType) => {
   // console.debug("getPlaceByLocation is ", location.coords);

   let geocode: LocationGeocodedAddress[];

   try {
       geocode = await reverseGeocodeAsync({
           latitude: location.coords.latitude,
           longitude: location.coords.longitude
       });
   } catch (error) {
       console.error("error is ", error);
       return null;
   }

   // console.debug("geocode is ", geocode);
   let first = geocode[0];
   return {
       name: first.name, // 2581
       street: first.street, // avenida corrientes
       streetNumber: first.streetNumber, // 2581
       postalCode: first.postalCode, // c1225
       region: first.region, // buenos aires
       subregion: first.subregion, // comuna 3
       district: first.district, // balvanera
       city: first.city, // buenos aires
       country: first.country, // argentina
       countryCode: first.isoCountryCode, // ar
   } as GeocodedAddressType;
}
