import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import React from "react";
import { fontSizes } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import FooterNote from "@/components/common/footer-note";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafetyGuidelines() {
  return (
    <View style={styles.mainContainer}>
      <LinearGradient colors={[color.bgDark, color.subPrimary]} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Safety Guidelines</Text>
          </View>

          {/* CONTENT CARD */}
          <View style={styles.contentCard}>
            <Section

              title="1. Our Commitment to Safety"

              content={`Stark is committed to providing a safe and secure environment for both drivers and riders. Every trip is monitored using advanced safety tools, and we expect all drivers to strictly follow platform and traffic safety standards.`}

            />



            <Section

              title="2. Driver Verification & Compliance"

              content={`Every driver undergoes a comprehensive verification process, including document checks, background screening, and vehicle inspection.  

You must keep your documents updated at all times (License, RC, Insurance, and ID proofs). Any expired or invalid documents may lead to temporary suspension.`}

            />



            <Section

              title="3. Safe Driving Practices"

              content={`• Follow all local traffic laws and signals.  

• Never use your mobile phone while driving (except for in-app navigation).  

• Keep both hands on the steering wheel and maintain a safe speed.  

• Always wear your seatbelt and ensure passengers do too.  

• Avoid aggressive driving, honking excessively, or taking unsafe shortcuts.`}

            />



            <Section

              title="4. Rider Verification & Pickup Safety"

              content={`Before starting a trip:  

• Confirm the rider’s name and destination as displayed in the app.  

• Start the ride **only after verifying the rider’s OTP** in the app.  

• Politely decline if someone else tries to take the ride using the same booking.`}

            />



            <Section

              title="5. Emergency & SOS Support"

              content={`The Stark Driver App includes a built-in **SOS button** for emergency assistance.  

If you ever feel unsafe or face a road emergency:  

• Use the SOS option to alert our safety team immediately.  

• You may also contact local authorities through the emergency dial feature.  

All SOS alerts are treated with top priority by our support and monitoring teams.`}

            />



            <Section

              title="6. Night & Long-Distance Rides"

              content={`• Keep your vehicle’s lights functional and visible at all times.  

• Avoid isolated or poorly lit waiting zones.  

• Use caution when accepting late-night or long-distance rides.  

• Share your trip details with a trusted contact if needed.`}

            />



            <Section

              title="7. Professional Conduct"

              content={`Drivers are expected to maintain polite and professional communication with riders at all times.  

Strictly avoid:  

• Arguments, verbal or physical altercations.  

• Discrimination, harassment, or inappropriate language.  

• Asking riders to cancel trips or make cash-only arrangements outside the app.`}

            />



            <Section

              title="8. Health & Vehicle Hygiene"

              content={`• Keep your vehicle clean and well-maintained.  

• Refrain from smoking or consuming alcohol during trips.  

• Ensure air conditioning and seats are clean and comfortable.  

• Personal hygiene and presentation create a professional impression and increase rider ratings.`}

            />



            <Section

              title="9. Reporting Incidents"

              content={`If you experience any unsafe situation, app malfunction, or rider misconduct:  

• Report the incident immediately via the “Help & Support” section.  

• Provide clear trip details and screenshots if possible.  

Our team investigates every report seriously to ensure fairness and safety.`}

            />



            <Section

              title="10. Platform Monitoring"

              content={`To maintain community safety, the Stark system monitors trip activity, cancellations, and rider feedback.  

Repeated violations or unsafe driving behavior may lead to account suspension or permanent deactivation.`}

            />



            <Section

              title="11. Continuous Safety Improvement"

              content={`We continuously update our safety protocols and driver training modules. Feedback from drivers is always welcome to help enhance safety standards across our platform.`}

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
  mainContainer: { flex: 1, backgroundColor: "#050505" },
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
    color: color.primaryText, // Using primary color for headers to make scanning easier
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    fontSize: fontSizes.FONT14,
    lineHeight: 24,
    color: '#ccc', // Slightly softer white for body text
    fontFamily: "TT-Octosquares-Medium",
    textAlign: 'justify',
  },
});