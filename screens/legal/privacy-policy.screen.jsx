import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { fontSizes } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import FooterNote from "@/components/common/footer-note";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy() {
  return (
    <View style={styles.mainContainer}>
      {/* Removed explicit StatusBar call as requested. 
         Updated Gradient to use theme colors. 
      */}
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
            <Text style={styles.pageTitle}>Privacy Policy</Text>
          </View>

          {/* CONTENT CARD */}
          <View style={styles.contentCard}>
            <Section
              title="1. Introduction"
              content={`This Privacy Policy describes how Stark OPC Pvt. Ltd. (“Stark”) collects, uses, and protects driver information while using the Stark Driver App. By registering as a driver, you agree to the practices outlined below.`}
            />

            <Section
              title="2. Information We Collect"
              content={`We collect and process the following information to operate our platform efficiently:\n• Personal details: name, phone number, email, profile photo, and gender.\n• Identification and verification data: driver’s license, Aadhaar, vehicle registration, and insurance documents.\n• Financial details: wallet transactions, bank information (for payouts), and recharge history.\n• Location data: real-time location while online or during rides.\n• Device information: mobile device brand, OS, version, and unique identifiers.\n• Usage and activity logs: trips accepted, completed rides, and ratings.`}
            />

            <Section
              title="3. Purpose of Data Collection"
              content={`We use your information to:\n• Verify driver identity and eligibility.\n• Enable ride-matching, navigation, and fare calculation.\n• Manage driver wallet transactions, recharges, and commissions.\n• Communicate trip updates, policy changes, and support messages.\n• Ensure safety and compliance with transportation regulations.\n• Improve platform reliability, fraud detection, and performance analytics.`}
            />

            <Section
              title="4. Location Data Usage"
              content={`Location data is collected continuously while you are online and using the Stark Driver App. This allows the system to:\n• Match you with nearby ride requests.\n• Provide accurate pickup and drop-off navigation.\n• Track trips for rider safety and fare calculation.\n• Record trip logs for quality assurance and regulatory compliance.\nYou can disable location access, but doing so will make the app inoperable for accepting rides.`}
            />

            <Section
              title="5. Data Sharing & Disclosure"
              content={`We may share relevant information with:\n• Riders, to display your name, photo, vehicle number, and live location during trips.\n• Payment gateways, for wallet recharges and commission deductions.\n• Verification partners, for identity and document validation.\n• Law enforcement, only when legally required.\n• Internal support and operations teams to resolve service or payment issues.\nWe do not sell or rent your personal data under any circumstances.`}
            />

            <Section
              title="6. Wallet & Financial Data"
              content={`Your in-app wallet stores and manages transactions, including recharges, deductions, and earnings.\nPayment details are securely processed by certified third-party gateways using encryption. Stark does not store sensitive card or banking credentials directly on its servers.`}
            />

            <Section
              title="7. Data Retention"
              content={`We retain driver data for as long as the account remains active or as required by law for record-keeping and regulatory compliance. After deactivation or termination, certain information may be retained for dispute resolution or fraud prevention.`}
            />

            <Section
              title="8. Data Security"
              content={`We use advanced security practices, including encrypted transmission (SSL), restricted database access, and regular audits, to protect driver information. While we take all reasonable precautions, no online system can guarantee absolute security.`}
            />

            <Section
              title="9. Driver Rights"
              content={`As a driver, you have the right to:\n• Access and review your personal data.\n• Request correction of inaccurate or outdated information.\n• Request deletion of data (subject to legal retention requirements).\n• Withdraw consent for promotional or marketing communication.\nRequests can be submitted via the “Help & Support” section in the App.`}
            />

            <Section
              title="10. Compliance & Legal Obligations"
              content={`We comply with applicable data protection laws and government transportation regulations. In cases of misconduct, fraud, or violations, relevant data may be shared with law enforcement agencies to ensure public safety.`}
            />

            <Section
              title="11. Policy Updates"
              content={`We may update this Privacy Policy periodically to reflect changes in law, technology, or our operational model. Drivers will be notified via the App or official communication channels about major updates.`}
            />

            <Section
              title="12. Contact & Support"
              content={`For any questions or privacy-related requests, please contact our team through the “Help & Support” section of the App.`}
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
  pageTitle: { fontSize: fontSizes.FONT20, color: "#fff", fontFamily: "TT-Octosquares-Medium" },

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
    fontSize: fontSizes.FONT16,
    fontFamily: "TT-Octosquares-Medium",
    color: color.primaryText, 
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    fontSize: fontSizes.FONT14,
    lineHeight: 24,
    color: '#ccc',
    fontFamily: "TT-Octosquares-Medium",
    textAlign: 'justify',
  },
});