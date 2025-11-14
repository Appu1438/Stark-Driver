import color from "@/themes/app.colors";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import fonts from "@/themes/app.fonts";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  /* ---------- MAIN LAYOUT ---------- */
  container: {
    flex: 1,
  },
  spaceBelow: {
    paddingBottom: windowHeight(10),
  },

  /* ---------- STAT AREA ---------- */
  statsContainer: {
    paddingHorizontal: windowWidth(20),
    marginTop: windowHeight(10),
    marginBottom: windowHeight(10),
  },

  statCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: color.subPrimary,
    marginBottom: windowHeight(12),
    marginHorizontal: windowWidth(4),
    paddingVertical: windowHeight(15),
    paddingHorizontal: windowWidth(10),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  statValue: {
    fontSize: fontSizes.FONT24,
    color: color.primaryText,
    fontFamily: "TT-Octosquares-Medium",
    marginTop: windowHeight(4),
  },
  statLabel: {
    fontSize: fontSizes.FONT14,
    color: color.lightGray,
    fontFamily: "TT-Octosquares-Medium",
    marginTop: windowHeight(2),
  },

  /* ---------- RIDE SECTION ---------- */
  rideContainer: {
    paddingHorizontal: windowWidth(20),
    paddingTop: windowHeight(15),
    paddingBottom: windowHeight(30),
    backgroundColor: "transparent",
  },
  rideTitle: {
    marginBottom: windowHeight(10),
    fontSize: fontSizes.FONT22,
    fontFamily: "TT-Octosquares-Medium",
    color: color.primaryText,
  },
  rideCardContainer: {
    backgroundColor: color.subPrimary,
    borderRadius: 16,
    padding: windowWidth(14),
    marginBottom: windowHeight(10),
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  emptyText: {
    fontFamily: "TT-Octosquares-Medium",
    color: color.lightGray,
    textAlign: "center",
    marginTop: windowHeight(10),
    fontSize: fontSizes.FONT14,
  },

  /* ---------- MODAL STYLING (unchanged) ---------- */
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.modelBg,
  },
  modalContainer: {
    backgroundColor: "white",
    maxWidth: windowWidth(420),
    padding: windowWidth(20),
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    color: color.primaryText,
    fontFamily: fonts.medium,
    fontSize: fontSizes.FONT24,
    paddingBottom: windowHeight(8),
  },
  buttonContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    marginTop: windowHeight(5),
  },
  button: {
    backgroundColor: color.primary,
    width: windowWidth(22),
    height: windowHeight(5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: fonts.medium,
    color: color.whiteColor,
  },
});

export { styles };
