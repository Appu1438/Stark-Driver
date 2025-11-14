import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import { Gps, Location, Star } from "@/utils/icons";
import { router } from "expo-router";

export default function RideCard({ item }) {
  const { colors } = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return { bg: "rgba(0,255,200,0.1)", text: "#00FFC8" };
      case "Ongoing":
        return { bg: "rgba(255,215,0,0.1)", text: "#FFD700" };
      case "Cancelled":
        return { bg: "rgba(255,99,99,0.1)", text: "#FF6B6B" };
      default:
        return { bg: "rgba(255,255,255,0.08)", text: "#B0B0B0" };
    }
  };

  const statusStyle = getStatusColor(item.status);

  return (
    <TouchableOpacity
      style={[
        styles.main,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: "#000",
        },
      ]}
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/(routes)/ride-details",
          params: { rideId: JSON.stringify(item.id) },
        })
      }
    >
      {/* ---------- Top Section ---------- */}
      <View style={styles.top}>
        <View style={styles.rowBetween}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {item?.userId?.name}
          </Text>

          {/* Status Chip */}
          <View
            style={[
              styles.statusChip,
              { backgroundColor: statusStyle.bg, borderColor: statusStyle.text },
            ]}
          >
            <Text
              style={[styles.statusText, { color: statusStyle.text }]}
              numberOfLines={1}
            >
              {item.status || "Unknown"}
            </Text>
          </View>
        </View>

        {/* Rating + Fare Row */}
        <View style={[styles.rowBetween, { marginTop: windowHeight(8) }]}>
          <View style={styles.rate}>
            <Star />
            <Text style={[styles.rating, { color: colors.text }]}>
              {item.rating || item.ratings || 0}
            </Text>
            <View style={[styles.verticalBorder, { borderColor: colors.border }]} />
            <Text style={[styles.price, { color: color.primaryText }]}>
              ₹ {item.totalFare}
            </Text>
          </View>

          <Text style={[styles.timing, { color: color.secondaryFont }]}>
            {item.createdAt?.slice(0, 10)}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.border, { borderColor: colors.border }]} />

      {/* ---------- Bottom Section ---------- */}
      <View style={styles.bottom}>
        <View style={styles.leftView}>
          <Location color={color.lightGray} />
          <View style={[styles.verticaldot, { borderColor: color.lightGray }]} />
          <Gps colors={color.lightGray} />
        </View>

        <View style={styles.rightView}>
          <Text style={[styles.pickup, { color: color.secondaryFont }]}>
            {item.currentLocationName?.length > 50
              ? item.currentLocationName.substring(0, 50) + "..."
              : item.currentLocationName}
          </Text>
          <Text style={[styles.drop, { color: color.secondaryFont }]}>
            {item.destinationLocationName?.length > 50
              ? item.destinationLocationName.substring(0, 50) + "..."
              : item.destinationLocationName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  main: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    padding: windowWidth(15),
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  top: {
    paddingBottom: windowHeight(5),
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT18,
    maxWidth: "55%",
  },
  rate: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginHorizontal: windowWidth(5),
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT15,
  },
  verticalBorder: {
    borderLeftWidth: 1,
    height: windowHeight(15),
    marginHorizontal: windowWidth(5),
  },
  price: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT16,
  },
  border: {
    borderBottomWidth: 1,
    opacity: 0.3,
    marginVertical: windowHeight(6),
  },
  timing: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT13,
  },
  bottom: {
    flexDirection: "row",
    marginTop: windowHeight(6),
  },
  leftView: {
    alignItems: "center",
    marginRight: windowWidth(10),
  },
  verticaldot: {
    borderLeftWidth: 1,
    height: windowHeight(20),
    marginVertical: windowHeight(5),
  },
  rightView: {
    flex: 1,
    justifyContent: "space-between",
  },
  pickup: {
    fontSize: fontSizes.FONT16,
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: windowHeight(8),
  },
  drop: {
    fontSize: fontSizes.FONT16,
    fontFamily: "TT-Octosquares-Medium",
  },

  /* ---------- Status Chip ---------- */
  statusChip: {
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT13,
    textTransform: "capitalize",
  },
});
