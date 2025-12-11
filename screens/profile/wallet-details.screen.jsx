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
    StatusBar,
    StyleSheet as RNStyleSheet,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import color from "@/themes/app.colors";
import { useGetDriverData, useGetDriverWallet } from "@/hooks/useGetDriverData";
import { router } from "expo-router";
import AppAlert from "@/components/modal/alert-modal/alert.modal";
import { fontSizes, windowWidth } from "@/themes/app.constant";

// ---------------------------------------------
// ⭐ PREMIUM SKELETON LOADER
// ---------------------------------------------
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

    const SkeletonBox = ({ width, height, radius = 10, style }) => (
        <View
            style={[{
                width,
                height,
                borderRadius: radius,
                backgroundColor: "rgba(255,255,255,0.05)",
                overflow: "hidden",
            }, style]}
        >
            <Animated.View
                style={{
                    ...RNStyleSheet.absoluteFillObject,
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
        <View style={styles.skeletonContainer}>
            <SkeletonBox width="100%" height={220} radius={24} style={{ marginBottom: 40 }} />
            <SkeletonBox width={150} height={20} radius={8} style={{ marginBottom: 20 }} />
            {[1, 2, 3, 4].map((i) => (
                <SkeletonBox key={i} width="100%" height={80} radius={16} style={{ marginBottom: 15 }} />
            ))}
        </View>
    );
};

// ---------------------------------------------
// ⭐ MAIN WALLET SCREEN
// ---------------------------------------------
export default function WalletDetails() {
    const { wallet, loading: walletLoading, refetchWallet } = useGetDriverWallet();
    const { driver } = useGetDriverData();

    const [refreshing, setRefreshing] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: "", message: "", confirmText: "OK", showCancel: false,
        onConfirm: () => setShowAlert(false),
        onCancel: () => setShowAlert(false),
    });

    const onRefresh = async () => {
        setRefreshing(true);
        await refetchWallet();
        setRefreshing(false);
    };

    if (walletLoading) {
        return (
            <View style={styles.mainContainer}>
                <LinearGradient colors={[color.bgDark, color.subPrimary]} style={StyleSheet.absoluteFill} />
                <WalletSkeleton />
            </View>
        );
    }

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <View style={styles.mainContainer}>
            <LinearGradient colors={[color.bgDark, color.subPrimary]} style={StyleSheet.absoluteFill} />


            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl tintColor={color.primary} refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* HEADER */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.pageTitle}>My Wallet</Text>
                    </View>

                    {/* 1. GLASS CARD (BALANCE) */}
                    <LinearGradient
                        colors={[color.bgDark, color.subPrimary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={styles.cardContainer}
                    >
                        {/* Gradient Overlay for Shine */}
                        <LinearGradient
                            colors={['rgba(255,255,255,0.05)', 'transparent']}
                            style={StyleSheet.absoluteFill}
                        />

                        <View style={styles.cardTop}>
                            <MaterialCommunityIcons name="integrated-circuit-chip" size={32} color="#D4AF37" />
                            <Text style={styles.cardBrand}>STARK WALLET</Text>
                        </View>

                        <View>
                            <Text style={styles.balanceLabel}>Total Balance</Text>
                            <Text style={styles.balanceValue}>{formatCurrency(wallet?.balance || 0)}</Text>
                        </View>

                        <View style={styles.cardBottom}>
                            <Text style={styles.cardNumber}>**** **** **** {driver?.phone_number?.slice(-4) || '8888'}</Text>

                            <TouchableOpacity
                                style={styles.addBtn}
                                onPress={() => router.push('/(routes)/payment')}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="add" size={20} color="#000" />
                                <Text style={styles.addBtnText}>Add Funds</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    {/* LOW BALANCE ALERT */}
                    {wallet?.balance !== undefined && wallet.balance < 250 && (
                        <View style={styles.warningBox}>
                            <Ionicons name="warning" size={20} color="#FFAB00" />
                            <Text style={styles.warningText}>
                                Low balance. Recharge now to accept new rides.
                            </Text>
                        </View>
                    )}

                    {/* 2. TRANSACTIONS LIST */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    </View>

                    {wallet?.history?.length > 0 ? (
                        <View style={styles.listContainer}>
                            {[...wallet.history].reverse().map((item, index) => {
                                const isCredit = item.type === "credit";
                                const iconName = isCredit ? "arrow-down-left" : "arrow-up-right";
                                const iconColor = isCredit ? "#00E676" : "#FF5252";
                                const bgColor = isCredit ? "rgba(0, 230, 118, 0.1)" : "rgba(255, 82, 82, 0.1)";

                                return (
                                    <View key={item._id || index} style={styles.transactionRow}>
                                        {/* Icon */}
                                        <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
                                            <MaterialCommunityIcons name={iconName} size={20} color={iconColor} />
                                        </View>

                                        {/* Details */}
                                        <View style={styles.transDetails}>
                                            <Text style={styles.transAction}>{item.action}</Text>
                                            <Text style={styles.transDate}>
                                                {new Date(item.actionOn).toLocaleDateString('en-GB', {
                                                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </Text>
                                        </View>

                                        {/* Amount */}
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={[styles.transAmount, { color: iconColor }]}>
                                                {isCredit ? "+" : "-"}{formatCurrency(item.amount)}
                                            </Text>
                                            <Text style={styles.transBalance}>Bal: ₹{item.balanceAfter}</Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="receipt-outline" size={48} color="#333" />
                            <Text style={styles.emptyText}>No transactions yet</Text>
                        </View>
                    )}

                </ScrollView>

                <AppAlert
                    visible={showAlert}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    confirmText={alertConfig.confirmText}
                    showCancel={alertConfig.showCancel}
                    onConfirm={alertConfig.onConfirm}
                    onCancel={alertConfig.onCancel}
                />
            </SafeAreaView>
        </View>
    );
}

// ---------------------------------------------
// ⭐ STYLES
// ---------------------------------------------
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#050505",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 50,
    },
    skeletonContainer: {
        padding: 20,
        marginTop: 60,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        gap: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageTitle: {
        fontSize: fontSizes.FONT20,
        color: "#fff",
        fontFamily: "TT-Octosquares-Medium",
    },

    // Credit Card UI
    cardContainer: {
        height: 220,
        borderRadius: 24,
        padding: 24,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 25,
        overflow: 'hidden',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardBrand: {
        color: 'rgba(255,255,255,0.4)',
        fontFamily: "TT-Octosquares-Medium",
        letterSpacing: 2,
        fontSize: fontSizes.FONT12,
    },
    balanceLabel: {
        color: '#888',
        fontSize: fontSizes.FONT12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 5,
        fontFamily: "TT-Octosquares-Medium",

    },
    balanceValue: {
        fontSize: windowWidth(35),
        color: '#fff',
        fontFamily: "TT-Octosquares-Medium",
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardNumber: {
        color: '#666',
        fontSize: fontSizes.FONT14,
        fontFamily: "TT-Octosquares-Medium",
        letterSpacing: 0.5,
    },
    addBtn: {
        backgroundColor: color.buttonBg,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 7.5,
        paddingHorizontal: 7.5,
        borderRadius: 20,
        gap: 4,
    },
    addBtnText: {
        color: '#000',
        fontFamily: "TT-Octosquares-Medium",
        fontSize: fontSizes.FONT12,
    },

    // Warning
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 171, 0, 0.1)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 171, 0, 0.2)',
        gap: 10,
    },
    warningText: {
        color: '#FFAB00',
        fontSize: fontSizes.FONT12,
        flex: 1,
        fontFamily: "TT-Octosquares-Medium",
    },

    // Transactions
    sectionHeader: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: fontSizes.FONT18,
        color: '#fff',
        fontFamily: "TT-Octosquares-Medium",
    },
    listContainer: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    transDetails: {
        flex: 1,
    },
    transAction: {
        color: '#eee',
        fontSize: fontSizes.FONT14,
        fontFamily: "TT-Octosquares-Medium",
        marginBottom: 4,
        textTransform: 'capitalize',
    },
    transDate: {
        color: '#666',
        fontSize: fontSizes.FONT11,
        fontFamily: "TT-Octosquares-Medium",

    },
    transAmount: {
        fontSize: fontSizes.FONT16,
        fontFamily: "TT-Octosquares-Medium",
        marginBottom: 2,
    },
    transBalance: {
        color: '#666',
        fontSize: fontSizes.FONT10,
        fontFamily: "TT-Octosquares-Medium",

    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        color: '#444',
        marginTop: 10,
        fontSize: fontSizes.FONT14,
        fontFamily: "TT-Octosquares-Medium",
    },
});