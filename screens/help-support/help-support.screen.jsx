import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import color from "@/themes/app.colors";
import { fontSizes, windowWidth, windowHeight } from "@/themes/app.constant";
import Button from "@/components/common/button";
import HelpAndSupportSkeleton from "./help-support-skelton.screen";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DriverHelpAndSupport() {
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === id ? null : id);
  };

  useEffect(() => {
    // Simulate data load (optional)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <HelpAndSupportSkeleton />;

  // 🚖 Driver-focused FAQ list
  const faqData = [
    {
      id: 1,
      question: "How do I start receiving ride requests?",
      answer:
        "Ensure your status is set to 'Online' from the home screen. Once online, you’ll start receiving nearby ride requests automatically based on your location and availability.",
    },
    {
      id: 2,
      question: "I didn’t receive payment from a completed ride. What should I do?",
      answer:
        "If a customer didn’t pay the full fare in cash or UPI, please register a complaint in the 'Complaints' section with ride details. Our team will verify and resolve the issue promptly.",
    },
    {
      id: 3,
      question: "How do I cancel a ride if the customer doesn’t show up?",
      answer:
        "If the customer doesn’t arrive after waiting for a reasonable time, use the 'Cancel Ride' option and select a valid reason like 'Rider no-show'. Repeated misuse may affect your reliability score.",
    },
    {
      id: 4,
      question: "What should I do if a customer misbehaves or is abusive?",
      answer:
        "Your safety comes first. End the trip immediately and contact support or the emergency helpline. Also, file a complaint under 'Customer Behavior' with details for further review.",
    },
    {
      id: 5,
      question: "My app is not showing any new rides. How can I fix this?",
      answer:
        "Ensure your GPS and internet connection are stable. Try switching offline and online again. If the problem persists, restart the app or check for updates in the Play Store.",
    },
    {
      id: 6,
      question: "Can I update my vehicle details or documents?",
      answer:
        "To update your vehicle registration, insurance, or related documents, please email the updated details to support@starkdriver.com or contact our support team through the Help section. Once received, our verification team will review and update your records within 24–48 hours.",
    },

    {
      id: 7,
      question: "How can I view my past rides and earnings?",
      answer:
        "Visit the 'Ride History' section from your home screen to see completed rides along with payment details and ratings received from riders.",
    },
    {
      id: 8,
      question: "What safety measures are available for drivers?",
      answer:
        "You can access emergency support directly from the in-app 'Emergency' button. All rides are GPS tracked, and support is available if you face any issues during a trip.",
    },
  ];

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: color.background,
        paddingHorizontal: windowWidth(25),
        paddingTop: windowHeight(40),
        marginBottom: 30,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------- HEADER ---------- */}
      <Text
        style={{
          fontSize: fontSizes.FONT26,
          fontFamily: "TT-Octosquares-Medium",
          color: color.primaryText,
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Help & Support
      </Text>
      <Text
        style={{
          fontSize: fontSizes.FONT14,
          color: color.primaryGray,
          textAlign: "center",
          fontFamily: "TT-Octosquares-Medium",
          marginBottom: 25,
        }}
      >
        Get quick answers to common questions or contact support for help with rides, payments, or account issues.
      </Text>

      {/* ---------- SEARCH BOX ---------- */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: color.subPrimary,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginBottom: 25,
          borderWidth: 1,
          borderColor: color.border,
        }}
      >
        <Ionicons name="search-outline" size={20} color={color.primaryText} />
        <TextInput
          placeholder="Search for help..."
          placeholderTextColor="#888"
          style={{
            flex: 1,
            paddingHorizontal: 10,
            fontFamily: "TT-Octosquares-Medium",
            color: color.primaryText,
          }}
        />
      </View>

      {/* ---------- FAQ SECTION ---------- */}
      <Text
        style={{
          fontSize: fontSizes.FONT22,
          color: color.primaryText,
          fontFamily: "TT-Octosquares-Medium",
          marginBottom: 15,
        }}
      >
        Common Driver Questions
      </Text>

      {faqData.map((faq) => (
        <TouchableOpacity
          key={faq.id}
          onPress={() => toggleExpand(faq.id)}
          activeOpacity={0.8}
          style={{
            backgroundColor: color.subPrimary,
            borderRadius: 12,
            marginBottom: 12,
            paddingHorizontal: 15,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: color.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.FONT16,
                color: color.primaryText,
                fontFamily: "TT-Octosquares-Medium",
                flex: 1,
                marginRight: 10,
              }}
            >
              {faq.question}
            </Text>
            <Ionicons
              name={expanded === faq.id ? "chevron-up" : "chevron-down"}
              size={20}
              color={color.primaryText}
            />
          </View>

          {expanded === faq.id && (
            <Text
              style={{
                fontSize: fontSizes.FONT14,
                color: "#aaa",
                marginTop: 10,
                lineHeight: 22,
                fontFamily: "TT-Octosquares-Medium",
              }}
            >
              {faq.answer}
            </Text>
          )}
        </TouchableOpacity>
      ))}

      {/* ---------- CONTACT SECTION ---------- */}
      <LinearGradient
        colors={[color.darkPrimary, color.bgDark]}
        style={{
          borderRadius: 18,
          padding: 18,
          marginTop: 25,
          marginBottom: 30,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text
          style={{
            fontSize: fontSizes.FONT20,
            color: color.primaryText,
            fontFamily: "TT-Octosquares-Medium",
            marginBottom: 12,
          }}
        >
          Need Further Assistance?
        </Text>

        <View style={{ marginBottom: 10 }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
          >
            <MaterialIcons name="email" size={20} color={color.primaryText} />
            <Text
              style={{
                color: color.primaryText,
                marginLeft: 10,
                fontFamily: "TT-Octosquares-Medium",
              }}
            >
              support@starkdriver.com
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
          >
            <MaterialIcons name="phone" size={20} color={color.primaryText} />
            <Text
              style={{
                color: color.primaryText,
                marginLeft: 10,
                fontFamily: "TT-Octosquares-Medium",
              }}
            >
              +91 98765 43211
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="time-outline" size={20} color={color.primaryText} />
            <Text
              style={{
                color: color.primaryText,
                marginLeft: 10,
                fontFamily: "TT-Octosquares-Medium",
              }}
            >
              Driver Support: 8 AM – 10 PM (Mon–Sat)
            </Text>
          </View>
        </View>

        <Button
          title="Contact Support"
          onPress={() => { }}
          style={{ marginTop: 10 }}
        />
      </LinearGradient>

      {/* ---------- FOOTER NOTE ---------- */}
      <Text
        style={{
          fontSize: fontSizes.FONT14,
          color: "#888",
          textAlign: "center",
          fontFamily: "TT-Octosquares-Medium",
          marginBottom: 30,
        }}
      >
        © {new Date().getFullYear()} Stark OPC Pvt. Ltd. All rights reserved.
      </Text>
    </ScrollView>
  );
}
