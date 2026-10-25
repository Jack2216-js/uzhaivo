# WorkUru native handoff

The Android app uses Firebase Phone Auth for identity and Phone OTP. Supabase is data-only: `lib/workuru-data.ts` owns the repository boundary for users, jobs, ads, and storage-backed URLs. Expo Go does not provide a fake OTP path; users must install the native WorkUru Android development/release build for real authentication.

The supplied `google-services.json` is wired through `app.config.ts` and targets Android package `com.uzhaivo.app`. Build with the native Firebase modules (`@react-native-firebase/app` and `@react-native-firebase/auth`); Expo Go cannot load these native modules. Enable Phone Auth in Firebase Console and add the Android app with the exact same package ID. The requested Supabase data schema and public `job_images` / `ad_posters` buckets are in `supabase/schema.sql`. Keep Supabase client values in the managed project's protected environment, never service-role credentials in the client bundle.

The current preview uses installed Expo haptics and `Linking.openURL('tel:…')` for native-friendly actions. Real location, speech-to-text, image picking, and Phone OTP require their Expo/native modules and permissions in the Android build; the UI reports the required native-build action instead of accepting a demo code.
