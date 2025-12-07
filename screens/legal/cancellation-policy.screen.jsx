import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { fontSizes } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import FooterNote from "@/components/common/footer-note";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CancellationPolicy() {
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
            <Text style={styles.pageTitle}>Cancellation & Refund</Text>
          </View>

          {/* CONTENT CARD */}
          <View style={styles.contentCard}>
            <Section
              title="1. Overview"
              content={`This policy defines how cancellations, refunds, and compensations are handled for drivers using the Stark Driver App. The system ensures that drivers are fairly compensated for time, fuel, and platform fees while maintaining transparency in all financial operations.`}
            />

            <Section
              title="2. Platform Fee Deduction"
              content={`When a driver accepts a ride request, a platform service fee is automatically deducted from the driver’s Stark Wallet.\nThis fee enables access to the trip, live tracking, and rider connection services. The deducted amount is later adjusted or refunded based on ride status and cancellation conditions.`}
            />

            <Section
              title="3. Rider Cancellation Before Pickup"
              content={`If the rider cancels the trip after booking but before you start traveling toward the pickup point, you will receive a full refund of the deducted platform fee.\n• No compensation is required from the rider.\n• The refund is instantly credited to your wallet.\n• No impact will occur on your ratings or trip performance score.`}
            />

            <Section
              title="4. Cancellation While Heading to Pickup"
              content={`If the rider cancels while you are on the way to their location, you will also receive a full refund of the platform fee deducted during booking.\n• The refund is credited instantly to your wallet.\n• No cancellation compensation is collected from the rider in this stage.`}
            />

            <Section
              title="5. Cancellation After Driver Arrival"
              content={`If the rider cancels after you’ve arrived at the pickup location, a compensation amount between ₹100–₹200 (based on waiting time and estimated distance) will apply.\n• This amount should be collected directly from the rider at the time of cancellation, as displayed in your app.\n• The platform fee deducted at ride acceptance will also be fully refunded to your driver wallet instantly.\n• Ensure you record the cancellation properly in the app to process this correctly.`}
            />

            <Section
              title="6. Cancellation During an Ongoing Trip"
              content={`If a ride is canceled while in progress, the rider must pay for the distance traveled up to the point of cancellation.\n• The fare for the completed portion will be collected from the rider directly, as displayed in the app.\n• The remaining portion of the platform fee will be refunded automatically to your driver wallet once the trip is closed.\n• Please ensure that you mark the trip status correctly in the app to trigger the refund process.`}
            />

            <Section
              title="7. Driver-Initiated Cancellations"
              content={`Drivers are expected to cancel only in valid situations such as vehicle issues, emergencies, or safety concerns.\nFrequent or unjustified cancellations may lead to:\n• Reduced trip priority in dispatch algorithms.\n• Deduction of the platform fee for the canceled trip.\n• Temporary suspension or account review.`}
            />

            <Section
              title="8. Refund Processing & Wallet Usage"
              content={`All refunds — including full or partial platform fee reversals — are credited instantly to your Stark Driver Wallet.\nWallet balances can be used to:\n• Cover platform service fees for upcoming rides.\n• Recharge for future operations.`}
            />

            <Section
              title="9. Example Scenarios"
              content={`• Rider cancels after booking → Full refund of platform fee.\n• Rider cancels while heading to pickup → Full refund of platform fee.\n• Rider cancels after arrival → ₹100–₹200 collected from rider + platform fee refunded.\n• Ride canceled mid-way → Fare for distance traveled collected from rider + partial platform fee refunded.`}
            />

            <Section
              title="10. Disputes & Adjustments"
              content={`If you believe that your refund or compensation has not been processed correctly, raise a request under the “Help & Support” section of the Driver App.\nOur team reviews and resolves wallet-related issues within 48 working hours.`}
            />

            <Section
              title="11. System Errors & Special Cases"
              content={`In cases such as GPS error, network interruption, or rider misconduct, missed refunds or compensations will be automatically adjusted to your wallet or handled by our support team upon verification.`}
            />

            <Section
              title="12. Policy Updates"
              content={`Stark may revise this policy periodically to reflect new operational or legal guidelines.\nContinued use of the Driver App after such updates constitutes your acceptance of the latest terms.`}
            />

            <Section
              title="13. Contact Information"
              content={`For refund or compensation-related assistance, please contact our team through the “Help & Support” section in the Stark Driver App.`}
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