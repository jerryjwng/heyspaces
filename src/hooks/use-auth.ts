import { useState, useCallback } from 'react';
import { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

export function useAuth() {
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

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  return { user, isLoading, signIn, signUp, signOut };
}
