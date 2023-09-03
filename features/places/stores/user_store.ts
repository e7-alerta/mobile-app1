import { create  } from "zustand";
import { PlaceType } from "../types/places_types";

export const useUserStore = create((set, get) => ({
        userPlace: {} as PlaceType,
        setUserPlace: (userPlace: PlaceType) => {
                console.log("userPlace", userPlace);
                set({userPlace});
        }
}));
