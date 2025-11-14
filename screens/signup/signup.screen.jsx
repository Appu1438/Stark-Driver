import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import ProgressBar from "@/components/common/progress.bar";
import { styles } from "./styles";
import { useTheme } from "@react-navigation/native";
import TitleView from "@/components/signup/title.view";
import Input from "@/components/common/input";
import SelectInput from "@/components/common/select-input";
import { countryNameItems } from "@/configs/country--name-list";
import Button from "@/components/common/button";
import color from "@/themes/app.colors";
import { router } from "expo-router";

export default function SignupScreen() {
  const { colors } = useTheme();
  const [emailFormatWarning, setEmailFormatWarning] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    country: "",
    countryCode: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    aadhar: "",
  });

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const gotoDocument = () => {
    const isEmailEmpty = formData.email.trim() === "";
    const isEmailInvalid = !isEmailEmpty && emailFormatWarning !== "";

    if (isEmailEmpty) {
      setShowWarning(true);
    } else if (isEmailInvalid) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
      // const phoneNumberData = countryNameItems.find(
      //   (i: any) => i.label === formData.country
      // );

      const phone_number = `+${formData?.countryCode}${formData.phoneNumber}`;
      console.log(phone_number)
      const selectedCountry = countryNameItems.find(
        (item) => item.value === formData.countryCode
      );
      console.log(selectedCountry.label)


      const driverData = {
        name: formData.name,
        country: selectedCountry.label,
        phone_number,
        email: formData.email,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        aadhar: formData.aadhar,
      };

      router.push({
        pathname: "/(routes)/document-verification",
        params: driverData,
      });
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
        <View>
          {/* logo */}
          <Text
            style={{
              fontFamily: "TT-Octosquares-Medium",
              fontSize: windowHeight(22),
              paddingTop: windowHeight(50),
              textAlign: "center",
              color:color.lightGray
            }}
          >
            Stark Driver
          </Text>
          <View style={{ padding: windowWidth(20) }}>
            <ProgressBar fill={1} />
            <View
              style={[styles.subView, { backgroundColor: colors.background }]}
            >
              <View style={styles.space}>
                <TitleView
                  title={"Create your account"}
                  subTitle={"Explore your life by joining Ride Wave"}
                />

                <SelectInput
                  title=""
                  placeholder="Select your country"
                  value={formData.country} // should be like '91'
                  onValueChange={(val) => {
                    console.log("Selected country value:", val); // logs "91"
                    handleChange("countryCode", val)
                  }}
                  items={countryNameItems}
                  showWarning={false}
                  warning="Please choose your country code!"
                />
                <Input
                  title="Name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChangeText={(text) => handleChange("name", text)}
                  showWarning={showWarning && formData.name === ""}
                  warning={"Please enter your name!"}
                />

                {/* <SelectInput
                title="Country"
                placeholder="Select your country"
                value={formData.country}
                onValueChange={(text) => handleChange("countryCode", text)}
                showWarning={showWarning && formData.country === ""}
                items={countryNameItems}
              /> */}
                <Input
                  title="Phone Number"
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={formData.phoneNumber}
                  onChangeText={(text) => handleChange("phoneNumber", text)}
                  showWarning={showWarning && formData.phoneNumber === ""}
                  warning={"Please enter your phone number!"}
                />
                <Input
                  title={"Email Address"}
                  placeholder={"Enter your email address"}
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(text) => handleChange("email", text)}
                  showWarning={
                    showWarning &&
                    (formData.email === "" || emailFormatWarning !== "")
                  }
                  warning={
                    emailFormatWarning !== ""
                      ? "Please enter your email!"
                      : "Please enter a validate email!"
                  }
                  emailFormatWarning={emailFormatWarning}
                />
                <Input
                  title="Date of Birth"
                  placeholder="DD-MM-YYYY"
                  value={formData.dob}
                  onChangeText={(text) => handleChange("dob", text)}
                  showWarning={showWarning && formData.dob === ""}
                  warning="Please enter your DOB!"
                />

                <SelectInput
                  title="Gender"
                  placeholder="Select gender"
                  value={formData.gender}
                  onValueChange={(val) => handleChange("gender", val)}
                  items={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
                  ]}
                  showWarning={showWarning && formData.gender === ""}
                />

                <Input
                  title="Address"
                  placeholder="Enter your address with zip code"
                  value={formData.address}
                  onChangeText={(text) => handleChange("address", text)}
                  showWarning={showWarning && formData.address === ""}
                />

                <Input
                  title="City"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChangeText={(text) => handleChange("city", text)}
                  showWarning={showWarning && formData.city === ""}
                />

                <Input
                  title="Aadhar Number"
                  placeholder="Enter your Aadhar number"
                  keyboardType="default"
                  value={formData.aadhar}
                  onChangeText={(text) => handleChange("aadhar", text)}
                  showWarning={showWarning && formData.aadhar === ""}
                />

              </View>
              <View style={styles.margin}>
                <Button
                  onPress={gotoDocument}
                  height={windowHeight(30)}
                  title={"Next"}
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