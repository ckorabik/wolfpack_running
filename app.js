// ----- Sample season stats -----
const seasonStats = [
    {
      name: "Chris K.",
      grade: "Coach",
      totalMiles: 420,
      pr5k: "15:30",
      notes: "Coach / sample data"
    },
    {
      name: "Athlete A",
      grade: "12",
      totalMiles: 310,
      pr5k: "16:20",
      notes: "Varsity leader"
    },
    {
      name: "Athlete B",
      grade: "11",
      totalMiles: 280,
      pr5k: "16:45",
      notes: ""
    }
  ];
  
  // ----- DOM references -----
  const statsTableBody = document.querySelector("#stats-table tbody");
  const sectionStats = document.querySelector("#section-stats");
  const sectionMileage = document.querySelector("#section-mileage");
  const tabStats = document.querySelector("#tab-stats");
  const tabMileage = document.querySelector("#tab-mileage");
  
  const mileageForm = document.querySelector("#mileage-form");
  const mileageList = document.querySelector("#mileage-list");
  
  // ----- Utility: mileage storage key -----
  const STORAGE_KEY = "xc_mileage_entries_v1";
  
  // ----- Initialize -----
  document.addEventListener("DOMContentLoaded", () => {
    renderStatsTable();
    setupTabs();
    setupMileage();
    setYearInFooter();
  });
  
  // ----- Stats rendering -----
  function renderStatsTable() {
    statsTableBody.innerHTML = "";
    seasonStats.forEach((runner) => {
      const tr = document.createElement("tr");
  
      tr.innerHTML = `
        <td>${runner.name}</td>
        <td>${runner.grade}</td>
        <td>${runner.totalMiles}</td>
        <td>${runner.pr5k}</td>
        <td>${runner.notes || ""}</td>
      `;
  
      statsTableBody.appendChild(tr);
    });
  }
  
  // ----- Tabs logic -----
  function setupTabs() {
    tabStats.addEventListener("click", () => {
      tabStats.classList.add("active");
      tabMileage.classList.remove("active");
      sectionStats.classList.remove("hidden");
      sectionMileage.classList.add("hidden");
    });
  
    tabMileage.addEventListener("click", () => {
      tabMileage.classList.add("active");
      tabStats.classList.remove("active");
      sectionMileage.classList.remove("hidden");
      sectionStats.classList.add("hidden");
    });
  }
  
  // ----- Mileage logic -----
  function setupMileage() {
    // Load existing entries
    const entries = loadMileageEntries();
    renderMileageList(entries);
  
    mileageForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const dateInput = document.querySelector("#log-date");
      const nameInput = document.querySelector("#log-name");
      const milesInput = document.querySelector("#log-miles");
      const notesInput = document.querySelector("#log-notes");
  
      const newEntry = {
        id: Date.now(),
        date: dateInput.value || new Date().toISOString().slice(0, 10),
        name: nameInput.value.trim(),
        miles: Number(milesInput.value),
        notes: notesInput.value.trim()
      };
  
      if (!newEntry.name || !newEntry.miles) {
        alert("Please enter at least a name and miles.");
        return;
      }
  
      const updatedEntries = [newEntry, ...loadMileageEntries()];
      saveMileageEntries(updatedEntries);
      renderMileageList(updatedEntries);
  
      mileageForm.reset();
    });
  }
  
  function loadMileageEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error loading mileage entries", e);
      return [];
    }
  }
  
  function saveMileageEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
  
  function renderMileageList(entries) {
    mileageList.innerHTML = "";
  
    if (!entries.length) {
      const li = document.createElement("li");
      li.textContent = "No mileage logged yet.";
      mileageList.appendChild(li);
      return;
    }
  
    entries.forEach((entry) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div><strong>${entry.date}</strong> — ${entry.name}</div>
        <div>${entry.miles.toFixed(1)} miles</div>
        ${
          entry.notes
            ? `<div><em>${entry.notes}</em></div>`
            : ""
        }
      `;
      mileageList.appendChild(li);
    });
  }
  
  // ----- Footer year -----
  function setYearInFooter() {
    const span = document.querySelector("#year");
    if (span) {
      span.textContent = new Date().getFullYear();
    }
  }
  