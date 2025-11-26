import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import color from "@/themes/app.colors";
import { fontSizes, windowHeight } from "@/themes/app.constant";
import axiosInstance from "@/api/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDriverLocationStore } from "@/store/driverLocationStore";

export default function FareDetails() {
  const params = useLocalSearchParams();
  const vehicleType = params.vehicle_type; // Pass vehicle type from previous page

  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(true);

  const { district } = useDriverLocationStore();


  useEffect(() => {
    const fetchFare = async () => {
      try {
        // const district = await AsyncStorage.getItem("currentDistrict");
        console.log('fare',district)

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

    if (vehicleType) {
      fetchFare();
    }
  }, [vehicleType]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  if (!fare) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
          These fares are calculated based on your vehicle type and may vary depending on the time of day and current demand. The base fare is applied at the start of each ride, while per kilometer and per minute rates are added dynamically. Minimum fares ensure fair compensation for drivers during all trips.
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f9f9f9",
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
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderColor: color.border,
    borderWidth: 2
  },
  detailRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: fontSizes.FONT14,
    color: color.primaryText,
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 5,
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
    borderColor: color.lightGray,
    borderBottomWidth: .5
  },
  infoText: {
    fontSize: fontSizes.FONT14,
    color: color.primaryText,
    lineHeight: 20,
    fontFamily: "TT-Octosquares-Medium",
  },
});
