import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout, refreshAccessToken } from "./apis";
import { getDeviceInfo } from "@/utils/device/deviceInfo";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URI,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false; // flag to indicate refresh is in progress
let failedQueue = []; // queue for requests that fail during refresh

const processQueue = (error, token) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      if (token && prom.config) {
        prom.config.headers["Authorization"] = `Bearer ${token}`;
        axiosInstance(prom.config).then(prom.resolve).catch(prom.reject);
      }
    }
  });
  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const deviceInfo = await getDeviceInfo();
    if (deviceInfo) {
      config.headers["x-device-info"] = JSON.stringify(deviceInfo);
    }

    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  } catch (err) {
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

    // ✅ Device mismatch
    if (error.response?.status === 460 || error.response?.status === 470) {
      await logout(driver?.id, error.response.data.message);
      return Promise.reject(error);
    }

    // ✅ Token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // await AsyncStorage.setItem("accessToken", newAccessToken);

        processQueue(null, newAccessToken); // retry all queued requests

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null); // reject all queued requests
        await logout(driver?.id, "Please login again. Thank You!");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
