import bcrypt from "bcryptjs";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";

initializeApp();

const db = getFirestore();
const allowedRoles = new Set(["viewer", "athlete", "parent", "coach", "headCoach"]);

function assertSignedIn(request) {
  if (!request.auth) {
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

export const joinTeamWithReadOnlyCode = onCall(async (request) => {
  assertSignedIn(request);
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
  assertSignedIn(request);
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
  assertSignedIn(request);
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
