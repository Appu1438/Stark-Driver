import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { fontSizes } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import FooterNote from "@/components/common/footer-note";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppUsagePolicy() {
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
            <Text style={styles.pageTitle}>App Usage Policy</Text>
          </View>

          {/* CONTENT CARD */}
          <View style={styles.contentCard}>
            <Section
              title="1. Purpose of This Policy"
              content={`This App Usage Policy outlines the professional and responsible use of the Stark Driver App. All drivers are expected to adhere to these guidelines to ensure safe, lawful, and fair operations on the platform.`}
            />

            <Section
              title="2. Account Responsibility"
              content={`Your driver account is personal and linked to verified documents and your registered vehicle.\nYou must not share your account or login credentials with others.\nAny unauthorized use, impersonation, or account sharing will result in immediate suspension or deactivation.`}
            />

            <Section
              title="3. OTP Verification & Ride Start"
              content={`Every trip must start only after verifying the One-Time Password (OTP) provided by the rider.\nDrivers must follow these rules strictly:\n• Do not begin a ride until the OTP is entered and verified in the app.\n• Never request the OTP before arriving at the rider’s pickup point.\n• If a rider refuses to share or enters the wrong OTP, contact support before proceeding.\n• Starting trips without OTP confirmation or off-app rides is strictly prohibited.`}
            />

            <Section
              title="4. Ride Cancellations & Off-App Deals"
              content={`Drivers are not allowed to ask riders to cancel rides for off-app deals or direct payments.\nViolations include:\n• Requesting riders to cancel and pay cash directly.\n• Accepting or completing rides outside the Stark App.\n• Cancelling frequently to manipulate trip assignments or avoid short rides.\nSuch activities lead to account penalties or permanent deactivation.`}
            />

            <Section
              title="5. Fair and Honest Usage"
              content={`Drivers must operate honestly and maintain platform integrity.\nThe following activities are forbidden:\n• Using fake GPS, emulators, or manipulated devices.\n• Creating false ride requests or self-booking trips.\n• Manipulating distance, time, or fare through unauthorized apps.\n• Refusing rides based on rider identity or location (except for safety concerns).`}
            />

            <Section
              title="6. Device & Network Requirements"
              content={`For smooth performance:\n• Keep the Stark Driver App updated.\n• Ensure stable mobile network and GPS connection.\n• Avoid using rooted, jailbroken, or modified devices.\n• Enable required permissions such as Location and Notification for real-time operations.`}
            />

            <Section
              title="7. Trip Conduct & Professionalism"
              content={`As a representative of the Stark platform, maintain professional behavior at all times:\n• Greet riders politely and follow the route displayed in the app.\n• Never use abusive language or behave inappropriately.\n• Avoid smoking, drinking, or using prohibited substances while online.\n• Follow all traffic rules and safety standards.`}
            />

            <Section
              title="8. Misuse & Fraudulent Activities"
              content={`Any misuse of the Stark Driver App — including system manipulation, false ratings, or fraudulent activities — will result in strict penalties.\nSuch cases may be escalated to law enforcement if necessary.`}
            />

            <Section
              title="9. Policy Violations & Consequences"
              content={`Violation of this App Usage Policy may result in:\n• Temporary suspension of your account.\n• Permanent deactivation for repeated offenses.\n• Deduction of pending payments in case of proven fraud or misconduct.\nStark reserves the right to investigate and act upon any reported violation.`}
            />

            <Section
              title="10. Reporting & Support"
              content={`If you face technical issues, rider misconduct, or safety-related incidents, immediately report through the “Help & Support” section in the app.\nOur team will review and respond promptly.`}
            />

            <Section
              title="11. Policy Updates"
              content={`Stark may revise this App Usage Policy from time to time to comply with new regulations or improve operational safety.\nContinued use of the Driver App after updates indicates acceptance of the revised policy.`}
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
    fontSize: fontSizes.FONT18,
    fontFamily: "TT-Octosquares-Medium",
    color: color.primaryText,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: fontSizes.FONT14,
    lineHeight: 24,
    color: '#ccc',
    fontFamily: "TT-Octosquares-Medium",
    textAlign: 'justify',
    opacity: 0.9,
  },
});