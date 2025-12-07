import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { rideIcons } from "@/configs/constants";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import { LinearGradient } from "expo-linear-gradient";

export default function RenderRideItem({ item }) {
  const iconIndex = parseInt(item.id) - 1;
  // Safely get icon or fallback to first one if index is out of bounds
  const icon = rideIcons[iconIndex] || rideIcons[0];

  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* ---------- Header Row (Icon + Label) ---------- */}
      <View style={styles.cardTop}>
        <View style={styles.iconWrapper}>
          {icon}
        </View>
      </View>

      {/* ---------- Content (Value + Title) ---------- */}
      <View style={styles.contentContainer}>
        <Text style={styles.valueText}>{item.value ?? 0}</Text>
        <Text style={styles.labelText}>{item.title}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    margin: 6,
    minHeight: windowHeight(110),
    justifyContent: "space-between",
    
    // Glassmorphism Border
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    
    // // Subtle Shadow
    // shadowColor: "#000",
    // shadowOpacity: 0.15,
    // shadowRadius: 10,
    // shadowOffset: { width: 0, height: 4 },
    // elevation: 4,
  },

  /* ---------- Layout ---------- */
  cardTop: {
    flexDirection: "row",
    justifyContent: "flex-end", // Moves icon to right
    marginBottom: 10,
  },

  /* ---------- Icon ---------- */
  iconWrapper: {
    height: 38,
    width: 38,
    borderRadius: 12, // Squircle shape
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  /* ---------- Text Content ---------- */
  contentContainer: {
    justifyContent: 'flex-end',
  },
  valueText: {
    fontSize: 28,
    fontFamily: "TT-Octosquares-Medium",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  labelText: {
    fontSize: 13,
    color: color.secondaryFont || "#888",
    fontFamily: "TT-Octosquares-Medium",
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
});