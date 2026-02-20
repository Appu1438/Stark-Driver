import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { router, Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import { AppState, AppStateStatus, LogBox, StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import React from "react";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import color from "@/themes/app.colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import driverSocketService from "@/utils/socket/socketService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

export { ErrorBoundary } from "expo-router";

const MyDarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.subPrimary,
    card: color.subPrimary,
    text: color.primaryText,
    border: color.border,
  },
};

SplashScreen.setOptions({
  duration: 2000,
  fade: true,
});
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "TT-Octosquares-Medium": require("../assets/fonts/TT-Octosquares-Medium.ttf"),
  });

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  /**
   * ✅ CONNECT SOCKET ONCE (APP LIFETIME)
   */
  /**
   * ✅ CONNECT SOCKET ONCE (APP LIFETIME)
   */
  useEffect(() => {
    driverSocketService.connect();
  }, []);

  /**
   * ✅ RECONNECT WHEN APP COMES TO FOREGROUND
   */
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        console.log("📱 AppState:", state);
        if (state === "active") {
          console.log("🔁 App active → reconnect socket");
          driverSocketService.connect();
        }
      }
    );

    return () => subscription.remove();
  }, []);

  /**
   * ✅ IDENTIFY DRIVER AFTER SOCKET IS CONNECTED
   */
  useEffect(() => {
    const identifyDriver = async () => {
      const stored = await AsyncStorage.getItem("driverData");
      if (!stored) return;

      const driverData = JSON.parse(stored);
      if (!driverData?.id) return;

      console.log("🆔 [APP] identifying driver:", driverData.id);

      driverSocketService.send({
        type: "identify",
        role: "driver",
        driver: driverData.id,
      });
    };

    // 🔥 ONLY identify AFTER socket opens
    const unsubscribe = driverSocketService.onConnected(() => {
      identifyDriver();
    });

    return () => {
      unsubscribe?.();
    };
  }, []);


  if (!loaded && !error) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}


function MainApp() {
  const insets = useSafeAreaInsets();

  return (
    <ThemeProvider value={MyDarkTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Animated.View
            style={{
              flex: 1,
              paddingBottom: insets.bottom   // 🔥 GLOBAL FIX
            }}>
            <ToastProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
              </Stack>
            </ToastProvider>
          </Animated.View>
        </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
