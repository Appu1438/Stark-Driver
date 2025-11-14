import { View, Text, ScrollView } from "react-native";
import React from "react";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";

export default function WalletAndPayments() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
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
        Wallet & Payments Policy
      </Text>

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
        content={`• The driver wallet tracks all commission deductions, incentives, and refunds related to completed trips.  
• Each time a trip is completed, a **platform commission or service fee** is automatically deducted from the wallet.  
• If the wallet balance is low or negative, new ride requests may be temporarily paused until recharged.`}
      />

      <Section
        title="4. Rider Payments"
        content={`• Riders pay drivers directly at the end of each trip using **cash or online methods** such as UPI or wallet transfer.  
• The platform does **not** collect ride fares on behalf of the driver.  
• Drivers must collect payments responsibly and ensure fare accuracy as shown in the app’s trip summary.`}
      />

      <Section
        title="5. Wallet Recharge"
        content={`• Drivers can recharge their wallet using **secure online payment options** available in the app (e.g., UPI, credit/debit cards, net banking, etc.).  
• The recharge amount will be instantly reflected in the wallet once the transaction is successful.  
• Recharges are non-transferable and non-refundable except in cases of failed or duplicate transactions.`}
      />

      <Section
        title="6. Minimum Balance Requirement"
        content={`• A minimum wallet balance is required to accept and continue receiving rides.  
• If the balance falls below the minimum threshold, the app may restrict new ride bookings until the driver recharges.  
• The minimum balance amount will be clearly displayed in the driver wallet section.`}
      />

      <Section
        title="7. Commissions & Deductions"
        content={`• The platform charges a commission or service fee per completed ride, deducted automatically from the driver’s wallet.  
• Commission rates may vary based on trip distance, demand, and driver performance.  
• Drivers will always be able to view transaction details and commission breakdowns inside the wallet transaction history.`}
      />

      <Section
        title="8. Bonuses & Incentives"
        content={`• Promotional bonuses or incentives (if offered) will be credited directly to the driver wallet.  
• Incentives are subject to eligibility criteria such as ride count, rating, or location-based campaigns.`}
      />

      <Section
        title="9. Refunds & Failed Transactions"
        content={`• In case of a failed recharge or double deduction, drivers can raise a support ticket from the “Help & Support” section.  
• Refunds, if approved, will be credited back to the original payment method within 5–7 business days.`}
      />

      <Section
        title="10. Wallet Misuse or Fraud"
        content={`• Any misuse, unauthorized wallet manipulation, or fraudulent payment activity will result in immediate suspension of the driver account.  
• Stark OPC Pvt. Ltd. reserves the right to recover any financial loss caused by fraudulent activity and report such incidents to relevant authorities.`}
      />

      <Section
        title="11. Transparency & Record Keeping"
        content={`• Drivers can access detailed transaction records including all earnings, deductions, and wallet top-ups within the app.  
• Transaction summaries are updated in real time for full transparency.`}
      />

      <Section
        title="12. Policy Updates"
        content={`This policy may be updated periodically to reflect operational or regulatory changes. Drivers are encouraged to review it regularly. Continued use of the platform constitutes acceptance of the latest version.`}
      />

      <Section
        title="13. Contact & Support"
        content={`For any wallet or payment-related assistance, please contact support through the in-app “Help & Support” section.`}
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
