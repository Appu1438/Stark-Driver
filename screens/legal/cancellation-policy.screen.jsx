import { View, Text, ScrollView } from "react-native";
import React from "react";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";

export default function CancellationPolicy() {
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
        Cancellation & Refund Policy (Driver)
      </Text>

      <Section
        title="1. Overview"
        content={`This policy defines how cancellations, refunds, and compensations are handled for drivers using the Stark Driver App. The system ensures that drivers are fairly compensated for time, fuel, and platform fees while maintaining transparency in all financial operations.`}
      />

      <Section
        title="2. Platform Fee Deduction"
        content={`When a driver accepts a ride request, a **platform service fee** is automatically deducted from the driver’s Stark Wallet.  
This fee enables access to the trip, live tracking, and rider connection services. The deducted amount is later adjusted or refunded based on ride status and cancellation conditions.`}
      />

      <Section
        title="3. Rider Cancellation Before Pickup"
        content={`If the rider cancels the trip **after booking** but **before you start traveling** toward the pickup point, you will receive a **full refund of the deducted platform fee**.  
• No compensation is required from the rider.  
• The refund is **instantly credited to your wallet**.  
• No impact will occur on your ratings or trip performance score.`}
      />

      <Section
        title="4. Cancellation While Heading to Pickup"
        content={`If the rider cancels while you are **on the way to their location**, you will also receive a **full refund of the platform fee** deducted during booking.  
• The refund is credited instantly to your wallet.  
• No cancellation compensation is collected from the rider in this stage.`}
      />

      <Section
        title="5. Cancellation After Driver Arrival"
        content={`If the rider cancels **after you’ve arrived** at the pickup location, a **compensation amount between ₹100–₹200** (based on waiting time and estimated distance) will apply.  
• This amount should be **collected directly from the rider** at the time of cancellation, as displayed in your app.  
• The **platform fee deducted** at ride acceptance will also be **fully refunded** to your driver wallet instantly.  
• Ensure you record the cancellation properly in the app to process this correctly.`}
      />

      <Section
        title="6. Cancellation During an Ongoing Trip"
        content={`If a ride is **canceled while in progress**, the rider must pay for the **distance traveled** up to the point of cancellation.  
• The fare for the completed portion will be **collected from the rider directly**, as displayed in the app.  
• The **remaining portion of the platform fee** will be **refunded automatically** to your driver wallet once the trip is closed.  
• Please ensure that you mark the trip status correctly in the app to trigger the refund process.`}
      />

      <Section
        title="7. Driver-Initiated Cancellations"
        content={`Drivers are expected to cancel only in valid situations such as vehicle issues, emergencies, or safety concerns.  
Frequent or unjustified cancellations may lead to:  
• Reduced trip priority in dispatch algorithms.  
• Deduction of the platform fee for the canceled trip.  
• Temporary suspension or account review.`}
      />

      <Section
        title="8. Refund Processing & Wallet Usage"
        content={`All refunds — including full or partial platform fee reversals — are **credited instantly to your Stark Driver Wallet**.  
Wallet balances can be used to:  
• Cover platform service fees for upcoming rides.  
• Recharge for future operations.`}
      />

      <Section
        title="9. Example Scenarios"
        content={`• Rider cancels after booking → Full refund of platform fee.  
• Rider cancels while heading to pickup → Full refund of platform fee.  
• Rider cancels after arrival → ₹100–₹200 collected from rider + platform fee refunded.  
• Ride canceled mid-way → Fare for distance traveled collected from rider + partial platform fee refunded.`}
      />

      <Section
        title="10. Disputes & Adjustments"
        content={`If you believe that your refund or compensation has not been processed correctly, raise a request under the “Help & Support” section of the Driver App.  
Our team reviews and resolves wallet-related issues within **48 working hours**.`}
      />

      <Section
        title="11. System Errors & Special Cases"
        content={`In cases such as GPS error, network interruption, or rider misconduct, missed refunds or compensations will be **automatically adjusted** to your wallet or handled by our support team upon verification.`}
      />

      <Section
        title="12. Policy Updates"
        content={`Stark may revise this policy periodically to reflect new operational or legal guidelines.  
Continued use of the Driver App after such updates constitutes your acceptance of the latest terms.`}
      />

      <Section
        title="13. Contact Information"
        content={`For refund or compensation-related assistance, please contact our team through the “Help & Support” section in the Stark Driver App.`}
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
