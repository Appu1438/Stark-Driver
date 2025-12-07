import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { fontSizes } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import FooterNote from "@/components/common/footer-note";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WalletAndPayments() {
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
            <Text style={styles.pageTitle}>Wallet & Payments</Text>
          </View>

          {/* CONTENT CARD */}
          <View style={styles.contentCard}>
            <Section
              title="1. Introduction"
              content={`This Wallet & Payments Policy outlines how drivers earn, recharge, and manage their in-app wallet balance while using the Stark Driver platform. By using the app, drivers agree to comply with this policy and the terms of service.`}
            />

            <Section
              title="2. Driver Wallet Overview"
              content={`The driver wallet is a virtual account within the Stark Driver App that manages earnings, deductions, and service fees. It ensures smooth and transparent operations between the platform and the driver.`}
            />

            <Section
              title="3. How the Wallet Works"
              content={`• The driver wallet tracks all commission deductions, incentives, and refunds related to completed trips.\n• Each time a trip is completed, a platform commission or service fee is automatically deducted from the wallet.\n• If the wallet balance is low or negative, new ride requests may be temporarily paused until recharged.`}
            />

            <Section
              title="4. Rider Payments"
              content={`• Riders pay drivers directly at the end of each trip using cash or online methods such as UPI or wallet transfer.\n• The platform does not collect ride fares on behalf of the driver.\n• Drivers must collect payments responsibly and ensure fare accuracy as shown in the app’s trip summary.`}
            />

            <Section
              title="5. Wallet Recharge"
              content={`• Drivers can recharge their wallet using secure online payment options available in the app (e.g., UPI, credit/debit cards, net banking, etc.).\n• The recharge amount will be instantly reflected in the wallet once the transaction is successful.\n• Recharges are non-transferable and non-refundable except in cases of failed or duplicate transactions.`}
            />

            <Section
              title="6. Minimum Balance Requirement"
              content={`• A minimum wallet balance is required to accept and continue receiving rides.\n• If the balance falls below the minimum threshold, the app may restrict new ride bookings until the driver recharges.\n• The minimum balance amount will be clearly displayed in the driver wallet section.`}
            />

            <Section
              title="7. Commissions & Deductions"
              content={`• The platform charges a commission or service fee per completed ride, deducted automatically from the driver’s wallet.\n• Commission rates may vary based on trip distance, demand, and driver performance.\n• Drivers will always be able to view transaction details and commission breakdowns inside the wallet transaction history.`}
            />

            <Section
              title="8. Bonuses & Incentives"
              content={`• Promotional bonuses or incentives (if offered) will be credited directly to the driver wallet.\n• Incentives are subject to eligibility criteria such as ride count, rating, or location-based campaigns.`}
            />

            <Section
              title="9. Refunds & Failed Transactions"
              content={`• In case of a failed recharge or double deduction, drivers can raise a support ticket from the “Help & Support” section.\n• Refunds, if approved, will be credited back to the original payment method within 5–7 business days.`}
            />

            <Section
              title="10. Wallet Misuse or Fraud"
              content={`• Any misuse, unauthorized wallet manipulation, or fraudulent payment activity will result in immediate suspension of the driver account.\n• Stark OPC Pvt. Ltd. reserves the right to recover any financial loss caused by fraudulent activity and report such incidents to relevant authorities.`}
            />

            <Section
              title="11. Transparency & Record Keeping"
              content={`• Drivers can access detailed transaction records including all earnings, deductions, and wallet top-ups within the app.\n• Transaction summaries are updated in real time for full transparency.`}
            />

            <Section
              title="12. Policy Updates"
              content={`This policy may be updated periodically to reflect operational or regulatory changes. Drivers are encouraged to review it regularly. Continued use of the platform constitutes acceptance of the latest version.`}
            />

            <Section
              title="13. Contact & Support"
              content={`For any wallet or payment-related assistance, please contact support through the in-app “Help & Support” section.`}
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
    color: color.primaryText,
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