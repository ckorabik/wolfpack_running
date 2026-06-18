const state = {
  session: null,
  teamId: "",
  features: {},
  role: "athlete",
  view: "home",
  workoutFilter: "all",
  activeChannel: "all",
  activeAthleteIndex: 0,
  announcements: [],
  workouts: [],
  events: [],
  resources: [],
  records: [],
  history: [],
  roster: [],
  channels: []
};

const defaultFeatures = {
  workouts: true,
  schedule: true,
  messages: true,
  resources: true,
  roster: true,
  records: true,
  coachStudio: true
};

const tenantCatalog = {};
const tenantDataDefaults = {};

const sessionStorageKey = "packSession";
const signupDraftStorageKey = "dashboardSignupDraft";
const firebaseApiKey = "AIzaSyAnhPjzDy173K-chcGEv1Tg6LA8wtJ6GrM";
const teamListEndpoint = "https://us-central1-dash-28cf9.cloudfunctions.net/listTeamsForSignIn";
const createTeamEndpoint = "https://us-central1-dash-28cf9.cloudfunctions.net/createTeamForCoachHttp";
const signUpEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`;
const updateProfileEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${firebaseApiKey}`;

const featureCatalog = [
  {
    key: "workouts",
    name: "Workout Hub",
    description: "Publish training plans by event group."
  },
  {
    key: "schedule",
    name: "Scheduler",
    description: "Share practices, meets, meetings, and team jobs."
  },
  {
    key: "messages",
    name: "Messages",
    description: "Keep team channels and announcements available."
  },
  {
    key: "resources",
    name: "Resources",
    description: "Collect forms, packing lists, links, and team files."
  },
  {
    key: "roster",
    name: "Roster",
    description: "Show athlete profiles grouped by level."
  },
  {
    key: "records",
    name: "Records and History",
    description: "Display school records and program milestones."
  }
];

const brandingDefaults = {
  teamName: "Dashboard",
  logoText: "DASH",
  primary: "#b3261e",
  accent: "#1e6b52",
  surface: "#f7f4ee",
  heroImage: ""
};

const signupDraftFields = [
  "signupNameInput",
  "signupEmailInput",
  "signupPasswordInput",
  "signupTeamNameInput",
  "signupSportInput",
  "signupLogoTextInput",
  "signupAccessCodeInput",
  "signupPrimaryInput",
  "signupAccentInput",
  "signupSurfaceInput"
];

const pageTitles = {
  home: "Home",
  workouts: "Workout Hub",
  schedule: "Scheduler",
  messages: "Messages",
  resources: "Resources",
  roster: "Roster",
  athlete: "Athlete Page",
  records: "Records and History",
  coach: "Coach Studio",
  coachTools: "Coach Tools"
};

const roleCapabilities = {
  viewer: [],
  athlete: ["message", "editOwnProfile"],
  parent: ["message"],
  coach: ["message", "coachStudio", "manageFeatures", "manageAnnouncements", "manageWorkouts", "manageSchedule", "manageResources", "manageRoster", "manageBranding"],
  headCoach: ["message", "coachStudio", "manageFeatures", "manageAnnouncements", "manageWorkouts", "manageSchedule", "manageResources", "manageRoster", "manageBranding", "manageRecords", "assignLevels"]
};

const roleSelect = document.querySelector("#roleSelect");
const teamSelect = document.querySelector("#teamSelect");
const teamSearchInput = document.querySelector("#teamSearchInput");
const teamOptions = document.querySelector("#teamOptions");
const teamPickerStatus = document.querySelector("#teamPickerStatus");
const sidebar = document.querySelector(".sidebar");
const mobileMenuButton = document.querySelector("#mobileMenuButton");
const appShell = document.querySelector("#appShell");
const authScreen = document.querySelector("#authScreen");
const authError = document.querySelector("#authError");
const authStatus = document.querySelector("#authStatus");
const readonlyForm = document.querySelector("#readonlyForm");
const loginForm = document.querySelector("#loginForm");
const signupForm = document.querySelector("#signupForm");
const sessionNote = document.querySelector("#sessionNote");
const tenantNote = document.querySelector("#tenantNote");
const logoutButton = document.querySelector("#logoutButton");
const todayDate = document.querySelector("#todayDate");
const announcementList = document.querySelector("#announcementList");
const workoutGrid = document.querySelector("#workoutGrid");
const calendarStrip = document.querySelector("#calendarStrip");
const eventTimeline = document.querySelector("#eventTimeline");
const resourceGrid = document.querySelector("#resourceGrid");
const levelRoster = document.querySelector("#levelRoster");
const athletePageName = document.querySelector("#athletePageName");
const athletePageLevel = document.querySelector("#athletePageLevel");
const athletePageEvent = document.querySelector("#athletePageEvent");
const athletePageBio = document.querySelector("#athletePageBio");
const athletePageGrade = document.querySelector("#athletePageGrade");
const athletePageGoal = document.querySelector("#athletePageGoal");
const athleteHero = document.querySelector("#athleteHero");
const athleteProfileForm = document.querySelector("#athleteProfileForm");
const recordList = document.querySelector("#recordList");
const historyList = document.querySelector("#historyList");
const rosterForm = document.querySelector("#rosterForm");
const rosterList = document.querySelector("#rosterList");
const toolCatalog = document.querySelector("#toolCatalog");
const channelList = document.querySelector("#channelList");
const chatLog = document.querySelector("#chatLog");
const activeChannelName = document.querySelector("#activeChannelName");
const activeChannelAudience = document.querySelector("#activeChannelAudience");
const messageForm = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");
const composeDialog = document.querySelector("#composeDialog");
const composeForm = document.querySelector("#composeForm");
const brandingForm = document.querySelector("#brandingForm");
const authForms = [readonlyForm, loginForm, signupForm];
const firebaseReadyChecks = {
  readonly: (backend) => (
    typeof backend?.signInGuest === "function"
    && typeof backend?.joinTeamWithReadOnlyCode === "function"
  ),
  login: (backend) => (
    typeof backend?.signIn === "function"
    && typeof backend?.getMembership === "function"
  ),
  signup: (backend) => (
    getFirebaseSignup(backend)
    && typeof backend?.createTeamForCoach === "function"
  )
};
let firebaseLoadTimedOut = false;
let teamsLoadedFromFirebase = false;
let firebaseBackendLoadError = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function cloneTeamData(source) {
  return clone({
    announcements: source.announcements,
    workouts: source.workouts,
    events: source.events,
    resources: source.resources,
    records: source.records,
    history: source.history,
    roster: source.roster,
    channels: source.channels
  });
}

function emptyTeamData(coachName = "Head Coach") {
  return {
    announcements: [
      {
        title: "Welcome to your dashboard",
        body: "Use Coach Studio to tune your branding, roster, records, and communication tools.",
        author: coachName,
        time: "Just now"
      }
    ],
    workouts: [],
    events: [],
    resources: [],
    records: [],
    history: [],
    roster: [],
    channels: [
      {
        id: "all",
        name: "All Team",
        audience: "Coaches, athletes, and parents",
        messages: []
      },
      {
        id: "parents",
        name: "Parents",
        audience: "Family logistics",
        messages: []
      },
      {
        id: "captains",
        name: "Captains",
        audience: "Team leaders and coaches",
        messages: []
      }
    ]
  };
}

function currentTenant() {
  return tenantCatalog[state.teamId] || {
    id: "",
    name: brandingDefaults.teamName,
    sport: "Track and Field",
    logoText: brandingDefaults.logoText,
    features: defaultFeatures,
    branding: brandingDefaults
  };
}

function teamSearchLabel(tenant) {
  return [tenant.name, tenant.sport].filter(Boolean).join(" - ");
}

function firebaseBackend() {
  return window.firebaseBackend || null;
}

function waitForFirebaseBackend(isReady, timeoutMs = 8000) {
  const readyBackend = firebaseBackend();
  if (isReady(readyBackend)) {
    return Promise.resolve(readyBackend);
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = (backend) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      window.removeEventListener("firebase-backend-ready", checkBackend);
      resolve(backend);
    };
    const checkBackend = () => {
      const backend = firebaseBackend();
      if (isReady(backend)) {
        finish(backend);
      }
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    window.addEventListener("firebase-backend-ready", checkBackend);
    checkBackend();
  });
}

function getFirebaseSignup(backend) {
  const createAccount = backend?.signUp || backend?.signup || backend?.Signup;
  return typeof createAccount === "function" ? createAccount : null;
}

function currentAuthTab() {
  return document.querySelector("[data-auth-tab].active")?.dataset.authTab || "signup";
}

function setAuthStatus(message, stateName = "loading") {
  if (!authStatus) return;
  authStatus.textContent = message;
  authStatus.classList.toggle("visible", Boolean(message));
  authStatus.classList.toggle("loading", stateName === "loading");
  authStatus.classList.toggle("ready", stateName === "ready");
  authStatus.classList.toggle("error", stateName === "error");
}

function updateFirebaseStatus() {
  const backend = firebaseBackend();
  const currentTab = currentAuthTab();

  authForms.forEach((form) => {
    const tab = form.dataset.authPanel;
    const button = form.querySelector("button[type='submit']");
    if (!button || button.dataset.busy === "true") return;
    const needsSelectedTeam = tab === "readonly";
    const canSubmitWithoutBridge = tab === "signup";
    button.disabled = (!canSubmitWithoutBridge && !firebaseReadyChecks[tab]?.(backend)) || (needsSelectedTeam && !state.teamId);
  });

  if (firebaseBackendLoadError) {
    setAuthStatus(`Account services could not load: ${firebaseBackendLoadError.message}`, "error");
  } else {
    setAuthStatus("");
  }
}

function getSignupDraftValues() {
  return signupDraftFields.reduce((draft, fieldId) => {
    const field = document.querySelector(`#${fieldId}`);
    if (field) {
      draft[fieldId] = field.value;
    }
    return draft;
  }, {});
}

function saveSignupDraft() {
  sessionStorage.setItem(signupDraftStorageKey, JSON.stringify(getSignupDraftValues()));
}

function restoreSignupDraft() {
  const saved = sessionStorage.getItem(signupDraftStorageKey);
  if (!saved) return;

  try {
    const draft = JSON.parse(saved);
    signupDraftFields.forEach((fieldId) => {
      const field = document.querySelector(`#${fieldId}`);
      if (field && draft[fieldId] !== undefined) {
        field.value = draft[fieldId];
      }
    });
  } catch (error) {
    sessionStorage.removeItem(signupDraftStorageKey);
  }
}

function clearSignupDraft() {
  sessionStorage.removeItem(signupDraftStorageKey);
}

function setFormBusy(form, isBusy, label = "Working...") {
  const button = form.querySelector("button[type='submit']");
  if (!button) return;
  if (isBusy) {
    button.dataset.originalText = button.textContent;
    button.dataset.busy = "true";
    button.textContent = label;
    button.disabled = true;
    return;
  }
  button.textContent = button.dataset.originalText || button.textContent;
  delete button.dataset.busy;
  updateFirebaseStatus();
}

function registerTenant(team, coachName = "Head Coach") {
  if (!team?.id) return;
  tenantCatalog[team.id] = {
    id: team.id,
    name: team.name,
    sport: team.sport || "Track and Field",
    logoText: team.logoText || team.branding?.logoText || "TEAM",
    features: {
      ...defaultFeatures,
      ...(team.features || {})
    },
    branding: {
      ...brandingDefaults,
      teamName: team.name,
      logoText: team.logoText || team.branding?.logoText || "TEAM",
      ...(team.branding || {})
    }
  };
  tenantDataDefaults[team.id] = emptyTeamData(coachName);
  populateTeamSelect();
}

function brandingStorageKey() {
  return `packBranding:${state.teamId}`;
}

function featuresStorageKey() {
  return `packFeatures:${state.teamId}`;
}

function teamDataStorageKey() {
  return `packTeamData:${state.teamId}`;
}

function loadTeamData(teamId) {
  const defaults = clone(tenantDataDefaults[teamId] || emptyTeamData());
  const saved = localStorage.getItem(`packTeamData:${teamId}`);
  return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
}

function persistTeamData() {
  localStorage.setItem(teamDataStorageKey(), JSON.stringify(cloneTeamData(state)));
}

function loadFeatureFlags(teamId) {
  const saved = localStorage.getItem(`packFeatures:${teamId}`);
  return {
    ...defaultFeatures,
    ...(tenantCatalog[teamId]?.features || {}),
    ...(saved ? JSON.parse(saved) : {})
  };
}

function saveFeatureFlags() {
  localStorage.setItem(featuresStorageKey(), JSON.stringify(state.features));
}

function populateTeamSelect() {
  const tenants = Object.values(tenantCatalog).sort((a, b) => a.name.localeCompare(b.name));

  if (teamSelect) {
    teamSelect.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = teamsLoadedFromFirebase ? "Select a team" : "Loading teams...";
    teamSelect.append(placeholder);

    tenants.forEach((tenant) => {
      const option = document.createElement("option");
      option.value = tenant.id;
      option.textContent = teamSearchLabel(tenant);
      teamSelect.append(option);
    });

    teamSelect.disabled = !tenants.length;
    teamSelect.value = state.teamId;
  }

  if (teamOptions) {
    teamOptions.replaceChildren();
    tenants.forEach((tenant) => {
      const option = document.createElement("option");
      option.value = teamSearchLabel(tenant);
      option.dataset.teamId = tenant.id;
      teamOptions.append(option);
    });
  }

  if (teamSearchInput) {
    teamSearchInput.disabled = !tenants.length;
    if (state.teamId) {
      teamSearchInput.value = teamSearchLabel(tenantCatalog[state.teamId]);
    }
  }

  if (teamPickerStatus) {
    if (teamsLoadedFromFirebase && !tenants.length) {
      teamPickerStatus.textContent = "No teams found yet.";
      teamPickerStatus.classList.add("visible");
    } else {
      teamPickerStatus.textContent = "";
      teamPickerStatus.classList.remove("visible");
    }
  }
  updateFirebaseStatus();
}

function applyFeatureFlags() {
  const features = state.features;
  document.querySelectorAll("[data-feature]").forEach((node) => {
    const enabled = features[node.dataset.feature] !== false;
    node.classList.toggle("hidden", !enabled);
  });

  if (features[state.view] === false) {
    setView("home");
  }
}

function setActiveTeam(teamId, options = {}) {
  state.teamId = tenantCatalog[teamId] ? teamId : "";
  state.features = loadFeatureFlags(state.teamId);
  const data = loadTeamData(state.teamId);
  Object.assign(state, data, {
    activeAthleteIndex: 0,
    activeChannel: data.channels[0]?.id || "all",
    workoutFilter: "all"
  });
  if (teamSelect) {
    teamSelect.value = state.teamId;
  }
  if (teamSearchInput) {
    teamSearchInput.value = state.teamId ? teamSearchLabel(currentTenant()) : "";
  }
  applyBranding();
  renderAll();
  applyFeatureFlags();
  tenantNote.textContent = state.teamId ? `${currentTenant().name} workspace` : "No team selected";
  if (!options.keepAuth) {
    lockApp();
  }
}

function selectTeam(teamId, options = {}) {
  setActiveTeam(teamId, options);
  if (teamId) {
    setAuthTab("readonly");
  }
  populateTeamSelect();
}

function matchTeamSearch(value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  return Object.values(tenantCatalog).find((tenant) => (
    tenant.name.toLowerCase() === normalized
    || tenant.id.toLowerCase() === normalized
    || teamSearchLabel(tenant).toLowerCase() === normalized
  )) || null;
}

async function loadFirebaseTeams() {
  try {
    const backend = await waitForFirebaseBackend((candidate) => typeof candidate?.listTeams === "function", 3500);
    const teams = backend ? await backend.listTeams() : await fetchTeamsForSignIn();
    applyTeamList(teams);
  } catch (error) {
    console.warn("Firebase team list failed, retrying with direct endpoint", error);
    try {
      const teams = await fetchTeamsForSignIn();
      applyTeamList(teams);
    } catch (fallbackError) {
      console.warn("Could not load teams from Firebase", fallbackError);
      teamsLoadedFromFirebase = true;
      if (teamPickerStatus) {
        teamPickerStatus.textContent = "Team search is unavailable right now.";
        teamPickerStatus.classList.add("visible");
      }
      populateTeamSelect();
    }
  }
}

async function fetchTeamsForSignIn() {
  const response = await fetch(teamListEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: {} })
  });

  if (!response.ok) {
    throw new Error(`Team list request failed with ${response.status}`);
  }

  const payload = await response.json();
  return payload?.result?.teams || [];
}

async function parseJsonResponse(response, fallbackMessage) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || payload?.error?.status || fallbackMessage;
    throw new Error(message);
  }
  if (payload?.error) {
    throw new Error(payload.error.message || fallbackMessage);
  }
  return payload;
}

function authRestErrorMessage(error) {
  const message = String(error?.message || "");
  if (message.includes("EMAIL_EXISTS")) {
    return "An account with that email already exists. Use Log In or choose another email.";
  }
  if (message.includes("WEAK_PASSWORD")) {
    return "Use a stronger password with at least 6 characters.";
  }
  if (message.includes("INVALID_EMAIL")) {
    return "Enter a valid email address.";
  }
  if (message.includes("OPERATION_NOT_ALLOWED")) {
    return "Email and password signup is not enabled for this app yet.";
  }
  return error?.message || "Could not create that coach account.";
}

async function createAccountWithRest({ email, password, name }) {
  try {
    const created = await fetch(signUpEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    }).then((response) => parseJsonResponse(response, "Could not create that coach account."));

    const updated = await fetch(updateProfileEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: created.idToken, displayName: name, returnSecureToken: true })
    }).then((response) => parseJsonResponse(response, "Could not finish setting up that coach account."));

    return {
      uid: updated.localId || created.localId,
      displayName: updated.displayName || name,
      email: updated.email || created.email || email,
      idToken: updated.idToken || created.idToken
    };
  } catch (error) {
    throw new Error(authRestErrorMessage(error));
  }
}

async function createTeamWithRest(idToken, teamSetup) {
  const payload = await fetch(createTeamEndpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${idToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: teamSetup })
  }).then((response) => parseJsonResponse(response, "Could not create that team yet."));

  if (!payload?.result?.teamId || !payload?.result?.team) {
    throw new Error("The team was created, but the app could not read the setup response.");
  }

  return payload.result;
}

function applyTeamList(teams) {
  if (Array.isArray(teams)) {
    teams.forEach((team) => {
      registerTenant({
        id: team.id,
        name: team.name || team.id,
        sport: team.sport || "Track and Field",
        logoText: team.logoText || team.name?.slice(0, 4) || "TEAM",
        features: team.features || {},
        branding: team.branding || {}
      });
    });
  }
  teamsLoadedFromFirebase = true;
  populateTeamSelect();
  updateFirebaseStatus();
}

function saveSession(session) {
  localStorage.setItem(sessionStorageKey, JSON.stringify(session));
}

function getSavedSession() {
  const saved = localStorage.getItem(sessionStorageKey);
  return saved ? JSON.parse(saved) : null;
}

function clearAuthError() {
  authError.textContent = "";
  authError.classList.remove("visible");
}

function showAuthError(message) {
  authError.textContent = message;
  authError.classList.add("visible");
}

function firebaseErrorMessage(error, fallback) {
  const code = error?.code || "";
  if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password") || code.includes("auth/user-not-found")) {
    return "No account matched that email and password.";
  }
  if (code.includes("auth/too-many-requests")) {
    return "Too many sign-in attempts. Wait a bit, then try again.";
  }
  if (code.includes("functions/permission-denied")) {
    return "That team password did not match.";
  }
  if (code.includes("permission-denied")) {
    return "This account cannot open that team workspace.";
  }
  return error?.message || fallback;
}

async function registerFirebaseTeam(backend, teamId) {
  if (!teamId || tenantCatalog[teamId]) return;
  if (!backend?.getTeam) return;
  const team = await backend.getTeam(teamId);
  if (!team) return;
  registerTenant({
    id: teamId,
    name: team.name || teamId,
    sport: team.sport || "Track and Field",
    logoText: team.logoText || team.name?.slice(0, 4) || "TEAM",
    features: team.features || {},
    branding: team.branding || {}
  });
  populateTeamSelect();
}

async function resolveFirebaseMembership(backend, firebaseUser, preferredTeamId) {
  if (preferredTeamId) {
    const preferredMembership = await backend.getMembership(preferredTeamId, firebaseUser.uid);
    if (preferredMembership) {
      return { teamId: preferredTeamId, membership: preferredMembership };
    }
  }

  const profile = await backend.getUserProfile?.(firebaseUser.uid);
  const teamIds = [
    profile?.defaultTeamId,
    ...(Array.isArray(profile?.teamIds) ? profile.teamIds : [])
  ].filter(Boolean);

  for (const teamId of [...new Set(teamIds)]) {
    const membership = await backend.getMembership(teamId, firebaseUser.uid);
    if (membership) {
      await registerFirebaseTeam(backend, teamId);
      return { teamId, membership };
    }
  }

  return null;
}

function setAuthTab(tab) {
  clearAuthError();
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.authTab === tab);
  });
  document.querySelectorAll("[data-auth-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.authPanel === tab);
  });
  updateFirebaseStatus();
}

function isReadOnly() {
  return state.session?.mode === "readonly";
}

function isHeadCoach() {
  return hasCapability("manageRecords");
}

function isCoachRole() {
  return hasCapability("coachStudio");
}

function hasCapability(capability) {
  if (isReadOnly()) return false;
  return roleCapabilities[state.role]?.includes(capability) || false;
}

function requireCapability(capability, message) {
  if (hasCapability(capability)) return true;
  sessionNote.textContent = message;
  return false;
}

function requireWriteAccess() {
  if (!isReadOnly()) return true;
  sessionNote.textContent = "Read-only access cannot make changes. Log out to sign in.";
  return false;
}

function requireHeadCoachAccess() {
  if (!requireWriteAccess()) return false;
  return requireCapability("manageRecords", "Only the head coach can update records and history.");
}

function lockApp() {
  state.session = null;
  localStorage.removeItem(sessionStorageKey);
  document.body.classList.add("auth-locked");
  appShell.setAttribute("aria-hidden", "true");
  authScreen.removeAttribute("aria-hidden");
}

function unlockApp(session) {
  if (session.teamId && session.teamId !== state.teamId) {
    setActiveTeam(session.teamId, { keepAuth: true });
  }
  state.session = session;
  saveSession(session);
  document.body.classList.remove("auth-locked");
  appShell.removeAttribute("aria-hidden");
  authScreen.setAttribute("aria-hidden", "true");
  setRole(session.role || "athlete");
  applyAuthPermissions();
}

function applyAuthPermissions() {
  const readOnly = isReadOnly();
  roleSelect.disabled = true;
  sessionNote.textContent = readOnly
    ? `Read-only dashboard access for ${currentTenant().name}`
    : `Signed in as ${state.session.name}`;
  tenantNote.textContent = `${currentTenant().name} workspace`;

  document.querySelectorAll("[data-open-compose], [data-add-workout], [data-add-event], [data-add-resource], [data-add-record], #brandingForm button, #messageForm button, #rosterForm button")
    .forEach((node) => {
      node.classList.toggle("readonly-disabled", readOnly);
      node.setAttribute("aria-disabled", readOnly ? "true" : "false");
    });

  document.querySelectorAll(".head-coach-only").forEach((node) => {
    node.classList.toggle("hidden", !isHeadCoach());
  });

  messageInput.disabled = readOnly;
  messageInput.placeholder = readOnly ? "Log in to send team messages" : "Write a team update...";
  document.querySelector("#rosterNameInput").disabled = readOnly || !isCoachRole();
  document.querySelector("#rosterGroupInput").disabled = readOnly || !isCoachRole();
  document.querySelector("#rosterLevelInput").disabled = !isHeadCoach();
  document.querySelectorAll("[data-roster-level]").forEach((select) => {
    select.disabled = !isHeadCoach();
  });
}

function getBranding() {
  const defaults = { ...brandingDefaults, ...currentTenant().branding };
  const saved = localStorage.getItem(brandingStorageKey());
  return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
}

function saveBranding(branding) {
  localStorage.setItem(brandingStorageKey(), JSON.stringify(branding));
}

function applyBranding() {
  const branding = getBranding();
  document.documentElement.style.setProperty("--primary", branding.primary);
  document.documentElement.style.setProperty("--accent", branding.accent);
  document.documentElement.style.setProperty("--surface", branding.surface);
  if (branding.heroImage) {
    document.documentElement.style.setProperty("--hero-image", `url("${branding.heroImage}")`);
  } else {
    document.documentElement.style.removeProperty("--hero-image");
  }
  document.querySelectorAll("[data-team-name]").forEach((node) => {
    node.textContent = branding.teamName;
  });
  document.querySelectorAll("[data-team-sport]").forEach((node) => {
    node.textContent = currentTenant().sport;
  });
  document.querySelectorAll("[data-logo-mark]").forEach((node) => {
    node.textContent = branding.logoText;
  });
  document.querySelector("#teamNameInput").value = branding.teamName;
  document.querySelector("#logoTextInput").value = branding.logoText;
  document.querySelector("#primaryColorInput").value = branding.primary;
  document.querySelector("#accentColorInput").value = branding.accent;
  document.querySelector("#surfaceColorInput").value = branding.surface;
  document.querySelector("#heroImageInput").value = branding.heroImage;
}

function setRole(role) {
  if (isReadOnly()) {
    role = "athlete";
  }

  state.role = role;
  roleSelect.value = role;
  const isCoach = isCoachRole();
  document.body.dataset.role = role;
  document.querySelectorAll(".coach-only").forEach((node) => {
    node.classList.toggle("hidden", !isCoach);
  });
  document.querySelectorAll(".head-coach-only").forEach((node) => {
    node.classList.toggle("hidden", !isHeadCoach());
  });

  if (!isCoach && state.view === "coach") {
    setView("home");
  }
}

function setView(view) {
  if ((view === "coach" || view === "coachTools") && !isCoachRole()) {
    view = "home";
  }
  if (state.features[view] === false) {
    view = "home";
  }

  state.view = view;
  document.querySelectorAll("[data-view]").forEach((node) => {
    node.classList.toggle("active", node.dataset.view === view);
  });
  document.querySelectorAll("[data-view-link]").forEach((node) => {
    node.classList.toggle("active", node.dataset.viewLink === view);
  });
  document.querySelector("[data-page-title]").textContent = pageTitles[view];
  history.replaceState(null, "", `#${view}`);
  closeMobileMenu();
}

function closeMobileMenu() {
  sidebar.classList.remove("menu-open");
  mobileMenuButton.setAttribute("aria-expanded", "false");
}

function toggleMobileMenu() {
  const isOpen = sidebar.classList.toggle("menu-open");
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
}

function renderAnnouncements() {
  announcementList.innerHTML = state.announcements.length ? state.announcements
    .map((item) => `
      <article class="announcement">
        <strong>${item.title}</strong>
        <p>${item.body}</p>
        <span class="meta">${item.author} - ${item.time}</span>
      </article>
    `)
    .join("") : `<p class="empty-note">No announcements yet.</p>`;
}

function renderWorkouts() {
  const workouts = state.workouts.filter((item) => state.workoutFilter === "all" || item.group === state.workoutFilter);
  workoutGrid.innerHTML = workouts.length ? workouts
    .map((item) => `
      <article class="workout-card">
        <header>
          <div>
            <h3>${item.title}</h3>
            <p>${item.focus}</p>
          </div>
          <span class="tag">${item.group}</span>
        </header>
        <div class="workout-detail">
          ${item.details.map((detail) => `<span>${detail}</span>`).join("")}
        </div>
        <span class="meta">${item.coach}</span>
      </article>
    `)
    .join("") : `<p class="empty-note">No workouts yet.</p>`;
}

function renderSchedule() {
  const start = new Date("2026-06-08T12:00:00");
  const days = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });

  calendarStrip.innerHTML = days
    .map((day) => {
      const dateKey = day.toISOString().slice(0, 10);
      const event = state.events.find((item) => item.date === dateKey);
      const label = day.toLocaleDateString(undefined, { weekday: "short" });
      return `
        <article class="calendar-day ${event ? "has-event" : ""}">
          <span class="meta">${label}</span>
          <strong>${day.getDate()}</strong>
          <span>${event ? event.title : "No event"}</span>
          <small>${event ? event.time : "Open"}</small>
        </article>
      `;
    })
    .join("");

  eventTimeline.innerHTML = state.events.length ? state.events
    .map((event) => {
      const date = new Date(`${event.date}T12:00:00`);
      return `
        <article class="timeline-item">
          <div class="time-block">${event.time}</div>
          <div>
            <span class="event-type">${event.type} - ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            <h3>${event.title}</h3>
            <p>${event.detail}</p>
          </div>
        </article>
      `;
    })
    .join("") : `<p class="empty-note">No scheduled events yet.</p>`;
}

function renderResources() {
  resourceGrid.innerHTML = state.resources.length ? state.resources
    .map((resource) => `
      <article class="resource-card">
        <header>
          <h3>${resource.title}</h3>
          <span class="tag">${resource.kind}</span>
        </header>
        <p>${resource.body}</p>
        <button class="secondary-button" type="button">Open</button>
      </article>
    `)
    .join("") : `<p class="empty-note">No resources yet.</p>`;
}

function getActiveAthlete() {
  return state.roster[state.activeAthleteIndex] || state.roster[0];
}

function canEditActiveAthlete() {
  const athlete = getActiveAthlete();
  if (!athlete) return false;
  return state.session?.mode === "user" && state.session.name.toLowerCase() === athlete.name.toLowerCase();
}

function renderPublicRoster() {
  const levels = ["Varsity", "Junior Varsity", "Freshman", "Unassigned"];
  levelRoster.innerHTML = levels
    .map((level) => {
      const athletes = state.roster.filter((athlete) => athlete.level === level);
      return `
        <section class="level-column">
          <div class="panel-heading">
            <h3>${level}</h3>
            <span class="meta">${athletes.length} athletes</span>
          </div>
          <div class="level-athletes">
            ${athletes.map((athlete) => {
              const index = state.roster.indexOf(athlete);
              return `
                <button class="athlete-card" type="button" data-athlete-index="${index}">
                  <strong>${athlete.name}</strong>
                  <span>${athlete.group} - Grade ${athlete.grade}</span>
                </button>
              `;
            }).join("") || `<p class="empty-note">No athletes assigned.</p>`}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderRecords() {
  recordList.innerHTML = state.records.length ? state.records
    .map((record) => `
      <article class="record-row">
        <div>
          <strong>${record.event}</strong>
          <span>${record.division}</span>
        </div>
        <div>
          <strong>${record.mark}</strong>
          <span>${record.athlete} - ${record.year}</span>
        </div>
      </article>
    `)
    .join("") : `<p class="empty-note">No records yet.</p>`;

  historyList.innerHTML = state.history.length ? state.history
    .map((item) => `
      <article class="history-item">
        <span class="history-year">${item.year}</span>
        <div>
          <h3>${item.title}</h3>
          <p>${item.body}</p>
        </div>
      </article>
    `)
    .join("") : `<p class="empty-note">No history items yet.</p>`;
}

function renderRoster() {
  rosterList.innerHTML = state.roster.length ? state.roster
    .map((athlete, index) => `
      <article class="roster-row">
        <div>
          <strong>${athlete.name}</strong>
          <span>${athlete.group} - Grade ${athlete.grade}</span>
        </div>
        <select class="level-select head-coach-control" data-roster-level="${index}">
          ${["Unassigned", "Varsity", "Junior Varsity", "Freshman"].map((level) => `
            <option value="${level}" ${athlete.level === level ? "selected" : ""}>${level}</option>
          `).join("")}
        </select>
        <button class="text-button coach-only" type="button" data-remove-roster="${index}">Remove</button>
      </article>
    `)
    .join("") : `<p class="empty-note">No athletes yet.</p>`;

  rosterList.querySelectorAll("[data-roster-level]").forEach((select) => {
    select.disabled = !isHeadCoach();
  });
}

function renderAthletePage() {
  const athlete = getActiveAthlete();
  if (!athlete) {
    athletePageName.textContent = "Athlete Profile";
    athletePageLevel.textContent = "Roster";
    athletePageEvent.textContent = "No athlete selected";
    athletePageBio.textContent = "Add athletes in Coach Studio to create profile pages.";
    athletePageGrade.textContent = "No grade";
    athletePageGoal.textContent = "No goal";
    athleteProfileForm.classList.add("hidden");
    return;
  }

  const canEdit = canEditActiveAthlete();
  athletePageName.textContent = athlete.name;
  athletePageLevel.textContent = athlete.level;
  athletePageEvent.textContent = athlete.group;
  athletePageBio.textContent = athlete.bio || "This athlete has not customized their page yet.";
  athletePageGrade.textContent = `Grade ${athlete.grade}`;
  athletePageGoal.textContent = athlete.goal || "No season goal listed";
  athleteHero.style.borderColor = athlete.color || "var(--accent)";
  athleteHero.style.boxShadow = `inset 6px 0 0 ${athlete.color || "var(--accent)"}`;
  athleteProfileForm.classList.toggle("hidden", !canEdit);
  document.querySelector("#athleteBioInput").value = athlete.bio || "";
  document.querySelector("#athleteGoalInput").value = athlete.goal || "";
  document.querySelector("#athleteColorInput").value = athlete.color || "#1e6b52";
}

function renderChannels() {
  channelList.innerHTML = state.channels.length ? state.channels
    .map((channel) => `
      <button class="channel-button ${channel.id === state.activeChannel ? "active" : ""}" type="button" data-channel="${channel.id}">
        <span>
          <strong>${channel.name}</strong><br>
          <small>${channel.audience}</small>
        </span>
        <span class="tag">${channel.messages.length}</span>
      </button>
    `)
    .join("") : `<p class="empty-note">No message channels yet.</p>`;

  const channel = state.channels.find((item) => item.id === state.activeChannel);
  if (!channel) {
    activeChannelName.textContent = "Messages";
    activeChannelAudience.textContent = "No channel selected";
    chatLog.innerHTML = `<p class="empty-note">Create a team to start messaging.</p>`;
    return;
  }
  activeChannelName.textContent = channel.name;
  activeChannelAudience.textContent = channel.audience;
  chatLog.innerHTML = channel.messages.length ? channel.messages
    .map((message) => `
      <article class="chat-message">
        <strong>${message.from}</strong>
        <p>${message.body}</p>
        <span class="meta">${message.time}</span>
      </article>
    `)
    .join("") : `<p class="empty-note">No messages yet.</p>`;
}

function renderToolCatalog() {
  toolCatalog.innerHTML = featureCatalog
    .map((tool) => {
      const enabled = state.features[tool.key] !== false;
      const headCoachOnly = tool.key === "records";
      const locked = headCoachOnly && !isHeadCoach();
      return `
        <article class="tool-card ${enabled ? "enabled" : ""}">
          <div>
            <span class="tag">${enabled ? "Enabled" : "Disabled"}</span>
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
            ${headCoachOnly ? `<small class="meta">Head coach approval required</small>` : ""}
          </div>
          <label class="switch-control">
            <input type="checkbox" data-tool-toggle="${tool.key}" ${enabled ? "checked" : ""} ${locked ? "disabled" : ""}>
            <span>${enabled ? "On" : "Off"}</span>
          </label>
        </article>
      `;
    })
    .join("");
}

function renderAll() {
  todayDate.textContent = new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
  renderAnnouncements();
  renderWorkouts();
  renderSchedule();
  renderResources();
  renderPublicRoster();
  renderRecords();
  renderRoster();
  renderAthletePage();
  renderChannels();
  renderToolCatalog();
}

document.querySelectorAll("[data-view-link]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextView = button.dataset.viewLink;
    if ((nextView === "coach" || nextView === "coachTools") && !isCoachRole()) return;
    setView(nextView);
  });
});

mobileMenuButton.addEventListener("click", toggleMobileMenu);

document.querySelectorAll("[data-workout-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.workoutFilter = button.dataset.workoutFilter;
    document.querySelectorAll("[data-workout-filter]").forEach((node) => {
      node.classList.toggle("active", node === button);
    });
    renderWorkouts();
  });
});

roleSelect.addEventListener("change", (event) => setRole(event.target.value));

teamSelect?.addEventListener("change", (event) => {
  selectTeam(event.target.value);
});

teamSearchInput?.addEventListener("input", (event) => {
  const team = matchTeamSearch(event.target.value);
  if (team) {
    selectTeam(team.id);
  } else {
    selectTeam("", { keepAuth: true });
  }
});

teamSearchInput?.addEventListener("change", (event) => {
  const team = matchTeamSearch(event.target.value);
  if (team) {
    selectTeam(team.id);
  } else {
    selectTeam("", { keepAuth: true });
  }
});

document.querySelectorAll("[data-auth-tab]").forEach((button) => {
  button.addEventListener("click", () => setAuthTab(button.dataset.authTab));
});

signupForm.addEventListener("input", saveSignupDraft);
signupForm.addEventListener("change", saveSignupDraft);

readonlyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = document.querySelector("#teamPasswordInput").value;
  setFormBusy(readonlyForm, true, "Opening...");

  try {
    if (!state.teamId) {
      showAuthError("Select a team before using a team password.");
      return;
    }

    const backend = await waitForFirebaseBackend((candidate) => (
      typeof candidate?.signInGuest === "function"
      && typeof candidate?.joinTeamWithReadOnlyCode === "function"
    ));

    if (backend) {
      await backend.signInGuest();
      const access = await backend.joinTeamWithReadOnlyCode(state.teamId, password);
      readonlyForm.reset();
      clearAuthError();
      unlockApp({ mode: "readonly", name: "Read-only guest", role: access.role || "viewer", teamId: access.teamId || state.teamId });
      return;
    }

    showAuthError("Account services are still starting. Try again in a moment.");
  } catch (error) {
    showAuthError(firebaseErrorMessage(error, "That team password did not match."));
  } finally {
    setFormBusy(readonlyForm, false);
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.querySelector("#loginEmailInput").value.trim().toLowerCase();
  const password = document.querySelector("#loginPasswordInput").value;
  setFormBusy(loginForm, true, "Signing in...");

  try {
    const backend = await waitForFirebaseBackend((candidate) => (
      typeof candidate?.signIn === "function"
      && typeof candidate?.getMembership === "function"
    ));

    if (backend) {
      const firebaseUser = await backend.signIn(email, password);
      const access = await resolveFirebaseMembership(backend, firebaseUser, state.teamId);
      if (!access) {
        showAuthError("That account is not connected to this team workspace yet.");
        return;
      }

      loginForm.reset();
      clearAuthError();
      setActiveTeam(access.teamId, { keepAuth: true });
      unlockApp({
        mode: "user",
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        role: access.membership.role,
        teamId: access.teamId
      });
      return;
    }

    showAuthError("Account services are still starting. Try again in a moment.");
  } catch (error) {
    showAuthError(firebaseErrorMessage(error, "No account matched that email and password."));
  } finally {
    setFormBusy(loginForm, false);
  }
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.querySelector("#signupNameInput").value.trim();
  const email = document.querySelector("#signupEmailInput").value.trim().toLowerCase();
  const password = document.querySelector("#signupPasswordInput").value;
  const teamName = document.querySelector("#signupTeamNameInput").value.trim();
  const sport = document.querySelector("#signupSportInput").value.trim();
  const logoText = document.querySelector("#signupLogoTextInput").value.trim();
  const accessCode = document.querySelector("#signupAccessCodeInput").value;
  const branding = {
    primary: document.querySelector("#signupPrimaryInput").value,
    accent: document.querySelector("#signupAccentInput").value,
    surface: document.querySelector("#signupSurfaceInput").value
  };
  setFormBusy(signupForm, true, "Creating team...");

  try {
    const teamSetup = {
      coachName: name,
      coachEmail: email,
      teamName,
      sport,
      logoText,
      accessCode,
      branding
    };
    const backend = await waitForFirebaseBackend((candidate) => (
      getFirebaseSignup(candidate)
      && typeof candidate?.createTeamForCoach === "function"
    ), 2500);
    let firebaseUser;
    let setup;

    if (backend) {
      const createAccount = getFirebaseSignup(backend);
      if (!createAccount) {
        throw new Error("Account services are still starting. Try again in a moment.");
      }

      firebaseUser = await createAccount({ email, password, name });
      setup = await backend.createTeamForCoach(teamSetup);
    } else {
      firebaseUser = await createAccountWithRest({ email, password, name });
      setup = await createTeamWithRest(firebaseUser.idToken, teamSetup);
    }

    registerTenant(setup.team, name);
    signupForm.reset();
    clearSignupDraft();
    clearAuthError();
    setActiveTeam(setup.teamId, { keepAuth: true });
    unlockApp({
      mode: "user",
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || name,
      email: firebaseUser.email || email,
      role: "headCoach",
      teamId: setup.teamId
    });
    setView("coach");
  } catch (error) {
    showAuthError(error.message || "Could not create that team yet. Please try again.");
  } finally {
    setFormBusy(signupForm, false);
  }
});

logoutButton.addEventListener("click", async () => {
  try {
    await firebaseBackend()?.signOutCurrentUser();
  } catch (error) {
    console.warn("Firebase sign out failed", error);
  }
  lockApp();
  setAuthTab(Object.keys(tenantCatalog).length ? "readonly" : "signup");
});

channelList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-channel]");
  if (!button) return;
  state.activeChannel = button.dataset.channel;
  renderChannels();
});

levelRoster.addEventListener("click", (event) => {
  const button = event.target.closest("[data-athlete-index]");
  if (!button) return;
  state.activeAthleteIndex = Number(button.dataset.athleteIndex);
  renderAthletePage();
  setView("athlete");
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireWriteAccess() || !requireCapability("message", "This role cannot send team messages.")) return;
  const body = messageInput.value.trim();
  if (!body) return;

  const channel = state.channels.find((item) => item.id === state.activeChannel);
  channel.messages.push({
    from: state.role === "coach" ? "Coach" : state.role === "parent" ? "Parent" : "Athlete",
    body,
    time: "Just now"
  });
  messageInput.value = "";
  persistTeamData();
  renderChannels();
});

document.querySelectorAll("[data-open-compose]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireWriteAccess() || !requireCapability("manageAnnouncements", "Only coaches can post announcements.")) return;
    composeDialog.showModal();
    document.querySelector("#composeTitle").focus();
  });
});

composeForm.addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  if (!requireWriteAccess() || !requireCapability("manageAnnouncements", "Only coaches can post announcements.")) return;
  const title = document.querySelector("#composeTitle").value.trim();
  const body = document.querySelector("#composeBody").value.trim();
  if (!title || !body) return;

  state.announcements.unshift({
    title,
    body,
    author: state.role === "coach" ? "Coach" : "Team Member",
    time: "Just now"
  });
  composeForm.reset();
  composeDialog.close();
  persistTeamData();
  renderAnnouncements();
});

brandingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireWriteAccess() || !requireCapability("manageBranding", "Only coaches can update team branding.")) return;
  saveBranding({
    teamName: document.querySelector("#teamNameInput").value.trim() || brandingDefaults.teamName,
    logoText: document.querySelector("#logoTextInput").value.trim() || brandingDefaults.logoText,
    primary: document.querySelector("#primaryColorInput").value,
    accent: document.querySelector("#accentColorInput").value,
    surface: document.querySelector("#surfaceColorInput").value,
    heroImage: document.querySelector("#heroImageInput").value.trim()
  });
  applyBranding();
});

document.querySelector("#resetBranding").addEventListener("click", () => {
  if (!requireWriteAccess() || !requireCapability("manageBranding", "Only coaches can update team branding.")) return;
  localStorage.removeItem(brandingStorageKey());
  applyBranding();
});

document.querySelector("[data-add-workout]").addEventListener("click", () => {
  if (!requireWriteAccess() || !requireCapability("manageWorkouts", "Only coaches can update workouts.")) return;
  state.workouts.unshift({
    group: "sprints",
    title: "Starts + rhythm",
    focus: "Coach session",
    details: ["Warmup", "Main set", "Cooldown"],
    coach: "Coach"
  });
  persistTeamData();
  renderWorkouts();
});

document.querySelector("[data-add-event]").addEventListener("click", () => {
  if (!requireWriteAccess() || !requireCapability("manageSchedule", "Only coaches can update the schedule.")) return;
  state.events.unshift({
    date: "2026-06-11",
    time: "3:30",
    title: "Team tune-up",
    detail: "Short practice with event groups and meet preparation",
    type: "Team"
  });
  persistTeamData();
  renderSchedule();
});

document.querySelector("[data-add-resource]").addEventListener("click", () => {
  if (!requireWriteAccess() || !requireCapability("manageResources", "Only coaches can update resources.")) return;
  state.resources.unshift({
    title: "Meet entries",
    kind: "Draft",
    body: "Current event assignments and alternates for the upcoming invite."
  });
  persistTeamData();
  renderResources();
});

function addRecordUpdate() {
  state.records.unshift({
    event: "4x400m Relay",
    mark: "3:19.80",
    athlete: "Bell, Hill, Carter, James",
    year: "2026",
    division: "Boys Varsity"
  });
  state.history.unshift({
    year: "2026",
    title: "Relay record updated",
    body: "The head coach added a new program record to the official team history."
  });
  persistTeamData();
  renderRecords();
}

document.querySelectorAll("[data-add-record]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!requireHeadCoachAccess()) return;
    addRecordUpdate();
  });
});

rosterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireWriteAccess() || !requireCapability("manageRoster", "Only coaches can manage the roster.")) return;
  const name = document.querySelector("#rosterNameInput").value.trim();
  const group = document.querySelector("#rosterGroupInput").value;
  const level = isHeadCoach() ? document.querySelector("#rosterLevelInput").value : "Unassigned";
  if (!name) return;
  state.roster.unshift({
    name,
    group,
    grade: "9",
    level,
    bio: "",
    goal: "",
    color: "#1e6b52"
  });
  rosterForm.reset();
  persistTeamData();
  renderPublicRoster();
  renderRoster();
});

rosterList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-roster]");
  if (!button || !requireWriteAccess() || !requireCapability("manageRoster", "Only coaches can manage the roster.")) return;
  state.roster.splice(Number(button.dataset.removeRoster), 1);
  if (state.activeAthleteIndex >= state.roster.length) {
    state.activeAthleteIndex = Math.max(0, state.roster.length - 1);
  }
  persistTeamData();
  renderPublicRoster();
  renderRoster();
  renderAthletePage();
});

rosterList.addEventListener("change", (event) => {
  const select = event.target.closest("[data-roster-level]");
  if (!select || !requireWriteAccess() || !requireCapability("assignLevels", "Only the head coach can assign roster levels.")) return;
  state.roster[Number(select.dataset.rosterLevel)].level = select.value;
  persistTeamData();
  renderPublicRoster();
  renderRoster();
  renderAthletePage();
});

toolCatalog.addEventListener("change", (event) => {
  const toggle = event.target.closest("[data-tool-toggle]");
  if (!toggle) return;
  const feature = toggle.dataset.toolToggle;
  const isRecords = feature === "records";

  if (!requireWriteAccess() || !requireCapability("manageFeatures", "Only coaches can manage app tools.")) {
    toggle.checked = state.features[feature] !== false;
    return;
  }

  if (isRecords && !requireCapability("manageRecords", "Only the head coach can enable records and history.")) {
    toggle.checked = state.features[feature] !== false;
    return;
  }

  state.features[feature] = toggle.checked;
  saveFeatureFlags();
  applyFeatureFlags();
  renderToolCatalog();
});

athleteProfileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!canEditActiveAthlete()) return;
  const athlete = getActiveAthlete();
  athlete.bio = document.querySelector("#athleteBioInput").value.trim();
  athlete.goal = document.querySelector("#athleteGoalInput").value.trim();
  athlete.color = document.querySelector("#athleteColorInput").value;
  persistTeamData();
  renderPublicRoster();
  renderAthletePage();
});

window.addEventListener("firebase-backend-ready", () => {
  firebaseLoadTimedOut = false;
  firebaseBackendLoadError = null;
  updateFirebaseStatus();
});

window.addEventListener("firebase-backend-failed", (event) => {
  firebaseLoadTimedOut = true;
  firebaseBackendLoadError = event.detail?.error || new Error("Account services did not load.");
  updateFirebaseStatus();
});

setTimeout(() => {
  firebaseLoadTimedOut = true;
  updateFirebaseStatus();
}, 10000);

localStorage.removeItem(sessionStorageKey);
restoreSignupDraft();
if (window.firebaseBackendLoadError) {
  firebaseLoadTimedOut = true;
  firebaseBackendLoadError = window.firebaseBackendLoadError;
}
populateTeamSelect();
setActiveTeam(state.teamId, { keepAuth: true });
lockApp();
setAuthTab("signup");
updateFirebaseStatus();
loadFirebaseTeams();
setView(location.hash?.replace("#", "") && pageTitles[location.hash.replace("#", "")] ? location.hash.replace("#", "") : "home");
