import PlaceDetail from "../../features/places/components/place_detail/PlaceDetail";
import {useUserStore} from "../../features/places/stores/user_store";


export default function Page() {

    // @ts-ignore
    const focusPlace = useUserStore(state => state.focusPlace);



    return (
        focusPlace ? <PlaceDetail place={focusPlace} /> : null
    );
}
