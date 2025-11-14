import React, { useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import color from "@/themes/app.colors";
import { windowHeight, windowWidth } from "@/themes/app.constant";

export default function DriverHomeSkeleton() {
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
        ...StyleSheet.absoluteFillObject,
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

  const SkeletonBox = ({
    width,
    height,
    radius = 10,
    marginBottom = 10,
    marginTop = 0,
  }) => (
    <View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: "rgba(255,255,255,0.08)",
        overflow: "hidden",
        marginBottom,
        marginTop,
      }}
    >
      <ShimmerOverlay />
    </View>
  );

  const StatCardSkeleton = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: color.subPrimary,
        borderRadius: 14,
        marginBottom: 15,
        marginHorizontal: 6,
        padding: 15,
        overflow: "hidden",
      }}
    >
      <ShimmerOverlay />
      <SkeletonBox width={35} height={35} radius={10} marginBottom={10} /> {/* Icon */}
      <SkeletonBox width="60%" height={20} radius={8} marginBottom={8} /> {/* Value */}
      <SkeletonBox width="80%" height={12} radius={6} /> {/* Label */}
    </View>
  );

  const RideCardSkeleton = () => (
    <View
      style={{
        backgroundColor: color.subPrimary,
        borderRadius: 14,
        marginBottom: 15,
        padding: 15,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <ShimmerOverlay />
      <SkeletonBox width="70%" height={18} radius={6} marginBottom={8} />
      <SkeletonBox width="50%" height={14} radius={6} marginBottom={6} />
      <SkeletonBox width="40%" height={12} radius={6} />
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: color.background }}
      contentContainerStyle={{
        paddingTop: windowHeight(20),
        paddingHorizontal: windowWidth(20),
        paddingBottom: windowHeight(80),
      }}
    >
      {/* ---------- HEADER ---------- */}
      <View
        style={{
          borderRadius: 18,
          backgroundColor: color.subPrimary,
          paddingVertical: 25,
          paddingHorizontal: 15,
          marginBottom: 25,
          overflow: "hidden",
        }}
      >
        <ShimmerOverlay />
        <SkeletonBox width="50%" height={20} radius={8} marginBottom={10} />
        <SkeletonBox width="70%" height={24} radius={8} />
      </View>

      {/* ---------- STATS GRID ---------- */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: 25,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <View key={i} style={{ width: "48%" }}>
            <StatCardSkeleton />
          </View>
        ))}
      </View>

      {/* ---------- RECENT RIDES HEADER ---------- */}
      <SkeletonBox width="40%" height={22} radius={8} marginBottom={15} />

      {/* ---------- RECENT RIDE CARDS ---------- */}
      {[1, 2, 3].map((i) => (
        <RideCardSkeleton key={i} />
      ))}
    </ScrollView>
  );
}
