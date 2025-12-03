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
      case "Ongoing": return color.buttonBg;
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


      {/* Ride Details Card */}
      <View style={styles.cardContainer}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Indicator */}
          <View style={styles.statusIndicator}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(orderStatus) },
              ]}
            />
            <Text style={styles.statusText}>{getStatusText(orderStatus)}</Text>
          </View>

          {/* Passenger Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Passenger</Text>

            <View style={styles.passengerInfo}>
              <View style={styles.passengerDetails}>

                {/* Passenger Name */}
                <Text style={styles.passengerName}>{ride.userId.name}</Text>



                {/* Call Passenger Button */}
                {ride.status === "Arrived" ? (
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={callPassenger}
                  >
                    <FontAwesome name="phone" size={14} color={color.primary} />
                    <Text style={styles.callButtonText}> Call Passenger</Text>
                  </TouchableOpacity>
                ) : (
                  < View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                    {/* <FontAwesome name="star" size={14} color="#FFD700" /> */}
                    {renderStars(ride?.userId?.ratings ? ride.userId.ratings.toFixed(1) : 0)}
                  </View>
                )}

              </View>
            </View>
          </View>

          {/* Navigation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Navigation</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.navButton, { marginRight: 8 }]}
                onPress={() => {
                  openNavigation(ride?.currentLocation)
                }
                }
              >
                <MaterialIcons name="directions" size={20} color={color.primary} />
                <Text style={styles.navButtonText}>Pickup</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => openNavigation(ride?.destinationLocation)}
              >
                <MaterialIcons name="directions" size={20} color={color.primary} />
                <Text style={styles.navButtonText}>Destination</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Trip Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trip Details</Text>
            {renderTripDetail("Pickup", "location-pin", ride?.currentLocationName || "Current location")}
            {renderTripDetail("Destination", "flag", ride?.destinationLocationName || "Destination")}
            {renderTripDetail(
              "Vehicle",
              "directions-car",
              `${ride?.driverId?.vehicle_type} • ${ride?.driverId?.vehicle_color}`
            )}
          </View>

          {/* Fare Breakdown */}
          {/* Fare Breakdown */}
          <View style={styles.fareContainer}>
            <Text style={styles.sectionTitle}>
              {ride.status === "Cancelled" ? "FARE DETAILS (BEFORE CANCELLATION)" : "FARE BREAKDOWN"}
            </Text>

            {renderFareRow("Planned Distance", `${ride?.distance} km`)}
            {renderFareRow("Total Fare", `₹${ride?.totalFare}`)}
            <View style={{ height: 1, backgroundColor: "#EAEAEA", marginVertical: 8 }} />
            {renderFareRow("Driver Earnings (Planned)", `₹${ride?.driverEarnings}`)}
            {renderFareRow("Platform Share", `₹${ride?.platformShare}`)}

            {/* If ride was cancelled, show cancellation details */}
            {ride.status === "Cancelled" && ride.cancelDetails && (
              <>
                <View style={{ height: 1, backgroundColor: "#CFCFCF", marginVertical: 12 }} />
                <Text style={[styles.sectionTitle, { color: "red" }]}>CANCELLATION DETAILS</Text>

                {renderTripDetail(
                  "Cancelled At",
                  "cancel",
                  new Date(ride.cancelDetails.cancelledAt).toLocaleString()
                )}

                {renderTripDetail(
                  "Cancelled Location",
                  "location-off",
                  ride.cancelDetails.cancelledLocationName ||
                  `${ride.cancelDetails.cancelledLocationName}`
                )}

                {renderFareRow("Travelled Distance", `${ride.cancelDetails.travelledDistance} km`)}
                {renderFareRow("Fare for Travelled Distance", `₹${ride.cancelDetails.totalFare}`)}
                {renderFareRow("Driver Earnings", `₹${ride.cancelDetails.driverEarnings}`)}
                {renderFareRow("Platform Share", `₹${ride.cancelDetails.platformShare}`)}
                {renderFareRow("Refunded to Wallet", `₹${ride.cancelDetails.refundedAmount}`)}

                {ride.cancelDetails.cancelledBy && (
                  renderFareRow(
                    "Cancelled By",
                    ride.cancelDetails.cancelledBy === "user" ? "Passenger" : "Driver"
                  )
                )}
              </>
            )}
          </View>

          {ride.status === "Completed" && ride.rating && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ratings Summary</Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                {/* User → Driver Rating */}
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="person-circle-outline" size={26} color={color.primaryGray} />
                  <Text
                    style={{
                      fontSize: fontSizes.FONT14,
                      color: color.primaryText,
                      fontFamily: "TT-Octosquares-Medium",
                      marginTop: 5,
                    }}
                  >
                    For Passenger
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    {renderStars(ride.userRating || 0)}

                  </View>
                </View>

                {/* Divider */}
                <View
                  style={{
                    height: 50,
                    width: 1,
                    backgroundColor: color.border,
                    opacity: 0.6,
                  }}
                />

                {/* Driver → User Rating */}
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="id-card-outline" size={26} color={color.primaryGray} />
                  <Text
                    style={{
                      fontSize: fontSizes.FONT14,
                      color: color.primaryText,
                      fontFamily: "TT-Octosquares-Medium",
                      marginTop: 5,
                    }}
                  >
                    For You
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    {renderStars(ride.driverRating || 0)}
                  </View>
                </View>

                {/* Divider */}
                <View
                  style={{
                    height: 50,
                    width: 1,
                    backgroundColor: color.border,
                    opacity: 0.6,
                  }}
                />

                {/* Overall Ride Rating */}
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="podium-outline" size={26} color={color.primaryGray} />
                  <Text
                    style={{
                      fontSize: fontSizes.FONT14,
                      color: color.primaryText,
                      fontFamily: "TT-Octosquares-Medium",
                      marginTop: 5,
                    }}
                  >
                    Ride Avg
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    {renderStars(ride.rating || 0)}
                  </View>
                </View>
              </View>
            </View>
          )}

          {ride.status === "Completed" && !ride.userRating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingTitle}>Rate Your User</Text>

              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => {
                      !ride.userRating && setRating(star)
                      console.log(star)
                    }
                    } // Disable edit if already rated
                    disabled={!!ride.userRating || submitted} // disable if rated or after submission
                  >
                    <MaterialIcons
                      name={
                        star <= (ride.userRating || rating)
                          ? "star"
                          : "star-border"
                      }
                      size={25}
                      color={star <= (ride.userRating || rating) ? "#FFD700" : "#B0B0B0"}
                      style={{ marginHorizontal: 10, marginBottom: 5 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {ride.userRating || submitted ? (
                <Text style={styles.thankYouText}>
                  Thank you for your feedback!
                </Text>
              ) : (
                <Button
                  onPress={handleUserRating}
                  style={[styles.actionButton, styles.supportButton]}
                  title={isSubmitting ? <ActivityIndicator color={color.primary} /> : "Submit Rating"}
                  disabled={isSubmitting}
                />
              )}
            </View>
          )}

        </ScrollView>

        {/* Action Button */}
        {
          ride.status !== "Completed" && ride.status !== "Cancelled" ? (
            <View style={styles.actionButtonContainer}>
              <Button
                title={isStatusChanging ? <ActivityIndicator color={color.primary} /> : getActionButtonTitle(orderStatus)}
                height={48}
                backgroundColor={color.buttonBg}
                textColor={color.primary}
                onPress={handleSubmit}
                disabled={ride.status === "Completed" || isStatusChanging}
              />
            </View>
          ) : (
            <View style={styles.actionButtonContainer}>
              {/* 📞 Contact Support Button */}
              <Button
                onPress={() => router.push('/(routes)/profile/help-support')}
                style={[styles.actionButton, styles.supportButton]}
                title={"Contact Support"}
              />
            </View>
          )
        }
      </View >

      {/* OTP Modal */}
      {
        showOtpModal && (
          <Modal transparent visible animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Enter OTP to start ride</Text>

                <TextInput
                  style={styles.input}
                  value={otpInput}
                  onChangeText={setOtpInput}
                  keyboardType="numeric"
                  maxLength={4}
                />

                <View style={styles.buttonRow}>
                  <Button
                    title={
                      isVerifyingOtp ? (
                        <ActivityIndicator color={color.primary} />
                      ) : (
                        "Verify OTP"
                      )
                    }
                    onPress={() => {
                      if (!isVerifyingOtp) handleOtpVerify(otpInput);
                    }}
                    width={"45%"}
                    disabled={isVerifyingOtp}
                  />

                  <Button
                    title="Cancel"
                    onPress={() => {
                      if (!isVerifyingOtp) setShowOtpModal(false);
                    }}
                    width={"45%"}
                    disabled={isVerifyingOtp}
                  />
                </View>
              </View>
            </View>
          </Modal>
        )
      }

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