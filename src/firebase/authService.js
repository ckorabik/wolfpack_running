import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import {
  doc,
  getDoc
} from "firebase/firestore";
import { auth, db } from "./client.js";

export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signInGuest() {
  const credential = await signInAnonymously(auth);
  return credential.user;
}

export async function signUp({ email, password, name }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  return credential.user;
}

export async function signOutCurrentUser() {
  await signOut(auth);
}

export async function getMembership(teamId, userId) {
  const snapshot = await getDoc(doc(db, "teams", teamId, "memberships", userId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function getUserProfile(userId) {
  const snapshot = await getDoc(doc(db, "users", userId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}
