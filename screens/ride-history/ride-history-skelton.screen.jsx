import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import color from "@/themes/app.colors";
import { windowHeight, windowWidth } from "@/themes/app.constant";

export default function RideHistorySkeleton() {
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

  const RideCardSkeleton = () => (
    <View
      style={{
        width: "100%",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: windowWidth(15),
        marginVertical: 8,
        backgroundColor: "rgba(255,255,255,0.05)",
      }}
    >
      <ShimmerOverlay />

      {/* ---------- Top Row: Driver Name + Rating + Fare ---------- */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <SkeletonBox width="40%" height={16} marginBottom={8} /> {/* driver name */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SkeletonBox width={20} height={16} radius={4} marginBottom={0} /> {/* star */}
          <SkeletonBox width={30} height={14} radius={4} marginLeft={5} />
          <SkeletonBox width={60} height={16} radius={6} marginLeft={10} /> {/* fare */}
        </View>
      </View>

      {/* ---------- Second Row: Date + Distance ---------- */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: windowHeight(6),
        }}
      >
        <SkeletonBox width="30%" height={12} radius={4} /> {/* date */}
        <SkeletonBox width="20%" height={12} radius={4} /> {/* distance */}
      </View>

      {/* Divider */}
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          opacity: 0.3,
          marginVertical: windowHeight(8),
        }}
      />

      {/* ---------- Bottom Section: Pickup + Drop ---------- */}
      <View style={{ flexDirection: "row", marginTop: windowHeight(4) }}>
        {/* Left line + icons mimic */}
        <View
          style={{
            alignItems: "center",
            marginRight: windowWidth(10),
          }}
        >
          <SkeletonBox width={16} height={16} radius={8} marginBottom={4} />
          <View
            style={{
              borderLeftWidth: 1,
              height: windowHeight(20),
              borderColor: "rgba(255,255,255,0.1)",
              marginVertical: 4,
            }}
          />
          <SkeletonBox width={16} height={16} radius={8} marginTop={4} />
        </View>

        {/* Pickup and Drop text */}
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <SkeletonBox width="90%" height={14} radius={6} marginBottom={10} />
          <SkeletonBox width="85%" height={14} radius={6} />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: windowHeight(40),
        paddingHorizontal: 20,
        paddingBottom: 60,
        backgroundColor: color.background,
      }}
    >
      {/* ---------- Ride History Title ---------- */}
      <SkeletonBox
        width={160}
        height={24}
        radius={8}
        marginBottom={20}
      />

      {/* ---------- RideCard Skeletons ---------- */}
      {[1, 2, 3, 4, 5].map((i) => (
        <RideCardSkeleton key={i} />
      ))}
    </ScrollView>
  );
}
