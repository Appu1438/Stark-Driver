import color from "@/themes/app.colors";
import { fontSizes } from "@/themes/app.constant";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

export const EarningsModal = ({ visible, onClose, item }) => {
  if (!item) return null;

  console.log(item)

  const parts = splitPlatformFee(item.platformFee);


  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      <View
        style={{
          backgroundColor: color.bgDark,
          padding: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <Text
          style={{
            color: color.primaryText,
            fontFamily: "TT-Octosquares-Medium",
            fontSize: fontSizes.FONT20,
            marginBottom: 10,
          }}
        >
          Earnings Summary - {formatEarningLabel(item.label)}
        </Text>

        {/* Total Fare */}
        <View style={styles.row}>
          <Text style={styles.label}>Total Collection</Text>
          <Text style={styles.value}>
            ₹ {item.totalFare.toLocaleString("en-IN")}
          </Text>
        </View>

        {/* Platform Fee (15% Total) */}
        <View style={styles.row}>
          <Text style={styles.label}>Total Deductions (15%)</Text>
          <Text style={[styles.value, { color: "#ff6f6f" }]}>
            - ₹ {item.platformFee.toLocaleString("en-IN")}
          </Text>
        </View>

        {/* Breakdown */}
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <View style={styles.row}>
            <Text style={styles.label}>Govt Taxes (5%)</Text>
            <Text style={[styles.value, { color: "#ff6f6f" }]}>
              - ₹ {parts.govtTax.toLocaleString("en-IN")}
            </Text>
          </View>

          {/* <View style={styles.row}>
            <Text style={styles.label}>Charity Fund (2.5%)</Text>
            <Text style={[styles.value, { color: "#ff6f6f" }]}>
              - ₹ {parts.charity.toLocaleString("en-IN")}
            </Text>
          </View> */}

          <View style={styles.row}>
            <Text style={styles.label}>Platform Fee (10%)</Text>
            <Text style={[styles.value, { color: "#ff6f6f" }]}>
              - ₹ {parts.platform.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        {/* Driver Earnings */}
        <View style={styles.row}>
          <Text style={styles.label}>Your Earnings</Text>
          <Text style={[styles.value, { color: color.buttonBg }]}>
            ₹ {item.driverEarnings.toLocaleString("en-IN")}
          </Text>
        </View>

        {/* Rides */}
        <View style={styles.row}>
          <Text style={styles.label}>Trips</Text>
          <Text style={styles.value}>{item.rideCount}</Text>
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: color.buttonBg,
            paddingVertical: 12,
            borderRadius: 12,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#000",
              fontFamily: "TT-Octosquares-Medium",
            }}
          >
            Close
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

};

const splitPlatformFee = (platformFee) => {
  return {
    govtTax: Number((platformFee * 0.05 / 0.15).toFixed(2)),       // 5% of total fare
    // charity: Number((platformFee * 0.025 / 0.15).toFixed(2)),      // 2.5% of total fare
    platform: Number((platformFee * 0.10 / 0.15).toFixed(2)),     // 7.5% of total fare
  };
};


const formatEarningLabel = (label) => {
  // DAILY → YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(label)) {
    const date = new Date(label);
    return date.toDateString(); // e.g., "Mon Nov 24 2025"
  }

  // WEEKLY → WXX-YYYY OR XX-YYYY
  if (/^W?\d{1,2}-\d{4}$/.test(label)) {
    const clean = label.replace("W", "");
    const [week, year] = clean.split("-");
    return `Week ${week}, ${year}`;
  }

  // MONTHLY → YYYY-MM
  if (/^\d{4}-\d{2}$/.test(label)) {
    const [year, month] = label.split("-");
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }

  // FALLBACK
  return label;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: {
    color: color.lightGray,
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT14,
  },
  value: {
    color: color.primaryText,
    fontFamily: "TT-Octosquares-Medium",
    fontSize: fontSizes.FONT16,
  },
});
