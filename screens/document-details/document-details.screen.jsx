import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import color from "@/themes/app.colors";
import { fontSizes, windowHeight } from "@/themes/app.constant";

export default function DocumentDetails() {
  const params = useLocalSearchParams();
  const { driving_license, license_expiry, insurance_number, insurance_expiry } =
    params;

  // Check expiries
  const isLicenseExpired =
    license_expiry && new Date(license_expiry) < new Date();
  const isInsuranceExpired =
    insurance_expiry && new Date(insurance_expiry) < new Date();

  const details = [
    { label: "License Number", value: driving_license },
    {
      label: "License Expiry",
      value: license_expiry
        ? new Date(license_expiry).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "N/A",
      expired: isLicenseExpired,
    },
    { label: "Insurance Number", value: insurance_number },
    {
      label: "Insurance Expiry",
      value: insurance_expiry
        ? new Date(insurance_expiry).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "N/A",
      expired: isInsuranceExpired,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Document Details</Text>

      <View style={styles.card}>
        {details.map((item, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  styles.value,
                  item.expired && { color: "red" }, // turn date red if expired
                ]}
              >
                {item.value || "N/A"}
              </Text>
              {item.expired && (
                <Text style={styles.expiredText}>(Expired)</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Your documents are securely stored and verified. If your documents are
          expiring soon, please update them with the support team.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: windowHeight(50),
  },
  title: {
    fontSize: fontSizes.FONT22,
    fontFamily: "TT-Octosquares-Medium",
    marginVertical: 20,
    textAlign: "center",
    color: color.primary,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  detailRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: fontSizes.FONT14,
    color: "#666",
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 5,
  },
  value: {
    fontSize: fontSizes.FONT16,
    color: "#222",
    fontFamily: "TT-Octosquares-Medium",
  },
  expiredText: {
    color: "red",
    fontSize: fontSizes.FONT14,
    marginLeft: 8,
    fontFamily: "TT-Octosquares-Medium",
  },
  infoBox: {
    backgroundColor: "#eef6ff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: color.primary,
  },
  infoText: {
    fontSize: fontSizes.FONT14,
    color: "#444",
    lineHeight: 20,
    fontFamily: "TT-Octosquares-Medium",
  },
});
