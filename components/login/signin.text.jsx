import { View, Text } from "react-native";
import React from "react";
import { commonStyles } from "@/styles/common.style";
import { external } from "@/styles/external.style";

export default function SignInText({
  title,
  subtitle,
}) {
  return (
    <>
      <Text
        style={[
          commonStyles.regularTextBigBlack,
          { color: "#000" },
          { textAlign: "left" },
          { marginTop: 20 },
          {
            fontFamily: 'TT-Octosquares-Medium',
          }
        ]}
      >
        {title ? title : "Join to take your ride 😃"}
      </Text>
      <Text
        style={[commonStyles.regularText, external.pt_4, {
          textAlign: "left", fontFamily: 'TT-Octosquares-Medium',
        }]}
      >
        {subtitle
          ? subtitle
          : "Enter your phone number, get one otp and let's go 😍"}
      </Text>
    </>
  );
}
