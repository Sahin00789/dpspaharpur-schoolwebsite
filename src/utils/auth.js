import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { auth, db, getDocument, setDocument } from '../firebase';

// Export all necessary functions and objects
export { 
  auth,
  signIn as signInWithEmailAndPassword, // Alias signIn to signInWithEmailAndPassword for backward compatibility
  logOut,
  onAuthStateChange,
  getCurrentUser,
  signInWithGoogle  // Export the function here
};


// List of allowed admin emails
const ALLOWED_ADMINS = [
  'sahin401099@gmail.com',
  // Add more admin emails here
];

// Check if user is admin
const isAdmin = (user) => {
  return user && user.email && ALLOWED_ADMINS.includes(user.email);
};

// Sign up with email and password (not used in Google-only auth but kept for reference)
const signUp = async (email, password, displayName) => {
  try {
    if (!ALLOWED_ADMINS.includes(email)) {
      throw new Error('Only authorized administrators can create accounts.');
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with display name
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    await setDocument('users', user.uid, {
      email: user.email,
      displayName,
      isAdmin: true,
      provider: 'email',
      photoURL: user.photoURL || null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });
    
    toast.success('Account created successfully!');
    return { user: { ...user, displayName }, isAdmin: true };
  } catch (error) {
    console.error('Error signing up:', error);
    toast.error(error.message || 'Failed to create account');
    throw error;
  }
};

// Sign in with email and password
const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (!isAdmin(user)) {
      await signOut(auth);
      throw new Error('Access denied. Only authorized administrators can sign in.');
    }
    
    // Update last login time
    await setDocument('users', user.uid, {
      lastLogin: new Date().toISOString()
    });
    
    toast.success(`Welcome back, ${user.displayName || 'Admin'}!`);
    return { user, isAdmin: true };
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user is in the allowed admin list
    if (!isAdmin(user)) {
      await firebaseSignOut(auth);
      throw new Error('Access denied. This Google account is not authorized for admin access.');
    }
    
    // Prepare user data
    const userData = {
      uid: user.uid, // Include uid in the document data
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: 'google',
      lastLogin: new Date().toISOString(),
      isAdmin: true,
      updatedAt: new Date().toISOString()
    };
    
    // Update or create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
    
    return { 
      user: {
        uid: user.uid,
        ...userData
      }, 
      isAdmin: true 
    };
    
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    // Handle specific error cases
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        throw new Error('Sign in was cancelled. Please try again.');
      case 'auth/account-exists-with-different-credential':
        throw new Error('An account already exists with this email. Please sign in using your original method.');
      case 'auth/cancelled-popup-request':
        throw new Error('Multiple sign-in attempts detected. Please try again.');
      case 'auth/popup-blocked':
        throw new Error('Popup was blocked by your browser. Please allow popups for this site and try again.');
      default:
        throw new Error(error.message || 'Failed to sign in with Google');
    }
  }
};

// Sign out
const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Reset password (not used in Google-only auth but kept for reference)
const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

// Auth state observer
const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // User is signed in
        const isAdminUser = isAdmin(user);
        
        // Prepare user data for Firestore
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString(),
          isAdmin: isAdminUser,
          updatedAt: new Date().toISOString()
        };
        
        // Update or create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
        
        // Get the latest user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const latestUserData = userDoc.exists() ? userDoc.data() : userData;
        
        callback({
          user: {
            ...latestUserData,
            // Ensure these fields are always set from auth
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          isAdmin: latestUserData.isAdmin || isAdminUser
        });
        
      } catch (error) {
        console.error('Error in auth state change:', error);
        // Fallback to basic auth data if Firestore fails
        callback({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAdmin: isAdmin(user)
          },
          isAdmin: isAdmin(user)
        });
      }
    } else {
      // No user is signed in
      callback({ user: null, isAdmin: false });
    }
  });
};

// Get current user
const getCurrentUser = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    
    // Get user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};
    
    // If user document doesn't exist, create it
    if (!userDoc.exists()) {
      const newUserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString(),
        isAdmin: isAdmin(user),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), newUserData, { merge: true });
      return newUserData;
    }
    
    // Return combined user data
    return {
      ...userData,
      // Ensure these fields are always set from auth
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAdmin: userData.isAdmin || isAdmin(user)
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    // Fallback to basic auth data if Firestore fails
    const user = auth.currentUser;
    if (!user) return null;
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAdmin: isAdmin(user)
    };
  }
};
