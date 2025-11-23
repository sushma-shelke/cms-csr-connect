import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, signInWithCredential, RecaptchaVerifier, PhoneAuthProvider } from 'firebase/auth';
import firebaseConfig from '../config/firebase';

// Initialize Firebase
let app = null;
let auth = null;

// Initialize Firebase app and auth
const initializeFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('Firebase initialized successfully');
    console.log('Auth instance:', auth);
  }
  return auth;
};

// Create reCAPTCHA verifier following Firebase documentation
const createRecaptchaVerifier = () => {
  const container = document.getElementById('recaptcha-container');
  if (!container) {
    console.error('reCAPTCHA container not found');
    return null;
  }

  try {
    // Create RecaptchaVerifier following Firebase docs pattern
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log('reCAPTCHA solved:', response);
      }
    });
    console.log('reCAPTCHA verifier created');
    return recaptchaVerifier;
  } catch (error) {
    console.error('Error creating reCAPTCHA verifier:', error);
    return null;
  }
};

/**
 * Send OTP using Firebase Phone Auth
 * @param {string} phoneNumber - Phone number with country code
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendFirebaseOTP = async (phoneNumber) => {
  try {
    // Initialize Firebase and get auth instance
    const authInstance = initializeFirebase();
    if (!authInstance) {
      throw new Error('Failed to initialize Firebase Auth');
    }

    // Create reCAPTCHA verifier
    const verifier = createRecaptchaVerifier();
    if (!verifier) {
      throw new Error('Failed to create reCAPTCHA verifier');
    }

    // Ensure phone number is in E.164 format
    const formattedPhone = phoneNumber.startsWith('+')
      ? phoneNumber
      : `+91${phoneNumber.replace(/\D/g, '')}`; // Default to India if no country code

    console.log('Sending Firebase OTP to:', formattedPhone);

    // Send OTP using Firebase Phone Auth following Firebase documentation
    const confirmationResult = await signInWithPhoneNumber(authInstance, formattedPhone, verifier);

    // Store confirmation result globally (following Firebase docs pattern)
    window.confirmationResult = confirmationResult;

    // Also store in sessionStorage for persistence
    sessionStorage.setItem('firebaseConfirmationResult', JSON.stringify({
      verificationId: confirmationResult.verificationId,
      phoneNumber: formattedPhone
    }));

    return {
      success: true,
      message: 'OTP sent successfully via Firebase'
    };

  } catch (error) {
    console.error('Firebase OTP Error:', error);

    let errorMessage = 'Failed to send OTP';

    if (error.code === 'auth/invalid-phone-number') {
      errorMessage = 'Invalid phone number format';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please try again later';
    } else if (error.code === 'auth/quota-exceeded') {
      errorMessage = 'SMS quota exceeded. Please try again later';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      error: error.code || error.message
    };
  }
};

/**
 * Verify OTP using Firebase Phone Auth
 * @param {string} otpCode - 6-digit OTP code
 * @returns {Promise<{success: boolean, message: string, user?: any}>}
 */
export const verifyFirebaseOTP = async (otpCode) => {
  try {
    // Initialize Firebase and get auth instance
    const authInstance = initializeFirebase();
    if (!authInstance) {
      throw new Error('Failed to initialize Firebase Auth');
    }

    // Check if we have confirmation result (following Firebase docs pattern)
    let confirmationResult;

    // First try to get from global window object (Firebase docs pattern)
    if (window.confirmationResult) {
      confirmationResult = window.confirmationResult;
    } else {
      // Fallback to sessionStorage
      const storedData = sessionStorage.getItem('firebaseConfirmationResult');
      if (!storedData) {
        return {
          success: false,
          message: 'Session expired. Please request OTP again.'
        };
      }

      const { verificationId } = JSON.parse(storedData);
      // Create a mock confirmation result for verification
      const credential = PhoneAuthProvider.credential(verificationId, otpCode);
      const userCredential = await signInWithCredential(authInstance, credential);

      // Clear stored data
      sessionStorage.removeItem('firebaseConfirmationResult');
      if (window.confirmationResult) {
        window.confirmationResult = null;
      }

      // Get ID token for backend authentication
      const idToken = await userCredential.user.getIdToken();

      return {
        success: true,
        message: 'OTP verified successfully',
        user: userCredential.user,
        idToken: idToken
      };
    }

    console.log('Verifying Firebase OTP using confirmation result');

    // Verify OTP using Firebase documentation pattern
    const userCredential = await confirmationResult.confirm(otpCode);

    // Clear stored data
    sessionStorage.removeItem('firebaseConfirmationResult');
    window.confirmationResult = null;

    // Get ID token for backend authentication
    const idToken = await userCredential.user.getIdToken();

    return {
      success: true,
      message: 'OTP verified successfully',
      user: userCredential.user,
      idToken: idToken
    };

  } catch (error) {
    console.error('Firebase OTP Verification Error:', error);

    let errorMessage = 'Invalid OTP';

    if (error.code === 'auth/invalid-verification-code') {
      errorMessage = 'Invalid verification code';
    } else if (error.code === 'auth/code-expired') {
      errorMessage = 'OTP expired. Please request a new OTP';
    } else if (error.code === 'auth/missing-verification-code') {
      errorMessage = 'Please enter the OTP';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      error: error.code || error.message
    };
  }
};

/**
 * Setup reCAPTCHA container
 */
export const setupRecaptcha = () => {
  // Initialize Firebase to ensure auth is ready
  const authInstance = initializeFirebase();
  if (!authInstance) {
    console.error('Failed to initialize Firebase Auth for reCAPTCHA setup');
    return false;
  }

  // Clear any existing recaptcha
  const container = document.getElementById('recaptcha-container');
  if (container) {
    container.innerHTML = '';
  }

  // Create new reCAPTCHA verifier
  const verifier = createRecaptchaVerifier();

  return !!verifier;
};

// Export auth instance for other uses
export const getFirebaseAuth = () => {
  return initializeFirebase();
};