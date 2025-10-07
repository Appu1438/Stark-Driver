import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout, refreshAccessToken } from "./apis";
import { getDeviceInfo } from "@/utils/device/deviceInfo"

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URI,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  try {

    const deviceInfo = await getDeviceInfo();
    if (deviceInfo) {
      console.log('Device Info', deviceInfo)
      config.headers["x-device-info"] = JSON.stringify(deviceInfo);
    }

    // Only read token if not retrying
    if (!config._retry) {
      console.log('Req with storage token')
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      } else {
        console.log("Request without token");
      }
    } else {
      // Add other custom headers
      console.log('Req with new Token')
      config.headers["X-Custom-Header"] = "customHeaderValue";

    }


    return config;
  } catch (err) {
    console.error("Request interceptor error:", err);
    return config;
  }
});


// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {

    const driverStr = await AsyncStorage.getItem("driverData");
    const driver = driverStr ? JSON.parse(driverStr) : null;
    const originalRequest = error.config;

    // ✅ Device mismatch detected
    if (error.response?.status === 460) {
      console.log("Device mismatch detected. Logging out...");

      console.log('instance', driver)

      await logout(driver.id, "You are logged in on a different device. Please try again.");


      return Promise.reject(error);
    }


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Attempting token refresh...");

        const newAccessToken = await refreshAccessToken();

        // if (!newAccessToken) throw new Error("No new access token");

        console.log('New  ', newAccessToken)
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the request manually
        return axiosInstance(originalRequest);
      } catch (err) {
        await logout(driver.id, "Please login again. Thank You!");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
