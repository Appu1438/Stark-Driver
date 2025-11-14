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
    console.log(driverId, message)
    try {

        driverSocketService.sendLocationUpdate(driverId, {
            latitude: null,
            longitude: null,
        });


        // 2️⃣ Logout from backend
        await axiosInstance.post("/driver/logout", { driverId }, { withCredentials: true });

        // 3️⃣ Clear stored token
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("driverData");

        // Toast.show(message, { type: "success" });
        // 4️⃣ Navigate to login and replace stack
        router.replace("/(routes)/login");

    } catch (error) {
        console.log("Logout failed:", error.message);
        // Toast.show(message, { type: "success" });

        // // Force clear token and navigate even if request fails
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
        const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/driver/refresh-token`, {}, { withCredentials: true });

        if (res.data?.accessToken) {
            await AsyncStorage.setItem("accessToken", res.data.accessToken);

            return res.data.accessToken;
        }
        throw new Error("No access token returned");
    } catch (error) {
        console.log("Refresh token failed:", error);
        // If refresh fails, force logout
        const driverStr = await AsyncStorage.getItem("driverData");
        const driver = driverStr ? JSON.parse(driverStr) : null;
        await logout(driver.id, "Please login again. Thank You!");
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