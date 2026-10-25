# WorkUru — implementation plan

## Implementation approach

WorkUru will use the managed Expo Router / React Native / TypeScript starter because managed Mobile is fixed to that runtime. The user-requested product behavior and visual direction are preserved: a language-first bilingual onboarding, a branded splash, phone OTP and role-selection flow, worker and owner experiences, post-job form, and profile. The screen state is intentionally kept in one app-level controller for the preview so the eight requested product screens are easy to exercise in a single portrait flow; data access is isolated in `lib/workuru-data.ts` so Supabase can replace the local repository without changing UI code.

Local fallback data makes the preview useful without credentials. The repository models the requested `users`, `jobs`, and `ads` records, defaults to Salem, and exposes clear loading, empty, error, and success states. Firebase Phone Auth handles Android OTP through native modules; Supabase is data-only. Native-friendly actions use installed Expo capabilities where available (haptics, phone links, persistence); location, speech-to-text, and image selection remain native-build seams with honest preview behavior.

## Design

Three candidate styles considered: “Salem Sunrise Glass” (0.06), a “Quiet Utility Ledger” (0.04), and “Cred-like Orange Pocket” (0.08). Chosen: **Salem Sunrise Glass**.

- **Design Movement:** Premium Indian consumer utility with soft 3D glassmorphism and warm sunrise color.
- **Core Principles:** warm trust, fast scanning, tactile depth, and language dignity.
- **Color Philosophy:** orange is the ownable signal of opportunity and motion; off-white and sand keep dense job data calm; green is reserved for the action that connects worker and owner.
- **Layout Paradigm:** a vertical “daily board” with a floating top identity, horizontal chips for quick sorting, and bottom navigation as a stable handrail.
- **Signature Elements:** orange-to-coral gradient pills, double-shadow glass cards, and small Tamil/English language badges.
- **Interaction Philosophy:** every tap gives an obvious visual state; primary actions feel lifted, while secondary controls stay quiet and close to the thumb.
- **Animation:** use restrained 180–240ms scale/opacity transitions for cards and selected chips; avoid motion that competes with job information.
- **Typography System:** system sans with heavy rounded display weight for numbers and compact semibold labels; Tamil text stays at least 15px with generous line height.
- **Brand Essence:** the everyday Salem jobs board for people who want work and people who need dependable hands; local, direct, optimistic.
- **Brand Voice:** direct, warm, and bilingual. Example lines: “Find work that starts today.” / “Innaiku velai thedunga.”
- **Wordmark & Logo:** a compact white “W” formed from two rising job-path strokes inside an orange rounded square, paired with a small bilingual language mark in the app UI.
- **Signature Brand Color:** WorkUru Orange `#FF6B00`.

## Project structure

- `app/(tabs)/index.tsx` — route entry that renders the WorkUru app.
- `lib/workuru-app.tsx` — app-level screen controller, shared visual primitives, and the eight product screens.
- `lib/workuru-data.ts` — bilingual dictionaries, districts, mock records, and Supabase-ready repository seams.
- `assets/images/*` — WorkUru launcher, splash, favicon, and Android adaptive icon assets.
- `app.config.ts` — WorkUru native branding and managed runtime configuration.
- `TODO.md` — outcome-based acceptance work and evidence tracking.

## Backend boundary

The UI uses repository methods (`getJobs`, `getAds`, `saveJob`, `getCurrentUser`, and `saveUser`) rather than knowing whether data is local or remote. Firebase Auth owns phone identity; the Supabase adapter implements the `users`, `jobs`, and `ads` schema plus public `job_images` and `ad_posters` buckets. No service-role secrets are placed in the client bundle.
