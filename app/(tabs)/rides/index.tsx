import { View, Text, ScrollView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "@/screens/home/styles";
import color from "@/themes/app.colors";
import RideCard from "@/components/ride/ride.card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { windowHeight } from "@/themes/app.constant";
import { useGetDriverRideHistories } from "@/hooks/useGetDriverData";
import RideHistory from "@/screens/ride-history/ride-history.screen";

export default function index() {
    return (
        <RideHistory />
    );
}