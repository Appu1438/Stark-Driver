import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  Platform,
  ActivityIndicator,
} from "react-native";
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
import axiosInstance from "@/api/axiosInstance";
import { useFocusEffect } from "@react-navigation/native";
import color from "@/themes/app.colors";
import AppAlert from "@/components/modal/alert-modal/alert.modal";

export default function LoginScreen() {
  const [phone_number, setphone_number] = useState("");
  const [loading, setloading] = useState(false);
  const [countryCode, setCountryCode] = useState("91");

  // 🔔 Custom Alert State
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    confirmText: "OK",
    showCancel: true,
    onConfirm: () => setShowAlert(false),
    onCancel: () => setShowAlert(false),
  });

  // 🔥 Replace Alert.alert with AppAlert
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setAlertConfig({
          title: "Exit App",
          message: "Are you sure you want to exit?",
          confirmText: "Exit",
          showCancel: true,
          onCancel: () => setShowAlert(false),
          onConfirm: () => {
            setShowAlert(false);
            BackHandler.exitApp();
          },
        });
        setShowAlert(true);
        return true;
      };

      if (Platform.OS === "android") {
        const subscription = BackHandler.addEventListener(
          "hardwareBackPress",
          onBackPress
        );
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


      // ✅ SUCCESS TOAST
      Toast.show(
        res.data.message || res.data.data.message || "Whatsapp OTP sent successfully",
        {
          type: "success",
          placement: "bottom",
          duration: 2000, // optional
        }
      );

      // ⏳ Small delay so user sees the toast
      setTimeout(() => {
        router.push({
          pathname: "/(routes)/otp-verification",
          params: { phone_number: phoneNumber },
        });
      }, 600);


    } catch (error) {
      setloading(false);

      console.log("Send OTP Error:", error?.response?.data);

      // Extract backend message
      const message =
        error?.response?.data?.message ||
        "Unable to send OTP. Please try again.";

      Toast.show(message, {
        type: "danger",
        placement: "bottom",
      });
    }
  };


  return (
    <>
      <AuthContainer
        topSpace={windowHeight(150)}
        imageShow={true}
        container={
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
                    title={
                      loading ? (
                        <ActivityIndicator color={color.primary} />
                      ) : (
                        "Get OTP"
                      )
                    }
                    disabled={loading}
                    onPress={handleSubmit}
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
                  <Text
                    style={{
                      fontSize: windowHeight(10),
                      fontFamily: "TT-Octosquares-Medium",
                      color: color.primaryText,
                    }}
                  >
                    Don't have any rider account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(routes)/signup")}
                  >
                    <Text
                      style={{
                        fontSize: windowHeight(10),
                        fontFamily: "TT-Octosquares-Medium",
                        color: color.primaryText,
                      }}
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        }
      />

      {/* 🔔 AppAlert Component */}
      <AppAlert
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        showCancel={alertConfig.showCancel}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />
    </>
  );
}
