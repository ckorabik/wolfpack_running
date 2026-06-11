import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || (existsSync(join(__dirname, "serviceAccountKey.json"))
    ? join(__dirname, "serviceAccountKey.json")
    : join(__dirname, "..", "dash-28cf9-firebase-adminsdk-fbsvc-dc0856aa38.json"));
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const now = () => Timestamp.now();

const teamId = "wolfpack";
const headCoachUid = process.env.HEAD_COACH_UID || "";

const team = {
  name: "PACK Team Hub",
  sport: "Track and Field",
  logoText: "PACK",
  publicRead: false,
  readOnlyPassword: "Wolfpack2026"
};

const branding = {
  teamName: "PACK Team Hub",
  logoText: "PACK",
  primary: "#b3261e",
  accent: "#1e6b52",
  surface: "#f7f4ee",
  heroImage: ""
};

const featureFlags = {
  workouts: true,
  schedule: true,
  messages: true,
  resources: true,
  roster: true,
  records: true,
  coachStudio: true
};

const announcements = [
  {
    title: "Uniform check on Thursday",
    body: "Bring both singlets and warmups to practice. Coaches will confirm meet-day kits before strides.",
    authorName: "Coach Rivera"
  },
  {
    title: "Parent volunteer slots are open",
    body: "We still need two lane timers and one snack table helper for the Friday invite.",
    authorName: "Booster Club"
  }
];

const workouts = [
  {
    group: "sprints",
    title: "Acceleration + handoffs",
    focus: "Starts, drive phase, 4x100 exchanges",
    details: ["6 x 30m", "4 x flying 20m", "Relay zones"],
    coachName: "Coach Rivera"
  },
  {
    group: "distance",
    title: "Controlled tempo intervals",
    focus: "Threshold rhythm without racing practice",
    details: ["12 min warmup", "5 x 1k", "200m jog"],
    coachName: "Coach Owens"
  }
];

const events = [
  {
    startsAt: Timestamp.fromDate(new Date("2026-06-08T15:30:00-05:00")),
    title: "Practice",
    detail: "Track warmup, event groups after drills",
    type: "Practice"
  },
  {
    startsAt: Timestamp.fromDate(new Date("2026-06-12T17:00:00-05:00")),
    title: "Friday Night Invite",
    detail: "Bus loads at 2:45 PM from the athletic entrance",
    type: "Meet"
  }
];

const resources = [
  {
    title: "Meet day packing list",
    kind: "Checklist",
    body: "Uniform, spikes, water bottle, warmups, recovery snack, and school ID."
  },
  {
    title: "Travel release form",
    kind: "Form",
    body: "Required when an athlete leaves a meet with a parent or guardian."
  }
];

const records = [
  {
    event: "100m",
    mark: "10.84",
    athlete: "Andre Bell",
    year: "2024",
    division: "Boys Varsity"
  },
  {
    event: "1600m",
    mark: "4:17.36",
    athlete: "Eli Turner",
    year: "2025",
    division: "Boys Varsity"
  }
];

const history = [
  {
    year: "2026",
    title: "Team hub launched",
    body: "The program moved workouts, meet logistics, and team messages into one shared dashboard."
  },
  {
    year: "2025",
    title: "Distance double at sectionals",
    body: "The team won both 1600m races and qualified seven athletes for state."
  }
];

const roster = [
  {
    firstName: "Maya",
    lastName: "Patel",
    name: "Maya Patel",
    group: "Distance",
    grade: "12",
    level: "Varsity",
    bio: "Varsity distance runner and team captain.",
    goal: "Break 5:05 in the 1600m",
    color: "#1e6b52",
    userId: null
  },
  {
    firstName: "Andre",
    lastName: "Bell",
    name: "Andre Bell",
    group: "Sprints",
    grade: "11",
    level: "Varsity",
    bio: "Sprinter focused on the 100m and 4x100 relay.",
    goal: "Own the final 30 meters",
    color: "#b3261e",
    userId: null
  }
];

const channels = [
  {
    id: "all",
    name: "All Team",
    audience: "Coaches, athletes, and parents",
    sortOrder: 1,
    messages: [
      {
        fromName: "Coach Rivera",
        body: "Great work at practice today. Meet entries will be posted tomorrow morning."
      }
    ]
  },
  {
    id: "parents",
    name: "Parents",
    audience: "Family logistics",
    sortOrder: 2,
    messages: []
  },
  {
    id: "captains",
    name: "Captains",
    audience: "Team leaders and coaches",
    sortOrder: 3,
    messages: []
  }
];

async function setCollection(basePath, docs, idField = null) {
  const batch = db.batch();
  docs.forEach((item) => {
    const id = idField ? item[idField] : undefined;
    const ref = id ? db.doc(`${basePath}/${id}`) : db.collection(basePath).doc();
    const { [idField]: omitted, ...data } = item;
    batch.set(ref, {
      ...data,
      createdAt: now(),
      updatedAt: now()
    }, { merge: true });
  });
  await batch.commit();
}

async function seed() {
  await db.doc(`teams/${teamId}`).set({
    name: team.name,
    sport: team.sport,
    logoText: team.logoText,
    publicRead: team.publicRead,
    readOnlyPasswordHash: await bcrypt.hash(team.readOnlyPassword, 12),
    createdAt: now(),
    updatedAt: now()
  }, { merge: true });

  await db.doc(`teams/${teamId}/branding/current`).set({
    ...branding,
    updatedAt: now()
  }, { merge: true });

  await db.doc(`teams/${teamId}/featureFlags/current`).set({
    ...featureFlags,
    updatedAt: now()
  }, { merge: true });

  if (headCoachUid) {
    await db.doc(`teams/${teamId}/memberships/${headCoachUid}`).set({
      role: "headCoach",
      athleteId: null,
      createdAt: now(),
      updatedAt: now()
    }, { merge: true });
  }

  await setCollection(`teams/${teamId}/announcements`, announcements.map((item) => ({
    ...item,
    publishedAt: now()
  })));
  await setCollection(`teams/${teamId}/workouts`, workouts);
  await setCollection(`teams/${teamId}/events`, events);
  await setCollection(`teams/${teamId}/resources`, resources);
  await setCollection(`teams/${teamId}/records`, records);
  await setCollection(`teams/${teamId}/history`, history);
  await setCollection(`teams/${teamId}/roster`, roster);

  for (const channel of channels) {
    const { messages, ...channelData } = channel;
    await db.doc(`teams/${teamId}/channels/${channel.id}`).set({
      ...channelData,
      createdAt: now(),
      updatedAt: now()
    }, { merge: true });

    await setCollection(`teams/${teamId}/channels/${channel.id}/messages`, messages.map((message) => ({
      ...message,
      userId: null,
      createdAt: now()
    })));
  }
}

seed()
  .then(() => {
    console.log(`Seed complete for team: ${teamId}`);
    if (!headCoachUid) {
      console.log("No HEAD_COACH_UID provided, so no initial head coach membership was created.");
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
