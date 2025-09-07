// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged, signOut } from '../firebase';
import { signInAsPublic, signInAsAdmin, isAdminEmail } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User signed in' : 'No user');
      
      try {
        if (firebaseUser) {
          // Check if the user is an admin
          const isAdmin = isAdminEmail(firebaseUser.email);
          console.log(`User ${firebaseUser.email} admin status:`, isAdmin);
          
          // Create user data object
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            photoURL: firebaseUser.photoURL || null,
            isAdmin,
          };
          
          console.log('Setting user data:', userData);
          setUser(userData);
        } else {
          console.log('No user, setting user to null');
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
      } finally {
        // Ensure loading is set to false after a small delay to prevent flash
        const timer = setTimeout(() => {
          setLoading(false);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    isAdmin: user?.isAdmin || false,
    isPublicUser: !!user && !user.isAdmin,
    loading,
    signInAsPublic: async () => {
      try {
        const result = await signInAsPublic();
        if (result.success) {
          setUser({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            isAdmin: false,
          });
        }
        return result;
      } catch (error) {
        console.error('Error in signInAsPublic:', error);
        return { success: false, error: error.message };
      }
    },
    signInAsAdmin: async () => {
      try {
        const result = await signInAsAdmin();
        if (result.success) {
          setUser({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            isAdmin: true,
          });
        }
        return result;
      } catch (error) {
        console.error('Error in signInAsAdmin:', error);
        return { success: false, error: error.message };
      }
    },
    logOut: async () => {
      try {
        await signOut();
        setUser(null);
        return { success: true };
      } catch (error) {
        console.error('Error signing out:', error);
        return { success: false, error: error.message };
      }
    },
    // Keep signOut as an alias for backward compatibility
    signOut: async () => {
      try {
        await signOut();
        setUser(null);
        return { success: true };
      } catch (error) {
        console.error('Error signing out:', error);
        return { success: false, error: error.message };
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;