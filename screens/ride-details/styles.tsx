import color from "@/themes/app.colors";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import { StyleSheet, Platform } from "react-native";

// --- Design System Constants (Adjusted for Driver Focus) ---
const PRIMARY_COLOR = color.buttonBg; // Your main brand color
const SECONDARY_TEXT = '#5F6368'; // Muted text for labels
const HEADING_TEXT = '#202124'; // Dark text for titles and values
const CARD_BG = '#F7F8FA'; // Subtle background for card elements
const SEPARATOR_COLOR = '#EAEAEA'; // Light divider color
const FONT_MEDIUM = 'TT-Octosquares-Medium'; // Assuming this is your medium/semibold font
const FONT_REGULAR = 'TT-Octosquares-Medium'; // Assuming you have a regular weight

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CARD_BG, // Use a light background for the whole page
  },

  centered: {
    flex: 1,
    justifyContent: "center",  // centers vertically
    alignItems: "center",       // centers horizontally
  },
  loadingText: {
    color: 'grey',
    fontSize: 18,
    fontFamily: 'TT-Octosquares-Medium',  // 👈 custom font
    textAlign: "center",
    letterSpacing: 1,                     // makes it more clean
  },
  // --- Map Section ---
  mapContainer: {
    // Make map slightly taller for better driving context
    height: windowHeight(450),
    overflow: 'visible', // Remove overflow to allow the card to overlap cleanly
    // Removed border radius here, let the card overlay handle the curve
  },
  map: {
    flex: 1,
  },

  // --- Details Card (The Bottom Sheet) ---
  cardContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30, // Larger, smoother curve
    borderTopRightRadius: 30,
    marginTop: -50, // More aggressive overlap for a modern look
    paddingHorizontal: windowWidth(24), // Increased horizontal padding
    paddingTop: 16,

    // Elevated shadow for a floating card effect
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 15,
      }
    })
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 8, // Added small padding at the top of the scroll area
  },

  // --- Status Indicator (Header) ---
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the status for better prominence
    paddingVertical: 12,
    marginBottom: 20,
    backgroundColor: CARD_BG, // Use a contrasting background for the status bar
    borderRadius: 12,
  },
  statusDot: {
    width: 12, // Slightly larger dot
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: fontSizes.FONT16,
    fontFamily: FONT_MEDIUM,
    color: HEADING_TEXT,
    fontWeight: '600', // Ensure status text is strong
  },

  // --- Section Styling (General) ---
  section: {
    paddingVertical: 12,
    borderBottomWidth: 1, // Use a clean line to separate sections
    borderBottomColor: SEPARATOR_COLOR,
    marginBottom: 0, // Removed bottom margin, separation is via the border
  },
  sectionTitle: {
    fontSize: fontSizes.FONT12,
    fontFamily: FONT_MEDIUM,
    color: SECONDARY_TEXT,
    marginBottom: 10, // Reduced space after title
    textTransform: 'uppercase',
    letterSpacing: 1, // Increased letter spacing for labels
  },

  // --- Passenger Info ---
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  // avatar: {
  //   width: 50, // Slightly larger avatar
  //   height: 50,
  //   borderRadius: 25,
  //   // backgroundColor: PRIMARY_COLOR,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginRight: 16,
  // },
  passengerDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passengerName: {
    fontSize: fontSizes.FONT17,
    fontFamily: FONT_MEDIUM,
    color: HEADING_TEXT,
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20, // Pill shape
    alignItems: 'center',
  },
  callButtonText: {
    color: 'white',
    fontSize: fontSizes.FONT13,
    fontFamily: FONT_MEDIUM,
    marginLeft: 6,
  },

  // --- Navigation Buttons ---
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 4,
    justifyContent: 'space-around'
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14, // Increased vertical padding
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    // Small lift for primary actions
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  navButtonText: {
    color: 'white',
    fontSize: fontSizes.FONT15,
    fontFamily: FONT_MEDIUM,
    marginLeft: 8,
  },

  // --- Trip Details ---
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center', // Align items to center
    marginBottom: 18, // Consistent vertical space
    paddingHorizontal: 8, // slight padding for inner card feel
  },
  detailTextContainer: {
    flex: 1,
    marginLeft: 18,
    paddingVertical: 4, // Added small padding for internal spacing
  },
  detailLabel: {
    fontSize: fontSizes.FONT12,
    color: SECONDARY_TEXT,
    marginBottom: 2,
    fontFamily: FONT_REGULAR, // Regular weight for labels
  },
  detailText: {
    fontSize: fontSizes.FONT15,
    color: HEADING_TEXT,
    fontFamily: FONT_MEDIUM, // Medium weight for content
  },

  // --- Fare Breakdown (Use a separate card background) ---
  fareContainer: {
    padding: 16,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    marginTop: 12, // Space it out from the previous section
    marginBottom: 24, // Consistent spacing at the end of the scrollable area
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fareLabel: {
    fontSize: fontSizes.FONT14,
    color: SECONDARY_TEXT,
    fontFamily: FONT_REGULAR,
  },
  fareValue: {
    fontSize: fontSizes.FONT15,
    color: HEADING_TEXT,
    fontFamily: FONT_MEDIUM,
  },

  // --- Action Button (Bottom Fixed Area) ---
  actionButtonContainer: {
    paddingHorizontal: windowWidth(24),
    paddingBottom: 30, // Increased bottom padding for safety area
    paddingTop: 16,
    backgroundColor: 'white', // Ensure it stands out on white background
    borderTopWidth: 1,
    borderTopColor: SEPARATOR_COLOR,
  },

  // --- Modal Styles ---
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%", // Slightly wider box
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 35, // More vertical padding
    paddingHorizontal: 25,
    alignItems: "center",
    elevation: 12,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontFamily: FONT_MEDIUM,
    fontSize: fontSizes.FONT17,
    color: HEADING_TEXT,
    marginBottom: 8,
  },
  input: {
    fontFamily: FONT_MEDIUM,
    width: "70%",
    height: 52, // Taller input field
    borderWidth: 2,
    borderColor: PRIMARY_COLOR, // Primary color border
    borderRadius: 12,
    marginTop: 18,
    marginBottom: 25,
    textAlign: "center",
    fontSize: fontSizes.FONT20, // Larger font for OTP
    letterSpacing: 10,
    fontWeight: "700",
    color: PRIMARY_COLOR, // OTP text color
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  // Ensure your Button component respects these styles for proper alignment
});

export { styles };