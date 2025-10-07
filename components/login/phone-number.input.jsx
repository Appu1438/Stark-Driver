import { View, Text, TextInput } from "react-native";
import { commonStyles } from "@/styles/common.style";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { external } from "@/styles/external.style";
import { styles } from "@/screens/login/styles";
import color from "@/themes/app.colors";
import SelectInput from "../common/select-input";
import { useState } from "react";
import { countryItems } from "@/configs/country-list";

export default function PhoneNumberInput({
  width,
  phone_number,
  setphone_number,
  countryCode,
  setCountryCode,
}) {

  return (
    <View>
      <Text
        style={[commonStyles.mediumTextBlack, {
          marginTop: windowHeight(8), fontFamily: 'TT-Octosquares-Medium',
        }]}
      >
        Phone Number
      </Text>
      <View
        style={[
          external.fd_row,
          external.ai_center,
          external.mt_5,
          { flexDirection: "row" },
        ]}
      >
        <View
          style={[
            styles.countryCodeContainer,
            {
              borderColor: color.border,
              zIndex: 10, // important for iOS to render correctly

            },
          ]}
        >

          <SelectInput
            title=""
            placeholder="Select your country"
            value={countryCode} // should be like '91'
            onValueChange={(val) => {
              console.log("Selected country value:", val); // logs "91"
              setCountryCode(val);
            }}
            items={countryItems}
            showWarning={false}
            warning="Please choose your country code!"
          />

        </View>
        <View
          style={[
            styles.phoneNumberInput,
            {
              width: width || windowWidth(326),
              borderColor: color.border,
            },
          ]}
        >
          <TextInput
            style={[commonStyles.regularText, {
              color: '#000', fontFamily: 'TT-Octosquares-Medium',
            }]}
            placeholderTextColor={color.subtitle}
            placeholder={"Enter your number"}
            keyboardType="numeric"
            onChangeText={setphone_number}
            maxLength={10}
          />
        </View>
      </View>
    </View>
  );
}
