import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import color from "@/themes/app.colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BasicDetails() {
    const params = useLocalSearchParams();
    const {
        name,
        email,
        phone_number,
        dob,
        gender,
        aadhar,
        activeDevice,
        address,
        city,
        country,
        zipcode
    } = params;

    // Safe parsing for device info
    const deviceInfo = useMemo(() => {
        try {
            return activeDevice ? JSON.parse(activeDevice) : { brand: "Unknown", model: "Device" };
        } catch (e) {
            return { brand: "Unknown", model: "Device" };
        }
    }, [activeDevice]);

    // Data Configuration with Icons
    const details = [
        {
            label: "Full Name",
            value: name,
            icon: <Ionicons name="person" size={18} color="#4A90E2" />
        },
        {
            label: "Email Address",
            value: email,
            icon: <Ionicons name="mail" size={18} color="#FF5252" />
        },
        {
            label: "Phone Number",
            value: phone_number,
            icon: <Ionicons name="call" size={18} color="#00E676" />
        },
        // --- New Address Section ---
        {
            label: "Permanent Address",
            value: address,
            icon: <Ionicons name="home" size={18} color="#FFAB00" />
        },
        {
            label: "Location",
            value: [city, country, zipcode].filter(Boolean).join(", "),
            icon: <Ionicons name="location" size={18} color="#FFAB00" />
        },
        // ---------------------------
        {
            label: "Date of Birth",
            value: dob ? new Date(dob).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }) : "N/A",
            icon: <Ionicons name="calendar" size={18} color="#9C27B0" />
        },
        {
            label: "Gender",
            value: gender,
            icon: <Ionicons name="male-female" size={18} color="#E040FB" />
        },
        {
            label: "Aadhar Number",
            value: aadhar,
            icon: <MaterialCommunityIcons name="card-account-details" size={18} color="#00B0FF" />
        },
        {
            label: "Active Device",
            value: `${deviceInfo.brand} ${deviceInfo.model}`,
            icon: <Ionicons name="phone-portrait" size={18} color="#9E9E9E" />
        }
    ];

    return (
        <View style={styles.mainContainer}>
            <LinearGradient
                colors={[color.bgDark, color.subPrimary]} style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* HEADER */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.pageTitle}>Personal Info</Text>
                            <Text style={styles.pageSubtitle}>Manage your personal identity</Text>
                        </View>
                    </View>

                    {/* INFO CARD */}
                    <View style={styles.card}>
                        {details.map((item, index) => (
                            <View key={index} style={[styles.row, index === details.length - 1 && styles.lastRow]}>
                                <View style={styles.iconBox}>
                                    {item.icon}
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.label}>{item.label}</Text>
                                    <Text style={styles.value}>{item.value || "Not Provided"}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* VERIFIED BADGE */}
                    <View style={styles.verifiedContainer}>
                        <MaterialCommunityIcons name="shield-check" size={24} color={color.primaryText} />
                        <Text style={styles.verifiedText}>
                            Your profile is <Text style={{ color: color.primaryGray }}>Verified</Text>.
                            To update sensitive details or change your address, please contact Stark Support.
                        </Text>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

// STYLES
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#050505",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 50,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        gap: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageTitle: {
        fontSize: 24,
        color: "#fff",
        fontFamily: "TT-Octosquares-Medium",
    },
    pageSubtitle: {
        fontSize: 13,
        color: "#888",
        fontFamily: "TT-Octosquares-Medium",
    },

    // Card
    card: {
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
        overflow: "hidden",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    lastRow: {
        borderBottomWidth: 0,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.05)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: "#666",
        fontFamily: "TT-Octosquares-Medium",
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 16,
        color: "#fff",
        fontFamily: "TT-Octosquares-Medium",
    },

    // Verified Badge
    verifiedContainer: {
        marginTop: 25,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 224, 255, 0.08)", // subtle primary tint
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(0, 224, 255, 0.2)",
        gap: 12,
    },
    verifiedText: {
        flex: 1,
        fontSize: 13,
        color: "#ccc",
        lineHeight: 18,
        fontFamily: "TT-Octosquares-Medium",
    },
});