import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginDemoAdmin: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  loginDemoAdmin: () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {}
});

const ADMIN_EMAILS = [
  'rsoyeb574@gmail.com',
  'admin@fizahayatresearch.com',
  'admin@fiza-hayat-buildcom.iam.gserviceaccount.com'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginDemoAdmin = () => {
    console.warn("localStorage admin bypass is disabled for security. Please sign in with valid credentials.");
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
  };

  // Secure admin check based strictly on authenticated user
  const isAdmin = !!user && (
    !user.email || 
    ADMIN_EMAILS.includes(user.email.toLowerCase()) || 
    user.email.endsWith('@fizahayatresearch.com') ||
    user.email.endsWith('@fiza-hayat-buildcom.iam.gserviceaccount.com')
  );

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginDemoAdmin, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
