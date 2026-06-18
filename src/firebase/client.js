import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  serverTimestamp
} from "firebase/firestore";
import {
  connectStorageEmulator,
  getStorage
} from "firebase/storage";
import {
  connectFunctionsEmulator,
  getFunctions
} from "firebase/functions";

const firebaseConfig = globalThis.DASHBOARD_FIREBASE_CONFIG || {
  apiKey: "AIzaSyAnhPjzDy173K-chcGEv1Tg6LA8wtJ6GrM",
  authDomain: "dash-28cf9.firebaseapp.com",
  projectId: "dash-28cf9",
  storageBucket: "dash-28cf9.firebasestorage.app",
  messagingSenderId: "1042244919456",
  appId: "1:1042244919456:web:4f13a6a4fac1d1b3e6e9c5",
  measurementId: "G-KRMBGCYZ10"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const now = serverTimestamp;

if (globalThis.location?.hostname === "localhost" && globalThis.USE_FIREBASE_EMULATORS) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}
