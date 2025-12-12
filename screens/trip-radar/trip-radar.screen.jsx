import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { customMapStyle } from "@/utils/map/mapStyle";
import Button from "@/components/common/button";
import Images from "@/utils/images";
import color from "@/themes/app.colors";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import { useTripRadar } from "@/store/useTripRadar";
import { useDriverEarnings, useGetDriverData } from "@/hooks/useGetDriverData";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import fonts from "@/themes/app.fonts";
import { useDriverLocationStore } from "@/store/driverLocationStore";
import getVehicleIcon from "@/utils/ride/getVehicleIcon";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

export default function TripRadarScreen() {
  const { requests, rejectRequest, acceptRequest, loadingRejectRequests, loadingAcceptRequests } = useTripRadar();
  const isGlobalProcessing = useTripRadar((s) => s.isProcessing);

  const { driver, refetchData } = useGetDriverData();
  const { earnings, refetchEarnings } = useDriverEarnings();

  const currentLocation = useDriverLocationStore((s) => s.currentLocation);
  const animatedLocation = useDriverLocationStore((s) => s.animatedLocation);
  const heading = useDriverLocationStore((s) => s.heading);

  const [refreshing, setRefreshing] = useState(false);
  const [todaysEarnings, setTodaysEarnings] = useState('0');
  const [todaysRideCount, setTodaysRideCount] = useState('0');

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayData = earnings?.chartData?.find(item => item.label === today);
    setTodaysEarnings(todayData?.driverEarnings ?? 0);
    setTodaysRideCount(todayData?.rideCount ?? 0);
  }, [earnings])

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetchData();
      await refetchEarnings();
    } finally {
      setRefreshing(false);
    }
  };

  const driverLocationRef = useRef(null);
  const mapRef = useRef();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["35%", "60%", "90%"], []);

  useEffect(() => {
    driverLocationRef.current = currentLocation;
  }, [currentLocation]);

  useEffect(() => {
    setSelectedRequest(requests[requests.length - 1]);
    setTimeout(() => centerMapOnRequest(requests[requests.length - 1]), 300);
  }, [requests.length]);

  const centerMapOnRequest = (req) => {
    if (!req || !mapRef.current) return;
    const { currentLocation, marker } = req.data;
    mapRef.current.fitToCoordinates(
      [driverLocationRef.current, currentLocation, marker],
      {
        edgePadding: { top: 140, bottom: 350, left: 50, right: 50 },
        animated: true,
      }
    );
    sheetRef.current?.snapToIndex(0);
  };

  const lineDash = Platform.select({ ios: [0, 0], android: undefined });

  if (!currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.primary} />
        <Text style={styles.loadingText}>Acquiring GPS Signal...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* --- HUD: STATUS & EARNINGS ISLAND --- */}
      <View style={styles.hudContainer}>
        {/* Status Pill */}
        <TouchableOpacity activeOpacity={0.8} onPress={onRefresh} style={styles.statusPill}>
          <View style={[styles.statusDot, { backgroundColor: driver?.status === "active" ? "#4CAF50" : "#F44336" }]} />
          <Text style={styles.statusText}>{driver?.status === "active" ? "Online" : "Offline"}</Text>
        </TouchableOpacity>

        {/* Vertical Divider */}
        <View style={styles.hudDivider} />

        {/* Earnings */}
        <View style={styles.earningsSection}>
          <Text style={styles.hudLabel}>TODAY</Text>
          <Text style={styles.hudValue}>₹{todaysEarnings}</Text>
        </View>

        {/* Vertical Divider */}
        <View style={styles.hudDivider} />

        {/* Rides */}
        <View style={styles.earningsSection}>
          <Text style={styles.hudLabel}>RIDES</Text>
          <Text style={styles.hudValue}>{todaysRideCount}</Text>
        </View>
      </View>


      {/* --- MAP --- */}
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={customMapStyle}
        initialRegion={{ ...currentLocation, latitudeDelta: 0.06, longitudeDelta: 0.06 }}
        provider={PROVIDER_GOOGLE}
        userInterfaceStyle="dark"
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {animatedLocation && (
          <Marker.Animated coordinate={animatedLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <Image
              source={getVehicleIcon(driver ? driver.vehicle_type : "Sedan")}
              style={{
                width: 35,
                height: 35,
                resizeMode: "contain",
                transform: [{ rotate: `${driver?.vehicle_type === "Auto" ? heading + 180 : heading}deg` }],
              }}
            />
          </Marker.Animated>
        )}

        {selectedRequest && requests.length > 0 && (
          <>
            <Marker coordinate={selectedRequest.data.currentLocation}>
              <Image source={Images.mapPickupMarker} style={styles.markerIcon} resizeMode="contain" />
            </Marker>
            <Marker coordinate={selectedRequest.data.marker}>
              <Image source={Images.mapDropMarker} style={styles.markerIcon} resizeMode="contain" />
            </Marker>
            <MapViewDirections
              origin={currentLocation}
              destination={selectedRequest.data.currentLocation}
              apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}
              strokeWidth={4}
              strokeColor={color.strokeColor}
              lineDashPattern={lineDash}
            />
            <MapViewDirections
              origin={selectedRequest.data.currentLocation}
              destination={selectedRequest.data.marker}
              apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}
              strokeWidth={4}
              strokeColor={color.buttonBg} // Highlight the trip route
              lineDashPattern={lineDash}
            />
          </>
        )}
      </MapView>

      {/* --- PREMIUM BOTTOM SHEET --- */}
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: '#444', width: 40 }}
        backgroundStyle={{ backgroundColor: color.subPrimary }}
      >
        <View style={{ flex: 1, paddingHorizontal: 16 }}>

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Trip Radar</Text>
            {requests.length > 0 && (
              <View style={styles.radarBadge}>
                <View style={styles.radarPulse} />
                <Text style={styles.radarText}>{requests.length} New</Text>
              </View>
            )}
          </View>

          <BottomSheetFlatList
            data={requests}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="scan-outline" size={48} color="#333" style={{ marginBottom: 10 }} />
                <Text style={styles.emptySubtitle}>
                  {driver?.status === "active" ? "Scanning area for passengers..." : "Go Online to start receiving requests"}
                </Text>
              </View>
            )}
            renderItem={({ item }) => {
              const r = item.data;
              const isAcceptLoading = loadingAcceptRequests[item.id];
              const isRejectLoading = loadingRejectRequests[item.id];

              // --- MOCK DATA FOR NAME/RATING (Replace with r.user.name if available in backend) ---
              const userName = r.user.name || "Passenger";
              const userRating = r.user.ratings || 'New';

              return (
                <TouchableOpacity
                  activeOpacity={0.95}
                  onPress={() => {
                    setSelectedRequest(item);
                    centerMapOnRequest(item);
                  }}
                  style={styles.premiumCard}
                >
                  {/* --- CARD HEADER: USER INFO & TIMER --- */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.userInfo}>
                      <View style={styles.userAvatar}>
                        <Ionicons name="person" size={14} color="#fff" />
                      </View>
                      <View>
                        <Text style={styles.userName}>{userName}</Text>
                        <View style={styles.ratingRow}>
                          <Ionicons name="star" size={12} color="#FFD700" />
                          <Text style={styles.ratingText}>{userRating}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.timerContainer}>
                      <Ionicons name="time-outline" size={12} color={color.lightGreen} style={{ marginRight: 4 }} />
                      <Text style={styles.timerText}>{item.countdown}s</Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  {/* --- CARD BODY: ROUTE & PRICE --- */}
                  <View style={styles.cardBodyRow}>

                    {/* VISUAL TIMELINE */}
                    <View style={styles.timelineContainer}>
                      {/* Pickup */}
                      <View style={styles.timelineRow}>
                        <View style={styles.timelineDotPickup} />
                        <View style={styles.addressBox}>
                          <Text style={styles.label}>PICKUP ({r.kmToPickup} km)</Text>
                          <Text style={styles.address} numberOfLines={1}>{r.currentLocationName}</Text>
                        </View>
                      </View>

                      {/* Connector Line */}
                      <View style={styles.timelineLine} />

                      {/* Drop */}
                      <View style={styles.timelineRow}>
                        <View style={styles.timelineDotDrop} />
                        <View style={styles.addressBox}>
                          <Text style={styles.label}>DROP ({r.kmPickupToDrop} km)</Text>
                          <Text style={styles.address} numberOfLines={1}>{r.destinationLocation}</Text>
                        </View>
                      </View>
                    </View>

                    {/* PRICE BLOCK (Right Aligned) */}
                    <View style={styles.priceContainer}>
                      <Text style={styles.currencySymbol}>₹</Text>
                      <Text style={styles.priceValue}>{r?.fare?.totalFare}</Text>
                      <Text style={styles.estLabel}>Est. Earnings</Text>
                    </View>
                  </View>

                  {/* --- CARD FOOTER: ACTIONS --- */}
                  <View style={styles.actionGrid}>
                    <Button
                      title={isRejectLoading ? <ActivityIndicator color={color.primary} /> : "Ignore"}
                      width="35%"
                      backgroundColor="transparent"
                      style={styles.rejectBtn}
                      textColor={color.primaryGray}
                      disabled={isRejectLoading || isAcceptLoading || isGlobalProcessing}
                      onPress={() => rejectRequest(item.id)}
                    />
                    <Button
                      title={isAcceptLoading ? <ActivityIndicator color={color.subPrimary} /> : "Accept Ride"}
                      width="62%"
                      backgroundColor={color.buttonBg}
                      textColor={color.primary}
                      disabled={isAcceptLoading || isRejectLoading || isGlobalProcessing}
                      onPress={() => acceptRequest(item.id)}
                    />
                  </View>

                </TouchableOpacity>
              );
            }}
          />
        </View>
      </BottomSheet>
    </View>
  );
}

// ——————————————— PREMIUM STYLES ———————————————
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.subPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.subPrimary,
  },
  loadingText: {
    fontFamily: "TT-Octosquares-Medium",
    color: "#666",
    marginTop: 10,
    fontSize: fontSizes.FONT12
  },

  // --- HUD (Heads Up Display) ---
  hudContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    backgroundColor: 'rgba(20, 20, 20, 0.85)', // Dark Glass
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    zIndex: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#fff',
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT12,
  },
  hudDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  earningsSection: {
    alignItems: 'center',
  },
  hudLabel: {
    color: '#666',
    fontSize: fontSizes.FONT10,
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  hudValue: {
    color: '#fff',
    fontSize: fontSizes.FONT14,
    fontFamily: "TT-Octosquares-Medium",
  },

  // --- MAP ---
  map: { flex: 1 },
  markerIcon: {
    width: windowWidth(35),
    height: windowHeight(35),
    tintColor: color.primaryGray,
  },

  // --- BOTTOM SHEET HEADER ---
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 5,
  },
  sheetTitle: {
    color: "#fff",
    fontSize: fontSizes.FONT20,
    fontFamily: "TT-Octosquares-Medium",
  },
  radarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  radarPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.buttonBg,
    marginRight: 6,
  },
  radarText: {
    color: color.buttonBg,
    fontSize: fontSizes.FONT12,
    fontFamily: "TT-Octosquares-Medium",
  },

  // --- PREMIUM REQUEST CARD ---
  premiumCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  // Header Row (User + Timer)
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    color: '#fff',
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT14,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 2.5

  },
  ratingText: {
    color: '#ccc',
    fontSize: fontSizes.FONT13,
    fontFamily: "TT-Octosquares-Medium",
    marginLeft: 3,
    top: 1
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timerText: {
    color: color.lightGreen,
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT12,
  },

  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 12,
  },

  // Body Row (Timeline + Price)
  cardBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timelineContainer: {
    flex: 1,
    marginRight: 10,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 36, // Fixed height for consistent lines
  },
  timelineLine: {
    position: 'absolute',
    left: 4, // Center of dot
    top: 10,
    bottom: 0,
    width: 1,
    height: 32,
    backgroundColor: '#444',
  },
  timelineDotPickup: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: color.buttonBg,
    marginTop: 3,
    marginRight: 10,
    zIndex: 2,
  },
  timelineDotDrop: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 2,
    borderColor: '#FF5252',
    backgroundColor: '#1E1E1E',
    marginTop: 3,
    marginRight: 10,
    zIndex: 2,
  },
  addressBox: {
    flex: 1,
  },
  label: {
    color: '#666',
    fontSize: fontSizes.FONT10,
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 1,
  },
  address: {
    color: '#E0E0E0',
    fontSize: fontSizes.FONT13,
    fontFamily: "TT-Octosquares-Medium",
  },

  // Price Block
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.05)',
  },
  currencySymbol: {
    color: color.buttonBg,
    fontSize: fontSizes.FONT20,
    fontFamily: "TT-Octosquares-Medium",
    position: 'absolute',
    top: 4,
    left: 10,
  },
  priceValue: {
    color: color.buttonBg,
    fontSize: fontSizes.FONT20,
    fontFamily: "TT-Octosquares-Medium",
    lineHeight: 30,
  },
  estLabel: {
    color: '#666',
    fontSize: fontSizes.FONT10,
    fontFamily: "TT-Octosquares-Medium",
  },

  // Footer Actions
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  rejectBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    opacity: 0.6,
  },
  emptySubtitle: {
    color: '#888',
    fontSize: fontSizes.FONT14,
    fontFamily: "TT-Octosquares-Medium",
    textAlign: 'center',
  },
});