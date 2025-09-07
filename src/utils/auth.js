// src/utils/auth.js
import { 
  auth,
  signInWithGoogle,
  serverTimestamp,
  doc,
  setDoc,
  db,
  signOut as firebaseSignOut
} from '../firebase';

// Alias signOut for backward compatibility
export const signOutUser = firebaseSignOut;

// Detect if the current device is mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const ADMIN_EMAILS = [
  'sahin401099@gmail.com',
  'dinapublicschool.paharpur@gmail.com' // Added admin email
];

export const isAdminEmail = (email) => ADMIN_EMAILS.includes(email);

export const signInAsPublic = async () => {
  try {
    console.log('Initiating public sign in...');
    
    // Clear any existing auth state
    await auth.signOut();
    
    const result = await signInWithGoogle();
    
    if (!result || !result.user) {
      throw new Error('No user returned from authentication');
    }
    
    const { user } = result;
    console.log('Public sign in successful for:', user.email);
    
    // Force token refresh to ensure fresh credentials
    await user.getIdToken(true);
    
    // Update user document in Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || null,
      isAdmin: false,
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
    console.log('User document updated in Firestore');

    return { 
      success: true, 
      user: userData
    };
  } catch (error) {
    console.error('Public sign in error:', error);
    
    // Handle specific error cases
    let errorMessage = error.message || 'Failed to sign in';
    if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with the same email but different sign-in method.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed before completing sign in.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Only one sign-in request can be made at a time.';
    }
    
    return { 
      success: false, 
      error: errorMessage,
      code: error.code
    };
  }
};

export const signInAsAdmin = async () => {
  try {
    console.log('Initiating admin sign in...');
    
    // Clear any existing auth state
    await auth.signOut();
    
    const result = await signInWithGoogle();
    
    if (!result || !result.user) {
      throw new Error('No user returned from authentication');
    }
    
    const { user } = result;
    console.log('Admin sign in attempt for:', user.email);
    
    // Force token refresh to ensure fresh credentials
    await user.getIdToken(true);
    
    // Check if user is an admin
    const isAdmin = isAdminEmail(user.email);
    if (!isAdmin) {
      await auth.signOut();
      throw { 
        code: 'admin/access-denied',
        message: 'This account does not have admin privileges' 
      };
    }
    
    // Check admin status
    const adminStatus = isAdminEmail(user.email);
    console.log('Admin status:', adminStatus);
    
    if (!adminStatus) {
      console.log('Access denied - not an admin email:', user.email);
      // Sign out the user since they're not an admin
      await auth.signOut();
      return { 
        success: false, 
        error: 'Access denied. Admin privileges required.',
        code: 'admin/access-denied'
      };
    }
    
    // Update user document in Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || null,
      isAdmin: true,
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
    console.log('Admin user document updated in Firestore');

    return { 
      success: true, 
      user: userData
    };
  } catch (error) {
    console.error('Admin sign in error:', error);
    
    // Handle specific error cases
    let errorMessage = error.message || 'Failed to sign in as admin';
    if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with the same email but different sign-in method.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed before completing sign in.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Only one sign-in request can be made at a time.';
    } else if (error.code === 'admin/access-denied') {
      errorMessage = 'Access denied. Admin privileges required.';
    }
    
    return { 
      success: false, 
      error: errorMessage,
      code: error.code
    };
  }
};

// signOutUser is imported from firebase.js