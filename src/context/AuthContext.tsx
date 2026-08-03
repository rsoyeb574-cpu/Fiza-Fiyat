import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginDemoAdmin: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  loginDemoAdmin: () => {},
  loginWithEmail: async () => {},
  logout: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState<boolean>(() => {
    return localStorage.getItem('fh_demo_admin') === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginDemoAdmin = () => {
    localStorage.setItem('fh_demo_admin', 'true');
    setIsDemoAdmin(true);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    localStorage.removeItem('fh_demo_admin');
    setIsDemoAdmin(false);
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
  };

  const isAdmin = isDemoAdmin || !!user;

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginDemoAdmin, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
