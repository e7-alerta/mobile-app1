export type GooglePlaceType = {
    placeId: string,
    name: string,
    formattedAddress: string,
    geometry: {
        location: {
            lat: number,
            lng: number
        }
    },
    types: string[],
    userRatingsTotal: number,
    rating: number
}
