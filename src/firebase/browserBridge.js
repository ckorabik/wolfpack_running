import {
  getMembership,
  getUserProfile,
  observeAuth,
  signIn,
  signInGuest,
  signOutCurrentUser,
  signUp
} from "./authService.js";
import {
  createTeamForCoach,
  joinTeamWithReadOnlyCode,
  listTeamsForCoach,
  listTeamsForSignIn,
  setReadOnlyCode,
  setTeamMemberRole
} from "./functionService.js?v=20260618b";
import { getTeam } from "./teamRepository.js?v=20260618b";

globalThis.firebaseBackend = Object.assign(globalThis.firebaseBackend || {}, {
  createTeamForCoach,
  getMembership,
  getTeam,
  listTeamsForCoach,
  listTeams: listTeamsForSignIn,
  joinTeamWithReadOnlyCode,
  observeAuth,
  setReadOnlyCode,
  setTeamMemberRole,
  signIn,
  signInGuest,
  getUserProfile,
  signOutCurrentUser,
  Signup: signUp,
  signup: signUp,
  signUp,
  version: "20260618b"
});

globalThis.dispatchEvent(new CustomEvent("firebase-backend-ready"));
