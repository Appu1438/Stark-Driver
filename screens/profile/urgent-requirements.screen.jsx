import React, { useEffect, useRef, useState } from "react";
import {
    View, Text, ScrollView, StyleSheet,
    TouchableOpacity, FlatList, Animated,
    RefreshControl,
    Linking,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSizes } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import { useGetDriverData, useGetPackageTrips } from "@/hooks/useGetDriverData";
import fonts from "@/themes/app.fonts";

// ─── Priority Config ─────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
    high: { color: "#FF3B5C", bg: "rgba(255,59,92,0.12)", border: "rgba(255,59,92,0.3)", label: "HIGH", pulse: true },
    medium: { color: "#FF8C42", bg: "rgba(255,140,66,0.12)", border: "rgba(255,140,66,0.3)", label: "MEDIUM", pulse: false },
    low: { color: "#4ADE80", bg: "rgba(74,222,128,0.10)", border: "rgba(74,222,128,0.25)", label: "LOW", pulse: false },
};

// ─── Cab Icon Map ─────────────────────────────────────────────────────────────
const CAB_ICONS = {
    Auto: "navigate-outline",        // feels like short/local rides
    Hatchback: "car-sport-outline",
    Sedan: "car-sport-outline",      // premium feel
    Suv: "car-sport-outline",       // rugged/outstation vibe
    Traveller: "bus-outline",
};


// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonLoader() {
    const shimmer = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmer, { toValue: 1, duration: 1300, useNativeDriver: true })
        ).start();
    }, []);

    const translateX = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-300, 400] });

    const Box = ({ h = 120 }) => (
        <View style={[styles.skeletonBox, { height: h }]}>
            <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }] }]}>
                <LinearGradient
                    colors={["transparent", "rgba(255,255,255,0.04)", "transparent"]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={{ flex: 1 }}
                />
            </Animated.View>
        </View>
    );

    return (
        <View style={{ gap: 14 }}>
            {[1, 2, 3].map(i => <Box key={i} h={130} />)}
        </View>
    );
}

// ─── Stats Chips ─────────────────────────────────────────────────────────────
function StatsRow({ trips }) {
    const counts = { high: 0, medium: 0, low: 0 };
    trips?.forEach(t => { if (counts[t.priority] !== undefined) counts[t.priority]++; });

    return (
        <View style={styles.statsRow}>
            {(["high", "medium", "low"]).map(p => (
                <View key={p} style={styles.statChip}>
                    <Text style={[styles.statNum, { color: PRIORITY_CONFIG[p].color }]}>
                        {counts[p]}
                    </Text>
                    <Text style={styles.statLbl}>{p.toUpperCase()}</Text>
                </View>
            ))}
        </View>
    );
}

// ─── Trip Card ────────────────────────────────────────────────────────────────
function TripCard({ item }) {
    const p = PRIORITY_CONFIG[item.priority] ?? PRIORITY_CONFIG.low;
    const cabIcon = CAB_ICONS[item.cabType] ?? "car-outline";
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, []);

    return (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            {/* Priority left bar */}
            <View style={[styles.priorityBar, {
                backgroundColor: p.color,
                shadowColor: p.color, shadowOpacity: 0.7, shadowRadius: 8
            }]} />

            {/* Card Header: Cab Type + Priority Badge */}
            <View style={styles.cardHead}>
                <View style={styles.cabBadge}>
                    <Ionicons name={cabIcon} size={15} color="#00E5FF" />
                    <Text style={styles.cabText}>{item.cabType}</Text>
                </View>

                <View style={[styles.priorityBadge,
                { backgroundColor: p.bg, borderColor: p.border }]}>
                    {/* Animated dot for HIGH priority */}
                    <PriorityDot color={p.color} animate={p.pulse} />
                    <Text style={[styles.priorityLabel, { color: p.color }]}>
                        {p.label}
                    </Text>
                </View>
            </View>

            {/* Route */}
            <View style={styles.cardBody}>
                <View style={styles.routeRow}>
                    <View style={styles.locationChip}>
                        <Text style={styles.chipLabel}>PICKUP</Text>
                        <Text style={styles.chipVal} numberOfLines={1}>{item.pickupLocation}</Text>
                    </View>

                    {/* <View style={styles.routeArrow}>
                        <View style={styles.routeLine} />
                        <Text style={styles.routeArrowHead}>▶</Text>
                    </View> */}

                    <View style={styles.locationChip}>
                        <Text style={styles.chipLabel}>DROP</Text>
                        <Text style={styles.chipVal} numberOfLines={1}>{item.dropLocation}</Text>
                    </View>
                </View>

                {/* Date */}
                {/* Date Range */}
                <View style={styles.dateBlock}>
                    {/* Start */}
                    <View style={styles.dateItem}>
                        <View style={styles.datePill}>
                            <Text style={styles.dateItemLabel}>FROM</Text>
                            <Ionicons name="calendar-outline" size={11} color="#5A6080" />
                            <Text style={styles.dateText}>
                                {new Date(item.startDate).toLocaleDateString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    day: "2-digit", month: "short", year: "numeric"
                                })}
                            </Text>
                            <View style={styles.dateTimeDivider} />
                            <Ionicons name="time-outline" size={11} color="#5A6080" />
                            <Text style={styles.timeText}>
                                {new Date(item.startDate).toLocaleTimeString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    hour: "2-digit", minute: "2-digit", hour12: true
                                }).toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    {/* Arrow */}
                    <View style={styles.dateArrowCol}>
                        <View style={styles.dateArrowLine} />
                        <View style={styles.dateArrowDot} />
                    </View>

                    {/* End */}
                    <View style={styles.dateItem}>
                        <View style={[styles.datePill, styles.datePillEnd]}>
                            <Text style={[styles.dateItemLabel, { color: "#4ADE80" }]}>TO</Text>
                            <Ionicons name="calendar-clear-outline" size={11} color="#4ADE80" />
                            <Text style={[styles.dateText, { color: "#4ADE80" }]}>
                                {new Date(item.endDate).toLocaleDateString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    day: "2-digit", month: "short", year: "numeric"
                                })}
                            </Text>
                            <View style={[styles.dateTimeDivider, { backgroundColor: "rgba(74,222,128,0.2)" }]} />
                            <Ionicons name="time-outline" size={11} color="#4ADE80" />
                            <Text style={[styles.timeText, { color: "#4ADE80" }]}>
                                {new Date(item.endDate).toLocaleTimeString("en-IN", {
                                    timeZone: "Asia/Kolkata",
                                    hour: "2-digit", minute: "2-digit", hour12: true
                                }).toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* <View style={styles.dateRow}>
                    <View style={styles.datePill}>
                        <Ionicons name="calendar-outline" size={11} color="#5A6080" />
                        <Text style={styles.dateText}>
                            {new Date(item.startDate).toLocaleDateString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric"
                            })}
                        </Text>
                    </View>

                    <View style={styles.dateSeparator}>
                        <View style={styles.dateSepLine} />
                        <Ionicons name="arrow-forward" size={10} color="#5A6080" />
                        <View style={styles.dateSepLine} />
                    </View>

                    <View style={styles.datePill}>
                        <Ionicons name="calendar-clear-outline" size={11} color="#4ADE80" />
                        <Text style={[styles.dateText, { color: "#4ADE80" }]}>
                            {new Date(item.endDate).toLocaleDateString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric"
                            })}
                        </Text>
                    </View>
                </View> */}

                {/* Description */}
                {item.description ? (
                    <View style={styles.descBox}>
                        <Text style={styles.descText}>{item.description}</Text>
                    </View>
                ) : null}
            </View>

            {/* Contact Button */}
            <View style={styles.cardFooter}>
                <TouchableOpacity
                    style={styles.contactBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                        if (!item.contactNumber) return;

                        const message = `Hi 👋,

I am a Stark Driver interested in your ${item.priority} priority requirement.

Cab Type: ${item.cabType}
Pickup Location: ${item.pickupLocation}
Drop Location: ${item.dropLocation}
Start Date & Time: ${new Date(item.startDate).toLocaleString("en-IN")}
End Date & Time: ${new Date(item.endDate).toLocaleString("en-IN")}

${item.description ? `Additional Details: ${item.description}\n\n` : ""}I would like to confirm the availability and discuss further details at your convenience.

Thank you, and I look forward to your response.`;
                        const phone = item.contactNumber.replace(/\D/g, ""); // clean number

                        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

                        Linking.openURL(url);
                    }}           >
                    {/* <Ionicons name="call" size={15} color="#000" /> */}
                    <Text style={styles.contactBtnText}>Enquire Now</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

// ─── Priority Pulsing Dot ─────────────────────────────────────────────────────
function PriorityDot({ color: dotColor, animate }) {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!animate) return;
        Animated.loop(
            Animated.sequence([
                Animated.timing(scale, { toValue: 0.5, duration: 600, useNativeDriver: true }),
                Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={{
            width: 6, height: 6, borderRadius: 3,
            backgroundColor: dotColor,
            transform: [{ scale }],
            marginRight: 2,
        }} />
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function UrgentRequirements() {
    const { trips, loading, refetchTrips } = useGetPackageTrips();
    const { driver, loading: dataLoading, refetchData } = useGetDriverData();

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetchTrips();
        setRefreshing(false);
    };
    const matchedTrips = (trips?.data || []).filter(
        (item) => item.cabType === driver?.vehicle_type
    );

    const otherTrips = (trips?.data || []).filter(
        (item) => item.cabType !== driver?.vehicle_type
    );

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={[color.subPrimary, color.primary]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={color.primary}
                            progressViewOffset={40}
                        />
                    }
                >

                    {/* ── HEADER ── */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={20} color="#fff" />
                        </TouchableOpacity>

                        {/* <View style={styles.headerGlow} /> */}

                        <Text style={styles.headerEye}>LIVE DASHBOARD</Text>
                        <Text style={styles.headerTitle}>Urgent{"\n"}Requirements</Text>
                        <Text style={styles.headerSub}>High priority trips & driver requests</Text>

                        {!loading && trips?.data && (
                            <StatsRow trips={trips.data} />
                        )}
                    </View>

                    {/* ── SPECIAL FOR YOU ── */}
                    {matchedTrips.length > 0 && (
                        <>
                            <View style={styles.sectionRow}>
                                <Text style={styles.sectionLabel}>SPECIAL FOR YOU</Text>
                                <View style={styles.sectionLine} />
                            </View>

                            <View style={{ paddingHorizontal: 20 }}>
                                <FlatList
                                    data={matchedTrips}
                                    scrollEnabled={false}
                                    keyExtractor={(item) => item._id}
                                    renderItem={({ item }) => <TripCard item={item} />}
                                    ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
                                />
                            </View>
                        </>
                    )}

                    {/* ── OTHER / ALL ── */}
                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionLabel}>
                            {matchedTrips.length > 0 ? "OTHER OPPORTUNITIES" : "ALL REQUESTS"}
                        </Text>
                        <View style={styles.sectionLine} />
                    </View>

                    <View style={{ paddingHorizontal: 20 }}>
                        {loading ? (
                            <SkeletonLoader />
                        ) : (
                            <FlatList
                                data={matchedTrips.length > 0 ? otherTrips : trips?.data}
                                scrollEnabled={false}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => <TripCard item={item} />}
                                ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
                                ListEmptyComponent={
                                    <View style={styles.emptyBox}>
                                        <Text style={styles.emptyIcon}>🚀</Text>
                                        <Text style={styles.emptyText}>
                                            No urgent requirements available
                                        </Text>
                                    </View>
                                }
                            />
                        )}
                    </View>

                    {/* ── NO MATCH INFO ── */}
                    {matchedTrips.length === 0 && !loading && (
                        <Text style={styles.noMatchText}>
                            No exact matches found. Showing all available requests.
                        </Text>
                    )}

                    {/* ── INFO ── */}
                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle-outline" size={18} color="#5A6080" />
                        <Text style={styles.infoText}>
                            High priority requests are time-sensitive. Respond quickly to secure the trip.
                        </Text>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1 },

    scroll: { paddingBottom: 60 },

    // Header
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 4,
        position: "relative",
        overflow: "hidden",
    },
    headerGlow: {
        position: "absolute", top: -60, right: -60,
        width: 220, height: 220,
        borderRadius: 110,
        backgroundColor: "rgba(0,229,255,0.07)",
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
        alignItems: "center", justifyContent: "center",
        marginBottom: 20,
    },
    headerEye: {
        fontSize: fontSizes.FONT12, letterSpacing: 3,
        color: "#00E5FF", marginBottom: 6, fontWeight: "600",
        fontFamily: "TT-Octosquares-Medium",

    },
    headerTitle: {
        fontSize: fontSizes.FONT28, color: "#F0F2FF",
        fontWeight: "800", letterSpacing: -0.5, lineHeight: 34,
        fontFamily: "TT-Octosquares-Medium",

    },
    headerSub: {
        fontSize: fontSizes.FONT15, color: "#5A6080",
        marginTop: 6, fontWeight: "400",
        fontFamily: "TT-Octosquares-Medium",

    },

    // Stats
    statsRow: { flexDirection: "row", gap: 10, marginTop: 20, marginBottom: 8 },
    statChip: {
        flex: 1, backgroundColor: "rgba(255,255,255,0.04)",
        borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
        borderRadius: 12, padding: 12,
    },
    statNum: {
        fontSize: fontSizes.FONT22, fontWeight: "800", fontFamily: "TT-Octosquares-Medium",
    },
    statLbl: {
        fontSize: fontSizes.FONT10, color: "#5A6080", letterSpacing: 1.5, marginTop: 2, fontFamily: "TT-Octosquares-Medium",
    },

    // Section
    sectionRow: {
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: 20, gap: 12, marginVertical: 16,
    },
    sectionLabel: {
        fontSize: fontSizes.FONT10, letterSpacing: 2.5, color: "#5A6080", fontWeight: "600", fontFamily: "TT-Octosquares-Medium",
    },
    sectionLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.05)" },

    // Card
    card: {
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        overflow: "hidden",
        position: "relative",
    },
    priorityBar: {
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 3, shadowOffset: { width: 0, height: 0 }, shadowRadius: 8, elevation: 4,
    },

    // Card Head
    cardHead: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: 16, paddingLeft: 20, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)",
    },
    cabBadge: {
        flexDirection: "row", alignItems: "center", gap: 7,
        backgroundColor: "rgba(0,229,255,0.08)",
        borderWidth: 1, borderColor: "rgba(0,229,255,0.2)",
        borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
    },
    cabText: {
        fontSize: fontSizes.FONT12, fontWeight: "700", color: "#00E5FF", letterSpacing: 0.4, fontFamily: "TT-Octosquares-Medium"
    },
    priorityBadge: {
        flexDirection: "row", alignItems: "center", gap: 5,
        borderWidth: 1, borderRadius: 8,
        paddingHorizontal: 10, paddingVertical: 6,
    },
    priorityLabel: {
        fontSize: fontSizes.FONT12, fontWeight: "800", letterSpacing: 1.2, fontFamily: "TT-Octosquares-Medium"
    },

    // Card Body
    cardBody: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 0 },
    routeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
    locationChip: { flex: 1 },
    chipLabel: {
        fontSize: fontSizes.FONT10, letterSpacing: 1.5, color: "#5A6080", fontWeight: "600", marginBottom: 3, fontFamily: "TT-Octosquares-Medium"
    },
    chipVal: {
        fontSize: fontSizes.FONT13, fontWeight: "500", color: "#F0F2FF", fontFamily: "TT-Octosquares-Medium"
    },
    routeArrow: { alignItems: "center", paddingTop: 12, flexShrink: 0 },
    routeLine: {
        width: 24, height: 1,
        backgroundColor: "rgba(0,229,255,0.3)",
    },
    routeArrowHead: { fontSize: fontSizes.FONT9, color: "#5A6080", marginTop: -5, marginLeft: 14 },
    dateBlock: {
        // flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginBottom: 10,
    },
    dateItem: {
        flex: 1,
        gap: 5,
    },
    dateItemLabel: {
        fontSize: fontSizes.FONT10,
        letterSpacing: 2,
        color: "#5A6080",
        fontWeight: "600",
        fontFamily: "TT-Octosquares-Medium"
    },
    datePill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: "rgba(255,255,255,0.04)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
    },
    datePillEnd: {
        backgroundColor: "rgba(74,222,128,0.05)",
        borderColor: "rgba(74,222,128,0.15)",
    },
    dateText: {
        fontSize: fontSizes.FONT10,
        color: "#9AA0B8",
        fontWeight: "500",
        fontFamily: "TT-Octosquares-Medium"
    },
    dateTimeDivider: {
        width: 1,
        height: 5,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginHorizontal: 2,
    },
    timeText: {
        fontSize: fontSizes.FONT12,
        color: "#9AA0B8",
        fontWeight: "600",
        letterSpacing: 0.3,
        fontFamily: "TT-Octosquares-Medium"
    },
    dateArrowCol: {
        alignItems: "center",
        gap: 1,
        paddingTop: 0,
    },
    dateArrowLine: {
        width: 1,
        height: 10,
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    dateArrowDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.12)",
    },

    dateText: { fontSize: fontSizes.FONT12, color: "#5A6080", fontFamily: "TT-Octosquares-Medium" },
    descBox: {
        backgroundColor: "rgba(255,255,255,0.025)",
        borderLeftWidth: 2, borderLeftColor: "rgba(255,255,255,0.08)",
        borderRadius: 8, padding: 10, marginBottom: 12,
    },
    descText: { fontSize: fontSizes.FONT12, color: "#5A6080", lineHeight: 18, fontFamily: "TT-Octosquares-Medium" },

    // Card Footer
    cardFooter: { padding: 16, paddingTop: 4 },
    contactBtn: {
        backgroundColor: "#FFD166",
        borderRadius: 12, paddingVertical: 12,
        flexDirection: "row", justifyContent: "center",
        alignItems: "center", gap: 8,
        shadowColor: "#FFD166", shadowOpacity: 0.3,
        shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6,
    },
    contactBtnText: {
        color: "#000", fontWeight: "800", fontSize: fontSizes.FONT13, letterSpacing: 0.4, fontFamily: "TT-Octosquares-Medium"
    },

    // Skeleton
    skeletonBox: {
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.04)",
        overflow: "hidden",
    },

    // Empty
    emptyBox: { alignItems: "center", paddingVertical: 50, gap: 10 },
    emptyIcon: { fontSize: fontSizes.FONT30 },
    emptyText: { color: "#5A6080", fontSize: fontSizes.FONT14, fontFamily: "TT-Octosquares-Medium" },

    // Info
    infoBox: {
        flexDirection: "row", gap: 12, alignItems: "flex-start",
        margin: 20, backgroundColor: "rgba(255,255,255,0.03)",
        borderWidth: 1, borderColor: "rgba(255,255,255,0.05)",
        borderRadius: 14, padding: 14,
    },
    infoText: { flex: 1, color: "#5A6080", fontSize: fontSizes.FONT12, lineHeight: 18, fontFamily: "TT-Octosquares-Medium" },

    noMatchText: {
        color: "#888",
        fontSize: fontSizes.FONT12,
        fontFamily: "TT-Octosquares-Medium",
        marginHorizontal: 20,
        marginTop: 10,
    }
});