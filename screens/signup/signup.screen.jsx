import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
  ActivityIndicator
} from "react-native";
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
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "@/utils/uploads/uploadToCloudinary";
import AppAlert from "@/components/modal/alert-modal/alert.modal";

export default function SignupScreen() {
  const { colors } = useTheme();

  const [emailFormatWarning, setEmailFormatWarning] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // 🚨 AppAlert handler
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    confirmText: "OK",
    showCancel: false,
    onConfirm: () => setShowAlert(false),
    onCancel: () => setShowAlert(false)
  });

  const openAlert = (title, message) => {
    setAlertConfig({
      title,
      message,
      confirmText: "OK",
      showCancel: false,
      onConfirm: () => setShowAlert(false)
    });
    setShowAlert(true);
  };

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
    profilePicture: null
  });

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value
    }));
  };

  // 📸 Pick Image + Upload to Cloudinary
  const pickProfileImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      openAlert("Permission Required", "Please enable storage permission.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true
    });

    if (result.canceled) return;

    const file = result.assets[0];

    setUploadingImage(true); // Loader ON
    const cloudUrl = await uploadToCloudinary(file);
    setUploadingImage(false); // Loader OFF

    if (cloudUrl) {
      handleChange("profilePicture", cloudUrl);
    } else {
      openAlert("Upload Failed", "Unable to upload image. Try again.");
    }
  };

  const gotoDocument = () => {
    const {
      name,
      phoneNumber,
      email,
      countryCode,
      dob,
      gender,
      address,
      city,
      aadhar,
      profilePicture
    } = formData;

    if (!countryCode)
      return openAlert("Missing Country", "Please select your country.");

    if (!name.trim())
      return openAlert("Missing Name", "Please enter your full name.");

    if (!profilePicture)
      return openAlert("Profile Missing", "Please upload your profile picture.");

    if (!phoneNumber.trim())
      return openAlert("Missing Phone", "Please enter your phone number.");

    if (!email.trim())
      return openAlert("Missing Email", "Please enter your email address.");

    if (emailFormatWarning)
      return openAlert("Invalid Email", "Please enter a valid email.");

    if (!dob.trim())
      return openAlert("Missing DOB", "Please enter your date of birth.");

    if (!gender.trim())
      return openAlert("Missing Gender", "Please select your gender.");

    if (!address.trim())
      return openAlert("Missing Address", "Please enter your full address.");

    if (!city.trim())
      return openAlert("Missing City", "Please enter your city.");

    if (!aadhar.trim())
      return openAlert("Missing Aadhar", "Please enter your Aadhar number.");

    const phone_number = `+${countryCode}${phoneNumber}`;

    const selectedCountry = countryNameItems.find(
      (item) => item.value === countryCode
    );

    const driverData = {
      name,
      country: selectedCountry?.label,
      phone_number,
      email,
      dob,
      gender,
      address,
      city,
      aadhar,
      profilePic: profilePicture
    };

    router.push({
      pathname: "/(routes)/document-verification",
      params: driverData
    });
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Text
              style={{
                fontFamily: "TT-Octosquares-Medium",
                fontSize: windowHeight(22),
                paddingTop: windowHeight(50),
                textAlign: "center",
                color: color.lightGray
              }}
            >
              Stark Driver
            </Text>

            <View style={{ padding: windowWidth(20) }}>
              <ProgressBar fill={1} />
              <View
                style={[styles.subView, { backgroundColor: colors.background }]}
              >
                <View className={styles.space}>
                  <TitleView
                    title={"Create your account"}
                    subTitle={"Explore your life by joining Ride Wave"}
                  />

                  {/* Country */}
                  <SelectInput
                    placeholder="Select your country"
                    value={formData.countryCode}
                    onValueChange={(val) => handleChange("countryCode", val)}
                    items={countryNameItems}
                    showWarning={false}
                  />

                  {/* Name */}
                  <Input
                    title="Name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChangeText={(text) => handleChange("name", text)}
                  />

                  {/* Upload Photo */}
                  <View style={{ alignItems: "center", marginVertical: 20 }}>
                    <Pressable
                      onPress={pickProfileImage}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        backgroundColor: color.border,
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden"
                      }}
                    >
                      {uploadingImage ? (
                        <ActivityIndicator size="large" color={color.primaryGray} />
                      ) : formData.profilePicture ? (
                        <Image
                          source={{ uri: formData.profilePicture }}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <Text style={{ color: color.lightGray }}>
                          Upload Photo
                        </Text>
                      )}
                    </Pressable>
                  </View>

                  {/* Phone */}
                  <Input
                    title="Phone Number"
                    placeholder="Without country code"
                    keyboardType="phone-pad"
                    value={formData.phoneNumber}
                    onChangeText={(text) => handleChange("phoneNumber", text)}
                  />

                  {/* Email */}
                  <Input
                    title="Email Address"
                    placeholder="Enter your email address"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => handleChange("email", text)}
                    emailFormatWarning={emailFormatWarning}
                  />

                  {/* DOB */}
                  <Input
                    title="Date of Birth"
                    placeholder="DD-MM-YYYY"
                    value={formData.dob}
                    onChangeText={(text) => handleChange("dob", text)}
                  />

                  {/* Gender */}
                  <SelectInput
                    title="Gender"
                    placeholder="Select gender"
                    value={formData.gender}
                    onValueChange={(val) => handleChange("gender", val)}
                    items={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" }
                    ]}
                  />

                  {/* Address */}
                  <Input
                    title="Address"
                    placeholder="Enter your address with zip code"
                    value={formData.address}
                    onChangeText={(text) => handleChange("address", text)}
                  />

                  {/* City */}
                  <Input
                    title="City"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChangeText={(text) => handleChange("city", text)}
                  />

                  {/* Aadhar */}
                  <Input
                    title="Aadhar Number"
                    placeholder="Enter your Aadhar number"
                    value={formData.aadhar}
                    onChangeText={(text) => handleChange("aadhar", text)}
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

      {/* 🔔 AppAlert Modal */}
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
