import { create  } from "zustand";
import { PlaceType } from "../types/places_types";

export const useUserStore = create((set, get) => ({
        userPlace: {} as PlaceType,
        setUserPlace: (userPlace: PlaceType) => {
                set({userPlace});
        },
        focusPlace: {} as PlaceType,
        setFocusPlace: (focusPlace: PlaceType) => {
                set({focusPlace});
        }
}));
