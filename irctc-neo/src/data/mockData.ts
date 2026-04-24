export interface Station {
  code: string;
  name: string;
  city: string;
}
export interface RecentSearch {
  from: string;
  to: string;
  date: string;
}
export interface LiveAlert {
  id: string;
  priority: "high" | "medium" | "low";
  message: string;
  timestamp: string;
}
export interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}
export interface TrainClass {
  code: string;
  name: string;
}
export interface Quota {
  code: string;
  name: string;
}
export interface TrainResult {
  id: string;
  trainNo: string;
  trainName: string;
  type: "rajdhani" | "shatabdi" | "garib" | "superfast" | "express" | "mail";
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  classes: {
    code: string;
    name: string;
    available: "available" | "waitlist" | "rac" | "full";
    seats: number;
    price: number;
  }[];
}

export const stations: Station[] = [
  { code: "NDLS", name: "New Delhi", city: "Delhi" },
  { code: "BCT", name: "Mumbai Central", city: "Mumbai" },
  { code: "HWH", name: "Howrah Junction", city: "Kolkata" },
  { code: "MAS", name: "Chennai Central", city: "Chennai" },
  { code: "SBC", name: "KSR Bengaluru", city: "Bengaluru" },
  { code: "JP", name: "Jaipur Junction", city: "Jaipur" },
  { code: "LKO", name: "Lucknow Charbagh", city: "Lucknow" },
  { code: "ADI", name: "Ahmedabad Junction", city: "Ahmedabad" },
  { code: "PNBE", name: "Patna Junction", city: "Patna" },
  { code: "HYB", name: "Hyderabad Deccan", city: "Hyderabad" },
  { code: "CSTM", name: "Mumbai CSMT", city: "Mumbai" },
  { code: "CDG", name: "Chandigarh Junction", city: "Chandigarh" },
  { code: "BPL", name: "Bhopal Junction", city: "Bhopal" },
  { code: "GKP", name: "Gorakhpur Junction", city: "Gorakhpur" },
  { code: "PUNE", name: "Pune Junction", city: "Pune" },
  { code: "CNB", name: "Kanpur Central", city: "Kanpur" },
  { code: "AGC", name: "Agra Cantt", city: "Agra" },
  { code: "BBS", name: "Bhubaneswar", city: "Bhubaneswar" },
  { code: "TVC", name: "Thiruvananthapuram Central", city: "Thiruvananthapuram" },
  { code: "RNC", name: "Ranchi Junction", city: "Ranchi" },
  { code: "GHY", name: "Guwahati", city: "Guwahati" },
  { code: "DDN", name: "Dehradun", city: "Dehradun" },
  { code: "UDZ", name: "Udaipur City", city: "Udaipur" },
  { code: "DBG", name: "Darbhanga Junction", city: "Darbhanga" },
];

export const recentSearches: RecentSearch[] = [
  { from: "NDLS", to: "BCT", date: "2026-04-25" },
  { from: "SBC", to: "MAS", date: "2026-04-22" },
  { from: "HWH", to: "NDLS", date: "2026-04-28" },
  { from: "JP", to: "ADI", date: "2026-05-01" },
];

export const liveAlerts: LiveAlert[] = [
  { id: "a1", priority: "high", message: "Vande Bharat Express 22439 rescheduled — revised departure 06:45 AM due to fog.", timestamp: "2026-04-19T05:30:00Z" },
  { id: "a2", priority: "medium", message: "Tatkal booking for 20th April opens at 10:00 AM. Plan your travel in advance.", timestamp: "2026-04-19T08:00:00Z" },
  { id: "a3", priority: "high", message: "12301 Howrah Rajdhani cancelled on 21st April due to maintenance block.", timestamp: "2026-04-19T09:15:00Z" },
  { id: "a4", priority: "low", message: "New Tejas Express service: Lucknow–Gorakhpur. Bookings open now.", timestamp: "2026-04-19T10:00:00Z" },
  { id: "a5", priority: "medium", message: "eCatering available on Shatabdi routes — order up to 2 hours before departure.", timestamp: "2026-04-19T11:30:00Z" },
  { id: "a6", priority: "high", message: "Platform change: 12951 Mumbai Rajdhani departs from Platform 16 at New Delhi.", timestamp: "2026-04-19T12:00:00Z" },
];

export const features: Feature[] = [
  { icon: "Utensils", title: "eCatering — Meals on Train", description: "Order food from partner restaurants delivered to your seat. Available on 400+ trains across India.", gradient: "from-orange-500 to-amber-400" },
  { icon: "Bed", title: "Retiring Rooms", description: "Book comfortable rooms and dormitories at 300+ stations. Hourly and full-day options.", gradient: "from-blue-500 to-cyan-400" },
  { icon: "Map", title: "Tourism Packages", description: "Explore Bharat Gaurav tourist trains, Buddhist circuit tours, and heritage journeys.", gradient: "from-emerald-500 to-teal-400" },
  { icon: "Wallet", title: "IRCTC iMudra Wallet", description: "Fast, secure digital payments for train tickets with cashback offers on every booking.", gradient: "from-violet-500 to-purple-400" },
  { icon: "Shield", title: "Travel Insurance", description: "Travel insurance from ₹0.92 covering journeys up to 10,000 km. Accidents and natural calamities included.", gradient: "from-rose-500 to-pink-400" },
  { icon: "Package", title: "Cargo & Parcel", description: "Send parcels across India via Indian Railways network with real-time tracking.", gradient: "from-sky-500 to-indigo-400" },
];

export const trainClasses: TrainClass[] = [
  { code: "ALL", name: "All Classes" },
  { code: "1A", name: "AC First Class (1A)" },
  { code: "2A", name: "AC 2 Tier (2A)" },
  { code: "3A", name: "AC 3 Tier (3A)" },
  { code: "3E", name: "AC 3 Economy (3E)" },
  { code: "SL", name: "Sleeper (SL)" },
  { code: "CC", name: "AC Chair Car (CC)" },
  { code: "EC", name: "Exec. Chair Car (EC)" },
  { code: "2S", name: "Second Sitting (2S)" },
];

export const quotas: Quota[] = [
  { code: "GN", name: "General Quota" },
  { code: "TQ", name: "Tatkal Quota" },
  { code: "PT", name: "Premium Tatkal" },
  { code: "LD", name: "Ladies Quota" },
  { code: "HP", name: "Divyaang Concession" },
  { code: "DF", name: "Defence Quota" },
  { code: "FT", name: "Foreign Tourist Quota" },
  { code: "DP", name: "Duty Pass Quota" },
  { code: "SS", name: "Senior Citizen / Lower Berth" },
];

export const trainResults: TrainResult[] = [
  {
    id: "t1",
    trainNo: "12951",
    trainName: "Mumbai Rajdhani",
    type: "rajdhani",
    from: "NDLS",
    to: "BCT",
    departTime: "16:35",
    arriveTime: "08:15",
    duration: "15h 40m",
    classes: [
      { code: "1A", name: "AC First", available: "available", seats: 12, price: 4015 },
      { code: "2A", name: "AC 2 Tier", available: "available", seats: 45, price: 2445 },
      { code: "3A", name: "AC 3 Tier", available: "waitlist", seats: 8, price: 1785 },
    ],
  },
  {
    id: "t2",
    trainNo: "12002",
    trainName: "New Delhi – Bhopal Shatabdi",
    type: "shatabdi",
    from: "NDLS",
    to: "BCT",
    departTime: "06:00",
    arriveTime: "14:30",
    duration: "8h 30m",
    classes: [
      { code: "CC", name: "AC Chair Car", available: "available", seats: 120, price: 895 },
      { code: "EC", name: "Exec. Chair Car", available: "available", seats: 36, price: 1545 },
    ],
  },
  {
    id: "t3",
    trainNo: "12909",
    trainName: "Garib Rath Express",
    type: "garib",
    from: "NDLS",
    to: "BCT",
    departTime: "23:15",
    arriveTime: "15:45",
    duration: "16h 30m",
    classes: [
      { code: "3A", name: "AC 3 Tier", available: "rac", seats: 3, price: 1125 },
      { code: "SL", name: "Sleeper", available: "waitlist", seats: 15, price: 625 },
    ],
  },
  {
    id: "t4",
    trainNo: "12450",
    trainName: "Madhya Pradesh Express",
    type: "superfast",
    from: "NDLS",
    to: "BCT",
    departTime: "14:20",
    arriveTime: "07:05",
    duration: "16h 45m",
    classes: [
      { code: "SL", name: "Sleeper", available: "available", seats: 182, price: 505 },
      { code: "3A", name: "AC 3 Tier", available: "available", seats: 64, price: 1345 },
      { code: "2A", name: "AC 2 Tier", available: "waitlist", seats: 5, price: 1965 },
    ],
  },
  {
    id: "t5",
    trainNo: "19001",
    trainName: "Lokmanya Tilak Express",
    type: "express",
    from: "NDLS",
    to: "BCT",
    departTime: "21:30",
    arriveTime: "17:15",
    duration: "19h 45m",
    classes: [
      { code: "SL", name: "Sleeper", available: "available", seats: 240, price: 455 },
      { code: "3A", name: "AC 3 Tier", available: "available", seats: 88, price: 1245 },
      { code: "2A", name: "AC 2 Tier", available: "available", seats: 32, price: 1835 },
      { code: "1A", name: "AC First", available: "full", seats: 0, price: 3520 },
    ],
  },
  {
    id: "t6",
    trainNo: "12314",
    trainName: "Howrah Rajdhani Express",
    type: "rajdhani",
    from: "NDLS",
    to: "BCT",
    departTime: "17:30",
    arriveTime: "10:05",
    duration: "16h 35m",
    classes: [
      { code: "1A", name: "AC First", available: "available", seats: 8, price: 4155 },
      { code: "2A", name: "AC 2 Tier", available: "waitlist", seats: 4, price: 2510 },
      { code: "3A", name: "AC 3 Tier", available: "available", seats: 55, price: 1825 },
    ],
  },
];

export const TRAIN_TYPES = ["all", "rajdhani", "shatabdi", "garib", "superfast", "express", "mail"] as const;
export type TrainType = typeof TRAIN_TYPES[number];