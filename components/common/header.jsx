import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import SwitchToggle from "react-native-switch-toggle";
import { Notification } from "@/utils/icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Header({ isOn, toggleSwitch, driver }) {
  return (
    <LinearGradient
      colors={[color.darkPrimary, color.bgDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerMain}
    >
      {/* ---------- TOP ROW ---------- */}
      <View style={styles.topRow}>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri:
                driver?.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.driverName}>{driver?.name || "Driver"}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.notificationButton} activeOpacity={0.8}>
          <Notification colors="#fff" />
        </TouchableOpacity>
      </View>

      {/* ---------- SWITCH SECTION ---------- */}
      <View style={styles.switchContainer}>
        <View style={styles.switchTextSection}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isOn
                  ? "rgba(0, 255, 200, 0.6)" // soft cyan glow
                  : "rgba(255, 255, 255, 0.4)", // muted gray tone
              },
            ]}
          />
          <Text style={styles.statusLabel}>
            {isOn ? "You’re online and visible to riders" : "You’re currently offline"}
          </Text>
        </View>

        <SwitchToggle
          switchOn={isOn}
          onPress={toggleSwitch}
          containerStyle={styles.switchView}
          circleStyle={styles.switchCircle}
          backgroundColorOff="rgba(255,255,255,0.1)"
          backgroundColorOn="rgba(0,255,200,0.1)"
          circleColorOn="rgba(0,255,200,0.9)"
          circleColorOff="rgba(255,255,255,0.5)"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerMain: {
    paddingTop: windowHeight(40),
    paddingBottom: windowHeight(25),
    paddingHorizontal: windowWidth(25),
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: "#000",
  },

  /* ---------- TOP ROW ---------- */
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: windowHeight(15),
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  welcomeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: fontSizes.FONT14,
    fontFamily: "TT-Octosquares-Medium",
  },
  driverName: {
    color: "#fff",
    fontSize: fontSizes.FONT22,
    fontFamily: "TT-Octosquares-Medium",
  },
  notificationButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* ---------- SWITCH SECTION ---------- */
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  switchTextSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    color: "#fff",
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT14,
  },
  switchView: {
    width: 60,
    height: 28,
    borderRadius: 20,
    padding: 5,
  },
  switchCircle: {
    width: 22,
    height: 22,
    borderRadius: 20,
  },
});
