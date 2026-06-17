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
  listTeamsForSignIn,
  setReadOnlyCode,
  setTeamMemberRole
} from "./functionService.js";
import { getTeam } from "./teamRepository.js";

globalThis.firebaseBackend = Object.assign(globalThis.firebaseBackend || {}, {
  createTeamForCoach,
  getMembership,
  getTeam,
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
  version: "20260617d"
});

globalThis.dispatchEvent(new CustomEvent("firebase-backend-ready"));
