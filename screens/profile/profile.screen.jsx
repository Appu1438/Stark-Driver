import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { fontSizes, windowWidth } from "@/themes/app.constant";
import { useGetDriverData, useGetDriverWallet } from "@/hooks/useGetDriverData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import color from "@/themes/app.colors";
import { Linking } from "react-native";
import axios from "axios";
import axiosInstance from "@/api/axiosInstance";
import { handleAddMoney, logout } from "@/api/apis";

export default function Profile() {
  const { driver, loading } = useGetDriverData();
  const { wallet, loading: walletLoading } = useGetDriverWallet();
  // console.log("Active Device Object:", driver?.activeDevice);

  // // Safely access properties
  // console.log("Device Brand:", driver?.activeDevice?.brand);
  // console.log("Device Model:", driver?.activeDevice?.model);
  // console.log("Device OS:", driver?.activeDevice?.osName);

  if (loading || walletLoading) return null;

  // Avatar selection based on gender
  const getAvatar = (gender) => {
    if (gender?.toLowerCase() === "male") {
      return "https://i.pravatar.cc/150?img=12";
    } else if (gender?.toLowerCase() === "female") {
      return "https://i.pravatar.cc/150?img=47";
    } else {
      return "https://i.pravatar.cc/150";
    }
  };


  const SectionLink = ({
    title,
    path,
    icon,
  }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: path,
          params: {
            ...driver,
            activeDevice: JSON.stringify(driver?.activeDevice), // serialize
          },
        })
      }
      style={styles.sectionItem}
    >
      <View style={styles.sectionLeft}>
        {icon}
        <Text style={styles.sectionText}>{title}</Text>
      </View>
      <Ionicons
        name="chevron-forward-outline"
        size={20}
        color={color.primaryText}
      />
    </TouchableOpacity>
  );

  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: driver?.profilePic || getAvatar(driver?.gender) }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{driver?.name}</Text>
        <Text style={styles.email}>{driver?.email}</Text>
      </View>

      {/* Wallet Section */}
      <View style={styles.walletCard}>
        <View>
          <Text style={styles.walletLabel}>Wallet Balance</Text>
          <Text style={styles.walletAmount}>₹{wallet?.balance}</Text>
        </View>
        <TouchableOpacity
          style={styles.addMoneyBtn}
          onPress={() => handleAddMoney(driver)}
        >
          <Text style={styles.addMoneyText}>Add Money</Text>
        </TouchableOpacity>

      </View>

      {/* Navigation Sections */}
      <View style={styles.sectionContainer}>
        <SectionLink
          title="Profile Information"
          path="/(routes)/basic-details"
          icon={
            <Ionicons
              name="person-circle-outline"
              size={22}
              color={color.primaryText}
            />
          }
        />
        <SectionLink
          title="Documents"
          path="/(routes)/document-details"
          icon={<MaterialIcons name="article" size={22} color={color.primaryText} />}
        />
        <SectionLink
          title="Vehicle Details"
          path="/(routes)/vehicle-details"
          icon={<Ionicons name="car-outline" size={22} color={color.primaryText} />}
        />
        <SectionLink
          title="Fare Details"
          path="/(routes)/fare-details"
          icon={<Ionicons name="cash-outline" size={22} color={color.primaryText} />}
        />
        <SectionLink
          title="Address"
          path="/(routes)/address-details"
          icon={<Ionicons name="location-outline" size={22} color={color.primaryText} />}
        />
        <SectionLink
          title="Wallet & Histories"
          path="/(routes)/wallet-details"
          icon={<Ionicons name="wallet-outline" size={22} color={color.primaryText} />}
        />
        {/* <SectionLink
          title="Payment Methods"
          path="/(routes)/payment-methods"
          icon={<Ionicons name="card-outline" size={22} color={color.primaryText} />}
        /> */}
      </View>

      {/* Logout */}
      <TouchableOpacity
        onPress={() => logout(driver?.id, "LoggedOut SuccessFully")}
        style={styles.logoutBtn}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
    // </SafeAreaView>
  );
}
