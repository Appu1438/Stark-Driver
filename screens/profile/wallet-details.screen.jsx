import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Animated,
    Dimensions,
    StyleSheet as RNStyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import color from "@/themes/app.colors";
import { useDriverEarnings, useGetDriverWallet } from "@/hooks/useGetDriverData";
import { handleAddMoney } from "@/api/apis";
import { windowHeight, windowWidth } from "@/themes/app.constant";

/* -------------------- SHIMMER SKELETON -------------------- */
const WalletSkeleton = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1300,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, Dimensions.get("window").width + 200],
    });

    const ShimmerOverlay = () => (
        <Animated.View
            style={{
                ...RNStyleSheet.absoluteFillObject,
                transform: [{ translateX }],
            }}
        >
            <LinearGradient
                colors={["transparent", "rgba(255,255,255,0.25)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
            />
        </Animated.View>
    );

    const SkeletonBox = ({ width, height, radius = 10, marginBottom = 10 }) => (
        <View
            style={{
                width,
                height,
                borderRadius: radius,
                backgroundColor: "rgba(255,255,255,0.08)",
                overflow: "hidden",
                marginBottom,
            }}
        >
            <ShimmerOverlay />
        </View>
    );

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: color.background }}
            contentContainerStyle={{
                paddingHorizontal: windowWidth(25),
                paddingTop: windowHeight(40),
                paddingBottom: windowHeight(40),
            }}
        >
            {/* ---------- BALANCE CARD ---------- */}
            <View
                style={{
                    borderRadius: 25,
                    backgroundColor: color.subPrimary,
                    padding: 25,
                    marginBottom: 30,
                    overflow: "hidden",
                }}
            >
                <ShimmerOverlay />
                <SkeletonBox width={150} height={16} radius={8} />
                <SkeletonBox width={180} height={38} radius={8} />
                <SkeletonBox width={100} height={35} radius={20} marginBottom={0} />
            </View>

            {/* ---------- TRANSACTION HEADER ---------- */}
            <SkeletonBox width={200} height={20} radius={8} marginBottom={15} />

            {/* ---------- TRANSACTION ITEMS ---------- */}
            {[1, 2, 3, 4, 5].map((i) => (
                <View
                    key={i}
                    style={{
                        backgroundColor: color.subPrimary,
                        borderRadius: 15,
                        paddingVertical: 18,
                        paddingHorizontal: 15,
                        marginBottom: 12,
                        overflow: "hidden",
                    }}
                >
                    <ShimmerOverlay />
                    <SkeletonBox width="70%" height={16} radius={6} />
                    <SkeletonBox width="40%" height={12} radius={6} />
                    <SkeletonBox width="50%" height={12} radius={6} />
                </View>
            ))}
        </ScrollView>
    );
};

/* -------------------- MAIN WALLET SCREEN -------------------- */
export default function WalletDetails() {
    const { wallet, loading: walletLoading, refetchWallet } = useGetDriverWallet();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await refetchWallet();
        } finally {
            setRefreshing(false);
        }
    };

    if (walletLoading) return <WalletSkeleton />;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        tintColor={color.primary}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                {/* ---------- BALANCE CARD ---------- */}
                <LinearGradient
                    colors={[color.primary, color.darkPrimary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.balanceCard}
                >
                    <Text style={styles.balanceLabel}>Current Balance</Text>
                    <Text style={styles.balanceValue}>₹{wallet?.balance || 0}</Text>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddMoney(wallet)}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="add-circle-outline" size={18} color={color.primary} />
                        <Text style={styles.addButtonText}>Add Money</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* ---------- TRANSACTION LIST ---------- */}
                <Text style={styles.historyTitle}>Recent Transactions</Text>

                {wallet?.history?.length > 0 ? (
                    <FlatList
                        data={[...wallet.history].reverse()}
                        keyExtractor={(item) => item._id}
                        scrollEnabled={false}
                        renderItem={({ item }) => {
                            const isCredit = item.type === "credit";
                            return (
                                <LinearGradient
                                    colors={
                                        isCredit
                                            ? ["rgba(40,167,69,0.1)", "rgba(40,167,69,0.05)"]
                                            : ["rgba(220,53,69,0.1)", "rgba(220,53,69,0.05)"]
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[
                                        styles.transactionItem,
                                        { borderLeftColor: isCredit ? "#28A745" : "#DC3545" },
                                    ]}
                                >
                                    <View>
                                        <Text style={styles.transactionAction}>
                                            {item.action.toUpperCase()}
                                        </Text>
                                        <Text style={styles.transactionDate}>
                                            {new Date(item.actionOn).toLocaleString()}
                                        </Text>
                                        <Text style={styles.balanceAfter}>
                                            Balance After: ₹{item.balanceAfter}
                                        </Text>
                                    </View>

                                    <Text
                                        style={[
                                            styles.transactionAmount,
                                            isCredit ? styles.credit : styles.debit,
                                        ]}
                                    >
                                        {isCredit ? "+" : "-"}₹{item.amount}
                                    </Text>
                                </LinearGradient>
                            );
                        }}
                    />
                ) : (
                    <Text style={styles.noTransactions}>No transactions yet.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background,
        paddingHorizontal: windowWidth(25),
    },

    /* ---------- BALANCE SECTION ---------- */
    balanceCard: {
        borderRadius: 25,
        paddingVertical: 35,
        paddingHorizontal: 25,
        marginTop: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },
    balanceLabel: {
        fontSize: 16,
        fontFamily: "TT-Octosquares-Medium",
        color: "rgba(255,255,255,0.8)",
        marginBottom: 6,
    },
    balanceValue: {
        fontSize: 42,
        color: "white",
        fontFamily: "TT-Octosquares-Medium",
        marginBottom: 16,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    addButtonText: {
        color: color.primary,
        fontFamily: "TT-Octosquares-Medium",
        fontSize: 15,
        marginLeft: 6,
    },

    /* ---------- TRANSACTION SECTION ---------- */
    historyTitle: {
        fontSize: 20,
        fontFamily: "TT-Octosquares-Medium",
        color: color.primaryText,
        marginVertical: 25,
    },
    transactionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        backgroundColor: color.subPrimary,
        borderWidth: 2,
        borderColor: color.border
    },
    transactionAction: {
        fontSize: 16,
        fontFamily: "TT-Octosquares-Medium",
        color: color.primaryText,
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: color.regularText,
        fontFamily: "TT-Octosquares-Medium",
    },
    balanceAfter: {
        fontSize: 13,
        color: color.primaryText,
        fontFamily: "TT-Octosquares-Medium",
        marginTop: 4,
    },
    transactionAmount: {
        fontSize: 18,
        fontFamily: "TT-Octosquares-Medium",
        textAlign: "right",
    },
    credit: {
        color: "#28A745",
    },
    debit: {
        color: "#DC3545",
    },
    noTransactions: {
        textAlign: "center",
        color: color.lightGray,
        marginTop: 40,
        fontSize: 15,
        fontFamily: "TT-Octosquares-Medium",
    },
});
