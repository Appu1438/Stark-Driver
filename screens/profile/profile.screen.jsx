import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { useGetDriverData, useGetDriverWallet } from "@/hooks/useGetDriverData";
import { router } from "expo-router";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import color from "@/themes/app.colors";
import { fontSizes, windowWidth } from "@/themes/app.constant";
import { getAvatar } from "@/utils/avatar/getAvatar";
import { logout } from "@/api/apis";
import DriverProfileSkeleton from "./profile-skelton.screen";
import AppAlert from "@/components/modal/alert-modal/alert.modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
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
        title: "Log Out?",
        message: "Are you sure you want to sign out of your account?",
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

  // --- REUSABLE COMPONENT: MENU ITEM ---
  const SectionLink = ({ title, path, icon, isLast }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: path,
          params: { ...driver, activeDevice: JSON.stringify(driver?.activeDevice) },
        })
      }
      style={[styles.menuItem, isLast && styles.menuItemLast]}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* BACKGROUND GRADIENT */}
      <LinearGradient
        colors={[color.subPrimary, color.subPrimary]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={color.primary}
            progressViewOffset={40}
          />
        }
      >
        {/* ---------- HEADER PROFILE ---------- */}
        <View style={styles.headerContainer}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: driver?.profilePic || getAvatar(driver?.gender) }}
                style={styles.avatarImage}
              />
              <View style={[styles.activeBadge,
              driver.status == 'inactive' && { backgroundColor: '#FF3B30' }
              ]}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{driver?.name}</Text>
              <Text style={styles.profileEmail}>{driver?.email}</Text>
              <View style={styles.tagRow}>
                <View style={styles.proTag}>
                  <Text style={styles.proTagText}>DRIVER PARTNER</Text>
                </View>
              </View>
            </View>
          </View>


          {/* QUICK STATS ROW */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconBox}>
                <Ionicons name="star" size={14} color="#FFD700" />
              </View>
              <Text style={styles.statValue}>{rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statItem}>
              <View style={[styles.statIconBox, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                <Ionicons name="calendar" size={14} color="#fff" />
              </View>
              <Text style={styles.statValue}>{joinedYear}</Text>
              <Text style={styles.statLabel}>Joined</Text>
            </View>
          </View>
        </View>

        {/* ---------- WALLET CARD ---------- */}
        <LinearGradient
          colors={['#1F222B', '#15171E']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.walletCard}
        >
          <View style={styles.walletTop}>
            <View>
              <Text style={styles.walletLabel}>Total Balance</Text>
              <Text style={styles.walletAmount}>₹{wallet?.balance || "0.00"}</Text>
            </View>
            <View style={styles.walletIconBg}>
              <Ionicons name="wallet" size={24} color={color.primaryGray} />
            </View>
          </View>

          <View style={styles.walletDivider} />

          <TouchableOpacity
            style={styles.addMoneyBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/(routes)/payment')}
          >
            <Text style={styles.addMoneyText}>Add Money to Wallet</Text>
            <Ionicons name="arrow-forward" size={18} color={color.primaryText} />
          </TouchableOpacity>
        </LinearGradient>

        {/* LOW BALANCE ALERT */}
        {wallet?.balance !== undefined && wallet.balance < 250 && (
          <View style={styles.warningCard}>
            <Ionicons name="warning" size={22} color="#FF9800" />
            <Text style={styles.warningText}>
              Low Balance! Recharge now to accept rides.
            </Text>
          </View>
        )}

        {/* ---------- MENU SECTIONS ---------- */}

        {/* GROUP 1: ESSENTIALS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account & Vehicle</Text>
        </View>
        <View style={styles.menuContainer}>
          <SectionLink
            title="Profile Information"
            path="/(routes)/profile/basic-details"
            icon={<Ionicons name="person" size={18} color={color.primaryText} />}
          />
          <SectionLink
            title="Documents"
            path="/(routes)/profile/document-details"
            icon={<MaterialIcons name="article" size={18} color="#4A90E2" />}
          />
          <SectionLink
            title="Vehicle Details"
            path="/(routes)/profile/vehicle-details"
            icon={<Ionicons name="car-sport" size={18} color="#FF5252" />}
            isLast
          />
        </View>

        {/* GROUP 2: FINANCIALS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Financials</Text>
        </View>
        <View style={styles.menuContainer}>
          <SectionLink
            title="Earnings"
            path="/(routes)/profile/earnings-details"
            icon={<Ionicons name="bar-chart" size={18} color="#00E676" />}
          />
          <SectionLink
            title="Fare & Rates"
            path="/(routes)/profile/fare-details"
            icon={<Ionicons name="pricetag" size={18} color="#E040FB" />}
          />
          <SectionLink
            title="Transaction History"
            path="/(routes)/profile/wallet-details"
            icon={<Ionicons name="time" size={18} color="#FFAB00" />}
            isLast
          />
        </View>

        {/* GROUP 3: SUPPORT & LEGAL */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Support</Text>
        </View>
        <View style={styles.menuContainer}>
          <SectionLink
            title="Help & Support"
            path="/(routes)/profile/help-support"
            icon={<Feather name="headphones" size={18} color="#00B0FF" />}
          />
          <SectionLink
            title="Register Complaint"
            path="/(routes)/profile/complaints"
            icon={<MaterialIcons name="report-problem" size={18} color="#00B0FF" />} />
          <SectionLink
            title="Legal & Policies"
            path="/(routes)/legal"
            icon={<Ionicons name="shield-checkmark" size={18} color="#9E9E9E" />}
            isLast
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
          style={styles.logoutButton}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#FF3B30" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color="#FF3B30" style={{ marginRight: 8 }} />
              <Text style={styles.logoutText}>Log Out</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.versionText}>
          v{Constants.expoConfig?.version} • {Constants.expoConfig?.name || "Stark Driver App"}
        </Text>

      </ScrollView>

      <AppAlert
        visible={showAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        showCancel={alertConfig.showCancel}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#050505",
  },

  // Header
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 80,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatarImage: {
    width: 75,
    height: 75,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    backgroundColor: '#00E676',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#121212',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    color: '#fff',
    fontFamily: 'TT-Octosquares-Medium',
    letterSpacing: 0.5,
  },
  profileEmail: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'TT-Octosquares-Medium',
    marginTop: 2,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
  },
  proTag: {
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 224, 255, 0.3)',
  },
  proTagText: {
    fontSize: 10,
    color: color.primaryGray,
    fontFamily: 'TT-Octosquares-Medium',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'TT-Octosquares-Medium',
  },
  statLabel: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
    fontFamily: 'TT-Octosquares-Medium',

  },
  verticalDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    height: '80%',
    alignSelf: 'center',
  },

  // Wallet
  walletCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  walletTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'TT-Octosquares-Medium',

    marginBottom: 5,
  },
  walletAmount: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'TT-Octosquares-Medium',
  },
  walletIconBg: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 15,
  },
  addMoneyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addMoneyText: {
    color: color.primaryText,
    fontFamily: 'TT-Octosquares-Medium',
    fontSize: 14,
  },

  // Warning
  warningCard: {
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningText: {
    color: '#FF9800',
    fontSize: 13,
    fontFamily: 'TT-Octosquares-Medium',
    flex: 1,
  },

  // Sections
  sectionHeader: {
    marginTop: 25,
    marginBottom: 10,
    paddingHorizontal: 25,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 13,
    fontFamily: 'TT-Octosquares-Medium',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'transparent',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    color: '#eee',
    fontSize: 15,
    fontFamily: 'TT-Octosquares-Medium',
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontFamily: 'TT-Octosquares-Medium',
  },
  versionText: {
    textAlign: 'center',
    color: '#444',
    fontSize: 11,
    marginTop: 20,
    fontFamily: 'TT-Octosquares-Medium',
  },
});