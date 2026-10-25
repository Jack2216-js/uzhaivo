import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CATEGORIES,
  DISTRICTS,
  type Ad,
  type Job,
  type Locale,
  type Role,
  type TranslationKey,
  type UserRecord,
  getAds,
  getCurrentUser,
  getJobs,
  getOwnerJobs,
  loadAppLanguage,
  loadSavedJobs,
  saveAppLanguage,
  saveJob,
  saveUser,
  requestPhoneOtp,
  signOut,
  translate,
  toggleSavedJob,
  verifyPhoneOtp,
} from "@/lib/workuru-data";

const ORANGE = "#FF6B00";
const ORANGE_LIGHT = "#FFF1E7";
const INK = "#241A15";
const MUTED = "#8A7D74";
const SAND = "#FBF8F5";
const GREEN = "#00A85A";

type Screen = "language" | "splash" | "login" | "role" | "worker" | "calls" | "owner" | "post" | "profile";
type Filter = "all" | "under" | "above" | "near";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

function haptic() {
  void Haptics.selectionAsync();
}

function BrandMark({ large = false }: { large?: boolean }) {
  return (
    <View style={[styles.brandRow, large && styles.brandRowLarge]}>
      <Image source={require("../assets/images/icon.png")} style={[styles.brandIcon, large && styles.brandIconLarge]} />
      <View>
        <Text style={[styles.brandName, large && styles.brandNameLarge]}>WorkUru</Text>
        <Text style={[styles.brandCaption, large && styles.brandCaptionLarge]}>வேலை • வேலைக்காரர்கள்</Text>
      </View>
    </View>
  );
}

function LanguageToggle({ locale, onPress }: { locale: Locale; onPress: () => void }) {
  return (
    <Pressable onPress={() => { haptic(); onPress(); }} style={({ pressed }) => [styles.langToggle, pressed && styles.pressed]}>
      <Text style={styles.langToggleText}>{locale === "en" ? "அ" : "A"}</Text>
      <Text style={styles.langToggleLabel}>{locale === "en" ? "தமிழ்" : "EN"}</Text>
    </Pressable>
  );
}

function TopBar({ locale, onLanguage, onProfile }: { locale: Locale; onLanguage: () => void; onProfile?: () => void }) {
  return (
    <View style={styles.topBar}>
      <BrandMark />
      <View style={styles.topActions}>
        {onProfile ? <Pressable onPress={onProfile} style={styles.avatar}><Text style={styles.avatarText}>V</Text></Pressable> : null}
        <LanguageToggle locale={locale} onPress={onLanguage} />
      </View>
    </View>
  );
}

function GlassCard({ children, style, onPress }: { children: React.ReactNode; style?: object; onPress?: () => void }) {
  const card = <View style={[styles.card, style]}>{children}</View>;
  if (!onPress) return card;
  return <Pressable onPress={() => { haptic(); onPress(); }} style={({ pressed }) => [pressed && styles.cardPressed]}>{card}</Pressable>;
}

function PrimaryButton({ label, onPress, icon, disabled = false }: { label: string; onPress: () => void; icon?: IconName; disabled?: boolean }) {
  return (
    <Pressable disabled={disabled} onPress={() => { haptic(); onPress(); }} style={({ pressed }) => [styles.primaryButton, disabled && styles.buttonDisabled, pressed && styles.buttonPressed]}>
      {icon ? <MaterialCommunityIcons name={icon} size={20} color="#fff" /> : null}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function BottomNav({ role, active, onNavigate, locale }: { role: Role; active: "jobs" | "calls" | "profile" | "owner" | "post"; onNavigate: (screen: Screen) => void; locale: Locale }) {
  const items = role === "worker"
    ? [{ id: "jobs" as const, label: translate(locale, "jobs"), icon: "briefcase-outline" as IconName, screen: "worker" as Screen }, { id: "calls" as const, label: translate(locale, "calls"), icon: "phone-outline" as IconName, screen: "calls" as Screen }, { id: "profile" as const, label: translate(locale, "profile"), icon: "account-outline" as IconName, screen: "profile" as Screen }]
    : [{ id: "owner" as const, label: translate(locale, "myJobs"), icon: "clipboard-text-outline" as IconName, screen: "owner" as Screen }, { id: "post" as const, label: translate(locale, "post"), icon: "plus-circle-outline" as IconName, screen: "post" as Screen }, { id: "profile" as const, label: translate(locale, "profile"), icon: "account-outline" as IconName, screen: "profile" as Screen }];
  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const selected = active === item.id;
        return <Pressable key={item.id} onPress={() => { haptic(); onNavigate(item.screen); }} style={styles.navItem}>
          <View style={[styles.navIconWrap, selected && styles.navIconWrapActive]}><MaterialCommunityIcons name={item.icon} size={21} color={selected ? ORANGE : MUTED} /></View>
          <Text style={[styles.navLabel, selected && styles.navLabelActive]}>{item.label}</Text>
        </Pressable>;
      })}
    </View>
  );
}

function ScreenFrame({ children, bottom = true }: { children: React.ReactNode; bottom?: boolean }) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.screen, { paddingBottom: bottom ? Math.max(insets.bottom, 76) : Math.max(insets.bottom, 18) }]}>{children}</View>;
}

function LanguageScreen({ locale, onSelect, onContinue }: { locale: Locale; onSelect: (locale: Locale) => void; onContinue: () => void }) {
  return <View style={styles.languageScreen}>
    <View style={styles.languageGlow} />
    <View style={styles.languageTop}><BrandMark large /></View>
    <View style={styles.languageCopy}>
      <Text style={styles.kicker}>SALEM • TAMIL NADU</Text>
      <Text style={styles.languageTitle}>Choose your language</Text>
      <Text style={styles.languageTamilTitle}>உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்</Text>
      <Text style={styles.languageSub}>Start with the language that feels like home.</Text>
    </View>
    <View style={styles.languageCards}>
      <GlassCard onPress={() => onSelect("ta")} style={[styles.languageCard, locale === "ta" && styles.languageCardSelected]}>
        <View style={styles.languageCircle}><Text style={styles.languageCircleText}>அ</Text></View>
        <View style={styles.languageCardText}><Text style={styles.languageCardTitle}>தமிழ்</Text><Text style={styles.languageCardSub}>தமிழில் தொடரவும்</Text></View>
        {locale === "ta" ? <MaterialCommunityIcons name="check-circle" size={25} color={ORANGE} /> : <View style={styles.radioEmpty} />}
      </GlassCard>
      <GlassCard onPress={() => onSelect("en")} style={[styles.languageCard, locale === "en" && styles.languageCardSelected]}>
        <View style={styles.languageCircle}><Text style={styles.languageCircleText}>A</Text></View>
        <View style={styles.languageCardText}><Text style={styles.languageCardTitle}>English</Text><Text style={styles.languageCardSub}>Continue in English</Text></View>
        {locale === "en" ? <MaterialCommunityIcons name="check-circle" size={25} color={ORANGE} /> : <View style={styles.radioEmpty} />}
      </GlassCard>
    </View>
    <View style={styles.languageFooter}>
      <PrimaryButton label="Thodarvum / Continue" onPress={onContinue} icon="arrow-right" />
      <Text style={styles.languageFooterNote}>You can change this anytime in Profile</Text>
    </View>
  </View>;
}

function SplashScreen({ locale }: { locale: Locale }) {
  return <View style={styles.splashScreen}>
    <View style={styles.splashOrbOne} /><View style={styles.splashOrbTwo} />
    <BrandMark large />
    <Text style={styles.splashTitle}>{translate(locale, "taglineShort")}</Text>
    <Text style={styles.splashSub}>{translate(locale, "splashLine")}</Text>
    <View style={styles.splashLoader}><View style={styles.splashLoaderDot} /><View style={styles.splashLoaderDot} /><View style={styles.splashLoaderDot} /></View>
  </View>;
}

function LoginScreen({ locale, phone, setPhone, otp, setOtp, otpSent, onSendOtp, onVerify, error }: { locale: Locale; phone: string; setPhone: (v: string) => void; otp: string; setOtp: (v: string) => void; otpSent: boolean; onSendOtp: () => void; onVerify: () => void; error?: string }) {
  return <ScreenFrame bottom={false}>
    <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
      <TopBar locale={locale} onLanguage={() => {}} />
      <View style={styles.authHero}><View style={styles.authIcon}><MaterialCommunityIcons name="shield-check-outline" color={ORANGE} size={34} /></View><Text style={styles.authTitle}>{translate(locale, "phoneLogin")}</Text><Text style={styles.authSub}>{translate(locale, "phoneLoginTamil")}</Text></View>
      <GlassCard style={styles.authCard}>
        <Text style={styles.inputLabel}>{translate(locale, "phoneNumber")}</Text>
        <View style={styles.inputWrap}><MaterialCommunityIcons name="phone-outline" size={20} color={MUTED} /><TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder={translate(locale, "phoneHint")} placeholderTextColor="#B7AAA1" style={styles.input} /></View>
        {otpSent ? <><Text style={[styles.inputLabel, styles.otpLabel]}>{translate(locale, "enterOtp")}</Text><View style={styles.inputWrap}><MaterialCommunityIcons name="lock-outline" size={20} color={MUTED} /><TextInput value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholder="••••••" placeholderTextColor="#B7AAA1" style={styles.input} /></View></> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {otpSent ? <><PrimaryButton label={translate(locale, "verify")} onPress={onVerify} icon="arrow-right" /><Pressable onPress={onSendOtp} style={styles.textButton}><Text style={styles.textButtonText}>{translate(locale, "resendOtp")}</Text></Pressable></> : <PrimaryButton label={translate(locale, "sendOtp")} onPress={onSendOtp} icon="message-text-outline" />}
        <View style={styles.previewHint}><MaterialCommunityIcons name="information-outline" size={16} color={ORANGE} /><Text style={styles.previewHintText}>{translate(locale, "demoHint")}</Text></View>
      </GlassCard>
      <View style={styles.authTrust}><MaterialCommunityIcons name="lock-check-outline" size={18} color={GREEN} /><Text style={styles.authTrustText}>Your phone number stays private</Text></View>
    </ScrollView>
  </ScreenFrame>;
}

function RoleScreen({ locale, onSelect }: { locale: Locale; onSelect: (role: Role) => void }) {
  return <ScreenFrame bottom={false}><ScrollView contentContainerStyle={styles.roleScroll}>
    <TopBar locale={locale} onLanguage={() => {}} />
    <View style={styles.roleHero}><Text style={styles.kicker}>WORKURU • SALEM</Text><Text style={styles.authTitle}>{translate(locale, "selectRole")}</Text><Text style={styles.authSub}>{translate(locale, "selectRoleTamil")}</Text></View>
    <GlassCard onPress={() => onSelect("worker")} style={styles.roleCard}><View style={[styles.roleIcon, { backgroundColor: "#FFF0E6" }]}><MaterialCommunityIcons name="account-search-outline" size={30} color={ORANGE} /></View><View style={styles.roleCopy}><Text style={styles.roleTitle}>{translate(locale, "worker")}</Text><Text style={styles.roleTamil}>{translate(locale, "workerTamil")}</Text><Text style={styles.roleSub}>{translate(locale, "workerSub")}</Text></View><MaterialCommunityIcons name="arrow-top-right" size={23} color={ORANGE} /></GlassCard>
    <GlassCard onPress={() => onSelect("owner")} style={styles.roleCard}><View style={[styles.roleIcon, { backgroundColor: "#E9F8F0" }]}><MaterialCommunityIcons name="storefront-outline" size={30} color={GREEN} /></View><View style={styles.roleCopy}><Text style={styles.roleTitle}>{translate(locale, "owner")}</Text><Text style={styles.roleTamil}>{translate(locale, "ownerTamil")}</Text><Text style={styles.roleSub}>{translate(locale, "ownerSub")}</Text></View><MaterialCommunityIcons name="arrow-top-right" size={23} color={GREEN} /></GlassCard>
    <View style={styles.roleTip}><MaterialCommunityIcons name="hand-heart-outline" size={20} color={ORANGE} /><Text style={styles.roleTipText}>{translate(locale, "fastSimpleLocal")}</Text></View>
  </ScrollView></ScreenFrame>;
}

function AdBanner({ locale, ad }: { locale: Locale; ad?: Ad }) {
  return <GlassCard style={styles.adBanner}><View style={styles.adBlob} /><View style={styles.adCopy}><View style={styles.adEyebrow}><View style={styles.liveDot} /><Text style={styles.adEyebrowText}>{translate(locale, "adLabel")}</Text></View><Text style={styles.adTitle}>{ad ? translate(locale, "adTitle") : translate(locale, "adTitle")}</Text><Text style={styles.adSub}>{translate(locale, "adSub")}</Text><Pressable style={styles.adLink}><Text style={styles.adLinkText}>{translate(locale, "viewOffer")}</Text><MaterialCommunityIcons name="arrow-right" size={16} color={ORANGE} /></Pressable></View><MaterialCommunityIcons name="silverware-fork-knife" size={50} color="#FFB071" style={styles.adIcon} /></GlassCard>;
}

function JobCard({ locale, job, saved, onCall, onSave }: { locale: Locale; job: Job; saved: boolean; onCall: (job: Job) => void; onSave: (job: Job) => void }) {
  return <GlassCard style={styles.jobCard}>
    <View style={styles.jobTop}><View style={styles.jobBadge}><Text style={styles.jobBadgeText}>{job.category}</Text></View><Pressable onPress={() => onSave(job)} style={styles.saveButton}><MaterialCommunityIcons name={saved ? "bookmark" : "bookmark-outline"} size={21} color={saved ? ORANGE : MUTED} /></Pressable></View>
    <Text style={styles.jobTitle}>{job.title}</Text>
    <View style={styles.jobMetaRow}><View style={styles.jobMeta}><MaterialCommunityIcons name="map-marker-outline" size={16} color={MUTED} /><Text style={styles.jobMetaText}>{job.location}</Text></View><View style={styles.jobMeta}><MaterialCommunityIcons name="clock-outline" size={16} color={MUTED} /><Text style={styles.jobMetaText}>{translate(locale, "createdJustNow")}</Text></View></View>
    <View style={styles.jobBottom}><View><Text style={styles.salaryValue}>₹{job.salary.toLocaleString("en-IN")} <Text style={styles.salaryUnit}>{translate(locale, "perDay")}</Text></Text><Text style={styles.districtText}>{job.district} district</Text></View><Pressable onPress={() => onCall(job)} style={({ pressed }) => [styles.callButton, pressed && styles.buttonPressed]}><MaterialCommunityIcons name="phone" size={17} color="#fff" /><Text style={styles.callButtonText}>{translate(locale, "call")}</Text></Pressable></View>
  </GlassCard>;
}

function WorkerHome({ locale, onLanguage, onProfile, onNavigate, jobs, ad, savedJobs, onCall, onSave }: { locale: Locale; onLanguage: () => void; onProfile: () => void; onNavigate: (screen: Screen) => void; jobs: Job[]; ad?: Ad; savedJobs: string[]; onCall: (job: Job) => void; onSave: (job: Job) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = useMemo(() => jobs.filter((job) => {
    const matches = `${job.title} ${job.category} ${job.location}`.toLowerCase().includes(query.toLowerCase());
    const salary = filter === "under" ? job.salary < 1000 : filter === "above" ? job.salary >= 1000 : true;
    return matches && salary;
  }), [filter, jobs, query]);
  return <ScreenFrame><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}><TopBar locale={locale} onLanguage={onLanguage} onProfile={onProfile} /><View style={styles.welcomeRow}><View><Text style={styles.eyebrowText}>{translate(locale, "jobsInSalem").toUpperCase()}</Text><Text style={styles.pageTitle}>{translate(locale, "welcomeBack")}</Text><Text style={styles.pageSub}>{translate(locale, "findWork")}</Text></View><View style={styles.locationPill}><MaterialCommunityIcons name="map-marker" size={14} color={ORANGE} /><Text style={styles.locationPillText}>Salem</Text></View></View><View style={styles.searchWrap}><MaterialCommunityIcons name="magnify" size={22} color={MUTED} /><TextInput value={query} onChangeText={setQuery} placeholder={translate(locale, "searchJobs")} placeholderTextColor="#A99A90" style={styles.searchInput} /><MaterialCommunityIcons name="tune-variant" size={20} color={ORANGE} /></View><AdBanner locale={locale} ad={ad} /><SectionLabel>{translate(locale, "quickFilters")}</SectionLabel><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>{[["all", "all"], ["under", "under1000"], ["above", "above1000"], ["near", "within5km"]].map(([id, key]) => <Pressable key={id} onPress={() => { haptic(); setFilter(id as Filter); }} style={[styles.filterChip, filter === id && styles.filterChipActive]}><Text style={[styles.filterChipText, filter === id && styles.filterChipTextActive]}>{translate(locale, key as TranslationKey)}</Text></Pressable>)}</ScrollView><View style={styles.listHeader}><SectionLabel>{translate(locale, "latest")}</SectionLabel><Text style={styles.resultCount}>{filtered.length} {translate(locale, "jobs")}</Text></View>{filtered.length ? filtered.map((job) => <JobCard key={job.id} locale={locale} job={job} saved={savedJobs.includes(job.id)} onCall={onCall} onSave={onSave} />) : <GlassCard style={styles.emptyCard}><MaterialCommunityIcons name="magnify-close" size={34} color={ORANGE} /><Text style={styles.emptyTitle}>{translate(locale, "noJobs")}</Text><Text style={styles.emptySub}>{translate(locale, "tryAnother")}</Text></GlassCard>}</ScrollView><BottomNav role="worker" active="jobs" onNavigate={onNavigate} locale={locale} /></ScreenFrame>;
}

function CallsScreen({ locale, calls, onNavigate }: { locale: Locale; calls: Job[]; onNavigate: (screen: Screen) => void }) {
  return <ScreenFrame><ScrollView contentContainerStyle={styles.scrollContent}><TopBar locale={locale} onLanguage={() => {}} /><Text style={styles.pageTitle}>{translate(locale, "callHistory")}</Text><Text style={styles.pageSub}>{translate(locale, "calls")} · Salem</Text>{calls.length ? <View style={styles.callsList}>{calls.map((job) => <GlassCard key={job.id} style={styles.callHistoryCard}><View style={styles.callHistoryIcon}><MaterialCommunityIcons name="phone-check-outline" size={21} color={GREEN} /></View><View style={styles.callHistoryCopy}><Text style={styles.callHistoryTitle}>{job.title}</Text><Text style={styles.callHistorySub}>{job.location} · {job.phone}</Text></View><Text style={styles.callHistoryTime}>{translate(locale, "today")}</Text></GlassCard>)}</View> : <GlassCard style={styles.emptyCard}><MaterialCommunityIcons name="phone-off-outline" size={34} color={ORANGE} /><Text style={styles.emptyTitle}>{translate(locale, "noCalls")}</Text></GlassCard>}</ScrollView><BottomNav role="worker" active="calls" onNavigate={onNavigate} locale={locale} /></ScreenFrame>;
}

function OwnerHome({ locale, onLanguage, onProfile, onNavigate, jobs, onToggle }: { locale: Locale; onLanguage: () => void; onProfile: () => void; onNavigate: (screen: Screen) => void; jobs: Job[]; onToggle: (id: string) => void }) {
  return <ScreenFrame><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}><TopBar locale={locale} onLanguage={onLanguage} onProfile={onProfile} /><Text style={styles.eyebrowText}>{translate(locale, "ownerDashboard").toUpperCase()}</Text><Text style={styles.pageTitle}>{translate(locale, "welcomeBack")}</Text><Text style={styles.pageSub}>{translate(locale, "ownerGreeting")}</Text><View style={styles.statsRow}><GlassCard style={[styles.statCard, { backgroundColor: "#FFF1E7" }]}><Text style={styles.statValue}>{jobs.length}</Text><Text style={styles.statLabel}>{translate(locale, "totalJobs")}</Text><MaterialCommunityIcons name="briefcase-outline" size={22} color={ORANGE} style={styles.statIcon} /></GlassCard><GlassCard style={[styles.statCard, { backgroundColor: "#EAF8F0" }]}><Text style={[styles.statValue, { color: GREEN }]}>12</Text><Text style={styles.statLabel}>{translate(locale, "totalCalls")}</Text><MaterialCommunityIcons name="phone-outline" size={22} color={GREEN} style={styles.statIcon} /></GlassCard></View><Pressable onPress={() => { haptic(); onNavigate("post"); }} style={styles.postCta}><View style={styles.postCtaIcon}><MaterialCommunityIcons name="plus" size={23} color={ORANGE} /></View><View style={styles.postCtaCopy}><Text style={styles.postCtaTitle}>{translate(locale, "postNewJob")}</Text><Text style={styles.postCtaSub}>{translate(locale, "postNewJobSub")}</Text></View><MaterialCommunityIcons name="arrow-right" size={22} color="#fff" /></Pressable><View style={styles.listHeader}><SectionLabel>{translate(locale, "yourListings")}</SectionLabel><Text style={styles.resultCount}>{jobs.length}</Text></View>{jobs.map((job) => <GlassCard key={job.id} style={styles.ownerJobCard}><View style={styles.ownerJobTop}><View style={styles.ownerJobTitleWrap}><Text style={styles.jobTitle}>{job.title}</Text><Text style={styles.jobMetaText}>{job.location} · ₹{job.salary} {translate(locale, "perDay")}</Text></View><Pressable onPress={() => onToggle(job.id)} style={[styles.switch, job.is_active && styles.switchOn]}><View style={[styles.switchKnob, job.is_active && styles.switchKnobOn]} /></Pressable></View><View style={styles.ownerJobBottom}><View style={[styles.statusDot, { backgroundColor: job.is_active ? GREEN : "#B6AAA2" }]} /><Text style={styles.statusText}>{job.is_active ? translate(locale, "active") : translate(locale, "paused")}</Text><Text style={styles.ownerJobDate}>{translate(locale, "today")}</Text></View></GlassCard>)}</ScrollView><BottomNav role="owner" active="owner" onNavigate={onNavigate} locale={locale} /></ScreenFrame>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <View style={styles.field}><Text style={styles.inputLabel}>{label}</Text>{children}</View>; }

function PostJobScreen({ locale, ownerId, onLanguage, onBack, onSubmit }: { locale: Locale; ownerId: string; onLanguage: () => void; onBack: () => void; onSubmit: (job: Omit<Job, "id" | "created_at">) => Promise<void> }) {
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [description, setDescription] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submit = async () => {
    const numericSalary = Number(salary);
    const phoneDigits = phone.replace(/\D/g, "");
    if (!salary || !location.trim() || phoneDigits.length < 10 || !Number.isFinite(numericSalary) || numericSalary <= 0) { setStatus(translate(locale, "requiredField")); return; }
    setSubmitting(true); setStatus("");
    try {
      await onSubmit({ title: category, category, salary: numericSalary, district: "Salem", location: location.trim(), phone, description, is_active: true, owner_id: ownerId });
      setStatus(translate(locale, "jobPosted"));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : translate(locale, "somethingWrong"));
    } finally {
      setSubmitting(false);
    }
  };
  return <ScreenFrame bottom={false}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScroll}><View style={styles.formTop}><Pressable onPress={onBack} style={styles.backButton}><MaterialCommunityIcons name="arrow-left" size={22} color={INK} /></Pressable><View><Text style={styles.formTitle}>{translate(locale, "postNewJob")}</Text><Text style={styles.formSub}>{translate(locale, "postNewJobSub")}</Text></View><LanguageToggle locale={locale} onPress={onLanguage} /></View><Field label={translate(locale, "chooseCategory")}><Pressable onPress={() => setShowCategories(true)} style={styles.selectWrap}><MaterialCommunityIcons name="briefcase-outline" size={20} color={MUTED} /><Text style={styles.selectText}>{category}</Text><MaterialCommunityIcons name="chevron-down" size={20} color={MUTED} /></Pressable></Field><Field label={translate(locale, "salaryPerDay")}><View style={styles.inputWrap}><Text style={styles.rupee}>₹</Text><TextInput value={salary} onChangeText={setSalary} keyboardType="number-pad" placeholder={translate(locale, "salaryHint")} placeholderTextColor="#B7AAA1" style={styles.input} /></View></Field><Field label={translate(locale, "location")}><View style={styles.inputWrap}><MaterialCommunityIcons name="map-marker-outline" size={20} color={MUTED} /><TextInput value={location} onChangeText={setLocation} placeholder={translate(locale, "locationHint")} placeholderTextColor="#B7AAA1" style={styles.input} /><Pressable onPress={() => setStatus(translate(locale, "nativeHint"))}><MaterialCommunityIcons name="crosshairs-gps" size={20} color={ORANGE} /></Pressable></View></Field><Field label={translate(locale, "contactPhone")}><View style={styles.inputWrap}><MaterialCommunityIcons name="phone-outline" size={20} color={MUTED} /><TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} /></View></Field><Field label={translate(locale, "description")}><View style={[styles.textAreaWrap, styles.inputWrap]}><TextInput value={description} onChangeText={setDescription} multiline placeholder={translate(locale, "descriptionHint")} placeholderTextColor="#B7AAA1" style={[styles.input, styles.textArea]} /><Pressable onPress={() => setStatus(translate(locale, "voiceReady"))} style={styles.micButton}><MaterialCommunityIcons name="microphone-outline" size={22} color="#fff" /></Pressable></View></Field><Pressable onPress={() => setStatus(translate(locale, "nativeHint"))} style={styles.photoRow}><View style={styles.photoIcon}><MaterialCommunityIcons name="image-plus" size={23} color={ORANGE} /></View><View style={styles.photoCopy}><Text style={styles.photoTitle}>{translate(locale, "addPhoto")}</Text><Text style={styles.photoSub}>{translate(locale, "addPhotoSub")}</Text></View><MaterialCommunityIcons name="chevron-right" size={21} color={MUTED} /></Pressable>{status ? <View style={[styles.formStatus, status === translate(locale, "jobPosted") && styles.formStatusSuccess]}><MaterialCommunityIcons name={status === translate(locale, "jobPosted") ? "check-circle" : "information-outline"} size={18} color={status === translate(locale, "jobPosted") ? GREEN : ORANGE} /><Text style={styles.formStatusText}>{status}</Text></View> : null}<PrimaryButton label={submitting ? translate(locale, "loading") : translate(locale, "submitJob")} onPress={() => void submit()} icon="send-outline" disabled={submitting} /></ScrollView></KeyboardAvoidingView><Modal visible={showCategories} transparent animationType="slide" onRequestClose={() => setShowCategories(false)}><View style={styles.modalBackdrop}><View style={styles.modalCard}><View style={styles.modalHeader}><Text style={styles.modalTitle}>{translate(locale, "chooseCategory")}</Text><Pressable onPress={() => setShowCategories(false)}><MaterialCommunityIcons name="close" size={23} color={INK} /></Pressable></View>{CATEGORIES.map((item) => <Pressable key={item} onPress={() => { setCategory(item); setShowCategories(false); }} style={[styles.modalOption, category === item && styles.modalOptionActive]}><Text style={[styles.modalOptionText, category === item && styles.modalOptionTextActive]}>{item}</Text>{category === item ? <MaterialCommunityIcons name="check" size={20} color={ORANGE} /> : null}</Pressable>)}</View></View></Modal></ScreenFrame>;
}

function ProfileScreen({ locale, user, onLanguage, onDistrict, onLogout }: { locale: Locale; user: UserRecord; onLanguage: () => void; onDistrict: (district: string) => void; onLogout: () => void }) {
  const [districtOpen, setDistrictOpen] = useState(false);
  return <ScreenFrame bottom={false}><ScrollView contentContainerStyle={styles.profileScroll}><TopBar locale={locale} onLanguage={onLanguage} /><View style={styles.profileHero}><View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{user.role === "owner" ? "O" : "W"}</Text></View><Text style={styles.profileName}>{user.role === "owner" ? translate(locale, "owner") : translate(locale, "worker")}</Text><Text style={styles.profilePhone}>{user.phone}</Text><View style={styles.rolePill}><MaterialCommunityIcons name={user.role === "owner" ? "storefront-outline" : "account-search-outline"} size={15} color={ORANGE} /><Text style={styles.rolePillText}>{user.role === "owner" ? translate(locale, "ownerTamil") : translate(locale, "workerTamil")}</Text></View></View><SectionLabel>{translate(locale, "profileTitle")}</SectionLabel><GlassCard style={styles.profileCard}><View style={styles.profileRow}><View style={styles.profileRowIcon}><MaterialCommunityIcons name="map-marker-outline" size={20} color={ORANGE} /></View><View style={styles.profileRowCopy}><Text style={styles.profileRowLabel}>{translate(locale, "district")}</Text><Text style={styles.profileRowValue}>{user.district}</Text></View><Pressable onPress={() => setDistrictOpen(true)}><Text style={styles.editLink}>{translate(locale, "editProfile")}</Text></Pressable></View><View style={styles.profileDivider} /><View style={styles.profileRow}><View style={styles.profileRowIcon}><MaterialCommunityIcons name="translate" size={20} color={ORANGE} /></View><View style={styles.profileRowCopy}><Text style={styles.profileRowLabel}>{translate(locale, "language")}</Text><Text style={styles.profileRowValue}>{locale === "ta" ? "தமிழ்" : "English"}</Text></View><LanguageToggle locale={locale} onPress={onLanguage} /></View><View style={styles.profileDivider} /><View style={styles.profileRow}><View style={styles.profileRowIcon}><MaterialCommunityIcons name="phone-outline" size={20} color={ORANGE} /></View><View style={styles.profileRowCopy}><Text style={styles.profileRowLabel}>{translate(locale, "phone")}</Text><Text style={styles.profileRowValue}>{user.phone}</Text></View></View></GlassCard><View style={styles.profileFooter}><Text style={styles.appVersion}>{translate(locale, "appVersion")}</Text><Pressable onPress={onLogout} style={styles.logoutButton}><MaterialCommunityIcons name="logout" size={19} color="#D54B3F" /><Text style={styles.logoutText}>{translate(locale, "logout")}</Text></Pressable><Text style={styles.logoutSub}>{translate(locale, "logoutSub")}</Text></View></ScrollView><Modal visible={districtOpen} transparent animationType="slide" onRequestClose={() => setDistrictOpen(false)}><View style={styles.modalBackdrop}><View style={[styles.modalCard, styles.districtModal]}><View style={styles.modalHeader}><Text style={styles.modalTitle}>{translate(locale, "chooseDistrict")}</Text><Pressable onPress={() => setDistrictOpen(false)}><MaterialCommunityIcons name="close" size={23} color={INK} /></Pressable></View><ScrollView>{DISTRICTS.map((district) => <Pressable key={district} onPress={() => { onDistrict(district); setDistrictOpen(false); }} style={[styles.modalOption, user.district === district && styles.modalOptionActive]}><Text style={[styles.modalOptionText, user.district === district && styles.modalOptionTextActive]}>{district}</Text>{user.district === district ? <MaterialCommunityIcons name="check" size={20} color={ORANGE} /> : null}</Pressable>)}</ScrollView></View></View></Modal></ScreenFrame>;
}

export function WorkUruApp() {
  const [locale, setLocale] = useState<Locale>("ta");
  const [screen, setScreen] = useState<Screen>("splash");
  const [user, setUser] = useState<UserRecord>({ id: "preview-user", phone: "+91 98765 43210", district: "Salem", language: "ta" });
  const [phone, setPhone] = useState("+91 98765 43210");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [ownerJobs, setOwnerJobs] = useState<Job[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [calls, setCalls] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [booting, setBooting] = useState(true);

  const routeAfterSplash = useCallback(async () => {
    const storedUser = await getCurrentUser();
    if (storedUser) { setUser(storedUser); setLocale(storedUser.language); setScreen(storedUser.role ? (storedUser.role === "worker" ? "worker" : "owner") : "role"); }
    else setScreen("login");
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const storedLocale = await loadAppLanguage();
      if (!mounted) return;
      if (!storedLocale) setScreen("language");
      else { setLocale(storedLocale); setScreen("splash"); setTimeout(() => { if (mounted) void routeAfterSplash(); }, 1100); }
      const [loadedJobs, loadedAds, storedSaved, loadedOwnerJobs] = await Promise.all([getJobs(), getAds(), loadSavedJobs(), getOwnerJobs("preview-user")]);
      if (mounted) { setJobs(loadedJobs); setOwnerJobs(loadedOwnerJobs); setAds(loadedAds); setSavedJobs(storedSaved); setBooting(false); }
    })();
    return () => { mounted = false; };
  }, [routeAfterSplash]);

  const chooseLocale = async (next: Locale) => { setLocale(next); await saveAppLanguage(next); };
  const continueLanguage = async () => { await saveAppLanguage(locale); setScreen("splash"); setTimeout(() => void routeAfterSplash(), 800); };
  const onSendOtp = async () => { if (phone.replace(/\D/g, "").length < 10) { setLoginError(translate(locale, "invalidPhone")); return; } try { await requestPhoneOtp(phone); setLoginError(""); setOtpSent(true); } catch (error) { setLoginError(error instanceof Error ? error.message : translate(locale, "somethingWrong")); } };
  const onVerify = async () => { if (otp.length !== 6) { setLoginError(translate(locale, "invalidOtp")); return; } try { const nextUser = await verifyPhoneOtp(phone, otp, locale); setUser(nextUser); await saveUser(nextUser); setLoginError(""); setScreen(nextUser.role ? (nextUser.role === "worker" ? "worker" : "owner") : "role"); } catch (error) { setLoginError(error instanceof Error ? error.message : translate(locale, "somethingWrong")); } };
  const onRole = async (role: Role) => { const nextLocale: Locale = role === "worker" ? "ta" : "en"; const nextUser = { ...user, role, language: nextLocale }; setLocale(nextLocale); setUser(nextUser); if (role === "owner") setOwnerJobs(await getOwnerJobs(nextUser.id)); await saveUser(nextUser); await saveAppLanguage(nextLocale); setScreen(role === "worker" ? "worker" : "owner"); };
  const onCall = async (job: Job) => { setCalls((current) => current.some((item) => item.id === job.id) ? current : [job, ...current]); try { await Linking.openURL(`tel:${job.phone}`); } catch { Alert.alert(translate(locale, "call"), job.phone); } };
  const onSave = async (job: Job) => setSavedJobs(await toggleSavedJob(job.id));
  const onToggle = (id: string) => { setJobs((current) => current.map((job) => job.id === id ? { ...job, is_active: !job.is_active } : job)); setOwnerJobs((current) => current.map((job) => job.id === id ? { ...job, is_active: !job.is_active } : job)); };
  const onSubmitJob = async (job: Omit<Job, "id" | "created_at">) => { const saved = await saveJob(job); setJobs((current) => [saved, ...current]); setOwnerJobs((current) => [saved, ...current]); };
  const onProfileLanguage = async () => { await chooseLocale(locale === "en" ? "ta" : "en"); };
  const onDistrict = async (district: string) => { const nextUser = { ...user, district }; setUser(nextUser); await saveUser(nextUser); };
  const onLogout = async () => { await signOut(); setUser({ id: "preview-user", phone: "+91 98765 43210", district: "Salem", language: locale }); setScreen("login"); setOtpSent(false); setOtp(""); };

  if (booting && screen === "splash") return <SplashScreen locale={locale} />;
  if (screen === "language") return <LanguageScreen locale={locale} onSelect={(next) => void chooseLocale(next)} onContinue={() => void continueLanguage()} />;
  if (screen === "splash") return <SplashScreen locale={locale} />;
  if (screen === "login") return <LoginScreen locale={locale} phone={phone} setPhone={setPhone} otp={otp} setOtp={setOtp} otpSent={otpSent} onSendOtp={onSendOtp} onVerify={() => void onVerify()} error={loginError} />;
  if (screen === "role") return <RoleScreen locale={locale} onSelect={(role) => void onRole(role)} />;
  if (screen === "worker") return <WorkerHome locale={locale} onLanguage={onProfileLanguage} onProfile={() => setScreen("profile")} onNavigate={setScreen} jobs={jobs.filter((job) => job.is_active)} ad={ads[0]} savedJobs={savedJobs} onCall={onCall} onSave={onSave} />;
  if (screen === "calls") return <CallsScreen locale={locale} calls={calls} onNavigate={setScreen} />;
  if (screen === "owner") return <OwnerHome locale={locale} onLanguage={onProfileLanguage} onProfile={() => setScreen("profile")} onNavigate={setScreen} jobs={ownerJobs} onToggle={onToggle} />;
  if (screen === "post") return <PostJobScreen locale={locale} ownerId={user.id} onLanguage={onProfileLanguage} onBack={() => setScreen("owner")} onSubmit={onSubmitJob} />;
  return <ProfileScreen locale={locale} user={user} onLanguage={onProfileLanguage} onDistrict={(district) => void onDistrict(district)} onLogout={() => void onLogout()} />;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: SAND },
  scrollContent: { paddingHorizontal: 20, paddingTop: 14, gap: 0 },
  authScroll: { paddingHorizontal: 20, paddingTop: 14, flexGrow: 1 },
  roleScroll: { paddingHorizontal: 20, paddingTop: 14, flexGrow: 1 },
  formScroll: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 28 },
  profileScroll: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 32 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  brandRowLarge: { transform: [{ scale: 1.12 }] },
  brandIcon: { width: 38, height: 38, borderRadius: 12 },
  brandIconLarge: { width: 56, height: 56, borderRadius: 18 },
  brandName: { color: INK, fontSize: 20, fontWeight: "800", letterSpacing: -0.6 },
  brandNameLarge: { fontSize: 31, letterSpacing: -1 },
  brandCaption: { color: MUTED, fontSize: 8, fontWeight: "700", marginTop: -1 },
  brandCaptionLarge: { fontSize: 10, marginTop: 2 },
  topBar: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  topActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 33, height: 33, borderRadius: 12, backgroundColor: "#FFE0CA", alignItems: "center", justifyContent: "center" },
  avatarText: { color: ORANGE, fontWeight: "800", fontSize: 14 },
  langToggle: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 14, backgroundColor: "#FFF1E7", paddingHorizontal: 10, paddingVertical: 7 },
  langToggleText: { color: ORANGE, fontSize: 16, fontWeight: "800" },
  langToggleLabel: { color: ORANGE, fontSize: 10, fontWeight: "800" },
  pressed: { opacity: 0.72 },
  card: { backgroundColor: "rgba(255,255,255,0.92)", borderWidth: 1, borderColor: "rgba(255,255,255,0.96)", borderRadius: 20, shadowColor: "#9D836F", shadowOpacity: 0.12, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  cardPressed: { transform: [{ scale: 0.985 }], opacity: 0.94 },
  primaryButton: { minHeight: 54, borderRadius: 16, backgroundColor: ORANGE, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, shadowColor: ORANGE, shadowOpacity: 0.28, shadowRadius: 12, shadowOffset: { width: 0, height: 7 }, elevation: 5 },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  buttonPressed: { transform: [{ scale: 0.985 }], opacity: 0.9 },
  buttonDisabled: { opacity: 0.65 },
  sectionLabel: { color: INK, fontSize: 15, fontWeight: "800", marginBottom: 10 },
  languageScreen: { flex: 1, backgroundColor: "#FFF9F4", paddingHorizontal: 22, paddingTop: 74, paddingBottom: 32, overflow: "hidden" },
  languageGlow: { position: "absolute", top: -120, right: -100, width: 310, height: 310, borderRadius: 160, backgroundColor: "#FFE0C5", opacity: 0.58 },
  languageTop: { alignItems: "center", marginBottom: 46 },
  languageCopy: { marginBottom: 25 },
  kicker: { color: ORANGE, fontSize: 11, fontWeight: "900", letterSpacing: 1.2, marginBottom: 9 },
  languageTitle: { color: INK, fontSize: 28, fontWeight: "900", letterSpacing: -0.8 },
  languageTamilTitle: { color: ORANGE, fontSize: 17, fontWeight: "800", marginTop: 6 },
  languageSub: { color: MUTED, fontSize: 14, marginTop: 11 },
  languageCards: { gap: 14 },
  languageCard: { minHeight: 92, padding: 16, flexDirection: "row", alignItems: "center", gap: 13 },
  languageCardSelected: { borderColor: ORANGE, borderWidth: 2, shadowColor: ORANGE, shadowOpacity: 0.16 },
  languageCircle: { width: 53, height: 53, borderRadius: 27, backgroundColor: ORANGE_LIGHT, alignItems: "center", justifyContent: "center" },
  languageCircleText: { color: ORANGE, fontSize: 25, fontWeight: "900" },
  languageCardText: { flex: 1 },
  languageCardTitle: { color: INK, fontSize: 17, fontWeight: "900" },
  languageCardSub: { color: MUTED, fontSize: 13, marginTop: 3 },
  radioEmpty: { width: 23, height: 23, borderRadius: 12, borderWidth: 2, borderColor: "#D7C9BF" },
  languageFooter: { marginTop: "auto", gap: 13 },
  languageFooterNote: { color: MUTED, textAlign: "center", fontSize: 12 },
  splashScreen: { flex: 1, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  splashOrbOne: { position: "absolute", width: 300, height: 300, borderRadius: 150, backgroundColor: "#FF963D", opacity: 0.6, top: -110, right: -70 },
  splashOrbTwo: { position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: "#D95100", opacity: 0.38, bottom: -90, left: -70 },
  splashTitle: { color: "#fff", fontSize: 25, fontWeight: "900", marginTop: 35, letterSpacing: -0.7 },
  splashSub: { color: "#FFE5CF", fontSize: 14, marginTop: 8 },
  splashLoader: { flexDirection: "row", gap: 6, marginTop: 56 },
  splashLoaderDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#FFE4C6" },
  authHero: { alignItems: "center", marginTop: 26, marginBottom: 28 },
  authIcon: { width: 68, height: 68, borderRadius: 24, backgroundColor: ORANGE_LIGHT, alignItems: "center", justifyContent: "center", marginBottom: 15 },
  authTitle: { color: INK, fontSize: 27, fontWeight: "900", letterSpacing: -0.8, textAlign: "center" },
  authSub: { color: ORANGE, fontSize: 14, fontWeight: "700", marginTop: 7, textAlign: "center" },
  authCard: { padding: 18 },
  inputLabel: { color: INK, fontSize: 12, fontWeight: "800", marginBottom: 8 },
  otpLabel: { marginTop: 18 },
  inputWrap: { minHeight: 52, borderWidth: 1, borderColor: "#E9DED6", borderRadius: 14, backgroundColor: "#FFFCFA", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 9 },
  input: { flex: 1, color: INK, fontSize: 15, minHeight: 50 },
  errorText: { color: "#D54B3F", fontSize: 12, marginTop: 10 },
  textButton: { alignItems: "center", paddingVertical: 13 },
  textButtonText: { color: ORANGE, fontWeight: "800", fontSize: 13 },
  previewHint: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: ORANGE_LIGHT, padding: 11, borderRadius: 12, marginTop: 5 },
  previewHintText: { color: "#9D5A28", fontSize: 12, flex: 1 },
  authTrust: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 20 },
  authTrustText: { color: MUTED, fontSize: 12 },
  roleHero: { alignItems: "center", marginTop: 25, marginBottom: 28 },
  roleCard: { padding: 17, flexDirection: "row", alignItems: "center", gap: 13, marginBottom: 14 },
  roleIcon: { width: 58, height: 58, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  roleCopy: { flex: 1 },
  roleTitle: { color: INK, fontSize: 16, fontWeight: "900" },
  roleTamil: { color: ORANGE, fontSize: 13, fontWeight: "800", marginTop: 2 },
  roleSub: { color: MUTED, fontSize: 12, lineHeight: 17, marginTop: 5 },
  roleTip: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 22 },
  roleTipText: { color: MUTED, fontSize: 12, fontWeight: "700" },
  welcomeRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 },
  eyebrowText: { color: ORANGE, fontSize: 10, fontWeight: "900", letterSpacing: 1.1, marginBottom: 7 },
  pageTitle: { color: INK, fontSize: 27, fontWeight: "900", letterSpacing: -0.7 },
  pageSub: { color: MUTED, fontSize: 13, lineHeight: 19, marginTop: 5, maxWidth: 286 },
  locationPill: { backgroundColor: "#FFF1E7", flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 12, marginTop: 4 },
  locationPillText: { color: ORANGE, fontWeight: "800", fontSize: 11 },
  searchWrap: { minHeight: 54, borderRadius: 16, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 9, borderWidth: 1, borderColor: "#F1E7E0", marginBottom: 19, shadowColor: "#9D836F", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  searchInput: { flex: 1, color: INK, fontSize: 13 },
  adBanner: { minHeight: 132, padding: 17, overflow: "hidden", backgroundColor: "#FFF0E5", flexDirection: "row", marginBottom: 22 },
  adBlob: { position: "absolute", width: 140, height: 140, borderRadius: 70, backgroundColor: "#FFD1B1", right: -37, top: -28, opacity: 0.7 },
  adCopy: { flex: 1, zIndex: 1 },
  adEyebrow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 7 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ORANGE },
  adEyebrowText: { color: ORANGE, fontSize: 10, fontWeight: "900", letterSpacing: 0.8, textTransform: "uppercase" },
  adTitle: { color: INK, fontSize: 16, fontWeight: "900", maxWidth: 240, lineHeight: 21 },
  adSub: { color: "#94694B", fontSize: 11, marginTop: 4 },
  adLink: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 12 },
  adLinkText: { color: ORANGE, fontWeight: "900", fontSize: 12 },
  adIcon: { alignSelf: "center", marginRight: 6, opacity: 0.9 },
  chipRow: { gap: 8, paddingBottom: 19 },
  filterChip: { borderRadius: 13, borderWidth: 1, borderColor: "#E8DCD3", paddingHorizontal: 13, paddingVertical: 9, backgroundColor: "#fff" },
  filterChipActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  filterChipText: { color: MUTED, fontSize: 12, fontWeight: "800" },
  filterChipTextActive: { color: "#fff" },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  resultCount: { color: MUTED, fontSize: 12, fontWeight: "700", marginBottom: 10 },
  jobCard: { padding: 16, marginBottom: 13 },
  jobTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  jobBadge: { backgroundColor: ORANGE_LIGHT, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  jobBadgeText: { color: ORANGE, fontSize: 10, fontWeight: "900" },
  saveButton: { padding: 4 },
  jobTitle: { color: INK, fontSize: 17, fontWeight: "900", marginTop: 11 },
  jobMetaRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
  jobMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  jobMetaText: { color: MUTED, fontSize: 11 },
  jobBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16, paddingTop: 13, borderTopWidth: 1, borderTopColor: "#F1E7E0" },
  salaryValue: { color: ORANGE, fontSize: 18, fontWeight: "900" },
  salaryUnit: { color: MUTED, fontSize: 11, fontWeight: "700" },
  districtText: { color: MUTED, fontSize: 10, marginTop: 3 },
  callButton: { backgroundColor: GREEN, borderRadius: 12, minHeight: 38, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 6, shadowColor: GREEN, shadowOpacity: 0.24, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  callButtonText: { color: "#fff", fontSize: 12, fontWeight: "900" },
  emptyCard: { padding: 28, alignItems: "center", marginTop: 8 },
  emptyTitle: { color: INK, fontSize: 16, fontWeight: "900", textAlign: "center", marginTop: 11 },
  emptySub: { color: MUTED, fontSize: 12, textAlign: "center", marginTop: 5 },
  bottomNav: { position: "absolute", left: 14, right: 14, bottom: 12, height: 67, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.97)", flexDirection: "row", justifyContent: "space-around", alignItems: "center", shadowColor: "#604631", shadowOpacity: 0.14, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 7, borderWidth: 1, borderColor: "#F3E8E0" },
  navItem: { alignItems: "center", justifyContent: "center", gap: 3, minWidth: 72 },
  navIconWrap: { width: 31, height: 27, alignItems: "center", justifyContent: "center", borderRadius: 10 },
  navIconWrapActive: { backgroundColor: ORANGE_LIGHT },
  navLabel: { color: MUTED, fontSize: 10, fontWeight: "700" },
  navLabelActive: { color: ORANGE, fontWeight: "900" },
  statsRow: { flexDirection: "row", gap: 11, marginTop: 24, marginBottom: 16 },
  statCard: { flex: 1, padding: 15, minHeight: 108, overflow: "hidden" },
  statValue: { color: ORANGE, fontSize: 31, fontWeight: "900" },
  statLabel: { color: MUTED, fontSize: 11, fontWeight: "700", marginTop: 3, maxWidth: 80 },
  statIcon: { position: "absolute", right: 12, bottom: 12 },
  postCta: { minHeight: 80, borderRadius: 19, backgroundColor: ORANGE, padding: 14, flexDirection: "row", alignItems: "center", gap: 11, shadowColor: ORANGE, shadowOpacity: 0.27, shadowRadius: 12, shadowOffset: { width: 0, height: 7 }, elevation: 4, marginBottom: 25 },
  postCtaIcon: { width: 45, height: 45, borderRadius: 15, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  postCtaCopy: { flex: 1 },
  postCtaTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },
  postCtaSub: { color: "#FFE7D3", fontSize: 11, marginTop: 3 },
  ownerJobCard: { padding: 16, marginBottom: 12 },
  ownerJobTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  ownerJobTitleWrap: { flex: 1 },
  ownerJobBottom: { flexDirection: "row", alignItems: "center", marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#F1E7E0" },
  statusDot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  statusText: { color: MUTED, fontSize: 11, fontWeight: "800" },
  ownerJobDate: { color: MUTED, fontSize: 11, marginLeft: "auto" },
  switch: { width: 39, height: 23, borderRadius: 13, backgroundColor: "#D9D0CA", padding: 3 },
  switchOn: { backgroundColor: "#B8EBCF" },
  switchKnob: { width: 17, height: 17, borderRadius: 9, backgroundColor: "#fff" },
  switchKnobOn: { alignSelf: "flex-end", backgroundColor: GREEN },
  callsList: { gap: 12, marginTop: 23 },
  callHistoryCard: { padding: 14, flexDirection: "row", alignItems: "center", gap: 11 },
  callHistoryIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#EAF8F0", alignItems: "center", justifyContent: "center" },
  callHistoryCopy: { flex: 1 },
  callHistoryTitle: { color: INK, fontSize: 14, fontWeight: "900" },
  callHistorySub: { color: MUTED, fontSize: 11, marginTop: 4 },
  callHistoryTime: { color: MUTED, fontSize: 10, fontWeight: "700" },
  formTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 26 },
  backButton: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#604631", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  formTitle: { color: INK, fontSize: 21, fontWeight: "900" },
  formSub: { color: MUTED, fontSize: 11, marginTop: 3 },
  field: { marginBottom: 18 },
  selectWrap: { minHeight: 52, borderWidth: 1, borderColor: "#E9DED6", borderRadius: 14, backgroundColor: "#FFFCFA", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, gap: 9 },
  selectText: { flex: 1, color: INK, fontSize: 14, fontWeight: "700" },
  rupee: { color: MUTED, fontSize: 18, fontWeight: "900" },
  textAreaWrap: { minHeight: 134, alignItems: "flex-start", paddingTop: 12 },
  textArea: { textAlignVertical: "top", minHeight: 100, paddingTop: 0 },
  micButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", position: "absolute", right: 9, bottom: 9 },
  photoRow: { minHeight: 73, borderRadius: 16, backgroundColor: "#FFF1E7", flexDirection: "row", alignItems: "center", padding: 12, gap: 11, marginBottom: 18 },
  photoIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  photoCopy: { flex: 1 },
  photoTitle: { color: INK, fontSize: 13, fontWeight: "900" },
  photoSub: { color: MUTED, fontSize: 10, marginTop: 3 },
  formStatus: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: ORANGE_LIGHT, borderRadius: 12, padding: 11, marginBottom: 15 },
  formStatusSuccess: { backgroundColor: "#EAF8F0" },
  formStatusText: { color: INK, fontSize: 12, fontWeight: "700", flex: 1 },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(36,26,21,0.34)" },
  modalCard: { backgroundColor: SAND, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, paddingBottom: 32, maxHeight: "74%" },
  districtModal: { maxHeight: "82%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  modalTitle: { color: INK, fontSize: 18, fontWeight: "900" },
  modalOption: { minHeight: 48, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12 },
  modalOptionActive: { backgroundColor: ORANGE_LIGHT },
  modalOptionText: { color: INK, fontSize: 14 },
  modalOptionTextActive: { color: ORANGE, fontWeight: "900" },
  profileHero: { alignItems: "center", marginTop: 8, marginBottom: 30 },
  profileAvatar: { width: 78, height: 78, borderRadius: 28, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", shadowColor: ORANGE, shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  profileAvatarText: { color: "#fff", fontSize: 32, fontWeight: "900" },
  profileName: { color: INK, fontSize: 19, fontWeight: "900", marginTop: 13, textAlign: "center" },
  profilePhone: { color: MUTED, fontSize: 12, marginTop: 4 },
  rolePill: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: ORANGE_LIGHT, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginTop: 10 },
  rolePillText: { color: ORANGE, fontSize: 11, fontWeight: "800" },
  profileCard: { padding: 16 },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 11, minHeight: 53 },
  profileRowIcon: { width: 35, height: 35, borderRadius: 12, backgroundColor: ORANGE_LIGHT, alignItems: "center", justifyContent: "center" },
  profileRowCopy: { flex: 1 },
  profileRowLabel: { color: MUTED, fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.6 },
  profileRowValue: { color: INK, fontSize: 14, fontWeight: "800", marginTop: 3 },
  editLink: { color: ORANGE, fontSize: 11, fontWeight: "900" },
  profileDivider: { height: 1, backgroundColor: "#F1E7E0", marginVertical: 7 },
  profileFooter: { alignItems: "center", marginTop: 32 },
  appVersion: { color: MUTED, fontSize: 11, marginBottom: 20 },
  logoutButton: { flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 8 },
  logoutText: { color: "#D54B3F", fontSize: 14, fontWeight: "900" },
  logoutSub: { color: MUTED, fontSize: 11, marginTop: 3 },
});
