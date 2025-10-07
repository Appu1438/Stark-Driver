import axiosInstance from "@/api/axiosInstance";
import { Wallet } from "@/utils/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";

export const useGetDriverData = () => {
  const [driver, setDriver] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLoggedInDriverData = async () => {
      await axiosInstance
        .get(`/driver/me`)
        .then(async (res) => {
          // console.log(res.data.driver)
          setDriver(res.data.driver);
          console.log('hook',res.data.driver)
          await AsyncStorage.setItem("driverData", JSON.stringify(res.data.driver));
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    };
    getLoggedInDriverData();
  }, []);

  return { loading, driver };
};
export const useGetDriverWallet = () => {
  const [wallet, setWallet] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLoggedInDriverWallet = async () => {
      await axiosInstance
        .get(`/driver/wallet`)
        .then((res) => {
          // console.log(res.data.driver)
          setWallet(res.data.wallet);
          // console.log(res.data.wallet)
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    };
    getLoggedInDriverWallet();
  }, []);

  return { loading, wallet };
};

export const useGetDriverRideHistories = () => {
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecentRides = async () => {
      try {
        const res = await axiosInstance
          .get(`/driver/get-rides`);
        setRecentRides(res.data.rides || []);
      } catch (error) {
        console.error("Failed to fetch driver rides:", error);
        setRecentRides([]); // fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    getRecentRides();
  }, []);

  const ridesReversed = [...recentRides].reverse();

  return { loading, recentRides: ridesReversed };
};
