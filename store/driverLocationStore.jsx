import { create } from "zustand";
import { AnimatedRegion } from "react-native-maps";

export const useDriverLocationStore = create((set, get) => ({
  currentLocation: null,
  animatedLocation: new AnimatedRegion({
    latitude: 0,
    longitude: 0,
  }),
  heading: 0,
  district: null,

  setDistrict: (d) => set({ district: d }),

  updateLocation: (newLocation) => {
    const { currentLocation, animatedLocation, heading, district } = get();

    console.log(currentLocation, heading, district)


    // ---- Calculate heading (bearing) ----
    if (currentLocation) {
      const angle = calculateHeading(currentLocation.latitude, currentLocation.longitude, newLocation.latitude, newLocation.longitude);
      set({ heading: angle });
    }

    // Smooth animation (this is the key)
    animatedLocation.timing({
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
      duration: 1000,               // smoothness
      useNativeDriver: false,
    }).start();


    set({
      currentLocation: newLocation,
    });
  },

}));

// ---- Bearing calculation ----
function calculateHeading(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => deg * (Math.PI / 180);
  const toDeg = (rad) => rad * (180 / Math.PI);

  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);

  return ((toDeg(Math.atan2(y, x)) + 360) % 360);
}

