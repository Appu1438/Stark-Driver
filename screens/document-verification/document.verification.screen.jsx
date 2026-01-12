import React, { useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    ActivityIndicator,
    TextInput
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Toast } from "react-native-toast-notifications";
// Internal Utils
import axiosInstance from "@/api/axiosInstance";
import AppAlert from "@/components/modal/alert-modal/alert.modal";
import color from "@/themes/app.colors";
import { fontSizes, windowHeight } from "@/themes/app.constant";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import SelectInput from "@/components/common/select-input";
import { uploadToCloudinary } from "@/utils/uploads/uploadToCloudinary";

export default function DocumentVerificationScreen() {
    const driverData = useLocalSearchParams();
    const scrollViewRef = useRef(null);


    // --- State ---
    const [currentStep, setCurrentStep] = useState(0); // 0: Vehicle, 1: Reg, 2: Docs
    const [loading, setLoading] = useState(false);

    // Alert State
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    // Date Picker State
    const [showRegPicker, setShowRegPicker] = useState(false);
    const [showLicPicker, setShowLicPicker] = useState(false);
    const [showInsPicker, setShowInsPicker] = useState(false);

    const [regDateObj, setRegDateObj] = useState(new Date());
    const [licDateObj, setLicDateObj] = useState(new Date());
    const [insDateObj, setInsDateObj] = useState(new Date());

    const [showRegInfo, setShowRegInfo] = useState(false);

    const formatDate = (d) => {
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatRegistrationNumber = (text) => {

        // If user types "-" manually → show info (only once)
        if (text.includes("-") && !showRegInfo) {
            setShowRegInfo(true);
            openAlert("Hyphens will be added automatically", "Just type the number")
        }

        // Remove all non-alphanumeric characters
        let value = text.toUpperCase().replace(/[^A-Z0-9]/g, "");

        let state = value.slice(0, 2);         // KL
        let rto = value.slice(2, 4);           // 32

        // Series = next letters until first number appears OR max 3 letters
        let series = value.slice(4).match(/^[A-Z]{1,3}/)?.[0] || "";

        // Unique number = remaining digits after letters
        let unique = value.slice(4 + series.length).replace(/[^0-9]/g, "").slice(0, 4);

        let formatted = state;

        if (rto) formatted += "-" + rto;
        if (series) formatted += "-" + series;
        if (unique) formatted += "-" + unique;

        return formatted;
    };



    const twentyFiveYearsFromNow = new Date();
    twentyFiveYearsFromNow.setFullYear(twentyFiveYearsFromNow.getFullYear() + 50);

    const [formData, setFormData] = useState({
        vehicleType: "Sedan",
        capacity: "",
        color: "",
        registration_number: "",
        registration_date: "",
        driving_license: "",
        license_expiry: "",
        insurance_number: "",
        insurance_expiry: "",
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

    const onRegDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setRegDateObj(selectedDate); // ✅ store Date object
            handleChange("registration_date", formatDate(selectedDate));
        }
        // if (Platform.OS === "android") 
        setShowRegPicker(false);
    };

    const onLicDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setLicDateObj(selectedDate);
            handleChange("license_expiry", formatDate(selectedDate));
        }
        // if (Platform.OS === "android") 
        setShowLicPicker(false);
    };

    const onInsDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setInsDateObj(selectedDate);
            handleChange("insurance_expiry", formatDate(selectedDate));
        }
        // if (Platform.OS === "android") 
        setShowInsPicker(false);
    };


    // Navigation Logic
    const handleNext = () => {
        if (currentStep === 0) {
            if (!formData.capacity) return openAlert("Capacity", "Enter max capacity.");
            if (!formData.color) return openAlert("Color", "Enter vehicle color.");
            setCurrentStep(1);
        } else if (currentStep === 1) {
            if (!formData.registration_number) return openAlert("Registration", "Enter Reg. Number.");
            if (!formData.registration_date) return openAlert("Reg. Date", "Enter Registration Date.");
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
        // Final Validation
        if (!formData.driving_license) return openAlert("License", "Enter Driving License No.");
        if (!formData.license_expiry) return openAlert("License Expiry", "Enter License Expiry Date.");
        if (!formData.insurance_number) return openAlert("Insurance", "Enter Insurance No.");
        if (!formData.insurance_expiry) return openAlert("Insurance Expiry", "Enter Insurance Expiry Date.");

        setLoading(true);

        const payload = {
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

        try {
            await axiosInstance.post("driver/send-otp", {
                phone_number: `${driverData.phone_number}`,
            });

            router.push({
                pathname: "/(routes)/otp-verification",
                params: payload,
            });
        } catch (error) {
            Toast.show("Failed to send OTP. Try again.", { type: "danger", placement: "bottom" });
        } finally {
            setLoading(false);
        }
    };

    // --- Render Steps ---

    // Step 1: Vehicle Info
    const renderVehicleStep = () => (
        <View style={styles.stepContainer}>
            {/* Vehicle Type Select */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Type</Text>

                <SelectInput
                    title="Vehicle Type"
                    placeholder="Choose your vehicle type"
                    value={formData.vehicleType}
                    onValueChange={(text) => handleChange("vehicleType", text)}
                    items={[
                        { label: "Sedan", value: "Sedan" },
                        { label: "Auto", value: "Auto" },
                        { label: "Hatchback", value: "Hatchback" },
                        { label: "Suv", value: "Suv" },
                    ]}
                />
            </View>
            <CustomInput label="Vehicle Color" placeholder="e.g. White" value={formData.color} onChangeText={t => handleChange("color", t)} icon="palette" />
            <CustomInput label="Seating Capacity" placeholder="e.g. 4" value={formData.capacity} onChangeText={t => handleChange("capacity", t)} keyboardType="numeric" icon="users" />
        </View>
    );

    // Step 2: Registration
    const renderRegistrationStep = () => (
        <View style={styles.stepContainer}>
            <View style={styles.infoBox}>
                <MaterialIcons name="info" size={20} color={color.buttonBg} />
                <Text style={styles.infoText}>Enter details exactly as they appear on your RC Book.</Text>
            </View>

            <CustomInput
                label="Registration Number"
                placeholder="KL-01-AB-1234"
                value={formData.registration_number}
                onChangeText={(t) => handleChange("registration_number", formatRegistrationNumber(t))}
                icon="credit-card"
            />

            <DateInput
                label="Registration Date"
                value={formData.registration_date}
                onPress={() => setShowRegPicker(true)}
            />
            {showRegPicker && (
                <DateTimePicker
                    value={regDateObj || new Date()}   // ✅ FIX
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onRegDateChange}
                    maximumDate={new Date()}
                    themeVariant="dark"
                />
            )}


        </View>
    );

    // Step 3: Legal & Insurance
    const renderDocsStep = () => (
        <View style={styles.stepContainer}>
            <View style={styles.infoBox}>
                <MaterialIcons name="info" size={20} color={color.buttonBg} />
                <Text style={styles.infoText}>
                    You need to send all your documents to{"\n"}
                    <Text style={{ color: color.buttonBg }}>starkopc@gmail.com</Text> or{" \n"}
                    <Text style={{ color: color.buttonBg }}>starkopcpvtltd@gmail.com</Text>  {"\n"}
                    Inclusive Aadhar , RC , License , Insurance
                </Text>
            </View>
            <CustomInput label="Driving License Number" placeholder="DL-1234567890" value={formData.driving_license} onChangeText={t => handleChange("driving_license", t)} icon="id-card" />
            <DateInput
                label="License Expiry Date"
                value={formData.license_expiry}
                onPress={() => setShowLicPicker(true)}
            />
            {showLicPicker && (
                <DateTimePicker
                    value={licDateObj || new Date()}   // ✅ FIX
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onLicDateChange}
                    maximumDate={twentyFiveYearsFromNow}
                    themeVariant="dark"
                />
            )}



            <View style={styles.divider} />

            <CustomInput label="Insurance Policy Number" placeholder="Policy No." value={formData.insurance_number} onChangeText={t => handleChange("insurance_number", t)} icon="file-contract" />
            <DateInput
                label="Insurance Expiry Date"
                value={formData.insurance_expiry}
                onPress={() => setShowInsPicker(true)}
            />

            {showInsPicker && (
                <DateTimePicker
                    value={insDateObj || new Date()}   // ✅ FIX
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onInsDateChange}
                    maximumDate={twentyFiveYearsFromNow}
                    themeVariant="dark"
                />
            )}


        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

                {/* Header */}
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
                        {currentStep === 0 ? "Vehicle Details" : currentStep === 1 ? "Registration Info" : "Documents & Legal"}
                    </Text>
                    <Text style={styles.pageSubtitle}>
                        {currentStep === 0 ? "Tell us about your vehicle." : currentStep === 1 ? "Official registration details." : "Verify your license and insurance."}
                    </Text>

                    {currentStep === 0 && renderVehicleStep()}
                    {currentStep === 1 && renderRegistrationStep()}
                    {currentStep === 2 && renderDocsStep()}

                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={loading}>
                        {loading ? <ActivityIndicator color={color.primary} /> : (
                            <>
                                <Text style={styles.nextButtonText}>{currentStep === 2 ? "Submit & Verify" : "Continue"}</Text>
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

// --- Components ---
const CustomInput = ({ label, placeholder, value, onChangeText, icon, keyboardType }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
            {icon && <FontAwesome5 name={icon} size={18} color={color.primaryText} style={{ marginRight: 12, opacity: 0.7 }} />}
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

const DateInput = ({ label, value, onPress }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity onPress={onPress} style={styles.inputWrapper}>
            <MaterialIcons name="calendar-today" size={20} color={color.primaryText} style={{ marginRight: 12, opacity: 0.7 }} />
            <Text style={[styles.input, !value && { color: color.lightGray }]}>{value || "Select Date"}</Text>
        </TouchableOpacity>
    </View>
);

// --- Styles ---
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
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

    scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
    pageTitle: { fontFamily: "TT-Octosquares-Medium", fontSize: fontSizes.FONT20, color: color.primaryText, marginTop: 10, marginBottom: 5 },
    pageSubtitle: { fontSize: fontSizes.FONT14, color: color.primaryText, opacity: 0.6, marginBottom: 30, fontFamily: "TT-Octosquares-Medium" },
    stepContainer: { gap: 0 },

    // Vehicle Type Grid
    // Vehicle Type Grid
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Ensures even spacing
        gap: 12, // Gap for modern spacing
        marginBottom: 25,
    },
    typeCard: {
        width: '48%', // Fits 2 per row perfectly with gap
        aspectRatio: 1.2, // Makes them slightly wider rectangles, looks more premium than squares
        backgroundColor: "rgba(255,255,255,0.03)", // Very subtle glass effect
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        borderRadius: 16, // Softer corners
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative', // For the radio circle positioning
    },
    typeCardSelected: {
        backgroundColor: "rgba(255,255,255,0.08)", // Slightly lighter when selected
        borderColor: color.buttonBg, // Highlight border
        borderWidth: 1.5,
    },
    typeText: {
        color: color.primaryText,
        fontFamily: "TT-Octosquares-Medium",
        fontSize: fontSizes.FONT14,
        opacity: 0.6,
        marginTop: 5
    },
    typeTextSelected: {
        color: color.primaryText, // Keep text white/primary
        opacity: 1,
        fontWeight: 'bold', // Optional if font supports it, or rely on opacity
    },

    // New: Selection Badge
    radioCircle: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioCircleSelected: {
        backgroundColor: color.buttonBg,
        borderColor: color.buttonBg,
    },

    // Input
    inputGroup: { marginBottom: 20 },
    label: { fontSize: fontSizes.FONT13, color: color.primaryText, marginBottom: 8, marginLeft: 4, fontFamily: "TT-Octosquares-Medium", opacity: 0.8 },
    inputWrapper: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 12, paddingHorizontal: 15, height: 52 },
    input: { flex: 1, fontSize: fontSizes.FONT16, color: color.primaryText, fontFamily: "TT-Octosquares-Medium", paddingVertical: 10 },

    // Info Box
    infoBox: { backgroundColor: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 8, flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 25, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
    infoText: { fontSize: fontSizes.FONT12, color: color.primaryText, flex: 1, lineHeight: 18, fontFamily: "TT-Octosquares-Medium", opacity: 0.8 },

    divider: { height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginVertical: 10, marginBottom: 25 },

    // Footer
    footer: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, },
    nextButton: { backgroundColor: color.buttonBg, flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 16, borderRadius: 14, gap: 10 },
    nextButtonText: { color: color.primary, fontSize: fontSizes.FONT16, fontFamily: "TT-Octosquares-Medium" },
})