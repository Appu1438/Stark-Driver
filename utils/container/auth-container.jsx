import {
    View,
    Text,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import React, { ReactNode } from "react";
import { external } from "@/styles/external.style";
import Images from "../images";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { styles } from "./styles";
import color from "@/themes/app.colors";


const AuthContainer = ({ container, topSpace, imageShow }) => {
    return (
        <KeyboardAvoidingView
            style={[external.fx_1]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -90}

        >
            {imageShow && (
                <Text
                    style={{
                        fontFamily: "TT-Octosquares-Medium",
                        fontSize: windowWidth(30),
                        textAlign: "center",
                        paddingTop: windowHeight(50),
                        color: color.primaryText,
                    }}
                >
                    Stark Driver
                </Text>
            )}
            <Image
                style={[styles.backgroundImage, { marginTop: topSpace }]}
                source={Images.authBg}
            />

            <View style={styles.contentContainer}>
                <View style={[styles.container]}>
                    <ScrollView>{container}</ScrollView>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default AuthContainer;