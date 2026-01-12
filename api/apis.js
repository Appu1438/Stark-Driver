import axiosInstance from "./axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { CommonActions } from '@react-navigation/native';
import driverSocketService from "@/utils/socket/socketService";
import { Toast } from "react-native-toast-notifications";
import { Alert, Linking } from "react-native";

/**
 * Logout Function
 */
export const logout = async (
    driverId,
    message,
    setLoading
) => {
    try {
        // ------------------- Start Loading -------------------
        if (typeof setLoading === "function") {
            setLoading(true);
        }

        // ------------------- Call Backend -------------------
        const res = await axiosInstance.post(
            "/driver/logout",
            { driverId },
            { withCredentials: true }
        );

        /**
         * 🚫 CASE 1: Backend blocks logout (ACTIVE DEVICE + ACTIVE RIDE)
         */
        if (res.data?.blockLogout) {
            Toast.show(res.data.message, {
                type: "danger",
                placement: "bottom",
                duration: 2500,
            });

            if (typeof setLoading === "function") setLoading(false);
            return;
        }

        /**
         * ⚠️ CASE 2: Old device logout
         * - Logged in from another device
         * - DO NOT update status
         * - DO NOT send socket update
         */
        if (res.data?.skipSocketCleanup) {
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("driverData");

            if (typeof setLoading === "function") setLoading(false);

            router.replace("/(routes)/login");
            Toast.show("Session logged out from this device.", {
                type: "warning",
                placement: "bottom",
            });
            return;
        }

        /**
         * ✅ CASE 3: Normal logout (ACTIVE DEVICE + NO ACTIVE RIDE)
         * - Update socket
         * - Status becomes inactive (handled backend)
         */
        driverSocketService.sendLocationUpdate(driverId, {
            latitude: null,
            longitude: null,
        });

        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("driverData");

        if (typeof setLoading === "function") setLoading(false);

        Toast.show(message || "Logged out successfully", {
            type: "success",
            placement: "bottom",
        });

        router.replace("/(routes)/login");

    } catch (error) {
        /**
         * 🚫 CASE 4: Backend explicitly blocks logout in error response
         */
        if (error?.response?.data?.blockLogout) {
            Toast.show(error.response.data.message, {
                type: "danger",
                placement: "bottom",
            });

            if (typeof setLoading === "function") setLoading(false);
            return;
        }

        /**
         * 🧯 CASE 5: Fallback force logout
         * (network error / token expired / server down)
         */
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("driverData");

        if (typeof setLoading === "function") setLoading(false);

        Toast.show("Session expired. Logged out.", {
            type: "warning",
            placement: "bottom",
        });

        router.replace("/(routes)/login");
    }
};


/**
 * Refresh Token Function
 */
export const refreshAccessToken = async () => {
    try {
        const res = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/driver/refresh-token`,
            {},
            { withCredentials: true }
        );

        if (res.data?.accessToken) {
            // Store token normally
            await AsyncStorage.setItem("accessToken", res.data.accessToken);

            // 🔔 If token is temporary (ride active + refresh expired)
            // 🔔 TEMP TOKEN WARNING (Toast instead of alert)
            if (res.data.temp) {
                Toast.show({
                    type: "info",
                    text1: "Session Warning",
                    text2:
                        "Your session will expire soon. Please re-login after this ride ends.",
                });
            }
            return res.data.accessToken;
        }

        throw new Error("No access token");
    } catch (err) {
        console.log("Refresh token failed:", err);

        // Normal behaviour after ride ends:
        const driverStr = await AsyncStorage.getItem("driverData");
        const driver = driverStr ? JSON.parse(driverStr) : null;
        await logout(driver?.id, "Session expired. Please login again.");

        return null;
    }
};

