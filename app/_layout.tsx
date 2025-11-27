import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { router, Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import { LogBox, StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import React from "react";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import color from "@/themes/app.colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
export {ErrorBoundary} from "expo-router";


const MyDarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: color.subPrimary, // Global background
    card: color.subPrimary,
    text: color.primaryText,
    border: color.border,
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
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
      shouldShowBanner: true,   // 👈 replaces shouldShowAlert
      shouldShowList: true,     // 👈 optional: show in notification center
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

  if (!loaded && !error) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep link received:", url);

      const parsed = Linking.parse(url);

      console.log(parsed)

      if (parsed.path === "wallet-success" || parsed.path === "wallet-failed" || parsed.path === "wallet-cancelled" || parsed.queryParams?.walletUpdated) {
        // ✅ Refresh wallet or navigate to profile
        router.replace("/(tabs)/profile");
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeProvider value={MyDarkTheme}>
      <View style={styles.container}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Animated.View style={{ flex: 1 }}>

            <ToastProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
              </Stack>
            </ToastProvider>
          </Animated.View>

        </GestureHandlerRootView>

      </View>
    </ThemeProvider>


  );


}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Makes entire app black
  },
});