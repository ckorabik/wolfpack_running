const state = {
  session: null,
  teamId: "wolfpack",
  features: {},
  role: "athlete",
  view: "home",
  workoutFilter: "all",
  activeChannel: "all",
  activeAthleteIndex: 0,
  announcements: [
    {
      title: "Uniform check on Thursday",
      body: "Bring both singlets and warmups to practice. Coaches will confirm meet-day kits before strides.",
      author: "Coach Rivera",
      time: "8:15 AM"
    },
    {
      title: "Parent volunteer slots are open",
      body: "We still need two lane timers and one snack table helper for the Friday invite.",
      author: "Booster Club",
      time: "Yesterday"
    },
    {
      title: "Recovery reminder",
      body: "Prioritize sleep, hydration, and a balanced dinner during meet week.",
      author: "Coach Malik",
      time: "Monday"
    }
  ],
  workouts: [
    {
      group: "sprints",
      title: "Acceleration + handoffs",
      focus: "Starts, drive phase, 4x100 exchanges",
      details: ["6 x 30m", "4 x flying 20m", "Relay zones"],
      coach: "Coach Rivera"
    },
    {
      group: "distance",
      title: "Controlled tempo intervals",
      focus: "Threshold rhythm without racing practice",
      details: ["12 min warmup", "5 x 1k", "200m jog"],
      coach: "Coach Owens"
    },
    {
      group: "jumps",
      title: "Approach consistency",
      focus: "Check marks, posture, takeoff timing",
      details: ["Pop-ups", "6 full approaches", "Core"],
      coach: "Coach Malik"
    },
    {
      group: "throws",
      title: "Power position series",
      focus: "Balance, release angle, footwork",
      details: ["Med ball", "Stand throws", "Video review"],
      coach: "Coach Chen"
    },
    {
      group: "distance",
      title: "Pre-meet shakeout",
      focus: "Keep legs sharp and relaxed",
      details: ["25 min easy", "4 strides", "Mobility"],
      coach: "Coach Owens"
    },
    {
      group: "sprints",
      title: "Speed endurance",
      focus: "Race posture under fatigue",
      details: ["3 x 150m", "Full recovery", "Cooldown"],
      coach: "Coach Rivera"
    }
  ],
  events: [
    { date: "2026-06-08", time: "3:30", title: "Practice", detail: "Track warmup, event groups after drills", type: "Practice" },
    { date: "2026-06-09", time: "4:15", title: "Weight room", detail: "Sprinters and throwers lift, distance mobility", type: "Training" },
    { date: "2026-06-10", time: "6:00", title: "Parent meeting", detail: "Travel, fundraising, and postseason expectations", type: "Meeting" },
    { date: "2026-06-12", time: "5:00", title: "Friday Night Invite", detail: "Bus loads at 2:45 PM from the athletic entrance", type: "Meet" },
    { date: "2026-06-15", time: "3:30", title: "Recovery run", detail: "Easy groups plus event-specific rehab work", type: "Practice" }
  ],
  resources: [
    { title: "Meet day packing list", kind: "Checklist", body: "Uniform, spikes, water bottle, warmups, recovery snack, and school ID." },
    { title: "Travel release form", kind: "Form", body: "Required when an athlete leaves a meet with a parent or guardian." },
    { title: "Season calendar", kind: "Calendar", body: "Printable overview for practices, invites, championship dates, and breaks." },
    { title: "Nutrition guide", kind: "Guide", body: "Simple pre-practice and race-day meal ideas for athletes and families." },
    { title: "Volunteer sign-up", kind: "Link", body: "Timing, concessions, tent setup, photography, and post-meet cleanup." },
    { title: "Athletic trainer hours", kind: "Info", body: "Treatment windows, injury reporting, and return-to-practice steps." }
  ],
  records: [
    { event: "100m", mark: "10.84", athlete: "Andre Bell", year: "2024", division: "Boys Varsity" },
    { event: "400m", mark: "48.92", athlete: "Marcus Hill", year: "2023", division: "Boys Varsity" },
    { event: "1600m", mark: "4:17.36", athlete: "Eli Turner", year: "2025", division: "Boys Varsity" },
    { event: "100m", mark: "12.11", athlete: "Nia Brooks", year: "2025", division: "Girls Varsity" },
    { event: "800m", mark: "2:13.44", athlete: "Sofia Martin", year: "2022", division: "Girls Varsity" },
    { event: "Long Jump", mark: "19-02.25", athlete: "Jade Coleman", year: "2024", division: "Girls Varsity" }
  ],
  history: [
    { year: "2026", title: "New communication hub launched", body: "The program moved workouts, meet logistics, and team messages into one shared dashboard." },
    { year: "2025", title: "Distance double at sectionals", body: "The team won both 1600m races and qualified seven athletes for state." },
    { year: "2024", title: "Sprint relay record", body: "The 4x100 relay lowered the school record twice in the same postseason." },
    { year: "2022", title: "First combined conference title", body: "Boys and girls varsity teams both finished first at the conference championship." }
  ],
  roster: [
    { name: "Maya Patel", group: "Distance", grade: "12", level: "Varsity", bio: "Varsity distance runner and team captain.", goal: "Break 5:05 in the 1600m", color: "#1e6b52" },
    { name: "Andre Bell", group: "Sprints", grade: "11", level: "Varsity", bio: "Explosive starter focused on the 100m and 4x100 relay.", goal: "Own the final 30 meters", color: "#b3261e" },
    { name: "Jade Coleman", group: "Jumps", grade: "12", level: "Junior Varsity", bio: "Long jumper building consistency through the board.", goal: "Hit 19 feet again at sectionals", color: "#6b4ee6" },
    { name: "Theo Chen", group: "Throws", grade: "10", level: "Freshman", bio: "Shot and discus thrower learning the rhythm of big meets.", goal: "Add five feet before conference", color: "#8a5a22" }
  ],
  channels: [
    {
      id: "all",
      name: "All Team",
      audience: "Coaches, athletes, and parents",
      messages: [
        { from: "Coach Rivera", body: "Great work at practice today. Meet entries will be posted tomorrow morning.", time: "4:52 PM" },
        { from: "Maya P.", body: "Can someone send the warmup playlist link again?", time: "5:06 PM" }
      ]
    },
    {
      id: "parents",
      name: "Parents",
      audience: "Family logistics",
      messages: [
        { from: "Booster Club", body: "The snack table is covered for Friday. Thank you to everyone who jumped in.", time: "2:18 PM" }
      ]
    },
    {
      id: "captains",
      name: "Captains",
      audience: "Team leaders and coaches",
      messages: [
        { from: "Coach Malik", body: "Captains, please check in with freshmen before tomorrow's cooldown.", time: "11:12 AM" }
      ]
    }
  ]
};

const tenantCatalog = {
  wolfpack: {
    id: "wolfpack",
    name: "PACK Team Hub",
    sport: "Track and Field",
    logoText: "PACK",
    accessPassword: "Wolfpack2026",
    features: {
      workouts: true,
      schedule: true,
      messages: true,
      resources: true,
      roster: true,
      records: true,
      coachStudio: true
    },
    branding: {
      teamName: "PACK Team Hub",
      logoText: "PACK",
      primary: "#b3261e",
      accent: "#1e6b52",
      surface: "#f7f4ee",
      heroImage: ""
    }
  }
};

const tenantDataDefaults = {
  wolfpack: cloneTeamData(state)
};

const sessionStorageKey = "packSession";
const legacyUsersStorageKey = "packUsers";
const legacyBrandingStorageKey = "packBranding";

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
  teamName: "PACK Team Hub",
  logoText: "PACK",
  primary: "#b3261e",
  accent: "#1e6b52",
  surface: "#f7f4ee",
  heroImage: ""
};

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
const sidebar = document.querySelector(".sidebar");
const mobileMenuButton = document.querySelector("#mobileMenuButton");
const appShell = document.querySelector("#appShell");
const authScreen = document.querySelector("#authScreen");
const authError = document.querySelector("#authError");
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
        title: "Welcome to your team hub",
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
  return tenantCatalog[state.teamId] || tenantCatalog.wolfpack;
}

function firebaseBackend() {
  return window.firebaseBackend || null;
}

function setFormBusy(form, isBusy, label = "Working...") {
  const button = form.querySelector("button[type='submit']");
  if (!button) return;
  if (isBusy) {
    button.dataset.originalText = button.textContent;
    button.textContent = label;
    button.disabled = true;
    return;
  }
  button.textContent = button.dataset.originalText || button.textContent;
  button.disabled = false;
}

function registerTenant(team, coachName = "Head Coach") {
  tenantCatalog[team.id] = {
    id: team.id,
    name: team.name,
    sport: team.sport || "Track and Field",
    logoText: team.logoText || team.branding?.logoText || "TEAM",
    accessPassword: "",
    features: {
      workouts: true,
      schedule: true,
      messages: true,
      resources: true,
      roster: true,
      records: true,
      coachStudio: true,
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

function usersStorageKey() {
  return `packUsers:${state.teamId}`;
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
  const defaults = clone(tenantDataDefaults[teamId]);
  const saved = localStorage.getItem(`packTeamData:${teamId}`);
  return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
}

function persistTeamData() {
  localStorage.setItem(teamDataStorageKey(), JSON.stringify(cloneTeamData(state)));
}

function loadFeatureFlags(teamId) {
  const saved = localStorage.getItem(`packFeatures:${teamId}`);
  return {
    ...tenantCatalog[teamId].features,
    ...(saved ? JSON.parse(saved) : {})
  };
}

function saveFeatureFlags() {
  localStorage.setItem(featuresStorageKey(), JSON.stringify(state.features));
}

function populateTeamSelect() {
  if (!teamSelect) return;
  teamSelect.innerHTML = Object.values(tenantCatalog)
    .map((tenant) => `<option value="${tenant.id}">${tenant.name}</option>`)
    .join("");
  teamSelect.value = state.teamId;
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
  state.teamId = tenantCatalog[teamId] ? teamId : "wolfpack";
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
  applyBranding();
  renderAll();
  applyFeatureFlags();
  tenantNote.textContent = `${currentTenant().name} workspace`;
  if (!options.keepAuth) {
    lockApp();
  }
}

function getUsers() {
  const saved = localStorage.getItem(usersStorageKey());
  const legacyUsers = localStorage.getItem(legacyUsersStorageKey);
  if (!saved && legacyUsers && state.teamId === "wolfpack") {
    localStorage.setItem(usersStorageKey(), legacyUsers);
    return JSON.parse(legacyUsers);
  }
  return saved ? JSON.parse(saved) : [];
}

function saveUsers(users) {
  localStorage.setItem(usersStorageKey(), JSON.stringify(users));
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

function setAuthTab(tab) {
  clearAuthError();
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.authTab === tab);
  });
  document.querySelectorAll("[data-auth-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.authPanel === tab);
  });
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
  const legacyBranding = localStorage.getItem(legacyBrandingStorageKey);
  if (!saved && legacyBranding && state.teamId === "wolfpack") {
    localStorage.setItem(brandingStorageKey(), legacyBranding);
    return { ...defaults, ...JSON.parse(legacyBranding) };
  }
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
  announcementList.innerHTML = state.announcements
    .map((item) => `
      <article class="announcement">
        <strong>${item.title}</strong>
        <p>${item.body}</p>
        <span class="meta">${item.author} - ${item.time}</span>
      </article>
    `)
    .join("");
}

function renderWorkouts() {
  const workouts = state.workouts.filter((item) => state.workoutFilter === "all" || item.group === state.workoutFilter);
  workoutGrid.innerHTML = workouts
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
    .join("");
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
          <span>${event ? event.title : "Open training"}</span>
          <small>${event ? event.time : "Self-led"}</small>
        </article>
      `;
    })
    .join("");

  eventTimeline.innerHTML = state.events
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
    .join("");
}

function renderResources() {
  resourceGrid.innerHTML = state.resources
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
    .join("");
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
  recordList.innerHTML = state.records
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
    .join("");

  historyList.innerHTML = state.history
    .map((item) => `
      <article class="history-item">
        <span class="history-year">${item.year}</span>
        <div>
          <h3>${item.title}</h3>
          <p>${item.body}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderRoster() {
  rosterList.innerHTML = state.roster
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
    .join("");

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
  channelList.innerHTML = state.channels
    .map((channel) => `
      <button class="channel-button ${channel.id === state.activeChannel ? "active" : ""}" type="button" data-channel="${channel.id}">
        <span>
          <strong>${channel.name}</strong><br>
          <small>${channel.audience}</small>
        </span>
        <span class="tag">${channel.messages.length}</span>
      </button>
    `)
    .join("");

  const channel = state.channels.find((item) => item.id === state.activeChannel);
  activeChannelName.textContent = channel.name;
  activeChannelAudience.textContent = channel.audience;
  chatLog.innerHTML = channel.messages
    .map((message) => `
      <article class="chat-message">
        <strong>${message.from}</strong>
        <p>${message.body}</p>
        <span class="meta">${message.time}</span>
      </article>
    `)
    .join("");
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
  setActiveTeam(event.target.value);
  setAuthTab("readonly");
});

document.querySelectorAll("[data-auth-tab]").forEach((button) => {
  button.addEventListener("click", () => setAuthTab(button.dataset.authTab));
});

readonlyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = document.querySelector("#teamPasswordInput").value;
  setFormBusy(readonlyForm, true, "Opening...");

  try {
    if (password !== currentTenant().accessPassword) {
      showAuthError("That team password did not match.");
      return;
    }

    readonlyForm.reset();
    clearAuthError();
    unlockApp({ mode: "readonly", name: "Read-only guest", role: "viewer", teamId: state.teamId });
  } catch (error) {
    showAuthError(error.message || "That team password did not match.");
  } finally {
    setFormBusy(readonlyForm, false);
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.querySelector("#loginEmailInput").value.trim().toLowerCase();
  const password = document.querySelector("#loginPasswordInput").value;
  const backend = firebaseBackend();
  setFormBusy(loginForm, true, "Signing in...");

  try {
    if (backend) {
      const firebaseUser = await backend.signIn(email, password);
      const membership = await backend.getMembership(state.teamId, firebaseUser.uid);
      if (!membership) {
        showAuthError("That account is not connected to this team workspace yet.");
        return;
      }

      loginForm.reset();
      clearAuthError();
      unlockApp({
        mode: "user",
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
        role: membership.role,
        teamId: state.teamId
      });
      return;
    }

    const user = getUsers().find((item) => item.email === email && item.password === password);
    if (!user) {
      showAuthError("No account matched that email and password.");
      return;
    }

    loginForm.reset();
    clearAuthError();
    unlockApp({ mode: "user", name: user.name, email: user.email, role: user.role, teamId: state.teamId });
  } catch (error) {
    showAuthError(error.message || "No account matched that email and password.");
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
  const backend = firebaseBackend();
  setFormBusy(signupForm, true, "Creating team...");

  try {
    if (backend) {
      const createAccount = backend.signUp || backend.signup || backend.Signup;
      if (!createAccount) {
        throw new Error("Firebase signup is not available. Refresh the page and try again.");
      }

      const firebaseUser = await createAccount({ email, password, name });
      const setup = await backend.createTeamForCoach({
        teamName,
        sport,
        logoText,
        accessCode,
        branding
      });

      registerTenant(setup.team, name);
      signupForm.reset();
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
      return;
    }

    const fallbackId = teamName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 42);
    const teamId = fallbackId || `team-${Date.now()}`;
    registerTenant({
      id: teamId,
      name: teamName,
      sport,
      logoText,
      branding: {
        ...branding,
        teamName,
        logoText
      }
    }, name);
    tenantCatalog[teamId].accessPassword = accessCode;
    setActiveTeam(teamId, { keepAuth: true });
    const users = getUsers();
    if (users.some((user) => user.email === email)) {
      showAuthError("An account already exists for that email.");
      return;
    }

    const user = { name, email, password, role: "headCoach" };
    users.push(user);
    saveUsers(users);
    signupForm.reset();
    clearAuthError();
    unlockApp({ mode: "user", name: user.name, email: user.email, role: user.role, teamId });
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
  setAuthTab("readonly");
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

populateTeamSelect();
const savedSession = getSavedSession();
if (savedSession) {
  setActiveTeam(savedSession.teamId || "wolfpack", { keepAuth: true });
  unlockApp(savedSession);
} else {
  setActiveTeam(state.teamId, { keepAuth: true });
  lockApp();
}
setView(location.hash?.replace("#", "") && pageTitles[location.hash.replace("#", "")] ? location.hash.replace("#", "") : "home");
