// @ts-nocheck
// UZHAIVO - Firebase Mock - No real Firebase needed for Expo Go
// Using mock OTP for development - 123456

let confirmationResult: any = null;

export async function requestFirebaseOtp(phone: string) {
  console.log('[Firebase Mock] Requesting OTP for:', phone);
  console.log('[Firebase Mock] DEV mode - Mock OTP 123456');
  return true;
}

export async function verifyFirebaseOtp(phone: string, otp: string) {
  console.log('[Firebase Mock] Verifying OTP:', phone, otp);
  
  // Accept any 6 digit OTP in dev
  if (otp.length === 6) {
    return {
      id: 'user-' + Date.now(),
      phone: phone,
    };
  }
  throw new Error('Invalid OTP - Enter 6 digits');
}

export async function getFirebaseUser() {
  return null; // Mock - no Firebase user
}

export async function signOutFirebase() {
  console.log('[Firebase Mock] Sign out');
  return true;
}
