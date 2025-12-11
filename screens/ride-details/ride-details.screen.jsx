import { View, Text, Linking, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Image, Platform, Alert, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import color from "@/themes/app.colors";
import Button from "@/components/common/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "@/api/axiosInstance";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import driverSocketService from "@/utils/socket/socketService";
import { sendPushNotification } from "@/utils/notifications/sendPushNotifications";
import { Toast } from "react-native-toast-notifications";
import * as Location from 'expo-location';
import { styles } from "./styles";
import { customMapStyle } from "@/utils/map/mapStyle";
import Images from "@/utils/images";
import RideDetailsSkeleton from "./ride-details-skelton.screen";
import AppAlert from "@/components/modal/alert-modal/alert.modal";
import { renderStars } from "@/components/ride/ride.rating.stars";

export default function RideDetailsScreen() {
  const { rideId } = useLocalSearchParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderStatus, setOrderStatus] = useState("Booked");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [isStatusChanging, setIsStatusChanging] = useState(false);

  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    confirmText: "OK",
    showCancel: false,
    onConfirm: () => setShowAlert(false),
    onCancel: () => setShowAlert(false),
  });


  const [region, setRegion] = useState({
    latitude: 9.4981,
    longitude: 76.3388,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Fetch ride details from backend
  useEffect(() => {
    const fetchRide = async () => {
      try {
        setLoading(true);
        const id = JSON.parse(rideId); // assuming rideId is passed as stringified JSON

        const { data } = await axiosInstance.get(`/driver/ride/${id}`);
        if (data.success) {
          setRide(data.ride);
          console.log(ride)
          setOrderStatus(data.ride.status);

          if (data.ride.currentLocation && data.ride.destinationLocation) {
            const latitudeDelta = Math.abs(
              data.ride.destinationLocation.latitude - data.ride.currentLocation.latitude
            ) * 2;
            const longitudeDelta = Math.abs(
              data.ride.destinationLocation.longitude - data.ride.currentLocation.longitude
            ) * 2;

            setRegion({
              latitude: (data.ride.destinationLocation.latitude + data.ride.currentLocation.latitude) / 2,
              longitude: (data.ride.destinationLocation.longitude + data.ride.currentLocation.longitude) / 2,
              latitudeDelta: Math.max(latitudeDelta, 0.0922),
              longitudeDelta: Math.max(longitudeDelta, 0.0421),
            });
          }
        } else {
          setError("Ride not found");
        }
      } catch (err) {
        console.error("Error fetching ride:", err);
        setError("Failed to fetch ride details. Please try again.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 0);
      }
    };

    fetchRide();
  }, [rideId, orderStatus]);

  useEffect(() => {
    const handleMessage = (rawMessage) => {
      let message = rawMessage;

      console.log("Received message:", message);

      if (message.type === "rideStatusUpdate") {
        // safely access ride.id
        if (!ride) {
          console.warn("Ride not loaded yet, cannot update status");
          return;
        }

        if (ride.id === message.rideId) {
          setOrderStatus(message.status);
        }
      }
    };

    const unsubscribe = driverSocketService.onMessage(handleMessage);
    return () => unsubscribe();
  }, [ride]); // add ride as dependency to always have latest ride


  const handleSubmit = async () => {
    if (!ride) return;

    setIsStatusChanging(true)
    try {
      // Define status transitions
      const nextStatusMap = {
        Booked: "Processing",
        Processing: "Arrived",
        Arrived: "Ongoing",
        Ongoing: "Reached",
        Reached: "Completed", // stays completed
      };

      const newStatus = nextStatusMap[orderStatus] || "Booked";

      if (orderStatus == 'Arrived') {
        setShowOtpModal(true);
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      const response = await axiosInstance.put(`/ride/update-ride-status`, {
        rideStatus: newStatus,
        rideId: ride.id,
        driverLocation: { latitude, longitude },
      });

      const updatedStatus = response.data.updatedRide.status;
      setOrderStatus(updatedStatus);

      // Push notification messages
      // Push notification messages
      let message = "";

      switch (updatedStatus) {
        case "Processing":
          message = `${ride.driverId.name} is on the way to pick you up!`;
          break;

        case "Arrived":
          message = `${ride.driverId.name} has arrived at your pickup location. Please share the OTP to start your ride.`;
          break;

        case "Ongoing":
          message = `Your ride with ${ride.driverId.name} has started! Have a safe journey.`;
          break;

        case "Reached":
          message = `${ride.driverId.name} has reached your destination. Please complete the payment.`;
          break;

        case "Completed":
          message = `Your ride with ${ride.driverId.name} has been completed! Thank you for riding with us.`;
          break;

        default:
          message = `Your ride status has been updated.`;
          break;
      }


      if (message) {
        sendPushNotification(
          ride.userId.notificationToken,
          `Ride Status Update: ${ride.destinationLocationName}`,
          message
        );
      }

      // Notify via socket
      driverSocketService.send({
        type: "rideStatusUpdate",
        role: "driver",
        rideData: { id: ride.id, user: { id: ride.userId._id } },
        status: updatedStatus,
      });

      // Toasts for driver
      if (updatedStatus === "Processing") {
        Toast.show("Heading to pickup location!", { type: "info" });
      } else if (updatedStatus === "Ongoing") {
        Toast.show("Let's have a safe journey!", { type: "success" });
      } else if (updatedStatus === "Completed") {
        Toast.show(`Well done ${ride.driverId.name}`);
        router.push("/(tabs)/home");
      }
    } catch (error) {
      console.error("Ride status update failed:", error);
      sendPushNotification(
        ride.userId.notificationToken,
        `Ride Status Update: ${ride.destinationLocationName}`,
        'Your driver is trying to manupulate the ride status . Please be safe . In case of any emergency use emergency contact'
      );
      sendPushNotification(
        ride.driverId.notificationToken,
        `Ride Status Update: ${ride.destinationLocationName}`,
        error.response.data.message
      );
      Toast.show(error.response.data.message, { type: "danger" });
    } finally {
      setIsStatusChanging(false)
    }
  };

  const handleOtpVerify = async (enteredOtp) => {
    if (isVerifyingOtp) return; // Prevent double press
    setIsVerifyingOtp(true);

    try {
      console.log("Verifying OTP:", enteredOtp);

      const response = await axiosInstance.post(`/ride/verify-ride-otp`, {
        rideId: ride.id,
        otp: enteredOtp,
      });

      const updatedStatus = response.data.updatedRide.status;
      setOrderStatus(updatedStatus);

      // Push Notification Message Logic
      let message = "";
      if (updatedStatus === "Processing") {
        message = "Your driver is on the way to pick you up!";
      } else if (updatedStatus === "Arrived") {
        message = "Your driver has arrived! Ride starting soon.";
      } else if (updatedStatus === "Ongoing") {
        message = "Your ride has started! Have a Safe Journey";
      } else if (updatedStatus === "Reached") {
        message = "Your ride is almost completed.";
      } else if (updatedStatus === "Completed") {
        message = "Your ride has been completed! Thank You.";
      }

      if (message) {
        sendPushNotification(
          ride.userId.notificationToken,
          `Ride Status Update: ${ride.destinationLocationName}`,
          message
        );

        sendPushNotification(
          ride.driverId.notificationToken,
          `Ride Status Update: ${ride.destinationLocationName}`,
          message
        );
      }

      // Socket
      driverSocketService.send({
        type: "rideStatusUpdate",
        role: "driver",
        rideData: { id: ride.id, user: { id: ride.userId._id } },
        status: updatedStatus,
      });

      setShowOtpModal(false);
      Toast.show("Ride started successfully!", { type: "success" });

    } catch (error) {
      console.log("OTP VERIFY ERROR:", error);

      setShowOtpModal(false);

      sendPushNotification(
        ride.userId.notificationToken,
        `Ride Status Update: ${ride.destinationLocationName}`,
        "Invalid OTP, please share the correct OTP with the driver."
      );

      sendPushNotification(
        ride.driverId.notificationToken,
        `Ride Status Update: ${ride.destinationLocationName}`,
        "Invalid OTP, please collect the correct OTP from the customer."
      );

      Toast.show("Invalid OTP, Please try again", { type: "danger" });

    } finally {
      setIsVerifyingOtp(false); // 🔥 Unlock button
    }
  };


  const handleUserRating = async () => {
    try {
      // ⭐ Validate Rating
      if (!rating) {
        setAlertConfig({
          title: "Rating Required",
          message: "Please select a star rating before submitting.",
          confirmText: "OK",
          showCancel: false,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      setIsSubmitting(true)
      console.log(rating, rideId);
      const id = JSON.parse(rideId);

      const payload = {
        rating,
        rideId: id,
      };

      const response = await axiosInstance.put("/ride/rating-user", payload);

      if (response.status === 200 || response.status === 201) {
        // Push notification
        sendPushNotification(
          ride?.userId?.notificationToken,
          "You Received a New Rating ⭐",
          `${ride?.driverId?.name || "A user"} rated you ${rating} star${rating > 1 ? "s" : ""
          } for the recent ride from ${ride?.currentLocationName} to ${ride?.destinationLocationName
          }.`
        );

        // ⭐ SUCCESS ALERT
        setAlertConfig({
          title: "Thank You!",
          message: "Your rating has been submitted successfully.",
          confirmText: "OK",
          showCancel: false,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);

        console.log("✅ Rating submitted:", response.data);
      } else {
        // ⭐ FAILURE ALERT
        setAlertConfig({
          title: "Error",
          message: "Failed to submit rating. Please try again later.",
          confirmText: "OK",
          showCancel: false,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
      }

      setRide(response.data.updatedRide);
      setSubmitted(true);

    } catch (error) {
      console.log("❌ Error submitting rating:", error);

      // ⭐ GENERIC ERROR ALERT
      setAlertConfig({
        title: "Error",
        message: "Something went wrong. Please try again later.",
        confirmText: "OK",
        showCancel: false,
        onConfirm: () => setShowAlert(false),
      });

      setShowAlert(true);
    } finally {
      setIsSubmitting(false)
    }
  };


  const openNavigation = (location) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}&travelmode=driving`;
    Linking.openURL(url).catch(err => console.error("Failed to open maps:", err));
  };

  const callPassenger = () => {
    if (!ride) return;
    Linking.openURL(`tel:${ride.userId.phone_number}`).catch(err => console.error("Failed to call:", err));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Booked": return "#4285F4";
      case "Processing": return "#FBBC05";
      case "Arrived": return "#FF9800";
      case "Ongoing": return "#e3af14ff";
      case "Reached": return "#9C27B0";
      case "Cancelled": return "#FBBC05";
      default: return "#34A853";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Booked": return "Ride Confirmed";
      case "Processing": return "Heading to Pickup";
      case "Arrived": return "You Arrived";
      case "Ongoing": return "Trip in Progress";
      case "Reached": return "Destination Reached";
      case "Cancelled": return "Trip Cancelled";
      default: return "Trip Completed";
    }
  };

  const getActionButtonTitle = (status) => {
    switch (status) {
      case "Booked": return "Go to Pickup";
      case "Processing": return "I've Arrived";
      case "Arrived": return "Verify OTP & Start Ride";
      case "Ongoing": return "Mark as Reached";
      case "Reached": return "Complete Ride";
      default: return "Ride Completed";
    }
  };

  const renderTripDetail = (label, iconName, value) => (
    <View style={styles.detailItem}>
      <MaterialIcons name={iconName} size={20} color={color.lightGray} />
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailText} numberOfLines={2}>{value}</Text>
      </View>
    </View>
  );

  const renderFareRow = (label, value, highlight = false) => (
    <View style={styles.fareRow}>
      <Text style={[styles.fareLabel, highlight && { color: color.buttonBg, fontSize: fontSizes.FONT16 }]}>{label}</Text>
      <Text style={[styles.fareValue, highlight && { color: color.buttonBg, fontSize: fontSizes.FONT16 }]}>{value}</Text>
    </View>
  );

  const markerIcon = Images.mapMarker

  const strokeColor = Platform.select({
    ios: color.primaryGray,   // light gray for iOS
    android: color.primaryGray, // same gray, but Android renders differently
  });

  const lineDash = Platform.select({
    ios: [0, 0],     // forces solid line on iOS
    android: undefined, // Android doesn't need it for solid
  });


  if (loading) {
    return (
      <RideDetailsSkeleton />
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>{error}</Text>
      </View>
    );
  }

  if (!ride) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Ride not found</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapContainer}>

        <MapView
          style={{ flex: 1 }}
          region={region}
          provider={PROVIDER_GOOGLE}
          customMapStyle={customMapStyle}
          showsMyLocationButton={false}
          pitchEnabled={false}
          rotateEnabled={false}
        // loadingEnabled={true}
        >
          {/* Pickup Marker */}
          {ride.currentLocation && (
            <Marker
              coordinate={ride.currentLocation}
              title={`Pickup : ${ride.currentLocationName}`}
              zIndex={1000}
            >
              <Image
                source={Images.mapPickupMarker}
                style={{ width: windowWidth(35), height: windowHeight(35), tintColor: color.primaryGray }}
                resizeMode="contain"
              />
            </Marker>
          )}

          {/* Destination Marker */}
          {ride.destinationLocation && (
            <Marker
              coordinate={ride.destinationLocation}
              zIndex={1000}
              title={`Drop : ${ride.destinationLocationName}`}

            >
              <Image
                source={Images.mapDropMarker}
                style={{ width: windowWidth(35), height: windowHeight(35), tintColor: color.primaryGray }}
                resizeMode="contain"
              />
            </Marker>
          )}

          {/* Cancelled Ride */}
          {ride.status === "Cancelled" && ride.cancelDetails ? (
            <>
              {/* Cancelled Marker */}
              <Marker
                coordinate={ride.cancelDetails.cancelledLocation}
                title={`Cancelled : ${ride.cancelDetails.cancelledLocationName}`}

                zIndex={1000}>
                <Image
                  source={Images.mapCancelMarker}
                  style={{
                    width: windowWidth(35),
                    height: windowHeight(35),
                    tintColor: color.primaryGray
                  }}
                  resizeMode="contain"
                />
              </Marker>

              {/* Travelled Path (Pickup -> Cancelled Point) */}
              <MapViewDirections
                origin={ride.currentLocation}
                destination={ride.cancelDetails.cancelledLocation}
                apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}
                strokeWidth={4}
                strokeColor={strokeColor}
                lineCap="round"
                lineJoin="round"
                optimizeWaypoints
                mode="DRIVING"
                precision="high"
                lineDashPattern={lineDash}


              />

              {/* Remaining Path (Cancelled -> Destination) */}
              <MapViewDirections
                origin={ride.cancelDetails.cancelledLocation}
                destination={ride.destinationLocation}
                apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}
                strokeWidth={4}
                strokeColor={strokeColor}
                lineCap="round"
                lineJoin="round"
                optimizeWaypoints
                mode="DRIVING"
                precision="high"
                lineDashPattern={lineDash}
                zIndex={9999} // 💡 works on Android, partial on iOS

              />
            </>
          ) : (
            /* Full Route (Pickup → Destination) */
            ride.currentLocation &&
            ride.destinationLocation && (
              <MapViewDirections
                origin={ride.currentLocation}
                destination={ride.destinationLocation}
                apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}
                strokeWidth={4}
                strokeColor={strokeColor}
                lineCap="round"
                lineJoin="round"
                optimizeWaypoints
                mode="DRIVING"
                precision="high"
                lineDashPattern={lineDash}
                zIndex={10000}
              />

            )
          )}
        </MapView>

      </View>


      {/* --- BOTTOM SHEET CARD --- */}
      <View style={styles.cardContainer}>
        {/* Drag Handle for visual affordance */}
        <View style={styles.cardHandle} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- HEADER: STATUS & EARNINGS --- */}
          <View style={styles.headerRow}>
            <View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(orderStatus) }]}>
                <Text style={styles.statusText}>{getStatusText(orderStatus)}</Text>
              </View>
              <Text style={styles.tripIdLabel}>ID : {ride?.id?.slice(-6).toUpperCase()}</Text>
            </View>

            {/* Driver Focus: Show Earnings Big */}
            <View style={styles.earningBox}>
              <Text style={styles.earningLabel}>EST. EARNING</Text>
              <Text style={styles.earningValue}>₹{ride?.driverEarnings || "0"}</Text>
            </View>
          </View>

          {/* --- CARD 1: PASSENGER & ACTIONS --- */}
          <View style={styles.passengerCard}>
            <View style={styles.passengerHeader}>
              <View style={styles.passengerInfo}>
                <Text style={styles.passengerName}>{ride.userId.name}</Text>
                <View style={styles.ratingPill}>
                  <FontAwesome name="star" size={12} color="#FFD700" />
                  <Text style={styles.ratingText}>
                    {ride?.userId?.ratings ? ride.userId.ratings.toFixed(1) : "New"}
                  </Text>
                </View>
              </View>

              {/* Call Button - High Visibility */}
              {ride.status === "Arrived" || ride.status === "Booked" || ride.status === "Processing" ? (
                <TouchableOpacity style={styles.callBtn} onPress={callPassenger}>
                  <FontAwesome name="phone" size={20} color={color.primary} style={{ marginTop: 2.5 }} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Navigation Grid */}
            <View style={styles.navGrid}>
              <TouchableOpacity
                style={[styles.navItem, styles.navItemLeft]}
                onPress={() => openNavigation(ride?.currentLocation)}
              >
                <MaterialIcons name="navigation" size={18} color={color.primaryText} />
                <View>
                  <Text style={styles.navLabel}>Navigate to</Text>
                  <Text style={styles.navTitle}>Pickup</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.navDivider} />

              <TouchableOpacity
                style={[styles.navItem, styles.navItemRight]}
                onPress={() => openNavigation(ride?.destinationLocation)}
              >
                <MaterialIcons name="flag" size={18} color={color.primaryText} />
                <View>
                  <Text style={styles.navLabel}>Navigate to</Text>
                  <Text style={styles.navTitle}>Drop-off</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* --- CARD 2: ROUTE TIMELINE --- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>TRIP ROUTE</Text>
            <View style={styles.timelineContainer}>
              {/* Vertical Connector Line */}
              <View style={styles.timelineLine} />

              {/* Pickup */}
              <View style={styles.timelineRow}>
                <View style={[styles.timelineDot, { borderColor: color.primary }]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>Pickup Location</Text>
                  <Text style={styles.timelineAddress}>{ride?.currentLocationName || "Current location"}</Text>
                </View>
              </View>

              {/* Drop */}
              <View style={[styles.timelineRow, { marginTop: 24 }]}>
                <View style={[styles.timelineDot, { borderColor: '#FF5252' }]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>Destination</Text>
                  <Text style={styles.timelineAddress}>{ride?.destinationLocationName || "Destination"}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* --- CARD 3: FINANCIALS (Receipt Style) --- */}
          <View style={styles.receiptCard}>
            <Text style={styles.receiptTitle}>
              {ride.status === "Cancelled" ? "CANCELLATION LEDGER" : "PAYMENT BREAKDOWN"}
            </Text>

            {/* Regular Fare Details */}
            {renderFareRow("Total Trip Fare", `₹${ride?.totalFare}`)}
            {renderFareRow("Platform Fee", `- ₹${ride?.platformShare}`)}
            <View style={styles.receiptDivider} />
            {renderFareRow("Net Earnings", `₹${ride?.driverEarnings}`, true)}

            {/* Cancellation Specifics */}
            {ride.status === "Cancelled" && ride.cancelDetails && (
              <View style={styles.cancelSection}>
                <View style={styles.cancelBadge}>
                  <Text style={styles.cancelBadgeText}>CANCELLED BY {ride.cancelDetails.cancelledBy === "user" ? "PASSENGER" : "YOU"}</Text>
                </View>

                {renderFareRow("Time", new Date(ride.cancelDetails.cancelledAt).toLocaleTimeString())}
                {renderFareRow("Location", ride.cancelDetails.cancelledLocationName.slice(0, 25) || "Unknown")}
                {renderFareRow("Travelled", `${ride.cancelDetails.travelledDistance} km`)}
                <View style={styles.receiptDivider} />
                {renderFareRow("Cancellation Payout", `₹${ride.cancelDetails.totalFare}`, true)}
              </View>
            )}
          </View>

          {/* --- CARD 4: RATINGS (Conditional) --- */}
          {ride.status === "Completed" && (
            <View style={styles.sectionContainer}>
              {ride.userRating ? (
                <View style={styles.ratingSummaryCard}>
                  <View style={styles.ratingSummaryCol}>
                    <Text style={styles.ratingHead}>They Rated You</Text>
                    <Text style={styles.ratingScore}>★ {ride.driverRating || "-"}</Text>
                  </View>
                  <View style={styles.verticalLine} />
                  <View style={styles.ratingSummaryCol}>
                    <Text style={styles.ratingHead}>You Rated Them</Text>
                    <Text style={styles.ratingScore}>★ {ride.userRating || "-"}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.ratingInputContainer}>
                  <Text style={styles.ratingTitle}>Rate Passenger</Text>
                  <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => !ride.userRating && setRating(star)}
                        disabled={!!ride.userRating || submitted}
                      >
                        <MaterialIcons
                          name={star <= (ride.userRating || rating) ? "star" : "star-border"}
                          size={32}
                          color={star <= (ride.userRating || rating) ? "#FFD700" : "#E0E0E0"}
                          style={{ marginHorizontal: 8 }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  {/* {!submitted && ( */}
                  <TouchableOpacity
                    onPress={handleUserRating}
                    disabled={isSubmitting}
                    style={styles.submitRatingBtn}
                  >
                    {isSubmitting ? <ActivityIndicator color={color.primary} /> : <Text style={styles.submitRatingText}>Submit Feedback</Text>}
                  </TouchableOpacity>
                  {/* )} */}
                </View>
              )}
            </View>
          )}

        </ScrollView>

        {/* --- FOOTER: SLIDE/ACTION BUTTON --- */}
        <View style={styles.footerContainer}>
          {ride.status !== "Completed" && ride.status !== "Cancelled" ? (
            <Button
              title={isStatusChanging ? <ActivityIndicator color={color.primary} /> : getActionButtonTitle(orderStatus)}
              height={54}
              backgroundColor={color.buttonBg} // Brand Color
              textColor={color.primary}
              onPress={handleSubmit}
              disabled={isStatusChanging}
              style={styles.mainActionBtn}
            />
          ) : (
            <Button
              onPress={() => router.push('/(routes)/profile/help-support')}
              style={styles.supportBtn}
              title="Report Issue / Support"
            />
          )}
        </View>

        {/* --- OTP MODAL (Kept Functional logic same) --- */}
        {showOtpModal && (
          <Modal transparent visible animationType="fade">
            <View style={styles.modalBackdrop}>
              <View style={styles.otpCard}>
                <Text style={styles.otpTitle}>Start Ride</Text>
                <Text style={styles.otpSubtitle}>Ask passenger for the 4-digit PIN</Text>

                <TextInput
                  style={styles.otpInput}
                  value={otpInput}
                  onChangeText={setOtpInput}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="••••"
                  placeholderTextColor="#555"
                  autoFocus
                />

                <View style={styles.otpBtnRow}>
                  <TouchableOpacity onPress={() => setShowOtpModal(false)} style={styles.otpCancelBtn}>
                    <Text style={styles.otpCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => !isVerifyingOtp && handleOtpVerify(otpInput)}
                    style={styles.otpConfirmBtn}
                  >
                    {isVerifyingOtp ? <ActivityIndicator color="#000" /> : <Text style={styles.otpConfirmText}>Verify</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>

      <AppAlert
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        showCancel={alertConfig.showCancel}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />


    </View >
  );

}