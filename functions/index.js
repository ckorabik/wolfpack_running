import bcrypt from "bcryptjs";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";

initializeApp();

const db = getFirestore();
const allowedRoles = new Set(["viewer", "athlete", "parent", "coach", "headCoach"]);
const defaultFeatures = {
  workouts: true,
  schedule: true,
  messages: true,
  resources: true,
  roster: true,
  records: true,
  coachStudio: true
};

function cleanText(value, fallback = "") {
  return String(value || fallback).trim();
}

function cleanSlug(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
}

function cleanHex(value, fallback) {
  const text = cleanText(value);
  return /^#[0-9a-f]{6}$/i.test(text) ? text : fallback;
}

function assertSignedIn(auth) {
  if (!auth) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }
}

async function getRole(teamId, uid) {
  const snapshot = await db.doc(`teams/${teamId}/memberships/${uid}`).get();
  return snapshot.exists ? snapshot.data().role : null;
}

async function assertHeadCoach(teamId, uid) {
  const role = await getRole(teamId, uid);
  if (role !== "headCoach") {
    throw new HttpsError("permission-denied", "Only the head coach can do this.");
  }
}

export const listTeamsForSignIn = onCall(async () => {
  const snapshot = await db.collection("teams").orderBy("name").limit(100).get();
  return {
    teams: snapshot.docs.map((teamDoc) => {
      const team = teamDoc.data();
      return {
        id: teamDoc.id,
        name: cleanText(team.name, teamDoc.id),
        sport: cleanText(team.sport, "Track and Field"),
        logoText: cleanText(team.logoText, team.name?.slice(0, 4) || "TEAM").slice(0, 12).toUpperCase()
      };
    })
  };
});

async function createTeamForCoachSetup(auth, data = {}) {
  assertSignedIn(auth);
  const {
    coachName: submittedCoachName,
    coachEmail: submittedCoachEmail,
    teamName,
    sport = "Track and Field",
    logoText,
    accessCode,
    branding = {}
  } = data;

  const name = cleanText(teamName);
  if (name.length < 3) {
    throw new HttpsError("invalid-argument", "Team name must be at least 3 characters.");
  }

  if (!accessCode || String(accessCode).length < 8) {
    throw new HttpsError("invalid-argument", "Read-only access code must be at least 8 characters.");
  }

  const baseSlug = cleanSlug(name);
  if (!baseSlug) {
    throw new HttpsError("invalid-argument", "Team name must include letters or numbers.");
  }

  let teamId = baseSlug;
  let teamRef = db.doc(`teams/${teamId}`);
  let teamSnapshot = await teamRef.get();
  if (teamSnapshot.exists) {
    teamId = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;
    teamRef = db.doc(`teams/${teamId}`);
    teamSnapshot = await teamRef.get();
  }

  if (teamSnapshot.exists) {
    throw new HttpsError("already-exists", "A team workspace with that name already exists. Try a more specific team name.");
  }

  const now = FieldValue.serverTimestamp();
  const readOnlyPasswordHash = await bcrypt.hash(String(accessCode), 12);
  const coachName = cleanText(submittedCoachName || auth.token.name, "Head Coach");
  const coachEmail = cleanText(submittedCoachEmail || auth.token.email);
  const safeBranding = {
    teamName: name,
    logoText: cleanText(logoText, name.slice(0, 4)).slice(0, 12).toUpperCase(),
    primary: cleanHex(branding.primary, "#b3261e"),
    accent: cleanHex(branding.accent, "#1e6b52"),
    surface: cleanHex(branding.surface, "#f7f4ee"),
    heroImage: cleanText(branding.heroImage)
  };

  const batch = db.batch();

  batch.set(teamRef, {
    name,
    sport: cleanText(sport, "Track and Field"),
    logoText: safeBranding.logoText,
    publicRead: false,
    readOnlyPasswordHash,
    ownerUid: auth.uid,
    createdAt: now,
    updatedAt: now
  });

  batch.set(db.doc(`teams/${teamId}/branding/current`), {
    ...safeBranding,
    updatedAt: now
  });

  batch.set(db.doc(`teams/${teamId}/featureFlags/current`), {
    ...defaultFeatures,
    updatedAt: now
  });

  batch.set(db.doc(`teams/${teamId}/memberships/${auth.uid}`), {
    role: "headCoach",
    athleteId: null,
    displayName: coachName,
    email: coachEmail,
    createdAt: now,
    updatedAt: now
  });

  batch.set(db.doc(`teams/${teamId}/announcements/welcome`), {
    title: "Welcome to your dashboard",
    body: "Use Coach Studio to tune your branding, roster, records, and communication tools.",
    author: coachName,
    createdAt: now,
    updatedAt: now
  });

  batch.set(db.doc(`teams/${teamId}/channels/all`), {
    name: "All Team",
    audience: "Coaches, athletes, and parents",
    createdAt: now,
    updatedAt: now
  });

  batch.set(db.doc(`teams/${teamId}/channels/parents`), {
    name: "Parents",
    audience: "Family logistics",
    createdAt: now,
    updatedAt: now
  });

  batch.set(db.doc(`teams/${teamId}/channels/captains`), {
    name: "Captains",
    audience: "Team leaders and coaches",
    createdAt: now,
    updatedAt: now
  });

  batch.set(db.doc(`users/${auth.uid}`), {
    name: coachName,
    email: coachEmail,
    defaultTeamId: teamId,
    teamIds: FieldValue.arrayUnion(teamId),
    createdAt: now,
    updatedAt: now
  }, { merge: true });

  await batch.commit();

  return {
    teamId,
    role: "headCoach",
    team: {
      id: teamId,
      name,
      sport: cleanText(sport, "Track and Field"),
      logoText: safeBranding.logoText,
      features: defaultFeatures,
      branding: safeBranding
    }
  };
}

export const createTeamForCoach = onCall(async (request) => {
  return createTeamForCoachSetup(request.auth, request.data || {});
});

export const createTeamForCoachHttp = onRequest(async (request, response) => {
  const allowedOrigins = new Set([
    "https://dash-28cf9.web.app",
    "https://dash-28cf9.firebaseapp.com",
    "http://localhost:5000",
    "http://127.0.0.1:5000"
  ]);
  const origin = request.get("origin");
  if (allowedOrigins.has(origin)) {
    response.set("Access-Control-Allow-Origin", origin);
  }
  response.set("Vary", "Origin");
  response.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ error: { message: "Method not allowed." } });
    return;
  }

  try {
    const token = String(request.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (!token) {
      throw new HttpsError("unauthenticated", "You must be signed in.");
    }
    const decoded = await getAuth().verifyIdToken(token);
    const result = await createTeamForCoachSetup({ uid: decoded.uid, token: decoded }, request.body?.data || {});
    response.json({ result });
  } catch (error) {
    const status = error instanceof HttpsError ? error.httpErrorCode?.status || 500 : 500;
    response.status(status).json({
      error: {
        status: error.code || "internal",
        message: error.message || "Could not create that team yet."
      }
    });
  }
});

export const joinTeamWithReadOnlyCode = onCall(async (request) => {
  assertSignedIn(request.auth);
  const { teamId, accessCode } = request.data || {};

  if (!teamId || !accessCode) {
    throw new HttpsError("invalid-argument", "teamId and accessCode are required.");
  }

  const teamRef = db.doc(`teams/${teamId}`);
  const teamSnapshot = await teamRef.get();

  if (!teamSnapshot.exists) {
    throw new HttpsError("not-found", "Team not found.");
  }

  const { readOnlyPasswordHash } = teamSnapshot.data();
  if (!readOnlyPasswordHash) {
    throw new HttpsError("failed-precondition", "This team has not configured read-only access.");
  }

  const ok = await bcrypt.compare(accessCode, readOnlyPasswordHash);
  if (!ok) {
    throw new HttpsError("permission-denied", "Invalid team access code.");
  }

  await db.doc(`teams/${teamId}/memberships/${request.auth.uid}`).set({
    role: "viewer",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });

  return { teamId, role: "viewer" };
});

export const setTeamMemberRole = onCall(async (request) => {
  assertSignedIn(request.auth);
  const { teamId, userId, role, athleteId = null } = request.data || {};

  if (!teamId || !userId || !allowedRoles.has(role)) {
    throw new HttpsError("invalid-argument", "teamId, userId, and a valid role are required.");
  }

  await assertHeadCoach(teamId, request.auth.uid);

  await db.doc(`teams/${teamId}/memberships/${userId}`).set({
    role,
    athleteId,
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });

  return { teamId, userId, role };
});

export const setReadOnlyCode = onCall(async (request) => {
  assertSignedIn(request.auth);
  const { teamId, accessCode } = request.data || {};

  if (!teamId || !accessCode || accessCode.length < 8) {
    throw new HttpsError("invalid-argument", "A teamId and access code of at least 8 characters are required.");
  }

  await assertHeadCoach(teamId, request.auth.uid);

  const readOnlyPasswordHash = await bcrypt.hash(accessCode, 12);
  await db.doc(`teams/${teamId}`).set({
    readOnlyPasswordHash,
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });

  return { teamId };
});
