import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import React from "react";
import { fontSizes } from "@/themes/app.constant";
import color from "@/themes/app.colors";
import FooterNote from "@/components/common/footer-note";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsConditions() {
    return (
        <View style={styles.mainContainer}>
            <LinearGradient colors={[color.bgDark, color.subPrimary]} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* HEADER */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.pageTitle}>Terms & Conditions</Text>
                    </View>

                    {/* CONTENT CARD */}
                    <View style={styles.contentCard}>
                        <Section
                            title="1. Introduction"
                            content={`Welcome to Stark Driver Platform. By registering and using the App as a driver, you agree to comply with these Terms & Conditions. These terms form a legally binding agreement between you and Stark OPC Pvt. Ltd.`}
                        />

                        <Section
                            title="2. Driver Eligibility"
                            content={`To use the App, drivers must hold a valid driving license, vehicle registration certificate, and comply with all applicable transportation laws. All personal and vehicle details provided must be accurate, current, and verifiable.`}
                        />

                        <Section
                            title="3. Platform Role"
                            content={`Stark operates as a technology platform connecting drivers with riders seeking transport. The Company does not own vehicles, employ drivers, or directly provide transportation services. Drivers are independent service providers responsible for their conduct and compliance with laws.`}
                        />

                        <Section
                            title="4. Account Responsibility"
                            content={`Drivers are responsible for maintaining the confidentiality of their login credentials. Any misuse, fraudulent activity, or account sharing is strictly prohibited and may lead to account suspension or termination.`}
                        />

                        <Section
                            title="5. Trip Acceptance & Cancellation"
                            content={`• Drivers may accept or reject ride requests based on availability, but consistent refusal of rides may impact account performance.\n• Cancellations should only be made for genuine reasons.\n• Drivers must never request riders to cancel the ride for direct payment outside the app. Such behavior will result in immediate deactivation.`}
                        />

                        <Section
                            title="6. Payments & Earnings"
                            content={`• Riders can pay drivers directly via cash or online methods upon ride completion.\n• The Company does not collect or hold rider payments on behalf of drivers.\n• Each driver maintains an in-app wallet used for platform service charges, commissions, or ride-related deductions.\n• A fixed percentage or fee is automatically deducted from the driver’s wallet for every trip.\n• Drivers are responsible for ensuring they have sufficient wallet balance before accepting rides.\n• If the wallet balance falls below the minimum required limit, the driver may not be able to accept new rides until recharged.`}
                        />

                        <Section
                            title="7. Additional Charges (Tolls, Parking & Waiting Time)"
                            content={`• Drivers are required to collect any toll charges, parking fees, state entry taxes, or government-imposed fees directly from the rider.\n• These charges are not included in the estimated fare shown in the App and must be paid by the rider whenever applicable.\n• For round trips or scenarios where the rider requests waiting time, drivers may charge an additional waiting fee based on the time spent.\n• Drivers must inform riders politely before applying waiting charges or any additional extra fees.\n• The Company is not responsible for disputes related to tolls, parking, or waiting charges. Drivers are responsible for ensuring clear communication with the rider.`}
                        />

                        <Section
                            title="8. Safety & Conduct"
                            content={`Drivers must:\n• Drive responsibly and follow all local traffic rules.\n• Ensure their vehicle is clean, well-maintained, and roadworthy.\n• Treat riders with respect and maintain professional behavior.\n• Avoid harassment, discrimination, or inappropriate communication at all times.`}
                        />

                        <Section
                            title="9. Use of the App"
                            content={`The App must be used only for lawful purposes. Manipulation of GPS, fake location usage, or any software tampering will result in permanent account suspension and possible legal action.`}
                        />

                        <Section
                            title="10. Ratings & Feedback"
                            content={`Both riders and drivers can rate each other after every trip. Feedback helps maintain quality standards. Misuse of the rating system or attempts to unfairly influence ratings are not permitted.`}
                        />

                        <Section
                            title="11. Data & Privacy"
                            content={`We collect necessary driver and vehicle information, including location data, to ensure safe and efficient operations. This data is stored securely and not shared with third parties unless required by law or for platform operations.`}
                        />

                        <Section
                            title="12. Vehicle & Document Verification"
                            content={`Drivers must maintain valid and up-to-date documents, including license, insurance, and vehicle fitness certificate. Expired or invalid documents will automatically restrict access to driver features until renewed.`}
                        />

                        <Section
                            title="13. Suspension & Termination"
                            content={`The Company reserves the right to suspend or permanently terminate accounts for:\n• Repeated ride cancellations or poor ratings.\n• Fraudulent activities, fake trips, or off-app payments.\n• Violations of these Terms or company policies.\n• Misconduct or unsafe driving.`}
                        />

                        <Section
                            title="14. Liability Limitation"
                            content={`The Company provides the App as a connecting platform and is not liable for accidents, delays, damages, or losses arising from driver actions or third-party causes. Drivers are solely responsible for vehicle and passenger safety during trips.`}
                        />

                        <Section
                            title="15. Policy Updates"
                            content={`These Terms & Conditions may be updated periodically to align with new regulations or operational changes. Continued use of the App implies acceptance of the latest version.`}
                        />

                        <Section
                            title="16. Support & Queries"
                            content={`For any queries, complaints, or clarifications, please contact support through the in-app “Help & Support” section.`}
                        />
                    </View>

                    <FooterNote />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

/* ---------- SECTION COMPONENT ---------- */
const Section = ({ title, content }) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionContent}>{content}</Text>
    </View>
);

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: "#050505" },
    scrollContent: { padding: 20, paddingBottom: 50 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, gap: 15 },
    backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    pageTitle: { fontSize: fontSizes.FONT20, color: "#fff", fontFamily: "TT-Octosquares-Medium" },

    // Content Card
    contentCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 30,
    },

    // Section Styles
    sectionContainer: { marginBottom: 25 },
    sectionTitle: {
        fontSize: fontSizes.FONT16,
        fontFamily: "TT-Octosquares-Medium",
        color: color.primaryText, // Using primary color for headers to make scanning easier
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionContent: {
        fontSize: fontSizes.FONT14,
        lineHeight: 24,
        color: '#ccc', // Slightly softer white for body text
        fontFamily: "TT-Octosquares-Medium",
        textAlign: 'justify',
    },
});