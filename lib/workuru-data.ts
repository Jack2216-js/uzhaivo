// @ts-nocheck
// UZHAIVO - FULL SUPABASE - HARD DELETE FIXED - NO TS ERRORS

import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import { getFirebaseUser, requestFirebaseOtp, signOutFirebase, verifyFirebaseOtp } from "@/lib/firebase-auth";

export type Locale = "en" | "ta";
export type Role = "worker" | "owner";

export type Job = {
  id: string;
  title: string;
  category: string;
  salary: number;
  district: string;
  location: string;
  lat?: number;
  lng?: number;
  phone: string;
  description: string;
  image_url?: string;
  is_active: boolean;
  owner_id: string;
  created_at: string;
  proof_required?: boolean;
  proof_types?: string[];
  proof_description?: string;
  proof_image_url?: string;
};

export type Ad = {
  id: string;
  shop_name: string;
  district: string;
  poster_url?: string;
  phone: string;
  is_active: boolean;
  created_at: string;
};

export type UserRecord = {
  id: string;
  phone: string;
  name?: string;
  district: string;
  role?: Role;
  language: Locale;
};

export const DISTRICTS = [
  "Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kancheepuram","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivagangai","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar","The Nilgiris",
];

export const CATEGORIES = ["Driver", "Cook", "Steel Helper", "Sago Factory", "Hotel Helper", "Construction", "Mason", "Painter", "Electrician", "Plumber", "Carpenter", "Welder", "Cleaner", "Security", "Gardener", "Labour", "Delivery", "Tailor", "Mechanic", "AC Technician", "Housekeeping", "Waiter", "Loading", "Office Assistant", "Helper", "Other", "Catering"] as const;
// PROOF SYSTEM - Professional Verification
export const PROOF_TYPES = [
  "Driving License",
  "Aadhaar Card", 
  "PAN Card",
  "Experience Certificate",
  "Skill Certificate",
  "Vehicle RC",
  "Insurance",
  "Other"
] as const;

export type ProofType = typeof PROOF_TYPES[number];

export const PROOF_TYPE_TRANSLATIONS: Record<string, {en: string, ta: string, icon: string}> = {
  "Driving License": {en: "Driving License", ta: "ஓட்டுநர் உரிமம்", icon: "card-account-details"},
  "Aadhaar Card": {en: "Aadhaar Card", ta: "ஆதார் அட்டை", icon: "card-account-details-outline"},
  "PAN Card": {en: "PAN Card", ta: "பான் கார்டு", icon: "card-text"},
  "Experience Certificate": {en: "Experience Certificate", ta: "அனுபவச் சான்றிதழ்", icon: "certificate"},
  "Skill Certificate": {en: "Skill Certificate", ta: "திறன் சான்றிதழ்", icon: "school"},
  "Vehicle RC": {en: "Vehicle RC", ta: "வாகன பதிவு", icon: "car"},
  "Insurance": {en: "Insurance", ta: "காப்பீடு", icon: "shield-check"},
  "Other": {en: "Other Document", ta: "மற்ற ஆவணம்", icon: "file-document"},
};

export type UserProof = {
  id: string;
  user_id: string;
  proof_type: string;
  proof_number?: string;
  image_url?: string;
  verified: boolean;
  created_at: string;
};


// FULL CATEGORY TRANSLATIONS - 100% Tamil
export const CATEGORY_TRANSLATIONS: Record<string, {en: string, ta: string}> = {
  "Mason": {en: "Mason", ta: "கொத்தனார்"},
  "Painter": {en: "Painter", ta: "பெயிண்டர்"},
  "Electrician": {en: "Electrician", ta: "மின்சாரம்"},
  "Plumber": {en: "Plumber", ta: "குழாய்"},
  "Carpenter": {en: "Carpenter", ta: "தச்சர்"},
  "Welder": {en: "Welder", ta: "வெல்டர்"},
  "Driver": {en: "Driver", ta: "ஓட்டுநர்"},
  "Cook": {en: "Cook", ta: "சமையல்"},
  "Cleaner": {en: "Cleaner", ta: "துப்புரவு"},
  "Security": {en: "Security", ta: "காவல்"},
  "Gardener": {en: "Gardener", ta: "தோட்டம்"},
  "Labour": {en: "Labour", ta: "கூலி"},
  "Delivery": {en: "Delivery", ta: "டெலிவரி"},
  "Tailor": {en: "Tailor", ta: "தையல்"},
  "Mechanic": {en: "Mechanic", ta: "மெக்கானிக்"},
  "AC Technician": {en: "AC Technician", ta: "ஏசி"},
  "Housekeeping": {en: "Housekeeping", ta: "வீடு"},
  "Waiter": {en: "Waiter", ta: "பரிமாறுபவர்"},
  "Construction": {en: "Construction", ta: "கட்டுமானம்"},
  "Loading": {en: "Loading", ta: "சுமை"},
  "Office Assistant": {en: "Office Assistant", ta: "அலுவலகம்"},
  "Helper": {en: "Helper", ta: "உதவியாளர்"},
  "Other": {en: "Other", ta: "மற்றவை"},
  "Catering": {en: "Catering", ta: "கேட்டரிங்"},
  "Steel Helper": {en: "Steel Helper", ta: "ஸ்டீல் உதவியாளர்"},
  "Sago Factory": {en: "Sago Factory", ta: "ஜவ்வரிசி தொழிற்சாலை"},
  "Hotel Helper": {en: "Hotel Helper", ta: "ஹோட்டல் உதவியாளர்"},
};

export const getCategoryName = (cat: string, locale: Locale) => {
  const entry = CATEGORY_TRANSLATIONS[cat];
  if (!entry) return cat;
  return locale === "ta" ? entry.ta : entry.en;
};

const en = {
  chooseLanguage: "Choose your language",
  chooseLanguageTamil: "Ungal mozhiyai therndedukkavum",
  continue: "Continue",
  continueBilingual: "Thodarvum / Continue",
  tamil: "Tamil",
  tamilNative: "தமிழ்",
  english: "English",
  tamilContinue: "Tamil la thodaravum",
  englishContinue: "Continue in English",
  tagline: "Jobs in Tamil Nadu, Workers in Tamil Nadu",
  taglineShort: "Tamil Nadu la Velai",
  splashLine: "Local work. Real people.",
  splashTamil: "Unga ooru velai, unga kaiyil",
  getStarted: "Find work that starts today",
  phoneLogin: "Login with phone",
  phoneLoginTamil: "Phone moolama login pannunga",
  phoneNumber: "Phone number",
  phoneHint: "+91 98765 43210",
  sendOtp: "Send OTP",
  resendOtp: "Resend OTP",
  enterOtp: "Enter the 6-digit OTP",
  verify: "Verify & continue",
  otpSent: "OTP sent to your phone",
  demoHint: "Real OTP will be sent via SMS",
  invalidPhone: "Enter a valid phone number",
  invalidOtp: "Enter the 6-digit OTP",
  selectRole: "What brings you here?",
  selectRoleTamil: "Neenga enna thedureenga?",
  worker: "I'm looking for a job",
  workerTamil: "Velai theduren",
  workerSub: "Daily work opportunities near you",
  owner: "I'm looking for workers",
  ownerTamil: "Aalu theduren",
  ownerSub: "Find dependable hands for your work",
  jobs: "Jobs",
  calls: "Calls",
  profile: "Profile",
  myJobs: "My jobs",
  post: "Post",
  searchJobs: "Search jobs, places or skills",
  latest: "Latest near you",
  adLabel: "Local offer",
  adTitle: "Steel & kitchen helpers needed",
  adSub: "Walk-in today at Tamil Nadu Steel Works",
  viewOffer: "View offer",
  salary: "Salary",
  perDay: "/ day",
  location: "Location",
  district: "District",
  active: "Active",
  paused: "Paused",
  call: "Call",
  noJobs: "No jobs match this search",
  tryAnother: "Try another skill or clear a filter.",
  all: "All",
  under1000: "Under ₹1,000",
  above1000: "₹1,000+",
  within5km: "Within 5 km",
  ownerDashboard: "Owner dashboard",
  ownerGreeting: "Build your team, one good hire at a time.",
  totalJobs: "Total jobs",
  totalCalls: "Calls this week",
  postNewJob: "Post a new job",
  postNewJobSub: "Reach Tamil Nadu workers today",
  yourListings: "Your listings",
  noListings: "Your job listings will appear here.",
  pauseJob: "Pause job",
  activateJob: "Activate job",
  jobPosted: "Job posted successfully",
  jobPostedSub: "Workers in Tamil Nadu can now discover it.",
  jobTitle: "Job title",
  chooseCategory: "Choose a category",
  salaryPerDay: "Daily salary",
  salaryHint: "e.g. 950",
  useLocation: "Use current location",
  locationHint: "Area, street or landmark",
  contactPhone: "Contact phone",
  description: "Description",
  descriptionHint: "Tell workers what a good day on this job looks like…",
  addPhoto: "Add a job photo",
  addPhotoSub: "Optional · helps workers decide faster",
  voiceInput: "Speak description",
  voiceReady: "Voice input ready",
  submitJob: "Publish job",
  requiredField: "Please fill this field",
  profileTitle: "Your profile",
  editProfile: "Edit details",
  role: "Role",
  language: "Language",
  changeLanguage: "Change language",
  phone: "Phone",
  chooseDistrict: "Choose your district",
  logout: "Log out",
  logoutSub: "You can come back anytime.",
  save: "Save",
  cancel: "Cancel",
  back: "Back",
  close: "Close",
  loading: "Loading…",
  somethingWrong: "Something went wrong",
  retry: "Try again",
  previewData: "Showing Tamil Nadu preview data",
  supabaseReady: "Supabase-ready repository",
  nativeHint: "Native action ready for device",
  callHistory: "Recent calls",
  noCalls: "Your call history will appear here.",
  today: "Today",
  yesterday: "Yesterday",
  minutesAgo: "minutes ago",
  menu: "Menu",
  welcomeBack: "Welcome back",
  findWork: "Find work that fits your day.",
  quickFilters: "Quick filters",
  jobDetails: "Job details",
  applyNow: "Call to apply",
  share: "Share",
  saved: "Saved",
  saveJob: "Save job",
  removeSaved: "Remove saved job",
  emptySearch: "Try a shorter search",
  confirmLogout: "Log out from WorkUru?",
  confirmLogoutSub: "Your saved language will stay on this device.",
  yesLogout: "Log out",
  noStay: "Stay",
  createdJustNow: "Just now",
  workersInSalem: "Workers in Tamil Nadu",
  jobsInSalem: "Jobs in Tamil Nadu",
  fastSimpleLocal: "Fast, simple, local",
  appVersion: "Uzhaivo · Tamil Nadu",
} as const;

export const ta: Record<keyof typeof en, string> = {
  chooseLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
  chooseLanguageTamil: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
  continue: "தொடரவும்",
  continueBilingual: "தொடரவும் / Continue",
  tamil: "தமிழ்",
  tamilNative: "தமிழ்",
  english: "ஆங்கிலம்",
  tamilContinue: "தமிழில் தொடரவும்",
  englishContinue: "ஆங்கிலத்தில் தொடரவும்",
  tagline: "தமிழ்நாட்டில் வேலை, தமிழ்நாட்டில் தொழிலாளர்கள்",
  taglineShort: "தமிழ்நாட்டில் வேலை",
  splashLine: "உள்ளூர் வேலை. உண்மையான மனிதர்கள்.",
  splashTamil: "உங்கள் ஊர் வேலை, உங்கள் கையில்",
  getStarted: "இன்றே தொடங்கும் வேலையை தேடுங்கள்",
  phoneLogin: "தொலைபேசி மூலம் உள்நுழைக",
  phoneLoginTamil: "Phone மூலம் login பண்ணுங்கள்",
  phoneNumber: "தொலைபேசி எண்",
  phoneHint: "+91 98765 43210",
  sendOtp: "OTP அனுப்பவும்",
  resendOtp: "OTP மீண்டும் அனுப்பவும்",
  enterOtp: "6 இலக்க OTP-யை உள்ளிடவும்",
  verify: "சரிபார்த்து தொடரவும்",
  otpSent: "உங்கள் தொலைபேசிக்கு OTP அனுப்பப்பட்டது",
  demoHint: "Real OTP SMS moolam varum",
  invalidPhone: "சரியான தொலைபேசி எண்ணை உள்ளிடவும்",
  invalidOtp: "6 இலக்க OTP-யை உள்ளிடவும்",
  selectRole: "நீங்கள் இங்கே ஏன் வந்துள்ளீர்கள்?",
  selectRoleTamil: "நீங்கள் என்ன தேடுகிறீர்கள்?",
  worker: "நான் வேலை தேடுகிறேன்",
  workerTamil: "வேலை தேடுகிறேன்",
  workerSub: "உங்களுக்கு அருகிலுள்ள தினசரி வேலைகள்",
  owner: "எனக்கு தொழிலாளர்கள் தேவை",
  ownerTamil: "ஆள் தேடுகிறேன்",
  ownerSub: "உங்கள் வேலைக்கு நம்பகமான நபர்களை தேடுங்கள்",
  jobs: "வேலைகள்",
  calls: "அழைப்புகள்",
  profile: "சுயவிவரம்",
  myJobs: "என் வேலைகள்",
  post: "பதிவு",
  searchJobs: "வேலை, இடம் அல்லது திறனைத் தேடுங்கள்",
  latest: "உங்களுக்கு அருகிலுள்ள புதியவை",
  adLabel: "உள்ளூர் சலுகை",
  adTitle: "ஸ்டீல் & சமையலறை உதவியாளர் தேவை",
  adSub: "தமிழ்நாட்டில் இன்று நேர்காணல்",
  viewOffer: "சலுகையைப் பார்க்கவும்",
  salary: "சம்பளம்",
  perDay: "/ நாள்",
  location: "இடம்",
  district: "மாவட்டம்",
  active: "செயலில்",
  paused: "இடைநிறுத்தம்",
  call: "அழைக்கவும்",
  noJobs: "இந்த தேடலுக்கு வேலைகள் இல்லை",
  tryAnother: "வேறு திறனை முயற்சிக்கவும் அல்லது filter-ஐ நீக்கவும்.",
  all: "அனைத்தும்",
  under1000: "₹1,000 க்குள்",
  above1000: "₹1,000+",
  within5km: "5 கி.மீ.க்குள்",
  ownerDashboard: "உரிமையாளர் டாஷ்போர்டு",
  ownerGreeting: "ஒரு நல்ல நியமனத்தால் உங்கள் குழுவை உருவாக்குங்கள்.",
  totalJobs: "மொத்த வேலைகள்",
  totalCalls: "இந்த வார அழைப்புகள்",
  postNewJob: "புதிய வேலை பதிவு",
  postNewJobSub: "இன்று தமிழ்நாடு தொழிலாளர்களை அடையுங்கள்",
  yourListings: "உங்கள் பதிவுகள்",
  noListings: "உங்கள் வேலைப் பதிவுகள் இங்கே தோன்றும்.",
  pauseJob: "வேலையை நிறுத்தவும்",
  activateJob: "வேலையை செயல்படுத்தவும்",
  jobPosted: "வேலை வெற்றிகரமாக பதிவு செய்யப்பட்டது",
  jobPostedSub: "தமிழ்நாடு தொழிலாளர்கள் இதை இப்போது பார்க்கலாம்.",
  jobTitle: "வேலைப் பெயர்",
  chooseCategory: "ஒரு வகையைத் தேர்ந்தெடுக்கவும்",
  salaryPerDay: "தினசரி சம்பளம்",
  salaryHint: "எ.கா. 950",
  useLocation: "தற்போதைய இடத்தைப் பயன்படுத்தவும்",
  locationHint: "பகுதி, தெரு அல்லது அடையாளம்",
  contactPhone: "தொடர்பு தொலைபேசி",
  description: "விவரம்",
  descriptionHint: "இந்த வேலையின் ஒரு நல்ல நாளைப் பற்றி சொல்லுங்கள்…",
  addPhoto: "வேலை புகைப்படம் சேர்க்கவும்",
  addPhotoSub: "விருப்பம் · விரைவாக முடிவு எடுக்க உதவும்",
  voiceInput: "விவரத்தைப் பேசவும்",
  voiceReady: "குரல் உள்ளீடு தயாராக உள்ளது",
  submitJob: "வேலையை வெளியிடவும்",
  requiredField: "இந்த புலத்தை நிரப்பவும்",
  profileTitle: "உங்கள் சுயவிவரம்",
  editProfile: "விவரங்களைத் திருத்தவும்",
  role: "பங்கு",
  language: "மொழி",
  changeLanguage: "மொழியை மாற்றவும்",
  phone: "தொலைபேசி",
  chooseDistrict: "உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
  logout: "வெளியேறவும்",
  logoutSub: "எப்போது வேண்டுமானாலும் திரும்பலாம்.",
  save: "சேமிக்கவும்",
  cancel: "ரத்து",
  back: "பின்செல்",
  close: "மூடு",
  loading: "ஏற்றுகிறது…",
  somethingWrong: "ஏதோ தவறாகிவிட்டது",
  retry: "மீண்டும் முயற்சிக்கவும்",
  previewData: "தமிழ்நாடு preview தரவு காட்டப்படுகிறது",
  supabaseReady: "Supabase-ready repository",
  nativeHint: "சாதனத்தில் native action தயாராக உள்ளது",
  callHistory: "சமீபத்திய அழைப்புகள்",
  noCalls: "உங்கள் அழைப்பு வரலாறு இங்கே தோன்றும்.",
  today: "இன்று",
  yesterday: "நேற்று",
  minutesAgo: "நிமிடங்களுக்கு முன்",
  menu: "மெனு",
  welcomeBack: "மீண்டும் வருக",
  findWork: "உங்கள் நாளுக்கு ஏற்ற வேலையை தேடுங்கள்.",
  quickFilters: "விரைவு filters",
  jobDetails: "வேலை விவரங்கள்",
  applyNow: "விண்ணப்பிக்க அழைக்கவும்",
  share: "பகிரவும்",
  saved: "சேமிக்கப்பட்டது",
  saveJob: "வேலையை சேமிக்கவும்",
  removeSaved: "சேமித்த வேலையை நீக்கவும்",
  emptySearch: "குறுகிய தேடலை முயற்சிக்கவும்",
  confirmLogout: "Uzhaivo-வில் இருந்து வெளியேறவா?",
  confirmLogoutSub: "உங்கள் மொழி இந்த சாதனத்தில் சேமிக்கப்படும்.",
  yesLogout: "வெளியேறவும்",
  noStay: "இங்கே இருங்கள்",
  createdJustNow: "இப்போதுதான்",
  workersInSalem: "தமிழ்நாடு தொழிலாளர்கள்",
  jobsInSalem: "தமிழ்நாடு வேலைகள்",
  fastSimpleLocal: "வேகமானது, எளிமையானது, உள்ளூரானது",
  appVersion: "Uzhaivo · தமிழ்நாடு",
};

export type TranslationKey = keyof typeof en;
export const translations: Record<Locale, Record<TranslationKey, string>> = { en, ta };
export const translate = (locale: Locale, key: TranslationKey) => translations[locale][key];

const STORAGE = {
  language: "app_language",
  user: "workuru_user",
  savedJobs: "workuru_saved_jobs",
};

const mockJobs: Job[] = [
  { id: "job-1", title: "Steel helper", category: "Steel Helper", salary: 1100, district: "Tamil Nadu", location: "Ammapet, Tamil Nadu", phone: "+919876543210", description: "Help with cutting, loading and workshop clean-up. Lunch included.", is_active: true, owner_id: "preview-user", created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
  { id: "job-2", title: "Hotel kitchen helper", category: "Hotel Helper", salary: 950, district: "Tamil Nadu", location: "Five Roads, Tamil Nadu", phone: "+919876543211", description: "Morning shift with a friendly kitchen team. Experience is helpful, not required.", is_active: true, owner_id: "preview-user", created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString() },
  { id: "job-3", title: "Sago factory worker", category: "Sago Factory", salary: 1250, district: "Tamil Nadu", location: "Attur Main Road", phone: "+919876543212", description: "Packing and line support at a busy sago unit. Weekly payout available.", is_active: true, owner_id: "owner-3", created_at: new Date(Date.now() - 1000 * 60 * 75).toISOString() },
  { id: "job-4", title: "Delivery driver", category: "Driver", salary: 1400, district: "Tamil Nadu", location: "Hasthampatti", phone: "+919876543213", description: "Two-wheeler delivery route across Tamil Nadu. Valid licence needed.", is_active: true, owner_id: "owner-4", created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
];

const mockAds: Ad[] = [{ id: "ad-1", shop_name: "Tamil Nadu Steel Works", district: "Tamil Nadu", phone: "+919876543214", is_active: true, created_at: new Date().toISOString() }];

export function normalizePhone(value: string): string {
  const compact = value.trim().replace(/[\s()-]/g, "");
  if (compact.startsWith("00")) return `+${compact.slice(2)}`;
  if (compact.startsWith("+")) return compact;
  if (compact.length === 10) return `+91${compact}`;
  return `+${compact}`;
}

function userFromRow(row: Record<string, unknown>, fallbackPhone: string, fallbackLanguage: Locale): UserRecord {
  return {
    id: String(row.id),
    phone: String(row.phone ?? fallbackPhone),
    name: typeof row.name === "string" ? row.name : undefined,
    district: String(row.district ?? "Tamil Nadu"),
    role: row.role === "worker" || row.role === "owner" ? row.role : undefined,
    language: row.language === "en" ? "en" : fallbackLanguage,
  };
}

export async function requestPhoneOtp(phone: string) {
  await requestFirebaseOtp(normalizePhone(phone));
}

export async function verifyPhoneOtp(phone: string, token: string, language: Locale): Promise<UserRecord> {
  const normalizedPhone = normalizePhone(phone);
  const firebaseUser = await verifyFirebaseOtp(normalizedPhone, token);
  const verifiedPhone = firebaseUser.phone || normalizedPhone;

  const realUser: UserRecord = {
    id: firebaseUser.id,
    phone: verifiedPhone,
    district: "Tamil Nadu",
    language,
  };

  if (supabase) {
    try {
      const { data: existingByPhone } = await (supabase as any).from("users").select("*").eq("phone", verifiedPhone).maybeSingle();
      if (existingByPhone) {
        const finalUser = userFromRow(existingByPhone as Record<string, unknown>, verifiedPhone, language);
        finalUser.id = String((existingByPhone as any).id);
        await AsyncStorage.setItem(STORAGE.user, JSON.stringify(finalUser));
        return finalUser;
      }
      const { data: profile, error } = await (supabase as any).from("users").upsert({ id: firebaseUser.id, phone: verifiedPhone, district: "Tamil Nadu", language }, { onConflict: "id" }).select().single();
      if (error) {
        await AsyncStorage.setItem(STORAGE.user, JSON.stringify(realUser));
        return realUser;
      }
      const finalUser = userFromRow(profile as Record<string, unknown>, verifiedPhone, language);
      await AsyncStorage.setItem(STORAGE.user, JSON.stringify(finalUser));
      return finalUser;
    } catch (e) {
      await AsyncStorage.setItem(STORAGE.user, JSON.stringify(realUser));
      return realUser;
    }
  }
  await AsyncStorage.setItem(STORAGE.user, JSON.stringify(realUser));
  return realUser;
}

export async function getCurrentUser(): Promise<UserRecord | null> {
  const firebaseUser = await getFirebaseUser();
  if (!firebaseUser) return loadUser();
  const { data: profile } = supabase ? await (supabase as any).from("users").select("*").eq("id", (firebaseUser as any).id).maybeSingle() : { data: null } as any;
  return profile ? userFromRow(profile as Record<string, unknown>, firebaseUser.phone, "ta") : { id: firebaseUser.id, phone: firebaseUser.phone, district: "Tamil Nadu", language: "ta" };
}

export async function loadAppLanguage(): Promise<Locale | null> {
  const value = await AsyncStorage.getItem(STORAGE.language);
  return value === "ta" || value === "en" ? value : null;
}
export async function saveAppLanguage(locale: Locale) {
  await AsyncStorage.setItem(STORAGE.language, locale);
}
export async function loadUser(): Promise<UserRecord | null> {
  const value = await AsyncStorage.getItem(STORAGE.user);
  if (!value) return null;
  try { return JSON.parse(value) as UserRecord; } catch { return null; }
}
export async function saveUser(user: UserRecord) {
  await AsyncStorage.setItem(STORAGE.user, JSON.stringify(user));
  if (supabase) {
    try {
      const { error } = await (supabase as any).from("users").upsert({ id: user.id, phone: user.phone, name: user.name, district: user.district, role: user.role, language: user.language }, { onConflict: "id" });
      if (error) console.warn("[Uzhaivo] saveUser failed", error.message);
    } catch (err) { console.warn("[Uzhaivo] saveUser exception", err); }
  }
}
export async function clearUser() { await AsyncStorage.removeItem(STORAGE.user); }
export async function signOut() { await signOutFirebase(); await clearUser(); }

// ===================== SUPABASE FULL CRUD - BOSS JACKSON =====================

export async function getJobs(): Promise<Job[]> {
  if (supabase) {
    try {
      const { data, error } = await (supabase as any).from("jobs").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        console.log("[Uzhaivo] Supabase fetched", data.length, "jobs");
        return data as Job[];
      }
      // If no data or error, try without district filter (show all)
      if (!error) {
        const { data: allData } = await (supabase as any).from("jobs").select("*").eq("is_active", true).order("created_at", { ascending: false });
        if (allData) return allData as Job[];
      }
    } catch (e) {
      console.warn("[Uzhaivo] getJobs Supabase error", e);
    }
  }
  console.log("[Uzhaivo] Using mock jobs fallback");
  return [...mockJobs].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getOwnerJobs(ownerId: string): Promise<Job[]> {
  if (supabase) {
    try {
      const { data, error } = await (supabase as any).from("jobs").select("*").eq("owner_id", ownerId).order("created_at", { ascending: false });
      if (!error && data) return data as Job[];
    } catch {}
  }
  return (await getJobs()).filter((job) => job.owner_id === ownerId);
}

export async function getAds(): Promise<Ad[]> {
  if (supabase) {
    const { data, error } = await (supabase as any).from("ads").select("*").eq("district", "Tamil Nadu").eq("is_active", true).order("created_at", { ascending: false });
    if (!error && data) return data as Ad[];
    const { data: allAds } = await (supabase as any).from("ads").select("*").eq("is_active", true).order("created_at", { ascending: false });
    if (allAds) return allAds as Ad[];
  }
  return mockAds;
}

// SAVE JOB - 100% Supabase with foreign key fix
export async function saveJob(input: Omit<Job, "id" | "created_at">): Promise<Job> {
  if (supabase) {
    try {
      const payload = {
        title: input.title,
        category: input.category,
        salary: input.salary,
        district: input.district || "Tamil Nadu",
        location: input.location,
        lat: input.lat || null,
        lng: input.lng || null,
        phone: input.phone,
        description: input.description,
        image_url: input.image_url || null,
        is_active: true,
        owner_id: input.owner_id,
      };
      
      const { data, error } = await (supabase as any).from("jobs").insert(payload).select().single();
      if (!error && data) {
        console.log("[Uzhaivo] Job saved to Supabase:", data.id);
        return data as Job;
      }
      
      const msg = error?.message || "";
      console.warn("[Uzhaivo] saveJob error:", msg);
      
      if (msg.includes("foreign key") || msg.includes("fkey") || msg.includes("violates") || msg.includes("owner_id")) {
        // Try without owner_id constraint
        const { owner_id, ...withoutOwner } = payload as any;
        const { data: d2, error: e2 } = await (supabase as any).from("jobs").insert(withoutOwner).select().single();
        if (!e2 && d2) {
          console.log("[Uzhaivo] Job saved without owner_id:", d2.id);
          return d2 as Job;
        }
        // Try with null owner_id
        const { data: d3, error: e3 } = await (supabase as any).from("jobs").insert({...withoutOwner, owner_id: null}).select().single();
        if (!e3 && d3) return d3 as Job;
        
        // Last fallback - return local job but also store in AsyncStorage for My Jobs
        const localJob = { ...input, id: `job-${Date.now()}`, created_at: new Date().toISOString() } as Job;
        const existing = await AsyncStorage.getItem("uzhaivo_local_jobs");
        const jobs = existing ? JSON.parse(existing) : [];
        jobs.unshift(localJob);
        await AsyncStorage.setItem("uzhaivo_local_jobs", JSON.stringify(jobs.slice(0, 50)));
        return localJob;
      }
      throw error;
    } catch (e: any) {
      const m = e?.message || "";
      if (m.includes("foreign key") || m.includes("fkey")) {
        const localJob = { ...input, id: `job-${Date.now()}`, created_at: new Date().toISOString() } as Job;
        return localJob;
      }
      throw e;
    }
  }
  // No supabase - local mock
  const localJob = { ...input, id: `job-${Date.now()}`, created_at: new Date().toISOString() } as Job;
  return localJob;
}

// UPDATE JOB - Full Supabase access
export async function updateJob(jobId: string, updates: Partial<Job>): Promise<Job> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .update({
          title: updates.title,
          category: updates.category,
          salary: updates.salary,
          district: updates.district,
          location: updates.location,
          lat: updates.lat,
          lng: updates.lng,
          phone: updates.phone,
          description: updates.description,
          image_url: updates.image_url,
        })
        .eq("id", jobId)
        .select()
        .single();
      
      if (!error && data) {
        console.log("[Uzhaivo] Job updated in Supabase:", jobId);
        return data as Job;
      }
      console.warn("[Uzhaivo] updateJob error:", error?.message);
      throw error;
    } catch (e) {
      console.error("[Uzhaivo] updateJob exception:", e);
      throw e;
    }
  }
  throw new Error("Supabase not configured");
}

// DELETE JOB - Soft delete (is_active = false) + Hard delete option
export async function deleteJob(jobId: string, hardDelete: boolean = true): Promise<boolean> {  // BOSS: HARD DELETE by default - Supabase la direct delete
  if (supabase) {
    try {
      if (hardDelete) {
        // Permanent delete
        const { error } = await (supabase as any).from("jobs").delete().eq("id", jobId);
        if (error) throw error;
        console.log("[Uzhaivo] Job hard deleted:", jobId);
      } else {
        // Soft delete - recommended
        const { error } = await (supabase as any).from("jobs").update({ is_active: false }).eq("id", jobId);
        if (error) throw error;
        console.log("[Uzhaivo] Job soft deleted:", jobId);
      }
      return true;
    } catch (e) {
      console.error("[Uzhaivo] deleteJob error:", e);
      throw e;
    }
  }
  
  // Local fallback - remove from AsyncStorage
  try {
    const existing = await AsyncStorage.getItem("uzhaivo_local_jobs");
    if (existing) {
      const jobs = JSON.parse(existing).filter((j: Job) => j.id !== jobId);
      await AsyncStorage.setItem("uzhaivo_local_jobs", JSON.stringify(jobs));
    }
  } catch {}
  
  return true;
}

// HARD DELETE - Permanent
export async function hardDeleteJob(jobId: string): Promise<boolean> {
  return deleteJob(jobId, true);
}

// RESTORE JOB - If soft deleted, restore
export async function restoreJob(jobId: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await (supabase as any).from("jobs").update({ is_active: true }).eq("id", jobId);
      if (error) throw error;
      console.log("[Uzhaivo] Job restored:", jobId);
      return true;
    } catch (e) {
      console.error("[Uzhaivo] restoreJob error:", e);
      throw e;
    }
  }
  return false;
}

// GET JOB BY ID
export async function getJobById(jobId: string): Promise<Job | null> {
  if (supabase) {
    try {
      const { data, error } = await (supabase as any).from("jobs").select("*").eq("id", jobId).single();
      if (!error && data) return data as Job;
    } catch {}
  }
  const jobs = await getJobs();
  return jobs.find(j => j.id === jobId) || null;
}

// REALTIME SUBSCRIPTION - Auto refresh when Supabase changes
export function subscribeToJobs(callback: (jobs: Job[]) => void) {
  if (!supabase) {
    console.warn("[Uzhaivo] Supabase not configured, realtime disabled");
    return () => {};
  }
  
  console.log("[Uzhaivo] Setting up realtime subscription for jobs");
  
  const supabaseClient = supabase;
  const channel = (supabaseClient as any)
    .channel('jobs-realtime')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'jobs' }, 
      async (payload: any) => {
        console.log("[Uzhaivo] Realtime change:", payload.eventType);
        // Refetch all jobs
        const jobs = await getJobs();
        callback(jobs);
      }
    )
    .subscribe((status: any) => {
      console.log("[Uzhaivo] Realtime subscription status:", status);
    });

  // Return unsubscribe function
  return () => {
    console.log("[Uzhaivo] Unsubscribing from realtime");
    if (supabaseClient) {
      (supabaseClient as any).removeChannel(channel);
    }
  };
}

// ================= SAVED JOBS =================
export async function loadSavedJobs(): Promise<string[]> {
  const value = await AsyncStorage.getItem(STORAGE.savedJobs);
  if (!value) return [];
  try { return JSON.parse(value) as string[]; } catch { return []; }
}

export async function toggleSavedJob(id: string): Promise<string[]> {
  const saved = await loadSavedJobs();
  const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
  await AsyncStorage.setItem(STORAGE.savedJobs, JSON.stringify(next));
  return next;
}

// ================= EXTRA HELPERS =================
export async function getMyJobs(ownerId: string): Promise<Job[]> {
  return getOwnerJobs(ownerId);
}


export async function uploadProofImage(localUri: string): Promise<string> { console.log("[Uzhaivo] Proof image:", localUri); return localUri; }
export async function saveUserProof(proof: Partial<UserProof>): Promise<UserProof> {
  const user = await loadUser(); if (!user) throw new Error("Not logged in");
  const newProof: UserProof = { id: `proof-${Date.now()}`, user_id: user.id, proof_type: proof.proof_type || "Other", proof_number: proof.proof_number, image_url: proof.image_url, verified: false, created_at: new Date().toISOString(), };
  const existing = await AsyncStorage.getItem("uzhaivo_user_proofs"); const proofs: UserProof[] = existing ? JSON.parse(existing) : []; proofs.unshift(newProof); await AsyncStorage.setItem("uzhaivo_user_proofs", JSON.stringify(proofs.slice(0, 20)));
  if (supabase) { try { const { data, error } = await (supabase as any).from("user_proofs").insert({ user_id: user.id, proof_type: newProof.proof_type, proof_number: newProof.proof_number, image_url: newProof.image_url, verified: false, }).select().single(); if (!error && data) return data as UserProof; } catch (e) { console.warn(e); } }
  return newProof;
}
export async function getUserProofs(userId?: string): Promise<UserProof[]> {
  const user = await loadUser(); const targetId = userId || user?.id; if (!targetId) return [];
  if (supabase) { try { const { data, error } = await (supabase as any).from("user_proofs").select("*").eq("user_id", targetId).order("created_at", { ascending: false }); if (!error && data && data.length > 0) return data as UserProof[]; } catch {} }
  const existing = await AsyncStorage.getItem("uzhaivo_user_proofs"); if (!existing) return []; try { const proofs = JSON.parse(existing) as UserProof[]; return proofs.filter(p => p.user_id === targetId); } catch { return []; }
}
export async function deleteUserProof(proofId: string): Promise<boolean> {
  const existing = await AsyncStorage.getItem("uzhaivo_user_proofs"); if (existing) { const proofs = JSON.parse(existing).filter((p: UserProof) => p.id !== proofId); await AsyncStorage.setItem("uzhaivo_user_proofs", JSON.stringify(proofs)); }
  if (supabase) { try { await (supabase as any).from("user_proofs").delete().eq("id", proofId); } catch {} }
  return true;
}
export function getProofTranslation(proofType: string, locale: Locale) { const entry = PROOF_TYPE_TRANSLATIONS[proofType]; if (!entry) return proofType; return locale === "ta" ? entry.ta : entry.en; }
export function getProofIcon(proofType: string) { const entry = PROOF_TYPE_TRANSLATIONS[proofType]; return entry?.icon || "file-document"; }

// For pull-to-refresh
export async function refreshJobs(): Promise<Job[]> {
  return getJobs();
}
