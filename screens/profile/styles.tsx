import color from "@/themes/app.colors";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import fonts from "@/themes/app.fonts";
import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    header: {
        alignItems: "center",
        paddingVertical: 30,
        backgroundColor: color.primary,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingTop: windowHeight(50),
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        backgroundColor: "#eee",
    },
    name: {
        fontSize: fontSizes.FONT22,
        fontFamily: "TT-Octosquares-Medium",
        // fontWeight: "700",
        color: "white",

    },
    email: {
        fontSize: fontSizes.FONT16,
        fontFamily: "TT-Octosquares-Medium",
        color: "#ccc",
    },
    walletCard: {
        backgroundColor: "#fff",
        margin: 20,
        padding: 20,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    walletLabel: {
        fontSize: fontSizes.FONT16,
        color: color.primaryText,
        fontFamily: "TT-Octosquares-Medium",

    },
    walletAmount: {
        fontSize: fontSizes.FONT22,
        // fontWeight: "700",
        marginTop: 5,
        color: color.primaryText,
        fontFamily: "TT-Octosquares-Medium",

    },
    addMoneyBtn: {
        backgroundColor: color.primary,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addMoneyText: {
        color: "white",
        // fontWeight: "600",
        fontFamily: "TT-Octosquares-Medium",

    },
    sectionContainer: {
        marginHorizontal: 20,
        marginTop: 10,
    },
    sectionItem: {
        backgroundColor: "#f5f5f5",
        padding: 15,
        borderRadius: 12,
        marginVertical: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    sectionText: {
        fontSize: fontSizes.FONT16,
        // fontWeight: "600",
        color: color.primaryText,
        fontFamily: "TT-Octosquares-Medium",

    },
    logoutBtn: {
        marginTop: 30,
        marginHorizontal: 20,
        backgroundColor: color.primary,
        padding: 15,
        borderRadius: 12,
    },
    logoutText: {
        textAlign: "center",
        color: "white",
        // fontWeight: "600",
        fontSize: 16,
        fontFamily: "TT-Octosquares-Medium",

    },
});

export { styles }