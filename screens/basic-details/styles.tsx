import color from "@/themes/app.colors";
import { fontSizes, windowHeight } from "@/themes/app.constant";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        paddingHorizontal: 20,
        paddingTop: windowHeight(50)
    },
    title: {
        fontSize: fontSizes.FONT22,
        fontFamily: "TT-Octosquares-Medium",

        // fontWeight: "700",
        marginVertical: 20,
        textAlign: "center",
        color: color.primary || "#222",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    infoBox: {
        backgroundColor: "#eef6ff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderLeftColor: color.primary || "#007bff",
    },
    infoText: {
        fontSize: fontSizes.FONT14,
        color: "#444",
        lineHeight: 20,
        fontFamily: "TT-Octosquares-Medium",
    },
    inputBox: {
        marginBottom: 15,
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: "#fdfdfd",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    label: {
        fontFamily: "TT-Octosquares-Medium",
        fontSize: 13,
        color: "#888",
        marginBottom: 4,
    },
    value: {
        fontFamily: "TT-Octosquares-Medium",
        fontSize: 16,
        color: "#222",
    },

});

export { styles }