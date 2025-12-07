import React from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import color from "@/themes/app.colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DocumentDetails() {
  const params = useLocalSearchParams();
  const { driving_license, license_expiry, insurance_number, insurance_expiry } = params;

  // Check expiries
  const isLicenseExpired = license_expiry && new Date(license_expiry) < new Date();
  const isInsuranceExpired = insurance_expiry && new Date(insurance_expiry) < new Date();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --- REUSABLE COMPONENT: DOCUMENT CARD ---
  const DocumentCard = ({ title, number, expiry, isExpired, icon, type }) => (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: type === 'license' ? 'rgba(74, 144, 226, 0.1)' : 'rgba(0, 230, 118, 0.1)' }]}>
          {icon}
        </View>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>Verified Document</Text>
        </View>
        <MaterialCommunityIcons name="check-decagram" size={20} color={color.primaryText} style={{ marginLeft: 'auto' }} />
      </View>

      <View style={styles.divider} />

      {/* Document Number */}
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Document Number</Text>
          <Text style={styles.value}>{number || "N/A"}</Text>
        </View>
        <Ionicons name="copy-outline" size={16} color="#666" />
      </View>

      {/* Expiry Section */}
      <View style={[styles.row, { marginTop: 15, borderBottomWidth: 0 }]}>
        <View>
          <Text style={styles.label}>Valid Until</Text>
          <Text style={[styles.value, isExpired && { color: '#FF5252' }]}>
            {formatDate(expiry)}
          </Text>
        </View>

        {/* Status Badge */}
        <View style={[styles.statusBadge, isExpired ? styles.badgeExpired : styles.badgeActive]}>
          <Text style={[styles.statusText, isExpired ? styles.textExpired : styles.textActive]}>
            {isExpired ? "EXPIRED" : "ACTIVE"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={[color.bgDark, color.subPrimary]} style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.pageTitle}>Documents</Text>
              <Text style={styles.pageSubtitle}>Manage your legal documents</Text>
            </View>
          </View>

          {/* LICENSE CARD */}
          <DocumentCard
            title="Driving License"
            type="license"
            number={driving_license}
            expiry={license_expiry}
            isExpired={isLicenseExpired}
            icon={<FontAwesome5 name="id-card" size={18} color="#4A90E2" />}
          />

          {/* INSURANCE CARD */}
          <DocumentCard
            title="Vehicle Insurance"
            type="insurance"
            number={insurance_number}
            expiry={insurance_expiry}
            isExpired={isInsuranceExpired}
            icon={<Ionicons name="shield-checkmark" size={20} color="#00E676" />}
          />

          {/* SECURITY FOOTER */}
          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="lock-check" size={24} color={color.primaryText} />
            <Text style={styles.infoText}>
              Your documents are encrypted and securely stored.
              {(isLicenseExpired || isInsuranceExpired) &&
                <Text style={{ color: '#FF5252' }}> Please renew expired documents immediately to continue driving.</Text>
              }
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#050505",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "TT-Octosquares-Medium",
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#888",
    fontFamily: "TT-Octosquares-Medium",
  },

  // Document Card
  card: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "TT-Octosquares-Medium",
  },
  cardSubtitle: {
    fontSize: 11,
    color: "#666",
    fontFamily: "TT-Octosquares-Medium",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 15,
  },

  // Row Content
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: "#e0e0e0",
    fontFamily: "TT-Octosquares-Medium",
    letterSpacing: 0.5,
  },

  // Badges
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeActive: {
    backgroundColor: "rgba(0, 230, 118, 0.1)",
    borderColor: "rgba(0, 230, 118, 0.3)",
  },
  badgeExpired: {
    backgroundColor: "rgba(255, 82, 82, 0.1)",
    borderColor: "rgba(255, 82, 82, 0.3)",
  },
  statusText: {
    fontSize: 10,
    fontFamily: "TT-Octosquares-Medium",
  },
  textActive: { color: "#00E676" },
  textExpired: { color: "#FF5252" },

  // Footer
  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 224, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 224, 255, 0.15)",
    alignItems: "flex-start",
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#ccc",
    lineHeight: 18,
    fontFamily: "TT-Octosquares-Medium",
  },
});