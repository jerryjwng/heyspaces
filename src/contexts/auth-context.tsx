import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { vorname: string; nachname: string }) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const found = mockUsers.find(u => u.email === email) || mockUsers[0];
    setUser(found);
    setIsLoading(false);
  }, []);

  const signUp = useCallback(async (email: string, _password: string, userData: { vorname: string; nachname: string }) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setUser({ id: crypto.randomUUID(), email, ...userData, has_listings: false, has_requests: false });
    setIsLoading(false);
  }, []);

  const signOut = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
