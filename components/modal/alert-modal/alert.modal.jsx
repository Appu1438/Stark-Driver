import React, { useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import color from "@/themes/app.colors";
import { fontSizes } from "@/themes/app.constant";

export default function AppAlert({
  visible,
  title = "Alert",
  message = "",
  cancelText = "Cancel",
  confirmText = "OK",
  onCancel,
  onConfirm,
}) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, { opacity, transform: [{ scale }] }]}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.row}>
            <TouchableOpacity onPress={onCancel} style={[styles.btn, styles.cancelBtn]}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm} style={[styles.btn, styles.okBtn]}>
              <Text style={styles.okText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: color.subPrimary,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderWidth: 1,
    borderColor: color.border,
  },
  title: {
    fontSize: fontSizes.FONT20,
    textAlign: "center",
    color: color.primaryText,
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 10,
  },
  message: {
    fontSize: fontSizes.FONT14,
    textAlign: "center",
    color: color.lightGray,
    fontFamily: "TT-Octosquares-Medium",
    marginBottom: 22,
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    width: "47%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#333",
  },
  okBtn: {
    backgroundColor: color.buttonBg,
  },
  cancelText: {
    color: "#fff",
    fontFamily: "TT-Octosquares-Medium",
  },
  okText: {
    color: color.primary,
    fontFamily: "TT-Octosquares-Medium",
  },
});
