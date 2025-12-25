// firebase.js - Firebase configuration and initialization
import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhfBV2ifR8GG2xOUk2F4kKIMaqdEtbF-k",
  authDomain: "dpspaharpur.firebaseapp.com",
  projectId: "dpspaharpur",
  storageBucket: "dpspaharpur.firebasestorage.app",
  messagingSenderId: "786003538204",
  appId: "1:786003538204:web:e212f2767df2684633cad9"
};

// Initialize Firebase
let app;
let auth;
let db;
const googleProvider = new GoogleAuthProvider();

try {
  // Initialize Firebase only if it hasn't been initialized yet
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase: ' + error.message);
}

// Google Sign In with popup
export const signInWithGoogle = async () => {
  try {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, use redirect
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      // The redirect result will be handled in the component
      return { user: null, token: null };
    } else {
      // On desktop, use popup
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      return { user, token };
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Check for redirect result
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      return { user, token };
    }
    return { user: null, token: null };
  } catch (error) {
    console.error('Error getting redirect result:', error);
    throw error;
  }
};

// Sign Out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};

// Auth State Observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const getNotices = async () => {
  const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const addNotice = async (notice) => {
  const docRef = await addDoc(collection(db, 'notices'), {
    ...notice,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active'
  });
  return docRef.id;
};

export const updateNotice = async (id, updates) => {
  await updateDoc(doc(db, 'notices', id), {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

export const deleteNotice = async (id) => {
  await deleteDoc(doc(db, 'notices', id));
};

export const getNoticeById = async (id) => {
  const docRef = doc(db, 'notices', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } else {
    throw new Error('No such document!');
  }
};

export { 
  app, 
  auth, 
  db, 
  googleProvider, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy 
};
