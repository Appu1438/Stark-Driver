import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import color from "@/themes/app.colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSizes } from "@/themes/app.constant";

export default function VehicleDetails() {
    const params = useLocalSearchParams();
    const {
        vehicle_type,
        registration_number,
        registration_date,
        vehicle_color,
        capacity,
        insurance_number,
        insurance_expiry,
    } = params;

    // Check insurance expiry
    const isExpired = insurance_expiry && new Date(insurance_expiry) < new Date();

    // Helper for dates
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Choose vehicle image based on type
    const getVehicleImage = (type) => {
        switch (type?.toLowerCase()) {
            case "auto":
                return require("@/assets/images/vehicles/auto.png");
            case "suv":
                return require("@/assets/images/vehicles/suv.png");
            case "sedan":
                return require("@/assets/images/vehicles/sedan.png");
            case "hatchback":
                return require("@/assets/images/vehicles/hatchback.png");
            default:
                return require("@/assets/images/vehicles/suv.png"); // fallback
        }
    };

    const specs = [
        {
            label: "Vehicle Type",
            value: vehicle_type,
            icon: <Ionicons name="car-sport" size={18} color="#4A90E2" />
        },
        {
            label: "Registration No.",
            value: registration_number,
            icon: <MaterialCommunityIcons name="license" size={18} color="#00E676" />
        },
        {
            label: "Reg. Date",
            value: formatDate(registration_date),
            icon: <Ionicons name="calendar" size={18} color="#FFAB00" />
        },
        {
            label: "Color",
            value: vehicle_color,
            icon: <Ionicons name="color-palette" size={18} color="#E040FB" />
        },
        {
            label: "Seating Capacity",
            value: `${capacity} Seats`,
            icon: <MaterialCommunityIcons name="car-seat" size={18} color="#FF5252" />
        },
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
                            <Text style={styles.pageTitle}>Vehicle Info</Text>
                            <Text style={styles.pageSubtitle}>Your registered transport</Text>
                        </View>
                    </View>

                    {/* HERO IMAGE SECTION */}
                    <View style={styles.heroContainer}>
                        <LinearGradient
                            colors={['rgba(255,255,255,0.0)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.0)']}
                            style={styles.heroGlow}
                        />
                        <Image
                            source={getVehicleImage(vehicle_type)}
                            style={styles.vehicleImage}
                        />
                        <View style={styles.plateBadge}>
                            <Text style={styles.plateText}>{registration_number || "NO PLATE"}</Text>
                        </View>
                    </View>

                    {/* SPECIFICATIONS CARD */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Specifications</Text>
                    </View>

                    <View style={styles.card}>
                        {specs.map((item, index) => (
                            <View key={index} style={[styles.row, index === specs.length - 1 && styles.lastRow]}>
                                <View style={styles.iconBox}>
                                    {item.icon}
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.label}>{item.label}</Text>
                                    <Text style={styles.value}>{item.value || "N/A"}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* INSURANCE SECTION */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Insurance Details</Text>
                    </View>

                    <View style={[styles.card, styles.insuranceCard]}>
                        <View style={styles.row}>
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 224, 255, 0.1)' }]}>
                                <Ionicons name="shield-checkmark" size={18} color={color.primaryText} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.label}>Policy Number</Text>
                                <Text style={styles.value}>{insurance_number || "N/A"}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={[styles.row, { paddingTop: 0, paddingBottom: 0, borderBottomWidth: 0 }]}>
                            <View>
                                <Text style={styles.label}>Expiry Date</Text>
                                <Text style={[styles.value, isExpired && { color: '#FF5252' }]}>
                                    {formatDate(insurance_expiry)}
                                </Text>
                            </View>

                            <View style={[styles.statusBadge, isExpired ? styles.badgeExpired : styles.badgeActive]}>
                                <Text style={[styles.statusText, isExpired ? styles.textExpired : styles.textActive]}>
                                    {isExpired ? "EXPIRED" : "ACTIVE"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* FOOTER INFO */}
                    <View style={styles.infoBox}>
                        <MaterialCommunityIcons name="information-outline" size={20} color="#888" />
                        <Text style={styles.infoText}>
                            Ensure vehicle details match your physical documents to avoid issues during rides.
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
        marginBottom: 20,
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
        fontSize: fontSizes.FONT20,
        color: "#fff",
        fontFamily: "TT-Octosquares-Medium",
    },
    pageSubtitle: {
        fontSize: fontSizes.FONT13,
        color: "#888",
        fontFamily: "TT-Octosquares-Medium",
    },

    // Hero Image
    heroContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        marginTop: 10,
        position: 'relative',
        height: 180,
    },
    heroGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 100,
        transform: [{ scaleX: 1.5 }],
    },
    vehicleImage: {
        width: 280,
        height: 160,
        resizeMode: "contain",
        zIndex: 2,
    },
    plateBadge: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff', // Indian plate style
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#000',
        zIndex: 3,
        shadowColor: "#fff",
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    plateText: {
        color: '#000',
        fontSize: fontSizes.FONT14,
        fontFamily: "TT-Octosquares-Medium",
    },

    // Section Headers
    sectionHeader: {
        marginBottom: 10,
        marginTop: 10,
    },
    sectionTitle: {
        color: '#666',
        fontSize: fontSizes.FONT12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: "TT-Octosquares-Medium",
    },

    // Cards
    card: {
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
        overflow: "hidden",
        marginBottom: 15,
    },
    insuranceCard: {
        padding: 20,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    lastRow: {
        borderBottomWidth: 0,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.05)",
        marginVertical: 10,
    },

    // Content Styling
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
    },
    label: {
        fontSize: fontSizes.FONT11,
        color: "#666",
        fontFamily: "TT-Octosquares-Medium",
        marginBottom: 4,
        textTransform: "uppercase",
    },
    value: {
        fontSize: fontSizes.FONT15,
        color: "#fff",
        fontFamily: "TT-Octosquares-Medium",
    },

    // Badges
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        borderWidth: 1,
        marginLeft: 'auto',
    },
    badgeActive: {
        backgroundColor: "rgba(0, 230, 118, 0.1)",
        borderColor: "rgba(0, 230, 118, 0.3)",
    },
    badgeExpired: {
        backgroundColor: "rgba(255, 82, 82, 0.1)",
        borderColor: "rgba(255, 82, 82, 0.3)",
    },
    statusText: {
        fontSize: fontSizes.FONT10,
        fontFamily: "TT-Octosquares-Medium",
    },
    textActive: { color: "#00E676" },
    textExpired: { color: "#FF5252" },

    // Footer
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    infoText: {
        fontSize: fontSizes.FONT12,
        color: "#666",
        lineHeight: 18,
        fontFamily: "TT-Octosquares-Medium",
        flex: 1,
    },
});