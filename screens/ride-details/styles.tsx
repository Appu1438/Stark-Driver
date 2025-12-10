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
    backgroundColor: color.bgDark, // Use a light background for the whole page
    marginBottom: 25
  },

  centered: {
    flex: 1,
    justifyContent: "center",  // centers vertically
    alignItems: "center",       // centers horizontally
  },
  loadingText: {
    color: color.lightGray,
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
    backgroundColor: color.bgDark // Use a light background for the whole page

  },
  map: {
    flex: 1,
  },

  cardContainer: {
    flex: 1,
    marginTop: -75, // Pull up over map
    backgroundColor: color.subPrimary, // e.g. Very Light Gray or White
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
  },
  cardHandle: {
    width: 48,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 100, // Space for footer
  },

  // --- Header: Status & Earnings ---
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusText: {
    fontFamily: 'TT-Octosquares-Medium',
    fontSize: 12,
    color: color.primaryText,
    textTransform: 'uppercase',
  },
  tripIdLabel: {
    fontFamily: 'TT-Octosquares-Medium',
    fontSize: 10,
    color: color.lightGray,
    marginLeft: 2,
  },
  earningBox: {
    alignItems: 'flex-end',
  },
  earningLabel: {
    fontFamily: 'TT-Octosquares-Medium',
    fontSize: 10,
    color: color.lightGray,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  earningValue: {
    fontFamily: 'TT-Octosquares-Medium',
    fontSize: 20,
    color: color.buttonBg, // Use brand color for money
  },

  // --- Card 1: Passenger & Actions ---
  passengerCard: {
    // backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  passengerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 16,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontFamily: 'TT-Octosquares-Medium',
    fontSize: 18,
    color: color.primaryText,
    marginBottom: 6,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4', // Light yellow
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ratingText: {
    fontFamily: 'TT-Octosquares-Medium',
    fontSize: 11,
    color: '#FBC02D',
    marginLeft: 4,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: color.buttonBg, // Brand color
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Navigation Grid inside Passenger Card
  navGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navItemLeft: {
    paddingRight: 10,
  },
  navItemRight: {
    paddingLeft: 10,
  },
  navDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  navLabel: {
    fontSize: 9,
    color: color.lightGray,
    fontFamily: 'TT-Octosquares-Medium',
    textTransform: 'uppercase',
  },
  navTitle: {
    fontSize: 13,
    color: color.primaryText,
    fontFamily: 'TT-Octosquares-Medium',
  },

  // --- Card 2: Route Timeline ---
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'TT-Octosquares-Medium',
    color: color.lightGray,
    letterSpacing: 1,
    marginBottom: 16,
    paddingLeft: 4,
  },
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineLine: {
    position: 'absolute',
    left: 15,
    top: 15,
    bottom: 30,
    width: 2,
    backgroundColor: '#E0E0E0',
    zIndex: -1,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    backgroundColor: '#fff',
    marginRight: 16,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 11,
    color: color.lightGray,
    fontFamily: 'TT-Octosquares-Medium',
    marginBottom: 2,
  },
  timelineAddress: {
    fontSize: 15,
    color: color.primaryText,
    fontFamily: 'TT-Octosquares-Medium',
    lineHeight: 20,
  },

  // --- Card 3: Receipt / Financials ---
  receiptCard: {
    // backgroundColor: '#FAFAFA', // Light gray ledger look
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed', // Gives it a receipt feel
  },
  receiptTitle: {
    fontSize: 11,
    fontFamily: 'TT-Octosquares-Medium',
    color: color.lightGray,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fareLabel: {
    fontSize: fontSizes.FONT15,
    color: color.primaryText,
    fontFamily: 'TT-Octosquares-Medium',
    opacity: 0.8,
  },
  fareValue: {
    fontSize: fontSizes.FONT14,
    color: color.primaryText,
    fontFamily: 'TT-Octosquares-Medium',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginVertical: 12,
  },
  cancelSection: {
    marginTop: 8,
  },
  cancelBadge: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 12,
  },
  cancelBadgeText: {
    color: '#D32F2F',
    fontSize: 10,
    fontFamily: 'TT-Octosquares-Medium',
  },

  // --- Ratings ---
  ratingSummaryCard: {
    flexDirection: 'row',
    // backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'space-around',
  },
  ratingSummaryCol: {
    alignItems: 'center',
  },
  ratingHead: {
    fontSize: 10,
    color: color.lightGray,
    marginBottom: 4,
    fontFamily: 'TT-Octosquares-Medium',
  },
  ratingScore: {
    fontSize: 18,
    color: color.primaryText,
    fontFamily: 'TT-Octosquares-Medium',
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#E0E0E0',
    height: '100%',
  },
  ratingInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 2,
  },
  ratingTitle: {
    fontFamily: 'TT-Octosquares-Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  submitRatingBtn: {
    backgroundColor: color.buttonBg,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  submitRatingText: {
    color: color.primary,
    fontFamily: 'TT-Octosquares-Medium',
  },

  // --- Footer Actions ---
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.subPrimary,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  supportBtn: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- OTP Modal (Modernized) ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Darker backdrop
    justifyContent: "center",
    alignItems: "center",
  },
  otpCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
  },
  otpTitle: {
    fontSize: 20,
    fontFamily: 'TT-Octosquares-Medium',
    color: color.primaryText,
    marginBottom: 8,
  },
  otpSubtitle: {
    fontSize: 13,
    color: color.lightGray,
    fontFamily: 'TT-Octosquares-Medium',
    marginBottom: 24,
    textAlign: 'center',
  },
  otpInput: {
    width: "100%",
    fontSize: 28,
    fontFamily: 'TT-Octosquares-Medium',
    textAlign: "center",
    letterSpacing: 8,
    borderBottomWidth: 2,
    borderBottomColor: color.buttonBg,
    marginBottom: 30,
    color: color.primaryText,
    paddingBottom: 10,
  },
  otpBtnRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  otpCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  otpCancelText: {
    color: color.lightGray,
    fontFamily: 'TT-Octosquares-Medium',
  },
  otpConfirmBtn: {
    flex: 1,
    backgroundColor: color.buttonBg,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 10,
  },
  otpConfirmText: {
    color: color.primary,
    fontFamily: 'TT-Octosquares-Medium',
  },

});

export { styles };