// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAhfBV2ifR8GG2xOUk2F4kKIMaqdEtbF-k",
  authDomain: "dpspaharpur-1a2b3.firebaseapp.com", // Update this with your correct auth domain
  projectId: "dpspaharpur",
  storageBucket: "dpspaharpur.appspot.com",
  messagingSenderId: "786003538204",
  appId: "1:786003538204:web:e212f2767df2684633cad9",
  measurementId: "G-XXXXXXXXXX" // Add your measurement ID from Firebase Console
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

// Initialize Firebase services
app = initializeApp(firebaseConfig);
auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

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
      console.warn('The current browser doesn\'t support offline persistence.');
    } else {
      console.warn('Error enabling offline persistence:', error);
    }
  }
};

// Start persistence initialization but don't wait for it
initPersistence().catch(console.error);

console.log('Firebase initialized successfully');

export { auth, db, storage };

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Export auth state observer
export { onAuthStateChanged };

// Helper function to get a document from Firestore
export const getDocument = async (collection, id) => {
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Helper function to set a document in Firestore
export const setDocument = async (collection, id, data) => {
  await setDoc(doc(db, collection, id), data, { merge: true });
};
