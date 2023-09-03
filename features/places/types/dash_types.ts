
export interface Place {
    id: string,
    name: string,
    placeId: string,
    geopoint: Geopoint,
    address: string
    street: string,
    streetNumber: string,
    postalCode: string,
    region: string,
    district: string,
    city: string,
    country: string,
    alertType: string,
    alerted: boolean,
    lastAlerted: string
}

export interface Geopoint {
    type: string,
    coordinates: number[]
}
