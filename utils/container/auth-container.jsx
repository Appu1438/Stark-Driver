import {
    View,
    Text,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Animated,
} from "react-native";
import React, { ReactNode, useEffect, useRef } from "react";
import { external } from "@/styles/external.style";
import Images from "../images";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { styles } from "./styles";
import color from "@/themes/app.colors";


const AuthContainer = ({ container, topSpace, imageShow }) => {

    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const keyboardShow = Keyboard.addListener("keyboardWillShow", keyboardShowHandler);
        const keyboardHide = Keyboard.addListener("keyboardWillHide", keyboardHideHandler);

        // Android fallback (keyboardDid*)
        const keyboardShowAndroid = Keyboard.addListener("keyboardDidShow", keyboardShowHandler);
        const keyboardHideAndroid = Keyboard.addListener("keyboardDidHide", keyboardHideHandler);

        return () => {
            keyboardShow.remove();
            keyboardHide.remove();
            keyboardShowAndroid.remove();
            keyboardHideAndroid.remove();
        };
    }, []);

    const keyboardShowHandler = (e) => {
        Animated.timing(translateY, {
            toValue: -e.endCoordinates.height,   // adjust for spacing
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const keyboardHideHandler = () => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View
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

            <Animated.View
                style={{
                    ...styles.contentContainer,
                    flex: 1,
                    transform: [{ translateY }]
                }}
            >

                <View style={[styles.container]}>
                    <ScrollView>{container}</ScrollView>
                </View>
            </Animated.View>
        </View>
    );
};

export default AuthContainer;