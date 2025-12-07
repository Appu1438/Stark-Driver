import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import color from "@/themes/app.colors";
import axiosInstance from "@/api/axiosInstance";
import { useDriverLocationStore } from "@/store/driverLocationStore";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------
// ⭐ DARK THEME SKELETON
// ---------------------------------------------
const Skeleton = ({ width, height, style }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 200],
  });

  return (
    <View
      style={[
        {
          backgroundColor: "rgba(255,255,255,0.05)",
          overflow: "hidden",
          borderRadius: 8,
        },
        width && { width },
        height && { height },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: "50%",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.05)",
          transform: [{ translateX }],
        }}
      />
    </View>
  );
};

// ---------------------------------------------
// ⭐ MAIN COMPONENT
// ---------------------------------------------
export default function FareDetails() {
  const params = useLocalSearchParams();
  const vehicleType = params.vehicle_type;
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(true);
  const { district } = useDriverLocationStore();

  useEffect(() => {
    const fetchFare = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/fare/${vehicleType}/${district}`);
        if (res.data.success) {
          setFare(res.data.fare);
        }
      } catch (error) {
        console.error("Error fetching fare details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (vehicleType) fetchFare();
  }, [vehicleType, district]);

  // ---------------------------------------------
  // ⭐ LOADING STATE (Premium Skeleton)
  // ---------------------------------------------
  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <LinearGradient colors={[color.bgDark, color.subPrimary]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
          <Skeleton width={150} height={24} style={{ marginBottom: 30 }} />
          {/* Hero Card Skeleton */}
          <Skeleton width="100%" height={120} style={{ marginBottom: 20, borderRadius: 20 }} />
          {/* Grid Skeleton */}
          <View style={{ flexDirection: 'row', gap: 15 }}>
            <Skeleton style={{ flex: 1 }} height={100} />
            <Skeleton style={{ flex: 1 }} height={100} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ---------------------------------------------
  // ⭐ NO DATA STATE
  // ---------------------------------------------
  if (!fare) {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={50} color="#666" />
        <Text style={{ color: '#888', marginTop: 10, fontFamily: 'TT-Octosquares-Medium' }}>
          Fare details unavailable for this region.
        </Text>
      </View>
    );
  }

  // ---------------------------------------------
  // ⭐ RENDER UI
  // ---------------------------------------------
  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={[color.bgDark, color.subPrimary]} style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.pageTitle}>Rate Card</Text>
              <Text style={styles.pageSubtitle}>{vehicleType || "Standard"} • {district || "General"}</Text>
            </View>
          </View>

          {/* 1. HERO CARD (BASE FARE) */}
          <LinearGradient
            colors={['rgba(0, 224, 255, 0.15)', 'rgba(0, 224, 255, 0.05)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroHeader}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="local-taxi" size={24} color={color.primaryText} />
              </View>
              <Text style={styles.heroLabel}>BASE FARE</Text>
            </View>
            <Text style={styles.heroValue}>₹{fare.baseFare}</Text>
            <Text style={styles.heroSubText}>Applied at the start of every trip</Text>
          </LinearGradient>

          {/* 2. GRID METRICS */}
          <View style={styles.gridContainer}>

            {/* Distance Rate */}
            <View style={styles.gridCard}>
              <View style={[styles.miniIconBox, { backgroundColor: 'rgba(0, 230, 118, 0.1)' }]}>
                <MaterialCommunityIcons name="speedometer" size={20} color="#00E676" />
              </View>
              <Text style={styles.gridValue}>₹{fare.perKmRate}</Text>
              <Text style={styles.gridLabel}>Per Km</Text>
            </View>

            {/* Time Rate */}
            <View style={styles.gridCard}>
              <View style={[styles.miniIconBox, { backgroundColor: 'rgba(255, 171, 0, 0.1)' }]}>
                <MaterialCommunityIcons name="clock-time-four-outline" size={20} color="#FFAB00" />
              </View>
              <Text style={styles.gridValue}>₹{fare.perMinRate}</Text>
              <Text style={styles.gridLabel}>Per Min</Text>
            </View>

            {/* Minimum Fare */}
            <View style={[styles.gridCard, { flexBasis: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={[styles.miniIconBox, { backgroundColor: 'rgba(255, 82, 82, 0.1)' }]}>
                  <Ionicons name="wallet-outline" size={20} color="#FF5252" />
                </View>
                <View>
                  <Text style={styles.gridLabel}>Minimum Fare</Text>
                  <Text style={[styles.gridLabel, { fontSize: 10, color: '#666' }]}>Short trips protection</Text>
                </View>
              </View>
              <Text style={[styles.gridValue, { fontSize: 22 }]}>₹{fare.minFare}</Text>
            </View>

          </View>

          {/* 3. INFO FOOTER */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={22} color="#888" />
            <Text style={styles.infoText}>
              Rates may vary during high demand (Surge Pricing).
              Tolls and parking fees are extra as applicable.
            </Text>
          </View>

        </ScrollView>
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
    fontSize: 24,
    color: "#fff",
    fontFamily: "TT-Octosquares-Medium",
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#888",
    fontFamily: "TT-Octosquares-Medium",
    textTransform: "capitalize",
  },

  // Hero Card
  heroCard: {
    borderRadius: 24,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 224, 255, 0.3)",
    shadowColor: color.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroLabel: {
    color: color.primaryGray,
    fontSize: 12,
    fontFamily: "TT-Octosquares-Medium",
    letterSpacing: 1.5,
  },
  heroValue: {
    fontSize: 42,
    color: "#fff",
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 5,
  },
  heroSubText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontFamily: "TT-Octosquares-Medium",
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 25,
  },
  gridCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  miniIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gridValue: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 12,
    color: "#888",
    fontFamily: "TT-Octosquares-Medium",
  },

  // Footer
  infoBox: {
    flexDirection: 'row',
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 15,
    borderRadius: 12,
    gap: 12,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    fontFamily: "TT-Octosquares-Medium",
  },
});