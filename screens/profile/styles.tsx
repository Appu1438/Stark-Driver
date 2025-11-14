import color from "@/themes/app.colors";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import fonts from "@/themes/app.fonts";
import { StyleSheet } from "react-native";

 const styles = StyleSheet.create({
  container: { flex: 1,
    //  backgroundColor: color.background
     },

  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    height: windowHeight(240),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#eee",
    marginBottom: 12,
  },
  name: {
    fontSize: fontSizes.FONT22,
    color: "white",
    fontFamily: "TT-Octosquares-Medium",
  },
  email: {
    fontSize: fontSizes.FONT16,
    color: "#e0e0e0",
    fontFamily: "TT-Octosquares-Medium",
  },

  statsCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 18,
    marginTop: -windowHeight(40),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  walletCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 25,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: color.border,
  },
  walletLabel: {
    fontSize: fontSizes.FONT16,
    color: color.lightGray,
    fontFamily: "TT-Octosquares-Medium",
  },
  walletAmount: {
    fontSize: fontSizes.FONT22,
    color: color.primaryText,
    fontFamily: "TT-Octosquares-Medium",
    marginTop: 5,
  },
  addMoneyBtn: {
    backgroundColor: color.buttonBg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addMoneyText: {
    color: color.primary,
    fontFamily: "TT-Octosquares-Medium",
  },

  sectionContainer: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  sectionHeader: {
    fontSize: fontSizes.FONT18,
    fontFamily: "TT-Octosquares-Medium",
    color: color.primaryText,
    marginBottom: 10,
  },
  sectionItem: {
    backgroundColor: color.subPrimary,
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: color.border,
  },
  sectionLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  sectionText: {
    fontSize: fontSizes.FONT16,
    color: color.primaryText,
    fontFamily: "TT-Octosquares-Medium",
  },

  logoutBtn: {
    marginTop: 40,
    marginHorizontal: 20,
    backgroundColor: color.buttonBg,
    padding: 15,
    borderRadius: 12,
  },
  logoutText: {
    textAlign: "center",
    fontSize: fontSizes.FONT16,
    color: color.primary,
    fontFamily: "TT-Octosquares-Medium",
  },
});


export { styles }

const basicStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: windowHeight(50)
    },
    title: {
        fontSize: fontSizes.FONT22,
        fontFamily: "TT-Octosquares-Medium",

        // fontWeight: "700",
        marginVertical: 20,
        textAlign: "center",
        color: color.primaryText,
    },
    card: {
        borderRadius: 12,
        // padding: 15,
        marginBottom: 20,
    },
    infoBox: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderBottomWidth: 1,
        borderColor: color.primaryGray,
    },
    infoText: {
        fontSize: fontSizes.FONT14,
        color: color.primaryText,
        lineHeight: 20,
        fontFamily: "TT-Octosquares-Medium",
    },
    inputBox: {
        marginBottom: 15,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: color.border,
        borderRadius: 10
    },
    label: {
        fontFamily: "TT-Octosquares-Medium",
        fontSize: fontSizes.FONT14,
        color: color.primaryText,
        marginBottom: 4,
    },
    value: {
        fontFamily: "TT-Octosquares-Medium",
        fontSize: fontSizes.FONT16,
        color: color.primaryGray,
    },

});

export { basicStyles }