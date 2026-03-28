import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Share,
    FlatList,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import color from "@/themes/app.colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSizes } from "@/themes/app.constant";
import * as Clipboard from "expo-clipboard";
import axios from "axios";
import { Animated } from "react-native";
import axiosInstance from "@/api/axiosInstance";
export default function ReferAndEarn() {
    const params = useLocalSearchParams();

    const { ownReferralCode, referralCount, commission } = params;

    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ ADD 
    const [showToast, setShowToast] = useState(false);
    const scaleAnim = useState(new Animated.Value(1))[0];

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            setLoading(true); // ✅ start loading
            const res = await axiosInstance.get(`/driver/referrals/${ownReferralCode}`);
            setDrivers(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false); // ✅ stop loading
        }
    };

    const shareCode = async () => {
        await Share.share({
            message:
                `Drive with Stark and Start Earning On Your Own Schedule.\n\n` +

                `Use My Referral Code: ${ownReferralCode}\n\n` +

                `Get A Signup Bonus Of Up To ₹500 Based On Your Vehicle.\n\n` +
                `Earn Upto ₹100 For Every Successful Referral After Joining.\n\n` +

                `Download The Stark Driver App Now :\n` +
                `https://play.google.com/store/apps/details?id=com.starkcabs.starkdriver`,
        });
    };
    const handleCopy = async () => {
        await Clipboard.setStringAsync(ownReferralCode);

        // animation
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        // toast
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const DriverSkeleton = () => {
        const shimmerAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.loop(
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                })
            ).start();
        }, []);

        const translateX = shimmerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-200, 400],
        });

        const SkeletonBox = ({ height }) => (
            <View
                style={{
                    height,
                    borderRadius: 14,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    marginBottom: 10,
                    overflow: "hidden",
                }}
            >
                <Animated.View
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        transform: [{ translateX }],
                    }}
                >
                    <LinearGradient
                        colors={["transparent", "rgba(255,255,255,0.05)", "transparent"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1 }}
                    />
                </Animated.View>
            </View>
        );

        return (
            <View>
                {[1, 2, 3, 4, 5].map((i) => (
                    <SkeletonBox key={i} height={70} />
                ))}
            </View>
        );
    };
    return (
        <View style={styles.mainContainer}>
            <LinearGradient
                colors={[color.bgDark, color.subPrimary]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* HEADER */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>

                        <View>
                            <Text style={styles.pageTitle}>Refer & Earn</Text>
                            <Text style={styles.pageSubtitle}>
                                Invite drivers & earn commission
                            </Text>
                        </View>
                    </View>

                    {/* HERO CARD */}
                    <View style={styles.heroCard}>
                        <Text style={styles.heroTitle}>Invite & Earn</Text>
                        <Text style={styles.heroSubtitle}>
                            Earn up to ₹100 for every driver who signs up using your code
                        </Text>

                        <View style={styles.earnBanner}>
                            <Text style={styles.earnText}>
                                Earn up to ₹100 per successful referral
                            </Text>
                        </View>
                        <View style={styles.codeContainer}>
                            <Text style={styles.codeText}>{ownReferralCode}</Text>

                            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                                    <Ionicons name="copy-outline" size={16} color="#fff" />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>

                        <TouchableOpacity style={styles.shareBtn} onPress={shareCode}>
                            <Ionicons name="share-social" size={18} color="#000" />
                            <Text style={styles.shareText}>Invite Drivers</Text>
                        </TouchableOpacity>
                    </View>

                    {/* STATS */}
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Ionicons name="people" size={18} color="#00E676" />
                            <Text style={styles.statValue}>{referralCount || 0}</Text>
                            <Text style={styles.statLabel}>Drivers Joined</Text>
                        </View>

                        <View style={styles.statCard}>
                            <Ionicons name="cash" size={18} color="#FFD700" />
                            <Text style={styles.statValue}>₹ {commission || 0}</Text>
                            <Text style={styles.statLabel}>Total Earnings</Text>
                        </View>
                    </View>

                    {/* DRIVER LIST */}
                    <Text style={styles.listTitle}>Referred Drivers</Text>

                    {loading ? (
                        <DriverSkeleton />   // ✅ SHOW LOADING
                    ) : (
                        <FlatList
                            data={drivers}
                            scrollEnabled={false}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <View style={styles.driverCard}>
                                    <Ionicons name="person" size={16} color="#fff" />

                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.driverName}>{item.name}</Text>
                                        <Text style={styles.driverPhone}>{item.phone_number}</Text>
                                    </View>

                                    <View style={styles.joinedBadge}>
                                        <Text style={styles.joinedText}>Joined</Text>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>
                                    No drivers joined yet. Start sharing your code 🚀
                                </Text>
                            }
                        />
                    )}

                    {/* INFO */}
                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle-outline" size={20} color="#888" />
                        <Text style={styles.infoText}>
                            Share your code. When a driver signs up using it, you earn commission.
                        </Text>
                    </View>

                </ScrollView>
                {showToast && (
                    <View style={styles.toast}>
                        <Text style={styles.toastText}>Copied to clipboard</Text>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1 },

    scrollContent: {
        padding: 20,
        paddingBottom: 50,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        marginBottom: 25,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.08)",
        alignItems: "center",
        justifyContent: "center",
    },

    pageTitle: {
        fontSize: fontSizes.FONT20,
        color: "#fff",
        fontFamily: "TT-Octosquares-Medium",
    },

    pageSubtitle: {
        fontSize: fontSizes.FONT12,
        color: "#888",
        fontFamily: "TT-Octosquares-Medium",
    },

    heroCard: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
    },

    heroTitle: {
        fontSize: fontSizes.FONT20,
        color: "#fff",
        fontFamily: "TT-Octosquares-Medium",
    },

    heroSubtitle: {
        fontSize: fontSizes.FONT12,
        color: "#888",
        marginBottom: 20,
        fontFamily: "TT-Octosquares-Medium",
    },

    codeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 14,
        marginBottom: 15,
    },

    codeText: {
        fontSize: fontSizes.FONT18,
        color: "#000",
        letterSpacing: 2,
        fontFamily: "TT-Octosquares-Medium",
        alignSelf: 'center'
    },

    copyBtn: {
        backgroundColor: "#000",
        padding: 8,
        borderRadius: 8,
    },

    shareBtn: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        backgroundColor: "#FFD700",
        padding: 14,
        borderRadius: 12,
    },

    shareText: {
        color: "#000",
        fontFamily: "TT-Octosquares-Medium",
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    statCard: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.04)",
        padding: 20,
        borderRadius: 16,
        alignItems: "center",
        marginHorizontal: 5,
    },

    statValue: {
        fontSize: fontSizes.FONT18,
        color: "#fff",
        marginTop: 5,
        fontFamily: "TT-Octosquares-Medium",
    },

    statLabel: {
        fontSize: fontSizes.FONT12,
        color: "#888",
        fontFamily: "TT-Octosquares-Medium",
    },

    listTitle: {
        color: "#888",
        marginBottom: 10,
        fontFamily: "TT-Octosquares-Medium",
    },

    driverCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.04)",
        padding: 15,
        borderRadius: 14,
        marginBottom: 10,
        gap: 12,
    },

    driverName: {
        color: "#fff",
        fontFamily: "TT-Octosquares-Medium",
        fontSize: fontSizes.FONT15,

    },

    driverPhone: {
        color: "#888",
        fontSize: fontSizes.FONT12,
        fontFamily: "TT-Octosquares-Medium",
    },

    joinedBadge: {
        backgroundColor: "rgba(0,230,118,0.2)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },

    joinedText: {
        color: "#00E676",
        fontSize: fontSizes.FONT12,
        fontFamily: "TT-Octosquares-Medium",
    },

    emptyText: {
        textAlign: "center",
        color: "#666",
        marginTop: 20,
        fontFamily: "TT-Octosquares-Medium",
    },

    infoBox: {
        flexDirection: "row",
        gap: 10,
        marginTop: 15,
    },

    infoText: {
        flex: 1,
        color: "#666",
        fontSize: fontSizes.FONT12,
        fontFamily: "TT-Octosquares-Medium",
    },
    toast: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: "rgba(0,0,0,0.9)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },

    toastText: {
        color: "#fff",
        fontSize: fontSizes.FONT12,
        fontFamily: "TT-Octosquares-Medium",
    },
    earnBanner: {
        backgroundColor: "rgba(255,215,0,0.1)",
        borderColor: "#FFD700",
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        alignSelf: "flex-start",
        marginBottom: 15,
    },

    earnText: {
        color: "#FFD700",
        fontSize: fontSizes.FONT12,
        fontFamily: "TT-Octosquares-Medium",
    },
});