import { View, Text, ScrollView } from "react-native";
import React from "react";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";

export default function SafetyGuidelines() {
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
        Safety Guidelines (Driver)
      </Text>

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
