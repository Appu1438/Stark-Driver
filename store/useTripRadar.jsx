import { create } from "zustand";
import { calculateDistance } from "@/utils/ride/calculateDistance";
import { playVoiceAlertTTS } from "@/utils/sound/playVoiceAlert";
import { playRideRequestSound } from "@/utils/sound/playRideRequestSound";
import { router } from "expo-router";
import axiosInstance from "@/api/axiosInstance";
import driverSocketService from "@/utils/socket/socketService";
import { sendPushNotification } from "@/utils/notifications/sendPushNotifications";

export const useTripRadar = create((set, get) => ({
  requests: [],
  timers: {},
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
      countdown: 120,
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
  rejectRequest: (id) => {
    const req = get().requests.find((r) => r.id === id);
    if (!req) return;

    // Clear timer
    clearInterval(get().timers[id]);
    const t = { ...get().timers };
    delete t[id];

    // Remove request
    set({
      requests: get().requests.filter((r) => r.id !== id),
      timers: t,
    });

    // Notify user via socket
    driverSocketService.send({
      type: "rideRejected",
      role: "driver",
      driverId: get().driver?.id,
      userId: req.data.user.id,
    });

    console.log("❌ Ride Rejected:", id);
  },

  // ————————————————————
  // ACCEPT REQUEST (FULL BACKEND + SOCKET)
  // ————————————————————
  acceptRequest: async (id) => {
    const req = get().requests.find((r) => r.id === id);
    const driver = get().driver;

    if (!req || !driver) return;

    // Clear ALL timers
    Object.values(get().timers).forEach(clearInterval);
    set({ timers: {} });

    try {
      // Backend Ride Creation
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
       sendPushNotification(req.data.user.notificationToken,
                      "Ride Request Accepted!",
                      `Your driver will pick you on the location!`)

      // Notify user
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

      // Clear list
      set({ requests: [] });

      // Navigate
      router.push({
        pathname: "/(routes)/ride-details",
                params: { rideId: JSON.stringify(createdRide.id) },
      });

      console.log("✅ Ride Accepted:", createdRide.id);

      return {
        ...req.data,
        rideData: createdRide,
      };
    } catch (err) {
      console.log("❌ Accept Error:", err);
      get().rejectRequest(id);
      return null;
    }
  },
}));
