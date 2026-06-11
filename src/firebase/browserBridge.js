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

globalThis.firebaseBackend = Object.assign(globalThis.firebaseBackend || {}, {
  createTeamForCoach,
  getMembership,
  joinTeamWithReadOnlyCode,
  observeAuth,
  setReadOnlyCode,
  setTeamMemberRole,
  signIn,
  signInGuest,
  signOutCurrentUser,
  Signup: signUp,
  signup: signUp,
  signUp,
  version: "20260611c"
});

globalThis.dispatchEvent(new CustomEvent("firebase-backend-ready"));
