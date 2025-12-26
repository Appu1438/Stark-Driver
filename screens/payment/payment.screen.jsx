import React, { useState, useRef, useEffect } from "react";
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
  BackHandler,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useGetDriverData } from "@/hooks/useGetDriverData";
import axiosInstance from "@/api/axiosInstance";
import AppAlert from "@/components/modal/alert-modal/alert.modal";
import color from "../../themes/app.colors";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { fontSizes } from "@/themes/app.constant";

export default function PaymentPage() {
  const { driver } = useGetDriverData();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutHtml, setCheckoutHtml] = useState(null);

  // 🔒 HARD LOCKS (NO UI IMPACT)
  const orderInProgressRef = useRef(false);
  const paymentInProgressRef = useRef(false);

  // Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertNextRoute, setAlertNextRoute] = useState(null);

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    if (alertNextRoute) router.replace(alertNextRoute);
  };

  // 🔒 BLOCK ANDROID BACK BUTTON DURING PAYMENT
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (paymentInProgressRef.current) {
          return true; // ⛔ BLOCK BACK
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, []);

  // 🔒 DISABLE NAVIGATION WHILE PAYMENT SCREEN OPEN
  useEffect(() => {
    router.setParams({ gestureEnabled: !checkoutHtml });
  }, [checkoutHtml]);

  if (!driver)
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );

  const generateCheckoutHtml = (gross, orderId) => {
    const logoUrl =
      "https://res.cloudinary.com/starkcab/image/upload/w_256,h_256,c_pad,b_rgb:000,q_auto/v1765043362/App%20Logos/FullLogo_p0evhu.png";

    return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />

        <style>
          body {
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #ffffff;
            font-family: 'Inter', sans-serif;
          }

          .loader {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #333;
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
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ event: "success", payload: response })
              );
            },

            modal: {
              ondismiss: function () {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ event: "cancel" })
                );
              }
            }
          };

          setTimeout(() => {
            var rzp = new Razorpay(options);
            rzp.open();
          }, 500);
        </script>
      </body>
    </html>
  `;
  };

  const handlePayment = async () => {
    if (orderInProgressRef.current) return;

    const amt = Number(amount);
    if (!amt || amt < 250 || amt % 50 !== 0) {
      setAlertTitle("Invalid Amount");
      setAlertMessage("Minimum ₹250. Must be multiples of ₹50.");
      setAlertVisible(true);
      return;
    }

    orderInProgressRef.current = true;
    setLoading(true);

    try {
      const fee = amt * 0.02;
      const gst = fee * 0.18;
      const grossAmount = amt + fee + gst;

      const orderRes = await axiosInstance.post(`/payments/create-order`, {
        amount: grossAmount,
        driverId: driver?.id,
      });

      const options = {
        description: "Wallet Recharge",
        image:
          "https://res.cloudinary.com/starkcab/image/upload/w_256,h_256,c_pad,b_rgb:000,q_auto/v1765043362/App%20Logos/FullLogo_p0evhu.png",
        currency: "INR",
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(grossAmount * 100),
        order_id: orderRes.data.orderId,
        name: "STARK PAYMENTS",

        prefill: {
          name: driver?.name,
          email: driver?.email,
          contact: driver?.phone_number,
        },

        theme: { color: color.primary },
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {
          await axiosInstance.post(`/payments/verify-payment`, data);

          setAlertTitle("Success 🚀");
          setAlertMessage("Wallet recharged successfully.");
          setAlertNextRoute("/(routes)/profile/wallet-details");
          setAlertVisible(true);
        })
        .catch((err) => {
          console.log(err)
          setAlertTitle("Cancelled");
          setAlertMessage("Transaction was cancelled.");
          setAlertVisible(true);
        });
    } catch (err) {
      setAlertTitle("Information");
      setAlertMessage(
        err?.response?.data?.message || "Could not initialize payment."
      );
      setAlertVisible(true);
    }

    orderInProgressRef.current = false;
    setLoading(false);
  };


  const handleWebViewMessage = async (event) => {
    const data = JSON.parse(event.nativeEvent.data);

    // 🔓 CLEANUP
    setCheckoutHtml(null);
    orderInProgressRef.current = false;
    paymentInProgressRef.current = false;

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

  if (checkoutHtml) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          style={{ flex: 1, backgroundColor: "#fff" }}
          source={{ html: checkoutHtml }}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={["*"]}
          mixedContentMode="always"
          onMessage={handleWebViewMessage}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <LinearGradient
        colors={[color.bgDark, color.subPrimary]}
        style={styles.backgroundGradient}
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
                    amount == amt && styles.chipActive,
                  ]}
                  onPress={() => setAmount(String(amt))}
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

            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                * Additional 2% Commission & 18% GST applicable.
              </Text>
            </View>
          </View>

          {/* BUTTON */}
          <View style={styles.footerContainer}>
            <TouchableOpacity
              onPress={handlePayment}
              disabled={loading || orderInProgressRef.current}
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
              <Text style={{ fontSize: fontSizes.FONT12 }}>🔒</Text> Secured by Razorpay
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
    </SafeAreaView>
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
    fontFamily: "TT-Octosquares-Medium",
    color: "#fff",
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
    fontSize: hp(6.5),
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
    fontFamily: "TT-Octosquares-Medium",

  },

  chip: {
    width: "48%",
    paddingVertical: hp(1.8),
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: wp(3),
    alignItems: "center",
    fontFamily: "TT-Octosquares-Medium",

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
