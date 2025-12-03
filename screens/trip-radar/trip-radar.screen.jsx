import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
  LayoutAnimation,
  UIManager,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { customMapStyle } from "@/utils/map/mapStyle";
import Button from "@/components/common/button";
import Images from "@/utils/images";
import color from "@/themes/app.colors";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import { router } from "expo-router";
import driverSocketService from "@/utils/socket/socketService";
import { useTripRadar } from "@/store/useTripRadar";
import * as GeoLocation from "expo-location";
import { useDriverEarnings, useGetDriverData } from "@/hooks/useGetDriverData";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import fonts from "@/themes/app.fonts";
import { useDriverLocationStore } from "@/store/driverLocationStore";
import getVehicleIcon from "@/utils/ride/getVehicleIcon";
import { shallow } from "zustand/shallow";

export default function TripRadarScreen() {
  const { requests, rejectRequest, acceptRequest, loadingRejectRequests, loadingAcceptRequests } = useTripRadar();

  const { driver, loading: driverDataLoading, refetchData } = useGetDriverData();
  const { earnings, loading: driverEarningsLoading, refetchEarnings } = useDriverEarnings();

  const currentLocation = useDriverLocationStore((s) => s.currentLocation);
  const animatedLocation = useDriverLocationStore((s) => s.animatedLocation);
  const heading = useDriverLocationStore((s) => s.heading);



  const [refreshing, setRefreshing] = useState(false);
  const [todaysEarnings, setTodaysEarnings] = useState('');
  const [todaysRideCount, setTodaysRideCount] = useState('');

  useEffect(() => {
    // Convert today to YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Find today in chartData
    const todayData = earnings?.chartData?.find(item => item.label === today);

    // Fallback if not found
    setTodaysEarnings(todayData?.driverEarnings ?? 0);
    setTodaysRideCount(todayData?.rideCount ?? 0);

  }, [earnings])

  const onRefresh = async () => {
    console.log('rfrdh')
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

  // NEW: Selected request
  const [selectedRequest, setSelectedRequest] = useState(null);

  // NEW: Bottom sheet
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["30%", "55%", "85%"], []);

  // Sync ref
  useEffect(() => {
    driverLocationRef.current = currentLocation;
  }, [currentLocation]);



  // NEW: Auto-select first request
  useEffect(() => {
    // if (requests.length > 0 && !selectedRequest) {
    // console.log(requests.length)
    setSelectedRequest(requests[requests.length - 1]);
    console.log(requests[requests.length - 1])
    setTimeout(() => centerMapOnRequest(requests[requests.length - 1]), 300);
    // }
  }, [requests.length]);

  // NEW: FOCUS MAP on selected request
  const centerMapOnRequest = (req) => {
    if (!req || !mapRef.current) return;

    const { currentLocation, marker } = req.data;


    mapRef.current.fitToCoordinates(
      [
        driverLocationRef.current,
        currentLocation,
        marker,
      ],
      {
        edgePadding: { top: 120, bottom: 350, left: 60, right: 60 },
        animated: true,
      }
    );

    sheetRef.current?.snapToIndex(0);

  };

  const strokeColor = Platform.select({
    ios: color.strokeColor,
    android: color.strokeColor,
  });

  const lineDash = Platform.select({
    ios: [0, 0],
    android: undefined,
  });

  if (!currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Locating GPS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}
    >
      {requests.length == 0 && (
        <>

          {/* ONLINE BADGE (same as yours) */}
          <TouchableOpacity style={styles.headerOverlay} onPress={() => onRefresh()}>
            <View style={styles.statusPill}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: driver?.status === "active" ? color.primaryText : color.primaryText },
                ]}
              />
              <Text style={styles.statusText}>
                {driver?.status === "active" ? "Online & Searching" : "You are Offline"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* FLOATING TODAY'S EARNINGS CARD */}

          <View style={styles.earningsCard}>
            <View style={styles.earnRow}>
              <Text style={styles.earnTitle}>Today's Earnings</Text>
              <Text style={styles.earnAmount}>₹ {todaysEarnings}</Text>
            </View>

            <View style={styles.earnRowBottom}>
              <Text style={styles.earnSubtitle}>Completed Rides</Text>
              <Text style={styles.earnCount}>{todaysRideCount}</Text>
            </View>
          </View>
        </>

      )}


      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={customMapStyle}
        initialRegion={{
          ...currentLocation,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        }}
        provider={PROVIDER_GOOGLE}
        // showsUserLocation
        userInterfaceStyle="dark"
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {animatedLocation && (
          <Marker.Animated
            coordinate={animatedLocation}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Image
              source={getVehicleIcon(driver ? driver.vehicle_type : "Sedan")}
              style={{
                width: 35,
                height: 35,
                resizeMode: "contain",
                transform: [
                  {
                    rotate: `${driver?.vehicle_type === "Auto"
                      ? heading + 180
                      : heading
                      }deg`,
                  },
                ],
              }}
            />
          </Marker.Animated>
        )}
        {selectedRequest && requests.length > 0 && (
          <>
            {/* Pickup Marker */}
            <Marker coordinate={selectedRequest.data.currentLocation}>
              <Image
                source={Images.mapPickupMarker}
                style={{
                  width: windowWidth(35),
                  height: windowHeight(35),
                  tintColor: color.primaryGray,
                }}
                resizeMode="contain"
              />
            </Marker>

            {/* Drop Marker */}
            <Marker coordinate={selectedRequest.data.marker}>
              <Image
                source={Images.mapDropMarker}
                style={{
                  width: windowWidth(35),
                  height: windowHeight(35),
                  tintColor: color.primaryGray,
                }}
                resizeMode="contain"
              />
            </Marker>

            {/* Route to Pickup */}
            <MapViewDirections
              origin={currentLocation}
              destination={selectedRequest.data.currentLocation}
              apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}
              strokeWidth={4}
              strokeColor={color.strokeColor}
              lineDashPattern={lineDash}
            />

            {/* Pickup → Drop */}
            <MapViewDirections
              origin={selectedRequest.data.currentLocation}
              destination={selectedRequest.data.marker}
              apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}
              strokeWidth={4}
              strokeColor={color.animatedStrokeColor}
              lineDashPattern={lineDash}
            />
          </>
        )}
      </MapView>

      {/* NEW: Uber-Style Bottom Sheet */}
      <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints} backgroundStyle={{ backgroundColor: color.subPrimary, zIndex: 0 }}>
        <View style={{ paddingHorizontal: 16, zIndex: 0 }}>

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Trip Radar</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{requests.length}</Text>
            </View>
          </View>

          <BottomSheetFlatList
            // refreshControl={
            //   <RefreshControl
            //     tintColor={color.primary}
            //     refreshing={refreshing}
            //     onRefresh={onRefresh}
            //   />
            // }
            data={requests}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              requests.length > 0
                ? { paddingHorizontal: 5, paddingBottom: 40, flexGrow: 1 }
                : { paddingHorizontal: 5, paddingBottom: 75 }
            }

            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptySubtitle}>
                  {driver?.status === "active"
                    ? "Searching for passengers..."
                    : "You are offline. Go online to receive ride requests."}
                </Text>
              </View>
            )}
            renderItem={({ item }) => {
              const r = item.data;
              const isAcceptLoading = loadingAcceptRequests[item.id];
              const isRejectLoading = loadingRejectRequests[item.id];


              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedRequest(item);
                    centerMapOnRequest(item);
                    // sheetRef.current?.snapToIndex(2); // 🔥 Expand sheet to 85%
                  }}
                >
                  <View style={styles.card}>
                    {/* Price + Timer */}
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.priceText}>₹{r?.fare?.totalFare}</Text>
                        <Text style={styles.paymentType}>Includes taxes</Text>
                      </View>
                      <View style={styles.timerBadge}>
                        <Text style={styles.timerText}>⏱ {item.countdown}s</Text>
                      </View>
                    </View>

                    {/* Pickup */}
                    <Text style={styles.addressLabel}>
                      PICKUP • {r.kmToPickup} km
                    </Text>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {r.currentLocationName}
                    </Text>

                    {/* Drop */}
                    <Text style={[styles.addressLabel, { marginTop: 10 }]}>
                      DROP • {r.kmPickupToDrop} km
                    </Text>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {r.destinationLocation}
                    </Text>

                    {/* Actions */}
                    <View style={styles.actionRow}>
                      <Button
                        title={isRejectLoading ? <ActivityIndicator color={color.primary} /> : "Reject"}
                        width="45%"
                        disabled={isRejectLoading || isAcceptLoading}
                        onPress={() => rejectRequest(item.id)}
                      />
                      <Button
                        title={isAcceptLoading ? <ActivityIndicator color={color.primary} /> : "Accept"}
                        width="45%"
                        textColor="#000"
                        disabled={isAcceptLoading || isRejectLoading}
                        onPress={() => {
                          acceptRequest(item.id);
                        }}
                      />
                    </View>
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

// ——————————————— STYLES ———————————————
const styles = StyleSheet.create({
  earningsCard: {
    position: "absolute",
    top: 110,
    alignSelf: "center",
    width: "88%",
    backgroundColor: color.subPrimary, // glass effect
    paddingVertical: 15,
    paddingHorizontal: 15,
    gap: 5,
    zIndex: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },

  earnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  earnTitle: {
    color: color.primaryText,
    fontSize: fonts.FONT14,
    fontFamily: "TT-Octosquares-Medium",
  },

  earnAmount: {
    color: color.primaryText,
    fontSize: fontSizes.FONT14,
    fontFamily: "TT-Octosquares-Medium",
  },

  earnRowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  earnSubtitle: {
    color: color.primaryText,
    fontSize: fontSizes.FONT14,
    fontFamily: "TT-Octosquares-Medium",
  },

  earnCount: {
    color: color.primaryText,
    fontSize: fontSizes.FONT17,
    fontFamily: "TT-Octosquares-Medium",
  },

  container: {
    flex: 1,
    backgroundColor: color.subPrimary,
  },
  loadingContainer: {
    flex: 1,
    // backgroundColor: "#101010",
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    fontFamily: "TT-Octosquares-Medium",
    color: "#888",
    fontSize: 16,
    letterSpacing: 1
  },
  // Header
  headerOverlay: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 50,
    alignItems: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.subPrimary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "TT-Octosquares-Medium",
  },
  // Map
  mapContainer: {
    height: windowHeight(500),
    width: "100%",
  },
  map: {
    flex: 1,
  },
  mapFadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'transparent',
    // If you had LinearGradient, this would be a gradient from transparent to black
  },
  // Custom Markers on Map
  customMarkerContainer: {
    alignItems: 'center',
  },
  markerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff'
  },
  markerLabel: {
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4
  },
  markerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000'
  },
  // List Area
  listContainer: {
    flex: 1,
    backgroundColor: color.subPrimary, // Pure black for bottom section
    // marginTop: -200, // Overlap map slightly
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "TT-Octosquares-Medium",
  },
  countBadge: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: "TT-Octosquares-Medium",
  },
  // Card Styling
  card: {
    // backgroundColor: "#181818",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.4,
    // shadowRadius: 8,
    // elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  priceText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 2,
  },
  paymentType: {
    color: "#888",
    fontSize: 12,
    fontFamily: "TT-Octosquares-Medium",
  },
  timerBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timerText: {
    color: color.lightGreen,
    fontFamily: "TT-Octosquares-Medium",
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginVertical: 12,
  },
  // Route Vis
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineVisual: {
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    width: 1,
    height: 34, // Adjust based on text height
    backgroundColor: '#444',
    marginVertical: 4,
  },
  timelineSquare: {
    width: 10,
    height: 10,
    borderRadius: 2, // Square-ish
  },
  addressContent: {
    flex: 1,
  },
  addressRow: {
    justifyContent: 'center',
    height: 20, // Fixed height to align with dots
  },
  addressLabel: {
    color: color.primaryGray,
    fontSize: 11,
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressText: {
    color: "#E0E0E0",
    fontSize: 15,
    fontFamily: "TT-Octosquares-Medium",
  },
  // Actions
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 15
  },

  // ... existing styles

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40, // Push it down slightly
    paddingHorizontal: 40,
  },
  radarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A1A1A', // Dark circle bg
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  emptyTitle: {
    color: color.primaryText,
    fontSize: 18,
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#666',
    fontSize: 14,
    fontFamily: "TT-Octosquares-Medium",
    textAlign: 'center',
    lineHeight: 20,
  },
});