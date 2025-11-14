export type Color = {
  lightGray: string;
  regularText: string;
  primaryText: string;
  linearBorder: string;
  subtitle: string;
  lightGreen: string;
  whiteColor: string;
  blackColor: string;
  primaryGray: string;
  buttonBg: string;
  iconBg: string;
  modelBg: string;
  darkHeader: string;
  bgDark: string;
  darkPrimary: string;
  greenColor: string;
  sliderColor: string;
  notificationColor: string;
  border: string;
  readyText: string;
  categoryTitle: string;
  activeColor: string;
  completeColor: string;
  price: string;
  alertRed: string;
  alertBg: string;
  iconRed: string;
  darkBorder: string;
  selectPrimary: string;
  secondaryFont: string;
  red: string;
  primary: string;
  subPrimary: string;
  strokeColor: string;
  animatedStrokeColor: string;
};

const color: Color = {
  // MAIN COLORS
  primary: "#121212",        // dark but not pure black
  subPrimary: "#1E1E1E",     // slightly lighter for cards/headers
  bgDark: "#181818",         // main background
  darkPrimary: "#2A2A2A",    // card backgrounds, panels
  darkHeader: "#242424",     // headers
  blackColor: "#000000",
  whiteColor: "#FFFFFF",

  // MAP 

  strokeColor: "rgba(200, 200, 200, 0.45)",
  animatedStrokeColor: '#E9E9E9',

  // TEXT COLORS
  regularText: "#EAEAEA",    // normal text
  primaryText: "#FFFFFF",    // headings / main text
  secondaryFont: "#B0B0B0",  // secondary/subtitle text
  subtitle: "#9BA6B8",       // subtitle gray
  readyText: "#20B149",      // success / ready

  // BUTTONS & ICONS
  buttonBg: "#EAEAEA",       // primary button background
  lightGreen: "#E8F4F1",     // secondary button / highlight
  iconBg: "#32A284",         // icons background
  iconRed: "#FEEBEB",        // icons red
  alertRed: "#F33737",       // error
  alertBg: "#F7E4E4",        // error background

  // GRAYS & ACCENTS
  lightGray: "#F5F5F5",      // cards, placeholders
  primaryGray: "#E9E9E9",    // borders, dividers
  border: "#474747",         // dark border
  darkBorder: "#3A3A3A",     // secondary dark border
  linearBorder: "rgba(149, 143, 159, 0.1)", // subtle gradients

  // SPECIAL COLORS
  modelBg: "rgba(0,0,0,0.5)",  // modal overlay
  greenColor: "#28A745",       // green accent
  sliderColor: "#00A8E8",      // slider active
  notificationColor: "#F2F2F2",// notifications
  categoryTitle: "#8CCBBA",    // category title
  activeColor: "#3F8FDA",      // active status
  completeColor: "#FFB400",    // completed status
  price: "#20B149",            // price color
  selectPrimary: "#E8F4F1",    // selected card / button

  // OTHERS
  red: "#FF4B4B",             // generic red
};

export default color;
