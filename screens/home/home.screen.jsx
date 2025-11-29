import {
    View,
    Text,
    FlatList,
    Modal,
    TouchableOpacity,
    Platform,
    ScrollView,
    Alert,
    BackHandler,
    RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/common/header";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import RenderRideItem from "@/components/ride/render.ride.item";
import { external } from "@/styles/external.style";
import { styles } from "./styles";
import RideCard from "@/components/ride/ride.card";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { Gps, Location } from "@/utils/icons";
import color from "@/themes/app.colors";
import Button from "@/components/common/button";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as GeoLocation from "expo-location";
import { Toast } from "react-native-toast-notifications";
import { useGetDriverData, useGetDriverRideHistories, useGetDriverWallet } from "@/hooks/useGetDriverData";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import driverSocketService from "@/utils/socket/socketService";
import { sendPushNotification } from "@/utils/notifications/sendPushNotifications";
import axiosInstance from "@/api/axiosInstance";
import { getDistrict } from "@/utils/location/getDistrict";
import RideModal from "@/components/ride/ride.modal";
import DriverHomeSkeleton from "./home-skelton.screen";
import { useTripRadar } from "@/store/useTripRadar";
import { useDriverLocationStore } from "@/store/driverLocationStore";
import AppAlert from "@/components/modal/alert-modal/alert.modal";

export default function HomeScreen() {
    const { driver, loading: DriverDataLoading, refetchData } = useGetDriverData();
    const setDriver = useTripRadar(state => state.setDriver);

    useEffect(() => {
        if (driver) {
            setDriver(driver); // store driver in zustand
        }
    }, [driver]);
    const { wallet, loading: walletLoading, refetchWallet } = useGetDriverWallet();
    const { recentRides, loading: rideHistoryLoading, refetchRides } = useGetDriverRideHistories();

    const driverRef = useRef(driver);
    const [isOn, setIsOn] = useState();
    const [loading, setloading] = useState(false);

    // at top of the component
    const [lastLocation, setLastLocation] = useState(null);

    const [driverLocation, setDriverLocation] = useState(null);
    const driverLocationRef = useRef(null);

    useEffect(() => {
        driverLocationRef.current = driverLocation;
    }, [driverLocation]);

    const { colors } = useTheme();

    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: "",
        message: "",
        confirmText: "OK",
        showCancel: false,
        onConfirm: () => setShowAlert(false),
        onCancel: () => setShowAlert(false),
    });

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                setAlertConfig({
                    title: "Exit App",
                    message: "Are you sure you want to exit?",
                    confirmText: "Exit",
                    showCancel: true,
                    onConfirm: () => {
                        setShowAlert(false);
                        BackHandler.exitApp();
                    },
                    onCancel: () => setShowAlert(false),
                });

                setShowAlert(true);
                return true; // prevent default
            };

            if (Platform.OS === "android") {
                const subscription = BackHandler.addEventListener(
                    "hardwareBackPress",
                    onBackPress
                );

                return () => subscription.remove();
            }
        }, [])
    );


    // Keep the ref updated whenever driver changes
    useEffect(() => {
        driverRef.current = driver;
    }, [driver]);


    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    async function registerForPushNotificationsAsync() {
        if (Device.isDevice) {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== "granted") {
                Toast.show("Failed to get push token for push notification!", {
                    type: "danger",
                });
                return;
            }
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ??
                Constants?.easConfig?.projectId;
            if (!projectId) {
                Toast.show("Failed to get project id for push notification!", {
                    type: "danger",
                });
            }
            try {
                const pushTokenString = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                await axiosInstance.put(
                    `/driver/update-push-token`,
                    { token: pushTokenString }
                );
                // console.log(pushTokenString);
                // return pushTokenString;
            } catch (e) {
                Toast.show(`${e}`, {
                    type: "danger",
                });
            }
        } else {
            Toast.show("Must use physical device for Push Notifications", {
                type: "danger",
            });
        }

        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }
    }

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await axiosInstance.get(`/driver/me`);

                const driverStatus = res.data?.driver?.status;
                if (driverStatus) {
                    setIsOn(driverStatus === "active");
                }
            } catch (error) {
                console.log("Failed to fetch driver status:", error);
            }
        };

        fetchStatus();
    }, [driver]);

    // // socket updates
    useEffect(() => {
        driverSocketService.connect();

        driverSocketService.clearListeners();

        return () => {
            console.log('unmount works')
            driverSocketService.clearListeners();

            driverSocketService.disconnect();
        }
    }, []);

    const haversineDistance = (coords1, coords2) => {
        const toRad = (x) => (x * Math.PI) / 180;

        const R = 6371e3; // Radius of the Earth in meters
        const lat1 = toRad(coords1.latitude);
        const lat2 = toRad(coords2.latitude);
        const deltaLat = toRad(coords2.latitude - coords1.latitude);
        const deltaLon = toRad(coords2.longitude - coords1.longitude);

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in meters
        return distance;
    };

    const sendLocationUpdate = async (location) => {
        try {
            // ⛔ 1. Skip if status update is in progress
            if (loading === true) {
                console.log("Status update in progress — skipping location update");
                return;
            }

            const driverStr = await AsyncStorage.getItem("driverData");
            if (!driverStr) {
                console.log("Driver data not found — skipping location update");
                return;
            }

            const res = await axiosInstance.get(`/driver/me`);
            if (!res.data.success) {
                console.log("Driver fetch unsuccessful — skipping location update");
                return;
            }

            const driver = res.data.driver;

            // ⛔ 2. Skip if driver is inactive
            if (driver.status !== "active") {
                console.log("Driver is not active — skipping location update");
                return;
            }

            // ✅ 3. Finally send location if all good
            console.log("Driver active — sending location update");
            driverSocketService.sendLocationUpdate(driver.id, location);

        } catch (error) {
            console.log("Location update failed:", error);
        }
    };

    const updateLocation = useDriverLocationStore(state => state.updateLocation);
    const setDistrict = useDriverLocationStore(state => state.setDistrict);

    useEffect(() => {
        (async () => {
            let { status } = await GeoLocation.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Toast.show("Please allow location access!");
                return;
            }

            await GeoLocation.watchPositionAsync(
                {
                    accuracy: GeoLocation.Accuracy.High,
                    timeInterval: 2000,
                    distanceInterval: 2,
                },
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const newLocation = { latitude, longitude };

                    if (
                        !lastLocation ||
                        haversineDistance(lastLocation, newLocation) >= 200
                    ) {
                        getDistrict(latitude, longitude, setDistrict);
                        updateLocation(newLocation);       // 🔥 write to Zustand
                        setDriverLocation(newLocation)
                        await sendLocationUpdate(newLocation);  // socket update
                    }
                }
            );
        })();
    }, [isOn]);



    const handleStatusChange = async () => {
        if (!loading) {
            setloading(true);
            try {
                const response = await axiosInstance.put(`/driver/update-status`, {
                    status: !isOn ? "active" : "inactive",
                });

                console.log("status update ", response.data);

                if (response.data?.driver?.status === "active") {
                    setIsOn(true);
                    Toast.show("You are now active and available for rides!", { type: "success" });
                } else {
                    setIsOn(false);
                    driverSocketService.sendLocationUpdate(driver?.id, { latitude: null, longitude: null });
                    setLastLocation("");
                    setCurrentLocation("");
                    Toast.show("You are now inactive and not available for rides!", { type: "info" });
                }
            } catch (err) {
                console.log("Failed to update driver status:", err);
                const message = err.response?.data?.message || "Failed to update status!";
                Toast.show(message, { type: "danger" });
            } finally {
                setloading(false);
            }
        }
    };

    const { requests, addRequest, rejectRequest, acceptRequest } = useTripRadar();

    // ——————————————— SOCKET LISTENER ———————————————
    useEffect(() => {
        const unsubscribe = driverSocketService.onMessage((msg) => {
            if (msg.type === "rideRequest") {
                addRequest(msg.rideRequest, driverLocationRef.current);
            }
        });
        return () => unsubscribe();
    }, []);



    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await refetchData();
            await refetchRides();
            await refetchWallet();
        } finally {
            setRefreshing(false);
        }
    };


    const driverRideStats = [
        { id: "1", value: driver?.totalEarning, title: "Total Earnings" },
        { id: "2", value: driver?.totalShare, title: "Total Shares" },
        { id: "3", value: driver?.totalRides, title: "Completed Rides" },
        { id: "4", value: wallet?.balance, title: "Wallet Balance" },
        { id: "5", value: driver?.pendingRides, title: "Pending Rides" },
        { id: "6", value: driver?.cancelRides, title: "Cancelled Rides" },
    ];


    if (DriverDataLoading || walletLoading || rideHistoryLoading) {

        return <DriverHomeSkeleton />
    }
    return (
        <View style={[external.fx_1]}>
            <View style={styles.spaceBelow}>
                <Header isOn={isOn} toggleSwitch={() => handleStatusChange()} driver={driver} />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            tintColor={color.primary}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    style={{ marginTop: 10 }}
                >

                    <FlatList
                        data={driverRideStats}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <RenderRideItem item={item} />
                        )}
                    />
                    <View style={
                        [styles.rideContainer,
                        ]}
                    >
                        <Text style={[styles.rideTitle, { color: colors.text }]}>
                            Recent Rides
                        </Text>
                        <View style={{ flex: 1, marginBottom: 120 }}>
                            <FlatList
                                data={recentRides.slice(0, 3)} // slice if you want to skip the first item
                                keyExtractor={(item, index) => item.id || index.toString()}
                                renderItem={({ item }) => <RideCard item={item} />}
                                ListEmptyComponent={
                                    <Text style={{
                                        fontFamily: "TT-Octosquares-Medium",
                                        marginBottom: 12,
                                        color: color.lightGray,
                                    }}>
                                        You didn't take any ride yet!
                                    </Text>
                                }
                                contentContainerStyle={{ paddingBottom: 10 }}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>


                    </View>
                </ScrollView>
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
        </View>
    );
}