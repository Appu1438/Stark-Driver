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

export default function ComplaintSkeleton() {
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
        colors={["transparent", "rgba(255,255,255,0.2)", "transparent"]}
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

  const ComplaintCardSkeleton = () => (
    <View
      style={{
        backgroundColor: color.subPrimary,
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
        borderLeftWidth: 4,
        borderLeftColor: "rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}
    >
      <ShimmerOverlay />
      <SkeletonBox width="60%" height={16} radius={6} marginBottom={6} /> {/* category */}
      <SkeletonBox width="40%" height={12} radius={6} marginBottom={6} /> {/* ride info */}
      <SkeletonBox width="100%" height={14} radius={6} marginBottom={6} /> {/* message */}
      <SkeletonBox width="70%" height={14} radius={6} /> {/* date */}
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: windowHeight(40),
        paddingHorizontal: windowWidth(25),
        paddingBottom: windowHeight(60),
        backgroundColor: color.background,
      }}
    >
      {/* ---------- HEADER ---------- */}
      <SkeletonBox width={200} height={28} radius={6} marginBottom={10} />
      <SkeletonBox width="80%" height={18} radius={6} marginBottom={30} />

      {/* ---------- FORM SECTION ---------- */}
      <SkeletonBox width="100%" height={50} radius={10} marginBottom={15} /> {/* ride selector */}
      <SkeletonBox width={140} height={18} radius={8} marginBottom={10} /> {/* complaint type title */}
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonBox
            key={i}
            width={90}
            height={35}
            radius={20}
            marginRight={10}
          />
        ))}
      </View>
      <SkeletonBox width="100%" height={100} radius={12} marginBottom={20} /> {/* message box */}
      <SkeletonBox width="100%" height={45} radius={12} marginBottom={30} /> {/* submit button */}

      {/* ---------- COMPLAINT HISTORY ---------- */}
      <SkeletonBox width={180} height={20} radius={8} marginBottom={20} />
      {[1, 2, 3].map((i) => (
        <ComplaintCardSkeleton key={i} />
      ))}
    </ScrollView>
  );
}
