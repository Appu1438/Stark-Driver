import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import color from "@/themes/app.colors";
import { fontSizes, windowHeight } from "@/themes/app.constant";

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
    const isExpired =
        insurance_expiry && new Date(insurance_expiry) < new Date();

    // Choose vehicle image based on type
    const getVehicleImage = (type) => {
        switch (type?.toLowerCase()) {
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

    const details = [
        { label: "Vehicle Type", value: vehicle_type },
        { label: "Registration Number", value: registration_number },
        {
            label: "Registration Date",
            value: registration_date
                ? new Date(registration_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })
                : "N/A",
        },
        { label: "Vehicle Color", value: vehicle_color },
        { label: "Seating Capacity", value: capacity },
        { label: "Insurance Number", value: insurance_number },
        {
            label: "Insurance Expiry",
            value: insurance_expiry
                ? new Date(insurance_expiry).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })
                : "N/A",
        },
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Vehicle Details</Text>

            {/* Vehicle Image */}
            <View style={styles.imageContainer}>
                <Image source={getVehicleImage(vehicle_type)} style={styles.vehicleImage} />
            </View>

            {/* Vehicle Details Card */}
            <View style={styles.card}>
                {details.map((item, index) => {
                    if (item.label === "Insurance Expiry") {
                        return (
                            <View key={index} style={styles.detailRow}>
                                <Text style={styles.label}>{item.label}</Text>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text
                                        style={[
                                            styles.value,
                                            isExpired && { color: "red" }, // make date red if expired
                                        ]}
                                    >
                                        {item.value || "N/A"}
                                    </Text>
                                    {isExpired && (
                                        <Text style={styles.expiredText}>(Expired)</Text>
                                    )}
                                </View>
                            </View>
                        );
                    }

                    return (
                        <View key={index} style={styles.detailRow}>
                            <Text style={styles.label}>{item.label}</Text>
                            <Text style={styles.value}>{item.value || "N/A"}</Text>
                        </View>
                    );
                })}
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    Please ensure that your insurance and vehicle registration details are
                    up-to-date. Keeping your documents current is required for approval and
                    a smooth driving experience.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#f9f9f9",
        paddingHorizontal: 20,
        paddingTop: windowHeight(50),
    },
    title: {
        fontSize: fontSizes.FONT22,
        fontFamily: "TT-Octosquares-Medium",
        marginVertical: 20,
        textAlign: "center",
        color: color.primaryText,
    },
    imageContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    vehicleImage: {
        width: 200,
        height: 120,
        resizeMode: "contain",
    },
    card: {
        backgroundColor: color.subPrimary,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        borderColor: color.border,
        borderWidth: 2
    },
    detailRow: {
        marginBottom: 15,
    },
    label: {
        fontSize: fontSizes.FONT14,
        color: color.primaryText,
        fontFamily: "TT-Octosquares-Medium",
        marginBottom: 5,
    },
    value: {
        fontSize: fontSizes.FONT16,
        color: color.lightGray,
        fontFamily: "TT-Octosquares-Medium",
    },
    infoBox: {
        backgroundColor: color.subPrimary,
        borderRadius: 10,
        padding: 15,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderLeftColor: color.lightGray,
        borderColor: color.border,
        borderWidth: 1
    },
    infoText: {
        fontSize: fontSizes.FONT14,
        color: color.lightGray,
        lineHeight: 20,
        fontFamily: "TT-Octosquares-Medium",
    },
    expiredText: {
        color: "red",
        fontSize: fontSizes.FONT14,
        marginLeft: 8,
        fontFamily: "TT-Octosquares-Medium",
    },

});
