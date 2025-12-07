import { View, Text, ScrollView, FlatList, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { styles } from "@/screens/home/styles";
import color from "@/themes/app.colors";
import RideCard from "@/components/ride/ride.card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { windowHeight } from "@/themes/app.constant";
import { useGetDriverRideHistories } from "@/hooks/useGetDriverData";
import RideHistorySkeleton from "./ride-history-skelton.screen";

export default function RideHistory() {
    const { recentRides, loading: rideHistoryLoading, refetchRides } = useGetDriverRideHistories();
    const [refreshing, setRefreshing] = useState(false);

    // 🚀 Pull to refresh logic
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetchRides(); // 👈 just re-fetch backend data
        setRefreshing(false);
    }, [refetchRides]);

    if (rideHistoryLoading) return <RideHistorySkeleton />
    return (
        <View
            style={[
                styles.rideContainer,
                {
                    // backgroundColor: color.primary,
                    paddingTop: windowHeight(40)
                },
            ]}
        >
            <Text
                style={[
                    styles.rideTitle,
                    { color: color.primaryText, fontWeight: "600" },
                ]}
            >
                Ride History
            </Text>
            <FlatList
                data={recentRides} // slice if you want to skip the first item
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
                contentContainerStyle={{ paddingBottom: windowHeight(50) }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={color.primary}
                    />
                }
            />
        </View>
    );
}