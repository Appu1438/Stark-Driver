import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { fontSizes } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import FooterNote from "@/components/common/footer-note";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LocationInfo() {
  return (
    <View style={styles.mainContainer}>
      <LinearGradient 
        colors={[color.bgDark, color.subPrimary]} 
        style={StyleSheet.absoluteFill} 
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Location Information</Text>
          </View>

          {/* CONTENT CARD */}
          <View style={styles.contentCard}>
            <Section
              title="1. Purpose of Location Access"
              content={`The Stark Driver App requires access to your location to provide accurate and reliable ride services. Location data is essential for matching you with nearby riders, calculating routes and fares, ensuring safety, and maintaining transparency during each trip.`}
            />

            <Section
              title="2. When Location is Collected"
              content={`Your location is collected in the following circumstances:\n• When you are **online and available** to receive ride requests.\n• When you **accept a ride**, to navigate to the pickup point and drop-off location.\n• When the trip is **in progress**, for accurate route tracking and fare calculation.\n• When the app is in the **background** (if permission is granted), to ensure continuous trip tracking and rider safety.`}
            />

            <Section
              title="3. How Location Data is Used"
              content={`Location data helps us:\n• Match you with the nearest riders efficiently.\n• Provide real-time navigation and trip tracking.\n• Calculate accurate fares and generate receipts.\n• Enhance safety by allowing riders and support teams to track active trips.\n• Improve operational analytics and detect fraudulent activity.`}
            />

            <Section
              title="4. Background Location Use"
              content={`The Stark Driver App may access your location even when running in the background, but only during active or ongoing trips. This ensures uninterrupted trip monitoring, live tracking for riders, and accurate distance-based fare calculations.\nYour background location is **never** used for marketing or unrelated purposes.`}
            />

            <Section
              title="5. Location Sharing"
              content={`Your live location may be shared with:\n• Riders — to display your approach to the pickup point and during the ride.\n• Stark’s support and safety teams — for live monitoring, route accuracy, and dispute resolution.\n• Law enforcement — only when required by law or safety investigations.`}
            />

            <Section
              title="6. Data Storage & Security"
              content={`Your real-time location is transmitted securely using encryption and stored temporarily for trip operations, fare computation, and quality audits.\nAfter ride completion, only generalized route data is retained for reporting, compliance, and analytics.`}
            />

            <Section
              title="7. Control Over Permissions"
              content={`You can manage location permissions through your device settings:\n• Allow access “While Using the App” — for standard ride functionality.\n• Allow access “All the Time” — to enable background tracking for ongoing trips.\nIf location access is denied, the app will not be able to connect you with riders or start rides.`}
            />

            <Section
              title="8. Compliance with App Store & Legal Guidelines"
              content={`We comply with Google Play’s and Apple’s location data policies, as well as applicable data protection laws.\nWe collect only the minimum required location data necessary for ride functionality, safety, and legal compliance.`}
            />

            <Section
              title="9. Data Retention"
              content={`Precise location data is retained only for active rides and necessary operational use.\nHistorical ride paths may be anonymized and stored for reporting, performance metrics, and safety analytics.`}
            />

            <Section
              title="10. Contact & Support"
              content={`If you have questions or concerns regarding how your location data is used, please contact our privacy and safety team through the “Help & Support” section in the Stark Driver App.`}
            />
          </View>

          <FooterNote />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ---------- SECTION COMPONENT ---------- */
const Section = ({ title, content }) => (
  <View style={styles.sectionContainer}>
    {/* Using primaryText for title as requested */}
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: color.bgDark },
  scrollContent: { padding: 20, paddingBottom: 50 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, gap: 15 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  pageTitle: { fontSize: 24, color: "#fff", fontFamily: "TT-Octosquares-Medium" },

  // Content Card
  contentCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 30,
  },

  // Section Styles
  sectionContainer: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "TT-Octosquares-Medium",
    color: color.primaryText, // Set to primaryText
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 24,
    color: '#ccc',
    fontFamily: "TT-Octosquares-Medium",
    textAlign: 'justify',
    opacity: 0.9,
  },
});