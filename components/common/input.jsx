
import {
  View,
  Text,
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import fonts from "@/themes/app.fonts";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";



export default function Input({
  title,
  placeholder,
  keyboardType,
  value,
  warning,
  onChangeText,
  showWarning,
  emailFormatWarning,
  disabled,
}) {
  const { colors } = useTheme();

  return (
    <View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: color.subPrimary,
            borderColor: color.border,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={color.lightGray}
        keyboardType={keyboardType}
        value={value}
        editable={disabled}
        aria-disabled={disabled}
        onChangeText={onChangeText}
      />
      {showWarning && <Text style={[styles.warning]}>{warning}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'TT-Octosquares-Medium',
    fontSize: windowWidth(20),
    marginVertical: windowHeight(8),
  },
  input: {
    borderRadius: 7,
    borderWidth: 1,
    marginBottom: 10,
    height: Platform.OS === "ios" ? windowHeight(40) : windowHeight(40),
    color: color.primaryText,
    paddingHorizontal: 10,
    fontFamily: 'TT-Octosquares-Medium',

  },
  warning: {
    color: color.red,
    marginTop: 0,
    fontFamily: 'TT-Octosquares-Medium',
    marginBottom:10

  },
});
