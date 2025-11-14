import { View, Text, ScrollView } from "react-native";
import React from "react";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";

export default function LocationInfo() {
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
        Location Information (Driver)
      </Text>

      <Section
        title="1. Purpose of Location Access"
        content={`The Stark Driver App requires access to your location to provide accurate and reliable ride services. Location data is essential for matching you with nearby riders, calculating routes and fares, ensuring safety, and maintaining transparency during each trip.`}
      />

      <Section
        title="2. When Location is Collected"
        content={`Your location is collected in the following circumstances:
• When you are **online and available** to receive ride requests.  
• When you **accept a ride**, to navigate to the pickup point and drop-off location.  
• When the trip is **in progress**, for accurate route tracking and fare calculation.  
• When the app is in the **background** (if permission is granted), to ensure continuous trip tracking and rider safety.`}
      />

      <Section
        title="3. How Location Data is Used"
        content={`Location data helps us:
• Match you with the nearest riders efficiently.  
• Provide real-time navigation and trip tracking.  
• Calculate accurate fares and generate receipts.  
• Enhance safety by allowing riders and support teams to track active trips.  
• Improve operational analytics and detect fraudulent activity.`}
      />

      <Section
        title="4. Background Location Use"
        content={`The Stark Driver App may access your location even when running in the background, but only during active or ongoing trips. This ensures uninterrupted trip monitoring, live tracking for riders, and accurate distance-based fare calculations.  
Your background location is **never** used for marketing or unrelated purposes.`}
      />

      <Section
        title="5. Location Sharing"
        content={`Your live location may be shared with:
• Riders — to display your approach to the pickup point and during the ride.  
• Stark’s support and safety teams — for live monitoring, route accuracy, and dispute resolution.  
• Law enforcement — only when required by law or safety investigations.`}
      />

      <Section
        title="6. Data Storage & Security"
        content={`Your real-time location is transmitted securely using encryption and stored temporarily for trip operations, fare computation, and quality audits.  
After ride completion, only generalized route data is retained for reporting, compliance, and analytics.`}
      />

      <Section
        title="7. Control Over Permissions"
        content={`You can manage location permissions through your device settings:
• Allow access “While Using the App” — for standard ride functionality.  
• Allow access “All the Time” — to enable background tracking for ongoing trips.  
If location access is denied, the app will not be able to connect you with riders or start rides.`}
      />

      <Section
        title="8. Compliance with App Store & Legal Guidelines"
        content={`We comply with Google Play’s and Apple’s location data policies, as well as applicable data protection laws.  
We collect only the minimum required location data necessary for ride functionality, safety, and legal compliance.`}
      />

      <Section
        title="9. Data Retention"
        content={`Precise location data is retained only for active rides and necessary operational use.  
Historical ride paths may be anonymized and stored for reporting, performance metrics, and safety analytics.`}
      />

      <Section
        title="10. Contact & Support"
        content={`If you have questions or concerns regarding how your location data is used, please contact our privacy and safety team through the “Help & Support” section in the Stark Driver App.`}
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
