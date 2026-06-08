import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "./client.js";
import { collections, subcollectionPath, teamPath } from "./schema.js";

function withTimestamps(data, isCreate = false) {
  return {
    ...data,
    updatedAt: serverTimestamp(),
    ...(isCreate ? { createdAt: serverTimestamp() } : {})
  };
}

function mapDoc(snapshot) {
  return { id: snapshot.id, ...snapshot.data() };
}

export async function getTeam(teamId) {
  const snapshot = await getDoc(doc(db, collections.teams, teamId));
  return snapshot.exists() ? mapDoc(snapshot) : null;
}

export async function listTeams() {
  const snapshot = await getDocs(collection(db, collections.teams));
  return snapshot.docs.map(mapDoc);
}

export async function upsertTeam(teamId, data) {
  await setDoc(doc(db, collections.teams, teamId), withTimestamps(data, true), { merge: true });
}

export function watchBranding(teamId, callback) {
  return onSnapshot(doc(db, teamPath(teamId), collections.branding, "current"), (snapshot) => {
    callback(snapshot.exists() ? mapDoc(snapshot) : null);
  });
}

export async function saveBranding(teamId, data) {
  await setDoc(doc(db, teamPath(teamId), collections.branding, "current"), withTimestamps(data, true), { merge: true });
}

export function watchFeatureFlags(teamId, callback) {
  return onSnapshot(doc(db, teamPath(teamId), collections.featureFlags, "current"), (snapshot) => {
    callback(snapshot.exists() ? mapDoc(snapshot) : null);
  });
}

export async function saveFeatureFlags(teamId, data) {
  await setDoc(doc(db, teamPath(teamId), collections.featureFlags, "current"), withTimestamps(data, true), { merge: true });
}

export function watchAnnouncements(teamId, callback) {
  const q = query(collection(db, subcollectionPath(teamId, collections.announcements)), orderBy("publishedAt", "desc"), limit(50));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(mapDoc)));
}

export async function createAnnouncement(teamId, data) {
  return addDoc(collection(db, subcollectionPath(teamId, collections.announcements)), {
    ...data,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export function watchWorkouts(teamId, callback, group = "all") {
  const base = collection(db, subcollectionPath(teamId, collections.workouts));
  const q = group === "all"
    ? query(base, orderBy("createdAt", "desc"), limit(100))
    : query(base, where("group", "==", group), orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(mapDoc)));
}

export async function createWorkout(teamId, data) {
  return addDoc(collection(db, subcollectionPath(teamId, collections.workouts)), withTimestamps(data, true));
}

export function watchEvents(teamId, callback) {
  const q = query(collection(db, subcollectionPath(teamId, collections.events)), orderBy("startsAt", "asc"), limit(100));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(mapDoc)));
}

export async function createEvent(teamId, data) {
  return addDoc(collection(db, subcollectionPath(teamId, collections.events)), withTimestamps(data, true));
}

export function watchResources(teamId, callback) {
  const q = query(collection(db, subcollectionPath(teamId, collections.resources)), orderBy("title", "asc"), limit(100));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(mapDoc)));
}

export async function createResource(teamId, data) {
  return addDoc(collection(db, subcollectionPath(teamId, collections.resources)), withTimestamps(data, true));
}

export function watchRecords(teamId, callback) {
  const q = query(collection(db, subcollectionPath(teamId, collections.records)), orderBy("division", "asc"), orderBy("event", "asc"));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(mapDoc)));
}

export async function createRecord(teamId, data) {
  return addDoc(collection(db, subcollectionPath(teamId, collections.records)), withTimestamps(data, true));
}

export function watchHistory(teamId, callback) {
  const q = query(collection(db, subcollectionPath(teamId, collections.history)), orderBy("year", "desc"), limit(100));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(mapDoc)));
}

export async function createHistoryItem(teamId, data) {
  return addDoc(collection(db, subcollectionPath(teamId, collections.history)), withTimestamps(data, true));
}

export function watchRoster(teamId, callback) {
  const q = query(collection(db, subcollectionPath(teamId, collections.roster)), orderBy("level", "asc"), orderBy("lastName", "asc"));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(mapDoc)));
}

export async function createAthlete(teamId, data) {
  return addDoc(collection(db, subcollectionPath(teamId, collections.roster)), withTimestamps(data, true));
}

export async function updateAthlete(teamId, athleteId, data) {
  await updateDoc(doc(db, subcollectionPath(teamId, collections.roster), athleteId), withTimestamps(data));
}

export async function deleteAthlete(teamId, athleteId) {
  await deleteDoc(doc(db, subcollectionPath(teamId, collections.roster), athleteId));
}

export async function saveAthletePrivateProfile(teamId, athleteId, data) {
  await setDoc(doc(db, subcollectionPath(teamId, collections.roster), athleteId, "profile", "private"), withTimestamps(data, true), { merge: true });
}

export function watchChannels(teamId, callback) {
  const q = query(collection(db, subcollectionPath(teamId, collections.channels)), orderBy("sortOrder", "asc"));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(mapDoc)));
}

export function watchMessages(teamId, channelId, callback) {
  const q = query(
    collection(db, subcollectionPath(teamId, collections.channels), channelId, collections.messages),
    orderBy("createdAt", "asc"),
    limit(200)
  );
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(mapDoc)));
}

export async function sendMessage(teamId, channelId, data) {
  return addDoc(collection(db, subcollectionPath(teamId, collections.channels), channelId, collections.messages), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}
