
export type GeocodedAddressType = {
    city: string,
    country: string,
    countryCode: string,
    name: string,
    postalCode: string,
    district: string,
    region: string,
    locality: string,
    street: string,
    streetNumber: string,
    isoCountryCode: string,
    subregion: string
}

export interface LocationType {
    coords: CoordsType;
    mocked?: boolean;
    timestamp: number;
}

export interface CoordsType {
    latitude: number;
    longitude: number;
    speed: number;
}


export enum PlaceOrigin {
    GOOGLE = 'GOOGLE',
    STORE = 'STORE',
    DASH = 'DASH',
    APP = 'APP'
}

export interface PlaceType {
    placeLabels: string[],
    placeOrigin: PlaceOrigin,
    numberOfAlerts: number;
    photo: string;
    googlePhotos: string[];
    status: string,
    id?: string;
    name?: string;
    placeId: string;
    coords: CoordsType;
    address: string;
    street: string;
    streetNumber: string;
    postalCode: string;
    region: string;
    subregion: string;
    district: string;
    city: string;
    country: string;
    countryCode: string;
    alerted: boolean;
}

export interface AllertType {
    id: string;
    place: PlaceType;
    alertType: string;
    alertDate: string;
    alertTime: string;
    alertMessage: string;
    alertStatus: string;
}
