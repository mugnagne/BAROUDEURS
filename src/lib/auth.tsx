import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AppUser extends User {
  role?: 'reader' | 'author' | 'admin';
  pseudo?: string;
  photoUrl?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, pseudo: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  updateUserProfile: (pseudo: string, photoUrl: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
  signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
  updateUserProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const docRef = doc(db, 'users', u.uid);
          const docSnap = await getDoc(docRef);
          let role: 'reader' | 'author' | 'admin' = 'reader';
          let pseudo = u.displayName || u.email?.substring(0, u.email.indexOf('@')) || 'User';
          let photoUrl = u.photoURL || '';
          
          if (u.email === 'cam.drean35@gmail.com') {
              role = 'admin';
          }

          if (docSnap.exists()) {
             role = docSnap.data().role || role;
             pseudo = docSnap.data().pseudo || pseudo;
             photoUrl = docSnap.data().photoUrl || photoUrl;
          } else {
             await setDoc(docRef, { email: u.email, role, pseudo, photoUrl });
          }

          setUser({ ...u, role, pseudo, photoUrl } as AppUser);
        } catch (e) {
          console.error("Auth context error:", e);
          setUser(u as AppUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signUpWithEmail = async (email: string, pass: string, pseudo: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: pseudo });
    await setDoc(doc(db, 'users', userCredential.user.uid), { 
      email, 
      role: email === 'cam.drean35@gmail.com' ? 'admin' : 'reader', 
      pseudo, 
      photoUrl: '' 
    });
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const updateUserProfile = async (pseudo: string, photoUrl: string) => {
    if (!auth.currentUser) return;
    
    // Firebase Auth Limits photoURL length loosely around 2048 characters. 
    // Data URLs will exceed this, so we only update Auth profile with short URLs.
    // The full base64 image will still be saved to Firestore and used by the app.
    const profileUpdates: { displayName: string; photoURL?: string } = { displayName: pseudo };
    if (!photoUrl || photoUrl.length < 2000) {
      profileUpdates.photoURL = photoUrl;
    }
    
    await updateProfile(auth.currentUser, profileUpdates);
    await updateDoc(doc(db, 'users', auth.currentUser.uid), { pseudo, photoUrl });
    if (user) {
       setUser({ ...user, pseudo, photoUrl } as AppUser);
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logOut, signUpWithEmail, signInWithEmail, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
