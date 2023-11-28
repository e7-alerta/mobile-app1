

export type LocationGeocodeAddress = {
    district: string | null,
    streetNumber: string | null,
    street: string | null,
    region: string | null,
    subregion: string | null,
    locality: string | null,
    political: string | null,
    postalCode: string | null,
    city: string | null,
    isoCountryCode: string | null,
    country: string | null,
}



export const convertJsonToLocationGeocodeAddress = (data: any): LocationGeocodeAddress => {
    const addressComponentMap: { [key: string]: string } = {
        'street_number': 'streetNumber',
        'route': 'street',
        'sublocality': 'subregion',
        'locality': 'locality',
        'administrative_area_level_2': 'region',
        'administrative_area_level_1': 'district',
        'country': 'country',
        'postal_code': 'postalCode',
        'political': 'political'
    };

    const address: LocationGeocodeAddress = {
        district: null,
        streetNumber: null,
        street: null,
        region: null,
        subregion: null,
        political: null,
        postalCode: null,
        locality: null,
        city: null,
        isoCountryCode: null,
        country: null
    };

    for (let component of data.address_components) {
        const type = component.types[0]; // suponemos que el primer tipo es el más relevante
        const mappedType = addressComponentMap[type];

        if (mappedType) {
            if (mappedType === 'country') {
                address.isoCountryCode = component.short_name;
            }
            // @ts-ignore
            address[mappedType] = component.long_name;
        }
    }

    return address;
}
