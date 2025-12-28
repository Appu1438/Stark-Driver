import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetDriverData } from "@/hooks/useGetDriverData";
import axiosInstance from "@/api/axiosInstance";
import AppAlert from "@/components/modal/alert-modal/alert.modal";
import color from "@/themes/app.colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { fontSizes } from "@/themes/app.constant";
import { router } from "expo-router";

export default function PaymentPage() {
  const { driver } = useGetDriverData();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // AppAlert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  if (!driver) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={color.primaryText} />
      </View>
    );
  }

  const handlePayment = async () => {
    const amt = Number(amount);

    setLoading(true);

    try {
      const res = await axiosInstance.post(
        "/payments/create-payment-link",
        { amount: amt }
      );

      // Open Razorpay hosted payment page
      await WebBrowser.openBrowserAsync(res.data.url);

      showAlert(
        "Payment Initialized",
        "Complete the payment in the browser. Your wallet will be updated automatically once payment is successful."
      );
    } catch (err) {
      showAlert(
        "Payment Initialization Failed",
        err?.response?.data?.message || "Unable to start payment"
      );
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <LinearGradient
        colors={[color.bgDark, color.subPrimary]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.headerContainer}>
            <Text style={styles.pageTitle}>Add Funds</Text>
            <Text style={styles.pageSubtitle}>Secure Wallet Recharge</Text>
          </View>

          {/* CARD */}
          <View style={styles.inputCard}>
            <Text style={styles.currencyLabel}>Amount to add</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor="#444"
                keyboardType="number-pad"
                value={amount}
                onChangeText={setAmount}
                style={styles.hugeInput}
                maxLength={5}
              />
            </View>

            <View style={styles.separator} />

            <Text style={styles.quickLabel}>Quick Select</Text>

            <View style={styles.quickGrid}>
              {[250, 500, 1000, 2000].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[
                    styles.chip,
                    amount === String(amt) && styles.chipActive,
                  ]}
                  onPress={() => setAmount(String(amt))}
                >
                  <Text
                    style={[
                      styles.chipText,
                      amount === String(amt) && styles.chipTextActive,
                    ]}
                  >
                    ₹{amt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                * Additional 2% platform fee + 18% GST applicable.
              </Text>
            </View>
          </View>

          {/* BUTTON */}
          <View style={styles.footerContainer}>
            <TouchableOpacity
              onPress={handlePayment}
              disabled={loading}
              style={styles.buttonShadow}
            >
              <LinearGradient
                colors={
                  loading
                    ? ["#333", "#444"]
                    : [color.primary, "rgba(0,255,200,0.1)"]
                }
                style={styles.payButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.payButtonText}>
                    Proceed to Pay {amount ? `₹${amount}` : ""}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              🔒 Secured by Razorpay
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* APP ALERT */}
      <AppAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={() => {
          router.push('/(routes)/profile/wallet-details')
          setAlertVisible(false)
        }}
        onCancel={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: color.bgDark },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(5),
  },
  headerContainer: {
    marginBottom: hp(4),
    alignItems: "center",
  },
  pageTitle: {
    fontSize: hp(3.5),
    color: "#fff",
    fontFamily: "TT-Octosquares-Medium",
  },
  pageSubtitle: {
    fontSize: hp(1.7),
    color: "#888",
    fontFamily: "TT-Octosquares-Medium",
  },
  inputCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: wp(6),
    padding: wp(5),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  currencyLabel: {
    color: "#666",
    fontSize: hp(1.4),
    textAlign: "center",
    marginBottom: hp(1.5),
    fontFamily: "TT-Octosquares-Medium",

  },
  inputWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(2.5),
  },
  currencySymbol: {
    fontSize: hp(6),
    color: color.primaryText,
    marginRight: wp(2),
    fontFamily: "TT-Octosquares-Medium",

  },
  hugeInput: {
    fontSize: hp(5.0),
    color: "#fff",
    textAlign: "center",
    minWidth: wp(30),
    fontFamily: "TT-Octosquares-Medium",

  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: hp(2),
  },
  quickLabel: {
    color: "#888",
    fontSize: hp(1.6),
    marginBottom: hp(1.5),
    fontFamily: "TT-Octosquares-Medium",

  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: wp(2.5),
  },
  chip: {
    width: "48%",
    paddingVertical: hp(1.8),
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: wp(3),
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: "rgba(0,255,200,0.1)",
    borderColor: color.primaryText,
    borderWidth: 1,
  },
  chipText: {
    color: "#aaa",
    fontSize: hp(2),
    fontFamily: "TT-Octosquares-Medium",

  },
  chipTextActive: {
    color: color.primaryText,
  },
  noteContainer: {
    marginTop: hp(2),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
  },
  noteText: {
    color: "#777",
    fontSize: hp(1.5),
    textAlign: "center",
    fontFamily: "TT-Octosquares-Medium",

  },
  footerContainer: {
    marginTop: hp(4),
    alignItems: "center",
  },
  buttonShadow: {
    width: "100%",
    elevation: 8,
  },
  payButton: {
    width: "100%",
    paddingVertical: hp(2.2),
    borderRadius: wp(4),
    alignItems: "center",
    fontFamily: "TT-Octosquares-Medium",

  },
  payButtonText: {
    color: color.primaryText,
    fontSize: hp(2.2),
    fontFamily: "TT-Octosquares-Medium",

  },
  footerNote: {
    marginTop: hp(2),
    color: "#555",
    fontSize: hp(1.7),
    fontFamily: "TT-Octosquares-Medium",

  },
});
