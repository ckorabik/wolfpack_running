import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(readFileSync(join(__dirname, "serviceAccountKey.example.json"), "utf8"));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const teams = {
  wolfpack: {
    name: "PACK Team Hub",
    sport: "Track and Field",
    logoText: "PACK",
    publicRead: false,
    readOnlyPassword: "Wolfpack2026"
  }
};

const branding = {
  wolfpack: {
    teamName: "PACK Team Hub",
    logoText: "PACK",
    primary: "#b3261e",
    accent: "#1e6b52",
    surface: "#f7f4ee",
    heroImage: ""
  }
};

const featureFlags = {
  wolfpack: {
    workouts: true,
    schedule: true,
    messages: true,
    resources: true,
    roster: true,
    records: true,
    coachStudio: true
  }
};

async function seed() {
  for (const [teamId, team] of Object.entries(teams)) {
    await db.doc(`teams/${teamId}`).set({
      name: team.name,
      sport: team.sport,
      logoText: team.logoText,
      publicRead: team.publicRead,
      readOnlyPasswordHash: await bcrypt.hash(team.readOnlyPassword, 12),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }, { merge: true });

    await db.doc(`teams/${teamId}/branding/current`).set(branding[teamId], { merge: true });
    await db.doc(`teams/${teamId}/featureFlags/current`).set(featureFlags[teamId], { merge: true });

    await db.doc(`teams/${teamId}/channels/all`).set({
      name: "All Team",
      audience: "Coaches, athletes, and parents",
      sortOrder: 1,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }, { merge: true });
  }
}

seed()
  .then(() => {
    console.log("Seed complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
