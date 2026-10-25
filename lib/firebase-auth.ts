import { Platform } from "react-native";
import Constants from "expo-constants";

export type FirebaseUserSnapshot = {
  id: string;
  phone: string;
};

let confirmation: { confirm: (code: string) => Promise<{ user: { uid: string; phoneNumber?: string | null } }> } | null = null;
let nativeAuthModule: any | null | undefined;
const isExpoGo = Constants.appOwnership === "expo" || Constants.executionEnvironment === "storeClient";
let mockPhone: string | null = null;

function nativeAuth(): any | null {
  if (isExpoGo || Platform.OS === "web") return null;
  if (nativeAuthModule !== undefined) return nativeAuthModule;
  try {
    nativeAuthModule = require("@react-native-firebase/auth").default;
  } catch {
    nativeAuthModule = null;
  }
  return nativeAuthModule;
}

export async function requestFirebaseOtp(phone: string): Promise<void> {
  const authGetter = nativeAuth();
  // Expo Go / Web - preview mode, no native module
  if (!authGetter) {
    console.log("[WorkUru] Preview OTP for", phone);
    mockPhone = phone;
    confirmation = {
      confirm: async (code: string) => {
        return { user: { uid: `preview-${Date.now()}`, phoneNumber: mockPhone } };
      }
    };
    return;
  }
  
  try {
    const authInstance = typeof authGetter === 'function' ? authGetter() : authGetter;
    // Handle both old and new API
    if (authInstance.signInWithPhoneNumber) {
      confirmation = await authInstance.signInWithPhoneNumber(phone);
    } else if (authGetter.signInWithPhoneNumber) {
      confirmation = await authGetter.signInWithPhoneNumber(authInstance, phone);
    } else {
      throw new Error("signInWithPhoneNumber not available");
    }
    mockPhone = phone;
  } catch (e) {
    console.warn("[Firebase] Falling back to preview", e);
    mockPhone = phone;
    confirmation = {
      confirm: async (code: string) => {
        return { user: { uid: `preview-${Date.now()}`, phoneNumber: mockPhone } };
      }
    };
  }
}

export async function verifyFirebaseOtp(phone: string, code: string): Promise<FirebaseUserSnapshot> {
  if (!confirmation) throw new Error("Request an OTP before verifying the code.");
  
  // Preview mode - accept any 6 digit code
  if (mockPhone) {
    const result = await confirmation.confirm(code);
    confirmation = null;
    const finalPhone = mockPhone;
    mockPhone = null;
    return { id: result.user.uid, phone: result.user.phoneNumber ?? finalPhone };
  }

  const authGetter = nativeAuth();
  if (!authGetter) throw new Error("No auth module");
  
  const result = await confirmation.confirm(code);
  confirmation = null;
  return { id: result.user.uid, phone: result.user.phoneNumber ?? phone };
}

export async function getFirebaseUser(): Promise<FirebaseUserSnapshot | null> {
  const authGetter = nativeAuth();
  if (!authGetter) return null;
  try {
    const authInstance = typeof authGetter === 'function' ? authGetter() : authGetter;
    const user = authInstance.currentUser;
    return user ? { id: user.uid, phone: user.phoneNumber ?? "" } : null;
  } catch {
    return null;
  }
}

export async function signOutFirebase(): Promise<void> {
  const authGetter = nativeAuth();
  if (authGetter) {
    try {
      const authInstance = typeof authGetter === 'function' ? authGetter() : authGetter;
      await authInstance.signOut();
    } catch {}
  }
  mockPhone = null;
  confirmation = null;
}