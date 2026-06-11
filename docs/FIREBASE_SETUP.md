# Firebase Setup

This project now has Firebase scaffolding for Auth, Firestore, Storage, Hosting, Cloud Functions, security rules, indexes, and seed data.

The current app can still run as a static local prototype. The login, read-only access, and new-coach team setup screens now call Firebase when the app is served in a browser with your Firebase config present.

## 1. Create Or Choose A Firebase Project

1. Go to the Firebase console.
2. Create a project or choose an existing one.
3. Add a Web App to the project.
4. Copy the Firebase web config object.

Firebase's Web SDK setup uses `initializeApp(firebaseConfig)`, and Firestore/Auth/Storage are initialized from that app. The scaffolded files follow that modular SDK pattern from Firebase's official docs.

## 2. Install Local Tooling

From `wolfpack_running`:

```bash
npm install
npm install -g firebase-tools
firebase login
```

If you prefer not to install the CLI globally, run commands with `npx firebase`.

## 3. Link This Folder To Your Firebase Project

Copy the example project file:

```bash
cp .firebaserc.example .firebaserc
```

Edit `.firebaserc`:

```json
{
  "projects": {
    "default": "your-real-firebase-project-id"
  }
}
```

## 4. Add Your Firebase Web Config

Copy:

```bash
cp src/firebase/firebaseConfig.example.js src/firebase/firebaseConfig.js
```

Replace the placeholder values in `src/firebase/firebaseConfig.js` with the config from your Firebase Web App.

Do not commit `src/firebase/firebaseConfig.js`. It is ignored because it is environment-specific. Firebase web config is not a server secret, but keeping environment files local prevents accidental project mixups.

## 5. Enable Firebase Products

In the Firebase console, enable:

- Authentication
- Cloud Firestore
- Cloud Storage
- Cloud Functions
- Hosting, if you want Firebase to host this static app

For Authentication, enable:

- Email/Password, for coach accounts and future athlete/parent accounts
- Anonymous, for the read-only team-code flow

## 6. Deploy Firestore Rules, Storage Rules, And Indexes

The scaffold includes:

- `firebase/firestore.rules`
- `firebase/storage.rules`
- `firebase/firestore.indexes.json`
- `firebase.json`

Deploy rules, indexes, and functions:

```bash
npm run firebase:deploy:rules
npm run firebase:deploy:indexes
npm run firebase:deploy:functions
```

Firebase docs note that Firestore security rules use `request.auth.uid` for signed-in users, and role-based access is commonly modeled by reading role data from Firestore documents. This project uses `/teams/{teamId}/memberships/{userId}` for that boundary.

The read-only team password flow goes through the callable Cloud Function `joinTeamWithReadOnlyCode`. That function validates the code against a bcrypt hash and creates a `viewer` membership. The browser is not the real security boundary.

The new-coach setup flow goes through the callable Cloud Function `createTeamForCoach`. That function creates the team document, starter branding, feature flags, default channels, a welcome announcement, and the creator's `headCoach` membership in one trusted backend step.

## 7. Firestore Data Model

The intended tenant structure is:

```text
/users/{userId}
/teams/{teamId}
/teams/{teamId}/memberships/{userId}
/teams/{teamId}/branding/current
/teams/{teamId}/featureFlags/current
/teams/{teamId}/announcements/{announcementId}
/teams/{teamId}/workouts/{workoutId}
/teams/{teamId}/events/{eventId}
/teams/{teamId}/resources/{resourceId}
/teams/{teamId}/records/{recordId}
/teams/{teamId}/history/{historyId}
/teams/{teamId}/roster/{athleteId}
/teams/{teamId}/roster/{athleteId}/profile/private
/teams/{teamId}/channels/{channelId}
/teams/{teamId}/channels/{channelId}/messages/{messageId}
```

Every team has isolated data under `/teams/{teamId}`. Membership documents define the user's role for that specific team.

## 8. Roles And Permissions

Suggested membership document:

```json
{
  "role": "headCoach",
  "athleteId": null,
  "createdAt": "server timestamp",
  "updatedAt": "server timestamp"
}
```

Supported roles:

- `viewer`
- `athlete`
- `parent`
- `coach`
- `headCoach`

Important backend boundaries:

- Coaches can manage announcements, workouts, schedule, resources, branding, and roster.
- Only head coaches can update records/history.
- Only head coaches can assign roster levels.
- Viewers can read team data but cannot send messages or mutate team content.
- Athletes can update their own private profile if their roster document points to their Auth UID.

## 9. Optional Seed Data

For first setup, create a real Admin SDK service account JSON in Firebase console:

1. Project settings
2. Service accounts
3. Generate new private key
4. Save it as `scripts/serviceAccountKey.json`

Never commit that real key.

Then copy your real key into the ignored local file:

```bash
cp scripts/serviceAccountKey.example.json scripts/serviceAccountKey.json
```

Then run:

```bash
npm run seed:firestore
```

The seed creates the required Firestore collections and starter documents for the Wolfpack workspace: team shell, hashed read-only access code, branding, feature flags, announcements, workouts, schedule events, resources, records, history, roster, channels, and starter messages.

To create the first head coach membership at the same time, provide the Firebase Auth UID:

```bash
HEAD_COACH_UID=your-auth-uid npm run seed:firestore
```

In PowerShell:

```powershell
$env:HEAD_COACH_UID="your-auth-uid"
npm run seed:firestore
```

To make your first admin user, create a Firebase Auth user, then manually add this document in Firestore:

```text
/teams/{teamId}/memberships/{userUid}
```

```json
{
  "role": "headCoach",
  "athleteId": null
}
```

After that, the `setTeamMemberRole` callable can manage future membership changes.

## 10. Current UI Firebase Wiring

The Firebase client layer lives in:

- `src/firebase/client.js`
- `src/firebase/authService.js`
- `src/firebase/teamRepository.js`
- `src/firebase/storageService.js`
- `src/firebase/functionService.js`
- `src/firebase/browserBridge.js`

The current `index.html` loads Firebase through an import map and exposes a small `window.firebaseBackend` bridge for the existing non-module `app.js`.

Already wired:

- New coach account creation with Firebase Auth
- New team workspace creation through `createTeamForCoach`
- Login with Firebase Auth plus team membership lookup
- Read-only dashboard access through anonymous auth and `joinTeamWithReadOnlyCode`

Still to replace in later passes:

- `getBranding/saveBranding` -> `watchBranding/saveBranding`
- `loadTeamData/persistTeamData` -> `watchAnnouncements`, `watchRoster`, `watchRecords`, etc.
- message sends -> `sendMessage`
- athlete customization -> `saveAthletePrivateProfile` or `updateAthlete`

Keep all writes going through the repository functions so permissions stay aligned with Firestore rules.

## 11. Test Locally With Emulators

Start emulators:

```bash
npm run firebase:emulators
```

The scaffolded `src/firebase/client.js` connects to emulators only when both are true:

- app is running on `localhost`
- `globalThis.USE_FIREBASE_EMULATORS` is truthy

The functions emulator is also connected by the scaffold when emulator mode is enabled.

For quick testing, set this before importing Firebase modules in your dev entrypoint:

```js
globalThis.USE_FIREBASE_EMULATORS = true;
```

## 12. Deploy Hosting

After you are ready to host the static app:

```bash
npm run firebase:deploy:hosting
```

The `firebase.json` hosting config points at the current folder as the public directory and ignores backend scaffolding files.

## Notes From Firebase Docs

- Firestore Security Rules are the correct place to enforce client access for web/mobile SDKs.
- Callable Functions are a good fit for trusted server-side actions like validating a read-only team code or changing member roles.
- Server/Admin SDKs bypass Security Rules, so protect Admin scripts with IAM and never expose service account keys.
- Firestore indexes can be deployed from `firestore.indexes.json`; Firebase will also provide direct index creation links when a query needs a missing composite index.

Official docs used while shaping this scaffold:

- Firebase Web SDK setup: https://firebase.google.com/docs/web/setup
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started
- Callable Cloud Functions: https://firebase.google.com/docs/functions/callable
