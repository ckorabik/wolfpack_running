import {
  getMembership,
  observeAuth,
  signIn,
  signInGuest,
  signOutCurrentUser,
  signUp
} from "./authService.js";
import {
  createTeamForCoach,
  joinTeamWithReadOnlyCode,
  setReadOnlyCode,
  setTeamMemberRole
} from "./functionService.js";

globalThis.firebaseBackend = {
  createTeamForCoach,
  getMembership,
  joinTeamWithReadOnlyCode,
  observeAuth,
  setReadOnlyCode,
  setTeamMemberRole,
  signIn,
  signInGuest,
  signOutCurrentUser,
  signup: signUp,
  signUp
};

globalThis.dispatchEvent(new CustomEvent("firebase-backend-ready"));
