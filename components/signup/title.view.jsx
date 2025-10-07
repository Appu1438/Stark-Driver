import { useTheme } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import fonts from "@/themes/app.fonts";
import color from "@/themes/app.colors";
import { fontSizes, windowHeight } from "@/themes/app.constant";
import React from "react";

export default function TitleView({ title, subTitle }) {
  const { colors } = useTheme();

  return (
    <View>
      <Text style={[styles.main, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.sub]}>{subTitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    fontSize: fontSizes.FONT25,
    fontFamily: 'TT-Octosquares-Medium',
    marginTop: windowHeight(2),
  },
  sub: {
    color: color.secondaryFont,
    marginTop: windowHeight(0.6),
    fontSize: fontSizes.FONT15,
    fontFamily: 'TT-Octosquares-Medium',
    marginBottom: windowHeight(2),
  },
});