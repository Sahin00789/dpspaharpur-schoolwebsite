import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleSignInButton({ text = 'Sign in with Google', className = '' }) {
  const { loginWithGoogle, loading } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${className}`}
    >
      <FcGoogle className="w-5 h-5" />
      <span className="font-medium">{loading ? 'Signing in...' : text}</span>
    </button>
  );
}
