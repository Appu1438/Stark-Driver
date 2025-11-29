import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import color from "@/themes/app.colors";
import { fontSizes, windowHeight } from "@/themes/app.constant";
import axiosInstance from "@/api/axiosInstance";
import { useDriverLocationStore } from "@/store/driverLocationStore";

// ---------------------------------------------
// ⭐ SHIMMER SKELETON COMPONENT
// ---------------------------------------------
const Skeleton = ({ width, height, style }) => {
  const shimmer = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 300], // left to right shimmer
  });

  return (
    <View
      style={[
        {
          backgroundColor: "#2A2A2A",
          overflow: "hidden",
          borderRadius: 6,
        },
        width && { width },
        height && { height },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: 150,
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.15)",
          transform: [{ translateX }],
        }}
      />
    </View>
  );
};

// ---------------------------------------------
// ⭐ FARE DETAILS COMPONENT
// ---------------------------------------------
export default function FareDetails() {
  const params = useLocalSearchParams();
  const vehicleType = params.vehicle_type;

  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(true);

  const { district } = useDriverLocationStore();

  useEffect(() => {
    const fetchFare = async () => {
      console.log('fare', district)
      try {
        setLoading(true);

        const res = await axiosInstance.get(`/fare/${vehicleType}/${district}`);
        if (res.data.success) {
          setFare(res.data.fare);
        } else {
          console.warn("Fare fetch unsuccessful");
        }
      } catch (error) {
        console.error("Error fetching fare details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (vehicleType) fetchFare();
  }, [vehicleType]);

  // ---------------------------------------------
  // ⭐ LOADING SKELETON UI
  // ---------------------------------------------
  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <Skeleton
          width="60%"
          height={25}
          style={{ alignSelf: "center", marginBottom: 20 }}
        />

        <View style={styles.card}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={{ marginBottom: 20 }}>
              <Skeleton width="50%" height={16} style={{ marginBottom: 10 }} />
              <Skeleton width="40%" height={20} />
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Skeleton width="80%" height={14} style={{ marginBottom: 12 }} />
          <Skeleton width="90%" height={14} style={{ marginBottom: 12 }} />
          <Skeleton width="70%" height={14} />
        </View>
      </ScrollView>
    );
  }

  // ---------------------------------------------
  // ⭐ NO DATA FOUND
  // ---------------------------------------------
  if (!fare) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>No fare details available.</Text>
      </View>
    );
  }

  const details = [
    { label: "Base Fare", value: `₹${fare.baseFare}` },
    { label: "Per Km Rate", value: `₹${fare.perKmRate}` },
    { label: "Per Minute Rate", value: `₹${fare.perMinRate}` },
    { label: "Minimum Fare", value: `₹${fare.minFare}` },
  ];

  // ---------------------------------------------
  // ⭐ MAIN FARE UI
  // ---------------------------------------------
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fare Details</Text>

      <View style={styles.card}>
        {details.map((item, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          These fares are calculated based on your vehicle type and may vary
          depending on the time of day and current demand. The base fare is
          applied at the start of each ride, while per kilometer and per minute
          rates are added dynamically. Minimum fares ensure fair compensation
          for drivers during all trips.
        </Text>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------
// ⭐ STYLES
// ---------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: windowHeight(50),
  },
  title: {
    fontSize: fontSizes.FONT22,
    fontFamily: "TT-Octosquares-Medium",
    marginVertical: 20,
    textAlign: "center",
    color: color.primaryText,
  },
  card: {
    backgroundColor: color.subPrimary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderColor: color.border,
    borderWidth: 2,
    elevation: 3,
  },
  detailRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: fontSizes.FONT14,
    color: color.primaryText,
    marginBottom: 5,
    fontFamily: "TT-Octosquares-Medium",
  },
  value: {
    fontSize: fontSizes.FONT16,
    color: color.lightGray,
    fontFamily: "TT-Octosquares-Medium",
  },
  infoBox: {
    backgroundColor: color.subPrimary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: color.lightGray,
    borderColor: color.border,
    borderWidth: 1
  },
  infoText: {
    fontSize: fontSizes.FONT14,
    color: color.primaryText,
    lineHeight: 20,
    fontFamily: "TT-Octosquares-Medium",
  },
});
