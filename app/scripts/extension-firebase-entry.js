// Entry point for Chrome Extension Firebase bundle
// Exports only the modules required by extension/popup.js

export { initializeApp, getApps } from "firebase/app";
export {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
export {
  getFirestore,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
