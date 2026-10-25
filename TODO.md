# WorkUru delivery outcomes

## Language-first onboarding and persistence
- [ ] On a fresh install, show language selection before login.
- [ ] Show English and Tamil choices, WorkUru branding, the tagline “Salem la Velai,” the bilingual choose-language title, an A/அ language affordance, selected-card emphasis, and a Continue action.
- [ ] Save the selected locale under `app_language`; on later launches skip language selection and use the saved locale.
- [ ] Keep all user-facing copy in matching English and Tamil dictionaries, with worker defaulting to Tamil and owner defaulting to English while allowing changes later.

## Branded app shell and navigation
- [ ] Provide a branded splash state before login and a portrait, one-handed layout with orange `#FF6B00`, white/sand surfaces, rounded glass cards, and double-shadow depth.
- [ ] Provide stable bottom navigation for worker Jobs / Calls / Profile and owner My Jobs / Post / Profile.
- [ ] Include useful loading, empty, error, and success states in the preview.

## Authentication and role flow
- [ ] Provide phone input, OTP entry, and verification state through Firebase Phone Auth in the Android build; Expo Go must not accept a demo OTP and should direct the user to the native build.
- [ ] After login, show role selection only when the user has no role.
- [ ] Provide worker and owner role cards with bilingual labels and save the selected role through the repository boundary.

## Worker experience
- [ ] Show a Salem ad banner, search, salary and distance filters, and active job cards ordered newest first.
- [ ] Each job card shows title, salary, district, location, and a green native-friendly call action.
- [ ] Use representative Salem fallback content when backend credentials are absent.

## Owner experience and posting
- [ ] Show total jobs and calls summary, owned jobs, active/inactive toggles, and a prominent Post New Job action.
- [ ] Provide post-job fields for Driver, Cook, Steel Helper, Sago Factory, Hotel Helper, and Construction; salary; location; current-location action; phone; description; microphone affordance; optional image affordance; validation; and submission state.
- [ ] Keep job creation isolated behind a Supabase data repository method with the requested jobs fields; Firebase UID values are stored as text owner IDs.

## Profile and districts
- [ ] Show phone, role, language toggle, logout, and a district selector containing all 38 Tamil Nadu districts with Salem as the default.
- [ ] Make language changes persist and update the visible UI immediately.

## Managed mobile delivery
- [ ] Use the fixed managed Expo/React Native/TypeScript starter; do not replace the managed framework.
- [ ] Include distinct WorkUru launcher, splash, favicon, and Android adaptive icon assets, and carry the identity through `app.config.ts`.
- [ ] State native-only gaps honestly: real Firebase Phone OTP, device location, speech-to-text, and image picking require their respective Android runtime integrations/configuration beyond the managed preview.
