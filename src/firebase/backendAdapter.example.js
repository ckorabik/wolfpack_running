import {
  createAnnouncement,
  createAthlete,
  createEvent,
  createHistoryItem,
  createRecord,
  createResource,
  createWorkout,
  deleteAthlete,
  saveAthletePrivateProfile,
  saveBranding,
  sendMessage,
  updateAthlete,
  watchAnnouncements,
  watchBranding,
  watchChannels,
  watchEvents,
  watchFeatureFlags,
  watchHistory,
  watchMessages,
  watchRecords,
  watchResources,
  watchRoster,
  watchWorkouts
} from "./teamRepository.js";

export function connectTeamData(teamId, handlers) {
  const unsubscribers = [
    watchBranding(teamId, handlers.onBranding),
    watchFeatureFlags(teamId, handlers.onFeatureFlags),
    watchAnnouncements(teamId, handlers.onAnnouncements),
    watchWorkouts(teamId, handlers.onWorkouts),
    watchEvents(teamId, handlers.onEvents),
    watchResources(teamId, handlers.onResources),
    watchRoster(teamId, handlers.onRoster),
    watchRecords(teamId, handlers.onRecords),
    watchHistory(teamId, handlers.onHistory),
    watchChannels(teamId, handlers.onChannels)
  ].filter(Boolean);

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}

export const backend = {
  createAnnouncement,
  createAthlete,
  createEvent,
  createHistoryItem,
  createRecord,
  createResource,
  createWorkout,
  deleteAthlete,
  saveAthletePrivateProfile,
  saveBranding,
  sendMessage,
  updateAthlete,
  watchMessages
};
