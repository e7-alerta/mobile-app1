import axios from "axios";
import {PlaceType} from "../types/places_types";

const PLACE_URL = "https://dash.vecinos.com.ar/items/place";


/*
axios.interceptors.request.use(request => {
    console.debug('[request] ', request)
    return request
});

axios.interceptors.response.use(response => {
    console.debug('[response] ', response)
    return response
});
*/

const options = {
    method: 'POST',
    url: 'https://dash.vecinos.com.ar/items/place',
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


const fetchGetPlacesInAlarm = () => {
    return axios.get(
        PLACE_URL+"/filter[alarmed][_neq]=false"
    );
}

const fetchGetPlaces = () => {
    return axios.get(
        PLACE_URL
    );
}

const fetchNewPlace = async ( newPlace: PlaceType )  => {
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
        _city: newPlace.city,
        _district: newPlace.district,
        _region: newPlace.region,
        _subregion: newPlace.subregion,
        _postal_code: newPlace.postalCode,
        _country: newPlace.country,
    }

    let storedPlace = null;
    try {
        let response = await axios.post(
            PLACE_URL,
            placeIn
        );
        let { id, ...rest } = response.data.data;
        storedPlace = {
            id: id,
            ...newPlace
        } as PlaceType;
        // console.trace("response is ", response.data);
    } catch (error) {
        console.trace("error is ", error);
    }
    return storedPlace;
}


const fetchGetPlaceById = async (id: string) => {
    try {
        let response = await axios.get(
            PLACE_URL + "/" + id
        );
        let data = await response.data.data;
        console.debug("response is ", data);
        // map to PlaceType
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
            city: data._city,
            district: data._district,
            region: data._region,
            subregion: data._subregion,
            postalCode: data._postal_code,
            country: data._country,
            status: data.status
        } as PlaceType;
        // console.debug("place is ", place);

        return place;
    } catch (error) {
        console.trace("error is ", error);
    }
}

const fetchUpdatePlace = async ( place: PlaceType ) => {
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
    // console.debug("[dash] data is ", data);
    return place;
}

const fetchAlert = ({
    id,
    latitude, longitude,
    alert_type
}) => {
    const alertIn =  {
        id: id,
        geopoint: {type: 'Point', coordinates: [longitude, latitude]},
        alerted: true,
        alert_type: alert_type
    }
    return axios.patch(
        PLACE_URL+"/"+id,
        alertIn
    );
}



interface DashApi {
    newPlace: (place: any) => Promise<any>;
    alert: (place: any) => Promise<any>;
    updatePlace: (place: any) => Promise<any>;
    getPlaceById: (id: string) => Promise<any>;
    getPlaces: () => Promise<any>;
    getPlacesInAlarm: () => Promise<any>;
}

const BaseDashApi: DashApi = {
    newPlace: fetchNewPlace,
    alert: fetchAlert,
    updatePlace: fetchUpdatePlace,
    getPlaceById: fetchGetPlaceById,
    getPlaces: fetchGetPlaces,
    getPlacesInAlarm: fetchGetPlacesInAlarm
}

export default BaseDashApi;
