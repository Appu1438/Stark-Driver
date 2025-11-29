import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import MapView, { MapMarker, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import color from "@/themes/app.colors";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import { customMapStyle } from "@/utils/map/mapStyle";
import Images from "@/utils/images";

export default function AddressDetails() {
  const params = useLocalSearchParams();
  const { address, city, country } = params;

  const zipcodeMatch = address ? address.match(/\b\d{6}\b/) : null;
  const zipcode = zipcodeMatch ? zipcodeMatch[0] : null;

  const [region, setRegion] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    if (!zipcode) return; // Skip if no zipcode

    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY;

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode},${country}&key=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setRegion({
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      })
      .catch((err) => console.log("Geocoding error:", err));
  }, [zipcode, country]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Address Details</Text>

      {/* Map */}
      <MapView
        style={styles.map}
        region={region}
        customMapStyle={customMapStyle}
        provider={PROVIDER_GOOGLE}
      >
        <Marker
          coordinate={region}
          title={city || "Location"}
          description={address}
        >
          <Image
            source={Images.mapPickupMarker}
            style={{
              width: windowWidth(35),
              height: windowHeight(35),
              tintColor: color.primaryGray, // subtle gray tone
            }}
            resizeMode="contain"
          />
        </Marker>
      </MapView>

      {/* Address Info */}
      <View style={styles.card}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Street</Text>
          <Text style={styles.value}>{address || "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>City</Text>
          <Text style={styles.value}>{city || "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Country</Text>
          <Text style={styles.value}>{country || "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Zip Code</Text>
          <Text style={styles.value}>{zipcode || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Ensure your address is correct. You can update the address by contacting support.
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
  map: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
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
