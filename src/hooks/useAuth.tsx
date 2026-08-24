"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isDemoMode: boolean;
}

const DEMO_USER: User = {
  uid: "demo-designer",
  email: "demo@atelierinteriors.com",
  displayName: "Demo Designer",
  role: "designer",
  createdAt: new Date(),
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isDemoMode: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isDemo = process.env.NEXT_PUBLIC_APP_MODE !== "live";

  useEffect(() => {
    if (isDemo) {
      // In demo mode, check localStorage for "logged in" state
      const demoLoggedIn = localStorage.getItem("demo_logged_in");
      if (demoLoggedIn === "true") {
        setUser(DEMO_USER);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userDoc = await getDoc(doc(db, "users", fbUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          const newUser: User = {
            uid: fbUser.uid,
            email: fbUser.email!,
            displayName: fbUser.displayName || "Designer",
            role: "designer",
            createdAt: new Date(),
          };
          await setDoc(doc(db, "users", fbUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [isDemo]);

  const signIn = async (email: string, password: string) => {
    if (isDemo) {
      if (email === "demo@atelierinteriors.com" && password === "demo1234") {
        localStorage.setItem("demo_logged_in", "true");
        setUser(DEMO_USER);
        return;
      }
      throw new Error("In demo mode, use demo@atelierinteriors.com / demo1234");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (isDemo) {
      throw new Error("Account registration is disabled in demo mode.");
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const newUser: User = {
      uid: cred.user.uid, email, displayName: name, role: "designer", createdAt: new Date(),
    };
    await setDoc(doc(db, "users", cred.user.uid), newUser);
  };

  const signOut = async () => {
    if (isDemo) {
      localStorage.removeItem("demo_logged_in");
      setUser(null);
      return;
    }
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signIn, signUp, signOut, isDemoMode: isDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
