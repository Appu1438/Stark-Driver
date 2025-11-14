import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { rideIcons } from "@/configs/constants";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import { LinearGradient } from "expo-linear-gradient";

export default function RenderRideItem({ item }) {
  const iconIndex = parseInt(item.id) - 1;
  const icon = rideIcons[iconIndex];

  return (
    <LinearGradient
      colors={[color.subPrimary, "rgba(255,255,255,0.04)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* ---------- Top Row ---------- */}
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.valueText}>{item.value ?? 0}</Text>
        </View>

        <View style={styles.iconWrapper}>{icon}</View>
      </View>

      {/* ---------- Bottom Text ---------- */}
      <Text style={styles.labelText}>{item.title}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: windowHeight(15),
    paddingHorizontal: windowWidth(15),
    margin: windowWidth(8),
    minHeight: windowHeight(100),
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    // marginHorizontal:5
  },

  /* ---------- Layout ---------- */
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  /* ---------- Icon ---------- */
  iconWrapper: {
    height: windowHeight(35),
    width: windowHeight(35),
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  /* ---------- Text ---------- */
  valueText: {
    fontSize: fontSizes.FONT26,
    fontFamily: "TT-Octosquares-Medium",
    color: color.primaryText,
  },
  labelText: {
    marginTop: windowHeight(10),
    fontSize: fontSizes.FONT14,
    color: color.lightGray,
    fontFamily: "TT-Octosquares-Medium",
  },
});
