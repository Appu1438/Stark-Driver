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
export const logout = async (driverId, message, setLoading) => {
    try {
        // Start loading if applicable
        if (typeof setLoading === "function") {
            setLoading(true);
        }

        const res = await axiosInstance.post(
            "/driver/logout",
            { driverId },
            { withCredentials: true }
        );

        // 🚫 BACKEND RESTRICTED LOGOUT
        if (res.data?.blockLogout) {
            Toast.show(res.data.message, {
                type: "danger",
                placement: "bottom",
                duration: 2500,
            });

            if (typeof setLoading === "function") setLoading(false);
            return;
        }

        // -----------------------------------------
        // NORMAL LOGOUT FLOW
        // -----------------------------------------

        // Stop sending location updates
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
        // 🚫 BACKEND BLOCKS LOGOUT FROM ERROR RESPONSE
        if (error.response?.data?.blockLogout) {
            Toast.show(error.response.data.message, {
                type: "danger",
                placement: "bottom",
            });

            if (typeof setLoading === "function") setLoading(false);
            return;
        }

        // -----------------------------------------
        // FALLBACK — FORCE LOGOUT
        // -----------------------------------------

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



export const handleAddMoney = async (params, setShowAlert, setAlertConfig) => {

    // Helper for confirmation modal
    const confirmAction = () =>
        new Promise((resolve) => {
            setAlertConfig({
                title: "Confirm Payment",
                message: "Are you sure you want to proceed with this payment?",
                confirmText: "Proceed",
                showCancel: true,
                onCancel: () => {
                    setShowAlert(false);
                    resolve(false);
                },
                onConfirm: () => {
                    setShowAlert(false);
                    resolve(true);
                },
            });
            setShowAlert(true);
        });

    // Helper for info/error modal
    const showInfo = (title, message) => {
        setAlertConfig({
            title,
            message,
            confirmText: "OK",
            showCancel: false,
            onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
    };

    // Step 1 — Ask confirmation
    const confirmed = await confirmAction();
    if (!confirmed) return;

    // Step 2 — If confirmed, process payment
    try {
        const { data } = await axiosInstance.post(`/session`, {
            driverId: params?.id,
            name: params?.name,
            email: params?.email,
            phone_number: params?.phone_number,
        });

        const url = `${process.env.EXPO_PUBLIC_PAYMENT_API_URI}/${data.sessionId}`;
        Linking.openURL(url);

    } catch (error) {
        console.error("Failed to create session:", error);
        showInfo("Error", "Could not start the payment process. Please try again.");
    }
};
