import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
  Animated,
  FlatList,
  StyleSheet as RNStyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart } from "react-native-gifted-charts";
import { useDriverEarnings } from "@/hooks/useGetDriverData";
import color from "@/themes/app.colors";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import { EarningsModal } from "@/components/earnings/earningsModal";

const TABS = ["daily", "weekly", "monthly"];
const screenWidth = Dimensions.get("window").width;

// ---------- SHIMMER SKELETON ----------
const EarningsSkeleton = () => {
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
        ...RNStyleSheet.absoluteFillObject,
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

  const SkeletonBox = ({ width, height, radius = 10, marginBottom = 10 }) => (
    <View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: "rgba(255,255,255,0.08)",
        overflow: "hidden",
        marginBottom,
      }}
    >
      <ShimmerOverlay />
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: windowHeight(40),
      }}
    >
      {/* TOTAL EARNINGS CARD */}
      <View
        style={{
          borderRadius: 20,
          backgroundColor: color.bgDark,
          padding: 20,
          marginBottom: 25,
          overflow: "hidden",
        }}
      >
        <ShimmerOverlay />
        <SkeletonBox width={120} height={16} radius={8} />
        <SkeletonBox width={160} height={40} radius={8} />
        <SkeletonBox width={100} height={25} radius={12} marginBottom={0} />
      </View>

      {/* BAR CHART PLACEHOLDER */}
      <View
        style={{
          backgroundColor: color.bgDark,
          borderRadius: 15,
          padding: 10,
          height: 220,
          marginBottom: 25,
          overflow: "hidden",
        }}
      >
        <ShimmerOverlay />
      </View>

      {/* LIST ITEMS */}
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={{
            backgroundColor: color.bgDark,
            borderRadius: 15,
            paddingVertical: 18,
            paddingHorizontal: 15,
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <ShimmerOverlay />
          <SkeletonBox width="70%" height={16} radius={6} />
          <SkeletonBox width="40%" height={12} radius={6} />
        </View>
      ))}
    </ScrollView>
  );
};

// ---------- MAIN COMPONENT ----------
export default function EarningsDetails() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const { earnings, loading, refetchEarnings } = useDriverEarnings(period);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchEarnings();
    setRefreshing(false);
  };

  const totalEarnings = earnings?.driverEarnings || 0;
  const rideCount = earnings?.rideCount || 0;
  const avgEarning = rideCount ? (totalEarnings / rideCount).toFixed(0) : 0;

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: color.subPrimary,
        paddingHorizontal: windowWidth(20),
        paddingTop: windowHeight(20),
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={color.primary} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <Text
        style={{
          color: color.primaryText,
          fontSize: fontSizes.FONT25,
          fontFamily: "TT-Octosquares-Medium",
          marginTop: windowHeight(30),
          alignSelf: "center",
        }}
      >
        Your Earnings
      </Text>

      {/* PERIOD TABS */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: windowHeight(20),
          marginBottom: windowHeight(10),
          backgroundColor: color.bgDark,
          borderRadius: 30,
          padding: 5,
        }}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setPeriod(tab as any)}
            style={{
              flex: 1,
              backgroundColor: period === tab ? color.buttonBg : "transparent",
              borderRadius: 25,
              paddingVertical: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: period === tab ? color.primary : color.lightGray,
                fontFamily: "TT-Octosquares-Medium",
                fontSize: fontSizes.FONT14,
                textTransform: "capitalize",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SHIMMER LOADING */}
      {loading ? (
        <EarningsSkeleton />
      ) : (
        <>
          {/* TOTAL EARNINGS CARD */}
          <View
            style={{
              backgroundColor: color.bgDark,
              padding: windowWidth(20),
              borderRadius: 15,
              marginTop: windowHeight(10),
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.FONT14,
                color: color.secondaryFont,
                fontFamily: "TT-Octosquares-Medium",
                marginBottom: 5,
              }}
            >
              Total Earnings
            </Text>
            <Text
              style={{
                fontSize: fontSizes.FONT28,
                color: color.primaryText,
                fontFamily: "TT-Octosquares-Medium",
              }}
            >
              ₹ {totalEarnings.toLocaleString("en-IN")}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  color: color.lightGray,
                  fontFamily: "TT-Octosquares-Medium",
                  fontSize: fontSizes.FONT14,
                }}
              >
                Trips: {rideCount}
              </Text>
              <Text
                style={{
                  color: color.lightGray,
                  fontFamily: "TT-Octosquares-Medium",
                  fontSize: fontSizes.FONT14,
                }}
              >
                Avg ₹{avgEarning}/trip
              </Text>
            </View>
          </View>

          {/* BAR CHART */}
          <View style={{ marginTop: windowHeight(30) }}>
            <Text
              style={{
                color: color.primaryText,
                fontFamily: "TT-Octosquares-Medium",
                marginBottom: 12,
                fontSize: fontSizes.FONT16,
              }}
            >
              {capitalize(period)} Earnings Trend
            </Text>

            {earnings?.chartData?.length > 0 ? (
              <BarChart
                data={[...earnings.chartData]
                  .reverse()
                  .map((d: any) => ({
                    value: d.driverEarnings,
                    label:
                      period === "monthly"
                        ? formatMonthLabel(d.label)
                        : period === "weekly"
                          ? d.label.replace("W", "")
                          : d.label.slice(-5),
                    frontColor: color.buttonBg,
                    gradientColor: color.primary,
                    spacing: 50,
                  }))}
                barWidth={20}
                barBorderRadius={6}
                hideRules
                noOfSections={5}
                yAxisLabelPrefix="₹"
                isAnimated
                animationDuration={1000}
                yAxisThickness={0}
                xAxisThickness={0}
                xAxisTextNumberOfLines={2}
                xAxisLabelTextStyle={{
                  color: color.lightGray,
                  fontFamily: "TT-Octosquares-Medium",
                  fontSize: fontSizes.FONT12,
                  textAlign: "center",
                }}
                yAxisTextStyle={{
                  color: color.lightGray,
                  fontFamily: "TT-Octosquares-Medium",
                  fontSize: fontSizes.FONT11,
                  marginRight: -10,
                }}
                initialSpacing={
                  earnings?.chartData.length === 1
                    ? screenWidth / 2 - 40
                    : 30
                }
                endSpacing={
                  earnings?.chartData.length === 1
                    ? screenWidth / 2 - 40
                    : 20
                }
                maxValue={
                  Math.max(...earnings.chartData.map((d: any) => d.totalFare)) * 1.2
                }
                renderTooltip={(item) => (
                  <View
                    style={{
                      backgroundColor: color.bgDark,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: color.buttonBg,
                      maxWidth: 100,
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: color.primaryText,
                        fontFamily: "TT-Octosquares-Medium",
                        fontSize: fontSizes.FONT12,
                        textAlign: "center",
                      }}
                    >
                      ₹ {item.value.toLocaleString("en-IN")}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text
                style={{
                  color: color.lightGray,
                  fontFamily: "TT-Octosquares-Medium",
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                No earnings data found.
              </Text>
            )}
          </View>

          {/* EARNINGS LIST */}
          <View style={{ marginTop: windowHeight(30), marginBottom: windowHeight(60) }}>
            <Text
              style={{
                color: color.primaryText,
                fontFamily: "TT-Octosquares-Medium",
                fontSize: fontSizes.FONT18,
                marginBottom: 10,
              }}
            >
              {capitalize(period)} Summary
            </Text>

            <FlatList
              data={earnings?.chartData.reverse() || []}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: color.bgDark,
                      borderRadius: 12,
                      paddingVertical: 14,
                      paddingHorizontal: 18,
                      marginVertical: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "TT-Octosquares-Medium",
                        color: color.primaryText,
                        fontSize: fontSizes.FONT15,
                      }}
                    >
                      {formatListLabel(item.label, period)}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "TT-Octosquares-Medium",
                        color: color.buttonBg,
                        fontSize: fontSizes.FONT16,
                      }}
                    >
                      ₹ {item.driverEarnings.toLocaleString("en-IN")}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text
                  style={{
                    color: color.lightGray,
                    fontFamily: "TT-Octosquares-Medium",
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  No {period} data available.
                </Text>
              }
            />
          </View>
        </>
      )}
      <EarningsModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
      />

    </ScrollView>


  );
}

// ---------- HELPERS ----------
const formatMonthLabel = (label: string) => {
  const [year, month] = label.split("-");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[parseInt(month) - 1] || label;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const formatListLabel = (label: string, period: string) => {
  if (period === "monthly") return formatMonthLabel(label);
  if (period === "weekly") return label.replace("W", "Week ");
  return label;
};
