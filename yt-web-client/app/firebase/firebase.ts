
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";

import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBpPHwV29AAb0f-cG7c2scBviKobA4sIas",
  authDomain: "video-platform-web.firebaseapp.com",
  projectId: "video-platform-web",
  appId: "1:151009775746:web:775609a6b8f66ffc3ea49b",
  measurementId: "G-F14JN0NVXG"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const functions = getFunctions(app);

export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
  }
  
  export function signOut() {
    return auth.signOut();
  }
  
  export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }