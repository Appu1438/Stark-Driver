import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AuthContainer from "@/utils/container/auth-container";
import { windowHeight } from "@/themes/app.constant";
import SignInText from "@/components/login/signin.text";
import { commonStyles } from "@/styles/common.style";
import { external } from "@/styles/external.style";
import Button from "@/components/common/button";
import { styles } from "./styles";
import color from "@/themes/app.colors";
import { Toast } from "react-native-toast-notifications";
import OTPTextInput from "react-native-otp-textinput";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "@/api/axiosInstance";

export default function EmailVerificationScreen() {
  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const driver = useLocalSearchParams();

  const handleSubmit = async () => {
    setLoader(true);
    const otpNumbers = `${otp}`;

    try {
      const res = await axiosInstance.post("/driver/registration-driver", {
        token: driver.token,
        otp: otpNumbers,
      });

      const message =
        res?.data?.message || res.message || "Something went wrong. Please try again.";

      Toast.show(message, {
        placement: "bottom",
        duration: 4000,
        type: "success",
      });

      router.replace("/(routes)/login"); // Use replace to prevent going back

    } catch (erro) {
      const message =
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      Toast.show(message, {
        placement: "bottom",
        type: "danger",
      });
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
            title={"Email Verification"}
            subtitle={"Check your email address for the otp!"}
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
              title={loader ? "Verifying Otp" : "Verify Otp"}
              onPress={() => handleSubmit()}
              disabled={loader}
            />
          </View>
          <View style={[external.mb_15]}>
            <View
              style={[
                external.pt_10,
                external.Pb_10,
                { flexDirection: "row", gap: 5, justifyContent: "center" },
              ]}
            >
              <Text style={[commonStyles.regularText, {
                fontFamily: 'TT-Octosquares-Medium',
              }]}>Not Received yet?</Text>
              <TouchableOpacity>
                <Text style={[styles.signUpText,
                {
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