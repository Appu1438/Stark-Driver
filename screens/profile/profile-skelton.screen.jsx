import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  Dimensions,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import color from "@/themes/app.colors";

export default function DriverProfileSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;

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
    outputRange: [-screenWidth, screenWidth * 2],
  });

  const ShimmerOverlay = () => (
    <Animated.View
      style={{
        ...StyleSheet.absoluteFillObject,
        transform: [{ translateX }],
      }}
    >
      <LinearGradient
        colors={["transparent", "rgba(255,255,255,0.08)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );

  const SkeletonBox = ({
    width,
    height,
    radius = 10,
    marginBottom = 15,
    style,
  }) => (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: "rgba(255,255,255,0.05)", // Premium dark skeleton color
          overflow: "hidden",
          marginBottom,
        },
        style,
      ]}
    >
      <ShimmerOverlay />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background to match main screen */}
      <LinearGradient
        colors={[color.bgDark || "#000", "#111"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ---------- 1. HEADER ROW (Avatar + Info) ---------- */}
        <View style={styles.headerRow}>
          {/* Avatar */}
          <SkeletonBox width={75} height={75} radius={25} marginBottom={0} />

          {/* Info Column */}
          <View style={{ marginLeft: 20, justifyContent: 'center' }}>
            <SkeletonBox width={180} height={24} radius={6} marginBottom={8} />
            <SkeletonBox width={120} height={14} radius={6} marginBottom={10} />
            <SkeletonBox width={80} height={22} radius={6} marginBottom={0} />
          </View>
        </View>

        {/* ---------- 2. STATS STRIP ---------- */}
        <SkeletonBox width="100%" height={70} radius={16} marginBottom={25} />

        {/* ---------- 3. WALLET CARD ---------- */}
        <SkeletonBox width="100%" height={160} radius={24} marginBottom={30} />

        {/* ---------- 4. MENU GROUPS (Islands) ---------- */}

        {/* Group 1: Essentials */}
        <SkeletonBox width={120} height={14} radius={4} marginBottom={10} />
        <SkeletonBox width="100%" height={180} radius={16} marginBottom={25} />

        {/* Group 2: Financials */}
        <SkeletonBox width={100} height={14} radius={4} marginBottom={10} />
        <SkeletonBox width="100%" height={180} radius={16} marginBottom={25} />

        {/* Group 3: Support */}
        <SkeletonBox width={80} height={14} radius={4} marginBottom={10} />
        <SkeletonBox width="100%" height={120} radius={16} marginBottom={30} />

        {/* ---------- 5. LOGOUT BUTTON ---------- */}
        <SkeletonBox width="100%" height={55} radius={16} marginBottom={50} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 80, // Matches the new profile header padding
    paddingBottom: 50,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
});