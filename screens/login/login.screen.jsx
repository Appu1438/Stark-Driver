import { View, Text, Image, TouchableOpacity, Alert, BackHandler, Platform } from "react-native";
import React, { useCallback, useState } from "react";
import AuthContainer from "@/utils/container/auth-container";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { styles } from "./styles";
import Images from "@/utils/images";
import SignInText from "@/components/login/signin.text";
import { external } from "@/styles/external.style";
import Button from "@/components/common/button";
import { router } from "expo-router";
import PhoneNumberInput from "@/components/login/phone-number.input";
import { Toast } from "react-native-toast-notifications";
import axios from 'axios'
import axiosInstance from "@/api/axiosInstance";
import { useFocusEffect } from "@react-navigation/native";
import color from "@/themes/app.colors";

export default function LoginScreen() {
  const [phone_number, setphone_number] = useState("");
  const [loading, setloading] = useState(false);
  const [countryCode, setCountryCode] = useState("91");

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Exit", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: true }
        );
        return true; // Prevent default back behavior
      };

      if (Platform.OS === "android") {
        const subscription = BackHandler.addEventListener(
          "hardwareBackPress",
          onBackPress
        );

        // Cleanup on unmount
        return () => subscription.remove();
      }
    }, [])
  );

  const handleSubmit = async () => {
    if (!phone_number || !countryCode) {
      Toast.show("Please fill the fields!", {
        placement: "bottom",
      });
      return;
    }

    try {
      setloading(true);
      const phoneNumber = `+${countryCode}${phone_number}`;

      const res = await axiosInstance.post("/driver/send-otp", {
        phone_number: phoneNumber,
      });

      setloading(false);

      // Navigate to OTP Verification screen with phone number
      router.push({
        pathname: "/(routes)/otp-verification",
        params: { phone_number: phoneNumber },
      });
    } catch (error) {
      console.log("Send OTP Error:", error);
      setloading(false);
      Toast.show("Something went wrong! Please re-check your phone number!", {
        type: "danger",
        placement: "bottom",
      });
    }
  };


  return (
    <AuthContainer
      topSpace={windowHeight(150)}
      imageShow={true}
      container={
        <View>
          <View>
            <View>
              <Image style={styles.transformLine} source={Images.line} />
              <SignInText />
              <View style={[external.mt_25, external.Pb_10]}>
                <PhoneNumberInput
                  phone_number={phone_number}
                  setphone_number={setphone_number}
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                />
                <View style={[external.mt_25, external.Pb_15]}>
                  <Button
                    title={loading?"Sending Otp":"Get Otp"}
                    disabled={loading}
                    onPress={() => handleSubmit()}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: windowWidth(8),
                    paddingBottom: windowHeight(15),
                  }}
                >
                  <Text style={{
                    fontSize: windowHeight(10),
                    fontFamily: 'TT-Octosquares-Medium',
                    color: color.primaryText,
                  }}>
                    Don't have any rider account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(routes)/signup")}
                  >
                    <Text style={{
                      fontSize: windowHeight(10), fontFamily: 'TT-Octosquares-Medium',
                      color: color.primaryText,

                    }}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      }
    />
  );
}