import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import color from "@/themes/app.colors";
import { windowHeight, windowWidth, fontSizes } from "@/themes/app.constant";
import { Location, Gps } from "@/utils/icons";

export default function RequestCard({
  item,
  onAccept,
  onReject,
  onView,
}) {
  const r = item.data;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        setSelectedRequest(item);
        centerMapOnRequest(item);
      }}
    >
      <View style={styles.card}>
        {/* Price + Timer */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.priceText}>₹{r?.fare?.totalFare}</Text>
            <Text style={styles.paymentType}>Includes taxes</Text>
          </View>
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>⏱ {item.countdown}s</Text>
          </View>
        </View>

        {/* PICKUP */}
        <Text style={styles.addressLabel}>
          PICKUP • {r.kmToPickup} km
        </Text>
        <Text style={styles.addressText} numberOfLines={1}>
          {r.currentLocationName}
        </Text>

        {/* DROP */}
        <Text style={[styles.addressLabel, { marginTop: 10 }]}>
          DROP • {r.kmPickupToDrop} km
        </Text>
        <Text style={styles.addressText} numberOfLines={1}>
          {r.destinationLocation}
        </Text>

        {/* ACTIONS */}
        <View style={styles.actionRow}>
          <Button
            title="Decline"
            width="45%"
            onPress={() => rejectRequest(item.id)}
          />
          <Button
            title="Accept"
            width="45%"
            textColor="#000"
            onPress={() => {
              const accepted = acceptRequest(item.id);
              if (accepted) {
                router.push({
                  pathname: "/(routes)/ride-details",
                  params: { rideId: accepted.data.rideData?.id },
                });
              }
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#151515",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: color.border,
        zIndex:100

  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  fare: {
    color: color.primaryText,
    fontSize: fontSizes.FONT20,
    fontFamily: "TT-Octosquares-Medium",
  },

  countdown: {
    color: color.lightGreen,
    fontSize: fontSizes.FONT15,
    fontFamily: "TT-Octosquares-Medium",
  },

  earnings: {
    color: color.primaryGray,
    fontSize: fontSizes.FONT14,
    marginTop: 5,
    fontFamily: "TT-Octosquares-Medium",
  },

  divider: {
    borderBottomWidth: 1,
    borderColor: color.border,
    opacity: 0.4,
    marginVertical: 12,
  },

  locationRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  left: {
    alignItems: "center",
    marginRight: 12,
  },

  dotLine: {
    borderLeftWidth: 1,
    height: windowHeight(20),
    borderColor: color.primaryGray,
    marginVertical: 4,
  },

  addressBlock: {
    flex: 1,
  },

  pickup: {
    color: color.primaryText,
    fontSize: fontSizes.FONT16,
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 6,
  },

  drop: {
    color: color.secondaryFont,
    fontSize: fontSizes.FONT15,
    fontFamily: "TT-Octosquares-Medium",
  },

  distanceText: {
    color: color.primaryGray,
    marginBottom: 4,
    fontFamily: "TT-Octosquares-Medium",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  viewBtn: {
    width: windowWidth(90),
    height: windowHeight(40),
    borderColor: color.primaryGray,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  viewText: {
    color: color.primaryText,
    fontFamily: "TT-Octosquares-Medium",
  },

  rejectBtn: {
    width: windowWidth(90),
    height: windowHeight(40),
    backgroundColor: color.buttonBg,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  rejectText: {
    color: color.primary,
    fontFamily: "TT-Octosquares-Medium",
  },

  acceptBtn: {
    width: windowWidth(90),
    height: windowHeight(40),
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  acceptText: {
    color: "#000",
    fontFamily: "TT-Octosquares-Medium",
  },
});
