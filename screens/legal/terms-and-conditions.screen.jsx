import { View, Text, ScrollView } from "react-native";
import React from "react";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import color from "@/themes/app.colors";

export default function TermsConditions() {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
                flex: 1,
                backgroundColor: color.background,
                paddingHorizontal: windowWidth(20),
                paddingTop: windowHeight(40),
                paddingBottom: windowHeight(50),
            }}
        >
            <Text
                style={{
                    fontSize: fontSizes.FONT26,
                    fontFamily: "TT-Octosquares-Medium",
                    color: color.primaryText,
                    marginBottom: 25,
                    textAlign: "center",
                }}
            >
                Terms & Conditions (Driver)
            </Text>

            <Section
                title="1. Introduction"
                content={`Welcome to Stark Driver Platform (“Stark-Driver”). By registering and using the App as a driver, you agree to comply with these Terms & Conditions. These terms form a legally binding agreement between you and Stark OPC Pvt. Ltd.`}
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
                content={`• Drivers may accept or reject ride requests based on availability, but consistent refusal of rides may impact account performance.  
• Cancellations should only be made for genuine reasons.  
• Drivers must **never request riders to cancel** the ride for direct payment outside the app. Such behavior will result in immediate deactivation.`}
            />

            <Section
                title="6. Payments & Earnings"
                content={`• Riders can pay drivers directly via **cash or online methods** (such as UPI, wallet, or digital transfer) upon ride completion.  
• The Company does not collect or hold rider payments on behalf of drivers.  
• Each driver maintains an **in-app wallet** used for platform service charges, commissions, or ride-related deductions.  
• A fixed percentage or fee is automatically deducted from the driver’s wallet for every trip.  
• Drivers are responsible for ensuring they have sufficient wallet balance before accepting rides.  
• If the wallet balance falls below the minimum required limit, the driver may not be able to accept new rides until recharged.  
• Wallet recharges can be made anytime using the available online payment options within the app.`}
            />


            <Section
                title="7. Safety & Conduct"
                content={`Drivers must:  
• Drive responsibly and follow all local traffic rules.  
• Ensure their vehicle is clean, well-maintained, and roadworthy.  
• Treat riders with respect and maintain professional behavior.  
• Avoid harassment, discrimination, or inappropriate communication at all times.`}
            />

            <Section
                title="8. Use of the App"
                content={`The App must be used only for lawful purposes. Manipulation of GPS, fake location usage, or any software tampering will result in permanent account suspension and possible legal action.`}
            />

            <Section
                title="9. Ratings & Feedback"
                content={`Both riders and drivers can rate each other after every trip. Feedback helps maintain quality standards. Misuse of the rating system or attempts to unfairly influence ratings are not permitted.`}
            />

            <Section
                title="10. Data & Privacy"
                content={`We collect necessary driver and vehicle information, including location data, to ensure safe and efficient operations. This data is stored securely and not shared with third parties unless required by law or for platform operations.`}
            />

            <Section
                title="11. Vehicle & Document Verification"
                content={`Drivers must maintain valid and up-to-date documents, including license, insurance, and vehicle fitness certificate. Expired or invalid documents will automatically restrict access to driver features until renewed.`}
            />

            <Section
                title="12. Suspension & Termination"
                content={`The Company reserves the right to suspend or permanently terminate accounts for:  
• Repeated ride cancellations or poor ratings.  
• Fraudulent activities, fake trips, or off-app payments.  
• Violations of these Terms or company policies.  
• Misconduct or unsafe driving.`}
            />

            <Section
                title="13. Liability Limitation"
                content={`The Company provides the App as a connecting platform and is not liable for accidents, delays, damages, or losses arising from driver actions or third-party causes. Drivers are solely responsible for vehicle and passenger safety during trips.`}
            />

            <Section
                title="14. Policy Updates"
                content={`These Terms & Conditions may be updated periodically to align with new regulations or operational changes. Continued use of the App implies acceptance of the latest version.`}
            />

            <Section
                title="15. Support & Queries"
                content={`For any queries, complaints, or clarifications, please contact support through the in-app “Help & Support” section.`}
            />

            <Text
                style={{
                    fontSize: fontSizes.FONT14,
                    color: "#999",
                    textAlign: "center",
                    marginTop: 20,
                    fontFamily: "TT-Octosquares-Medium",
                    marginBottom: 25,
                }}
            >
                © {new Date().getFullYear()} Stark OPC Pvt. Ltd. All rights reserved.
            </Text>
        </ScrollView>
    );
}

/* ---------- SECTION COMPONENT ---------- */
const Section = ({ title, content }) => (
    <View style={{ marginBottom: 25 }}>
        <Text
            style={{
                fontSize: fontSizes.FONT18,
                fontFamily: "TT-Octosquares-Medium",
                color: color.primaryText,
                marginBottom: 6,
            }}
        >
            {title}
        </Text>
        <Text
            style={{
                fontSize: fontSizes.FONT15,
                lineHeight: 24,
                color: color.primaryText,
                fontFamily: "TT-Octosquares-Medium",
                opacity: 0.9,
            }}
        >
            {content}
        </Text>
    </View>
);
