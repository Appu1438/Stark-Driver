// BasicDetails.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { basicStyles } from "./styles";

export default function BasicDetails() {
    const params = useLocalSearchParams();
    const { name, email, phone_number, dob, gender, aadhar, activeDevice } = params;


    const deviceInfo = JSON.parse(activeDevice)
    // console.log(deviceInfo)

    const details = [
        { label: "Full Name", value: name },
        { label: "Email Address", value: email },
        { label: "Phone Number", value: phone_number },
        {
            label: "Date of Birth",
            value: dob ? new Date(dob).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
                : "N/A",
        },
        { label: "Gender", value: gender },
        { label: "Aadhar Number", value: aadhar },
        {
            label: `Current Device`, // what the user sees
            value: `${deviceInfo.brand} ${deviceInfo.model}`,                           // actual value stored
        }
    ];

    return (
        <ScrollView style={basicStyles.container}>
            <Text style={basicStyles.title}>Profile Information</Text>

            <View style={basicStyles.card}>
                {details.map((item, index) => (
                    <View key={index} style={basicStyles.inputBox}>
                        <Text style={basicStyles.label}>{item.label}</Text>
                        <Text style={basicStyles.value}>{item.value || "N/A"}</Text>
                    </View>
                ))}
            </View>

            <View style={basicStyles.infoBox}>
                <Text style={basicStyles.infoText}>
                    Your profile information is verified. If you want to update details,
                    please contact support.
                </Text>
            </View>
        </ScrollView>
    );
}
