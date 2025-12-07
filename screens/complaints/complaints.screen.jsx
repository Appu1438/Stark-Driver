import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSizes } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import Button from "@/components/common/button";
import axiosInstance from "@/api/axiosInstance";
import ComplaintSkeleton from "./complaints-skelton.screen";
import { useGetDriverRideHistories } from "@/hooks/useGetDriverData";
import AppAlert from "@/components/modal/alert-modal/alert.modal";
import { router } from "expo-router";

export default function DriverComplaints() {
  const { recentRides } = useGetDriverRideHistories();
  const [selectedRide, setSelectedRide] = useState(null);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [rideModalVisible, setRideModalVisible] = useState(false);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "", message: "", confirmText: "OK", showCancel: false,
    onConfirm: () => setShowAlert(false),
    onCancel: () => setShowAlert(false),
  });

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      setLoadingComplaints(true);
      const res = await axiosInstance.get("/complaints/driver");
      setComplaints(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComplaints(false);
    }
  };

  const showInfo = (title, message) => {
    setAlertConfig({ title, message, confirmText: "OK", showCancel: false, onConfirm: () => setShowAlert(false) });
    setShowAlert(true);
  };

  const handleSubmit = async () => {
    if (!category || !message.trim()) {
      showInfo("Missing Details", "Please select a category and describe the issue.");
      return;
    }

    setAlertConfig({
      title: "Submit Report?",
      message: "Are you sure you want to submit this complaint?",
      confirmText: "Submit",
      showCancel: true,
      onCancel: () => setShowAlert(false),
      onConfirm: async () => {
        setShowAlert(false);
        try {
          setSubmitting(true);
          const payload = { category, message: message.trim() };
          if (selectedRide?.id) payload.rideId = selectedRide.id;

          const res = await axiosInstance.post("/complaints/driver", payload);
          if (res?.data?.data) {
            setComplaints((prev) => [res.data.data, ...prev]);
            setSelectedRide(null); setCategory(""); setMessage("");
            showInfo("Success", "Complaint submitted successfully.");
          }
        } catch (err) {
          showInfo("Error", "Failed to submit complaint.");
        } finally {
          setSubmitting(false);
        }
      },
    });
    setShowAlert(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "#00E676";
      case "In Review": return "#29B6F6";
      case "Rejected": return "#FF5252";
      default: return "#FFAB00"; // Pending
    }
  };

  if (loadingComplaints) return <ComplaintSkeleton />;

  return (
    <View style={styles.mainContainer}>
      <LinearGradient colors={[color.bgDark, color.subPrimary]} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {/* HEADER */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.pageTitle}>Support & Issues</Text>
            </View>

            {/* FORM CARD */}
            <View style={styles.formCard}>
              <Text style={styles.cardTitle}>Report an Issue</Text>

              {/* RIDE SELECTOR */}
              <TouchableOpacity
                onPress={() => setRideModalVisible(true)}
                style={styles.inputField}
              >
                <Text style={[styles.inputText, !selectedRide && { color: '#666' }]}>
                  {selectedRide
                    ? `${selectedRide.currentLocationName} → ${selectedRide.destinationLocationName}`
                    : "Select Related Ride (Optional)"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>

              {/* CATEGORY CHIPS */}
              <Text style={styles.label}>Issue Type</Text>
              <View style={styles.chipContainer}>
                {["Ride Issue", "Payment Issue", "Customer Behaviour", "App Issue", "Other"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setCategory(item)}
                    style={[styles.chip, category === item && styles.activeChip]}
                  >
                    <Text style={[styles.chipText, category === item && styles.activeChipText]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* MESSAGE INPUT */}
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe what happened..."
                placeholderTextColor="#666"
                multiline
                value={message}
                onChangeText={setMessage}
              />

              {/* SUBMIT BUTTON */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>Submit Report</Text>}
              </TouchableOpacity>
            </View>

            {/* HISTORY SECTION */}
            <Text style={styles.sectionTitle}>Previous Reports</Text>

            {complaints.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="inbox" size={40} color="#333" />
                <Text style={styles.emptyText}>No reports found</Text>
              </View>
            ) : (
              <FlatList
                data={complaints}
                keyExtractor={(item) => item._id || item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.complaintItem}>
                    <View style={styles.complaintHeader}>
                      <Text style={styles.complaintCategory}>{item.category}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status || "Pending"}</Text>
                      </View>
                    </View>

                    <Text style={styles.complaintMessage} numberOfLines={2}>{item.message}</Text>

                    {item.ride &&
                      <View style={styles.modalRow}>
                        <Text style={styles.modalLoc} numberOfLines={1}>{item.ride.currentLocationName}</Text>
                        <Ionicons name="arrow-forward" size={14} color="#666" />
                        <Text style={styles.modalLoc} numberOfLines={1}>{item.ride.destinationLocationName}</Text>
                      </View>
                    }

                    <View style={styles.complaintFooter}>
                      <Text style={styles.complaintDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                  </View>
                )}
              />
            )}

          </ScrollView>
        </KeyboardAvoidingView>

        {/* RIDE MODAL */}
        <Modal visible={rideModalVisible} transparent animationType="fade" onRequestClose={() => setRideModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Recent Ride</Text>
                <TouchableOpacity onPress={() => setRideModalVisible(false)}><Ionicons name="close" size={24} color="#fff" /></TouchableOpacity>
              </View>
              <FlatList
                data={recentRides}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => { setSelectedRide(item); setRideModalVisible(false); }}
                  >
                    <View style={styles.modalRow}>
                      <Text style={styles.modalLoc} numberOfLines={1}>{item.currentLocationName}</Text>
                      <Ionicons name="arrow-forward" size={14} color="#666" />
                      <Text style={styles.modalLoc} numberOfLines={1}>{item.destinationLocationName}</Text>
                    </View>
                    <Text style={styles.modalSub}>₹{item.totalFare} • {new Date(item.createdAt).toLocaleDateString()}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No recent rides found.</Text>}
              />
            </View>
          </View>
        </Modal>

        <AppAlert
          visible={showAlert}
          title={alertConfig.title}
          message={alertConfig.message}
          confirmText={alertConfig.confirmText}
          showCancel={alertConfig.showCancel}
          onConfirm={alertConfig.onConfirm}
          onCancel={alertConfig.onCancel}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#050505" },
  scrollContent: { padding: 20, paddingBottom: 50 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, gap: 15 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  pageTitle: { fontSize: 24, color: "#fff", fontFamily: "TT-Octosquares-Medium" },

  // Form Card
  formCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 30 },
  cardTitle: { fontSize: 18, color: '#fff', fontFamily: "TT-Octosquares-Medium", marginBottom: 20 },

  label: { fontSize: 12, color: '#888', marginBottom: 10, marginTop: 15, fontFamily: "TT-Octosquares-Medium" },

  inputField: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  inputText: { color: '#fff', fontSize: 14, fontFamily: "TT-Octosquares-Medium", flex: 1 },

  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'transparent' },
  activeChip: { backgroundColor: color.buttonBg, borderColor: color.primary },
  chipText: { color: '#888', fontSize: 12, fontFamily: "TT-Octosquares-Medium" },
  activeChipText: { color: color.primary },

  textArea: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 15, minHeight: 120, color: '#fff', textAlignVertical: 'top', fontFamily: "TT-Octosquares-Medium" },

  submitButton: { backgroundColor: color.buttonBg, paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 25 },
  submitText: { color: '#000', fontSize: 16, fontFamily: "TT-Octosquares-Medium" },

  // History List
  sectionTitle: { fontSize: 18, color: '#fff', fontFamily: "TT-Octosquares-Medium", marginBottom: 15 },
  complaintItem: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  complaintHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  complaintCategory: { color: '#fff', fontSize: 14, fontFamily: "TT-Octosquares-Medium" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontFamily: "TT-Octosquares-Medium" },
  complaintMessage: { color: color.primaryGray, fontSize: 13, lineHeight: 18, marginBottom: 10, fontFamily: "TT-Octosquares-Medium" },
  complaintFooter: { flexDirection: 'row', alignItems: 'center', gap: 10, fontFamily: "TT-Octosquares-Medium" },
  complaintDate: { color: color.primaryGray, fontSize: 11, fontFamily: "TT-Octosquares-Medium" },
  rideTag: { color: color.primaryText, fontSize: 11, fontFamily: "TT-Octosquares-Medium" },

  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#444', marginTop: 10, fontFamily: "TT-Octosquares-Medium" },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#151515', borderRadius: 20, padding: 20, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  modalTitle: { color: '#fff', fontSize: 18, fontFamily: "TT-Octosquares-Medium" },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  modalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  modalLoc: { color: '#fff', fontSize: 14, flex: 1, fontFamily: "TT-Octosquares-Medium" },
  modalSub: { color: '#666', fontSize: 12, fontFamily: "TT-Octosquares-Medium" },
});