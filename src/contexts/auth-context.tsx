import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User as SupaUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/lib/types';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { vorname: string; nachname: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const translateError = (msg: string): string => {
  const m = msg.toLowerCase();
  if (m.includes('invalid login') || m.includes('invalid credentials')) return 'E-Mail oder Passwort ist falsch.';
  if (m.includes('already registered') || m.includes('already been registered') || m.includes('user already')) return 'Diese E-Mail ist bereits registriert.';
  if (m.includes('password') && m.includes('6')) return 'Passwort muss mindestens 6 Zeichen haben.';
  if (m.includes('password') && (m.includes('short') || m.includes('characters'))) return 'Passwort muss mindestens 8 Zeichen haben.';
  if (m.includes('email') && m.includes('valid')) return 'Bitte überprüfe deine Eingaben.';
  return 'Bitte überprüfe deine Eingaben.';
};

async function loadProfile(supaUser: SupaUser): Promise<User> {
  const { data } = await supabase.from('profiles').select('*').eq('id', supaUser.id).maybeSingle();
  return {
    id: supaUser.id,
    email: supaUser.email ?? '',
    vorname: data?.vorname ?? (supaUser.user_metadata?.vorname as string) ?? '',
    nachname: data?.nachname ?? (supaUser.user_metadata?.nachname as string) ?? '',
    has_listings: data?.has_listings ?? false,
    has_requests: data?.has_requests ?? false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Subscribe FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // Defer profile fetch to avoid deadlock inside callback
        setTimeout(() => {
          loadProfile(newSession.user).then(setUser);
        }, 0);
      } else {
        setUser(null);
      }
    });

    // 2. THEN check existing session
    supabase.auth.getSession().then(async ({ data: { session: existing } }) => {
      setSession(existing);
      if (existing?.user) {
        setUser(await loadProfile(existing.user));
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(translateError(error.message));
  }, []);

  const signUp = useCallback(async (email: string, password: string, userData: { vorname: string; nachname: string }) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { vorname: userData.vorname, nachname: userData.nachname },
      },
    });
    if (error) throw new Error(translateError(error.message));
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
