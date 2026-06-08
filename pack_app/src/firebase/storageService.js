import {
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";
import { storage } from "./client.js";

export async function uploadTeamLogo(teamId, file) {
  const storageRef = ref(storage, `teams/${teamId}/branding/logo-${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

export async function uploadTeamHeroImage(teamId, file) {
  const storageRef = ref(storage, `teams/${teamId}/branding/hero-${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

export async function uploadAthleteMedia(teamId, athleteId, file) {
  const storageRef = ref(storage, `teams/${teamId}/athletes/${athleteId}/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}
