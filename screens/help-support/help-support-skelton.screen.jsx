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

export default function HelpAndSupportSkeleton() {
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

  const FaqCardSkeleton = () => (
    <View
      style={{
        backgroundColor: color.subPrimary,
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}
    >
      <ShimmerOverlay />
      <SkeletonBox width="80%" height={16} radius={6} marginBottom={10} /> {/* question */}
      <SkeletonBox width="95%" height={14} radius={6} marginBottom={6} /> {/* answer line */}
      <SkeletonBox width="60%" height={14} radius={6} /> {/* answer line */}
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: windowHeight(40),
        paddingHorizontal: windowWidth(25),
        paddingBottom: windowHeight(60),
        backgroundColor: color.background,
      }}
    >
      {/* ---------- HEADER ---------- */}
      <SkeletonBox width={200} height={28} radius={6} marginBottom={10} />
      <SkeletonBox width="80%" height={16} radius={6} marginBottom={25} />

      {/* ---------- SEARCH BOX ---------- */}
      <View
        style={{
          backgroundColor: color.subPrimary,
          borderRadius: 12,
          height: 50,
          width: "100%",
          marginBottom: 25,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}
      >
        <ShimmerOverlay />
      </View>

      {/* ---------- QUICK HELP HEADER ---------- */}
      <SkeletonBox width={150} height={22} radius={6} marginBottom={15} />

      {/* ---------- FAQ SKELETONS ---------- */}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <FaqCardSkeleton key={i} />
      ))}

      {/* ---------- CONTACT SECTION ---------- */}
      <View
        style={{
          borderRadius: 18,
          padding: 18,
          marginTop: 30,
          marginBottom: 30,
          backgroundColor: color.subPrimary,
          overflow: "hidden",
        }}
      >
        <ShimmerOverlay />
        <SkeletonBox width={180} height={20} radius={6} marginBottom={15} />
        <SkeletonBox width="90%" height={16} radius={6} marginBottom={10} />
        <SkeletonBox width="70%" height={16} radius={6} marginBottom={10} />
        <SkeletonBox width="80%" height={16} radius={6} marginBottom={20} />
        <SkeletonBox width="100%" height={45} radius={12} />
      </View>

      {/* ---------- FOOTER ---------- */}
      <SkeletonBox
        width="70%"
        height={14}
        radius={6}
        marginBottom={30}
        marginTop={10}
      />
    </ScrollView>
  );
}
