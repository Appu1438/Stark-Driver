import React from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Linking,
    StatusBar,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useGetDriverWallet } from "@/hooks/useGetDriverData";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient"; // You'll need to install this: `expo install expo-linear-gradient`
import color from "@/themes/app.colors";
import { handleAddMoney } from "@/api/apis";

// Example of a refined color palette
const palette = {
    background: "#F0F4F8", // Light gray background
    card: "#FFFFFF", // White cards
    primary: color.primary, // A vibrant blue for main actions
    secondary: "#6C757D", // A darker gray for secondary text
    credit: "#28A745", // Green for credit
    debit: "#DC3545", // Red for debit
    text: "#212529", // Main text color
    shadow: "rgba(0, 0, 0, 0.1)", // Light shadow
};

export default function WalletDetails() {
    const { wallet, loading: walletLoading } = useGetDriverWallet();
    const params = useLocalSearchParams();

    
    if (walletLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading Wallet...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={color.primary} // Set to your header or screen background color
                translucent={false} // Important for Android so it actually applies
            />
            {/* Balance Section with a nice gradient background */}
            <LinearGradient
                colors={["#665CFF", "#665cfd"]}
                style={styles.balanceCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={styles.balanceValue}>₹{wallet?.balance || 0}</Text>

                <TouchableOpacity style={styles.addButton} onPress={()=>handleAddMoney(params)}>
                    <Text style={styles.addButtonText}>+ Add Money</Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* Transaction History */}
            <Text style={styles.historyTitle}>Transaction History</Text>
            {wallet?.history?.length > 0 ? (
                <FlatList
                    data={wallet.history.reverse()}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.transactionItem}>
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
                                    item.type === "credit" ? styles.credit : styles.debit,
                                ]}
                            >
                                {item.type === "credit" ? "+" : "-"}₹{item.amount}
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <Text style={styles.noTransactions}>No transactions yet.</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
        paddingHorizontal: 20,
    },
    balanceCard: {
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        marginBottom: 25,
        elevation: 10,
        shadowColor: palette.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        marginTop:10
    },
    balanceLabel: {
        fontSize: 16,
        color: "white",
        fontFamily: "TT-Octosquares-Medium",
        opacity: 0.8,
    },
    balanceValue: {
        fontSize: 40,
        // fontWeight: "bold",
        marginVertical: 10,
        color: "white",
        fontFamily: "TT-Octosquares-Medium",
    },
    addButton: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
        marginTop: 15,
    },
    addButtonText: {
        color: "white",
        // fontWeight: "600",
        fontSize: 16,
        fontFamily: "TT-Octosquares-Medium",
    },
    historyTitle: {
        fontSize: 22,
        // fontWeight: "bold",
        marginBottom: 15,
        fontFamily: "TT-Octosquares-Medium",
        color: palette.text,
    },
    listContent: {
        paddingBottom: 20,
    },
    transactionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: palette.card,
        borderRadius: 15,
        marginBottom: 10,
        elevation: 3,
        shadowColor: palette.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    transactionAction: {
        fontSize: 16,
        color: palette.text,
        fontFamily: "TT-Octosquares-Medium",
        // fontWeight: "600",
    },
    transactionDate: {
        fontSize: 12,
        color: palette.secondary,
        fontFamily: "TT-Octosquares-Medium",
        marginTop: 4,
    },
    balanceAfter: {
        fontSize: 13,
        color: palette.secondary,
        marginTop: 6,
        // fontStyle: "italic",
        fontFamily: "TT-Octosquares-Medium",
    },
    transactionAmount: {
        fontSize: 18,
        // fontWeight: "bold",
        textAlign: "right",
        fontFamily: "TT-Octosquares-Medium",
    },
    credit: {
        color: palette.credit,
    },
    debit: {
        color: palette.debit,
    },
    noTransactions: {
        textAlign: "center",
        color: palette.secondary,
        marginTop: 20,
        fontSize: 14,
        fontFamily: "TT-Octosquares-Medium",
    },
    loadingText: {
        alignItems:'center',
        justifyContent:'center',
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
        fontFamily: "TT-Octosquares-Medium",
    },
});