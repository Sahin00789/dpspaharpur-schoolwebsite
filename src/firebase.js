// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp as firestoreServerTimestamp, 
  enableIndexedDbPersistence 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhfBV2ifR8GG2xOUk2F4kKIMaqdEtbF-k",
  authDomain: "dpspaharpur-1a2b3.firebaseapp.com",
  projectId: "dpspaharpur",
  storageBucket: "dpspaharpur.appspot.com",
  messagingSenderId: "786003538204",
  appId: "1:786003538204:web:e212f2767df2684633cad9",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Initialize services with CORS configuration
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Configure Firestore for offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Offline persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support offline persistence.');
  }
});

// Initialize Google Auth Provider with CORS support
const googleProvider = new GoogleAuthProvider();

// Configure the Google provider with CORS support
googleProvider.setCustomParameters({
  prompt: 'select_account',  // Always show account chooser
  login_hint: '',
  hd: '*',
  include_granted_scopes: 'true',  // Include granted scopes for incremental auth
  // Add CORS headers to Google OAuth requests
  'X-Requested-With': 'XMLHttpRequest',
  'Access-Control-Allow-Origin': window.location.origin,
  'Access-Control-Allow-Credentials': 'true'
});

// Add required scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Enable account selection
googleProvider.setCustomParameters({
  prompt: 'select_account',
  login_hint: ''
});

// Auth functions
const signInWithGoogle = async () => {
  try {
    // Clear any existing auth state
    await auth.signOut();
    
    // Sign in with popup
    const result = await signInWithPopup(auth, googleProvider);
    
    // Force token refresh to ensure fresh credentials
    await result.user.getIdToken(true);
    
    return result;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};
const signOutUser = () => firebaseSignOut(auth);

// Helper function to get a document from Firestore
const getDocument = async (collection, id) => {
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Helper function to set a document in Firestore
const setDocument = async (collection, id, data) => {
  await setDoc(doc(db, collection, id), data, { merge: true });
};

// Enable offline persistence in a non-blocking way
const initPersistence = async () => {
  if (process.env.NODE_ENV !== 'production') return;
  
  try {
    await enableIndexedDbPersistence(db, { 
      experimentalForceOwningTab: true 
    });
    console.log('Offline persistence enabled');
  } catch (error) {
    if (error.code === 'failed-precondition') {
      console.warn('Offline persistence can only be enabled in one tab at a time.');
    } else if (error.code === 'unimplemented') {
      console.warn('The current browser does not support offline persistence.');
    }
    console.error('Error enabling offline persistence:', error);
  }
};

// Start persistence initialization but don't wait for it
initPersistence().catch(console.error);

console.log('Firebase initialized successfully');

// Export all necessary variables and functions
export const firebaseApp = app;
export const firebaseAuth = auth;
export const firestore = db;
export const firebaseStorage = storage;

export {
  // Core Firebase services
  app,
  auth,
  db,
  storage,
  
  // Auth providers and functions
  googleProvider,
  GoogleAuthProvider,
  signInWithGoogle,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  
  // Firestore helpers
  doc,
  setDoc,
  getDoc,
  
  // Custom helpers
  getDocument,
  setDocument
};

// Export serverTimestamp separately
export const serverTimestamp = firestoreServerTimestamp;
// Export signOut separately
export const signOut = signOutUser;

// Default export for backward compatibility
export default {
  // Core Firebase services
  app,
  auth,
  db,
  storage,
  
  // Auth providers and functions
  googleProvider,
  GoogleAuthProvider,
  signInWithGoogle,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut: signOutUser,
  onAuthStateChanged,
  
  // Firestore helpers
  doc,
  setDoc,
  getDoc,
  serverTimestamp: firestoreServerTimestamp,
  
  // Custom helpers
  getDocument,
  setDocument
};
