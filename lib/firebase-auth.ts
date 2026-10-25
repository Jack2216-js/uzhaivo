import { Platform } from "react-native";
import Constants from "expo-constants";

export type FirebaseUserSnapshot = {
  id: string;
  phone: string;
};

let confirmation: { confirm: (code: string) => Promise<{ user: { uid: string; phoneNumber?: string | null } }> } | null = null;
let nativeAuthModule: any | null | undefined;
const isExpoGo = Constants.appOwnership === "expo" || Constants.executionEnvironment === "storeClient";
const nativeBuildRequired = "Real Firebase Phone OTP requires the WorkUru Android build. Expo Go does not include the native Firebase module.";

function nativeAuth(): any | null {
  if (isExpoGo || Platform.OS === "web") return null;
  if (nativeAuthModule !== undefined) return nativeAuthModule;
  try {
    // Expo Go does not ship React Native Firebase's native module. A custom
    // Android build does; the catch keeps the Expo Go preview usable.
    nativeAuthModule = require("@react-native-firebase/auth").default;
  } catch {
    nativeAuthModule = null;
  }
  return nativeAuthModule;
}

export async function requestFirebaseOtp(phone: string): Promise<void> {
  const auth = nativeAuth();
  if (!auth) throw new Error(nativeBuildRequired);
  confirmation = await auth.signInWithPhoneNumber(phone);
}

export async function verifyFirebaseOtp(phone: string, code: string): Promise<FirebaseUserSnapshot> {
  const auth = nativeAuth();
  if (!auth) throw new Error(nativeBuildRequired);
  if (!confirmation) throw new Error("Request an OTP before verifying the code.");
  const result = await confirmation.confirm(code);
  confirmation = null;
  return { id: result.user.uid, phone: result.user.phoneNumber ?? phone };
}

export async function getFirebaseUser(): Promise<FirebaseUserSnapshot | null> {
  const auth = nativeAuth();
  if (!auth) return null;
  const user = auth.currentUser;
  return user ? { id: user.uid, phone: user.phoneNumber ?? "" } : null;
}

export async function signOutFirebase(): Promise<void> {
  const auth = nativeAuth();
  if (auth) await auth.signOut();
}
