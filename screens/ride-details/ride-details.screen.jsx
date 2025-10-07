import { View, Text, Linking, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import color from "@/themes/app.colors";
import Button from "@/components/common/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "@/api/axiosInstance";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import driverSocketService from "@/utils/socket/socketService";
import { sendPushNotification } from "@/utils/notifications/sendPushNotifications";
import { Toast } from "react-native-toast-notifications";

export default function RideDetailsScreen() {
  const { rideId } = useLocalSearchParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderStatus, setOrderStatus] = useState("Booked");

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

        const { data } = await axiosInstance.get(`/ride/${id}`);
        if (data.success) {
          setRide(data.ride);
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
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideId]);

  const handleSubmit = async () => {
    if (!ride) return;
    try {
      // Define status transitions
      const nextStatusMap = {
        Booked: "Processing",
        Processing: "Ongoing",
        Ongoing: "Completed",
        Completed: "Completed", // stays completed
      };

      const newStatus = nextStatusMap[orderStatus] || "Booked";

      const response = await axiosInstance.put(`/driver/update-ride-status`, {
        rideStatus: newStatus,
        rideId: ride.id,
      });

      const updatedStatus = response.data.updatedRide.status;
      setOrderStatus(updatedStatus);

      // Push notification messages
      let message = "";
      if (updatedStatus === "Processing") {
        message = "Your driver is on the way to pick you up!";
      } else if (updatedStatus === "Ongoing") {
        message = "Your ride has started! Have a Safe Journey";
      } else if (updatedStatus === "Completed") {
        message = "Your ride has been completed! Thank You";
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
      Toast.show("Failed to update ride status", { type: "danger" });
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

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!ride) return null;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {ride.currentLocation && <Marker coordinate={ride.currentLocation} />}
          {ride.destinationLocation && <Marker coordinate={ride.destinationLocation} />}
          {ride.currentLocation && ride.destinationLocation && (
            <MapViewDirections
              origin={ride.currentLocation}
              destination={ride.destinationLocation}
              apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}
              strokeWidth={3}
              strokeColor={color.buttonBg}
            />
          )}
        </MapView>
      </View>

      <View style={styles.cardContainer}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Status Indicator */}
          <View style={styles.statusIndicator}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    orderStatus === "Booked"
                      ? "#4285F4" // Blue for booked
                      : orderStatus === "Processing"
                        ? "#FBBC05" // Yellow for on the way
                        : orderStatus === "Ongoing"
                          ? color.buttonBg // Your app's primary color
                          : "#34A853", // Green for completed
                },
              ]}
            />
            <Text style={styles.statusText}>
              {orderStatus === "Booked"
                ? "Ride Confirmed"
                : orderStatus === "Processing"
                  ? "Going to pickup"
                  : orderStatus === "Ongoing"
                    ? "Trip in progress"
                    : "Trip completed"}
            </Text>
          </View>


          {/* Passenger Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Passenger</Text>
            <View style={styles.passengerInfo}>
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={24} color="white" />
              </View>
              <View style={styles.passengerDetails}>
                <Text style={styles.passengerName}>{ride.userId.name}</Text>
                <TouchableOpacity style={styles.callButton} onPress={callPassenger}>
                  <FontAwesome name="phone" size={14} color="white" />
                  <Text style={styles.callButtonText}> Call Passenger</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Navigation & Trip Details remain similar, just replace `orderData` with `ride` */}
          {/* Navigation Buttons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Navigation</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.navButton, { marginRight: 8 }]}
                onPress={() => openNavigation(ride?.currentLocation)}
              >
                <MaterialIcons name="directions" size={20} color="white" />
                <Text style={styles.navButtonText}>Pickup</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navButton}
                onPress={() => openNavigation(ride?.destination)}
              >
                <MaterialIcons name="directions" size={20} color="white" />
                <Text style={styles.navButtonText}>Destination</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Trip Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trip Details</Text>

            <View style={styles.detailItem}>
              <MaterialIcons name="location-pin" size={20} color="#5F6368" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Pickup</Text>
                <Text style={styles.detailText} numberOfLines={2}>
                  {ride?.currentLocationName || "Current location"}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <MaterialIcons name="flag" size={20} color="#5F6368" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Destination</Text>
                <Text style={styles.detailText} numberOfLines={2}>
                  {ride?.destinationLocationName || "Destination"}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <MaterialIcons name="directions-car" size={20} color="#5F6368" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Vehicle</Text>
                <Text style={styles.detailText}>
                  {ride?.driverId?.vehicle_type} • {ride?.driverId?.vehicle_color}
                </Text>
              </View>
            </View>
          </View>

          {/* Fare Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fare Breakdown</Text>

            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Distance</Text>
              <Text style={styles.fareValue}>₹{ride?.distance}</Text>
            </View>

            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Your Earnings</Text>
              <Text style={styles.fareValue}>₹{ride?.driverEarnings}</Text>
            </View>

            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Platform Share</Text>
              <Text style={styles.fareValue}>₹{ride?.platformShare}</Text>
            </View>

            <View style={[styles.fareRow, { marginTop: 8 }]}>
              <Text style={[styles.fareLabel, { fontWeight: "600" }]}>Total</Text>
              <Text style={[styles.fareValue, { fontWeight: "600" }]}>
                ₹{ride?.totalFare}
              </Text>
            </View>
          </View>
        </ScrollView>
        {ride.status !== "Completed" && (
          <View style={styles.actionButtonContainer}>
            <Button
              title={
                orderStatus === "Booked"
                  ? "Go to Pick Up"
                  : orderStatus === "Processing"
                    ? "Start Ride"
                    : orderStatus === "Ongoing"
                      ? "Complete Ride"
                      : "Ride Completed"
              }
              height={48}
              backgroundColor={color.buttonBg}
              textColor="white"
              onPress={handleSubmit}
              disabled={ride.status === "Completed"}
            />
          </View>
        )}

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  mapContainer: {
    height: '40%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -24,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
    fontFamily: 'TT-Octosquares-Medium',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5F6368',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'TT-Octosquares-Medium',
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: color.buttonBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 4,
    fontFamily: 'TT-Octosquares-Medium',
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: color.buttonBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  callButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'TT-Octosquares-Medium',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: color.buttonBg,
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    fontFamily: 'TT-Octosquares-Medium',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#5F6368',
    marginBottom: 2,
    fontFamily: 'TT-Octosquares-Medium',
  },
  detailText: {
    fontSize: 16,
    color: '#202124',
    fontFamily: 'TT-Octosquares-Medium',
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fareLabel: {
    fontSize: 14,
    color: '#5F6368',
    fontFamily: 'TT-Octosquares-Medium',
  },
  fareValue: {
    fontSize: 14,
    color: '#202124',
    fontFamily: 'TT-Octosquares-Medium',
  },
  actionButtonContainer: {
    paddingBottom: 24,
    paddingTop: 8,
  },
});