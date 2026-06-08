export const roles = {
  athlete: "athlete",
  parent: "parent",
  coach: "coach",
  headCoach: "headCoach"
};

export const levels = ["Varsity", "Junior Varsity", "Freshman", "Unassigned"];

export const collections = {
  users: "users",
  teams: "teams",
  memberships: "memberships",
  branding: "branding",
  featureFlags: "featureFlags",
  announcements: "announcements",
  workouts: "workouts",
  events: "events",
  resources: "resources",
  roster: "roster",
  records: "records",
  history: "history",
  channels: "channels",
  messages: "messages"
};

export function teamPath(teamId) {
  return `${collections.teams}/${teamId}`;
}

export function subcollectionPath(teamId, collectionName) {
  return `${teamPath(teamId)}/${collectionName}`;
}
