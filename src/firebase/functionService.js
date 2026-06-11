import { httpsCallable } from "firebase/functions";
import { functions } from "./client.js";

export async function joinTeamWithReadOnlyCode(teamId, accessCode) {
  const callable = httpsCallable(functions, "joinTeamWithReadOnlyCode");
  const result = await callable({ teamId, accessCode });
  return result.data;
}

export async function createTeamForCoach(teamSetup) {
  const callable = httpsCallable(functions, "createTeamForCoach");
  const result = await callable(teamSetup);
  return result.data;
}

export async function setTeamMemberRole({ teamId, userId, role, athleteId = null }) {
  const callable = httpsCallable(functions, "setTeamMemberRole");
  const result = await callable({ teamId, userId, role, athleteId });
  return result.data;
}

export async function setReadOnlyCode(teamId, accessCode) {
  const callable = httpsCallable(functions, "setReadOnlyCode");
  const result = await callable({ teamId, accessCode });
  return result.data;
}
