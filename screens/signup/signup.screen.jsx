import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";

// Internal Utils
import { fontSizes, windowHeight } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import { uploadToCloudinary } from "@/utils/uploads/uploadToCloudinary";
import AppAlert from "@/components/modal/alert-modal/alert.modal";
import { SafeAreaView } from "react-native-safe-area-context";

const COUNTRY_CODE = "+91";

export default function SignupScreen() {
  // --- State Management ---
  const scrollViewRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [movingToNext, setMovingToNext] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  // Date Picker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formattedDob, setFormattedDob] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    profilePic: null,
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    country: "India",
    countryCode: "IN",
    aadhar: "",
  });

  // --- Handlers ---
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const openAlert = (title, message) => {
    setAlertConfig({
      title,
      message,
      confirmText: "OK",
      showCancel: false,
      onConfirm: () => setShowAlert(false),
    });
    setShowAlert(true);
  };

  // 📅 Date Picker Handler
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

    if (selectedDate) {
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const dobString = `${day}-${month}-${year}`;

      setFormattedDob(dobString);
      handleChange("dob", dobString);

      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
    }
  };

  // Image Picker
  const pickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return openAlert("Permission", "Storage permission needed.");

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled) {
      setUploadingImage(true);
      handleChange('profilePic', result.assets[0])
      setUploadingImage(false);
    }
  };

  // Validation & Navigation
  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.profilePic) return openAlert("Profile Picture", "Please upload a photo.");
      if (!formData.name.trim()) return openAlert("Name", "Enter your full name.");
      if (!formData.gender) return openAlert("Gender", "Select your gender.");
      if (!formData.dob) return openAlert("DOB", "Select your Date of Birth.");
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (!formData.phoneNumber) return openAlert("Phone", "Enter phone number.");
      if (!formData.email) return openAlert("Email", "Enter email address.");
      setCurrentStep(2);
    } else {
      handleSubmit();
    }
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else router.back();
  };

  const handleSubmit = async () => {
    if (!formData.address) return openAlert("Address", "Enter your address.");
    if (!formData.city) return openAlert("City", "Enter your city.");
    if (!formData.aadhar) return openAlert("Aadhar", "Enter Aadhar number.");

    setMovingToNext(true)

    const cloudUrl = await uploadToCloudinary(formData.profilePic.base64);


    const finalData = {
      ...formData,
      phone_number: `${COUNTRY_CODE}${formData.phoneNumber}`,
      profilePic: cloudUrl,
    };

    router.push({
      pathname: "/(routes)/document-verification",
      params: finalData,
    });

    setMovingToNext(false)
  };

  // --- Render Steps ---

  // Step 1: Identity
  const renderIdentityStep = () => (
    <View style={styles.stepContainer}>
      {/* Image Upload */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickProfileImage} style={styles.avatarWrapper}>
          {uploadingImage ? (
            <ActivityIndicator color={color.buttonBg} size="large" />
          ) : formData.profilePic ? (
            <Image source={{ uri: formData.profilePic.uri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <FontAwesome5 name="camera" size={24} color={color.primaryText} style={{ opacity: 0.5 }} />
              <Text style={styles.avatarText}>Upload</Text>
            </View>
          )}
          <View style={styles.editBadge}>
            <MaterialIcons name="edit" size={12} color={color.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <CustomInput label="Full Name" placeholder="e.g. John Doe" value={formData.name} onChangeText={t => handleChange('name', t)} icon="person" />

      {/* 📅 Date Picker UI */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputWrapper}>
          <MaterialIcons name="calendar-today" size={20} color={color.primaryText} style={{ marginRight: 10, opacity: 0.7 }} />
          <Text style={[styles.input, !formattedDob && { color: color.lightGray }]}>
            {formattedDob || "Select Date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
            themeVariant="dark" // Forces dark theme on iOS
          />
        )}
      </View>

      {/* Gender Selection */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderRow}>
        {["Male", "Female", "Other"].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.genderChip, formData.gender === g && styles.genderChipSelected]}
            onPress={() => handleChange("gender", g)}
          >
            <Text style={[styles.genderText, formData.gender === g && styles.genderTextSelected]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Step 2: Contact
  const renderContactStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.infoBox}>
        <MaterialIcons name="security" size={20} color={color.buttonBg} />
        <Text style={styles.infoText}>We use this info to verify your identity.</Text>
      </View>

      <CustomInput label="Phone Number" placeholder="9876543210" value={formData.phoneNumber} onChangeText={t => handleChange('phoneNumber', t)} keyboardType="phone-pad" prefix="+91" icon="phone" />
      <CustomInput label="Email Address" placeholder="john@example.com" value={formData.email} onChangeText={t => handleChange('email', t)} keyboardType="email-address" icon="email" />
    </View>
  );

  // Step 3: Location
  const renderLocationStep = () => (
    <View style={styles.stepContainer}>
      <CustomInput label="Street Address" placeholder="House No, Street, Area , Pincode" value={formData.address} onChangeText={t => handleChange('address', t)} icon="home" />
      <CustomInput label="City" placeholder="e.g. Mumbai" value={formData.city} onChangeText={t => handleChange('city', t)} icon="location-city" />
      <View style={styles.divider} />
      <CustomInput label="Aadhar Number" placeholder="12 Digit ID" value={formData.aadhar} onChangeText={t => handleChange('aadhar', t)} keyboardType="numeric" icon="credit-card" />
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Ensure the Aadhar matches documents uploaded next.</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={color.primaryText} />
          </TouchableOpacity>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${((currentStep + 1) / 3) * 100}%` }]} />
          </View>
          <Text style={styles.stepIndicator}>{currentStep + 1}/3</Text>
        </View>

        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageTitle}>
            {currentStep === 0 ? "Let's start with basics" : currentStep === 1 ? "Contact Details" : "Location & Legal"}
          </Text>
          <Text style={styles.pageSubtitle}>
            {currentStep === 0 ? "Tell us a bit about yourself." : currentStep === 1 ? "How can we reach you?" : "Where are you based?"}
          </Text>

          {currentStep === 0 && renderIdentityStep()}
          {currentStep === 1 && renderContactStep()}
          {currentStep === 2 && renderLocationStep()}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, movingToNext && { opacity: 0.6 }]}
            onPress={handleNext}
            disabled={movingToNext}
          >
            {movingToNext ? (
              <ActivityIndicator size="small" color={color.primary} />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {currentStep === 2 ? "Upload Documents" : "Continue"}
                </Text>
                <Ionicons name="arrow-forward" size={20} color={color.primary} />
              </>
            )}
          </TouchableOpacity>
        </View>


      </KeyboardAvoidingView>

      <AppAlert visible={showAlert} {...alertConfig} />
    </SafeAreaView>
  );
}

// --- Reusable Component ---
const CustomInput = ({ label, placeholder, value, onChangeText, icon, keyboardType, prefix }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      {icon && <MaterialIcons name={icon} size={20} color={color.primaryText} style={{ marginRight: 10, opacity: 0.7 }} />}
      {prefix && <Text style={styles.prefix}>{prefix}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={color.lightGray || "#666"}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // Background handled by parent container or transparent
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 5,
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: color.border || "rgba(255,255,255,0.1)",
    borderRadius: 2,
    marginHorizontal: 15,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: color.buttonBg,
    borderRadius: 2,
  },
  stepIndicator: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT14,
    color: color.primaryText,
    opacity: 0.7,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  pageTitle: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT20,
    color: color.primaryText,
    marginBottom: 8,
    marginTop: 10,
  },
  pageSubtitle: {
    fontSize: fontSizes.FONT14,
    color: color.primaryText,
    opacity: 0.6,
    marginBottom: 30,
    lineHeight: 20,
    fontFamily: "TT-Octosquares-Medium",
  },
  stepContainer: {
    gap: 0,
  },

  // Avatar
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: color.border || "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    alignItems: "center",
  },
  avatarText: {
    fontSize: fontSizes.FONT12,
    color: color.primaryText,
    marginTop: 4,
    opacity: 0.5,
    fontFamily: "TT-Octosquares-Medium",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: color.buttonBg,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  // Input
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: fontSizes.FONT14,
    color: color.primaryText,
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: "TT-Octosquares-Medium",
    opacity: 0.8
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.border || "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 52,
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    fontSize: fontSizes.FONT16,
    color: color.primaryText,
    fontFamily: "TT-Octosquares-Medium",
    paddingVertical: 10,
  },
  prefix: {
    fontSize: fontSizes.FONT16,
    color: color.primaryText,
    marginRight: 10,
    fontFamily: "TT-Octosquares-Medium",
  },

  // Gender
  genderRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 5,
  },
  genderChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: color.border || "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  genderChipSelected: {
    backgroundColor: color.buttonBg,
    borderColor: color.buttonBg,
  },
  genderText: {
    color: color.primaryText,
    fontFamily: "TT-Octosquares-Medium",
    opacity: 0.7
  },
  genderTextSelected: {
    color: color.primary, // Dark Text for selected state
    opacity: 1
  },

  // Info Box
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 25,
  },
  infoText: {
    fontSize: fontSizes.FONT12,
    color: color.primaryText,
    flex: 1,
    lineHeight: 18,
    fontFamily: "TT-Octosquares-Medium",
    opacity: 0.8
  },
  divider: {
    height: 1,
    backgroundColor: color.border || "rgba(255,255,255,0.1)",
    marginVertical: 10,
    marginBottom: 25,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    paddingHorizontal: 24,
    // Optional: Add a subtle gradient or solid dark background if main bg is image
    // backgroundColor: color.bgDark, 
  },
  nextButton: {
    backgroundColor: color.buttonBg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  nextButtonText: {
    color: color.primary,
    fontSize: fontSizes.FONT16,
    fontFamily: "TT-Octosquares-Medium",
  },
});