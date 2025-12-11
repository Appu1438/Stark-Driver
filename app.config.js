import 'dotenv/config';

export default {
  expo: {
    name: "Stark Driver",
    slug: "stark-driver",
    version: "1.0.0",
    orientation: "portrait",
    experiments: { typedRoutes: true },
    scheme: "stark-driver",
    userInterfaceStyle: "light",

    plugins: [
      [
        "expo-splash-screen",
        {
          backgroundColor: "#000000",
          image: "./assets/images/logo/FullLogo.png",
          dark: {
            image: "./assets/images/logo/FullLogo.png",
            backgroundColor: "#000000"
          },
          imageWidth: 250
        }
      ],
      [
        "expo-font",
        {
          fonts: ["./assets/fonts/TT-Octosquares-Medium.ttf"]
        }
      ],
      "expo-router"
    ],

    android: {
      package: "com.adithyanskumar.starkdriver",
      versionCode: 1,
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "NOTIFICATIONS"
      ],
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY
        }
      }
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.adithyanskumar.starkdriver",
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },

    extra: {
      eas: {
        projectId: "b2519774-9cf7-484b-81b1-4c488f2c3356"
      }
    }
  }
};
