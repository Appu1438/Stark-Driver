import axiosInstance from "@/api/axiosInstance";
import { Wallet } from "@/utils/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";

export const useGetDriverData = () => {
  const [driver, setDriver] = useState();
  const [loading, setLoading] = useState(true);

  const getLoggedInDriverData = async () => {
    await axiosInstance
      .get(`/driver/me`)
      .then(async (res) => {
        // console.log(res.data.driver)
        setDriver(res.data.driver);
        console.log('hook', res.data.driver)
        await AsyncStorage.setItem("driverData", JSON.stringify(res.data.driver));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      })

  };
  useEffect(() => {
    getLoggedInDriverData();
  }, []);

  return { loading, driver, refetchData: getLoggedInDriverData };
};
export const useGetDriverWallet = () => {
  const [wallet, setWallet] = useState();
  const [loading, setLoading] = useState(true);

  const getLoggedInDriverWallet = async () => {
    await axiosInstance
      .get(`/driver/wallet`)
      .then((res) => {
        // console.log(res.data.driver)
        setWallet(res.data.wallet);
        // console.log(res.data.wallet)
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      })
  };
  useEffect(() => {
    getLoggedInDriverWallet();
  }, []);

  return { loading, wallet, refetchWallet: getLoggedInDriverWallet };
};

export const useGetDriverRideHistories = () => {
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRides = async () => {
    try {
      const res = await axiosInstance.get("/driver/get-rides");
      setRecentRides(res.data.rides || []);
    } catch (error) {
      console.log("Failed to fetch rides:", error);
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return { loading, recentRides: [...recentRides].reverse(), refetchRides: fetchRides };
};


export const useDriverEarnings = (period = "daily") => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEarnings = async () => {
    try {
      const res = await axiosInstance.get(`/driver/earnings?period=${period}`);
      console.log(res.data)
      setEarnings(res.data);
    } catch (err) {
      console.error("Failed to fetch earnings:", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [period]);

  return { earnings, loading, refetchEarnings: fetchEarnings };
};
