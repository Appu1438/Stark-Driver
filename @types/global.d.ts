type ButtonProps = {
  title?: string;
  onPress?: () => void;
  width?: DimensionValue;
  height?: DimensionValue;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
};

type DriverType = {
  id: string;
  name: string;
  country: string;
  phone_number: string;
  email: string;
  vehicle_type: string;
  capacity: string;
  notificationToken: string;
  registration_number: string;
  registration_date: string;
  driving_license: string;
  vehicle_color: string;
  rate: number; // Changed to number for consistency

  // 👇 New fare-related fields
  baseFare: number;
  perKmRate: number;
  perMinRate: number;
  minFare: number;

  // Ratings & Earnings
  ratings: number;
  totalEarning: number;
  earnings: number;
  totalShare: number;
  shares: number;
  totalRides: number;
  pendingRides: number;
  cancelRides: number;

  // Status & Flags
  status: string;
  is_approved: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
};
// 

type recentRidesTypes = {
  id: string;
  user: any;
  rating: string;
  charge: string;
  earnings: string;
  share: string;
  pickup: string;
  dropoff: string;
  time: string;
  distance: string;
};