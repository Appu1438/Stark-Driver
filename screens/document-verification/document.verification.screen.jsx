import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import ProgressBar from "@/components/common/progress.bar";
import { styles } from "../signup/styles";
import { useTheme } from "@react-navigation/native";
import TitleView from "@/components/signup/title.view";
import Input from "@/components/common/input";
import SelectInput from "@/components/common/select-input";
import Button from "@/components/common/button";
import color from "@/themes/app.colors";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Toast } from "react-native-toast-notifications";
import axiosInstance from "@/api/axiosInstance";

export default function DocumentVerificationScreen() {
    const driverData = useLocalSearchParams();
    const { colors } = useTheme();
    const [showWarning, setShowWarning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        vehicleType: "Sedan",
        capacity: "",
        registration_number: "",
        registration_date: "",
        driving_license: "",
        color: "",
        license_expiry: "",
        insurance_number: "",
        insurance_expiry: "",
    });

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
        // console.log(formData)
    };

    const handleSubmit = async () => {
        setLoading(true);

        const driver = {
            ...driverData,
            vehicle_type: formData.vehicleType,
            registration_number: formData.registration_number,
            registration_date: formData.registration_date,
            driving_license: formData.driving_license,
            license_expiry: formData.license_expiry,
            insurance_number: formData.insurance_number,
            insurance_expiry: formData.insurance_expiry,
            vehicle_color: formData.color,
            capacity: formData.capacity,
        };

        console.log(driver);

        try {
            const res = await axiosInstance.post("driver/send-otp", {
                phone_number: `${driverData.phone_number}`,
            });

            router.push({
                pathname: "/(routes)/otp-verification",
                params: driver,
            });

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong. Please try again.";

            Toast.show(message, {
                placement: "bottom",
                type: "danger",
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : 'height'}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ flex: 1 }}>
                    {/* logo */}
                    <Text
                        style={{
                            fontFamily: "TT-Octosquares-Medium",
                            fontSize: windowHeight(22),
                            paddingTop: windowHeight(50),
                            textAlign: "center",
                        }}
                    >
                        Stark
                    </Text>

                    <View style={{ padding: windowWidth(20), flex: 1 }}>
                        <ProgressBar fill={2} />
                        <View style={[styles.subView, { backgroundColor: colors.background }]}>
                            <View style={styles.space}>
                                <TitleView
                                    title={"Vehicle Registration"}
                                    subTitle={"Explore your life by joining Stark"}
                                />

                                <SelectInput
                                    title="Vehicle Type"
                                    placeholder="Choose your vehicle type"
                                    value={formData.vehicleType}
                                    onValueChange={(text) => handleChange("vehicleType", text)}
                                    showWarning={showWarning && formData.vehicleType === ""}
                                    warning={"Please choose your vehicle type!"}
                                    items={[
                                        { label: "Sedan", value: "Sedan" },
                                        { label: "Auto", value: "Auto" },
                                        { label: "Hatchback", value: "Hatchback" },
                                        { label: "Suv", value: "Suv" },
                                    ]}
                                />

                                <Input
                                    title="Maximum Capacity"
                                    placeholder="In persons"
                                    value={formData.capacity}
                                    // keyboardType='number-pad'
                                    onChangeText={(text) =>
                                        handleChange("capacity", text)
                                    }
                                    showWarning={showWarning && formData.capacity === ""}
                                    warning={"Please enter your vehicle capacity!"}
                                />
                                <Input
                                    title="Registration Number"
                                    placeholder="KL-00-AA-0000"
                                    value={formData.registration_number}
                                    onChangeText={(text) =>
                                        handleChange("registration_number", text)
                                    }
                                    showWarning={showWarning && formData.registration_number === ""}
                                    warning={"Please enter your vehicle registration number!"}
                                    keyboardType="default"   // ✅ alphanumeric

                                />

                                <Input
                                    title="Vehicle Registration Date"
                                    placeholder="DD-MM-YYYY"
                                    keyboardType="default"
                                    value={formData.registration_date}
                                    onChangeText={(text) =>
                                        handleChange("registration_date", text)
                                    }
                                    showWarning={showWarning && formData.registration_date === ""}
                                    warning={"Please enter your vehicle registration date!"}

                                />

                                <Input
                                    title={"Driving License Number"}
                                    placeholder={"Enter your driving license number"}
                                    value={formData.driving_license}
                                    onChangeText={(text) =>
                                        handleChange("driving_license", text)
                                    }
                                    showWarning={showWarning && formData.driving_license === ""}
                                    warning={"Please enter your driving license number!"}
                                />

                                <Input
                                    title={"Vehicle Color"}
                                    placeholder={"Enter your vehicle color"}
                                    value={formData.color}
                                    onChangeText={(text) => handleChange("color", text)}
                                    showWarning={showWarning && formData.color === ""}
                                    warning={"Please enter your vehicle color!"}
                                />

                                <Input
                                    title="License Expiry Date"
                                    placeholder="DD-MM-YYYY"
                                    value={formData.license_expiry}
                                    onChangeText={(text) => handleChange("license_expiry", text)}
                                    showWarning={showWarning && formData.license_expiry === ""}
                                />

                                <Input
                                    title="Insurance Number"
                                    placeholder="Enter your insurance number"
                                    value={formData.insurance_number}
                                    onChangeText={(text) => handleChange("insurance_number", text)}
                                    showWarning={showWarning && formData.insurance_number === ""}
                                />

                                <Input
                                    title="Insurance Expiry Date"
                                    placeholder="DD-MM-YYYY"
                                    value={formData.insurance_expiry}
                                    onChangeText={(text) => handleChange("insurance_expiry", text)}
                                    showWarning={showWarning && formData.insurance_expiry === ""}
                                />

                            </View>

                            <View style={styles.margin}>
                                <Button
                                    onPress={() => handleSubmit()}
                                    title={"Submit"}
                                    backgroundColor={color.buttonBg}
                                    textColor={color.primary}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}