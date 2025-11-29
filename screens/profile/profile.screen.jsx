import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useGetDriverData, useGetDriverWallet } from "@/hooks/useGetDriverData";
import { router } from "expo-router";
import {
  Ionicons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import color from "@/themes/app.colors";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import { getAvatar } from "@/utils/avatar/getAvatar";
import { handleAddMoney, logout } from "@/api/apis";
import DriverProfileSkeleton from "./profile-skelton.screen";
import AppAlert from "@/components/modal/alert-modal/alert.modal";

export default function Profile() {
  const { driver, loading: dataLoading, refetchData } = useGetDriverData();
  const { wallet, loading: walletLoading, refetchWallet } = useGetDriverWallet();

  const [refreshing, setRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    confirmText: "OK",
    showCancel: false,
    onConfirm: () => setShowAlert(false),
    onCancel: () => setShowAlert(false),
  });


  const onRefresh = async () => {
    setRefreshing(true);
    await refetchData();
    await refetchWallet();
    setRefreshing(false);
  };

  const confirmLogout = () =>
    new Promise((resolve) => {
      setAlertConfig({
        title: "Confirm Logout",
        message: "Are you sure you want to log out?",
        confirmText: "Log Out",
        showCancel: true,

        onCancel: () => {
          setShowAlert(false);
          resolve(false);
        },

        onConfirm: () => {
          setShowAlert(false);
          resolve(true);
        },
      });

      setShowAlert(true);
    });

  if (dataLoading || walletLoading) {
    return <DriverProfileSkeleton />;
  }

  const rating = driver?.ratings || 0;
  const joinedYear = new Date(driver?.createdAt).getFullYear();

  const SectionLink = ({ title, path, icon }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: path, params: { ...driver, activeDevice: JSON.stringify(driver?.activeDevice), }, })}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        borderBottomWidth: 0.7,
        borderColor: color.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {icon}
        <Text
          style={{
            color: color.primaryText,
            fontFamily: "TT-Octosquares-Medium",
            fontSize: fontSizes.FONT16,
          }}
        >
          {title}
        </Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={18} color="#888" />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: color.background,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={color.primary} />
      }
    >
      {/* ---------- HEADER ---------- */}
      <LinearGradient
        colors={[color.primary, color.darkPrimary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingVertical: 50,
          paddingHorizontal: 25,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          alignItems: "center",
          elevation: 4,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 8,
        }}
      >
        <View
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: "#fff",
            overflow: "hidden",
            marginBottom: 12,
            borderWidth: 3,
            borderColor: "#fff",
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <Image
            source={{ uri: driver?.profilePic || getAvatar(driver?.gender) }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <Text
          style={{
            fontSize: fontSizes.FONT22,
            color: "white",
            fontFamily: "TT-Octosquares-Medium",
          }}
        >
          {driver?.name}
        </Text>
        <Text
          style={{
            fontSize: fontSizes.FONT15,
            color: "#e0e0e0",
            fontFamily: "TT-Octosquares-Medium",
          }}
        >
          {driver?.email}
        </Text>
      </LinearGradient>

      {/* ---------- WALLET ---------- */}
      <View
        style={{
          marginHorizontal: 20,
          marginTop: -windowHeight(25),
          backgroundColor: color.subPrimary,
          borderRadius: 20,
          padding: 20,
          borderWidth: 1.5,
          borderColor: color.border,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text
              style={{
                fontSize: fontSizes.FONT15,
                color: color.lightGray,
                fontFamily: "TT-Octosquares-Medium",
              }}
            >
              Wallet Balance
            </Text>
            <Text
              style={{
                fontSize: fontSizes.FONT26,
                color: color.primaryText,
                fontFamily: "TT-Octosquares-Medium",
                marginTop: 5,
              }}
            >
              ₹{wallet?.balance || 0}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: color.buttonBg,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 15,
              borderRadius: 10,
              height: 38,
            }}
            onPress={() => handleAddMoney(driver, setShowAlert, setAlertConfig)}
          >
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={color.primary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                fontFamily: "TT-Octosquares-Medium",
                color: color.primary,
              }}
            >
              Add Money
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ---------- QUICK STATS ---------- */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 25,
        }}
      >
        <StatCard icon="star-outline" label="Rating" value={rating.toFixed(1)} />
        <StatCard icon="calendar-outline" label="Joined" value={joinedYear} />
      </View>

      {/* ---------- PROFILE SECTION ---------- */}
      <View style={{ marginTop: 35, paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: fontSizes.FONT18,
            fontFamily: "TT-Octosquares-Medium",
            color: color.primaryText,
            marginBottom: 12,
          }}
        >
          Profile & Vehicle
        </Text>

        <SectionLink
          title="Profile Information"
          path="/(routes)/profile/basic-details"
          icon={<Ionicons name="person-outline" size={20} color={color.primaryGray} />}
        />
        <SectionLink
          title="Documents"
          path="/(routes)/profile/document-details"
          icon={<MaterialIcons name="article" size={20} color={color.primaryGray} />}
        />
        <SectionLink
          title="Vehicle Details"
          path="/(routes)/profile/vehicle-details"
          icon={<Ionicons name="car-outline" size={20} color={color.primaryGray} />}
        />
        <SectionLink
          title="Address Details"
          path="/(routes)/profile/address-details"
          icon={<Ionicons name="home-outline" size={20} color={color.primaryGray} />}
        />
        <SectionLink
          title="Fare Details"
          path="/(routes)/profile/fare-details"
          icon={<Ionicons name="cash-outline" size={20} color={color.primaryGray} />}
        />
        <SectionLink
          title="Wallet and Histories"
          path="/(routes)/profile/wallet-details"
          icon={<Ionicons name="wallet-outline" size={20} color={color.primaryGray} />}
        />
        <SectionLink
          title="Your Earnings"
          path="/(routes)/profile/earnings-details"
          icon={<Ionicons name="cash-outline" size={20} color={color.primaryGray} />}
        />
      </View>

      {/* ---------- SUPPORT SECTION ---------- */}
      <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: fontSizes.FONT18,
            fontFamily: "TT-Octosquares-Medium",
            color: color.primaryText,
            marginBottom: 12,
          }}
        >
          Support & Assistance
        </Text>

        <SectionLink
          title="Help & Support"
          path="/(routes)/profile/help-support"
          icon={<Feather name="help-circle" size={20} color={color.primaryGray} />}
        />
        <SectionLink
          title="Raise a Complaint"
          path="/(routes)/profile/complaints"
          icon={<MaterialIcons name="report-problem" size={20} color={color.primaryGray} />}
        />
      </View>

      {/* ---------- APP INFO SECTION ---------- */}
      <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: fontSizes.FONT18,
            fontFamily: "TT-Octosquares-Medium",
            color: color.primaryText,
            marginBottom: 12,
          }}
        >
          App Information
        </Text>

        <SectionLink
          title="Legal & Policies"
          path="/(routes)/legal"
          icon={<Ionicons name="document-text-outline" size={20} color={color.primaryGray} />}
        />
      </View>

      {/* ---------- LOGOUT ---------- */}
      <TouchableOpacity
        disabled={isLoggingOut}
        onPress={async () => {
          const confirmed = await confirmLogout();
          if (!confirmed) return;

          await logout(driver?.id, "LoggedOut Successfully", setIsLoggingOut);
        }}
        style={{
          marginHorizontal: 20,
          marginTop: 40,
          backgroundColor: color.buttonBg,
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: color.primary,
            fontSize: fontSizes.FONT16,
            fontFamily: "TT-Octosquares-Medium",
          }}
        >
          {isLoggingOut ? <ActivityIndicator color={color.primary} /> : "Log Out"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 60 }} />
      <AppAlert
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        showCancel={alertConfig.showCancel}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />
    </ScrollView>
  );
}

/* ---------- STAT CARD ---------- */
const StatCard = ({ icon, label, value }) => (
  <View style={{ alignItems: "center" }}>
    <Ionicons name={icon} size={24} color={color.primaryGray} />
    <Text
      style={{
        fontSize: fontSizes.FONT18,
        color: color.primaryText,
        fontFamily: "TT-Octosquares-Medium",
        marginTop: 5,
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        fontSize: fontSizes.FONT13,
        color: "#999",
        fontFamily: "TT-Octosquares-Medium",
      }}
    >
      {label}
    </Text>
  </View>
);
