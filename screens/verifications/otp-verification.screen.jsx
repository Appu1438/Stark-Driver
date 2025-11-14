import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import SignInText from "@/components/login/signin.text";
import Button from "@/components/common/button";
import { external } from "@/styles/external.style";
import { router, useLocalSearchParams } from "expo-router";
import { commonStyles } from "@/styles/common.style";
import color from "@/themes/app.colors";
import OTPTextInput from "react-native-otp-textinput";
import { styles } from "./styles";
import AuthContainer from "@/utils/container/auth-container";
import { windowHeight } from "@/themes/app.constant";
import axios from "axios";
import { Toast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "@/api/axiosInstance";
import { CommonActions, useNavigation } from '@react-navigation/native';

export default function OtpVerificationScreen() {
    const driver = useLocalSearchParams();
    const [otp, setOtp] = useState("");
    const [loader, setLoader] = useState(false);
    const navigation = useNavigation(); // if TS complains use `useNavigation<any>()`

    const handleSubmit = async () => {
        if (!otp) {
            Toast.show("Please fill the fields!", { placement: "bottom" });
            return;
        }

        setLoader(true);
        const otpNumbers = `${otp}`;

        try {
            if (driver.name) {
                // New driver registration verification
                const res = await axiosInstance.post("/driver/verify-otp", {
                    phone_number: driver.phone_number,
                    otp: otpNumbers,
                    ...driver,
                },
                    {
                        withCredentials: true
                    });

                const driverData = {
                    ...driver,
                    token: res.data.token,
                };

                router.push({
                    pathname: "/(routes)/email-verification",
                    params: driverData,
                });

            } else {
                // Existing driver login
                const res = await axiosInstance.post("/driver/login", {
                    phone_number: driver.phone_number,
                    otp: otpNumbers,
                });

                await AsyncStorage.setItem("accessToken", res.data.accessToken);
                // router.replace("/(tabs)/home"); // ✅ replace to avoid going back to login
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [
                            {
                                // set the tabs navigator as the single root route
                                // route name here should be the name of the tabs navigator or the top-level route,
                                // try "(tabs)" or the actual name used in your app. If that fails, use nested state below.
                                name: "(tabs)",
                                state: {
                                    index: 0,
                                    routes: [{ name: "home" }], // 'home' must match your Tabs.Screen name
                                },
                            },
                        ],
                    })
                );
            }
        } catch (error) {
            let message = "Something went wrong!";
            if (error.response) {
                message = error.response.data?.message || "Invalid OTP or user not found!";
            } else if (error.request) {
                message = "No response from server. Please check your internet.";
            } else {
                message = "Failed to send request. Please try again.";
            }

            Toast.show(message, { placement: "bottom", type: "danger" });
        } finally {
            setLoader(false);
        }
    };

    return (
        <AuthContainer
            topSpace={windowHeight(240)}
            imageShow={true}
            container={
                <View>
                    <SignInText
                        title={"Phone Number Verification"}
                        subtitle={"Check your phone number for the otp!"}
                    />
                    <OTPTextInput
                        handleTextChange={(code) => setOtp(code)}
                        inputCount={4}
                        textInputStyle={styles.otpTextInput}
                        tintColor={color.lightGray}
                        autoFocus={false}
                    />
                    <View style={[external.mt_30]}>
                        <Button
                            title="Verify"
                            onPress={() => handleSubmit()}
                            disabled={loader}
                        />
                    </View>
                    <View style={[external.mb_15]}>
                        <View
                            style={[
                                external.pt_10,
                                external.Pb_10,
                                {
                                    flexDirection: "row",
                                    gap: 5,
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            <Text style={[commonStyles.regularText, {
                                fontFamily: 'TT-Octosquares-Medium',
                            }]}>Not Received yet?</Text>
                            <TouchableOpacity>
                                <Text style={[styles.signUpText, {
                                    color: color.lightGray,
                                    fontFamily: 'TT-Octosquares-Medium',
                                }]}>
                                    Resend it
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
        />
    );
}