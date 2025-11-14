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
export default function HomeScreen() {
    const notificationListener = useRef();
    const { driver, loading: DriverDataLoading, refetchData } = useGetDriverData();
    const { wallet, loading: walletLoading, refetchWallet } = useGetDriverWallet();
    const { recentRides, loading: rideHistoryLoading, refetchRides } = useGetDriverRideHistories();

    const [district, setDistrict] = useState()

    const driverRef = useRef(driver);
    const [userData, setUserData] = useState(null);
    const [isOn, setIsOn] = useState();
    const [loading, setloading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    // at top of the component
    const [timeoutMessage, setTimeoutMessage] = useState("");
    const [countdown, setCountdown] = useState(null);
    const currentRequestRef = useRef(null);
    const countdownIntervalRef = useRef(null);
    const autoRejectTimeoutRef = useRef(null);

    const [rideDetails, setRideDetails] = useState("");
    const [currentLocationName, setcurrentLocationName] = useState("");
    const [destinationLocationName, setdestinationLocationName] = useState("");
    const [distance, setdistance] = useState();
    const [wsConnected, setWsConnected] = useState(false);
    const [firstMarker, setFirstMarker] = useState(null);
    const [secondMarker, setSecondMarker] = useState(null);
    const [fare, setFare] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [lastLocation, setLastLocation] = useState(null);
    const lastUpdateTimeRef = useRef(0);

    const { colors } = useTheme();

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    "Exit App",
                    "Are you sure you want to exit?",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Exit", onPress: () => BackHandler.exitApp() },
                    ],
                    { cancelable: true }
                );
                return true; // Prevent default back behavior
            };

            if (Platform.OS === "android") {
                const subscription = BackHandler.addEventListener(
                    "hardwareBackPress",
                    onBackPress
                );

                // Cleanup on unmount
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

            AsyncStorage.getItem("driverData").then(async (driverStr) => {
                if (driverStr) {
                    const res = await axiosInstance.get(`/driver/me`);

                    if (res.data.success) {
                        const driver = res.data.driver;

                        if (driver.status === "active") {
                            console.log('Driver active updating location')
                            driverSocketService.sendLocationUpdate(driver.id, location);
                        } else {
                            console.log('Driver inactive skip updating location')

                        }
                    } else {
                        console.log("Driver fetch unsuccessful, skipping location update.");
                    }
                } else {
                    console.log("Driver data not found, location updates will not start.");
                }
            });

        } catch (error) {
            console.log("Location update failed:", error);
        }
    };

    useEffect(() => {
        (async () => {
            let { status } = await GeoLocation.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Toast.show("Please give us to access your location to use this app!");
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
                        getDistrict(latitude, longitude, setDistrict)
                        setCurrentLocation(newLocation);
                        setLastLocation(newLocation);
                        await sendLocationUpdate(newLocation);

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


    // ---------- socket listener + auto-reject ----------
    useEffect(() => {
        // message handler
        const handleMessage = (message) => {
            console.log(message)
            if (message.type === "rideRequest") {
                const orderData = message.rideRequest;

                // save current request (so accept/reject can reference it)
                currentRequestRef.current = orderData;

                // populate UI states (your existing setters)
                setRideDetails(orderData);
                setFirstMarker({
                    latitude: orderData.currentLocation.latitude,
                    longitude: orderData.currentLocation.longitude,
                });
                setSecondMarker({
                    latitude: orderData.marker.latitude,
                    longitude: orderData.marker.longitude,
                });
                setRegion({
                    latitude: (orderData.currentLocation.latitude + orderData.marker.latitude) / 2,
                    longitude: (orderData.currentLocation.longitude + orderData.marker.longitude) / 2,
                    latitudeDelta:
                        Math.abs(orderData.currentLocation.latitude - orderData.marker.latitude) * 2,
                    longitudeDelta:
                        Math.abs(orderData.currentLocation.longitude - orderData.marker.longitude) * 2,
                });
                setdistance(orderData.distance);
                setcurrentLocationName(orderData.currentLocationName);
                setdestinationLocationName(orderData.destinationLocation);
                setUserData(orderData.user);
                setFare(orderData.fare);

                // show modal
                setIsModalVisible(true);

                // reset any old timers / messages
                setTimeoutMessage("");
                if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                }
                if (autoRejectTimeoutRef.current) {
                    clearTimeout(autoRejectTimeoutRef.current);
                    autoRejectTimeoutRef.current = null;
                }

                // start countdown (15 seconds)
                setTimeoutMessage("⏱ This request will auto-reject in 30 seconds...");
                setCountdown(30);
                countdownIntervalRef.current = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev === null) return null;
                        if (prev <= 1) {
                            // stop the interval (we'll trigger auto-reject below via timeout too)
                            if (countdownIntervalRef.current) {
                                clearInterval(countdownIntervalRef.current);
                                countdownIntervalRef.current = null;
                            }
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                // auto reject fallback at 15s
                autoRejectTimeoutRef.current = setTimeout(() => {
                    // ensure the modal is still open and request matches
                    if (!currentRequestRef.current) return;

                    setTimeoutMessage("⚠️ Ride request expired. Auto-rejected.");
                    // call same reject handler used for manual reject
                    rejectRideHandler({
                        ...(currentRequestRef.current || {}), // fallback empty object
                        ...(driverRef.current?.id ? { driverId: driverRef.current.id } : {}), // only add if defined
                    });

                }, 30000);
            }
        };

        // register handler (replace existing onMessage)
        // driverSocketService.onMessage(handleMessage);
        const unsubscribe = driverSocketService.onMessage(handleMessage);


        // cleanup on unmount: remove handler, clear timers
        return () => {
            // remove handler by setting empty callback (your service sets a single callback)
            unsubscribe(); // removes only this listener
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            if (autoRejectTimeoutRef.current) {
                clearTimeout(autoRejectTimeoutRef.current);
                autoRejectTimeoutRef.current = null;
            }
            currentRequestRef.current = null;
        };
    }, []); // run once


    const clearTimerAndCloseModal = () => {
        setTimeoutMessage("");
        setIsModalVisible(false);
    };

    const acceptRideHandler = async (rideRequest) => {
        try {
            // Clear timers so auto-reject won't fire
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            if (autoRejectTimeoutRef.current) {
                clearTimeout(autoRejectTimeoutRef.current);
                autoRejectTimeoutRef.current = null;
            }
            setTimeoutMessage("");
            setCountdown(null);
            currentRequestRef.current = null;
            setIsModalVisible(false);


            const response = await axiosInstance.post(
                `/ride/new-ride`,
                {
                    userId: rideRequest.user.id,
                    totalFare: rideRequest.fare.totalFare,
                    driverEarnings: rideRequest.fare.driverEarnings,
                    platformShare: rideRequest.fare.platformShare,
                    status: "Booked",
                    currentLocationName: rideRequest.currentLocationName,
                    currentLocation: rideRequest.currentLocation,
                    destinationLocationName: rideRequest.destinationLocation,
                    destinationLocation: rideRequest.marker,
                    distance: rideRequest.distance,
                }
            );

            const createdRide = response.data.newRide;

            // notify user (server should route this to the correct userId)
            sendPushNotification(rideRequest.user.notificationToken,
                "Ride Request Accepted!",
                `Your driver will pick you on the location!`)
            driverSocketService.send({
                type: "rideAccepted",
                role: "driver",
                rideData: {
                    user: rideRequest.user,
                    firstMarker: {
                        latitude: rideRequest.currentLocation.latitude,
                        longitude: rideRequest.currentLocation.longitude,
                    },
                    secondMarker: {
                        latitude: rideRequest.marker.latitude,
                        longitude: rideRequest.marker.longitude,
                    },
                    driver: driver,
                    rideData: createdRide,
                },
            });

            // navigate
            const rideData = {
                user: rideRequest.user,
                firstMarker: {
                    latitude: rideRequest.currentLocation.latitude,
                    longitude: rideRequest.currentLocation.longitude,
                },
                secondMarker: {
                    latitude: rideRequest.marker.latitude,
                    longitude: rideRequest.marker.longitude,
                },
                driver: driver,
                rideData: createdRide,
            };

            router.push({
                pathname: "/(routes)/ride-details",
                params: { rideId: JSON.stringify(rideData.rideData.id) },
            });
        } catch (error) {
            // clear timers if any and show toast, then optionally auto-reject
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            if (autoRejectTimeoutRef.current) {
                clearTimeout(autoRejectTimeoutRef.current);
                autoRejectTimeoutRef.current = null;
            }
            setTimeoutMessage("");
            setCountdown(null);
            currentRequestRef.current = null;
            setIsModalVisible(false);

            const msg = error?.response?.data?.message || "Unable to accept the ride. Please try again.";
            Toast.show(msg, { type: "danger" });

            rejectRideHandler(rideRequest);
        }
    };

    const rejectRideHandler = (rideRequest) => {
        // Clear timers
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
        if (autoRejectTimeoutRef.current) {
            clearTimeout(autoRejectTimeoutRef.current);
            autoRejectTimeoutRef.current = null;
        }

        setTimeoutMessage("");
        setCountdown(null);
        currentRequestRef.current = null;
        setIsModalVisible(false);

        driverSocketService.send({
            type: "rideRejected",
            role: "driver",
            driverId: rideRequest.driverId || driverRef.current?.id, // fallback
            userId: rideRequest.user.id,
        });
    };


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
            <RideModal
                visible={isModalVisible}
                onClose={clearTimerAndCloseModal}
                title="🚘 New Ride Request!"
                countdown={countdown}
                timeoutMessage={timeoutMessage}
                region={region}
                firstMarker={firstMarker}
                secondMarker={secondMarker}
                currentLocationName={currentLocationName}
                destinationLocationName={destinationLocationName}
                distance={distance}
                fare={fare}
                onAccept={() => acceptRideHandler(rideDetails)}
                onReject={() => rejectRideHandler(rideDetails)}
            />



        </View>
    );
}