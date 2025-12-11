import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import { Gps, Location, Star } from "@/utils/icons";
import { router } from "expo-router";

export default function RideCard({ item }) {
  const { colors } = useTheme();

  // refined status colors for a neon/premium look
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return { bg: "rgba(0, 255, 200, 0.08)", text: "#00FFC8", border: "rgba(0, 255, 200, 0.2)" };
      case "Ongoing":
        return { bg: "rgba(255, 215, 0, 0.08)", text: "#FFD700", border: "rgba(255, 215, 0, 0.2)" };
      case "Cancelled":
        return { bg: "rgba(255, 99, 99, 0.08)", text: "#FF6B6B", border: "rgba(255, 99, 99, 0.2)" };
      default:
        return { bg: "rgba(255, 255, 255, 0.05)", text: "#B0B0B0", border: "rgba(255, 255, 255, 0.1)" };
    }
  };

  const statusStyle = getStatusColor(item.status);

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.card, // Assuming a dark card color
          borderColor: "rgba(255,255,255,0.08)", // Subtle border
        },
      ]}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/(routes)/ride-details",
          params: { rideId: JSON.stringify(item.id) },
        })
      }
    >
      {/* ================= HEADER (Driver & Price) ================= */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.driverName, { color: colors.text }]}>
            {item?.userId?.name || "Unknown User"}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} />
            {/* Assuming Star component takes size, if not, remove prop */}
            <Text style={[styles.ratingText, { color: color.secondaryFont }]}>
              {item.rating || item.ratings || "0"}
            </Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, { color: color.primaryText }]}>
            ₹{item.totalFare}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* ================= BODY (Timeline) ================= */}
      <View style={styles.bodyContainer}>
        {/* Left Side: Visual Timeline */}
        <View style={styles.timelineLeft}>
          {/* Pickup Dot */}
          <View style={[styles.dot, { borderColor: "#4CAF50" }]}>
            <View style={[styles.innerDot, { backgroundColor: "#4CAF50" }]} />
          </View>

          {/* Dashed Line */}
          <View style={styles.dashedLine} />

          {/* Dropoff Square */}
          <View style={[styles.square, { borderColor: "#FF5252" }]}>
            <View style={[styles.innerSquare, { backgroundColor: "#FF5252" }]} />
          </View>
        </View>

        {/* Right Side: Address Text */}
        <View style={styles.timelineRight}>
          <View style={styles.addressBox}>
            <Text style={[styles.addressLabel, { color: color.secondaryFont }]}>Pickup</Text>
            <Text style={[styles.addressText, { color: colors.text }]} numberOfLines={1}>
              {item.currentLocationName || "Pickup Location"}
            </Text>
          </View>

          <View style={[styles.addressBox, { marginTop: 18 }]}>
            <Text style={[styles.addressLabel, { color: color.secondaryFont }]}>Drop-off</Text>
            <Text style={[styles.addressText, { color: colors.text }]} numberOfLines={1}>
              {item.destinationLocationName || "Destination Location"}
            </Text>
          </View>
        </View>
      </View>

      {/* ================= FOOTER (Date & Status) ================= */}
      <View style={styles.footerRow}>
        <Text style={[styles.dateText, { color: color.secondaryFont }]}>
          {item.createdAt ? new Date(item.createdAt).toDateString() : "Date N/A"}
        </Text>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusStyle.bg,
              borderColor: statusStyle.border,
            },
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {item.status || "Unknown"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    padding: windowWidth(16),
    marginVertical: 10,
    // Premium Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Android
    elevation: 4,
  },

  /* --- HEADER --- */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  driverName: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT18,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop:5
  },
  ratingText: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT14,
  },
  priceContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT17,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: 4,
  },

  /* --- BODY (Timeline) --- */
  bodyContainer: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 14,
    paddingTop: 4,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dashedLine: {
    height: 28,
    width: 1,
    borderLeftWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderStyle: "dashed",
    marginVertical: 4,
  },
  square: {
    width: 16,
    height: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4, // Soft square
  },
  innerSquare: {
    width: 6,
    height: 6,
    borderRadius: 1,
  },
  timelineRight: {
    flex: 1,
    justifyContent: "space-between",
  },
  addressBox: {
    justifyContent: "center",
  },
  addressLabel: {
    fontSize: fontSizes.FONT10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
    opacity: 0.7,
    fontFamily: "TT-Octosquares-Medium",
  },
  addressText: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT15,
    lineHeight: 20,
  },

  /* --- FOOTER --- */
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  dateText: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT12,
    opacity: 0.8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});