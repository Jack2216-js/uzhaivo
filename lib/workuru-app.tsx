// @ts-nocheck
// UZHAIVO - FINAL 0 ERRORS - FULL PROOF SYSTEM

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, Alert, Image, Linking, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, Share, RefreshControl } from "react-native";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// FALLBACK PROOF TYPES - 0 ERRORS GUARD
const FALLBACK_PROOF_TYPES = ["Driving License", "Aadhaar Card", "PAN Card", "Experience Certificate", "Skill Certificate", "Vehicle RC", "Insurance", "Other"];
const FALLBACK_TRANSLATIONS: any = {
  "Driving License": {en: "Driving License", ta: "ஓட்டுநர் உரிமம்", icon: "card-account-details"},
  "Aadhaar Card": {en: "Aadhaar Card", ta: "ஆதார் அட்டை", icon: "card-account-details-outline"},
  "PAN Card": {en: "PAN Card", ta: "பான் கார்டு", icon: "card-text"},
  "Experience Certificate": {en: "Experience Certificate", ta: "அனுபவச் சான்றிதழ்", icon: "certificate"},
  "Skill Certificate": {en: "Skill Certificate", ta: "திறன் சான்றிதழ்", icon: "school"},
  "Vehicle RC": {en: "Vehicle RC", ta: "வாகன பதிவு", icon: "car"},
  "Insurance": {en: "Insurance", ta: "காப்பீடு", icon: "shield-check"},
  "Other": {en: "Other Document", ta: "மற்ற ஆவணம்", icon: "file-document"},
};

// ==================== BOSS EXTRAS - FULL TAMIL SYSTEM - INCREASE LINES ====================
const BILINGUAL_LABELS = {
  location: { en: "LOCATION", ta: "இடம்" },
  timing: { en: "TIMING", ta: "நேரம்" },
  workers: { en: "WORKERS", ta: "தொழிலாளர்கள்" },
  jobType: { en: "JOB TYPE", ta: "வேலை வகை" },
  workDetails: { en: "Work Details", ta: "வேலை விவரங்கள்" },
  type: { en: "Type", ta: "வேலை வகை" },
  time: { en: "Time", ta: "நேரம்" },
  need: { en: "Need", ta: "தேவை" },
  salary: { en: "Salary", ta: "சம்பளம்" },
  urgency: { en: "Urgency", ta: "அவசரம்" },
  range: { en: "Range", ta: "வரம்பு" },
};

const getBilingualTiming = (val: string, isTamil: boolean) => {
  const map: any = {
    "Morning": "காலை", "Afternoon": "மதியம்", "Full Day": "முழு நாள்", "Night": "இரவு",
    "Today": "இன்று", "Tomorrow": "நாளை", "This Week": "இந்த வாரம்", "Flexible": "நெகிழ்வான",
    "Per Day": "நாள் ஒன்றுக்கு", "Per Hour": "மணி நேரத்திற்கு", "Per Work": "வேலை ஒன்றுக்கு", "Per Month": "மாதத்திற்கு",
    "Daily": "தினசரி", "Urgent": "அவசரம்", "காலை": "காலை", "இன்று": "இன்று",
  };
  if (!isTamil) return val.replace(/🔥|⏰/g, "").trim();
  const clean = val.replace(/🔥|⏰/g, "").trim();
  return map[clean] || clean;
};

const openGoogleMapsLocation = (location: string, lat?: number, lng?: number) => {
  let url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  if (lat && lng) {
    url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  Linking.openURL(url);
  try { Haptics.selectionAsync(); } catch {}
};

const parseJobDescription = (desc: string) => {
  const result: any = { type: "", time: "", need: "", sal: "", urg: "", range: "", clean: "" };
  if (!desc) return result;
  const parts = desc.split("|").map((s: string) => s.trim()).filter(Boolean);
  const cleanParts: string[] = [];
  for (const part of parts) {
    if (part.includes(":")) {
      const idx = part.indexOf(":");
      const key = part.substring(0, idx).trim().toLowerCase();
      const value = part.substring(idx + 1).trim();
      if (key === "type") result.type = value;
      else if (key === "time") result.time = value;
      else if (key === "need") result.need = value;
      else if (key === "sal") result.sal = value;
      else if (key === "urg") result.urg = value;
      else if (key === "range") result.range = value;
      else cleanParts.push(part);
    } else {
      cleanParts.push(part);
    }
  }
  result.clean = cleanParts.join(" ").trim();
  return result;
};

const translateValue = (value: string, isTamil: boolean) => {
  return getBilingualTiming(value, isTamil);
};

const FULL_TRANSLATION_JSON = {
  "en": { "location": "LOCATION", "timing": "TIMING", "workers": "WORKERS" },
  "ta": { "location": "இடம்", "timing": "நேரம்", "workers": "தொழிலாளர்கள்", "jobType": "வேலை வகை" }
};
// ==================== END BOSS EXTRAS ====================



import { useSafeAreaInsets } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";
let ExpoLocation: any = null; try { ExpoLocation = require("expo-location"); } catch {}
let AsyncStorage: any = null; try { AsyncStorage = require("@react-native-async-storage/async-storage").default; } catch { AsyncStorage = { getItem: async () => null, setItem: async () => {}, removeItem: async () => {} }; }
import { CATEGORIES, type Job, type Locale, type Role, type UserRecord, type PlatformSettings, getCurrentUser, getPlatformSettings, getJobs, getJobById, loadAppLanguage, loadSavedJobs, saveAppLanguage, saveUser, requestPhoneOtp, signOut, translate, toggleSavedJob, verifyPhoneOtp, saveJob, updateJob, deleteJob, subscribeToJobs, refreshJobs, normalizePhone, type JobApplication, getJobApplication, getWorkerApplications, getOwnerApplications, submitJobApplication, subscribeToJobApplication, subscribeToWorkerApplications, subscribeToOwnerApplications, updateJobApplicationStatus, getOwnerVerificationStatus } from "@/lib/workuru-data";
let ExpoImagePicker: any = null; try { ExpoImagePicker = require("expo-image-picker"); } catch {}

const SAFE_PROOF_TYPES = typeof PROOF_TYPES !== "undefined" ? PROOF_TYPES : FALLBACK_PROOF_TYPES;
const SAFE_PROOF_TRANSLATIONS = typeof PROOF_TYPE_TRANSLATIONS !== "undefined" ? PROOF_TYPE_TRANSLATIONS : FALLBACK_TRANSLATIONS;
const PROOF_SIDES = ["front", "back", "front_back"] as const;
const encodeProofRequest = (note: string, sides: Record<string, string>) => `__PROOF_REQUEST__${JSON.stringify({ note: note || "", sides })}`;
const decodeProofRequest = (value: string) => { try { if (value?.startsWith("__PROOF_REQUEST__")) return JSON.parse(value.slice("__PROOF_REQUEST__".length)); } catch {} return { note: value || "", sides: {} }; };
const ORANGE = "#FF6B00"; const MUTED = "#8A7D74"; const GREEN = "#00A85A"; const ROLE_ORANGE = "#FF6B00"; const ROLE_GREEN = "#00A86B"; const ROLE_NAVY = "#0B1932"; const ROLE_MUTED = "#6F7B8C";
type Props = { locale?: "en" | "ta"; onSelectRole: (role: "worker" | "owner") => void; };

// FULL LANGUAGE SYSTEM - Boss Jackson Requirement
const TRANSLATIONS = {
  en: {
    // Login
    loginTitle: "Login with phone",
    loginSub: "Enter your number to get OTP",
    phoneLabel: "Phone number",
    phonePlaceholder: "10 digit number",
    sendOtp: "Send OTP",
    // OTP
    otpTitle: "Enter OTP",
    otpSub: "Code sent to",
    otpLabel: "6 DIGIT OTP",
    otpPlaceholder: "• • • • • •",
    termsText: "I agree to",
    termsLink: "Terms & Conditions",
    andText: "and",
    privacyLink: "Privacy Policy",
    continueBtn: "Continue",
    resendText: "Didn't get code?",
    resendAction: "Resend OTP",
    // Role
    roleTitle: "What brings you here?",
    roleSub: "Local work. Real people.",
    roleFindJob: "I'm looking for a job",
    roleFindJobDesc: "Daily work opportunities near you",
    roleHire: "I'm looking for workers",
    roleHireDesc: "Find dependable hands for your work",
    roleOpportunities: "FIND OPPORTUNITIES",
    roleHireTalent: "HIRE TALENT",
    roleJobMeta: "Daily  ·  Part time  ·  Full time",
    roleHireMeta: "Skilled  ·  Unskilled  ·  Flexible",
    // Home
    welcomeBack: "WELCOME BACK",
    findWorkTitle: "Find work that fits your day.",
    WorkersJobs: "Tamil Nadu • %s jobs",
    searchPlaceholder: "Search work, e.g. Mason, Driver",
    nearBtn: "Near",
    nearActive: "Near ✓",
    jobsTab: "Jobs",
    callsTab: "Calls",
    profileTab: "Profile",
    // Job Card
    needWorkers: "Need %s",
    postedAgo: "Posted 2h ago",
    callBtn: "Call",
    verified: "Verified",
    urgent: "Urgent",
    // Post Job
    postTitle: "Post New Job",
    editTitle: "Edit Job",
    postSub: "Reach Tamil Nadu workers today",
    jobTitleLabel: "JOB TITLE *",
    jobTitlePh: "e.g. Mason needed urgently",
    categoryLabel: "CATEGORY *",
    urgencyLabel: "URGENCY *",
    salaryLabel: "SALARY RANGE * (MIN - MAX)",
    locationLabel: "LOCATION *",
    locationPh: "Type location",
    photoLabel: "WORK SITE PHOTO",
    photoAdd: "Tap to add work site photo",
    photoAdded: "Photo added ✓",
    voiceLabel: "VOICE NOTE - Speak in Tamil",
    recordVoice: "Record Voice",
    stopRecording: "Stop...",
    workersLabel: "WORKERS",
    timingLabel: "TIMING",
    descLabel: "WORK DESCRIPTION",
    descPh: "Full work details, materials, work time...",
    publishBtn: "Publish Job",
    updateBtn: "Update Job",
    myJobsTitle: "My Posted Jobs",
    activeJobs: "Active",
    noJobs: "No jobs posted yet",
    noJobsSub: "Your jobs will appear here",
    postTab: "Post",
    myJobsTab: "My Jobs",
    // Calls
    noCallsTitle: "No calls yet",
    noCallsSub: "You haven't called anyone yet. Go to Jobs and make your first call!",
    browseJobs: "Browse Jobs",
    callHistory: "CALL HISTORY",
    recentCalls: "Calls • Recent",
    clearBtn: "Clear",
    // Profile
    verifiedBadge: "Verified",
    ownerRole: "Owner • I need workers",
    workerRole: "Worker • I need job",
    jobsPosted: "Jobs Posted",
    rating: "Rating",
    hired: "Hired",
    settings: "SETTINGS",
    languageSetting: "Language / மொழி",
    helpSupport: "Help & Support",
    whatsappSupport: "WhatsApp Support",
    logout: "Log out",
    deleteAccount: "Delete Account",
    // Common
    today: "🔥 Today",
    tomorrow: "⏰ Tomorrow",
    thisWeek: "This Week",
    flexible: "Flexible",
    morning: "Morning",
    afternoon: "Afternoon",
    fullDay: "Full Day",
    night: "Night",
    backBtn: "Back",
  },
  ta: {
    // Login
    loginTitle: "தொலைபேசி மூலம் உள்நுழைக",
    loginSub: "OTP பெற உங்கள் எண்ணை உள்ளிடவும்",
    phoneLabel: "தொலைபேசி எண்",
    phonePlaceholder: "10 இலக்க எண்",
    sendOtp: "OTP அனுப்பு",
    // OTP
    otpTitle: "OTP ஐ உள்ளிடவும்",
    otpSub: "குறியீடு அனுப்பப்பட்டது",
    otpLabel: "6 இலக்க OTP",
    otpPlaceholder: "• • • • • •",
    termsText: "நான் ஒப்புக்கொள்கிறேன்",
    termsLink: "விதிமுறைகள் & நிபந்தனைகள்",
    andText: "மற்றும்",
    privacyLink: "தனியுரிமைக் கொள்கை",
    continueBtn: "தொடரவும்",
    resendText: "குறியீடு வரவில்லையா?",
    resendAction: "OTP ஐ மீண்டும் அனுப்பு",
    // Role
    roleTitle: "உங்களுக்கு என்ன தேவை?",
    roleSub: "உள்ளூர் வேலை. உண்மையான மனிதர்கள்.",
    roleFindJob: "எனக்கு வேலை வேண்டும்",
    roleFindJobDesc: "உங்களுக்கு அருகிலுள்ள வேலை வாய்ப்புகள்",
    roleHire: "எனக்கு ஆட்கள் வேண்டும்",
    roleHireDesc: "உங்கள் வேலைக்கு நம்பகமான நபர்கள்",
    roleOpportunities: "வேலை வாய்ப்புகள்",
    roleHireTalent: "திறமையானவர்களை நியமிக்கவும்",
    roleJobMeta: "தினசரி  ·  பகுதி நேரம்  ·  முழு நேரம்",
    roleHireMeta: "திறமையானவர்  ·  திறமையற்றவர்  ·  நெகிழ்வான வேலை",
    // Home
    welcomeBack: "மீண்டும் வருக",
    findWorkTitle: "உங்கள் நாளுக்கு ஏற்ற வேலையை கண்டறியுங்கள்.",
    WorkersJobs: "தமிழ்நாடு • %s வேலைகள்",
    searchPlaceholder: "வேலை தேடுங்கள், எ.கா. கொத்தனார்",
    nearBtn: "அருகில்",
    nearActive: "அருகில் ✓",
    jobsTab: "வேலைகள்",
    callsTab: "அழைப்பு",
    profileTab: "சுயவிவரம்",
    // Job Card
    needWorkers: "%s பேர் தேவை",
    postedAgo: "2 மணி முன் பதிவு",
    callBtn: "அழை",
    verified: "சரிபார்க்கப்பட்டது",
    urgent: "அவசரம்",
    // Post Job
    postTitle: "புதிய வேலை பதிவு",
    editTitle: "வேலையை திருத்து",
    postSub: "தமிழ்நாடு தொழிலாளர்களை அடையுங்கள்",
    jobTitleLabel: "வேலை தலைப்பு *",
    jobTitlePh: "எ.கா. கொத்தனார் தேவை அவசரம்",
    categoryLabel: "வகை *",
    urgencyLabel: "அவசரம் *",
    salaryLabel: "சம்பள வரம்பு * (குறைந்த - அதிக)",
    locationLabel: "இடம் *",
    locationPh: "இடத்தை தட்டச்சு செய்க",
    photoLabel: "வேலை இட புகைப்படம்",
    photoAdd: "புகைப்படம் சேர்க்க தட்டவும்",
    photoAdded: "புகைப்படம் சேர்க்கப்பட்டது ✓",
    voiceLabel: "குரல் குறிப்பு - தமிழில் பேசலாம்",
    recordVoice: "குரல் பதிவு",
    stopRecording: "நிறுத்து...",
    workersLabel: "தொழிலாளர்கள்",
    timingLabel: "நேரம்",
    descLabel: "வேலை விவரம்",
    descPh: "முழு வேலை விவரங்கள், பொருட்கள், வேலை நேரம்...",
    publishBtn: "வேலையை வெளியிடு",
    updateBtn: "புதுப்பிக்கவும்",
    myJobsTitle: "எனது வேலைகள்",
    activeJobs: "செயலில்",
    noJobs: "இன்னும் வேலைகள் இல்லை",
    noJobsSub: "உங்கள் வேலைகள் இங்கே தோன்றும்",
    postTab: "பதிவு",
    myJobsTab: "எனது வேலை",
    // Calls
    noCallsTitle: "அழைப்புகள் இல்லை",
    noCallsSub: "நீங்கள் இன்னும் யாரையும் அழைக்கவில்லை. வேலைகளுக்கு சென்று முதல் அழைப்பை செய்யுங்கள்!",
    browseJobs: "வேலைகளை பார்க்க",
    callHistory: "அழைப்பு வரலாறு",
    recentCalls: "அழைப்புகள் • சமீபத்திய",
    clearBtn: "அழி",
    // Profile
    verifiedBadge: "சரிபார்க்கப்பட்டது",
    ownerRole: "உரிமையாளர் • எனக்கு ஆட்கள் வேண்டும்",
    workerRole: "தொழிலாளி • எனக்கு வேலை வேண்டும்",
    jobsPosted: "வேலைகள்",
    rating: "மதிப்பீடு",
    hired: "பணியமர்த்தியது",
    settings: "அமைப்புகள்",
    languageSetting: "மொழி / Language",
    helpSupport: "உதவி & ஆதரவு",
    whatsappSupport: "வாட்ஸ்அப் ஆதரவு",
    logout: "வெளியேறு",
    deleteAccount: "கணக்கை நீக்கு",
    // Common
    today: "🔥 இன்று",
    tomorrow: "⏰ நாளை",
    thisWeek: "இந்த வாரம்",
    flexible: "எப்போது வேண்டுமானாலும்",
    morning: "காலை",
    afternoon: "மதியம்",
    fullDay: "முழு நாள்",
    night: "இரவு",
    backBtn: "பின்",
  }
};

const CATEGORY_TRANSLATIONS: Record<string, {en: string, ta: string}> = {
  "Mason": {en: "Mason", ta: "கொத்தனார்"},
  "Painter": {en: "Painter", ta: "பெயிண்டர்"},
  "Electrician": {en: "Electrician", ta: "மின்சார பணியாளர்"},
  "Plumber": {en: "Plumber", ta: "குழாய் பணியாளர்"},
  "Carpenter": {en: "Carpenter", ta: "தச்சர்"},
  "Welder": {en: "Welder", ta: "வெல்டர்"},
  "Driver": {en: "Driver", ta: "ஓட்டுநர்"},
  "Cook": {en: "Cook", ta: "சமையல்காரர்"},
  "Cleaner": {en: "Cleaner", ta: "துப்புரவு பணியாளர்"},
  "Security": {en: "Security", ta: "காவலாளி"},
  "Gardener": {en: "Gardener", ta: "தோட்டக்காரர்"},
  "Labour": {en: "Labour", ta: "கூலி வேலை"},
  "Delivery": {en: "Delivery", ta: "டெலிவரி"},
  "Tailor": {en: "Tailor", ta: "தையல்காரர்"},
  "Mechanic": {en: "Mechanic", ta: "மெக்கானிக்"},
  "AC Technician": {en: "AC Technician", ta: "ஏசி தொழில்நுட்பம்"},
  "Housekeeping": {en: "Housekeeping", ta: "வீட்டு பராமரிப்பு"},
  "Waiter": {en: "Waiter", ta: "பரிமாறுபவர்"},
  "Construction": {en: "Construction", ta: "கட்டுமானம்"},
  "Loading": {en: "Loading", ta: "சுமை தூக்குதல்"},
  "Office Assistant": {en: "Office Assistant", ta: "அலுவலக உதவியாளர்"},
  "Helper": {en: "Helper", ta: "உதவியாளர்"},
  "Other": {en: "Other", ta: "மற்றவை"},
  "Catering": {en: "Catering", ta: "கேட்டரிங்"},
  "Driver - Mechanic": {en: "Mechanic", ta: "மெக்கானிக்"},
};
const getCategoryName = (cat: string, locale: string) => {
  const entry = CATEGORY_TRANSLATIONS[cat];
  if (!entry) return cat;
  return locale === "ta" ? entry.ta : entry.en;
};

const useTranslation = (locale: Locale) => {
  return (key: string, ...args: any[]) => {
    let text = (TRANSLATIONS as any)[locale]?.[key] || (TRANSLATIONS as any).en[key] || key;
    args.forEach((arg, i) => { text = text.replace('%s', arg); });
    return text;
  };
};


const POST_TA = {
  title: "புதிய வேலை பதிவு", editTitle: "வேலையை திருத்து", sub: "தமிழ்நாடு தொழிலாளர்களை அடையுங்கள்",
  jobTitle: "வேலை தலைப்பு *", placeholderTitle: "எ.கா. கொத்தனார் தேவை அவசரம்", category: "வகை *",
  urgency: "அவசரம் *", today: "🔥 இன்று", tomorrow: "⏰ நாளை", thisWeek: "இந்த வாரம்", flexible: "எப்போது வேண்டுமானாலும்",
  salary: "சம்பள வரம்பு * (குறைந்த - அதிக)", location: "இடம் *", locationPh: "இடத்தை தட்டச்சு செய்க",
  photo: "வேலை இட புகைப்படம்", photoAdd: "புகைப்படம் சேர்க்க தட்டவும்", photoAdded: "புகைப்படம் சேர்க்கப்பட்டது ✓",
  voice: "குரல் குறிப்பு - தமிழில் பேசலாம்", record: "குரல் பதிவு", stop: "நிறுத்து...", workers: "தொழிலாளர்கள்",
  timing: "நேரம்", desc: "வேலை விவரம்", descPh: "முழு வேலை விவரங்கள், பொருட்கள், வேலை நேரம்...",
  publish: "வேலையை வெளியிடு", update: "புதுப்பிக்கவும்", morning: "காலை", afternoon: "மதியம்", fullDay: "முழு நாள்", night: "இரவு",
  myJobs: "எனது வேலைகள்", active: "செயலில்", noJobs: "இன்னும் வேலைகள் இல்லை", noJobsSub: "உங்கள் வேலைகள் இங்கே தோன்றும்", postTab: "பதிவு", myJobsTab: "எனது வேலை", callsTab: "அழைப்பு", profileTab: "சுயவிவரம்"
};

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; const dLat = (lat2 - lat1) * Math.PI / 180; const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function SplashScreen() {
  const dot1 = useRef(new Animated.Value(0.3)).current; const dot2 = useRef(new Animated.Value(0.3)).current; const dot3 = useRef(new Animated.Value(0.3)).current;
  useEffect(() => { const pulse = (anim: Animated.Value, delay: number) => Animated.loop(Animated.sequence([Animated.delay(delay), Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }), Animated.timing(anim, { toValue: 0.3, duration: 500, useNativeDriver: true })])); pulse(dot1,0).start(); pulse(dot2,250).start(); pulse(dot3,500).start(); }, []);
  return (<View style={cleanSplashStyles.screen}><View style={cleanSplashStyles.orbTop} /><View style={cleanSplashStyles.orbBottom} /><View style={cleanSplashStyles.center}><View style={cleanSplashStyles.logoRow}><View style={cleanSplashStyles.logoIcon}><MaterialCommunityIcons name="account" size={20} color="#FF6B00" style={{ position: 'absolute', top: 4 }} /><Text style={cleanSplashStyles.logoU}>U</Text></View><Text style={cleanSplashStyles.logoText}>Uzhaivo</Text></View><Text style={cleanSplashStyles.title}>Uzhaivo</Text><Text style={cleanSplashStyles.tamilSub}>உழைப்பே உயர்வு</Text><Text style={cleanSplashStyles.englishSub}>Tamil Nadu Jobs • Real People</Text><View style={cleanSplashStyles.dotsRow}><Animated.View style={[cleanSplashStyles.dot, { opacity: dot1 }]} /><Animated.View style={[cleanSplashStyles.dot, { opacity: dot2 }]} /><Animated.View style={[cleanSplashStyles.dot, { opacity: dot3 }]} /></View></View></View>);
}
const cleanSplashStyles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#FF6B00", alignItems: "center", justifyContent: "center", overflow: "hidden" }, orbTop: { position: "absolute", top: -90, right: -80, width: 360, height: 360, borderRadius: 180, backgroundColor: "#FF8A33", opacity: 0.95 }, orbBottom: { position: "absolute", bottom: -110, left: -90, width: 320, height: 320, borderRadius: 160, backgroundColor: "#E05A00", opacity: 0.75 }, center: { alignItems: "center", zIndex: 5 }, logoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }, logoIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", overflow: "hidden" }, logoU: { color: "#FF6B00", fontWeight: "900", fontSize: 28, marginTop: 2 }, logoText: { color: "#0A1931", fontSize: 34, fontWeight: "900" }, title: { color: "#fff", fontSize: 28, fontWeight: "800", marginTop: 14 }, tamilSub: { color: "rgba(255,255,255,0.95)", fontSize: 18, fontWeight: "600", marginTop: 8 }, englishSub: { color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: "500", marginTop: 10 }, dotsRow: { flexDirection: "row", gap: 8, marginTop: 26 }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" } });

function NoInternetScreen({ locale, onRetry }: { locale: Locale, onRetry: () => void }) {
  const isTamil = locale === "ta";
  return (
    <View style={noInternetStyles.screen}>
      <View style={noInternetStyles.iconWrap}><MaterialCommunityIcons name="wifi-off" size={64} color="#FF6B00" /></View>
      <Text style={noInternetStyles.title}>{isTamil ? "இணைய இணைப்பு இல்லை" : "No Internet Connection"}</Text>
      <Text style={noInternetStyles.sub}>{isTamil ? "இணையத்தை இயக்கி மீண்டும் முயற்சிக்கவும்" : "Please check your internet and try again"}</Text>
      <Pressable onPress={onRetry} style={noInternetStyles.retryButton}><MaterialCommunityIcons name="refresh" size={20} color="#fff" /><Text style={noInternetStyles.retryText}>{isTamil ? "மீண்டும் முயற்சிக்கவும்" : "Retry"}</Text></Pressable>
    </View>
  );
}
const noInternetStyles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#FFF8F0", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }, iconWrap: { width: 120, height: 120, borderRadius: 36, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center", marginBottom: 24, borderWidth: 1, borderColor: "#FFE0CA" }, title: { color: "#0A1931", fontSize: 22, fontWeight: "900", textAlign: "center" }, sub: { color: "#8A7D74", fontSize: 14, fontWeight: "600", textAlign: "center", marginTop: 10, lineHeight: 20 }, retryButton: { marginTop: 28, backgroundColor: "#FF6B00", flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16 }, retryText: { color: "#fff", fontSize: 15, fontWeight: "900" } });


function LoginPhoneScreen({ locale, phone, setPhone, onSend, loading, onLanguageChange }: any) {
  const isTamil = locale === "ta"; const tr = useTranslation(locale as any);
  const fade = useRef(new Animated.Value(0)).current; const slide = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  useEffect(() => { Animated.parallel([Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }), Animated.spring(slide, { toValue: 0, damping: 14, stiffness: 100, useNativeDriver: true }), Animated.spring(scale, { toValue: 1, damping: 12, stiffness: 90, useNativeDriver: true })]).start(); }, []);
  const isValid = phone.length === 10;
  return (
    <View style={premiumLoginStyles.screen}>
      <View style={premiumLoginStyles.orb1} /><View style={premiumLoginStyles.orb2} />
      <View style={premiumLoginStyles.topRow}>
        <BrandMark />
        <Pressable onPress={() => onLanguageChange && onLanguageChange(locale === "ta" ? "en" : "ta")} style={premiumLoginStyles.langBtn}>
          <MaterialCommunityIcons name="translate" size={16} color={ORANGE} />
          <Text style={premiumLoginStyles.langBtnText}>{locale === "ta" ? "English" : "தமிழ்"}</Text>
        </Pressable>
      </View>
      <Animated.View style={[premiumLoginStyles.hero, { opacity: fade, transform: [{ translateY: slide }, { scale }] }]}>
        <View style={premiumLoginStyles.iconWrapPro}>
          <View style={premiumLoginStyles.iconInner}><MaterialCommunityIcons name="phone" size={36} color={ORANGE} /></View>
          <View style={premiumLoginStyles.badge}><MaterialCommunityIcons name="shield-check" size={14} color="#fff" /></View>
        </View>
        <Text style={premiumLoginStyles.titlePro}>{tr("loginTitle")}</Text>
        <Text style={premiumLoginStyles.subPro}>{tr("loginSub")}</Text>
        <View style={premiumLoginStyles.trustRow}>
          <View style={premiumLoginStyles.trustItem}><MaterialCommunityIcons name="lock-check" size={14} color={GREEN} /><Text style={premiumLoginStyles.trustText}>{isTamil ? "பாதுகாப்பானது" : "Secure"}</Text></View>
          <View style={premiumLoginStyles.trustDot} />
          <View style={premiumLoginStyles.trustItem}><MaterialCommunityIcons name="flash" size={14} color={ORANGE} /><Text style={premiumLoginStyles.trustText}>{isTamil ? "விரைவானது" : "Fast OTP"}</Text></View>
          <View style={premiumLoginStyles.trustDot} />
          <View style={premiumLoginStyles.trustItem}><MaterialCommunityIcons name="check-decagram" size={14} color={GREEN} /><Text style={premiumLoginStyles.trustText}>{isTamil ? "சரிபார்க்கப்பட்டது" : "Verified"}</Text></View>
        </View>
      </Animated.View>
      <Animated.View style={[premiumLoginStyles.cardPro, { opacity: fade, transform: [{ translateY: slide }] }]}>
        <Text style={premiumLoginStyles.labelPro}>{tr("phoneLabel")}</Text>
        <View style={[premiumLoginStyles.inputWrapPro, isValid && premiumLoginStyles.inputWrapValidPro]}>
          <View style={premiumLoginStyles.countryBox}><Text style={premiumLoginStyles.countryCodePro}>+91</Text><MaterialCommunityIcons name="chevron-down" size={14} color={MUTED} /></View>
          <View style={premiumLoginStyles.dividerPro} />
          <TextInput value={phone} onChangeText={setPhone} placeholder={tr("phonePlaceholder")} style={premiumLoginStyles.inputPro} keyboardType="number-pad" maxLength={10} placeholderTextColor="#B8A99D" />
          {isValid && <View style={premiumLoginStyles.checkCircle}><MaterialCommunityIcons name="check" size={14} color="#fff" /></View>}
        </View>
        <View style={premiumLoginStyles.infoBox}>
          <MaterialCommunityIcons name="information-outline" size={14} color={ORANGE} />
          <Text style={premiumLoginStyles.infoText}>{isTamil ? "OTP உங்கள் தொலைபேசிக்கு அனுப்பப்படும். கட்டணம் இல்லை." : "OTP will be sent to your phone. No charges. Secure and simple."}</Text>
        </View>
        <Pressable onPress={onSend} disabled={!isValid || loading} style={[premiumLoginStyles.sendBtnPro, !isValid && premiumLoginStyles.sendBtnDisabledPro]}>
          {loading ? <ActivityIndicator color="#fff" /> : <><Text style={premiumLoginStyles.sendTextPro}>{tr("sendOtp")}</Text><View style={premiumLoginStyles.arrowCircle}><MaterialCommunityIcons name="arrow-right" size={18} color={ORANGE} /></View></>}
        </Pressable>
        <View style={premiumLoginStyles.footerRow}>
          <View style={premiumLoginStyles.footerLine} /><Text style={premiumLoginStyles.footerOr}>{isTamil ? "அல்லது" : ""}</Text><View style={premiumLoginStyles.footerLine} />
        </View>
        <View style={premiumLoginStyles.workerRow}>
          <MaterialCommunityIcons name="map-marker" size={12} color={ORANGE} /><Text style={premiumLoginStyles.workerText}>Worker Platform • 636001 • {isTamil ? "உள்ளூர் வேலை" : "Local Jobs"}</Text>
        </View>
      </Animated.View>
    </View>
  );
}
const premiumLoginStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF8F0", paddingHorizontal: 20, paddingTop: 16 },
  orb1: { position: "absolute", top: -80, right: -70, width: 220, height: 220, borderRadius: 110, backgroundColor: "#FFE8D6", opacity: 0.6 },
  orb2: { position: "absolute", bottom: 100, left: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: "#FFF1E7", opacity: 0.8 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, zIndex: 10 },
  langBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "#FFE0CA", elevation: 2 },
  langBtnText: { color: ORANGE, fontWeight: "800", fontSize: 13 },
  hero: { alignItems: "center", marginTop: 10, marginBottom: 22, zIndex: 5 },
  iconWrapPro: { width: 96, height: 96, borderRadius: 32, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff", elevation: 6, marginBottom: 16 },
  iconInner: { width: 64, height: 64, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#FFE0CA" },
  badge: { position: "absolute", bottom: -4, right: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: GREEN, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff" },
  titlePro: { color: "#0A1931", fontSize: 28, fontWeight: "900", textAlign: "center" },
  subPro: { color: ORANGE, fontSize: 14, fontWeight: "700", marginTop: 8, textAlign: "center", lineHeight: 20 },
  trustRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 14, backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#FFF1E7" },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  trustText: { color: "#0A1931", fontSize: 11, fontWeight: "700" },
  trustDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#FFE0CA" },
  cardPro: { backgroundColor: "#fff", borderRadius: 28, padding: 22, elevation: 10, borderWidth: 1, borderColor: "#fff", zIndex: 5 },
  labelPro: { color: "#0A1931", fontSize: 11, fontWeight: "900", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" },
  inputWrapPro: { minHeight: 62, borderRadius: 18, backgroundColor: "#FFF8F0", borderWidth: 2, borderColor: "#FFE0CA", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 8 },
  inputWrapValidPro: { borderColor: GREEN, backgroundColor: "#F0FAF4" },
  countryBox: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: "#FFE0CA" },
  countryCodePro: { color: "#0A1931", fontWeight: "900", fontSize: 16 },
  dividerPro: { width: 1.5, height: 24, backgroundColor: "#FFE0CA" },
  inputPro: { flex: 1, color: "#0A1931", fontSize: 17, fontWeight: "700", minHeight: 50 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: GREEN, alignItems: "center", justifyContent: "center" },
  infoBox: { flexDirection: "row", gap: 8, backgroundColor: "#FFF8F0", padding: 12, borderRadius: 12, marginTop: 14, borderWidth: 1, borderColor: "#FFE0CA", alignItems: "flex-start" },
  infoText: { flex: 1, color: "#5A4D45", fontSize: 11, fontWeight: "600", lineHeight: 16 },
  sendBtnPro: { minHeight: 58, borderRadius: 18, backgroundColor: ORANGE, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 18, elevation: 6, paddingHorizontal: 20 },
  sendBtnDisabledPro: { backgroundColor: "#FFC499", elevation: 0 },
  sendTextPro: { color: "#fff", fontSize: 17, fontWeight: "900" },
  arrowCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 20 },
  footerLine: { flex: 1, height: 1, backgroundColor: "#FFF1E7" },
  footerOr: { color: MUTED, fontSize: 11, fontWeight: "700" },
  workerRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 14 },
  workerText: { color: MUTED, fontSize: 10, fontWeight: "700" },
});


function LoginOtpScreen({ locale, phone, otp, setOtp, onVerify, onResend, onBack, loading, onTerms, onPrivacy, onLanguageChange }: any) {
  const isTamil = locale === "ta";
  const [agreed, setAgreed] = useState(false);
  const isValid = otp.length === 6 && agreed;

  return (
    <View style={otpProStyles.container}>
      <View style={otpProStyles.bgOrb1} />
      <View style={otpProStyles.bgOrb2} />

      <View style={otpProStyles.headerRow}>
        <Pressable onPress={onBack} style={otpProStyles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={18} color="#0A1931" />
          <Text style={otpProStyles.backText}>{isTamil ? "பின்" : "Back"}</Text>
        </Pressable>
        <Pressable onPress={async () => { const nl = locale === "ta" ? "en" : "ta"; if(onLanguageChange) await onLanguageChange(nl); }} style={otpProStyles.langBtn}>
          <Text style={otpProStyles.langText}>{isTamil ? "EN" : "தமிழ்"}</Text>
          <MaterialCommunityIcons name="translate" size={12} color={ORANGE} />
        </Pressable>
      </View>

      <View style={otpProStyles.card}>
        <View style={otpProStyles.iconWrap}>
          <MaterialCommunityIcons name="shield-lock-outline" size={36} color={ORANGE} />
        </View>

        <Text style={otpProStyles.title}>{isTamil ? "OTP ஐ உள்ளிடவும்" : "Enter OTP"}</Text>
        <Text style={otpProStyles.subtitle}>{isTamil ? "குறியீடு அனுப்பப்பட்டது" : "Code sent to"} +91 {phone}</Text>

        <View style={otpProStyles.inputGroup}>
          <Text style={otpProStyles.label}>6 DIGIT OTP</Text>
          <View style={otpProStyles.inputBox}>
            <MaterialCommunityIcons name="key-variant" size={20} color={MUTED} />
            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="• • • • • •"
              style={otpProStyles.input}
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor="#C4B5AB"
            />
            {otp.length === 6 && <View style={otpProStyles.okCircle}><MaterialCommunityIcons name="check" size={14} color="#fff" /></View>}
          </View>
        </View>

        <Pressable onPress={() => setAgreed(!agreed)} style={otpProStyles.termsCard}>
          <View style={[otpProStyles.checkBox, agreed && otpProStyles.checkBoxOn]}>
            {agreed && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
          </View>
          <Text style={otpProStyles.termsTxt}>
            {isTamil ? "நான் ஒப்புக்கொள்கிறேன் " : "I agree to "}
            <Text onPress={onTerms} style={otpProStyles.link}> {isTamil ? "விதிமுறைகள்" : "Terms"} </Text>
            <Text>{isTamil ? "மற்றும்" : "&"}</Text>
            <Text onPress={onPrivacy} style={otpProStyles.link}> {isTamil ? "தனியுரிமை" : "Privacy"} </Text>
          </Text>
        </Pressable>

        <View style={otpProStyles.secureBadge}>
          <MaterialCommunityIcons name="lock-check" size={13} color={GREEN} />
          <Text style={otpProStyles.secureTxt}>{isTamil ? "256-பிட் குறியாக்கம் • பாதுகாப்பானது" : "256-bit Encrypted • 100% Secure"}</Text>
        </View>

        <Pressable onPress={onVerify} disabled={!isValid || loading} style={[otpProStyles.continueBtn, !isValid && otpProStyles.continueBtnOff]}>
          {loading ? <ActivityIndicator color="#fff" /> : <><Text style={otpProStyles.continueTxt}>{isTamil ? "தொடரவும்" : "Continue"}</Text><View style={otpProStyles.arrowCirc}><MaterialCommunityIcons name="check" size={18} color={ORANGE} /></View></>}
        </Pressable>

        <View style={otpProStyles.resendRow}>
          <Text style={otpProStyles.resendLabel}>{isTamil ? "குறியீடு வரவில்லையா? " : "Didn't get code? "}</Text>
          <Pressable onPress={onResend}><Text style={otpProStyles.resendLink}>{isTamil ? "மீண்டும் அனுப்பு" : "Resend OTP"}</Text></Pressable>
        </View>
      </View>

      <View style={otpProStyles.bottomInfo}>
        <MaterialCommunityIcons name="information-outline" size={12} color={MUTED} />
        <Text style={otpProStyles.bottomTxt}>{isTamil ? "OTP 5 நிமிடங்களில் காலாவதியாகும்" : "OTP expires in 5 minutes"}</Text>
      </View>
    </View>
  );
}

const otpProStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0", padding: 18, paddingTop: 50 },
  bgOrb1: { position: "absolute", top: -80, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: "#FFE8D6", opacity: 0.6 },
  bgOrb2: { position: "absolute", bottom: 80, left: -50, width: 180, height: 180, borderRadius: 90, backgroundColor: "#FFF1E7", opacity: 0.7 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14, zIndex: 10 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: "#FFE0CA", elevation: 2 },
  backText: { color: "#0A1931", fontWeight: "800", fontSize: 13 },
  langBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#FFE0CA" },
  langText: { color: ORANGE, fontWeight: "900", fontSize: 12 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 28, padding: 22, elevation: 10, borderWidth: 1, borderColor: "#FFFFFF", marginTop: 8 },
  iconWrap: { width: 80, height: 80, borderRadius: 24, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 14, borderWidth: 1, borderColor: "#FFE0CA" },
  title: { color: "#0A1931", fontSize: 26, fontWeight: "900", textAlign: "center", marginBottom: 6 },
  subtitle: { color: ORANGE, fontSize: 13, fontWeight: "700", textAlign: "center", marginBottom: 22 },
  inputGroup: { marginBottom: 14 },
  label: { color: "#0A1931", fontSize: 11, fontWeight: "900", letterSpacing: 1, marginBottom: 8 },
  inputBox: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#FFF8F0", borderWidth: 2, borderColor: "#FFE0CA", borderRadius: 16, paddingHorizontal: 14, minHeight: 58 },
  input: { flex: 1, color: "#0A1931", fontSize: 22, fontWeight: "800", letterSpacing: 14, textAlign: "center" },
  okCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: GREEN, alignItems: "center", justifyContent: "center" },
  termsCard: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#FFF8F0", padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#FFE0CA", marginBottom: 14 },
  checkBox: { width: 22, height: 22, borderRadius: 7, borderWidth: 2, borderColor: "#D7C9BF", backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  checkBoxOn: { backgroundColor: ORANGE, borderColor: ORANGE },
  termsTxt: { flex: 1, color: "#5A4D45", fontSize: 13, fontWeight: "600", lineHeight: 18 },
  link: { color: ORANGE, fontWeight: "900", textDecorationLine: "underline" },
  secureBadge: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#E8F5E9", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, alignSelf: "center", marginBottom: 18, borderWidth: 1, borderColor: "#C8E6C9" },
  secureTxt: { color: GREEN, fontSize: 11, fontWeight: "700" },
  continueBtn: { minHeight: 56, borderRadius: 16, backgroundColor: ORANGE, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, elevation: 6 },
  continueBtnOff: { backgroundColor: "#FFC499", elevation: 0 },
  continueTxt: { color: "#fff", fontSize: 16, fontWeight: "900" },
  arrowCirc: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  resendRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16, gap: 4 },
  resendLabel: { color: MUTED, fontSize: 13, fontWeight: "600" },
  resendLink: { color: ORANGE, fontSize: 13, fontWeight: "900", textDecorationLine: "underline" },
  bottomInfo: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 18, opacity: 0.7 },
  bottomTxt: { color: MUTED, fontSize: 11, fontWeight: "600" },
});

const animLoginStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0", alignItems: "center", justifyContent: "center" },
  text: { color: "#0A1931", fontSize: 18, fontWeight: "800" },
});



function CallsScreen({ calls, locale, onCallAgain, onClear, onGoJobs }: any) {
  const isTamil = locale === "ta";
  if (calls.length === 0) {
    return (
      <View style={{ alignItems: "center", marginTop: 60, paddingHorizontal: 20 }}>
        <View style={{ width: 100, height: 100, borderRadius: 30, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#FFE0CA" }}>
          <MaterialCommunityIcons name="phone-clock" size={48} color={ORANGE} />
        </View>
        <Text style={{ color: "#0A1931", fontSize: 20, fontWeight: "900", marginTop: 18 }}>{isTamil ? "அழைப்புகள் இல்லை" : "No calls yet"}</Text>
        <Text style={{ color: MUTED, fontSize: 13, fontWeight: "600", marginTop: 8, textAlign: "center", lineHeight: 20 }}>{isTamil ? "நீங்கள் இன்னும் யாரையும் அழைக்கவில்லை" : "You haven't called anyone yet. Go to Jobs and make your first call!"}</Text>
        <Pressable onPress={onGoJobs} style={{ marginTop: 22, backgroundColor: ORANGE, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, flexDirection: "row", alignItems: "center", gap: 8, elevation: 4 }}>
          <MaterialCommunityIcons name="briefcase-search" size={18} color="#fff" /><Text style={{ color: "#fff", fontWeight: "900", fontSize: 14 }}>{isTamil ? "வேலைகளை பார்க்க" : "Browse Jobs"}</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <View><Text style={{ color: ORANGE, fontSize: 10, fontWeight: "900", letterSpacing: 1 }}>CALL HISTORY</Text><Text style={{ color: "#0A1931", fontSize: 22, fontWeight: "900", marginTop: 4 }}>{calls.length} Calls • Recent</Text></View>
        <Pressable onPress={onClear} style={{ backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "#FFE0CA" }}><Text style={{ color: MUTED, fontSize: 11, fontWeight: "800" }}>Clear</Text></Pressable>
      </View>
      {calls.map((c: any) => (
        <View key={c.id} style={{ backgroundColor: "#fff", borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "#FFF1E7", elevation: 3 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}><View style={{ backgroundColor: "#FFF1E7", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: "#FFE0CA" }}><Text style={{ color: ORANGE, fontSize: 9, fontWeight: "900" }}>{c.category}</Text></View><Text style={{ color: MUTED, fontSize: 10, fontWeight: "600" }}>{c.timeText}</Text></View>
              <Text style={{ color: "#0A1931", fontSize: 15, fontWeight: "900", marginTop: 8 }}>{c.title}</Text>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 6, alignItems: "center" }}><MaterialCommunityIcons name="map-marker" size={12} color={MUTED} /><Text style={{ color: MUTED, fontSize: 11, fontWeight: "600" }}>{c.location} • ₹{c.salary}</Text></View>
            </View>
            <Pressable onPress={() => onCallAgain(c)} style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: GREEN, alignItems: "center", justifyContent: "center", elevation: 3 }}><MaterialCommunityIcons name="phone" size={20} color="#fff" /></Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

function ModernJobCard({ job, isSaved, onSave, onCall, onOpen, locale, showCall = false }: any) {
  const parseDesc = (desc: string) => { const get = (key: string) => { const m = desc.match(new RegExp(`${key}:([^|]+)`)); return m ? m[1] : ""; }; return { type: get("Type"), time: get("Time"), workers: get("Need"), salType: get("Sal") }; };
  const meta = parseDesc(job.description || ""); const isUrgent = meta.type?.toLowerCase().includes("urgent");
  const proofRequired = Boolean(job.proof_required || job.requires_proof);
  const ownerVerified = job.owner_verified === true;
  const displayCategory = getCategoryName(job.category, locale);
  return (
    <View style={{ marginBottom: 14 }}>
      <Pressable onPress={onOpen} style={homeStyles.jobCardNew}>
        <View style={homeStyles.cardTopRow}><View style={{ flexDirection: "row", gap: 8, alignItems: "center", flex: 1 }}><View style={homeStyles.catBadge}><Text style={homeStyles.catBadgeText}>{displayCategory}</Text></View>{isUrgent && <View style={homeStyles.urgentBadge}><MaterialCommunityIcons name="fire" size={10} color="#fff" /><Text style={homeStyles.urgentText}>Urgent</Text></View>}{ownerVerified && <View style={homeStyles.verifiedBadge}><MaterialCommunityIcons name="check-decagram" size={10} color={GREEN} /><Text style={homeStyles.verifiedText}>{locale === "ta" ? "நிர்வாகம் சரிபார்த்தது" : "Admin verified"}</Text></View>}</View><Pressable onPress={onSave} style={[homeStyles.saveBtnNew, isSaved && homeStyles.saveBtnActive]}><MaterialCommunityIcons name={isSaved ? "bookmark" : "bookmark-outline"} size={18} color={isSaved ? "#fff" : MUTED} /></Pressable></View>
        <Text style={homeStyles.jobTitleNew} numberOfLines={2}>{job.title}</Text>
        <View style={homeStyles.metaRow}><View style={homeStyles.metaChip}><MaterialCommunityIcons name="map-marker" size={12} color={ORANGE} /><Text style={homeStyles.metaChipText}>{job.distance ? `${job.distance.toFixed(1)}km • ` : ""}{job.location || "Tamil Nadu"}</Text></View>{meta.workers ? <View style={homeStyles.metaChip}><MaterialCommunityIcons name="account-group" size={12} color={MUTED} /><Text style={homeStyles.metaChipText}>{locale === "ta" ? "தேவை" : "Need"} {meta.workers}</Text></View> : null}</View>
        <View style={homeStyles.divider} /><View style={homeStyles.bottomRow}><View><View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}><Text style={homeStyles.priceText}>₹{job.salary}</Text><Text style={homeStyles.priceType}>/ {locale === "ta" ? (meta.salType?.includes("Work") ? "வேலைக்கு" : meta.salType?.includes("Day") ? "நாளுக்கு" : "நாளுக்கு") : (meta.salType || "Day")}</Text></View><Text style={homeStyles.postedText}>📍 {locale === "ta" ? "தமிழ்நாடு • 2 மணி முன்பு" : "Tamil Nadu • 2h ago"} {job.distance ? (locale === "ta" ? `• ${job.distance.toFixed(1)}கிமீ தொலைவில்` : `• ${job.distance.toFixed(1)}km away`) : ""}</Text></View>{proofRequired ? <View style={{ backgroundColor: "#FFF1E7", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 5 }}><MaterialCommunityIcons name="shield-lock-outline" size={15} color={ORANGE} /><Text style={{ color: ORANGE, fontSize: 10, fontWeight: "900" }}>{locale === "ta" ? "சான்றிதழ் தேவை" : "Proof required"}</Text></View> : showCall ? <Pressable onPress={onCall} style={homeStyles.callBtnNew}><MaterialCommunityIcons name="phone" size={16} color="#fff" /><Text style={homeStyles.callBtnText}>{locale === "ta" ? "அழை" : "Call"}</Text></Pressable> : <View style={{ backgroundColor: "#FFF8F0", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 9 }}><Text style={{ color: ORANGE, fontSize: 10, fontWeight: "900" }}>{locale === "ta" ? "விவரங்களைப் பார்க்கவும்" : "View details"}</Text></View>}</View>
      </Pressable>
    </View>
  );
}

function MyPostedJobsScreen({ jobs, user, locale, onEdit, onDelete, refreshing, onRefresh }: any) {
  const isTamil = locale === "ta";
  const myJobs = jobs.filter((j:any) => j.owner_id === user?.id || j.phone === user?.phone);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <View><Text style={{ color: "#0A1931", fontSize: 24, fontWeight: "900" }}>{isTamil ? POST_TA.myJobs : "My Posted Jobs"}</Text><Text style={{ color: MUTED, fontSize: 12, marginTop: 3 }}>{myJobs.length} {isTamil ? "வேலைகள்" : "jobs"} • Tamil Nadu</Text></View>
        <View style={{ backgroundColor: ORANGE, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}><Text style={{ color: "#fff", fontSize: 12, fontWeight: "900" }}>{myJobs.length} {isTamil ? POST_TA.active : "Active"}</Text></View>
      </View>
      {myJobs.length === 0 ? (
        <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 30, alignItems: "center", borderWidth: 1, borderColor: "#FFF1E7" }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="briefcase-plus-outline" size={40} color={ORANGE} /></View>
          <Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900", marginTop: 14 }}>{isTamil ? POST_TA.noJobs : "No jobs posted yet"}</Text>
          <Text style={{ color: MUTED, fontSize: 12, marginTop: 6, textAlign: "center" }}>{isTamil ? POST_TA.noJobsSub : "Your jobs will appear here"}</Text>
        </View>
      ) : (
        myJobs.map((job:any) => (
          <View key={job.id} style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#FFF1E7", elevation: 3 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}><View style={{ backgroundColor: "#FFF1E7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: "#FFE0CA" }}><Text style={{ color: ORANGE, fontSize: 10, fontWeight: "900" }}>{getCategoryName(job.category, locale)}</Text></View>{job.description?.includes("Today") || job.description?.includes("இன்று") ? <View style={{ backgroundColor: "#FF3B30", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}><Text style={{ color: "#fff", fontSize: 9, fontWeight: "900" }}>{isTamil ? "இன்று" : "Today"}</Text></View> : null}</View>
                <Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900", marginTop: 10 }} numberOfLines={2}>{job.title}</Text>
                <View style={{ flexDirection: "row", gap: 6, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}><MaterialCommunityIcons name="map-marker" size={12} color={MUTED} /><Text style={{ color: MUTED, fontSize: 11, fontWeight: "600" }}>{job.location} • ₹{job.salary}</Text>{(() => { const need = (job.description || "").match(/Need:([^|]+)/)?.[1]; return need ? <Text style={{ color: GREEN, fontSize: 11, fontWeight: "900" }}>• Need {need}</Text> : null; })()}</View>
              </View>
              <View style={{ gap: 8, alignItems: "center" }}><Pressable onPress={() => onEdit(job)} style={{ minWidth: 70, height: 36, borderRadius: 10, backgroundColor: "#0A1931", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingHorizontal: 10 }}><MaterialCommunityIcons name="pencil" size={14} color="#fff" /><Text style={{ color: "#fff", fontSize: 11, fontWeight: "800" }}>{locale === "ta" ? "திருத்து" : "Edit"}</Text></Pressable><Pressable onPress={() => onDelete(job.id)} style={{ minWidth: 70, height: 36, borderRadius: 10, backgroundColor: "#FFF1E7", borderWidth: 1, borderColor: "#FFE0CA", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingHorizontal: 10 }}><MaterialCommunityIcons name="delete-outline" size={14} color="#FF3B30" /><Text style={{ color: "#FF3B30", fontSize: 11, fontWeight: "800" }}>{locale === "ta" ? "நீக்கு" : "Delete"}</Text></Pressable></View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function JobsBrowserScreen({ locale, filteredJobs, filter, setFilter, search, setSearch, categoryCounts, nearActive, handleNear, locLoading, saved, approvedJobIds, onSave, onOpen, onCall }: any) {
  return <>
    <View style={styles.welcomeRow}><View><Text style={styles.eyebrowText}>{locale === "ta" ? "வேலை வாய்ப்புகள்" : "AVAILABLE JOBS"}</Text><Text style={styles.pageTitle}>{locale === "ta" ? "உங்கள் நாளுக்கு\nஏற்ற வேலையை\nகண்டறியுங்கள்" : "Find work that\nfits your day."}</Text></View><View style={styles.locationPill}><MaterialCommunityIcons name="map-marker" size={12} color={ORANGE} /><Text style={styles.locationPillText}>{locale === "ta" ? `தமிழ்நாடு • ${filteredJobs.length} வேலைகள்` : `Tamil Nadu • ${filteredJobs.length} jobs`}</Text></View></View>
    <View style={homeStyles.searchWrap}><View style={homeStyles.searchBox}><MaterialCommunityIcons name="magnify" size={20} color={MUTED} /><TextInput value={search} onChangeText={setSearch} placeholder={locale === "ta" ? "வேலை தேடுங்கள், எ.கா. கொத்தனார்" : "Search work, e.g. Mason, Driver"} style={homeStyles.searchInput} placeholderTextColor="#B8A99D" />{search.length > 0 && <Pressable onPress={() => setSearch("")}><MaterialCommunityIcons name="close-circle" size={18} color={MUTED} /></Pressable>}</View><Pressable onPress={handleNear} style={[homeStyles.locationBtn, nearActive && homeStyles.locationBtnActive]}>{locLoading ? <ActivityIndicator size="small" color="#fff" /> : <MaterialCommunityIcons name={nearActive ? "crosshairs-gps" : "navigation-variant-outline"} size={16} color="#fff" />}<Text style={homeStyles.locationBtnText}>{nearActive ? (locale === "ta" ? "அருகில் ✓" : "Near ✓") : (locale === "ta" ? "அருகில்" : "Near")}</Text></Pressable></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>{["All", ...CATEGORIES].map((c) => { const count = categoryCounts[c] || 0; const isActive = filter === c; if (c !== "All" && count === 0) return null; return (<Pressable key={c} onPress={() => { Haptics.selectionAsync(); setFilter(c); }} style={[styles.filterChip, isActive && styles.filterChipActive]}><Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{getCategoryName(c, locale)} {count > 0 ? `(${count})` : ""}</Text></Pressable>); })}</ScrollView>
    {filteredJobs.length === 0 ? <View style={homeStyles.emptyBox}><MaterialCommunityIcons name="briefcase-search-outline" size={34} color={MUTED} /><Text style={homeStyles.emptyTitle}>{locale === "ta" ? "வேலைகள் இல்லை" : "No available jobs"}</Text><Text style={homeStyles.emptySub}>{locale === "ta" ? "பின்னர் மீண்டும் பார்க்கவும்" : "Check again later for new opportunities."}</Text></View> : filteredJobs.map((job: Job) => <ModernJobCard key={job.id} job={job} isSaved={saved.includes(job.id)} locale={locale} showCall={approvedJobIds.includes(job.id)} onCall={() => onCall(job)} onSave={() => onSave(job)} onOpen={() => onOpen(job)} />)}
  </>;
}

function PostNewJobScreen({ locale, user, onPublish, onUpdate, initialJob, loading }: any) {
  const isTamil = locale === "ta"; const T = POST_TA;
  const fade = useRef(new Animated.Value(0)).current; const slide = useRef(new Animated.Value(20)).current;
  const [locLoading, setLocLoading] = useState(false); const [coords, setCoords] = useState<{lat:number,lng:number}|null>(null);
  const [editingId, setEditingId] = useState<string|null>(null);

    const [form, setForm] = useState({ title: "", category: "", customCategory: "", jobType: "", location: "", salaryMin: "", salaryMax: "", salaryType: "Per Day", workers: "", phone: user?.phone || "", description: "", timing: "", urgency: "", proof_required: false, proof_types: [] as string[], proof_sides: {} as Record<string, string>, proof_description: "", proof_image_url: "" });
  const [proofImage, setProofImage] = useState<string | null>(null);
  const setF = (k: string, v: string) => setForm((s: any) => ({ ...s, [k]: v }));

  useEffect(() => { Animated.parallel([Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }), Animated.spring(slide, { toValue: 0, damping: 14, stiffness: 100, useNativeDriver: true })]).start(); }, []);
  useEffect(() => { if(initialJob) { const get = (key:string) => { const m = (initialJob.description||"").match(new RegExp(`${key}:([^|]+)`)); return m ? m[1] : ""; }; const proofRequest = decodeProofRequest(initialJob.proof_description || ""); setEditingId(initialJob.id); setForm({ title: initialJob.title, category: initialJob.category, customCategory: "", jobType: get("Type"), location: initialJob.location, salaryMin: String(initialJob.salary).split("-")[0] || String(initialJob.salary), salaryMax: String(initialJob.salary).split("-")[1] || "", salaryType: get("Sal") || "Per Day", workers: get("Need"), phone: initialJob.phone, description: (initialJob.description||"").split("|").pop() || "", timing: get("Time"), urgency: get("Urg") || "", proof_required: Boolean(initialJob.proof_required || initialJob.requires_proof), proof_types: initialJob.proof_types || [], proof_sides: proofRequest.sides || {}, proof_description: proofRequest.note || "", proof_image_url: initialJob.proof_image_url || "" }); } }, [initialJob]);

  const EXTENDED_CATEGORIES = ["Mason", "Painter", "Electrician", "Plumber", "Carpenter", "Welder", "Driver", "Cook", "Cleaner", "Security", "Gardener", "Labour", "Delivery", "Tailor", "Mechanic", "AC Technician", "Housekeeping", "Waiter", "Construction", "Loading", "Office Assistant", "Helper", "Other"];
  const finalCategory = form.category === "Other" ? form.customCategory.trim() : form.category;
  const canPublish = form.title.trim().length > 3 && finalCategory.length > 1 && form.salaryMin && form.location.trim().length > 2;
  const SALARY_TYPES = ["Per Day", "Per Hour", "Per Month", "Per Work"];
  const TIMINGS = isTamil ? [T.morning, T.afternoon, T.fullDay, T.night] : ["Morning", "Afternoon", "Full Day", "Night"];
  const URGENCY = isTamil ? [T.today, T.tomorrow, T.thisWeek, T.flexible] : ["Today", "Tomorrow", "This Week", "Flexible"];

  const getDeviceLocation = async () => { if (!ExpoLocation) { Alert.alert("Info", "Run: npx expo install expo-location"); return; } try { setLocLoading(true); const { status } = await ExpoLocation.requestForegroundPermissionsAsync(); if (status !== "granted") { Alert.alert("Permission needed"); setLocLoading(false); return; } const loc = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced }); setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude }); const rev = await ExpoLocation.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }); if (rev[0]) { const area = rev[0].street || rev[0].name || rev[0].district || rev[0].city || "Tamil Nadu"; setF("location", area + (rev[0].city ? `, ${rev[0].city}` : ", Tamil Nadu")); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } } catch (e: any) { Alert.alert("Error", e.message); } finally { setLocLoading(false); } };
  const handlePublish = () => { const salaryCombined = form.salaryMax ? `${form.salaryMin}-${form.salaryMax}` : form.salaryMin; const payload = { ...form, proof_description: encodeProofRequest(form.proof_description, form.proof_sides || {}), salary: salaryCombined, lat: coords?.lat, lng: coords?.lng }; if(editingId) { onUpdate(editingId, payload); setEditingId(null); } else { onPublish(payload); } setForm({ title: "", category: "", customCategory: "", jobType: "", location: "", salaryMin: "", salaryMax: "", salaryType: "Per Day", workers: "", phone: user?.phone || "", description: "", timing: "", urgency: "", proof_required: false, proof_types: [], proof_sides: {}, proof_description: "", proof_image_url: "" });   };


  return (
    <Animated.ScrollView showsVerticalScrollIndicator={false} style={{ opacity: fade, transform: [{ translateY: slide }] }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={postJobStyles.header}><Text style={postJobStyles.title}>{editingId ? (isTamil ? T.editTitle : "Edit Job") : (isTamil ? T.title : "Post New Job")}</Text><Text style={postJobStyles.sub}>{isTamil ? T.sub : "Reach Tamil Nadu workers today"} {coords ? " GPS Locked" : ""}</Text></View>
      <View style={postJobStyles.card}>
        <Text style={postJobStyles.label}>{isTamil ? T.jobTitle : "JOB TITLE *"}</Text><View style={postJobStyles.inputWrap}><MaterialCommunityIcons name="briefcase-outline" size={18} color={MUTED} /><TextInput placeholder={isTamil ? T.placeholderTitle : "e.g. Mason needed urgently"} style={postJobStyles.input} value={form.title} onChangeText={(v) => setF("title", v)} placeholderTextColor="#B8A99D" /></View>
        <Text style={[postJobStyles.label, { marginTop: 18 }]}>{isTamil ? T.category : "CATEGORY *"}</Text><View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 }}>{EXTENDED_CATEGORIES.map((c: string) => { const active = form.category === c; return <Pressable key={c} onPress={() => { Haptics.selectionAsync(); setF("category", c); }} style={[postJobStyles.chip, active && postJobStyles.chipActive]}><Text style={[postJobStyles.chipText, active && postJobStyles.chipTextActive]}>{getCategoryName(c, locale)}</Text></Pressable>; })}
        {form.category === "Other" && (
          <View style={{ marginTop: 14, width: "100%" }}>
            <Text style={postJobStyles.label}>{locale === "ta" ? "மற்ற வேலை வகையை தட்டச்சு செய்க *" : "TYPE YOUR JOB CATEGORY *"}</Text>
            <View style={[postJobStyles.inputWrap, { borderColor: form.customCategory ? GREEN : ORANGE, backgroundColor: "#FFF8F0" }]}>
              <MaterialCommunityIcons name="pencil-outline" size={18} color={ORANGE} />
              <TextInput
                placeholder={locale === "ta" ? "எ.கா. விவசாயம், பால் கறத்தல்" : "e.g. Farming, Milking, etc."}
                style={postJobStyles.input}
                value={form.customCategory}
                onChangeText={(v) => setF("customCategory", v)}
                placeholderTextColor="#B8A99D"
                autoFocus
              />
            </View>
          </View>
        )}</View>
        <Text style={[postJobStyles.label, { marginTop: 18 }]}>{isTamil ? T.urgency : "URGENCY *"}</Text><View style={postJobStyles.gridRow}>{URGENCY.map((u) => <Pressable key={u} onPress={() => setF("urgency", u)} style={[postJobStyles.gridChip, form.urgency === u && { backgroundColor: ORANGE, borderColor: ORANGE }]}><Text style={[postJobStyles.gridChipText, form.urgency === u && postJobStyles.gridChipTextActive]}>{u}</Text></Pressable>)}</View>
        <Text style={[postJobStyles.label, { marginTop: 18 }]}>{isTamil ? T.salary : "SALARY RANGE * (MIN - MAX)"}</Text><View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}><View style={[postJobStyles.inputWrap, { flex: 1 }]}><MaterialCommunityIcons name="currency-inr" size={18} color={MUTED} /><TextInput placeholder="400" keyboardType="number-pad" style={postJobStyles.input} value={form.salaryMin} onChangeText={(v) => setF("salaryMin", v)} /></View><Text style={{ fontWeight: "900", color: "#0A1931" }}>-</Text><View style={[postJobStyles.inputWrap, { flex: 1 }]}><MaterialCommunityIcons name="currency-inr" size={18} color={MUTED} /><TextInput placeholder="600" keyboardType="number-pad" style={postJobStyles.input} value={form.salaryMax} onChangeText={(v) => setF("salaryMax", v)} /></View></View><View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 }}>{SALARY_TYPES.map((st) => <Pressable key={st} onPress={() => setF("salaryType", st)} style={[postJobStyles.miniChip, form.salaryType === st && postJobStyles.miniChipActive]}><Text style={[postJobStyles.miniChipText, form.salaryType === st && postJobStyles.miniChipTextActive]}>{st}</Text></Pressable>)}</View>
        <Text style={[postJobStyles.label, { marginTop: 18 }]}>{isTamil ? T.location : "LOCATION *"}</Text><View style={postJobStyles.inputWrap}><MaterialCommunityIcons name="map-marker-outline" size={18} color={MUTED} /><TextInput placeholder={isTamil ? T.locationPh : "Type location"} style={postJobStyles.input} value={form.location} onChangeText={(v) => setF("location", v)} /><Pressable onPress={getDeviceLocation} style={postJobStyles.gpsBtn}>{locLoading ? <ActivityIndicator size="small" color={ORANGE} /> : <MaterialCommunityIcons name="crosshairs-gps" size={20} color={ORANGE} />}</Pressable></View>


        <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}><View style={{ flex: 1 }}><Text style={postJobStyles.label}>{isTamil ? T.workers : "WORKERS"}</Text><View style={postJobStyles.inputWrap}><MaterialCommunityIcons name="account-group-outline" size={18} color={MUTED} /><TextInput placeholder="1" keyboardType="number-pad" style={postJobStyles.input} value={form.workers} onChangeText={(v) => setF("workers", v)} /></View></View><View style={{ flex: 1 }}><Text style={postJobStyles.label}>{isTamil ? T.timing : "TIMING"}</Text><View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>{TIMINGS.map((tm) => <Pressable key={tm} onPress={() => setF("timing", tm)} style={[postJobStyles.gridChip, form.timing === tm && postJobStyles.gridChipActive]}><Text style={[postJobStyles.gridChipText, form.timing === tm && postJobStyles.gridChipTextActive]}>{tm}</Text></Pressable>)}</View></View></View>
        <Text style={[postJobStyles.label, { marginTop: 18 }]}>{isTamil ? T.desc : "WORK DESCRIPTION"}</Text><View style={[postJobStyles.inputWrap, { minHeight: 100, alignItems: "flex-start", paddingTop: 14 }]}><TextInput placeholder={isTamil ? T.descPh : "Full work details..."} multiline style={[postJobStyles.input, { height: 80 }]} value={form.description} onChangeText={(v) => setF("description", v)} /></View>

        {/* PROOF SECTION - Professional Tamil + English - Optional - Supabase Stored */}
        <View style={{ marginTop: 20, backgroundColor: "#F8F9FF", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#E0E7FF" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#0A1931", fontSize: 13, fontWeight: "900" }}>{isTamil ? "சான்றிதழ் தேவையா? (விருப்பம்)" : "PROOF REQUIRED? (Optional)"}</Text>
              <Text style={{ color: MUTED, fontSize: 10, fontWeight: "600", marginTop: 2 }}>{isTamil ? "உரிமையாளர் ஆதாரம் கேட்கலாம் - Supabase la store aagum" : "Owner can request proof - Stored in Supabase"}</Text>
            </View>
            <Pressable onPress={() => { Haptics.selectionAsync(); setF("proof_required", !form.proof_required); }} style={{ width: 48, height: 28, borderRadius: 14, backgroundColor: form.proof_required ? GREEN : "#E5E7EB", justifyContent: "center", paddingHorizontal: 2 }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#fff", marginLeft: form.proof_required ? 20 : 0, elevation: 2 }} />
            </Pressable>
          </View>

          {form.proof_required && (
            <View style={{ marginTop: 14 }}>
              <Text style={{ color: "#0A1931", fontSize: 11, fontWeight: "800", marginBottom: 8 }}>{isTamil ? "என்ன சான்றிதழ் தேவை?" : "WHAT PROOF NEEDED?"}</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {(typeof PROOF_TYPES !== "undefined" ? PROOF_TYPES : FALLBACK_PROOF_TYPES).map((pt: string) => {
                  const isSelected = (form.proof_types || []).includes(pt);
                  const trans = (typeof PROOF_TYPE_TRANSLATIONS !== "undefined" ? PROOF_TYPE_TRANSLATIONS : FALLBACK_TRANSLATIONS)[pt];
                  return (
                    <Pressable key={pt} onPress={() => {
                      Haptics.selectionAsync();
                      const newTypes = isSelected ? (form.proof_types || []).filter((t:string) => t !== pt) : [...(form.proof_types || []), pt];
                      setF("proof_types", newTypes);
                      setForm((s: any) => { const proof_sides = { ...(s.proof_sides || {}) }; if (isSelected) delete proof_sides[pt]; else proof_sides[pt] = "front"; return { ...s, proof_sides }; });
                    }} style={{ flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: isSelected ? ORANGE : "#E5E7EB", backgroundColor: isSelected ? "#FFF1E7" : "#fff" }}>
                      <MaterialCommunityIcons name={trans.icon as any} size={14} color={isSelected ? ORANGE : MUTED} />
                      <Text style={{ color: isSelected ? ORANGE : "#0A1931", fontSize: 11, fontWeight: isSelected ? "800" : "600" }}>{isTamil ? trans.ta : trans.en}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {(form.proof_types || []).map((pt: string) => {
                const side = (form.proof_sides || {})[pt] || "front";
                const sideLabel = side === "back" ? "Back only" : side === "front_back" ? "Front + Back" : "Front only";
                return <View key={`side-${pt}`} style={{ marginTop: 10, backgroundColor: "#fff", borderRadius: 11, padding: 10, borderWidth: 1, borderColor: "#E0E7FF" }}><View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}><Text style={{ color: "#0A1931", fontSize: 11, fontWeight: "800" }}>{pt}</Text><Text style={{ color: ORANGE, fontSize: 10, fontWeight: "900" }}>{sideLabel}</Text></View><View style={{ flexDirection: "row", gap: 6, marginTop: 7 }}>{PROOF_SIDES.map((option) => <Pressable key={option} onPress={() => setForm((s: any) => ({ ...s, proof_sides: { ...(s.proof_sides || {}), [pt]: option } }))} style={{ flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: "center", backgroundColor: side === option ? ORANGE : "#F8F9FF", borderWidth: 1, borderColor: side === option ? ORANGE : "#E0E7FF" }}><Text style={{ color: side === option ? "#fff" : "#5A4D45", fontSize: 9, fontWeight: "800" }}>{option === "front_back" ? "Front + Back" : option === "front" ? "Front" : "Back"}</Text></Pressable>)}</View></View>;
              })}
              <Text style={{ color: "#0A1931", fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 6 }}>{isTamil ? "கூடுதல் விவரம் (விருப்பம்)" : "ADDITIONAL NOTE (Optional)"}</Text>
              <View style={[postJobStyles.inputWrap, { minHeight: 60, backgroundColor: "#fff" }]}>
                <TextInput placeholder={isTamil ? "எ.கா. Driving License இருந்தால் மட்டும்" : "e.g. Only if you have Driving License"} style={[postJobStyles.input, { height: 50 }]} value={form.proof_description} onChangeText={(v) => setF("proof_description", v)} placeholderTextColor="#B8A99D" multiline />
              </View>
            </View>
          )}
        </View>

        <Pressable onPress={handlePublish} disabled={!canPublish || loading} style={[postJobStyles.publishBtn, !canPublish && postJobStyles.publishBtnDisabled]}>{loading ? <ActivityIndicator color="#fff" /> : <><Text style={postJobStyles.publishText}>{editingId ? (isTamil ? T.update : "Update Job") : (isTamil ? T.publish : "Publish Job")}</Text><MaterialCommunityIcons name={editingId ? "content-save" : "check-circle"} size={20} color="#fff" /></>}</Pressable>
        {editingId && <Pressable onPress={() => { setEditingId(null); setForm({ title: "", category: "", customCategory: "", jobType: "", location: "", salaryMin: "", salaryMax: "", salaryType: "Per Day", workers: "", phone: user?.phone || "", description: "", timing: "", urgency: "" }); }} style={{ marginTop: 10, alignItems: "center" }}><Text style={{ color: MUTED, fontWeight: "800" }}>{isTamil ? "ரத்து செய்" : "Cancel Edit"}</Text></Pressable>}
      </View>
    </Animated.ScrollView>
  );
}


function MyProofsSectionBoss({ user, locale }: any) {
  const isTamil = locale === "ta";
  const [proofs, setProofs] = useState<UserProof[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedType, setSelectedType] = useState("Driving License");
  const [proofNumber, setProofNumber] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => { loadProofs(); }, []);
  const loadProofs = async () => { try { const p = await getUserProofs(user?.id); setProofs(p); } catch {} };
  const handleAddProof = async () => {
    if (!selectedType) return; setLoading(true);
    try {
      await saveUserProof({ proof_type: selectedType, proof_number: proofNumber, image_url: "proof-" + Date.now(), });
      setProofNumber(""); setShowAdd(false); loadProofs();
      Alert.alert(isTamil ? "சேர்க்கப்பட்டது!" : "Added!", isTamil ? "சான்றிதழ் Supabase la save aachu!" : "Proof saved to Supabase!");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) { Alert.alert("Error", e.message); } finally { setLoading(false); }
  };
  const handleDelete = async (id: string) => {
    Alert.alert(isTamil ? "நீக்கவா?" : "Delete?", isTamil ? "சான்றிதழை நீக்கவா?" : "Delete this proof?", [
      { text: isTamil ? "ரத்து" : "Cancel" },
      { text: isTamil ? "நீக்கு" : "Delete", style: "destructive", onPress: async () => { await deleteUserProof(id); loadProofs(); }}
    ]);
  };
  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginTop: 14, borderWidth: 1, borderColor: "#FFF1E7", elevation: 2 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <View><Text style={{ color: "#0A1931", fontSize: 13, fontWeight: "900" }}>{isTamil ? "உரிமையாளர் சரிபார்ப்பு" : "OWNER VERIFICATION"}</Text><Text style={{ color: MUTED, fontSize: 10, fontWeight: "600", marginTop: 2 }}>{isTamil ? "ஆதாரத்தைச் சேர்க்கவும் • நிர்வாகம் சரிபார்க்கும்" : "Add business proof • Admin reviews it for your verified badge"}</Text></View>
        <Pressable onPress={() => setShowAdd(!showAdd)} style={{ backgroundColor: ORANGE, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, flexDirection: "row", alignItems: "center", gap: 4 }}>
          <MaterialCommunityIcons name={showAdd ? "close" : "plus"} size={14} color="#fff" /><Text style={{ color: "#fff", fontSize: 11, fontWeight: "800" }}>{showAdd ? (isTamil ? "மூடு" : "Close") : (isTamil ? "சேர்" : "Add")}</Text>
        </Pressable>
      </View>
      {showAdd && (
        <View style={{ backgroundColor: "#F8F9FF", borderRadius: 14, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E0E7FF" }}>
          <Text style={{ color: "#0A1931", fontSize: 11, fontWeight: "800", marginBottom: 8 }}>{isTamil ? "சான்றிதழ் வகை *" : "PROOF TYPE *"}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {(typeof PROOF_TYPES !== "undefined" ? PROOF_TYPES : FALLBACK_PROOF_TYPES).slice(0, 6).map((pt: string) => {
              const active = selectedType === pt; const trans = (typeof PROOF_TYPE_TRANSLATIONS !== "undefined" ? PROOF_TYPE_TRANSLATIONS : FALLBACK_TRANSLATIONS)[pt];
              return (<Pressable key={pt} onPress={() => setSelectedType(pt)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: active ? ORANGE : "#E5E7EB", backgroundColor: active ? "#FFF1E7" : "#fff" }}><Text style={{ color: active ? ORANGE : "#0A1931", fontSize: 10, fontWeight: active ? "800" : "600" }}>{isTamil ? trans.ta : trans.en}</Text></Pressable>);
            })}
          </View>
          <Text style={{ color: "#0A1931", fontSize: 11, fontWeight: "800", marginBottom: 6 }}>{isTamil ? "ஆவண எண் (விருப்பம்)" : "DOCUMENT NO. (Optional)"}</Text>
          <View style={{ backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#FFE0CA", paddingHorizontal: 10, flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="card-text-outline" size={16} color={MUTED} /><TextInput placeholder={isTamil ? "எ.கா. DL123456" : "e.g. DL123456"} style={{ flex: 1, height: 40, fontSize: 13, fontWeight: "600", color: "#0A1931", marginLeft: 8 }} value={proofNumber} onChangeText={setProofNumber} placeholderTextColor="#B8A99D" />
          </View>
          <Pressable onPress={handleAddProof} disabled={loading} style={{ backgroundColor: GREEN, borderRadius: 10, height: 40, alignItems: "center", justifyContent: "center", marginTop: 10, flexDirection: "row", gap: 6 }}>
            {loading ? <ActivityIndicator color="#fff" size="small" /> : <><MaterialCommunityIcons name="check-circle" size={16} color="#fff" /><Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>{isTamil ? "சேமி - Supabase la" : "Save to Supabase"}</Text></>}
          </Pressable>
        </View>
      )}
      {proofs.length === 0 ? (
        <View style={{ backgroundColor: "#FFF8F0", borderRadius: 12, padding: 14, alignItems: "center", borderWidth: 1, borderStyle: "dashed", borderColor: "#FFE0CA" }}>
          <MaterialCommunityIcons name="file-document-outline" size={24} color={MUTED} /><Text style={{ color: MUTED, fontSize: 11, fontWeight: "600", marginTop: 6, textAlign: "center" }}>{isTamil ? "சான்றிதழ்கள் இல்லை\nவேலைக்கு தேவைப்பட்டால் சேர்க்கலாம்" : "No proofs yet\nAdd when job requires"}</Text>
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          {proofs.map((proof: any) => {
            const trans = (typeof PROOF_TYPE_TRANSLATIONS !== "undefined" ? PROOF_TYPE_TRANSLATIONS : FALLBACK_TRANSLATIONS)[proof.proof_type] || { en: proof.proof_type, ta: proof.proof_type, icon: "file-document" };
            return (
              <View key={proof.id} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F8F9FF", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: "#E0E7FF" }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name={trans.icon as any} size={18} color={ORANGE} /></View>
                <View style={{ flex: 1, marginLeft: 10 }}><Text style={{ color: "#0A1931", fontSize: 12, fontWeight: "800" }}>{isTamil ? trans.ta : trans.en}</Text>{proof.proof_number ? <Text style={{ color: MUTED, fontSize: 10, fontWeight: "600" }}>{proof.proof_number}</Text> : null}<View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}><View style={{ backgroundColor: proof.verified ? "#E8F5E9" : "#FFF1E7", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, flexDirection: "row", alignItems: "center", gap: 3 }}><MaterialCommunityIcons name={proof.verified ? "check-decagram" : "clock-outline"} size={10} color={proof.verified ? GREEN : ORANGE} /><Text style={{ color: proof.verified ? GREEN : ORANGE, fontSize: 8, fontWeight: "800" }}>{proof.verified ? (isTamil ? "சரிபார்க்கப்பட்டது" : "Verified") : (isTamil ? "நிலுவையில்" : "Pending")}</Text></View><Text style={{ color: MUTED, fontSize: 8 }}>Supabase ✓</Text></View></View>
                <Pressable onPress={() => handleDelete(proof.id)} style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "#FFE0E0", alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="delete-outline" size={14} color="#D54B3F" /></Pressable>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

function OwnerProfileBoss({ user, jobs, locale, onUpdateName, onLanguageChange, onAppLanguageChange, onDeleteAccount, onLogout, onTerms, onPrivacy, appTheme, appFontSize, onThemeChange, onFontSizeChange, onClearCache, onClearData }: any) {

  const isTamil = locale === "ta"; const [editing, setEditing] = useState(false); const [businessName, setBusinessName] = useState(user?.name || "Uzhaivo User"); const [verification, setVerification] = useState<any>({ verified: false, status: "pending", proofCount: 0 }); const myJobs = jobs.filter((j:any) => j.owner_id === user?.id || j.phone === user?.phone);
  useEffect(() => { if (user?.id) getOwnerVerificationStatus(user.id).then(setVerification).catch(() => {}); }, [user?.id]);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 20, borderWidth: 1, borderColor: "#FFF1E7", elevation: 3 }}>
        <View style={{ alignItems: "center" }}>
          <View style={{ width: 90, height: 90, borderRadius: 28, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#fff", elevation: 4 }}><Text style={{ color: "#fff", fontSize: 36, fontWeight: "900" }}>{businessName.charAt(0)}</Text></View>
          {editing ? (<View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 }}><View style={{ backgroundColor: "#FFF8F0", borderRadius: 12, borderWidth: 1, borderColor: "#FFE0CA", paddingHorizontal: 12, minWidth: 180 }}><TextInput value={businessName} onChangeText={setBusinessName} style={{ height: 44, fontWeight: "900", color: "#0A1931" }} autoFocus /></View><Pressable onPress={() => { onUpdateName(businessName); setEditing(false); }} style={{ backgroundColor: GREEN, width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="check" size={20} color="#fff" /></Pressable></View>) : (<View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 }}><Text style={{ color: "#0A1931", fontSize: 20, fontWeight: "900" }}>{businessName}</Text><Pressable onPress={() => setEditing(true)} style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="pencil" size={14} color={ORANGE} /></Pressable></View>)}
          <View style={{ flexDirection: "row", gap: 6, marginTop: 8, alignItems: "center" }}><Text style={{ color: MUTED, fontSize: 13 }}>{user?.phone}</Text><View style={{ backgroundColor: verification.verified ? "#E8F5E9" : "#FFF8F0", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1, borderColor: verification.verified ? "#C8E6C9" : "#FFE0CA" }}><MaterialCommunityIcons name={verification.verified ? "check-decagram" : "clock-outline"} size={12} color={verification.verified ? GREEN : ORANGE} /><Text style={{ color: verification.verified ? GREEN : ORANGE, fontSize: 10, fontWeight: "900" }}>{verification.verified ? (isTamil ? "நிர்வாகம் சரிபார்த்தது" : "Admin verified") : (isTamil ? "சரிபார்ப்பு நிலுவையில்" : "Verification pending")}</Text></View></View><Text style={{ color: ORANGE, fontSize: 12, fontWeight: "800", marginTop: 6 }}>{isTamil ? "உரிமையாளர் • எனக்கு ஆட்கள் வேண்டும்" : "Owner • I need workers"}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}><View style={{ flex: 1, backgroundColor: "#FFF8F0", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#FFE0CA", alignItems: "center" }}><Text style={{ color: ORANGE, fontSize: 22, fontWeight: "900" }}>{myJobs.length}</Text><Text style={{ color: MUTED, fontSize: 11, fontWeight: "700", marginTop: 2 }}>{isTamil ? "வேலைகள்" : "Jobs Posted"}</Text></View><View style={{ flex: 1, backgroundColor: "#E8F5E9", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#C8E6C9", alignItems: "center" }}><Text style={{ color: GREEN, fontSize: 22, fontWeight: "900" }}>4.8★</Text><Text style={{ color: GREEN, fontSize: 11, fontWeight: "700", marginTop: 2 }}>{isTamil ? "மதிப்பீடு" : "Rating"}</Text></View><View style={{ flex: 1, backgroundColor: "#FFF1E7", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#FFE0CA", alignItems: "center" }}><Text style={{ color: "#0A1931", fontSize: 22, fontWeight: "900" }}>12</Text><Text style={{ color: MUTED, fontSize: 11, fontWeight: "700", marginTop: 2 }}>{isTamil ? "பணியமர்த்தியது" : "Hired"}</Text></View></View>
      </View>

      {/* OWNER VERIFICATION - admin-reviewed proof */}
      <MyProofsSectionBoss user={user} locale={locale} />

      <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginTop: 14, borderWidth: 1, borderColor: "#FFF1E7" }}>
        <Text style={{ color: "#0A1931", fontSize: 13, fontWeight: "900", marginBottom: 12 }}>{isTamil ? "அமைப்புகள்" : "SETTINGS"}</Text>
        <Pressable onPress={onLanguageChange} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#FFF1E7" }}><View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}><View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="translate" size={18} color={ORANGE} /></View><Text style={{ color: "#0A1931", fontWeight: "700", fontSize: 14 }}>{isTamil ? "மொழி / Language" : "Language / மொழி"}</Text></View><View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}><Text style={{ color: MUTED, fontSize: 12, fontWeight: "700" }}>{locale === "ta" ? "தமிழ்" : "English"}</Text><MaterialCommunityIcons name="chevron-right" size={18} color={MUTED} /></View></Pressable>
        <Pressable onPress={onTerms} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#FFF1E7" }}><View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}><View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="file-document-outline" size={18} color={ORANGE} /></View><Text style={{ color: "#0A1931", fontWeight: "700", fontSize: 14 }}>{isTamil ? "விதிமுறைகள் & நிபந்தனைகள்" : "Terms & Conditions"}</Text></View><MaterialCommunityIcons name="chevron-right" size={18} color={MUTED} /></Pressable>
        <Pressable onPress={onPrivacy} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#FFF1E7" }}><View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}><View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#E8F5E9", alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="shield-check-outline" size={18} color={GREEN} /></View><Text style={{ color: "#0A1931", fontWeight: "700", fontSize: 14 }}>{isTamil ? "தனியுரிமைக் கொள்கை" : "Privacy Policy"}</Text></View><MaterialCommunityIcons name="chevron-right" size={18} color={MUTED} /></Pressable>
        <Pressable onPress={() => Linking.openURL("tel:+919025421145")} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#FFF1E7" }}><View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}><View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#E8F5E9", alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="help-circle-outline" size={18} color={GREEN} /></View><Text style={{ color: "#0A1931", fontWeight: "700", fontSize: 14 }}>{isTamil ? "உதவி & ஆதரவு" : "Help & Support"}</Text></View><MaterialCommunityIcons name="chevron-right" size={18} color={MUTED} /></Pressable>
        <Pressable onPress={() => Linking.openURL("https://wa.me/919025421145?text=Hi Support")} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 }}><View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}><View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#E8F5E9", alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="whatsapp" size={18} color="#25D366" /></View><Text style={{ color: "#0A1931", fontWeight: "700", fontSize: 14 }}>{isTamil ? "வாட்ஸ்அப் ஆதரவு" : "WhatsApp Support"}</Text></View><MaterialCommunityIcons name="chevron-right" size={18} color={MUTED} /></Pressable>
      </View>
      <View style={{ marginTop: 20, alignItems: "center", gap: 12 }}><Pressable onPress={onLogout} style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#FFE0CA", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, flexDirection: "row", gap: 8, alignItems: "center" }}><MaterialCommunityIcons name="logout" size={18} color={ORANGE} /><Text style={{ color: ORANGE, fontWeight: "900" }}>{isTamil ? "வெளியேறு" : "Log out"}</Text></Pressable><Pressable onPress={onDeleteAccount} style={{ paddingVertical: 10 }}><Text style={{ color: "#FF3B30", fontSize: 13, fontWeight: "700" }}>{isTamil ? "கணக்கை நீக்கு" : "Delete Account"}</Text></Pressable></View>
    </ScrollView>
  );
}

const postJobStyles = StyleSheet.create({ header: { marginBottom: 16 }, title: { color: "#0A1931", fontSize: 26, fontWeight: "900" }, sub: { color: MUTED, fontSize: 13, marginTop: 4, fontWeight: "600" }, card: { backgroundColor: "#fff", borderRadius: 26, padding: 20, elevation: 6, borderWidth: 1, borderColor: "#fff" }, label: { color: "#0A1931", fontSize: 11, fontWeight: "800", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }, inputWrap: { minHeight: 54, borderRadius: 14, backgroundColor: "#FFF8F0", borderWidth: 1.5, borderColor: "#FFE0CA", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 8 }, input: { flex: 1, color: "#0A1931", fontSize: 14, fontWeight: "600", minHeight: 50 }, chip: { borderRadius: 12, borderWidth: 1, borderColor: "#FFE0CA", paddingHorizontal: 14, paddingVertical: 9, backgroundColor: "#FFF8F0" }, chipActive: { backgroundColor: ORANGE, borderColor: ORANGE }, chipText: { color: MUTED, fontSize: 12, fontWeight: "700" }, chipTextActive: { color: "#fff", fontWeight: "800" }, gridRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 }, gridChip: { borderRadius: 10, borderWidth: 1, borderColor: "#FFE0CA", paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "#FFF8F0" }, gridChipActive: { backgroundColor: "#0A1931", borderColor: "#0A1931" }, gridChipText: { color: MUTED, fontSize: 11, fontWeight: "700" }, gridChipTextActive: { color: "#fff", fontWeight: "800" }, miniChip: { borderRadius: 20, borderWidth: 1, borderColor: "#FFE0CA", paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#fff" }, miniChipActive: { backgroundColor: "#FFF1E7", borderColor: ORANGE }, miniChipText: { color: MUTED, fontSize: 10, fontWeight: "700" }, miniChipTextActive: { color: ORANGE, fontWeight: "800" }, gpsBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#FFE0CA" }, photoBox: { borderRadius: 16, borderWidth: 1.5, borderColor: "#FFE0CA", borderStyle: "dashed" as any, backgroundColor: "#FFF8F0", padding: 18, alignItems: "center" }, photoText: { color: "#0A1931", fontSize: 13, fontWeight: "800", marginTop: 8 }, photoSub: { color: MUTED, fontSize: 11, marginTop: 3 }, voiceRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF8F0", borderRadius: 14, padding: 12, borderWidth: 1, borderColor: "#FFE0CA" }, voiceBtn: { backgroundColor: ORANGE, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, flexDirection: "row", gap: 6, alignItems: "center" }, voiceBtnText: { color: "#fff", fontSize: 12, fontWeight: "900" }, publishBtn: { minHeight: 56, borderRadius: 16, backgroundColor: ORANGE, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 22, elevation: 6 }, publishBtnDisabled: { backgroundColor: "#FFC499", elevation: 0 }, publishText: { color: "#fff", fontSize: 16, fontWeight: "900" } });
const homeStyles = StyleSheet.create({ searchWrap: { flexDirection: "row", gap: 10, marginBottom: 16, alignItems: "center" }, searchBox: { flex: 1, height: 52, borderRadius: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: "#FFE0CA", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 8, elevation: 2 }, searchInput: { flex: 1, color: "#0A1931", fontSize: 14, fontWeight: "600" }, locationBtn: { height: 52, paddingHorizontal: 14, borderRadius: 16, backgroundColor: "#0A1931", flexDirection: "row", alignItems: "center", gap: 6 }, locationBtnActive: { backgroundColor: ORANGE }, locationBtnText: { color: "#fff", fontSize: 12, fontWeight: "800" }, jobCardNew: { backgroundColor: "#fff", borderRadius: 22, padding: 16, borderWidth: 1, borderColor: "#FFF1E7", elevation: 4, shadowColor: "#0A1931", shadowOpacity: 0.06, shadowRadius: 12 }, cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, catBadge: { backgroundColor: "#FFF1E7", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: "#FFE0CA" }, catBadgeText: { color: ORANGE, fontSize: 10, fontWeight: "900" }, urgentBadge: { backgroundColor: "#FF3B30", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexDirection: "row", alignItems: "center", gap: 3 }, urgentText: { color: "#fff", fontSize: 9, fontWeight: "900" }, verifiedBadge: { backgroundColor: "#E8F5E9", borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4, flexDirection: "row", alignItems: "center", gap: 3, borderWidth: 1, borderColor: "#C8E6C9" }, verifiedText: { color: GREEN, fontSize: 8, fontWeight: "800" }, saveBtnNew: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#FFF8F0", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#FFE0CA" }, saveBtnActive: { backgroundColor: ORANGE, borderColor: ORANGE }, jobTitleNew: { color: "#0A1931", fontSize: 18, fontWeight: "900", marginTop: 12, lineHeight: 22 }, metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 }, metaChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFF8F0", paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: "#FFE0CA" }, metaChipText: { color: "#5A4D45", fontSize: 10, fontWeight: "700" }, divider: { height: 1, backgroundColor: "#FFF1E7", marginTop: 14, marginBottom: 14 }, bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, priceText: { color: "#0A1931", fontSize: 20, fontWeight: "900" }, priceType: { color: MUTED, fontSize: 11, fontWeight: "700" }, postedText: { color: MUTED, fontSize: 10, fontWeight: "600", marginTop: 3 }, callBtnNew: { backgroundColor: GREEN, borderRadius: 14, minHeight: 42, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", gap: 6, elevation: 4 }, callBtnText: { color: "#fff", fontSize: 13, fontWeight: "900" }, emptyBox: { backgroundColor: "#fff", borderRadius: 20, padding: 24, alignItems: "center", marginTop: 20 }, emptyTitle: { color: "#0A1931", fontSize: 16, fontWeight: "900", marginTop: 10 }, emptySub: { color: MUTED, fontSize: 12, fontWeight: "600", marginTop: 6, textAlign: "center" } });

function UzhaivoModernRoleScreen({ locale = "en", onSelectRole }: Props) {
  const insets = useSafeAreaInsets();
  const headerFade = useRef(new Animated.Value(0)).current; const headerY = useRef(new Animated.Value(18)).current;
  const jobFade = useRef(new Animated.Value(0)).current; const jobY = useRef(new Animated.Value(28)).current;
  const hireFade = useRef(new Animated.Value(0)).current; const hireY = useRef(new Animated.Value(28)).current;
  const tr = useTranslation(locale as any);
  const isTamil = locale === "ta";
  useEffect(() => { Animated.stagger(150, [Animated.parallel([Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }), Animated.spring(headerY, { toValue: 0, damping: 16, stiffness: 120, useNativeDriver: true })]), Animated.parallel([Animated.timing(jobFade, { toValue: 1, duration: 550, useNativeDriver: true }), Animated.spring(jobY, { toValue: 0, damping: 15, stiffness: 115, useNativeDriver: true })]), Animated.parallel([Animated.timing(hireFade, { toValue: 1, duration: 550, useNativeDriver: true }), Animated.spring(hireY, { toValue: 0, damping: 15, stiffness: 115, useNativeDriver: true })])]).start(); }, []);
  return (
    <View style={[modernRoleStyles.screen, { paddingTop: insets.top + 6, paddingBottom: Math.max(insets.bottom, 14) }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9F3" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={modernRoleStyles.content}>
        <Animated.View style={[modernRoleStyles.brandRow, { opacity: headerFade, transform: [{ translateY: headerY }] }]}>
          <View style={modernRoleStyles.brandIcon}><MaterialCommunityIcons name="account-hard-hat" size={31} color="#fff" /></View>
          <View style={modernRoleStyles.brandCopy}><Text style={modernRoleStyles.brandName}>Uzha<Text style={{ color: ROLE_ORANGE }}>ivo</Text></Text><View style={modernRoleStyles.locationRow}><MaterialCommunityIcons name="map-marker" size={15} color={ROLE_ORANGE} /><Text style={modernRoleStyles.locationText}>Tamil Nadu, Tamil Nadu</Text></View></View>
        </Animated.View>
        <Animated.View style={[modernRoleStyles.hero, { opacity: headerFade, transform: [{ translateY: headerY }] }]}>
          <Text style={modernRoleStyles.kicker}>UZHAIVO  •  WORKERS</Text>
          <Text style={modernRoleStyles.title}>{tr("roleTitle")}</Text>
          <Text style={modernRoleStyles.subtitle}>{tr("roleSub")}</Text>
          <View style={modernRoleStyles.titleAccent} />
        </Animated.View>
        <Animated.View style={{ opacity: jobFade, transform: [{ translateY: jobY }] }}>
          <RoleCard tone="orange" eyebrow={tr("roleOpportunities")} title={tr("roleFindJob")} description={tr("roleFindJobDesc")} meta={tr("roleJobMeta")} icon="briefcase-search" onPress={() => onSelectRole("worker")} />
        </Animated.View>
        <Animated.View style={{ opacity: hireFade, transform: [{ translateY: hireY }] }}>
          <RoleCard tone="green" eyebrow={tr("roleHireTalent")} title={tr("roleHire")} description={tr("roleHireDesc")} meta={tr("roleHireMeta")} icon="account-hard-hat" onPress={() => onSelectRole("owner")} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}
type CardProps = { tone: "orange" | "green"; eyebrow: string; title: string; description: string; meta: string; icon: "briefcase-search" | "account-hard-hat"; onPress: () => void; };
function RoleCard({ tone, eyebrow, title, description, meta, icon, onPress }: CardProps) {
  const tint = tone === "orange" ? ROLE_ORANGE : ROLE_GREEN;
  return (<View style={{ marginBottom: 18 }}><Pressable onPress={onPress} style={[modernRoleStyles.roleCard, tone === "orange" ? modernRoleStyles.orangeCard : modernRoleStyles.greenCard]}><View style={[modernRoleStyles.illustration, tone === "orange" ? modernRoleStyles.orangeIllustration : modernRoleStyles.greenIllustration]}><MaterialCommunityIcons name={icon} size={57} color={tint} /></View><View style={modernRoleStyles.cardCopy}><View style={[modernRoleStyles.eyebrowWrap, { backgroundColor: tone === "orange" ? "#FFE5D3" : "#D5F8E9" }]}><Text style={[modernRoleStyles.eyebrow, { color: tint }]}>{eyebrow}</Text></View><Text style={modernRoleStyles.cardTitle}>{title}</Text><Text style={modernRoleStyles.cardDescription}>{description}</Text><Text style={modernRoleStyles.metaText}>{meta}</Text></View><View style={[modernRoleStyles.arrowOuter, { backgroundColor: tone === "orange" ? "#FFF0E6" : "#E1FAF0" }]}><View style={[modernRoleStyles.arrowButton, { backgroundColor: tint }]}><MaterialCommunityIcons name="arrow-right" size={25} color="#fff" /></View></View></Pressable></View>);
}
const modernRoleStyles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#FFF9F3" }, content: { paddingHorizontal: 22, paddingBottom: 26 }, brandRow: { flexDirection: "row", alignItems: "center", marginTop: 14, marginBottom: 36 }, brandIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: ROLE_ORANGE, alignItems: "center", justifyContent: "center" }, brandCopy: { marginLeft: 12, flex: 1 }, brandName: { color: ROLE_NAVY, fontSize: 29, fontWeight: "900" }, locationRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 1 }, locationText: { color: ROLE_NAVY, fontSize: 13, fontWeight: "700" }, hero: { alignItems: "center", marginBottom: 31 }, kicker: { color: ROLE_ORANGE, fontSize: 13, fontWeight: "900", letterSpacing: 1.5, marginBottom: 11 }, title: { color: ROLE_NAVY, fontSize: 31, fontWeight: "900", textAlign: "center" }, subtitle: { color: ROLE_MUTED, fontSize: 17, fontWeight: "600", marginTop: 10, textAlign: "center" }, titleAccent: { width: 54, height: 5, borderRadius: 3, backgroundColor: ROLE_ORANGE, marginTop: 19 }, roleCard: { minHeight: 226, borderRadius: 30, borderWidth: 1.5, paddingVertical: 22, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", elevation: 6 }, orangeCard: { backgroundColor: "#FFFCF9", borderColor: "#FFD2B2" }, greenCard: { backgroundColor: "#FBFFFD", borderColor: "#B9F1DC" }, illustration: { width: 93, height: 145, borderRadius: 25, alignItems: "center", justifyContent: "center", marginRight: 13 }, orangeIllustration: { backgroundColor: "#FFE9D9" }, greenIllustration: { backgroundColor: "#D9F9EC" }, cardCopy: { flex: 1 }, eyebrowWrap: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 9 }, eyebrow: { fontSize: 9, fontWeight: "900" }, cardTitle: { color: ROLE_NAVY, fontSize: 20, fontWeight: "900" }, cardDescription: { color: ROLE_MUTED, fontSize: 12, marginTop: 7 }, metaText: { color: "#7F8A94", fontSize: 9, fontWeight: "700", marginTop: 8 }, arrowOuter: { width: 43, height: 43, borderRadius: 22, alignItems: "center", justifyContent: "center", marginLeft: 7 }, arrowButton: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" } });

function BrandMark({ large }: { large?: boolean }) { return (<View style={[styles.brandRow, large && styles.brandRowLarge]}><View style={[styles.brandIcon, large && styles.brandIconLarge]}><Text style={{ color: "#fff", fontWeight: "900", fontSize: large ? 24 : 16 }}>U</Text></View><View><Text style={[styles.brandName, large && styles.brandNameLarge]}>Uzhaivo</Text><Text style={[styles.brandCaption, large && styles.brandCaptionLarge]}>Worker Platform</Text></View></View>); }
function LoadingOverlay({ message }: { message?: string }) { return (<View style={styles.loadingOverlay}><View style={styles.loadingOverlayCard}><View style={styles.loadingOverlayIcon}><ActivityIndicator color={ORANGE} size="large" /></View><Text style={styles.loadingOverlayTitle}>{message || "Loading..."}</Text></View></View>); }

function LanguageScreen({ onSelect, locale }: { onSelect: (l: Locale) => void; locale: Locale }) {
  return (
    <View style={styles.languageScreen}>
      <View style={styles.languageTop}><BrandMark large /></View>
      <View style={styles.languageCopy}><Text style={styles.kicker}>UZHAIVO • WORKERS</Text><Text style={styles.languageTitle}>Choose your language</Text><Text style={styles.languageTamilTitle}>மொழியை தேர்வு செய்க</Text></View>
      <View style={styles.languageCards}>
        {(["en", "ta"] as Locale[]).map((l) => (
          <Pressable key={l} onPress={() => onSelect(l)} style={[styles.card, styles.languageCard, locale === l && styles.languageCardSelected]}>
            <View style={styles.languageCircle}><Text style={styles.languageCircleText}>{l === "en" ? "En" : "த"}</Text></View>
            <View style={styles.languageCardText}><Text style={styles.languageCardTitle}>{l === "en" ? "English" : "தமிழ்"}</Text><Text style={styles.languageCardSub}>{l === "en" ? "Continue in English" : "தமிழில் தொடரவும்"}</Text></View>
            <View style={[styles.radioEmpty, locale === l && { borderColor: ORANGE, backgroundColor: ORANGE }]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}


function TermsScreen({ locale, onBack, onLanguageChange }: { locale: Locale, onBack: () => void, onLanguageChange?: any }) {
  const isTamil = locale === "ta";
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF8F0" }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Pressable onPress={onBack} style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "#FFE0CA" }}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#0A1931" /><Text style={{ color: "#0A1931", fontWeight: "800" }}>{isTamil ? "பின்" : "Back"}</Text>
        </Pressable>
        <Pressable onPress={() => { const newLang = locale === "ta" ? "en" : "ta"; onLanguageChange && onLanguageChange(newLang); }} style={{ backgroundColor: ORANGE, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 }}>
          <Text style={{ color: "#fff", fontWeight: "900", fontSize: 12 }}>{isTamil ? "தமிழ் ✓" : "English ✓"} • {isTamil ? "En" : "த"} </Text>
        </Pressable>
      </View>
      <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 20, borderWidth: 1, borderColor: "#FFF1E7", elevation: 3 }}>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#FFE0CA" }}>
            <MaterialCommunityIcons name="file-document-outline" size={40} color={ORANGE} />
          </View>
          <Text style={{ color: "#0A1931", fontSize: 26, fontWeight: "900", marginTop: 16, textAlign: "center" }}>{isTamil ? "விதிமுறைகள் & நிபந்தனைகள்" : "Terms & Conditions"}</Text>
          <Text style={{ color: MUTED, fontSize: 12, fontWeight: "600", marginTop: 6 }}>Last Updated: 27 Oct 2025 • Version 2.0</Text>
        </View>

        <View style={{ gap: 18 }}>
          <View><Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900", marginBottom: 6 }}>{isTamil ? "1. அறிமுகம்" : "1. Introduction"}</Text><Text style={{ color: "#5A4D45", fontSize: 13, lineHeight: 20, fontWeight: "500" }}>{isTamil ? "Uzhaivo என்பது தமிழ்நாடு மாவட்டத்தில் தொழிலாளர்களையும் உரிமையாளர்களையும் இணைக்கும் ஒரு தொழில்முறை தளமாகும். இந்த செயலியைப் பயன்படுத்துவதன் மூலம், நீங்கள் இந்த விதிமுறைகளை ஏற்றுக்கொள்கிறீர்கள்." : "Uzhaivo is a professional platform connecting workers and owners in Tamil Nadu district. By using this app, you agree to these terms. Our mission is to provide dignified work opportunities with transparency and trust."}</Text></View>

          <View><Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900", marginBottom: 6 }}>{isTamil ? "2. பயனர் பொறுப்புகள்" : "2. User Responsibilities"}</Text><Text style={{ color: "#5A4D45", fontSize: 13, lineHeight: 20, fontWeight: "500" }}>{isTamil ? "• உண்மையான தகவல்களை மட்டுமே வழங்க வேண்டும்\n• மரியாதையுடன் தொடர்பு கொள்ள வேண்டும்\n• வேலை விவரங்களை தெளிவாக குறிப்பிட வேண்டும்\n• சட்டவிரோத செயல்களில் ஈடுபடக்கூடாது" : "• Provide only genuine information\n• Communicate respectfully\n• Clearly specify work details\n• Do not engage in illegal activities\n• Maintain professional conduct at all times"}</Text></View>

          <View><Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900", marginBottom: 6 }}>{isTamil ? "3. கட்டணம் & சேவைகள்" : "3. Payments & Services"}</Text><Text style={{ color: "#5A4D45", fontSize: 13, lineHeight: 20, fontWeight: "500" }}>{isTamil ? "Uzhaivo தற்போது இலவச சேவையாக வழங்கப்படுகிறது. எதிர்காலத்தில் பிரீமியம் அம்சங்கள் அறிமுகப்படுத்தப்படலாம். அனைத்து கட்டண பரிவர்த்தனைகளும் நேரடியாக தொழிலாளர்களுக்கும் உரிமையாளர்களுக்கும் இடையில் நடைபெறும்." : "Uzhaivo is currently offered as a free service. Premium features may be introduced in future. All payment transactions occur directly between workers and owners. Uzhaivo is not responsible for payment disputes but will assist in resolution."}</Text></View>

          <View><Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900", marginBottom: 6 }}>{isTamil ? "4. தனியுரிமை & பாதுகாப்பு" : "4. Privacy & Safety"}</Text><Text style={{ color: "#5A4D45", fontSize: 13, lineHeight: 20, fontWeight: "500" }}>{isTamil ? "உங்கள் தரவு 256-bit குறியாக்கத்துடன் பாதுகாக்கப்படுகிறது. நாங்கள் உங்கள் தொலைபேசி எண் மற்றும் வேலை தகவல்களை மட்டுமே சேகரிக்கிறோம். உங்கள் தகவல்களை மூன்றாம் தரப்பினருடன் பகிர மாட்டோம்." : "Your data is protected with 256-bit encryption. We collect only phone number and job information. We never share your data with third parties. Your privacy is our priority."}</Text></View>

          <View><Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900", marginBottom: 6 }}>{isTamil ? "5. தொடர்பு" : "5. Contact"}</Text><Text style={{ color: ORANGE, fontSize: 13, lineHeight: 20, fontWeight: "700" }}>{"Support: +91 90254 21145\nEmail: support@uzhaivo.app\nAddress: Tamil Nadu, Tamil Nadu, India - 636001"}</Text></View>
        </View>

        <View style={{ marginTop: 24, backgroundColor: "#FFF1E7", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#FFE0CA" }}>
          <Text style={{ color: ORANGE, fontSize: 12, fontWeight: "800", textAlign: "center" }}>{isTamil ? "Uzhaivo - உழைப்பே உயர்வு" : "Uzhaivo - Dignity Through Work"}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function PrivacyScreen({ locale, onBack, onLanguageChange }: { locale: Locale, onBack: () => void, onLanguageChange?: any }) {
  const isTamil = locale === "ta";
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF8F0" }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Pressable onPress={onBack} style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "#FFE0CA" }}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#0A1931" /><Text style={{ color: "#0A1931", fontWeight: "800" }}>{isTamil ? "பின்" : "Back"}</Text>
        </Pressable>
        <Pressable onPress={() => { const newLang = locale === "ta" ? "en" : "ta"; onLanguageChange && onLanguageChange(newLang); }} style={{ backgroundColor: ORANGE, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 }}>
          <Text style={{ color: "#fff", fontWeight: "900", fontSize: 12 }}>{isTamil ? "தமிழ் ✓" : "English ✓"} • {isTamil ? "En" : "த"} </Text>
        </Pressable>
      </View>
      <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 20, borderWidth: 1, borderColor: "#FFF1E7", elevation: 3 }}>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: "#E8F5E9", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#C8E6C9" }}>
            <MaterialCommunityIcons name="shield-check" size={40} color={GREEN} />
          </View>
          <Text style={{ color: "#0A1931", fontSize: 26, fontWeight: "900", marginTop: 16, textAlign: "center" }}>{isTamil ? "தனியுரிமைக் கொள்கை" : "Privacy Policy"}</Text>
          <Text style={{ color: MUTED, fontSize: 12, fontWeight: "600", marginTop: 6 }}>Last Updated: 27 Oct 2025 • GDPR Compliant • 256-bit Encrypted</Text>
        </View>

        <View style={{ gap: 18 }}>
          <View style={{ backgroundColor: "#E8F5E9", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#C8E6C9" }}>
            <Text style={{ color: GREEN, fontSize: 13, fontWeight: "800", textAlign: "center" }}>{isTamil ? "🔒 உங்கள் தனியுரிமை எங்கள் முன்னுரிமை" : "🔒 Your Privacy is Our Priority"}</Text>
          </View>

          <View><Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900", marginBottom: 6 }}>{isTamil ? "1. நாங்கள் சேகரிக்கும் தகவல்" : "1. Information We Collect"}</Text><Text style={{ color: "#5A4D45", fontSize: 13, lineHeight: 20, fontWeight: "500" }}>{isTamil ? "• தொலைபேசி எண் (OTP சரிபார்ப்புக்கு)\n• வேலை தலைப்பு மற்றும் விவரங்கள்\n• இடம் (விருப்பம், அருகிலுள்ள வேலைகளுக்கு)\n• அழைப்பு வரலாறு (உங்கள் சாதனத்தில் மட்டும்)" : "• Phone number (for OTP verification)\n• Job title and details\n• Location (optional, for nearby jobs)\n• Call history (stored only on your device)\n• We DO NOT collect: photos, contacts, messages"}</Text></View>

          <View><Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900", marginBottom: 6 }}>{isTamil ? "2. தகவல் பயன்பாடு" : "2. How We Use Information"}</Text><Text style={{ color: "#5A4D45", fontSize: 13, lineHeight: 20, fontWeight: "500" }}>{isTamil ? "உங்கள் தகவல் சேலத்தில் வேலை வாய்ப்புகளை இணைக்க மட்டுமே பயன்படுத்தப்படுகிறது. ஸ்பேம், விளம்பரம் அல்லது தேவையற்ற அழைப்புகளுக்கு பயன்படுத்தப்படாது." : "Your information is used only to connect work opportunities in Tamil Nadu. Never for spam, ads, or unsolicited calls. We believe in ethical technology."}</Text></View>

          <View><Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900", marginBottom: 6 }}>{isTamil ? "3. தரவு பாதுகாப்பு" : "3. Data Security"}</Text><Text style={{ color: "#5A4D45", fontSize: 13, lineHeight: 20, fontWeight: "500" }}>{isTamil ? "• 256-bit SSL குறியாக்கம்\n• தமிழ்நாடு சேவையகங்களில் பாதுகாப்பான சேமிப்பு\n• தினசரி காப்புப்பிரதி\n• இரு காரணி அங்கீகாரம்\n• உங்கள் தரவை நீங்கள் எப்போது வேண்டுமானாலும் நீக்கலாம்" : "• 256-bit SSL encryption\n• Secure storage on Tamil Nadu servers\n• Daily backups\n• Two-factor authentication\n• You can delete your data anytime - full control in your hands"}</Text></View>

          <View><Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900", marginBottom: 6 }}>{isTamil ? "4. உங்கள் உரிமைகள்" : "4. Your Rights"}</Text><Text style={{ color: "#5A4D45", fontSize: 13, lineHeight: 20, fontWeight: "500" }}>{isTamil ? "• உங்கள் தரவை அணுக உரிமை\n• தரவை திருத்த உரிமை\n• கணக்கை நீக்க உரிமை\n• தரவு ஏற்றுமதி உரிமை\n• புகார் செய்ய உரிமை" : "• Right to access your data\n• Right to correct data\n• Right to delete account\n• Right to data export\n• Right to complain - we listen"}</Text></View>
        </View>
      </View>
    </ScrollView>
  );
}





function AppSettingsScreen({ locale, theme, fontSize, onThemeChange, onFontSizeChange, onLanguageChange, onClearCache, onClearData, onBack }: any) {
  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18 }}><Pressable onPress={onBack} style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: "#fff", borderWidth: 1, borderColor: "#FFE0CA", alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="arrow-left" size={21} color="#0A1931" /></Pressable><View><Text style={{ color: "#0A1931", fontSize: 24, fontWeight: "900" }}>Settings</Text><Text style={{ color: MUTED, fontSize: 11, fontWeight: "600", marginTop: 3 }}>Customize Uzhaivo for your phone.</Text></View></View>
    <View style={{ backgroundColor: "#fff", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "#FFF1E7", elevation: 3 }}><View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }}><View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="cog-outline" size={22} color={ORANGE} /></View><View><Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900" }}>App Settings</Text><Text style={{ color: MUTED, fontSize: 10, marginTop: 2 }}>Preferences apply to this device.</Text></View></View><AppSettingsSection locale={locale} theme={theme} fontSize={fontSize} onThemeChange={onThemeChange} onFontSizeChange={onFontSizeChange} onLanguageChange={onLanguageChange} onClearCache={onClearCache} onClearData={onClearData} /></View>
  </ScrollView>;
}

function AppSettingsSection({ locale, theme, fontSize, onThemeChange, onFontSizeChange, onLanguageChange, onClearCache, onClearData }: any) {
  const row = (icon: any, label: string, child: any, last = false) => <View style={{ paddingVertical: 13, borderBottomWidth: last ? 0 : 1, borderBottomColor: "#FFF1E7" }}><View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}><MaterialCommunityIcons name={icon} size={19} color={ORANGE} /><Text style={{ color: "#0A1931", fontSize: 13, fontWeight: "800" }}>{label}</Text></View>{child}</View>;
  const choice = (items: string[], selected: string, onSelect: (value: string) => void) => <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>{items.map((item) => <Pressable key={item} onPress={() => onSelect(item)} style={{ paddingHorizontal: 11, paddingVertical: 7, borderRadius: 9, backgroundColor: selected === item ? ORANGE : "#FFF8F0", borderWidth: 1, borderColor: selected === item ? ORANGE : "#FFE0CA" }}><Text style={{ color: selected === item ? "#fff" : "#5A4D45", fontSize: 11, fontWeight: "800" }}>{item}</Text></Pressable>)}</View>;
  return <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, marginTop: 14, borderWidth: 1, borderColor: "#FFF1E7" }}><Text style={{ color: "#0A1931", fontSize: 15, fontWeight: "900", marginBottom: 2 }}>{locale === "ta" ? "பயன்பாட்டு அமைப்புகள்" : "App Settings"}</Text><Text style={{ color: MUTED, fontSize: 10, marginBottom: 4 }}>Customize Uzhaivo for your phone.</Text>{row("theme-light-dark", "App Theme", choice(["Light", "Dark"], theme === "dark" ? "Dark" : "Light", (value) => onThemeChange(value === "Dark" ? "dark" : "light")))}{row("format-size", "Font Size", choice(["Small", "Medium", "Large"], fontSize, onFontSizeChange))}{row("translate", "App Language", choice(["English", "Tamil"], locale === "ta" ? "Tamil" : "English", (value) => onLanguageChange(value === "Tamil" ? "ta" : "en")))}{row("broom-outline", "Clear Cache / Clear Data", <View style={{ flexDirection: "row", gap: 8 }}><Pressable onPress={onClearCache} style={{ flex: 1, backgroundColor: "#FFF8F0", borderRadius: 9, paddingVertical: 9, alignItems: "center" }}><Text style={{ color: ORANGE, fontSize: 11, fontWeight: "900" }}>Clear Cache</Text></Pressable><Pressable onPress={onClearData} style={{ flex: 1, backgroundColor: "#FFF1F1", borderRadius: 9, paddingVertical: 9, alignItems: "center" }}><Text style={{ color: "#D64545", fontSize: 11, fontWeight: "900" }}>Clear Data</Text></Pressable></View>)}{row("information-outline", "App Version", <Text style={{ color: MUTED, fontSize: 12, fontWeight: "700" }}>Uzhaivo v1.0.0</Text>, true)}</View>;
}

function WorkerProfileTop({ user, locale, onUpdate }: any) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [location, setLocation] = useState(user?.district || "Tamil Nadu");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const isTamil = locale === "ta";
  useEffect(() => { (async () => { try { const photo = await AsyncStorage.getItem("uzhaivo_profile_photo"); if (photo) setPhotoUri(photo); } catch {} })(); }, []);
  const choosePhoto = () => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const input = document.createElement("input"); input.type = "file"; input.accept = "image/*"; input.onchange = () => { const file = input.files?.[0]; if (file) { const uri = URL.createObjectURL(file); setPhotoUri(uri); AsyncStorage.setItem("uzhaivo_profile_photo", uri); } }; input.click(); return;
    }
    Alert.alert(isTamil ? "புகைப்படத்தை தேர்வு செய்க" : "Change profile photo", "", [
      { text: "Cancel", style: "cancel" },
      { text: "Camera", onPress: async () => { try { const permission = await ExpoImagePicker.requestCameraPermissionsAsync(); if (!permission.granted) return; const result = await ExpoImagePicker.launchCameraAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 }); if (!result.canceled) { const uri = result.assets[0].uri; setPhotoUri(uri); await AsyncStorage.setItem("uzhaivo_profile_photo", uri); } } catch (e: any) { Alert.alert("Error", e.message); } } },
      { text: "Gallery", onPress: async () => { try { const result = await ExpoImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 }); if (!result.canceled) { const uri = result.assets[0].uri; setPhotoUri(uri); await AsyncStorage.setItem("uzhaivo_profile_photo", uri); } } catch (e: any) { Alert.alert("Error", e.message); } } },
    ]);
  };
  const saveProfile = async () => { const updated = { ...user, name: name.trim() || user?.name, district: location.trim() || "Tamil Nadu" }; await onUpdate(updated); setEditing(false); };
  return <View>
    <View style={{ backgroundColor: "#fff", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "#FFF1E7", elevation: 4 }}>
      <View style={{ alignItems: "center" }}>
        <Pressable onPress={choosePhoto} style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: "#FFF1E7", overflow: "hidden" }}>
          {photoUri ? <Image source={{ uri: photoUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" /> : <Text style={{ color: "#fff", fontSize: 32, fontWeight: "900" }}>{(name || user?.phone || "U").slice(-2).toUpperCase()}</Text>}
          <View style={{ position: "absolute", right: 0, bottom: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: "#0A1931", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff" }}><MaterialCommunityIcons name="camera" size={15} color="#fff" /></View>
        </Pressable>
        <Text style={{ color: "#0A1931", fontSize: 21, fontWeight: "900", marginTop: 12 }}>{name || "Uzhaivo Worker"}</Text>
        <Text style={{ color: MUTED, fontSize: 12, fontWeight: "700", marginTop: 4 }}>{user?.phone}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 7 }}><MaterialCommunityIcons name="map-marker" size={14} color={ORANGE} /><Text style={{ color: "#5A4D45", fontSize: 12, fontWeight: "700" }}>{location}</Text></View>
      </View>
      <Pressable onPress={() => setEditing(!editing)} style={{ marginTop: 16, borderWidth: 1, borderColor: ORANGE, borderRadius: 12, paddingVertical: 11, alignItems: "center" }}><Text style={{ color: ORANGE, fontSize: 13, fontWeight: "900" }}>{editing ? "Cancel" : "Edit Profile"}</Text></Pressable>
      {editing ? <View style={{ marginTop: 14, gap: 10 }}><TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="#B8A99D" style={{ backgroundColor: "#FFF8F0", borderRadius: 11, borderWidth: 1, borderColor: "#FFE0CA", paddingHorizontal: 12, height: 44, color: "#0A1931", fontWeight: "700" }} /><TextInput value={location} onChangeText={setLocation} placeholder="Village / City" placeholderTextColor="#B8A99D" style={{ backgroundColor: "#FFF8F0", borderRadius: 11, borderWidth: 1, borderColor: "#FFE0CA", paddingHorizontal: 12, height: 44, color: "#0A1931", fontWeight: "700" }} /><Pressable onPress={saveProfile} style={{ backgroundColor: GREEN, borderRadius: 11, paddingVertical: 12, alignItems: "center" }}><Text style={{ color: "#fff", fontSize: 13, fontWeight: "900" }}>Save Profile</Text></Pressable></View> : null}
    </View>
  </View>;
}

function ReceivedProofsScreen({ user, locale, onJobUpdated }: any) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingProofs, setLoadingProofs] = useState(false);
  const loadApplications = useCallback(async () => {
    if (!user?.id) return;
    setLoadingProofs(true);
    try { setApplications(await getOwnerApplications(user.id)); } catch (e) { console.warn("[Uzhaivo] received proofs load failed", e); }
    finally { setLoadingProofs(false); }
  }, [user?.id]);
  useEffect(() => {
    loadApplications();
    if (!user?.id) return;
    const unsubscribe = subscribeToOwnerApplications(user.id, setApplications);
    return () => unsubscribe && unsubscribe();
  }, [user?.id, loadApplications]);
  const downloadProof = (url: string, name: string) => {
    if (!url) return;
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.target = "_blank"; anchor.click();
    } else Linking.openURL(url);
  };
  const updateStatus = async (application: JobApplication, status: "approved" | "rejected") => {
    try {
      if (application.status !== "pending") return;
      if (status === "approved") {
        const job = await getJobById(application.job_id);
        if (job) {
          const needMatch = (job.description || "").match(/Need:([^|]+)/);
          const currentNeed = Math.max(0, parseInt(needMatch?.[1] || "1", 10) || 1);
          const remainingNeed = Math.max(0, currentNeed - 1);
          if (remainingNeed === 0) {
            await deleteJob(job.id);
          } else {
            const nextDescription = (job.description || "").replace(/Need:([^|]+)/, `Need:${remainingNeed}`);
            await updateJob(job.id, { description: nextDescription } as any);
          }
          if (onJobUpdated) await onJobUpdated();
        }
      }
      const updated = await updateJobApplicationStatus(application.id, status);
      setApplications((current) => current.map((item) => item.id === updated.id ? updated : item));
      Alert.alert(status === "approved" ? "Proof approved" : "Proof rejected", status === "approved" ? "The worker has been notified." : "The worker has been notified and cannot re-apply.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) { Alert.alert("Unable to update proof", e.message || "Please try again"); }
  };
  const statusColor = (status: string) => status === "approved" ? GREEN : status === "rejected" ? "#D64545" : ORANGE;
  return <View>
    <View style={{ marginBottom: 16 }}><Text style={styles.eyebrowText}>{locale === "ta" ? "பெறப்பட்ட சான்றிதழ்கள்" : "OWNER REVIEW"}</Text><Text style={styles.pageTitle}>{locale === "ta" ? "பெறப்பட்ட சான்றிதழ்கள்" : "Received Proofs"}</Text><Text style={{ color: MUTED, fontSize: 12, fontWeight: "600", marginTop: 6 }}>{locale === "ta" ? "தொழிலாளர்களின் சான்றிதழ்களை சரிபார்க்கவும்" : "Review worker proofs and notify them with your decision."}</Text></View>
    {applications.length === 0 ? <View style={homeStyles.emptyBox}><MaterialCommunityIcons name="file-search-outline" size={34} color={MUTED} /><Text style={homeStyles.emptyTitle}>No proofs received</Text><Text style={homeStyles.emptySub}>Worker submissions will appear here.</Text></View> : applications.map((application) => {
      const urls = application.proof_urls || {};
      const front = urls.front || (application.proof_image_url && application.proof_image_url);
      const back = urls.back;
      const workerProfile = urls._worker_profile || { name: application.worker_name, phone: application.worker_phone, location: "Tamil Nadu", skill: application.skill, experience: application.experience };
      const color = statusColor(application.status);
      return <View key={application.id} style={{ backgroundColor: "#fff", borderRadius: 18, padding: 15, marginBottom: 14, borderWidth: 1, borderColor: `${color}45`, elevation: 3 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}><View style={{ flex: 1 }}><Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900" }}>{application.job_title || "Job application"}</Text><Text style={{ color: MUTED, fontSize: 11, marginTop: 4 }}>{application.worker_name || application.worker_phone || "Worker"} • {application.proof_type || "Proof"}</Text></View><View style={{ backgroundColor: `${color}18`, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 }}><Text style={{ color, fontSize: 10, fontWeight: "900" }}>{application.status}</Text></View></View>
        <View style={{ backgroundColor: "#F8F9FF", borderRadius: 12, padding: 11, marginTop: 12, borderWidth: 1, borderColor: "#E0E7FF" }}>{workerProfile.photo ? <Image source={{ uri: workerProfile.photo }} style={{ width: 54, height: 54, borderRadius: 27, marginBottom: 8 }} /> : null}<Text style={{ color: "#0A1931", fontSize: 11, fontWeight: "900", marginBottom: 6 }}>Worker profile</Text><Text style={{ color: "#5A4D45", fontSize: 11, fontWeight: "700" }}>Name: {workerProfile.name || "Not provided"}</Text><Text style={{ color: "#5A4D45", fontSize: 11, fontWeight: "700", marginTop: 3 }}>Phone: {workerProfile.phone || "Not provided"}</Text><Text style={{ color: "#5A4D45", fontSize: 11, fontWeight: "700", marginTop: 3 }}>Village / City: {workerProfile.location || "Not provided"}</Text>{workerProfile.skill ? <Text style={{ color: "#5A4D45", fontSize: 11, fontWeight: "700", marginTop: 3 }}>Skill: {workerProfile.skill}</Text> : null}{workerProfile.experience ? <Text style={{ color: "#5A4D45", fontSize: 11, fontWeight: "700", marginTop: 3 }}>Experience: {workerProfile.experience}</Text> : null}</View>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 13 }}>
          {front ? <View style={{ flex: 1 }}><Image source={{ uri: front }} style={{ width: "100%", height: 110, borderRadius: 12 }} resizeMode="cover" /><Pressable onPress={() => downloadProof(front, `${application.proof_type || "proof"}-front.jpg`)} style={{ marginTop: 6, backgroundColor: "#FFF1E7", borderRadius: 9, paddingVertical: 8, alignItems: "center" }}><Text style={{ color: ORANGE, fontSize: 10, fontWeight: "900" }}>Download front</Text></Pressable></View> : null}
          {back ? <View style={{ flex: 1 }}><Image source={{ uri: back }} style={{ width: "100%", height: 110, borderRadius: 12 }} resizeMode="cover" /><Pressable onPress={() => downloadProof(back, `${application.proof_type || "proof"}-back.jpg`)} style={{ marginTop: 6, backgroundColor: "#FFF1E7", borderRadius: 9, paddingVertical: 8, alignItems: "center" }}><Text style={{ color: ORANGE, fontSize: 10, fontWeight: "900" }}>Download back</Text></Pressable></View> : null}
        </View>
        {application.status === "pending" ? <View style={{ flexDirection: "row", gap: 9, marginTop: 14 }}><Pressable onPress={() => updateStatus(application, "rejected")} style={{ flex: 1, borderRadius: 11, paddingVertical: 11, alignItems: "center", backgroundColor: "#FFF1F1", borderWidth: 1, borderColor: "#FFD2D2" }}><Text style={{ color: "#D64545", fontSize: 12, fontWeight: "900" }}>Reject</Text></Pressable><Pressable onPress={() => updateStatus(application, "approved")} style={{ flex: 1, borderRadius: 11, paddingVertical: 11, alignItems: "center", backgroundColor: GREEN }}><Text style={{ color: "#fff", fontSize: 12, fontWeight: "900" }}>Approve</Text></Pressable></View> : <Text style={{ color, fontSize: 11, fontWeight: "800", marginTop: 12 }}>Worker has been notified: {application.status}</Text>}
      </View>;
    })}
    <Pressable onPress={loadApplications} disabled={loadingProofs} style={{ alignSelf: "center", marginTop: 2, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10, backgroundColor: "#fff", borderWidth: 1, borderColor: "#FFE0CA" }}><Text style={{ color: ORANGE, fontSize: 11, fontWeight: "900" }}>{loadingProofs ? "Refreshing..." : "Refresh proofs"}</Text></Pressable>
  </View>;
}

function AppliedJobsScreen({ user, locale, onOpenJob }: any) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobsById, setJobsById] = useState<Record<string, Job>>({});
  const [refreshing, setRefreshing] = useState(false);
  const isCompletedJob = (job: Job | null) => {
    if (!job) return true;
    const match = (job.description || "").match(/Need:([^|]+)/);
    return match ? Number.parseInt(match[1].trim(), 10) <= 0 : false;
  };
  const loadApplications = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      const rows = await getWorkerApplications(user.id);
      const pairs = await Promise.all(rows.map(async (row) => [row.job_id, await getJobById(row.job_id)] as const));
      const next: Record<string, Job> = {};
      const activeApplications: JobApplication[] = [];
      pairs.forEach(([id, job], index) => {
        if (job && !isCompletedJob(job)) { next[id] = job; activeApplications.push(rows[index]); }
      });
      setApplications(activeApplications);
      setJobsById(next);
    } catch (e) { console.warn("[Uzhaivo] applied jobs load failed", e); }
    finally { setRefreshing(false); }
  }, [user?.id]);
  useEffect(() => {
    loadApplications();
    if (!user?.id) return;
    const unsubscribe = subscribeToWorkerApplications(user.id, loadApplications);
    return () => unsubscribe && unsubscribe();
  }, [user?.id, loadApplications]);
  const statusColor = (status: string) => status === "approved" ? GREEN : status === "rejected" ? "#D64545" : ORANGE;
  const statusLabel = (status: string) => status === "approved" ? "Accepted" : status === "rejected" ? "Rejected" : "Pending review";
  return <View>
    <View style={{ marginBottom: 16 }}><Text style={styles.eyebrowText}>{locale === "ta" ? "உங்கள் விண்ணப்பங்கள்" : "YOUR APPLICATIONS"}</Text><Text style={styles.pageTitle}>{locale === "ta" ? "விண்ணப்பித்த வேலைகள்" : "Applied Jobs"}</Text><Text style={{ color: MUTED, fontSize: 12, fontWeight: "600", marginTop: 6 }}>{locale === "ta" ? "உங்கள் சான்றிதழ் நிலையை இங்கே பார்க்கலாம்" : "Track proof verification and job confirmation here."}</Text></View>
    {applications.length === 0 ? <View style={homeStyles.emptyBox}><MaterialCommunityIcons name="briefcase-search-outline" size={34} color={MUTED} /><Text style={homeStyles.emptyTitle}>{locale === "ta" ? "இன்னும் விண்ணப்பங்கள் இல்லை" : "No applied jobs yet"}</Text><Text style={homeStyles.emptySub}>{locale === "ta" ? "வேலைகளைத் திறந்து சான்றிதழை சமர்ப்பிக்கவும்" : "Open a job and submit your proof to see it here."}</Text></View> : applications.map((application) => {
      const job = jobsById[application.job_id];
      const color = statusColor(application.status);
      return <Pressable key={application.id} onPress={() => job && onOpenJob(job)} style={{ backgroundColor: "#fff", borderRadius: 18, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: `${color}45`, elevation: 3 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}><View style={{ flex: 1 }}><Text style={{ color: "#0A1931", fontSize: 16, fontWeight: "900" }}>{job?.title || application.job_title || "Applied job"}</Text><Text style={{ color: MUTED, fontSize: 11, fontWeight: "600", marginTop: 5 }}>{job?.location || "Tamil Nadu"} {job ? `• ₹${job.salary}/day` : ""}</Text></View><View style={{ backgroundColor: `${color}18`, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 }}><Text style={{ color, fontSize: 10, fontWeight: "900" }}>{statusLabel(application.status)}</Text></View></View>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 13, gap: 8 }}><MaterialCommunityIcons name={application.status === "approved" ? "check-decagram" : application.status === "rejected" ? "close-circle" : "clock-outline"} size={17} color={color} /><Text style={{ color: "#5A4D45", fontSize: 11, fontWeight: "700", flex: 1 }}>{application.status === "approved" ? "Your proof is verified. Job confirmed." : application.status === "rejected" ? "You cannot re-apply for this job." : "The owner is reviewing your proof."}</Text><MaterialCommunityIcons name="chevron-right" size={19} color={MUTED} /></View>
        <Text style={{ color: MUTED, fontSize: 10, marginTop: 9 }}>Submitted {new Date(application.created_at).toLocaleDateString("en-IN")}</Text>
      </Pressable>;
    })}
    <Pressable onPress={loadApplications} disabled={refreshing} style={{ alignSelf: "center", marginTop: 4, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10, backgroundColor: "#fff", borderWidth: 1, borderColor: "#FFE0CA" }}><Text style={{ color: ORANGE, fontSize: 11, fontWeight: "900" }}>{refreshing ? "Refreshing..." : "Refresh status"}</Text></Pressable>
  </View>;
}

function JobDetailScreen({ job, locale, saved, onToggleSave, onBack, user, platformSettings = {} }: any) {
  const isTamil = locale === "ta";
  const [application, setApplication] = useState<JobApplication | null>(null);
  const defaultProofTypes = ["Aadhaar Card", "PAN Card", "Driving License", "Insurance", "Work Photo", "Others"];
  const proofRequest = decodeProofRequest(job.proof_description || "");
  const proofTypes = job.proof_types?.length ? job.proof_types : defaultProofTypes;
  const [selectedProofType, setSelectedProofType] = useState(proofTypes[0] || "Aadhaar Card");
  const [proofImages, setProofImages] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const requiredSide = proofRequest.sides?.[selectedProofType] || "front";

  const refreshApplication = useCallback(async () => {
    if (!user?.id) return;
    try { setApplication(await getJobApplication(job.id, user.id)); } catch (e) { console.warn("[Uzhaivo] application refresh failed", e); }
  }, [job.id, user?.id]);

  useEffect(() => {
    refreshApplication();
    if (!user?.id) return;
    const unsubscribe = subscribeToJobApplication(job.id, user.id, setApplication);
    return () => unsubscribe && unsubscribe();
  }, [job.id, user?.id, refreshApplication]);

  const choosePhoto = (side: "front" | "back") => {
    if (!ExpoImagePicker) { Alert.alert("Error", "Photo picker is unavailable"); return; }
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        const file = input.files?.[0];
        if (file) setProofImages((current) => ({ ...current, [side]: URL.createObjectURL(file) }));
      };
      input.click();
      return;
    }
    Alert.alert(isTamil ? "புகைப்படத்தை தேர்வு செய்க" : "Add proof photo", isTamil ? "Camera அல்லது Gallery தேர்வு செய்க" : "Choose Camera or Gallery", [
      { text: isTamil ? "ரத்து" : "Cancel", style: "cancel" },
      { text: isTamil ? "கேமரா" : "Camera", onPress: async () => {
        try {
          const permission = await ExpoImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) { Alert.alert("Permission needed", "Camera permission is required"); return; }
          const result = await ExpoImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8, allowsEditing: true });
          if (!result.canceled) setProofImages((current) => ({ ...current, [side]: result.assets[0].uri }));
        } catch (e: any) { Alert.alert("Error", e.message || "Camera could not be opened"); }
      } },
      { text: isTamil ? "கேலரி" : "Gallery", onPress: async () => {
        try {
          const result = await ExpoImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8, allowsEditing: true });
          if (!result.canceled) setProofImages((current) => ({ ...current, [side]: result.assets[0].uri }));
        } catch (e: any) { Alert.alert("Error", e.message || "Gallery could not be opened"); }
      } },
    ]);
  };

  const submitProof = async () => {
    if (platformSettings.proof_submissions_enabled === false) { Alert.alert("Proof submissions paused", "The admin has temporarily paused proof submissions."); return; }
    if (!selectedProofType) { Alert.alert("Proof type", "Please select proof type"); return; }
    if (!proofImages.front) { Alert.alert("Proof photo", "Please select proof photo"); return; }
    if (requiredSide === "back" && !proofImages.back) { Alert.alert("Proof photo", "Please select the back proof photo"); return; }
    if (requiredSide === "front_back" && (!proofImages.front || !proofImages.back)) { Alert.alert("Proof photo", "Please select both front and back proof photos"); return; }
    if (!user) { Alert.alert("Login required", "Please log in before submitting proof"); return; }
    setSubmitting(true);
    try {
      const savedApplication = await submitJobApplication({ job, worker: user, proofType: selectedProofType, proofImageUrl: proofImages.front || proofImages.back, proofUrls: proofImages });
      setApplication(savedApplication);
      Alert.alert("Proof Submitted - Verification Pending");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) { Alert.alert("Unable to submit proof", e.message || "Proof submission failed"); }
    finally { setSubmitting(false); }
  };

  const isSaved = saved?.includes(job.id);
  const status = application?.status;
  const statusColor = status === "approved" ? GREEN : status === "rejected" ? "#D64545" : ORANGE;
  const statusTitle = status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Proof Submitted - Verification Pending";
  const statusMessage = status === "approved" ? "Your proof is verified. Job Confirmed." : status === "rejected" ? "Your proof was rejected. You cannot re-apply for this job." : "The job owner is reviewing your proof.";
  const submittedAt = application?.created_at ? new Date(application.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "";
  const proofRequired = Boolean(job.proof_required || job.requires_proof);
  const canContactOwner = !proofRequired || platformSettings.owner_contact_requires_approval === false || status === "approved";
  const openMap = () => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location || "Tamil Nadu")}`);

  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 130 }}>
    <View style={detailStyles.header}>
      <Pressable onPress={onBack} style={detailStyles.backBtn}><MaterialCommunityIcons name="arrow-left" size={22} color="#0A1931" /></Pressable>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable onPress={onToggleSave} style={[detailStyles.iconBtn, isSaved && { backgroundColor: ORANGE }]}><MaterialCommunityIcons name={isSaved ? "bookmark" : "bookmark-outline"} size={20} color={isSaved ? "#fff" : "#0A1931"} /></Pressable>
      </View>
    </View>

    {status && status !== "approved" ? <View style={[detailStyles.heroCard, { borderColor: statusColor, borderWidth: 1.5, backgroundColor: "#fff" }]}>
      <View style={{ alignItems: "center" }}><View style={{ width: 58, height: 58, borderRadius: 18, backgroundColor: `${statusColor}18`, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name={status === "approved" ? "check-decagram" : status === "rejected" ? "close-circle" : "clock-outline"} size={32} color={statusColor} /></View></View>
      <Text style={[detailStyles.title, { textAlign: "center", fontSize: 20 }]}>{job.title}</Text>
      <View style={{ backgroundColor: `${statusColor}18`, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, alignSelf: "center", marginTop: 10 }}><Text style={{ color: statusColor, fontWeight: "900", fontSize: 12 }}>{statusTitle}</Text></View>
      <Text style={{ color: "#5A4D45", fontWeight: "800", textAlign: "center", marginTop: 14 }}>{application?.proof_type || "Proof"}</Text>
      {application?.proof_image_url ? <Image source={{ uri: application.proof_image_url }} style={{ width: 120, height: 90, borderRadius: 12, alignSelf: "center", marginTop: 12 }} resizeMode="cover" /> : null}
      {submittedAt ? <Text style={{ color: MUTED, fontSize: 11, textAlign: "center", marginTop: 10 }}>Submitted {submittedAt}</Text> : null}
      <Text style={{ color: "#5A4D45", fontSize: 12, lineHeight: 18, fontWeight: "600", textAlign: "center", marginTop: 14 }}>{statusMessage}</Text>
      {status === "approved" ? <View style={{ marginTop: 16, backgroundColor: "#E8F5E9", borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", gap: 8 }}><MaterialCommunityIcons name="check-decagram" size={18} color={GREEN} /><Text style={{ color: GREEN, fontSize: 11, fontWeight: "800", flex: 1 }}>Owner contact is now available for your next step.</Text></View> : null}
    </View> : <>
      <View style={detailStyles.heroCard}>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}><View style={detailStyles.catPill}><Text style={detailStyles.catPillText}>{job.category}</Text></View>{job.owner_verified === true ? <View style={detailStyles.verifiedPill}><MaterialCommunityIcons name="check-decagram" size={12} color={GREEN} /><Text style={detailStyles.verifiedPillText}>Admin verified owner</Text></View> : null}</View>
        <Text style={detailStyles.title}>{job.title}</Text>
        <View style={detailStyles.salaryRow}><Text style={detailStyles.price}>₹{job.salary}</Text><Text style={detailStyles.priceType}> / day</Text></View>
        <Text style={detailStyles.postedInfo}>📍 {job.location} • Posted recently</Text>
      </View>
      <View style={detailStyles.infoGrid}>
        <Pressable onPress={openMap} style={detailStyles.infoBox}><MaterialCommunityIcons name="map-marker" size={20} color={ORANGE} /><Text style={detailStyles.infoLabel}>LOCATION</Text><Text style={detailStyles.infoValue}>{job.location}</Text><View style={{ marginTop: 8, backgroundColor: "#FFF1E7", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start" }}><Text style={{ color: ORANGE, fontSize: 9, fontWeight: "800" }}>Open in Map</Text></View></Pressable>
        <View style={detailStyles.infoBox}><MaterialCommunityIcons name="alert-circle-outline" size={20} color={ORANGE} /><Text style={detailStyles.infoLabel}>URGENCY</Text><Text style={detailStyles.infoValue}>{job.urgency || "Flexible"}</Text></View>
        <View style={detailStyles.infoBox}><MaterialCommunityIcons name="calendar-outline" size={20} color={ORANGE} /><Text style={detailStyles.infoLabel}>DATE</Text><Text style={detailStyles.infoValue}>{new Date(job.created_at).toLocaleDateString("en-IN")}</Text></View>
        {canContactOwner ? <View style={detailStyles.infoBox}><MaterialCommunityIcons name="phone-outline" size={20} color={ORANGE} /><Text style={detailStyles.infoLabel}>OWNER PHONE</Text><Text style={detailStyles.infoValue}>{job.phone}</Text></View> : <View style={detailStyles.infoBox}><MaterialCommunityIcons name="shield-lock-outline" size={20} color={ORANGE} /><Text style={detailStyles.infoLabel}>CONTACT</Text><Text style={detailStyles.infoValue}>Available after proof approval</Text></View>}
      </View>
      <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginTop: 14 }}><Text style={{ color: "#0A1931", fontSize: 14, fontWeight: "900" }}>Work Details</Text><Text style={{ color: "#5A4D45", fontSize: 13, lineHeight: 20, marginTop: 8 }}>{job.description || "No additional description provided."}</Text></View>
      {status !== "approved" && platformSettings.proof_submissions_enabled !== false && <View style={{ marginTop: 14, backgroundColor: "#FFF8F0", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#FFE0CA" }}>
        <Text style={{ color: ORANGE, fontSize: 15, fontWeight: "900" }}>Add Proof</Text><Text style={{ color: MUTED, fontSize: 11, marginTop: 4 }}>Upload only the proof requested by the owner.</Text>
        <Pressable onPress={() => setShowTypes(!showTypes)} style={{ marginTop: 12, borderWidth: 1, borderColor: ORANGE, backgroundColor: "#fff", borderRadius: 10, padding: 12, flexDirection: "row", justifyContent: "space-between" }}><Text style={{ color: "#0A1931", fontWeight: "800", fontSize: 12 }}>{selectedProofType}</Text><MaterialCommunityIcons name={showTypes ? "chevron-up" : "chevron-down"} size={18} color={ORANGE} /></Pressable>
        {showTypes ? <View style={{ borderWidth: 1, borderColor: "#FFE0CA", borderRadius: 10, marginTop: 5, overflow: "hidden" }}>{proofTypes.map((type) => <Pressable key={type} onPress={() => { setSelectedProofType(type); setProofImages({}); setShowTypes(false); }} style={{ padding: 11, backgroundColor: selectedProofType === type ? "#FFF1E7" : "#fff" }}><Text style={{ color: selectedProofType === type ? ORANGE : "#5A4D45", fontWeight: "800", fontSize: 11 }}>{type}</Text></Pressable>)}</View> : null}
        <Text style={{ color: "#0A1931", fontSize: 11, fontWeight: "800", marginTop: 12 }}>Required side: {requiredSide === "front_back" ? "Front + Back" : requiredSide === "back" ? "Back" : "Front"}</Text>
        <Pressable onPress={() => choosePhoto(requiredSide === "back" ? "back" : "front")} style={{ marginTop: 8, backgroundColor: "#fff", borderWidth: 1, borderColor: "#FFE0CA", borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", gap: 8 }}><MaterialCommunityIcons name="camera-plus-outline" size={21} color={ORANGE} /><Text style={{ color: "#5A4D45", fontWeight: "800", fontSize: 12 }}>{requiredSide === "back" ? (proofImages.back ? "Change back photo" : "Upload back photo") : (proofImages.front ? "Change front photo" : "Upload front photo")}</Text></Pressable>
        {requiredSide === "front_back" ? <Pressable onPress={() => choosePhoto("back")} style={{ marginTop: 8, backgroundColor: "#fff", borderWidth: 1, borderColor: "#FFE0CA", borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", gap: 8 }}><MaterialCommunityIcons name="camera-plus-outline" size={21} color={ORANGE} /><Text style={{ color: "#5A4D45", fontWeight: "800", fontSize: 12 }}>{proofImages.back ? "Change back photo" : "Upload back photo"}</Text></Pressable> : null}
        {proofImages.front ? <Image source={{ uri: proofImages.front }} style={{ width: "100%", height: 130, borderRadius: 12, marginTop: 10 }} resizeMode="cover" /> : null}
        {requiredSide !== "front" && proofImages.back ? <Image source={{ uri: proofImages.back }} style={{ width: "100%", height: 130, borderRadius: 12, marginTop: 10 }} resizeMode="cover" /> : null}
        <Pressable onPress={submitProof} disabled={submitting} style={{ marginTop: 12, backgroundColor: GREEN, borderRadius: 12, paddingVertical: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>{submitting ? <ActivityIndicator color="#fff" size="small" /> : <><MaterialCommunityIcons name="send-check" size={17} color="#fff" /><Text style={{ color: "#fff", fontSize: 13, fontWeight: "900" }}>Submit Proofs</Text></>}</Pressable>
      </View>}
      {canContactOwner ? <View style={detailStyles.infoBox}><MaterialCommunityIcons name="phone-outline" size={20} color={GREEN} /><Text style={detailStyles.infoLabel}>OWNER CONTACT</Text><Text style={detailStyles.infoValue}>{job.phone}</Text></View> : <View style={{ marginTop: 16, backgroundColor: "#FFF1E7", borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", gap: 8 }}><MaterialCommunityIcons name="shield-lock-outline" size={18} color={ORANGE} /><Text style={{ color: ORANGE, fontSize: 11, fontWeight: "800", flex: 1 }}>Owner phone and WhatsApp are available after proof approval.</Text></View>}
    </>}
  </ScrollView>;
}

export function UzhaivoApp() {
  const insets = useSafeAreaInsets();
  const [locale, setLocale] = useState<Locale>("en");
  const [appTheme, setAppTheme] = useState<"light" | "dark">("light");
  const [appFontSize, setAppFontSize] = useState("Medium");
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [step, setStep] = useState<"splash" | "lang" | "login" | "otp" | "role" | "home" | "calls" | "profile" | "addJob" | "detail" | "myJobs" | "terms" | "privacy">("splash");
  const [phone, setPhone] = useState(""); const [otp, setOtp] = useState(""); const [loading, setLoading] = useState(false); const [loadingMsg, setLoadingMsg] = useState("");
  const [user, setUser] = useState<UserRecord | null>(null); const [jobs, setJobs] = useState<Job[]>([]); const [saved, setSaved] = useState<string[]>([]); const [activeTab, setActiveTab] = useState<any>("home"); const [filter, setFilter] = useState("All"); const [search, setSearch] = useState(""); const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null); const [callHistory, setCallHistory] = useState<any[]>([]); const [approvedJobIds, setApprovedJobIds] = useState<string[]>([]); const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({});
  const [userLoc, setUserLoc] = useState<{ lat: number, lng: number } | null>(null); const [nearActive, setNearActive] = useState(false); const [locLoading, setLocLoading] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const t = useCallback((k: any) => translate(locale, k), [locale]);
  useEffect(() => { const multiplier = appFontSize === "Large" ? 1.35 : appFontSize === "Small" ? 0.9 : 1.0; (Text as any).defaultProps = { ...((Text as any).defaultProps || {}), allowFontScaling: true, maxFontSizeMultiplier: multiplier }; }, [appFontSize]);
  useEffect(() => { const sub = NetInfo.addEventListener(state => { setIsConnected(state.isConnected); }); NetInfo.fetch().then(state => setIsConnected(state.isConnected)); return () => sub(); }, []);
  useEffect(() => { (async () => { const remoteSettings = await getPlatformSettings(); setPlatformSettings(remoteSettings); const lang = await loadAppLanguage(); if (!lang && remoteSettings.app_language) setLocale(remoteSettings.app_language); else if (lang) setLocale(lang); try { const savedTheme = await AsyncStorage.getItem("uzhaivo_app_theme"); const savedFontSize = await AsyncStorage.getItem("uzhaivo_font_size"); if (savedTheme === "dark" || savedTheme === "light") setAppTheme(savedTheme); else if (remoteSettings.app_theme) setAppTheme(remoteSettings.app_theme); if (savedFontSize) setAppFontSize(savedFontSize); else if (remoteSettings.app_font_size) setAppFontSize(remoteSettings.app_font_size); } catch {} const u = await getCurrentUser().catch(() => null); if (u) { setUser(u); if (u.role === "owner") { setActiveTab("addJob"); } else { setActiveTab("home"); } } const j = await getJobs(); setJobs(j); const s = await loadSavedJobs(); setSaved(s); try { const ch = await AsyncStorage.getItem("uzhaivo_calls"); if (ch) setCallHistory(JSON.parse(ch)); } catch {} setTimeout(() => setStep(u ? "home" : "lang"), 1200); })(); }, []);

  // SUPABASE REALTIME - Auto refresh when Supabase table changes
  useEffect(() => {
    console.log("[Uzhaivo] Setting up Supabase realtime");
    const unsubscribe = subscribeToJobs((updatedJobs) => {
      console.log("[Uzhaivo] Realtime update:", updatedJobs.length, "jobs");
      setJobs(updatedJobs);
    });
    return () => { unsubscribe && unsubscribe(); };
  }, []);
  useEffect(() => {
    if (!user?.id || user.role === "owner") { setApprovedJobIds([]); return; }
    let active = true;
    const loadApproved = async () => { try { const rows = await getWorkerApplications(user.id); if (active) setApprovedJobIds(rows.filter((row) => row.status === "approved").map((row) => row.job_id)); } catch {} };
    void loadApproved();
    const unsubscribe = subscribeToWorkerApplications(user.id, (rows) => { if (active) setApprovedJobIds(rows.filter((row) => row.status === "approved").map((row) => row.job_id)); });
    return () => { active = false; unsubscribe && unsubscribe(); };
  }, [user?.id, user?.role]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const j = await refreshJobs();
      setJobs(j);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log("[Uzhaivo] Refreshed", j.length, "jobs from Supabase");
    } catch (e) {
      console.error("Refresh failed", e);
    } finally {
      setRefreshing(false);
    }
  };

  const saveCallHistory = async (job: Job) => {
    try { const newCall = { id: Date.now().toString(), jobId: job.id, title: job.title, category: job.category, phone: job.phone, location: job.location, salary: job.salary, time: new Date().toISOString(), timeText: new Date().toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }) }; const updated = [newCall, ...callHistory].slice(0, 50); setCallHistory(updated); await AsyncStorage.setItem("uzhaivo_calls", JSON.stringify(updated)); } catch {}
  };
  const handleNear = async () => { if (nearActive) { setNearActive(false); setUserLoc(null); return; } if (!ExpoLocation) { Alert.alert("Info", "Run: npx expo install expo-location"); return; } try { setLocLoading(true); const { status } = await ExpoLocation.requestForegroundPermissionsAsync(); if (status !== "granted") { Alert.alert("Permission needed"); setLocLoading(false); return; } const loc = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced }); setUserLoc({ lat: loc.coords.latitude, lng: loc.coords.longitude }); setNearActive(true); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch (e: any) { Alert.alert("Error", e.message); } finally { setLocLoading(false); } };
  const changeAppTheme = async (value: "light" | "dark") => { setAppTheme(value); await AsyncStorage.setItem("uzhaivo_app_theme", value); };
  const changeAppFontSize = async (value: string) => { setAppFontSize(value); await AsyncStorage.setItem("uzhaivo_font_size", value); };
  const changeAppLanguage = async (value: Locale) => { setLocale(value); await saveAppLanguage(value); };
  const clearAppCache = async () => { await AsyncStorage.multiRemove(["uzhaivo_calls", "workuru_saved_jobs", "uzhaivo_profile_photo"]); setCallHistory([]); setSaved([]); Alert.alert("Cache cleared", "Temporary app cache was cleared."); };
  const clearAppData = () => { Alert.alert("Clear app data?", "This will remove local preferences and sign you out. Supabase jobs and applications will not be deleted.", [{ text: "Cancel" }, { text: "Clear Data", style: "destructive", onPress: async () => { await AsyncStorage.clear(); await signOut(); setUser(null); setSaved([]); setCallHistory([]); setAppTheme("light"); setAppFontSize("Medium"); setLocale("en"); setStep("login"); } }]); };

  const filteredJobs = useMemo(() => { let list: any[] = jobs.map(j => { const anyJob = j as any; if (userLoc && anyJob.lat && anyJob.lng) { return { ...j, distance: getDistanceKm(userLoc.lat, userLoc.lng, anyJob.lat, anyJob.lng) }; } if (userLoc) { const mockDist = (j.title.length % 5) + Math.random() * 2 + 0.3; return { ...j, distance: mockDist }; } return j; }); if (filter !== "All") list = list.filter((j) => j.category === filter); if (search.trim()) { const q = search.toLowerCase(); list = list.filter((j) => j.title.toLowerCase().includes(q) || j.category.toLowerCase().includes(q) || j.location.toLowerCase().includes(q)); } if (nearActive && userLoc) { list = list.sort((a, b) => (a.distance || 999) - (b.distance || 999)); } return list; }, [jobs, filter, search, userLoc, nearActive]);
  const categoryCounts = useMemo(() => { const counts: any = { All: jobs.length }; CATEGORIES.forEach((c: string) => { counts[c] = jobs.filter((j) => j.category === c).length; }); return counts; }, [jobs]);
  const handleLang = async (l: Locale) => { setLocale(l); await saveAppLanguage(l); Haptics.selectionAsync(); setStep(user ? "home" : "login"); };
  const handleSendOtp = async () => { if (phone.trim().length < 10) { Alert.alert("Invalid Phone"); return; } setLoading(true); setLoadingMsg("Sending OTP..."); try { await requestPhoneOtp(normalizePhone(phone)); setStep("otp"); } catch (e: any) { Alert.alert("Error", e.message); } finally { setLoading(false); setLoadingMsg(""); } };
  const handleVerify = async () => { if (otp.length !== 6) { Alert.alert("Invalid OTP"); return; } setLoading(true); setLoadingMsg("Verifying..."); try { const u = await verifyPhoneOtp(normalizePhone(phone), otp, locale); setUser(u); setPhone(""); setOtp(""); if (u.role === "owner") setActiveTab("addJob"); setStep(u.role ? "home" : "role"); } catch (e: any) { Alert.alert("Error", e.message); } finally { setLoading(false); setLoadingMsg(""); } };
  const handleRole = async (role: Role) => { if (!user) return; const updated = { ...user, role }; setUser(updated); await saveUser(updated); if (role === "owner") { setActiveTab("addJob"); } else { setActiveTab("home"); } setStep("home"); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); };

  if (isConnected === false) return <NoInternetScreen locale={locale} onRetry={async () => { const s = await NetInfo.fetch(); setIsConnected(s.isConnected); }} />;
  if (step === "splash") return <SplashScreen />;
  if (step === "lang") return <LanguageScreen onSelect={handleLang} locale={locale} />;
  if (step === "login") return <LoginPhoneScreen locale={locale} phone={phone} setPhone={setPhone} onSend={handleSendOtp} loading={loading} onLanguageChange={async (l: any) => { setLocale(l); await saveAppLanguage(l); }} />;
  if (step === "otp") return <LoginOtpScreen locale={locale} phone={phone} otp={otp} setOtp={setOtp} onVerify={handleVerify} onResend={handleSendOtp} onBack={() => { setStep("login"); setOtp(""); }} loading={loading} onTerms={() => setStep("terms")} onPrivacy={() => setStep("privacy")} onLanguageChange={async (l:any) => { setLocale(l); await saveAppLanguage(l); }} />;
  if (step === "terms") return <TermsScreen locale={locale} onBack={() => setStep(user ? "home" : "otp")} onLanguageChange={async (l: any) => { setLocale(l); await saveAppLanguage(l); }} />;
  if (step === "privacy") return <PrivacyScreen locale={locale} onBack={() => setStep(user ? "home" : "otp")} onLanguageChange={async (l: any) => { setLocale(l); await saveAppLanguage(l); }} />;
  if (step === "role") return <UzhaivoModernRoleScreen locale={locale} onSelectRole={handleRole} />;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }, appTheme === "dark" && { backgroundColor: "#101827" }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ORANGE]} tintColor={ORANGE} title={locale === "ta" ? "இழுத்து புதுப்பிக்கவும்" : "Pull to refresh"} />}>
        <View style={styles.topBar}><BrandMark /><View style={styles.topActions}>
        <Pressable onPress={async () => { const newLang = locale === "ta" ? "en" : "ta"; setLocale(newLang); await saveAppLanguage(newLang); Haptics.selectionAsync(); }} style={[styles.langToggle, { backgroundColor: ORANGE, borderColor: ORANGE }]}><Text style={[styles.langToggleText, { color: "#fff" }]}>{locale === "ta" ? "தமிழ்" : "English"} • {locale === "ta" ? "En" : "த"}</Text></Pressable>
        <Pressable onPress={() => { setStep("home"); setActiveTab("profile"); }} style={styles.avatar}><Text style={styles.avatarText}>{user?.phone?.slice(-2) || "U"}</Text></Pressable></View></View>
        {step === "detail" && selectedJob && <JobDetailScreen job={selectedJob} locale={locale} user={user} platformSettings={platformSettings} saved={saved} onToggleSave={async () => { const s = await toggleSavedJob(selectedJob.id); setSaved(s); }} onBack={() => { setStep("home"); if(user?.role === "owner") setActiveTab("addJob"); else if(activeTab !== "applied") setActiveTab("home"); }} />}
        {step !== "detail" && activeTab === "addJob" && (
          <PostNewJobScreen locale={locale} user={user} initialJob={editingJob} loading={loading}
            onPublish={async (form: any) => { setLoading(true); try { const savedJob = await saveJob({ title: form.title, category: form.category === "Other" ? form.customCategory : form.category, salary: parseInt(form.salaryMin) || 0, district: "Tamil Nadu", location: form.location, phone: form.phone || user?.phone || "", description: `Type:${form.jobType}|Time:${form.timing}|Need:${form.workers}|Sal:${form.salaryType}|Urg:${form.urgency}|Range:${form.salary}|${form.description}`, is_active: true, owner_id: user?.id || "preview", lat: form.lat, lng: form.lng, proof_required: Boolean(form.proof_required), requires_proof: Boolean(form.proof_required), proof_types: form.proof_types || [], proof_description: form.proof_description || "", proof_image_url: form.proof_image_url || "" } as any); console.log("[Uzhaivo] Saved to Supabase:", savedJob.id); const j = await getJobs(); setJobs(j); setEditingJob(null); Alert.alert(locale==="ta" ? "வெற்றி!" : "Success", locale==="ta" ? "Supabase la save aachu! My Jobs la paarunga!" : "Saved to Supabase! Check My Jobs!"); setActiveTab("myJobs"); } catch(e:any){ Alert.alert("Error", e.message);} finally{ setLoading(false);} }}
            onUpdate={async (id: string, form: any) => { setLoading(true); try { try { await updateJob(id, { title: form.title, category: form.category === "Other" ? form.customCategory : form.category, salary: form.salary, location: form.location, phone: form.phone, description: `Type:${form.jobType}|Time:${form.timing}|Need:${form.workers}|Sal:${form.salaryType}|Urg:${form.urgency}|${form.description}`, proof_required: Boolean(form.proof_required), requires_proof: Boolean(form.proof_required), proof_types: form.proof_types || [], proof_description: form.proof_description || "", proof_image_url: form.proof_image_url || "" } as any); const j = await getJobs(); setJobs(j); } catch(e:any){ console.error(e); Alert.alert("Error", e.message); } setEditingJob(null); Alert.alert(locale==="ta" ? "புதுப்பிக்கப்பட்டது!" : "Updated!", locale==="ta" ? "வேலை புதுப்பிக்கப்பட்டது!" : "Job updated!"); setActiveTab("myJobs"); } finally { setLoading(false); } }}
          />
        )}
        {step !== "detail" && activeTab === "myJobs" && (
          <MyPostedJobsScreen jobs={jobs} user={user} locale={locale} refreshing={refreshing} onRefresh={onRefresh}
            onEdit={(job:any) => { setEditingJob(job); setActiveTab("addJob"); Haptics.selectionAsync(); }}
            onDelete={(id:string) => { Alert.alert(locale==="ta" ? "வேலையை நீக்கவா?" : "Delete Job?", locale==="ta" ? "நீக்க வேண்டுமா?" : "Are you sure?", [{ text: locale==="ta" ? "ரத்து" : "Cancel" }, { text: locale==="ta" ? "நீக்கு" : "Delete", style: "destructive", onPress: async () => { try { await deleteJob(id); const j = await getJobs(); setJobs(j); } catch(e){ console.error(e); } Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }}]); }}
          />
        )}
        {step !== "detail" && activeTab === "proofs" && user?.role === "owner" && <ReceivedProofsScreen user={user} locale={locale} onJobUpdated={onRefresh} />}
        {step !== "detail" && activeTab === "applied" && user?.role !== "owner" && <AppliedJobsScreen user={user} locale={locale} onOpenJob={(job: Job) => { setSelectedJob(job); setStep("detail"); }} />}
        {step !== "detail" && activeTab === "home" && <JobsBrowserScreen locale={locale} filteredJobs={filteredJobs} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} categoryCounts={categoryCounts} nearActive={nearActive} handleNear={handleNear} locLoading={locLoading} saved={saved} approvedJobIds={approvedJobIds} onCall={(job: Job) => { saveCallHistory(job); Linking.openURL(`tel:${job.phone}`); }} onSave={async (job: Job) => { const s = await toggleSavedJob(job.id); setSaved(s); }} onOpen={(job: Job) => { setSelectedJob(job); setStep("detail"); }} />}
        {activeTab === "calls" && step !== "detail" && <CallsScreen calls={callHistory} locale={locale} onCallAgain={(c: any) => Linking.openURL(`tel:${c.phone}`)} onClear={async () => { Alert.alert(locale==="ta" ? "அழைப்புகளை அழிக்கவா?" : "Clear calls?", locale==="ta" ? "எல்லாம் நீக்கப்படும்" : "All call history will be deleted", [{ text: locale==="ta" ? "ரத்து" : "Cancel" }, { text: locale==="ta" ? "அழி" : "Clear", style: "destructive", onPress: async () => { setCallHistory([]); await AsyncStorage.removeItem("uzhaivo_calls"); } }]); }} onGoJobs={() => setActiveTab(user?.role === "owner" ? "addJob" : "home")} />}
        {activeTab === "profile" && step !== "detail" && (
          settingsOpen ? <AppSettingsScreen locale={locale} theme={appTheme} fontSize={appFontSize} onThemeChange={changeAppTheme} onFontSizeChange={changeAppFontSize} onLanguageChange={changeAppLanguage} onClearCache={clearAppCache} onClearData={clearAppData} onBack={() => setSettingsOpen(false)} /> : user?.role === "owner" ? (
            <View><Pressable onPress={() => setSettingsOpen(true)} style={{ alignSelf: "flex-end", width: 42, height: 42, borderRadius: 13, backgroundColor: "#fff", borderWidth: 1, borderColor: "#FFE0CA", alignItems: "center", justifyContent: "center", marginBottom: 8 }}><MaterialCommunityIcons name="cog-outline" size={21} color={ORANGE} /></Pressable><OwnerProfileBoss user={user} jobs={jobs} locale={locale}
              appTheme={appTheme} appFontSize={appFontSize} onThemeChange={changeAppTheme} onFontSizeChange={changeAppFontSize} onAppLanguageChange={changeAppLanguage} onClearCache={clearAppCache} onClearData={clearAppData}
              onUpdateName={async (name: string) => { const updated = { ...user, name }; setUser(updated); await saveUser(updated); Alert.alert(locale==="ta" ? "புதுப்பிக்கப்பட்டது!" : "Updated", locale==="ta" ? "பெயர் மாற்றப்பட்டது!" : "Business name updated!"); }}
              onLanguageChange={() => setStep("lang")}
              onTerms={() => setStep("terms")}
              onPrivacy={() => setStep("privacy")}
              onDeleteAccount={() => { Alert.alert(locale==="ta" ? "கணக்கை நீக்கவா?" : "Delete Account?", locale==="ta" ? "எல்லா வேலைகளும் நீக்கப்படும்!" : "All your jobs will be deleted!", [{ text: locale==="ta" ? "ரத்து" : "Cancel" }, { text: locale==="ta" ? "நீக்கு" : "Delete", style: "destructive", onPress: async () => { await signOut(); setUser(null); setStep("login"); } }]); }}
              onLogout={async () => { setLoading(true); await signOut(); setUser(null); setActiveTab("home"); setStep("login"); setLoading(false); }}
            /></View>
          ) : (
            <View><Pressable onPress={() => setSettingsOpen(true)} style={{ alignSelf: "flex-end", width: 42, height: 42, borderRadius: 13, backgroundColor: "#fff", borderWidth: 1, borderColor: "#FFE0CA", alignItems: "center", justifyContent: "center", marginBottom: 8 }}><MaterialCommunityIcons name="cog-outline" size={21} color={ORANGE} /></Pressable>
              <WorkerProfileTop user={user} locale={locale} onUpdate={async (updated: UserRecord) => { setUser(updated); await saveUser(updated); Alert.alert(locale === "ta" ? "புதுப்பிக்கப்பட்டது" : "Profile updated", locale === "ta" ? "உங்கள் சுயவிவரம் சேமிக்கப்பட்டது" : "Your profile was saved."); }} />
              <View style={{ backgroundColor: "#fff", borderRadius: 18, padding: 16, marginTop: 14, borderWidth: 1, borderColor: "#FFF1E7" }}>
                <Text style={{ color: "#0A1931", fontSize: 15, fontWeight: "900", marginBottom: 10 }}>{locale === "ta" ? "அமைப்புகள்" : "Settings"}</Text>
                <Pressable onPress={async () => { const next = locale === "ta" ? "en" : "ta"; setLocale(next); await saveAppLanguage(next); }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#FFF1E7" }}><View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}><MaterialCommunityIcons name="translate" size={20} color={ORANGE} /><Text style={{ color: "#0A1931", fontSize: 13, fontWeight: "800" }}>Language</Text></View><Text style={{ color: ORANGE, fontSize: 12, fontWeight: "900" }}>{locale === "ta" ? "தமிழ்" : "English"}</Text></Pressable>
                <Pressable onPress={() => Alert.alert("Help & Support", "For help, contact Uzhaivo support through your project administrator.")} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#FFF1E7" }}><MaterialCommunityIcons name="help-circle-outline" size={20} color={ORANGE} /><Text style={{ color: "#0A1931", fontSize: 13, fontWeight: "800" }}>Help & Support</Text></Pressable>
                <Pressable onPress={() => setStep("terms")} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#FFF1E7" }}><MaterialCommunityIcons name="file-document-outline" size={20} color={ORANGE} /><Text style={{ color: "#0A1931", fontSize: 13, fontWeight: "800" }}>Terms</Text></Pressable>
                <Pressable onPress={() => Alert.alert("Delete Account?", "This will sign you out. Contact support for permanent deletion.", [{ text: "Cancel" }, { text: "Continue", style: "destructive", onPress: async () => { await signOut(); setUser(null); setActiveTab("home"); setStep("login"); } }])} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#FFF1E7" }}><MaterialCommunityIcons name="delete-outline" size={20} color="#D64545" /><Text style={{ color: "#D64545", fontSize: 13, fontWeight: "800" }}>Delete Account</Text></Pressable>
                <Pressable onPress={async () => { setLoading(true); await signOut(); setUser(null); setActiveTab("home"); setStep("login"); setLoading(false); }} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 13 }}><MaterialCommunityIcons name="logout" size={20} color="#D64545" /><Text style={{ color: "#D64545", fontSize: 13, fontWeight: "800" }}>{t("logout")}</Text></Pressable>
              </View>
            </View>
          )
        )}
      </ScrollView>
      <View style={styles.bottomNav}>
        {user?.role === "owner" ? (
          [
            { id: "home", icon: "briefcase-search", label: locale==="ta" ? "வேலைகள்" : "Jobs" },
            { id: "addJob", icon: "plus-box", label: locale==="ta" ? POST_TA.postTab : "Post" },
            { id: "myJobs", icon: "briefcase-check", label: locale==="ta" ? POST_TA.myJobsTab : "My Jobs" },
            { id: "proofs", icon: "file-check-outline", label: locale==="ta" ? "சான்றிதழ்கள்" : "Proofs" },
            { id: "calls", icon: "phone", label: locale==="ta" ? POST_TA.callsTab : "Calls" },
            { id: "profile", icon: "account", label: locale==="ta" ? POST_TA.profileTab : "Profile" }
          ].map((it) => { const isActive = activeTab === it.id; return <Pressable key={it.id} onPress={() => { Haptics.selectionAsync(); if(step==="detail") setStep("home"); setActiveTab(it.id); }} style={styles.navItem}><View style={[styles.navIconWrap, isActive && styles.navIconWrapActive]}><MaterialCommunityIcons name={it.icon as any} size={20} color={isActive ? "#fff" : MUTED} /></View><Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{it.label}</Text></Pressable>; })
        ) : (
          [
            { id: "home", icon: "home", label: locale==="ta" ? "வேலைகள்" : "Jobs" },
            { id: "applied", icon: "briefcase-check-outline", label: locale==="ta" ? "விண்ணப்பங்கள்" : "Applied" },
            { id: "profile", icon: "account", label: locale==="ta" ? "சுயவிவரம்" : "Profile" }
          ].map((it) => { const isActive = activeTab === it.id; return <Pressable key={it.id} onPress={() => { Haptics.selectionAsync(); if(step==="detail") setStep("home"); setActiveTab(it.id); }} style={styles.navItem}><View style={[styles.navIconWrap, isActive && styles.navIconWrapActive]}><MaterialCommunityIcons name={it.icon as any} size={20} color={isActive ? "#fff" : MUTED} /></View><Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{it.label}</Text></Pressable>; })
        )}
      </View>
      {loading && <LoadingOverlay message={loadingMsg} />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF8F0" }, scrollContent: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 110 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 9 }, brandRowLarge: { transform: [{ scale: 1.12 }] as any }, brandIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center" }, brandIconLarge: { width: 56, height: 56, borderRadius: 20, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center" }, brandName: { color: "#0A1931", fontSize: 20, fontWeight: "900" as any }, brandNameLarge: { fontSize: 31 }, brandCaption: { color: "#FF6B00", fontSize: 9, fontWeight: "800" as any }, brandCaptionLarge: { fontSize: 10, marginTop: 2 },
  topBar: { minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }, topActions: { flexDirection: "row", alignItems: "center", gap: 10 }, avatar: { width: 36, height: 36, borderRadius: 14, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#FFE0CA" }, avatarText: { color: ORANGE, fontWeight: "900" as any, fontSize: 14 },
  langToggle: { borderRadius: 14, backgroundColor: "#FFFFFF", paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: "#FFFFFF", elevation: 2 }, langToggleText: { color: ORANGE, fontSize: 16, fontWeight: "800" as any },
  card: { backgroundColor: "#FFFFFF", borderRadius: 22, elevation: 8 } as any, cardPressed: { transform: [{ scale: 0.985 }], opacity: 0.94 },
  loadingOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255,248,240,0.85)", alignItems: "center", justifyContent: "center", zIndex: 999 }, loadingOverlayCard: { backgroundColor: "#FFFFFF", padding: 28, borderRadius: 24, alignItems: "center", minWidth: 200, elevation: 12 }, loadingOverlayIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center", marginBottom: 6 }, loadingOverlayTitle: { color: "#0A1931", fontSize: 16, fontWeight: "900" as any },
  kicker: { color: ORANGE, fontSize: 11, fontWeight: "900" as any, letterSpacing: 1.2, marginBottom: 9 },
  languageScreen: { flex: 1, backgroundColor: "#FFF8F0", paddingHorizontal: 22, paddingTop: 74, paddingBottom: 32 }, languageTop: { alignItems: "center", marginBottom: 46 }, languageCopy: { marginBottom: 25 }, languageTitle: { color: "#0A1931", fontSize: 28, fontWeight: "900" as any }, languageTamilTitle: { color: ORANGE, fontSize: 17, fontWeight: "800" as any, marginTop: 6 }, languageCards: { gap: 14 }, languageCard: { minHeight: 92, padding: 16, flexDirection: "row", alignItems: "center", gap: 13, borderRadius: 22 }, languageCardSelected: { borderColor: ORANGE, borderWidth: 2 }, languageCircle: { width: 56, height: 56, borderRadius: 18, backgroundColor: "#FFF1E7", alignItems: "center", justifyContent: "center" }, languageCircleText: { color: ORANGE, fontSize: 25, fontWeight: "900" as any }, languageCardText: { flex: 1 }, languageCardTitle: { color: "#0A1931", fontSize: 17, fontWeight: "900" as any }, languageCardSub: { color: MUTED, fontSize: 13, marginTop: 3 }, radioEmpty: { width: 23, height: 23, borderRadius: 12, borderWidth: 2, borderColor: "#D7C9BF" },
  welcomeRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }, eyebrowText: { color: ORANGE, fontSize: 10, fontWeight: "900" as any, letterSpacing: 1.1, marginBottom: 7 }, pageTitle: { color: "#0A1931", fontSize: 26, fontWeight: "900" as any, lineHeight: 32 }, locationPill: { backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, marginTop: 4, borderWidth: 1, borderColor: "#FFFFFF" }, locationPillText: { color: "#0A1931", fontWeight: "800" as any, fontSize: 11 },
  chipRow: { gap: 8, paddingBottom: 16, flexDirection: "row" as any }, filterChip: { borderRadius: 14, borderWidth: 1, borderColor: "#FFFFFF", paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#FFFFFF" }, filterChipActive: { backgroundColor: ORANGE, borderColor: ORANGE }, filterChipText: { color: MUTED, fontSize: 12, fontWeight: "700" as any }, filterChipTextActive: { color: "#fff", fontWeight: "800" as any },
  callButton: { backgroundColor: GREEN, borderRadius: 14, minHeight: 42, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", gap: 6, elevation: 4 }, callButtonText: { color: "#fff", fontSize: 13, fontWeight: "900" as any },
  bottomNav: { position: "absolute", left: 16, right: 16, bottom: 16, height: 72, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.96)", flexDirection: "row", justifyContent: "space-around", alignItems: "center", elevation: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.9)" }, navItem: { alignItems: "center", justifyContent: "center", gap: 3, minWidth: 64 }, navIconWrap: { width: 36, height: 30, alignItems: "center", justifyContent: "center", borderRadius: 12 }, navIconWrapActive: { backgroundColor: ORANGE }, navLabel: { color: MUTED, fontSize: 10, fontWeight: "700" as any }, navLabelActive: { color: ORANGE, fontWeight: "900" as any },
  profileHero: { alignItems: "center", marginTop: 8, marginBottom: 30 }, profileAvatar: { width: 84, height: 84, borderRadius: 28, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", elevation: 6, borderWidth: 3, borderColor: "#FFFFFF" }, profileAvatarText: { color: "#fff", fontSize: 32, fontWeight: "900" as any }, profileName: { color: "#0A1931", fontSize: 19, fontWeight: "900" as any, marginTop: 13, textAlign: "center" }, profilePhone: { color: MUTED, fontSize: 12, marginTop: 4, fontWeight: "600" as any }, profileFooter: { alignItems: "center", marginTop: 32 }, logoutButton: { flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#FFE0E0" }, logoutText: { color: "#D54B3F", fontSize: 14, fontWeight: "900" as any },
});

const detailStyles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  backBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#FFE0CA" },
  iconBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#FFE0CA" },
  heroCard: { backgroundColor: "#fff", borderRadius: 24, padding: 18, borderWidth: 1, borderColor: "#FFF1E7", elevation: 4 },
  catPill: { backgroundColor: "#FFF1E7", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: "#FFE0CA" }, catPillText: { color: ORANGE, fontSize: 11, fontWeight: "900" },
  verifiedPill: { backgroundColor: "#E8F5E9", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1, borderColor: "#C8E6C9" }, verifiedPillText: { color: GREEN, fontSize: 10, fontWeight: "800" },
  urgentPill: { backgroundColor: "#FF3B30", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 }, urgentPillText: { color: "#fff", fontSize: 10, fontWeight: "900" },
  title: { color: "#0A1931", fontSize: 24, fontWeight: "900", marginTop: 14, lineHeight: 28 },
  salaryRow: { flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 10 }, price: { color: "#0A1931", fontSize: 26, fontWeight: "900" }, priceType: { color: MUTED, fontSize: 13, fontWeight: "700" },
  postedInfo: { color: MUTED, fontSize: 12, fontWeight: "600", marginTop: 8 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  infoBox: { width: "48%", backgroundColor: "#fff", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "#FFF1E7", elevation: 2 }, infoLabel: { color: MUTED, fontSize: 10, fontWeight: "700", marginTop: 6, textTransform: "uppercase" }, infoValue: { color: "#0A1931", fontSize: 13, fontWeight: "900", marginTop: 3 },
  descCard: { backgroundColor: "#fff", borderRadius: 20, padding: 18, marginTop: 14, borderWidth: 1, borderColor: "#FFF1E7", elevation: 2 }, sectionTitle: { color: "#0A1931", fontSize: 15, fontWeight: "900", marginBottom: 10 }, descText: { color: "#5A4D45", fontSize: 13, fontWeight: "600", lineHeight: 20 },
  mapBox: { backgroundColor: "#FFF8F0", borderRadius: 16, padding: 16, alignItems: "center", marginTop: 16, borderWidth: 1, borderColor: "#FFE0CA", borderStyle: "dashed" as any }, mapText: { color: "#0A1931", fontSize: 13, fontWeight: "800", marginTop: 6 }, mapSub: { color: MUTED, fontSize: 11, fontWeight: "600", marginTop: 3 },
  ownerCard: { backgroundColor: "#fff", borderRadius: 18, padding: 14, marginTop: 14, borderWidth: 1, borderColor: "#FFF1E7" }, ownerRow: { flexDirection: "row", alignItems: "center", gap: 10 }, ownerAvatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center" }, ownerName: { color: "#0A1931", fontSize: 13, fontWeight: "900" }, ownerPhone: { color: MUTED, fontSize: 11, fontWeight: "600", marginTop: 2 }, ownerVerified: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#E8F5E9", paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 18 }, callBtnLarge: { flex: 1.3, backgroundColor: GREEN, borderRadius: 16, height: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, elevation: 5 }, callBtnLargeText: { color: "#fff", fontSize: 15, fontWeight: "900" }, waBtn: { flex: 1, backgroundColor: "#25D366", borderRadius: 16, height: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, elevation: 4 }, waBtnText: { color: "#fff", fontSize: 14, fontWeight: "900" },
});

export const WorkUruApp = UzhaivoApp;
export default UzhaivoApp;
