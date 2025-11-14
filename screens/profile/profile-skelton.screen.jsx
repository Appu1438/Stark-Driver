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

export default function DriverProfileSkeleton() {
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

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: windowWidth(25),
        paddingTop: windowHeight(40),
        paddingBottom: windowHeight(60),
        backgroundColor: color.background,
      }}
    >
      {/* ---------- HEADER ---------- */}
      <View
        style={{
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            marginBottom: 15,
          }}
        >
          <ShimmerOverlay />
        </View>
        <SkeletonBox width={140} height={18} radius={6} marginBottom={8} />
        <SkeletonBox width={180} height={14} radius={6} />
      </View>

      {/* ---------- WALLET ---------- */}
      <View
        style={{
          width: "100%",
          height: windowHeight(110),
          borderRadius: 18,
          backgroundColor: color.subPrimary,
          marginBottom: 25,
          overflow: "hidden",
        }}
      >
        <ShimmerOverlay />
      </View>

      {/* ---------- QUICK STATS ---------- */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 35,
        }}
      >
        {[1, 2].map((i) => (
          <View key={i} style={{ alignItems: "center" }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "rgba(255,255,255,0.08)",
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <ShimmerOverlay />
            </View>
            <SkeletonBox width={60} height={14} radius={6} />
          </View>
        ))}
      </View>

      {/* ---------- PROFILE & VEHICLE SECTION ---------- */}
      <View style={{ marginBottom: 25 }}>
        <SkeletonBox width={160} height={18} radius={6} marginBottom={15} />
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBox
            key={i}
            width="100%"
            height={45}
            radius={10}
            marginBottom={10}
          />
        ))}
      </View>

      {/* ---------- SUPPORT SECTION ---------- */}
      <View style={{ marginBottom: 25 }}>
        <SkeletonBox width={160} height={18} radius={6} marginBottom={15} />
        {[1, 2].map((i) => (
          <SkeletonBox
            key={i}
            width="100%"
            height={45}
            radius={10}
            marginBottom={10}
          />
        ))}
      </View>

      {/* ---------- APP INFO SECTION ---------- */}
      <View style={{ marginBottom: 25 }}>
        <SkeletonBox width={160} height={18} radius={6} marginBottom={15} />
        <SkeletonBox width="100%" height={45} radius={10} marginBottom={10} />
      </View>

      {/* ---------- LOGOUT BUTTON ---------- */}
      <SkeletonBox
        width="100%"
        height={50}
        radius={14}
        marginTop={20}
        marginBottom={50}
      />
    </ScrollView>
  );
}
