import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { Linking } from "react-native";

export default function Index() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // flag to check if the component is mounted
    console.log(process.env.EXPO_PUBLIC_API_URI)
    console.log(process.env.EXPO_PUBLIC_PAYMENT_API_URI)
    console.log(process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY)
    console.log(process.env.EXPO_PUBLIC_SOCKET_URL)


    const getData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (isMounted) {
          setisLoggedIn(!!accessToken);
        }
      } catch (error) {
        console.log("Failed to retrieve access token from async storage", error);
      } finally {
        if (isMounted) {
          setisLoading(false);
        }
      }
    };

    getData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Redirect href={!isLoggedIn ? "/(routes)/login" : "/(tabs)/home"} />
  );
}