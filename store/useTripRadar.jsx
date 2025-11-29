import { create } from "zustand";
import { calculateDistance } from "@/utils/ride/calculateDistance";
import { playVoiceAlertTTS } from "@/utils/sound/playVoiceAlert";
import { playRideRequestSound } from "@/utils/sound/playRideRequestSound";
import { router } from "expo-router";
import axiosInstance from "@/api/axiosInstance";
import driverSocketService from "@/utils/socket/socketService";
import { sendPushNotification } from "@/utils/notifications/sendPushNotifications";
import { Toast } from "react-native-toast-notifications";

export const useTripRadar = create((set, get) => ({
  requests: [],
  timers: {},
  loadingAcceptRequests: {},
  loadingRejectRequests: {},
  driver: null, // store driver for accept handler

  setDriver: (driver) => set({ driver }),

  // ————————————————————
  // ADD REQUEST
  // ————————————————————
  addRequest: async (req, driverLocation) => {
    console.log("📩 New Radar Request:", req);

    // Sound Alerts
    // playRideRequestSound();
    playVoiceAlertTTS("New ride request received");

    const id = Date.now() + "_" + Math.random().toString(36).substring(2, 7);

    // Distance Calculations
    const kmToPickup = await calculateDistance(
      driverLocation.latitude,
      driverLocation.longitude,
      req.currentLocation.latitude,
      req.currentLocation.longitude
    );

    const kmPickupToDrop = await calculateDistance(
      req.currentLocation.latitude,
      req.currentLocation.longitude,
      req.marker.latitude,
      req.marker.longitude
    );

    const newReq = {
      id,
      data: {
        ...req,
        kmToPickup,
        kmPickupToDrop,
      },
      countdown: 30,
    };

    set((state) => ({
      requests: [...state.requests, newReq],
    }));

    // Countdown Logic
    const interval = setInterval(() => {
      const all = get().requests;
      const thisReq = all.find((r) => r.id === id);
      if (!thisReq) return;

      if (thisReq.countdown <= 1) {
        get().autoReject(id);
        return;
      }

      set({
        requests: all.map((r) =>
          r.id === id ? { ...r, countdown: r.countdown - 1 } : r
        ),
      });
    }, 1000);

    get().timers[id] = interval;
  },

  // ————————————————————
  // AUTO REJECT
  // ————————————————————
  autoReject: (id) => {
    const req = get().requests.find((r) => r.id === id);
    if (req) get().rejectRequest(id);
  },

  // ————————————————————
  // REJECT REQUEST
  // ————————————————————
  rejectRequest: async (id) => {
    const req = get().requests.find((r) => r.id === id);
    if (!req) return;

    const { loadingRejectRequests } = get();

    // ❗ Prevent double press
    if (loadingRejectRequests[id]) return;

    // 🔄 Start loader
    set({
      loadingRejectRequests: { ...loadingRejectRequests, [id]: true }
    });

    try {
      // normal reject flow
      clearInterval(get().timers[id]);

      const t = { ...get().timers };
      delete t[id];

      set({
        requests: get().requests.filter((r) => r.id !== id),
        timers: t,
      });

      driverSocketService.send({
        type: "rideRejected",
        role: "driver",
        driverId: get().driver?.id,
        userId: req.data.user.id,
      });

    } catch (err) {
      console.log("❌ Reject Error:", err);
    }

    // ✔ Clear loader for this request only
    const updated = { ...get().loadingRejectRequests };
    delete updated[id];
    set({ loadingRejectRequests: updated });

    console.log("❌ Ride Rejected:", id);
  },

  // ————————————————————
  // ACCEPT REQUEST (FULL BACKEND + SOCKET)
  // ————————————————————
  acceptRequest: async (id) => {
    const { loadingAcceptRequests } = get();
    const req = get().requests.find((r) => r.id === id);
    const driver = get().driver;

    if (!req || !driver) return;

    // 🚫 Prevent double taps
    if (loadingAcceptRequests[id]) return;

    // 🔄 Start loader for only this request
    set({
      loadingAcceptRequests: { ...loadingAcceptRequests, [id]: true }
    });

    try {
      const response = await axiosInstance.post(`/ride/new-ride`, {
        userId: req.data.user.id,
        totalFare: req.data.fare.totalFare,
        driverEarnings: req.data.fare.driverEarnings,
        platformShare: req.data.fare.platformShare,
        status: "Booked",
        currentLocationName: req.data.currentLocationName,
        currentLocation: req.data.currentLocation,
        destinationLocationName: req.data.destinationLocation,
        destinationLocation: req.data.marker,
        distance: req.data.distance,
      });

      const createdRide = response.data.newRide;

      sendPushNotification(
        req.data.user.notificationToken,
        "Ride Request Accepted!",
        "Your driver will pick you on the location!"
      );

      driverSocketService.send({
        type: "rideAccepted",
        role: "driver",
        rideData: {
          user: req.data.user,
          firstMarker: req.data.currentLocation,
          secondMarker: req.data.marker,
          driver,
          rideData: createdRide,
        },
      });

      // Clear everything
      set({
        requests: [],
        timers: {},
        loadingAcceptRequests: {}
      });

      router.push({
        pathname: "/(routes)/ride-details",
        params: { rideId: JSON.stringify(createdRide.id) },
      });

      return createdRide;

    } catch (err) {
      console.log("❌ Accept Error:", err);

      // ❗ Reset only this request loader
      const updated = { ...get().loadingAccpetRequests };
      delete updated[id];
      set({ loadingAcceptRequests: updated });

      Toast.show(
        err?.response?.data?.message ||
        "Unable to accept the ride. Please try again.",
        { type: "danger" }
      );

      return null;
    }
  },
}));
