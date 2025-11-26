import { create } from "zustand";
import { AnimatedRegion } from "react-native-maps";

export const useDriverLocationStore = create((set, get) => ({
  currentLocation: null,
  animatedLocation: new AnimatedRegion({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }),
  lastLocation: null,
  heading: 0,
  district: null,

  setDistrict: (d) => set({ district: d }),

  updateLocation: (newLocation) => {
    const { lastLocation, animatedLocation } = get();

    // ---- Calculate heading (bearing) ----
    if (lastLocation) {
      const angle = calculateHeading(lastLocation, newLocation);
      set({ heading: angle });
    }

    // Smooth animation (this is the key)
    animatedLocation.timing({
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
      duration: 800,               // smoothness
      useNativeDriver: false,
    }).start();


    set({
      currentLocation: newLocation,
      lastLocation: newLocation,
    });
  },
}));

// ---- Bearing calculation ----
const calculateHeading = (start, end) => {
  const startLat = (start.latitude * Math.PI) / 180;
  const startLng = (start.longitude * Math.PI) / 180;
  const endLat = (end.latitude * Math.PI) / 180;
  const endLng = (end.longitude * Math.PI) / 180;

  const dLng = endLng - startLng;

  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  let angle = (Math.atan2(y, x) * 180) / Math.PI;

  return (angle + 360) % 360;
};
