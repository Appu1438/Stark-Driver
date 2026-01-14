import { Home } from "@/assets/icons/home";
import { HomeLight } from "@/assets/icons/homeLight";
import { Person } from "@/assets/icons/person";
import { History } from "@/assets/icons/history";
import color from "@/themes/app.colors";
import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Map } from "@/assets/icons/map";
import { MapLight } from "@/assets/icons/mapLight";
import { useTripRadar } from "@/store/useTripRadar";
import { View, Text } from "react-native";
import { Navigation } from "@/assets/icons/navigation";
import { NavigationLight } from "@/assets/icons/navigationLight";
import { useDriverLocationStore } from "@/store/driverLocationStore";
import driverSocketService from "@/utils/socket/socketService";

export default function _layout() {
  const { requests, addRequest } = useTripRadar();   // <-- you already have this

  const locationRef = useRef(null);

  // 🔁 keep latest location from store
  const { currentLocation } = useDriverLocationStore();
  useEffect(() => {
    locationRef.current = currentLocation;
  }, [currentLocation]);

  // 🔔 GLOBAL SOCKET LISTENER (ONCE)
  useEffect(() => {
    const unsubscribe = driverSocketService.onMessage((msg) => {
      if (msg.type === "rideRequest") {
        console.log("🚕 [GLOBAL] Ride request received");
        addRequest(msg.rideRequest, locationRef.current);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Tabs
      screenOptions={({ route }) => {
        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {

            // ⭐ JSX that will be returned
            let iconName;

            // HOME
            if (route.name === "home") {
              iconName = focused ? (
                <Home colors={color.buttonBg} width={24} height={24} />
              ) : (
                <HomeLight />
              );
            }

            // ⭐ TRIP RADAR WITH BADGE
            else if (route.name === "trip-radar/index") {
              const Icon = focused ? (
                <Map fill={color.buttonBg} />
              ) : (
                <MapLight fill={"#8F8F8F"} />
              );

              return (
                <View style={{ position: "relative" }}>
                  {Icon}

                  {/* 🔥 Badge */}
                  {requests.length > 0 && (
                    <View
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -10,
                        backgroundColor: "red",
                        borderRadius: 10,
                        paddingHorizontal: 5,
                        minWidth: 18,
                        height: 18,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 11,
                          fontWeight: "bold",
                        }}
                      >
                        {requests.length}
                      </Text>
                    </View>
                  )}
                </View>
              );
            }

            // // NAVIGATION TAB
            // else if (route.name === "navigation/index") {
            //   iconName = focused ? (
            //     <Navigation fill={color.buttonBg} width={24} height={24} />
            //   ) : (
            //     <NavigationLight stroke={"#8F8F8F"} width={24} height={24} />
            //   );
            // }


            // RIDES
            else if (route.name === "rides/index") {
              iconName = focused ? (
                <History color={color.buttonBg} />
              ) : (
                <History color={"#8F8F8F"} />
              );
            }

            // PROFILE
            else if (route.name === "profile/index") {
              iconName = focused ? (
                <Person fill={color.buttonBg} />
              ) : (
                <Person fill={"#8F8F8F"} />
              );
            }

            return iconName;
          },
        };
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="trip-radar/index" />
      {/* <Tabs.Screen name="navigation/index" /> */}
      <Tabs.Screen name="rides/index" />
      <Tabs.Screen name="profile/index" />
    </Tabs>
  );
}
