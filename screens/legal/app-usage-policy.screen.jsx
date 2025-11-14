import { View, Text, ScrollView } from "react-native";
import React from "react";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";

export default function AppUsagePolicy() {
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
        App Usage Policy (Driver)
      </Text>

      <Section
        title="1. Purpose of This Policy"
        content={`This App Usage Policy outlines the professional and responsible use of the Stark Driver App. All drivers are expected to adhere to these guidelines to ensure safe, lawful, and fair operations on the platform.`}
      />

      <Section
        title="2. Account Responsibility"
        content={`Your driver account is personal and linked to verified documents and your registered vehicle.  
You must not share your account or login credentials with others.  
Any unauthorized use, impersonation, or account sharing will result in immediate suspension or deactivation.`}
      />

      <Section
        title="3. OTP Verification & Ride Start"
        content={`Every trip must start only after verifying the One-Time Password (OTP) provided by the rider.  
Drivers must follow these rules strictly:
• Do not begin a ride until the OTP is entered and verified in the app.  
• Never request the OTP before arriving at the rider’s pickup point.  
• If a rider refuses to share or enters the wrong OTP, contact support before proceeding.  
• Starting trips without OTP confirmation or off-app rides is strictly prohibited.`}
      />

      <Section
        title="4. Ride Cancellations & Off-App Deals"
        content={`Drivers are not allowed to ask riders to cancel rides for off-app deals or direct payments.  
Violations include:
• Requesting riders to cancel and pay cash directly.  
• Accepting or completing rides outside the Stark App.  
• Cancelling frequently to manipulate trip assignments or avoid short rides.  
Such activities lead to account penalties or permanent deactivation.`}
      />

      <Section
        title="5. Fair and Honest Usage"
        content={`Drivers must operate honestly and maintain platform integrity.  
The following activities are forbidden:
• Using fake GPS, emulators, or manipulated devices.  
• Creating false ride requests or self-booking trips.  
• Manipulating distance, time, or fare through unauthorized apps.  
• Refusing rides based on rider identity or location (except for safety concerns).`}
      />

      <Section
        title="6. Device & Network Requirements"
        content={`For smooth performance:
• Keep the Stark Driver App updated.  
• Ensure stable mobile network and GPS connection.  
• Avoid using rooted, jailbroken, or modified devices.  
• Enable required permissions such as Location and Notification for real-time operations.`}
      />

      <Section
        title="7. Trip Conduct & Professionalism"
        content={`As a representative of the Stark platform, maintain professional behavior at all times:
• Greet riders politely and follow the route displayed in the app.  
• Never use abusive language or behave inappropriately.  
• Avoid smoking, drinking, or using prohibited substances while online.  
• Follow all traffic rules and safety standards.`}
      />

      <Section
        title="8. Misuse & Fraudulent Activities"
        content={`Any misuse of the Stark Driver App — including system manipulation, false ratings, or fraudulent activities — will result in strict penalties.  
Such cases may be escalated to law enforcement if necessary.`}
      />

      <Section
        title="9. Policy Violations & Consequences"
        content={`Violation of this App Usage Policy may result in:
• Temporary suspension of your account.  
• Permanent deactivation for repeated offenses.  
• Deduction of pending payments in case of proven fraud or misconduct.  
Stark reserves the right to investigate and act upon any reported violation.`}
      />

      <Section
        title="10. Reporting & Support"
        content={`If you face technical issues, rider misconduct, or safety-related incidents, immediately report through the “Help & Support” section in the app.  
Our team will review and respond promptly.`}
      />

      <Section
        title="11. Policy Updates"
        content={`Stark may revise this App Usage Policy from time to time to comply with new regulations or improve operational safety.  
Continued use of the Driver App after updates indicates acceptance of the revised policy.`}
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
