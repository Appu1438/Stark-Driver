import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { fontSizes, windowWidth, windowHeight } from "@/themes/app.constant";
import { Ionicons } from "@expo/vector-icons";
import color from "@/themes/app.colors";
import { router } from "expo-router";

export default function index() {
    const legalItems = [
        {
            label: "Terms & Conditions",
            icon: "document-text-outline",
            route: "/(routes)/legal/terms-and-conditions",
        },
        {
            label: "Privacy Policy",
            icon: "lock-closed-outline",
            route: "/(routes)/legal/privacy-policy",
        },
        {
            label: "Location Information",
            icon: "navigate-circle-outline",
            route: "/(routes)/legal/location-info",
        },
        {
            label: "Cancellation & Refund Policy",
            icon: "refresh-circle-outline",
            route: "/(routes)/legal/cancellation-policy",
        },
        {
            label: "Wallet & Payments Policy",
            icon: "card-outline",
            route: "/(routes)/legal/wallet-and-payments-policy",
        },
        {
            label: "Safety Guidelines",
            icon: "shield-checkmark-outline",
            route: "/(routes)/legal/safety-guidelines",
        },
        {
            label: "App Usage Policy",
            icon: "information-circle-outline",
            route: "/(routes)/legal/app-usage-policy",
        },
    ];

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
                flex: 1,
                paddingHorizontal: windowWidth(20),
                paddingTop: windowHeight(40),
            }}
        >
            {/* ---------- HEADER ---------- */}
            <Text
                style={{
                    fontSize: fontSizes.FONT26,
                    fontFamily: "TT-Octosquares-Medium",
                    color: color.primaryText,
                    marginBottom: 25,
                    textAlign: "center",
                }}
            >
                Legal & Policies
            </Text>

            {/* ---------- LEGAL LINKS ---------- */}
            <View
                style={{
                    backgroundColor: color.subPrimary,
                    borderRadius: 16,
                    //   borderWidth: 2,
                    borderColor: color.border,
                    overflow: "hidden",
                }}
            >
                {legalItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => router.push(item.route)}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingVertical: 18,
                            paddingHorizontal: 15,
                            // borderBottomWidth:
                            //     index !== legalItems.length - 1 ? 1.5 : 0,
                            // borderBottomColor: color.border,
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Ionicons
                                name={item.icon}
                                size={24}
                                color={color.primaryText}
                                style={{ marginRight: 15 }}
                            />
                            <Text
                                style={{
                                    fontSize: fontSizes.FONT18,
                                    color: color.primaryText,
                                    fontFamily: "TT-Octosquares-Medium",
                                }}
                            >
                                {item.label}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward-outline"
                            size={22}
                            color={color.primaryText}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ height: 80 }} />
        </ScrollView>
    );
}
