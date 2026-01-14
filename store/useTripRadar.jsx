import { create } from "zustand";
import { calculateDistance } from "@/utils/ride/calculateDistance";
import { playVoiceAlertTTS } from "@/utils/sound/playVoiceAlert";
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
  isProcessing: false,   // 🔥 prevents double accept/reject

  driver: null,

  setDriver: (driver) => set({ driver }),

  // ————————————————————
  // ADD REQUEST
  // ————————————————————
  addRequest: async (req, driverLocation) => {
    console.log("📩 New Radar Request:", req);

    playVoiceAlertTTS("New ride request received");

    const id = Date.now() + "_" + Math.random().toString(36).substring(2, 7);

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
      countdown: 60,
      accepting: false,   // ⭐ freeze countdown when accepting
    };

    set((state) => ({
      requests: [...state.requests, newReq],
    }));

    const interval = setInterval(() => {
      const all = get().requests;
      const thisReq = all.find((r) => r.id === id);
      if (!thisReq) return;

      // ⭐ Freeze countdown during accepting
      if (thisReq.accepting === true) return;

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

    if (get().isProcessing) return;

    set({
      loadingRejectRequests: { ...loadingRejectRequests, [id]: true },
      isProcessing: true,
    });

    try {
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
        driver: get().driver?.id,
        userId: req.data.user.id,
      });

    } catch (err) {
      console.log("❌ Reject Error:", err);
    }

    const updated = { ...loadingRejectRequests };
    delete updated[id];

    set({
      loadingRejectRequests: updated,
      isProcessing: false,
    });
  },

  // ————————————————————
  // ACCEPT REQUEST
  // ————————————————————
  acceptRequest: async (id) => {
    const req = get().requests.find((r) => r.id === id);
    const driver = get().driver;

    if (!req || !driver) return;
    if (get().isProcessing) return;

    // ⭐ Freeze countdown UI
    set({
      requests: get().requests.map((r) =>
        r.id === id ? { ...r, accepting: true } : r
      ),
      loadingAcceptRequests: {
        ...get().loadingAcceptRequests,
        [id]: true,
      },
      isProcessing: true,
    });

    try {
      const response = await axiosInstance.post(`/ride/new-ride`, {
        uniqueRideKey: req.data.uniqueRideKey,
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

      // 🎉 SUCCESS — YOU WON
      const createdRide = response.data.newRide;

      sendPushNotification(
        req.data.user.notificationToken,
        "Ride Request Accepted!",
        "Your driver will pick you up shortly."
      );

      driverSocketService.send({
        type: "rideAccepted",
        role: "driver",
        driver: get().driver?.id,
        rideData: {
          user: req.data.user,
          firstMarker: req.data.currentLocation,
          secondMarker: req.data.marker,
          driver,
          rideData: createdRide,
        },
      });

      // 🧹 CLEAR ALL RADAR STATE
      Object.values(get().timers).forEach(clearInterval);

      set({
        requests: [],
        timers: {},
        loadingAcceptRequests: {},
        isProcessing: false,
      });

      router.push({
        pathname: "/(routes)/ride-details",
        params: { rideId: JSON.stringify(createdRide.id) },
      });

      return createdRide;

    } catch (err) {
      console.log("❌ Accept Error:", err);

      const code = err?.response?.data?.code;
      const message = err?.response?.data?.message;

      // ------------------------------------------------
      // 🔴 CASE 1 — RIDE ASSIGNED (HARD FAIL)
      // ------------------------------------------------
      if (code === "REQUEST_ASSIGNED") {
        clearInterval(get().timers[id]);

        const timersCopy = { ...get().timers };
        delete timersCopy[id];

        set({
          requests: get().requests.filter((r) => r.id !== id),
          timers: timersCopy,
        });

        Toast.show("Another driver already accepted the ride.", {
          type: "danger",
        });
      }

      // ------------------------------------------------
      // 🟠 CASE 2 — RIDE LOCKED (SOFT FAIL)
      // ------------------------------------------------
      else if (code === "REQUEST_LOCKED") {
        Toast.show("Ride is locked by another driver. Please wait.", {
          type: "warning",
        });

        // 🔓 Resume countdown (DO NOT remove request)
        set({
          requests: get().requests.map((r) =>
            r.id === id ? { ...r, accepting: false } : r
          ),
        });
      }

      // ------------------------------------------------
      // 🟡 CASE 3 — LOW WALLET
      // ------------------------------------------------
      else if (code === "LOW_WALLET") {
        Toast.show("Low wallet balance. Please recharge.", {
          type: "warning",
        });

        // 🔓 Resume countdown
        set({
          requests: get().requests.map((r) =>
            r.id === id ? { ...r, accepting: false } : r
          ),
        });
      }

      // ------------------------------------------------
      // ⚠️ CASE 4 — ANY OTHER ERROR
      // ------------------------------------------------
      else {
        Toast.show(
          message || "Unable to accept the ride. Please try again.",
          { type: "danger" }
        );

        set({
          requests: get().requests.map((r) =>
            r.id === id ? { ...r, accepting: false } : r
          ),
        });
      }

      // 🧹 STOP LOADING
      const updated = { ...get().loadingAcceptRequests };
      delete updated[id];

      set({
        loadingAcceptRequests: updated,
        isProcessing: false,
      });

      return null;
    }
  },

}));
