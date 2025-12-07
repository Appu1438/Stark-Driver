import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from "react-native";
import React from "react";
import { fontSizes } from "@/themes/app.constant";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import color from "@/themes/app.colors";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LegalIndex() {
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
            icon: "location-outline",
            route: "/(routes)/legal/location-info",
        },
        {
            label: "Cancellation & Refund",
            icon: "refresh-circle-outline",
            route: "/(routes)/legal/cancellation-policy",
        },
        {
            label: "Wallet & Payments",
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
            icon: "phone-portrait-outline",
            route: "/(routes)/legal/app-usage-policy",
        },
    ];

    return (
        <View style={styles.mainContainer}>
            <LinearGradient colors={[color.bgDark, color.subPrimary]} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* HEADER */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.pageTitle}>Legal & Policies</Text>
                            <Text style={styles.pageSubtitle}>Review our terms and guidelines</Text>
                        </View>
                    </View>

                    {/* POLICY LIST CARD */}
                    <View style={styles.listCard}>
                        {legalItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => router.push(item.route)}
                                activeOpacity={0.7}
                                style={[
                                    styles.listItem,
                                    index === legalItems.length - 1 && styles.lastItem // Remove border for last item
                                ]}
                            >
                                <View style={styles.itemLeft}>
                                    <View style={styles.iconBox}>
                                        <Ionicons name={item.icon} size={20} color={color.primaryText} />
                                    </View>
                                    <Text style={styles.itemText}>{item.label}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#666" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* FOOTER INFO */}
                    <View style={styles.footerContainer}>
                        <MaterialIcons name="security" size={20} color="#666" />
                        <Text style={styles.footerText}>
                            Your data is secure and protected according to our privacy standards.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.supportLink}
                        onPress={() => router.push("/(routes)/profile/help-support")}
                    >
                        <Text style={styles.supportText}>Have questions about our policies?</Text>
                        <Text style={styles.supportAction}>Contact Support</Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: "#050505" },
    scrollContent: { padding: 20, paddingBottom: 50 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 15 },
    backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    pageTitle: { fontSize: 24, color: "#fff", fontFamily: "TT-Octosquares-Medium" },
    pageSubtitle: { fontSize: 13, color: "#888", fontFamily: "TT-Octosquares-Medium" },

    // List Card
    listCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 25,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    lastItem: { borderBottomWidth: 0 },

    itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    iconBox: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center', justifyContent: 'center'
    },
    itemText: {
        fontSize: 15,
        color: '#eee',
        fontFamily: "TT-Octosquares-Medium",
    },

    // Footer
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    footerText: {
        color: '#666',
        fontSize: 12,
        fontFamily: "TT-Octosquares-Medium",
        textAlign: 'center',
        flex: 1,
        lineHeight: 18,
    },

    // Support Link
    supportLink: { alignItems: 'center', marginTop: 10 },
    supportText: { color: '#888', fontSize: 13, fontFamily: "TT-Octosquares-Medium", marginBottom: 4 },
    supportAction: { color: color.primaryGray, fontSize: 14, fontFamily: "TT-Octosquares-Medium", textDecorationLine: 'underline' },
});