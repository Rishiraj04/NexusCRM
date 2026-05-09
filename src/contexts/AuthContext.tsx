import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  organization: any | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [organization, setOrganization] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth is not initialized. Check your configuration.');
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch user profile from Firestore
        const userRef = doc(db, 'users', user.uid);
        let userSnap;
        try {
          userSnap = await getDoc(userRef);
        } catch (error) {
          console.error(error);
          setLoading(false);
          return;
        }

        if (!userSnap.exists()) {
          // New user: Create a default organization and profile
          // In a real multi-tenant app, this might be a sign-up flow
          // For this app, we'll auto-provision for demo purposes
          const orgId = `org_${user.uid.slice(0, 5)}`;
          const newProfile = {
            email: user.email,
            displayName: user.displayName,
            organizationId: orgId,
            role: 'admin',
            status: 'active',
            createdAt: new Date().toISOString()
          };

          const newOrg = {
            name: `${user.displayName}'s Organization`,
            createdAt: new Date().toISOString(),
            createdBy: user.uid
          };

          try {
            await setDoc(doc(db, 'organizations', orgId), newOrg);
            await setDoc(userRef, newProfile);

            setProfile(newProfile);
            setOrganization(newOrg);
          } catch (error) {
            console.error(error);
          }
        } else {
          const profileData = userSnap.data();
          setProfile(profileData);

          try {
            const orgSnap = await getDoc(doc(db, 'organizations', profileData.organizationId));
            if (orgSnap.exists()) {
              setOrganization(orgSnap.data());
            }
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        setProfile(null);
        setOrganization(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    if (!auth) throw new Error('Authentication system not available. Please check Firebase configuration.');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, organization, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
