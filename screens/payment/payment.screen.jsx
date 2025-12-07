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
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useGetDriverData } from "@/hooks/useGetDriverData";
import axiosInstance from "@/api/axiosInstance";
import AppAlert from "@/components/modal/alert-modal/alert.modal";
import color from "../../themes/app.colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentPage() {
  const { driver } = useGetDriverData();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutHtml, setCheckoutHtml] = useState(null);

  // Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertNextRoute, setAlertNextRoute] = useState(null);

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    if (alertNextRoute) router.replace(alertNextRoute);
  };

  if (!driver)
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );

  // 🔥 GENERATE BRIGHT CHECKOUT HTML
  const generateCheckoutHtml = (gross, orderId) => {
    // Changed b_rgb to ffffff (white) to match bright background
const logoUrl = "https://res.cloudinary.com/starkcab/image/upload/w_256,h_256,c_pad,b_rgb:000,q_auto/v1765043362/App%20Logos/FullLogo_p0evhu.png";
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background-color: #ffffff; /* Bright Background */
              font-family: 'Inter', sans-serif;
            }
            .loader {
              width: 40px;
              height: 40px;
              border: 3px solid #f3f3f3;
              border-top: 3px solid #333; /* Dark loader for contrast */
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-bottom: 15px;
            }
            .text {
              color: #333;
              font-size: 14px;
              font-weight: 600;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="loader"></div>
          <div class="text">Initializing Secure Payment...</div>

          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
          <script>
            var options = {
              key: "${process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID}",
              amount: "${gross * 100}",
              currency: "INR",
              name: "STARK PAYMENTS",
              description: "Wallet Recharge",
              image: "${logoUrl}",
              order_id: "${orderId}",
              prefill: {
                name: "${driver?.name}",
                email: "${driver?.email}",
                contact: "${driver?.phone_number}"
              },
              theme: { color: "${color.primary}" },
              handler: function (response) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ event: "success", payload: response }));
              },
              modal: {
                ondismiss: function () {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ event: "cancel" }));
                }
              }
            };
            
            setTimeout(() => { var rzp = new Razorpay(options); rzp.open(); }, 500);
          </script>
        </body>
      </html>
    `;
  };

  const handlePayment = async () => {
    const amt = Number(amount);
    if (!amt || amt < 250 || amt % 50 !== 0) {
      setAlertTitle("Invalid Amount");
      setAlertMessage("Minimum ₹250. Must be multiples of ₹50.");
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      const fee = amt * 0.02;
      const gst = fee * 0.18;
      const grossAmount = amt + fee + gst;

      const orderRes = await axiosInstance.post(`/payments/create-order`, {
        amount: grossAmount,
        driverId: driver?.id,
      });

      const { orderId } = orderRes.data;
      const html = generateCheckoutHtml(grossAmount, orderId);
      setCheckoutHtml(html);
    } catch (err) {
      setAlertTitle("Error");
      setAlertMessage("Could not initialize payment.");
      setAlertVisible(true);
    }
    setLoading(false);
  };

  const handleWebViewMessage = async (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    setCheckoutHtml(null);

    if (data.event === "success") {
      try {
        await axiosInstance.post(`/payments/verify-payment`, data.payload);
        setAlertTitle("Success 🚀");
        setAlertMessage("Wallet recharged successfully.");
        setAlertNextRoute("/(routes)/profile/wallet-details");
      } catch {
        setAlertTitle("Verification Failed");
        setAlertMessage("Payment made but verification failed.");
      }
    } else if (data.event === "cancel") {
      setAlertTitle("Cancelled");
      setAlertMessage("Transaction was cancelled.");
    } else {
      setAlertTitle("Failed");
      setAlertMessage("Payment failed.");
    }
    setAlertVisible(true);
  };

  // 🟢 Show Bright White Screen while WebView loads
  if (checkoutHtml) {
    return (
      <SafeAreaView style={{ flex: 1}}>
        <WebView
          source={{ html: checkoutHtml }}
          style={{ flex: 1, backgroundColor: "#ffffff" }}
          javaScriptEnabled
          onMessage={handleWebViewMessage}
        />
      </SafeAreaView>
    );
  }

  // 🟢 MAIN PAYMENT UI (Dark Theme)
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[color.bgDark, color.subPrimary]}
        style={styles.backgroundGradient}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* HEADER */}
          <View style={styles.headerContainer}>
            <Text style={styles.pageTitle}>Add Funds</Text>
            <Text style={styles.pageSubtitle}>Secure Wallet Recharge</Text>
          </View>

          {/* MAIN CARD */}
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

            {/* SEPARATOR */}
            <View style={styles.separator} />

            {/* QUICK ACTIONS */}
            <Text style={styles.quickLabel}>Quick Select</Text>
            <View style={styles.quickGrid}>
              {[250, 500, 1000, 2000].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[
                    styles.chip,
                    amount == amt && styles.chipActive,
                  ]}
                  onPress={() => setAmount(String(amt))}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      amount == amt && styles.chipTextActive,
                    ]}
                  >
                    ₹{amt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ⚠️ FEE & GST NOTE */}
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                * Additional 2% Commission & 18% GST applicable.
              </Text>
            </View>

          </View>

          {/* ACTION BUTTON */}
          <View style={styles.footerContainer}>
            <TouchableOpacity
              onPress={handlePayment}
              disabled={loading}
              activeOpacity={0.8}
              style={styles.buttonShadow}
            >
              <LinearGradient
                colors={loading ? ["#333", "#444"] : [color.primary, "rgba(0,255,200,0.1)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
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
              <Text style={{ fontSize: 10 }}>🔒</Text> Secured by Razorpay
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AppAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
        onCancel={handleAlertConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: color.bgDark,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: color.bgDark,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  // Header
  headerContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: "TT-Octosquares-Medium",
    color: "#fff",
    marginBottom: 5,
    textShadowColor: "rgba(0, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#888",
    fontFamily: "TT-Octosquares-Medium",
  },

  // Card
  inputCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  currencyLabel: {
    color: "#666",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "TT-Octosquares-Medium",
  },
  inputWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  currencySymbol: {
    fontSize: 40,
    color: color.primaryText,
    marginRight: 5,
    fontFamily: "TT-Octosquares-Medium",
  },
  hugeInput: {
    fontSize: 48,
    color: "#fff",
    fontFamily: "TT-Octosquares-Medium",
    minWidth: 100,
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 20,
  },

  // Quick Select
  quickLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 15,
    fontFamily: "TT-Octosquares-Medium",
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  chip: {
    width: "48%",
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: {
    backgroundColor: "rgba(0,255,200,0.1)",
    borderColor: color.primaryText,
  },
  chipText: {
    color: "#aaa",
    fontSize: 16,
    fontFamily: "TT-Octosquares-Medium",
  },
  chipTextActive: {
    color: color.primaryText,
  },

  // ⚠️ NOTE STYLES
  noteContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
  },
  noteText: {
    color: "#777", // Subtle gray
    fontSize: 11,
    fontFamily: "TT-Octosquares-Medium",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // Footer / Button
  footerContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  buttonShadow: {
    width: "100%",
    shadowColor: color.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  payButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    color: color.primaryText,
    fontSize: 18,
    fontFamily: "TT-Octosquares-Medium",
  },
  footerNote: {
    marginTop: 20,
    color: "#555",
    fontSize: 12,
    fontFamily: 'TT-Octosquares-Medium'
  },
});