import { View, Text, ScrollView } from "react-native";
import React from "react";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";

export default function PrivacyPolicy() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: color.background,
        paddingHorizontal: windowWidth(20),
        paddingTop: windowHeight(40),
        paddingBottom: windowHeight(50),
      }}
    >
      <Text
        style={{
          fontSize: fontSizes.FONT26,
          fontFamily: "TT-Octosquares-Medium",
          color: color.primaryText,
          marginBottom: 25,
          textAlign: "center",
        }}
      >
        Privacy Policy (Driver)
      </Text>

      <Section
        title="1. Introduction"
        content={`This Privacy Policy describes how Stark OPC Pvt. Ltd. (“Stark”, “we”, “our”, or “us”) collects, uses, and protects driver information while using the Stark Driver App (“the App”). By registering as a driver, you agree to the practices outlined below.`}
      />

      <Section
        title="2. Information We Collect"
        content={`We collect and process the following information to operate our platform efficiently:
• Personal details: name, phone number, email, profile photo, and gender.
• Identification and verification data: driver’s license, Aadhaar, vehicle registration, and insurance documents.
• Financial details: wallet transactions, bank information (for payouts), and recharge history.
• Location data: real-time location while online or during rides.
• Device information: mobile device brand, OS, version, and unique identifiers.
• Usage and activity logs: trips accepted, completed rides, and ratings.`}
      />

      <Section
        title="3. Purpose of Data Collection"
        content={`We use your information to:
• Verify driver identity and eligibility.
• Enable ride-matching, navigation, and fare calculation.
• Manage driver wallet transactions, recharges, and commissions.
• Communicate trip updates, policy changes, and support messages.
• Ensure safety and compliance with transportation regulations.
• Improve platform reliability, fraud detection, and performance analytics.`}
      />

      <Section
        title="4. Location Data Usage"
        content={`Location data is collected continuously while you are online and using the Stark Driver App. This allows the system to:
• Match you with nearby ride requests.
• Provide accurate pickup and drop-off navigation.
• Track trips for rider safety and fare calculation.
• Record trip logs for quality assurance and regulatory compliance.
You can disable location access, but doing so will make the app inoperable for accepting rides.`}
      />

      <Section
        title="5. Data Sharing & Disclosure"
        content={`We may share relevant information with:
• Riders, to display your name, photo, vehicle number, and live location during trips.
• Payment gateways, for wallet recharges and commission deductions.
• Verification partners, for identity and document validation.
• Law enforcement, only when legally required.
• Internal support and operations teams to resolve service or payment issues.
We do not sell or rent your personal data under any circumstances.`}
      />

      <Section
        title="6. Wallet & Financial Data"
        content={`Your in-app wallet stores and manages transactions, including recharges, deductions, and earnings. 
Payment details are securely processed by certified third-party gateways using encryption. Stark does not store sensitive card or banking credentials directly on its servers.`}
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
        content={`As a driver, you have the right to:
• Access and review your personal data.
• Request correction of inaccurate or outdated information.
• Request deletion of data (subject to legal retention requirements).
• Withdraw consent for promotional or marketing communication.
Requests can be submitted via the “Help & Support” section in the App.`}
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

      <Text
        style={{
          fontSize: fontSizes.FONT14,
          color: "#999",
          textAlign: "center",
          marginTop: 20,
          fontFamily: "TT-Octosquares-Medium",
          marginBottom: 25,
        }}
      >
        © {new Date().getFullYear()} Stark OPC Pvt. Ltd. All rights reserved.
      </Text>
    </ScrollView>
  );
}

/* ---------- SECTION COMPONENT ---------- */
const Section = ({ title, content }) => (
  <View style={{ marginBottom: 25 }}>
    <Text
      style={{
        fontSize: fontSizes.FONT18,
        fontFamily: "TT-Octosquares-Medium",
        color: color.primaryText,
        marginBottom: 6,
      }}
    >
      {title}
    </Text>
    <Text
      style={{
        fontSize: fontSizes.FONT15,
        lineHeight: 24,
        color: color.primaryText,
        fontFamily: "TT-Octosquares-Medium",
        opacity: 0.9,
      }}
    >
      {content}
    </Text>
  </View>
);
