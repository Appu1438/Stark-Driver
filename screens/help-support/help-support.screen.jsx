import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import color from "@/themes/app.colors";
import { fontSizes, windowWidth } from "@/themes/app.constant";
import HelpAndSupportSkeleton from "./help-support-skelton.screen";
import FooterNote from "@/components/common/footer-note";
import { router } from "expo-router";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DriverHelpAndSupport() {
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === id ? null : id);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const faqData = [
    {
      id: 1,
      question: "How do I start receiving ride requests?",
      answer: "Ensure your status is set to 'Online' from the home screen. Once online, you’ll start receiving nearby ride requests automatically based on your location.",
      icon: "car-sport-outline"
    },
    {
      id: 2,
      question: "Payment not received for a ride?",
      answer: "If a customer didn’t pay, register a complaint in the 'Support' section with ride details. Our team will verify and resolve the issue within 24 hours.",
      icon: "wallet-outline"
    },
    {
      id: 3,
      question: "How to cancel a ride?",
      answer: "If the customer doesn’t arrive, use the 'Cancel Ride' option and select 'Rider no-show'. Repeated misuse may affect your reliability score.",
      icon: "close-circle-outline"
    },
    {
      id: 4,
      question: "Safety issues or abusive behavior?",
      answer: "Your safety comes first. End the trip immediately and tap the Shield icon for Emergency SOS. File a complaint under 'Customer Behavior'.",
      icon: "shield-checkmark-outline"
    },
    {
      id: 5,
      question: "Not getting any rides?",
      answer: "Check your GPS and internet connection. Try switching offline and online again. Ensure your vehicle documents are not expired.",
      icon: "refresh-circle-outline"
    },
    {
      id: 6,
      question: "Update vehicle or documents?",
      answer: "To update documents, go to Profile > Documents. For vehicle changes, please contact support verification.",
      icon: "document-text-outline"
    },
  ];

  // Filter FAQs based on search
  const filteredFaq = faqData.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCallSupport = () => Linking.openURL("tel:04772233377");
  const handleEmailSupport = () => Linking.openURL("mailto:starkopc@gmail.com");

  if (loading) return <HelpAndSupportSkeleton />;

  return (
    <View style={styles.mainContainer}>
      <LinearGradient colors={[color.bgDark ,color.subPrimary]} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* HEADER */}
          <View style={styles.header}>
             <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                 <Ionicons name="arrow-back" size={24} color="#fff" />
             </TouchableOpacity>
             <View>
                <Text style={styles.pageTitle}>Help Center</Text>
                <Text style={styles.pageSubtitle}>24/7 Driver Support</Text>
             </View>
          </View>

          {/* SEARCH BAR */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              placeholder="Search for issues..."
              placeholderTextColor="#666"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* QUICK ACTIONS CARD */}
          <LinearGradient
            colors={['#1F222B', '#15171E']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.contactCard}
          >
            <Text style={styles.contactTitle}>Need Urgent Help?</Text>
            <Text style={styles.contactSubtitle}>Our support team is available 24/7</Text>

            <View style={styles.contactRow}>
                <TouchableOpacity style={styles.contactButton} onPress={handleCallSupport}>
                    <View style={[styles.iconBox, {backgroundColor: 'rgba(0, 230, 118, 0.1)'}]}>
                        <Ionicons name="call" size={22} color="#00E676" />
                    </View>
                    <View>
                        <Text style={styles.buttonLabel}>Call Us</Text>
                        <Text style={styles.buttonSub}>0477-2233377</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.verticalDivider} />

                <TouchableOpacity style={styles.contactButton} onPress={handleEmailSupport}>
                    <View style={[styles.iconBox, {backgroundColor: 'rgba(41, 182, 246, 0.1)'}]}>
                        <Ionicons name="mail" size={22} color="#29B6F6" />
                    </View>
                    <View>
                        <Text style={styles.buttonLabel}>Email Us</Text>
                        <Text style={styles.buttonSub}>starkopc@...</Text>
                    </View>
                </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* FAQ SECTION */}
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          {filteredFaq.length === 0 ? (
             <View style={styles.emptyState}>
                 <Text style={styles.emptyText}>No results found</Text>
             </View>
          ) : (
             filteredFaq.map((faq) => (
                <TouchableOpacity
                  key={faq.id}
                  onPress={() => toggleExpand(faq.id)}
                  activeOpacity={0.9}
                  style={[styles.faqItem, expanded === faq.id && styles.faqItemActive]}
                >
                  <View style={styles.questionRow}>
                    <View style={styles.faqIconBox}>
                        <Ionicons name={faq.icon} size={18} color={expanded === faq.id ? color.primaryText : "#888"} />
                    </View>
                    <Text style={[styles.questionText, expanded === faq.id && {color: color.primaryText}]}>
                      {faq.question}
                    </Text>
                    <Ionicons
                      name={expanded === faq.id ? "remove" : "add"}
                      size={20}
                      color={expanded === faq.id ? color.primaryText : "#666"}
                    />
                  </View>
    
                  {expanded === faq.id && (
                    <View style={styles.answerContainer}>
                        <Text style={styles.answerText}>{faq.answer}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
          )}

          {/* FOOTER */}
          <View style={{marginTop: 10}}>
             <FooterNote />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#050505" },
  scrollContent: { padding: 20, paddingBottom: 0 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, gap: 15 },
  backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  pageTitle: { fontSize: 24, color: "#fff", fontFamily: "TT-Octosquares-Medium" },
  pageSubtitle: { fontSize: 13, color: "#888", fontFamily: "TT-Octosquares-Medium" },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  searchInput: { flex: 1, marginLeft: 10, color: '#fff', fontFamily: "TT-Octosquares-Medium" },

  // Contact Card
  contactCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  contactTitle: { fontSize: 18, color: '#fff', fontFamily: "TT-Octosquares-Medium", marginBottom: 4 },
  contactSubtitle: { fontSize: 12, color: '#888', marginBottom: 20 ,fontFamily: "TT-Octosquares-Medium"},
  contactRow: { flexDirection: 'row', justifyContent: 'space-between' },
  contactButton: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonLabel: { color: '#fff', fontFamily: "TT-Octosquares-Medium", fontSize: 13 },
  buttonSub: { color: '#666', fontSize: 10,fontFamily: "TT-Octosquares-Medium" },
  verticalDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 10 },

  // FAQ
  sectionTitle: { fontSize: 18, color: '#fff', fontFamily: "TT-Octosquares-Medium", marginBottom: 15 },
  faqItem: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden'
  },
  faqItemActive: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
    gap: 12
  },
  faqIconBox: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems:'center', justifyContent:'center'
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    color: '#eee',
    fontFamily: "TT-Octosquares-Medium",
    lineHeight: 20,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 60, // align with text
  },
  answerText: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "TT-Octosquares-Medium",
  },
  
  emptyState: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#666', fontFamily: "TT-Octosquares-Medium" }
});