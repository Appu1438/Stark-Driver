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
export const logout = async (driverId, message) => {
    try {
        const res = await axiosInstance.post("/driver/logout", { driverId }, { withCredentials: true });

        if (res.data?.blockLogout) {
            // DO NOT LOGOUT
            alert(res.data.message);
            return;
        }

        // continue normal logout
        driverSocketService.sendLocationUpdate(driverId, { latitude: null, longitude: null });

        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("driverData");

        router.replace("/(routes)/login");

    } catch (error) {

        // ❗ If backend returns blockLogout
        if (error.response?.data?.blockLogout) {
            alert(error.response.data.message);
            return;
        }

        // fallback: force logout only when not on ride
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("driverData");
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
            if (res.data.temp) {
                alert("Your session is about to expire. Please login again after this ride.");
            }

            return res.data.accessToken;
        }

        throw new Error("No access token");
    } catch (err) {
        console.log("Refresh token failed:", err);

        // // ❗ DO NOT LOGOUT IF DRIVER HAS ACTIVE RIDE
        // const hasActiveRide = await checkIfDriverInRide(); // create this function

        // if (hasActiveRide) {
        //     alert("Session expired, but ride still active. Continue the trip.");
        //     return null; // DO NOT LOGOUT
        // }

        // Normal behaviour after ride ends:
        const driverStr = await AsyncStorage.getItem("driverData");
        const driver = driverStr ? JSON.parse(driverStr) : null;
        await logout(driver?.id, "Session expired. Please login again.");

        return null;
    }
};



export const handleAddMoney = async (params) => {
    Alert.alert(
        "Confirm Payment",
        "Are you sure you want to proceed with this payment?",
        [
            { text: "Cancel", style: "cancel" },
            {
                text: "Proceed",
                onPress: async () => {
                    try {
                        // const accessToken = await AsyncStorage.getItem("accessToken");

                        const { data } = await axiosInstance.post(
                            `/session`,
                            {
                                // token: accessToken,
                                driverId: params?.id,
                                name: params?.name,
                                email: params?.email,
                                phone_number: params?.phone_number,
                            }
                        );

                        const url = `${process.env.EXPO_PUBLIC_PAYMENT_API_URI}/${data.sessionId}`;
                        Linking.openURL(url);
                    } catch (error) {
                        console.error("Failed to create session:", error);
                        Alert.alert(
                            "Error",
                            "Could not start the payment process. Please try again."
                        );
                    }
                },
            },
        ]
    );
};