import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import DropDownPicker from "react-native-dropdown-picker"; // install this
import fonts from "@/themes/app.fonts";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";

export default function SelectInput({
  title,
  placeholder,
  items,
  value,
  warning,
  onValueChange,
  showWarning,
}) {
  const { colors } = useTheme();

  const [open, setOpen] = React.useState(false);
  const [dropdownValue, setDropdownValue] = React.useState(value || null);

  React.useEffect(() => {
    setDropdownValue(value || null);
  }, [value]);

  return (
    <View>
      {/* Optional Title */}
      {/* <Text style={[styles.title, { color: colors.text }]}>{title}</Text> */}

      {Platform.OS === "android" ? (
        <RNPickerSelect
          onValueChange={onValueChange}
          items={items}
          useNativeAndroidPickerStyle={false}
          placeholder={{ label: placeholder, value: null }}
          value={value || null}
          style={{
            inputAndroid: {
              ...styles.input,
              backgroundColor: color.subPrimary,
              borderColor: colors.border,
              borderWidth: 1,
              // color: "#000",
              height: windowHeight(39),
              paddingHorizontal: 10,
              borderRadius: 5,
              fontFamily: "TT-Octosquares-Medium",
            },
            itemStyle: {
              fontFamily: "TT-Octosquares-Medium",
              fontSize: 16,
              color: color.lightGray,
            },
            placeholder: {
              fontFamily: "TT-Octosquares-Medium",
              color: color.lightGray,
            },
          }}
        />

      ) : (
        <DropDownPicker
          open={open}
          setOpen={setOpen}
          value={dropdownValue}
          setValue={(callback) => {
            const val = callback(dropdownValue);
            setDropdownValue(val);
            onValueChange(val);
          }}
          items={items}
          placeholder={placeholder}
          style={{
            backgroundColor: color.subPrimary,
            borderColor: color.border,
            borderWidth: 1,
            minHeight: windowHeight(40),
            paddingHorizontal: 10,

          }}
          textStyle={{
            color: color.lightGray,
            fontSize: 14,
            fontFamily: 'TT-Octosquares-Medium'

          }}
          dropDownContainerStyle={{
            borderColor: colors.border,
            backgroundColor: color.subPrimary,
            // width: windowWidth(90), // ✅ this controls the dropdown list width
            alignSelf: 'center',     // optional: to center the dropdown under the button
            marginTop: 5,            // optional spacing between button and dropdown
            marginLeft: 0,
            marginBlock: 5,
            borderRadius: 20,     // optional spacing between button and dropdown
            // minHeight: windowHeight(40),

          }}
          showArrowIcon={false}
          showTickIcon={false}
        />
      )}

      {showWarning && <Text style={[styles.warning]}>{warning}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.medium,
    fontSize: windowWidth(20),
    marginVertical: windowHeight(8),
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
    height: windowHeight(39),
    color: color.primaryText,
    // backgroundColor: color.subPrimary

  },
  warning: {
    color: color.red,
    marginTop: 3,
  },
});
