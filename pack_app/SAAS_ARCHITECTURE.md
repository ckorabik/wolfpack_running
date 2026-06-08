# Multi-Team SaaS Prototype Architecture

This app is still a static browser prototype, but it is organized around a SaaS-style tenant model and now has Firebase scaffolding for the real backend.

## Shared Codebase

The UI, routing, rendering, authentication flow, permissions, and feature handling live in the shared files:

- `index.html`
- `styles.css`
- `app.js`

No team-specific pages or custom forks are needed for each team.

## Team Tenants

Teams are configured in `tenantCatalog` inside `app.js`. Each tenant has:

- `id`
- display name
- sport label
- logo text
- read-only access password
- feature flags
- default branding

Team content defaults live in `tenantDataDefaults`. The active team is selected at login and stored on the session.

## Data Boundaries

In the prototype, browser storage is scoped by team ID:

- Users: `packUsers:{teamId}`
- Branding: `packBranding:{teamId}`
- Team data: `packTeamData:{teamId}`

In Firebase, the same separation is represented by `/teams/{teamId}/...` subcollections. This keeps roster, records, messages, workouts, resources, and branding separate between teams.

## Feature Flags

Tenant features are toggled with the `features` object in `tenantCatalog`. UI elements can opt into a feature with:

```html
data-feature="records"
```

The shared `applyFeatureFlags()` function hides disabled modules and prevents direct navigation to disabled views.

## Security Model

Prototype permissions are centralized in `roleCapabilities`, while production permissions are enforced in `firebase/firestore.rules` and callable functions:

- `viewer`
- `athlete`
- `parent`
- `coach`
- `headCoach`

Sensitive actions call capability helpers instead of checking scattered role strings. Firebase Security Rules and Cloud Functions are the real boundary for production because client-side JavaScript is not a security boundary.

## Production Direction

The Firebase backend shape is:

- `teams`
- `team_memberships`
- `users`
- `rosters`
- `athlete_profiles`
- `records`
- `messages`
- `events`
- `resources`
- `team_branding`
- `feature_flags`
- callable functions for read-only access codes and membership management

Every backend query should be scoped by `team_id`, and every mutation should verify the signed-in user's membership and role for that team.
