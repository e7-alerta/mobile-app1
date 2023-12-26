import axios from "axios";
import {CoordsType, PlaceOrigin, PlaceType} from "../types/places_types";

const PLACE_URL = "https://dash.vecinos.com.ar/items/places";
const PHONE_ALERTS_URL = "https://phones.vecinos.com.ar/api/v1/phones/";
const PHONE_NEW_URL = "https://phones.vecinos.com.ar/api/v1/phones/new";
const PHONE_URL = "https://phones.vecinos.com.ar/api/v1/phones";
const NEAR_BASE_HOST = "https://nearby.vecinos.com.ar";
const NEAR2_BASE_HOST = "https://nearby2.vecinos.com.ar";

axios.interceptors.request.use(request => {
    console.debug('[request] ', request)
    return request
});

axios.interceptors.response.use(response => {
    return response
});

const options = {
    method: 'POST',
    url: 'https://dash.vecinos.com.ar/items/places',
    headers: {'Content-Type': 'application/json'},
    data: {
        id: '7e1c7306-a5c5-4d80-9660-1c9595a71a3a',
        geopoint: {type: 'Point', coordinates: [-58.405896328095395, -34.61440480462283]},
        address: 'Av. Independencia 2581, C1225AAH CABA, Argentina',
        city: 'Buenos Aires',
        district: 'Balvanera',
        region: 'Buenos Aires',
        subregion: 'Comuna 3',
        postal_code: 'C1225',
        street: 'Avenida Independencia',
        street_number: 2581,
        country: 'Argentina'
    }
};


export const fetchGetPlacesInAlarm = () => {
    return axios.get(
        PLACE_URL+"/filter[alarmed][_neq]=false"
    );
}

export const fetchGetNearByGPlaces = async (origin: PlaceType) => {

    let district = origin.district ? origin.district : "";
    let region = origin.region ? origin.region : "";

// `${NEAR_BASE_HOST}/api/v1/nearby_gplaces?lat=${origin.coords.latitude}&lng=${origin.coords.longitude}&district=${district}&region=${region}&radius=800&limit=20&offset=0&sort=distance&order=asc&place_type=all`,
    try  {
        let response =  await axios.get(
            `${NEAR2_BASE_HOST}/near/gplaces?lat=${origin.coords.latitude}&lng=${origin.coords.longitude}&district=${district}&region=${region}&radius=800&limit=20&offset=0&sort=distance&order=asc&place_type=all`,
        );

        let data = await response.data; // .places;
        // check if data is empty or null
        let places: PlaceType[] = [];

        if(!data) {
            data = []
        }

        places = data
            .filter((item) => (item.geopoint && item.geopoint.coordinates))
            .map((item) => {
                let place: PlaceType = {
                    id: item.id,
                    name: item.name,
                    coords: {
                        latitude: item.geopoint.coordinates[1],
                        longitude: item.geopoint.coordinates[0]
                    } as CoordsType,
                    address: item.address,
                    street: item.street,
                    streetNumber: item.street_number,
                    countryCode: item.country_code,
                    city: item._city,
                    district: item.district,
                    region: item.region,
                    country: item.country,
                    status: item.status,
                    alerted: item.alerted,
                    photo: item.photo,
                    placeOrigin: PlaceOrigin.DASH,
                } as PlaceType;
                return place;
            });
        return places;  // esimionato
    } catch (error) {
        console.trace("error is ", error);
        return [];
    }
}

export const fetchGetNearByPlaces = async (origin: PlaceType) => {

    let district = origin.district ? origin.district : "";
    let region = origin.region ? origin.region : "";

    try  {
        let response =  await axios.get(
            `${NEAR2_BASE_HOST}/near/places?lat=${origin.coords.latitude}&lng=${origin.coords.longitude}&district=${district}&region=${region}&radius=800&limit=20&offset=0&sort=distance&order=asc&place_type=all`,
        );

        // console.log("............ data is ", response.data)
        let data = await response.data; // .places;

        if(!data) {
            data = []
        }

        let places: PlaceType[] = data

        places = data
            .filter((item) => (item.geopoint && item.geopoint.coordinates))
            .map( (item) => {
                let place : PlaceType = {
                    id: item.id,
                    name: item.name,
                    coords: {
                        latitude: item.geopoint.coordinates[1],
                        longitude: item.geopoint.coordinates[0]
                    } as CoordsType,
                    address: item.address,
                    street: item.street,
                    streetNumber: item.street_number,
                    countryCode: item.country_code,
                    city: item._city,
                    district: item.district,
                    region: item.region,
                    country: item.country,
                    status: item.status,
                    alerted: item.alerted,
                    photo: item.photo,
                    placeOrigin: PlaceOrigin.DASH,
                } as PlaceType;
                return place;
            });
        return places;  // esimionato
    } catch (error) {
        console.trace("error is ", error);
        return [];
    }
}

export const fetchGetPlaces = async () => {
    try  {
        let response =  await axios.get( PLACE_URL );
        let data = await response.data.data;
        let places: PlaceType[] = data
            .filter((item) => (item.geopoint && item.geopoint.coordinates))
            .map( (item) => {
                let place : PlaceType = {
                    id: item.id,
                    name: item.name,
                    coords: {
                        latitude: item.geopoint.coordinates[1],
                        longitude: item.geopoint.coordinates[0]
                    } as CoordsType,
                    address: item.address,
                    street: item.street,
                    streetNumber: item.street_number,
                    countryCode: item.country_code,
                    city: item._city,
                    district: item._district,
                    region: item._region,
                    subregion: item._subregion,
                    postalCode: item._postal_code,
                    country: item._country,
                    status: item.status,
                    alerted: item.alerted,
                    photo: item.photo,
                    placeOrigin: PlaceOrigin.DASH,
                } as PlaceType;
                return place;
        });
        return places.slice(0, 2);  // esimionato
    } catch (error) {
        console.trace("error is ", error);
        return [];
    }
}

export const fetchNewPlace = async ( newPlace: PlaceType )  => {
    const placeIn =  {
        status: newPlace.status ? newPlace.status : "draft",
        name: newPlace.name,
        geopoint: {
            type: 'Point',
            coordinates: [
                newPlace.coords.longitude,
                newPlace.coords.latitude
            ]
        },
        address: newPlace.address,
        street: newPlace.street,
        street_number: newPlace.streetNumber,
        country_code: newPlace.countryCode,
        country: newPlace.country,
        raw_city: newPlace.city,
        raw_district: newPlace.district,
        raw_region: newPlace.region,
        raw_subregion: newPlace.subregion,
        postal_code: newPlace.postalCode,
        raw_country: newPlace.country,
    }

    let storedPlace = null;
    try {
        let response = await axios.post(
            PHONE_NEW_URL,
            placeIn
        );
        let { id, phone_id, ...rest } = response.data.data;
        storedPlace = {
            id: id,
            phone_id: phone_id,
            ...newPlace
        } as PlaceType;
    } catch (error) {
        console.trace("error is ", error);
    }
    return storedPlace;
}


export const fetchGetPlaceById = async (id: string) => {
    try {
        let response = await axios.get(
            PHONE_URL + "/" + id + "/place"
        );
        let data = await response.data.data;
        let place = {
            id: data.id,
            name: data.name,
            coords: {
                latitude: data.geopoint.coordinates[1],
                longitude: data.geopoint.coordinates[0]
            },
            address: data.address,
            street: data.street,
            streetNumber: data.street_number,
            countryCode: data.country_code,
            city: data.raw_city,
            district: data.raw_district,
            region: data.raw_region,
            subregion: data.raw_subregion,
            postalCode: data.postal_code,
            country: data.raw_country,
            status: data.status,
            alerted: data.alerted,
        } as PlaceType;

        return place;
    } catch (error) {
        console.trace("error is ", error);
    }
}

export const fetchUpdatePlace = async ( place: PlaceType ) => {
    const placeIn =  {
        id: place.id,
        geopoint: {type: 'Point', coordinates: [place.coords.longitude, place.coords.latitude]},
        address: place.address,
        street: place.street,
        street_number: place.streetNumber,
        country_code: place.countryCode,
        country: place.country,
        _city: place.city,
        _district: place.district,
        _region: place.region,
        _subregion: place.subregion,
        _postal_code: place.postalCode,
        _country: place.country,

        status : place.status
    }
    const { data, error } = await axios.patch(
            PLACE_URL+"/"+place.id,
            placeIn
        );
    if(error) {
        console.error("[dash] error is ", error);
    }
    return place;
}

export const fetchAlert = ({
    id,
    latitude, longitude,
    alert_type
}) => {
    console.log("[dash] fetchAlert is ", id, latitude, longitude, alert_type);
    const alertIn =  {
        id: id,
        geopoint: {type: 'Point', coordinates: [longitude, latitude]},
        alerted: true,
        status: "alerted",
        alert_type: alert_type
    }
    return axios.post(
        PHONE_ALERTS_URL+"/"+id+"/alerts/trigger",
        alertIn
    );
}

export const fetchToken = async  ({ id, token }: {id: string, token: string}) => {
    console.log("[dash] fetchToken is ", id, token);
    //       id: id,
    // status: "online"
    const tokenIn =  {
        token: token
    }
    return axios.patch(
        PHONE_URL+"/"+id+"/token/refresh",
        tokenIn
    );
}




interface DashApi {
    newPlace: (place: any) => Promise<any>;
    alert: (place: any) => Promise<any>;
    updatePlace: (place: any) => Promise<any>;
    getPlaceById: (id: string) => Promise<any>;
    getPlaces: () => Promise<any>;
    getNearByPlaces: (origin: any) => Promise<any>;
    getNearByGPlaces: (origin: any) => Promise<any>;
    getPlacesInAlarm: () => Promise<any>;
}

const BaseDashApi: DashApi = {
    newPlace: fetchNewPlace,
    alert: fetchAlert,
    updatePlace: fetchUpdatePlace,
    getPlaceById: fetchGetPlaceById,
    getPlaces: fetchGetPlaces,
    getNearByPlaces: fetchGetNearByPlaces,
    getNearByGPlaces: fetchGetNearByGPlaces,
    getPlacesInAlarm: fetchGetPlacesInAlarm
}

export default BaseDashApi;
