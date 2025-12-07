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
  StyleSheet,
  StatusBar,
  StyleSheet as RNStyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart } from "react-native-gifted-charts";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDriverEarnings } from "@/hooks/useGetDriverData";
import color from "@/themes/app.colors";
import { router } from "expo-router";
import { EarningsModal } from "@/components/earnings/earningsModal";
import { fontSizes } from "@/themes/app.constant";

const TABS = ["daily", "weekly", "monthly"];
const screenWidth = Dimensions.get("window").width;

// ---------- PREMIUM SKELETON ----------
const EarningsSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, { toValue: 1, duration: 1300, useNativeDriver: true })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, Dimensions.get("window").width + 200],
  });

  const SkeletonBox = ({ width, height, radius = 10, style }) => (
    <View style={[{ width, height, borderRadius: radius, backgroundColor: "rgba(255,255,255,0.05)", overflow: "hidden" }, style]}>
      <Animated.View style={{ ...RNStyleSheet.absoluteFillObject, transform: [{ translateX }] }}>
        <LinearGradient colors={["transparent", "rgba(255,255,255,0.05)", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
      </Animated.View>
    </View>
  );

  return (
    <View style={{ marginTop: 20 }}>
      <SkeletonBox width="100%" height={140} radius={20} style={{ marginBottom: 25 }} />
      <SkeletonBox width="100%" height={250} radius={20} style={{ marginBottom: 25 }} />
      {[1, 2, 3].map((i) => (
        <SkeletonBox key={i} width="100%" height={70} radius={12} style={{ marginBottom: 15 }} />
      ))}
    </View>
  );
};

// ---------- MAIN COMPONENT ----------
export default function EarningsDetails() {
  const [period, setPeriod] = useState("daily");
  const { earnings, loading, refetchEarnings } = useDriverEarnings(period);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchEarnings();
    setRefreshing(false);
  };

  const totalEarnings = earnings?.driverEarnings || 0;
  const rideCount = earnings?.rideCount || 0;
  const avgEarning = rideCount ? (totalEarnings / rideCount).toFixed(0) : 0;

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <View style={styles.mainContainer}>
      <LinearGradient colors={[color.bgDark, color.subPrimary]} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={color.primary} />}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Earnings</Text>
          </View>

          {/* PERIOD TABS */}
          <View style={styles.tabContainer}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setPeriod(tab)}
                style={[styles.tabButton, period === tab && styles.activeTab]}
              >
                <Text style={[styles.tabText, period === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? (
            <EarningsSkeleton />
          ) : (
            <>
              {/* 1. HERO STATS CARD */}
              <LinearGradient
                colors={['#1F222B', '#15171E']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.heroCard}
              >
                <View style={styles.heroTop}>
                  <View>
                    <Text style={styles.heroLabel}>Total Revenue</Text>
                    <Text style={styles.heroValue}>{formatCurrency(totalEarnings)}</Text>
                  </View>
                  <View style={styles.iconBox}>
                    <MaterialCommunityIcons name="finance" size={24} color={color.primaryText} />
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{rideCount}</Text>
                    <Text style={styles.statLabel}>Total Trips</Text>
                  </View>
                  <View style={styles.verticalDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>₹{avgEarning}</Text>
                    <Text style={styles.statLabel}>Avg / Trip</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* 2. ANALYTICS CHART */}
              <View style={styles.chartContainer}>
                <View style={styles.chartHeader}>
                  <MaterialCommunityIcons name="google-analytics" size={18} color="#aaa" />
                  <Text style={styles.chartTitle}>{capitalize(period)} Trends</Text>
                </View>

                {earnings?.chartData?.length > 0 ? (
                  <BarChart
                    data={[...earnings.chartData].reverse().map((d) => ({
                      value: d.driverEarnings,
                      label: formatChartLabel(d.label, period),
                      frontColor: color.primaryText,
                      gradientColor: color.primary,
                      // topLabelComponent: () => (
                      //   <Text style={{ color: '#fff', fontSize: 10, marginBottom: 4, fontFamily: 'TT-Octosquares-Medium' }}>
                      //     {formatCurrency(d.driverEarnings).replace('₹', '')}
                      //   </Text>
                      // )
                    }))}
                    barWidth={20}
                    barBorderRadius={6}
                    hideRules
                    noOfSections={5}
                    yAxisLabelPrefix=""
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
                    isAnimated
                    animationDuration={800}
                    spacing={50}
                  // initialSpacing={20}
                  />
                ) : (
                  <View style={styles.noDataBox}>
                    <Text style={styles.noDataText}>No chart data available</Text>
                  </View>
                )}
              </View>

              {/* 3. DETAILED LIST */}
              <View style={styles.listSection}>
                <Text style={styles.sectionTitle}>Breakdown</Text>

                <FlatList
                  data={earnings?.chartData.reverse() || []}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => { setSelectedItem(item); setModalVisible(true); }}
                      style={styles.listItem}
                    >
                      <View style={styles.listIcon}>
                        <Ionicons name="calendar-outline" size={18} color="#fff" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listDate}>{formatListLabel(item.label, period)}</Text>
                        <Text style={styles.listSub}>{item.rideCount || 0} Trips Completed</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.listAmount}>{formatCurrency(item.driverEarnings)}</Text>
                        <Ionicons name="chevron-forward" size={14} color="#666" />
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.noDataText}>No records found for this period.</Text>
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
      </SafeAreaView>
    </View>
  );
}

// ---------- HELPERS ----------
const formatMonthLabel = (label) => {
  const [year, month] = label.split("-");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[parseInt(month) - 1] || label;
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const formatChartLabel = (label, period) => {
  if (period === "monthly") return formatMonthLabel(label);
  if (period === "weekly") return label.replace("W", "");
  return label.slice(-5); // "12-10"
};

const formatListLabel = (label, period) => {
  if (period === "monthly") return `${formatMonthLabel(label)} ${label.split('-')[0]}`; // Jan 2024
  if (period === "weekly") return `Week ${label.split('W')[1]}, ${label.split('-')[0]}`;
  return label; // YYYY-MM-DD
};

// ---------- STYLES ----------
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#050505" },
  scrollContent: { padding: 20, paddingBottom: 50 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, gap: 15 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  pageTitle: { fontSize: 24, color: "#fff", fontFamily: "TT-Octosquares-Medium" },

  // Tabs
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, marginBottom: 25 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: 'rgba(255,255,255,0.1)' },
  tabText: { color: '#666', fontFamily: "TT-Octosquares-Medium", fontSize: 13, textTransform: 'capitalize' },
  activeTabText: { color: '#fff' },

  // Hero Card
  heroCard: { borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 25 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  heroLabel: { color: '#888', fontSize: 12, textTransform: 'uppercase', marginBottom: 4, fontFamily: "TT-Octosquares-Medium" },
  heroValue: { fontSize: 32, color: '#fff', fontFamily: "TT-Octosquares-Medium" },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, color: '#fff', fontFamily: "TT-Octosquares-Medium" },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2, fontFamily: "TT-Octosquares-Medium" },
  verticalDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)', height: '80%' },

  // Chart
  chartContainer: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 20, marginBottom: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  chartHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  chartTitle: { color: '#fff', fontSize: 16, fontFamily: "TT-Octosquares-Medium" },
  noDataBox: { height: 150, alignItems: 'center', justifyContent: 'center' },
  noDataText: { color: '#555', fontFamily: "TT-Octosquares-Medium" },

  // List
  listSection: { marginTop: 10 },
  sectionTitle: { fontSize: 18, color: '#fff', fontFamily: "TT-Octosquares-Medium", marginBottom: 15 },
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, marginBottom: 10, gap: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)' },
  listIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  listDate: { color: '#fff', fontSize: 14, fontFamily: "TT-Octosquares-Medium", marginBottom: 2 },
  listSub: { color: '#666', fontSize: 11, fontFamily: "TT-Octosquares-Medium" },
  listAmount: { color: color.primaryGray, fontSize: 15, fontFamily: "TT-Octosquares-Medium", marginBottom: 2 },
});