import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import color from "@/themes/app.colors";
import { windowHeight, windowWidth } from "@/themes/app.constant";

export default function RideDetailsSkeleton() {
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

  return (
    <View style={styles.container}>
      {/* ---------- MAP SKELETON ---------- */}
      <View style={styles.mapSkeleton}>
        <ShimmerOverlay />
      </View>

      {/* ---------- DETAILS CARD ---------- */}
      <View style={styles.cardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: windowWidth(24),
            paddingTop: 20,
            paddingBottom: 60,
          }}
        >
          {/* STATUS INDICATOR */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 25,
            }}
          >
            <SkeletonBox width={20} height={20} radius={10} marginRight={10} />
            <SkeletonBox width={150} height={16} radius={8} />
          </View>

          {/* PASSENGER INFO */}
          <SkeletonBox width={100} height={18} radius={6} marginBottom={10} />
          <SkeletonBox width={"80%"} height={45} radius={12} marginBottom={25} />

          {/* NAVIGATION BUTTONS */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 25,
            }}
          >
            <SkeletonBox width={"47%"} height={45} radius={12} />
            <SkeletonBox width={"47%"} height={45} radius={12} />
          </View>

          {/* TRIP DETAILS */}
          <SkeletonBox width={130} height={18} radius={6} marginBottom={15} />
          {[1, 2, 3].map((_, i) => (
            <SkeletonBox key={i} width={"100%"} height={35} radius={10} marginBottom={10} />
          ))}

          {/* FARE BREAKDOWN */}
          <View
            style={{
              marginTop: 25,
              padding: 18,
              borderRadius: 14,
              backgroundColor: "rgba(255,255,255,0.04)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <SkeletonBox width={150} height={18} radius={6} marginBottom={15} />
            {[1, 2, 3, 4].map((_, i) => (
              <SkeletonBox
                key={i}
                width={"100%"}
                height={30}
                radius={10}
                marginBottom={8}
              />
            ))}
          </View>

          {/* RATING SECTION */}
          <View
            style={{
              marginTop: 25,
              padding: 20,
              borderRadius: 16,
              backgroundColor: "rgba(255,255,255,0.04)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
              alignItems: "center",
            }}
          >
            <SkeletonBox width={120} height={18} radius={8} marginBottom={15} />
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              {[1, 2, 3, 4, 5].map((_, i) => (
                <SkeletonBox key={i} width={28} height={28} radius={14} marginRight={8} />
              ))}
            </View>
          </View>

          {/* ACTION BUTTON */}
          <View style={{ marginTop: 35, alignItems: "center" }}>
            <SkeletonBox width={"90%"} height={48} radius={12} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgDark,
  },
  mapSkeleton: {
    height: windowHeight(450),
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  cardContainer: {
    flex: 1,
    backgroundColor: color.subPrimary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -50,
    overflow: "hidden",
  },
});
