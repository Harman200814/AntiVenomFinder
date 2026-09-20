// app.js — drives the 3-step flow: identify (manual) -> location -> hospitals.
// Photo-based "AI" identification has been intentionally removed — see the
// README for why a human-confirmed manual choice is more reliable than a
// simulated photo guess, and how all the "AI effort" here went into the
// chatbot's dataset instead.

let chosenSnake = null; // { species, category } or null if skipped
let userLat = null;
let userLng = null;
let resultsMap = null;

const $ = (id) => document.getElementById(id);

function setStepper(activeStep) {
  document.querySelectorAll("#stepper .dot").forEach((dot) => {
    const step = Number(dot.dataset.step);
    dot.classList.toggle("active", step === activeStep);
    dot.classList.toggle("done", step < activeStep);
  });
}
function showStep(stepId, stepperNum) {
  ["step1", "step2", "step3"].forEach((id) => {
    $(id).classList.toggle("step-hidden", id !== stepId);
  });
  setStepper(stepperNum);
}

// ---------- Trust strip (real counts from the database) ----------
fetch("/api/stats")
  .then((r) => r.json())
  .then((stats) => {
    $("trustStrip").innerHTML = `
      <div class="trust-stat"><div class="num">${stats.approvedHospitals}</div><div class="label">Verified Hospitals</div></div>
      <div class="trust-stat"><div class="num">${stats.antivenomTypes}</div><div class="label">Antivenom Types Tracked</div></div>
      <div class="trust-stat"><div class="num">${stats.reportsLogged}</div><div class="label">Incidents Logged</div></div>
    `;
  })
  .catch(() => {});

// ---------- Step 1: manual snake picker ----------
function renderSnakeGrid() {
  const grid = $("snakeGrid");
  grid.innerHTML = "";
  SNAKE_OPTIONS.forEach((opt) => {
    const div = document.createElement("div");
    div.className = "snake-card";
    const visual = opt.photo
      ? `<div class="snake-photo-wrap"><img class="snake-photo" src="${opt.photo}" alt="${opt.species}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" /><div class="snake-photo-fallback" style="display:none">${ICONS[opt.icon]}</div></div>`
      : ICONS[opt.icon];
    div.innerHTML = `
      ${visual}
      <div class="sname">${opt.species}</div>
      <div class="scat">${opt.danger}</div>
      <div class="snake-note">${opt.note}</div>
      ${opt.photoCredit ? `<div class="photo-credit">Photo: ${opt.photoCredit}</div>` : ""}
    `;
    div.addEventListener("click", () => {
      document.querySelectorAll(".snake-card").forEach((c) => c.classList.remove("selected"));
      div.classList.add("selected");
      chosenSnake = { species: opt.species, category: opt.category, note: opt.note };
      $("reportSection").classList.remove("step-hidden");
      showStep("step2", 2);
    });
    grid.appendChild(div);
  });
}
renderSnakeGrid();

$("skipIdBtn").addEventListener("click", () => {
  chosenSnake = null;
  showStep("step2", 2);
});
$("backToIdBtn").addEventListener("click", () => showStep("step1", 1));

// ---------- Step 2: location + address autocomplete (Nominatim / OSM) ----------
let addressDebounce = null;

$("useLocationBtn").addEventListener("click", () => {
  $("locationStatus").textContent = "Detecting location...";
  if (!navigator.geolocation) {
    $("locationStatus").textContent = "Geolocation not supported — type an address or enter coordinates.";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      $("latInput").value = userLat.toFixed(4);
      $("lngInput").value = userLng.toFixed(4);
      $("locationStatus").textContent = "Location detected ✔";
      $("resolvedAddress").textContent = `Using GPS: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}`;
      // Reverse-geocode for a friendly label
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}`, {
        headers: { Accept: "application/json" },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.display_name) {
            $("addressInput").value = data.display_name.split(",").slice(0, 3).join(",");
            $("resolvedAddress").textContent = data.display_name;
          }
        })
        .catch(() => {});
    },
    () => { $("locationStatus").textContent = "Couldn't detect GPS — type an address below or enter coordinates."; }
  );
});

function hideSuggestions() {
  const ul = $("addressSuggestions");
  ul.classList.add("step-hidden");
  ul.innerHTML = "";
}

function showSuggestions(items) {
  const ul = $("addressSuggestions");
  ul.innerHTML = "";
  if (!items.length) {
    hideSuggestions();
    return;
  }
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.display_name;
    li.addEventListener("click", () => {
      $("addressInput").value = item.display_name;
      userLat = parseFloat(item.lat);
      userLng = parseFloat(item.lon);
      $("latInput").value = userLat.toFixed(5);
      $("lngInput").value = userLng.toFixed(5);
      $("resolvedAddress").textContent = `📍 ${item.display_name}`;
      $("locationStatus").textContent = "Address selected ✔";
      hideSuggestions();
    });
    ul.appendChild(li);
  });
  ul.classList.remove("step-hidden");
}

$("addressInput").addEventListener("input", () => {
  const q = $("addressInput").value.trim();
  clearTimeout(addressDebounce);
  if (q.length < 3) {
    hideSuggestions();
    return;
  }
  addressDebounce = setTimeout(async () => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&limit=6&addressdetails=0`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const data = await res.json();
      showSuggestions(Array.isArray(data) ? data : []);
    } catch {
      hideSuggestions();
    }
  }, 350);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".autocomplete-wrap")) hideSuggestions();
});

$("findHospitalsBtn").addEventListener("click", async () => {
  const lat = parseFloat($("latInput").value);
  const lng = parseFloat($("lngInput").value);
  if (isNaN(lat) || isNaN(lng)) {
    alert("Please provide a valid location (use the button or enter coordinates).");
    return;
  }
  userLat = lat; userLng = lng;

  // Default to "Viper" category (covers the majority of serious Indian
  // snakebites) when the user skipped identification, so a hospital search
  // still runs — better than blocking them entirely.
  const category = chosenSnake ? chosenSnake.category : "Viper";
  $("searchingFor").textContent = chosenSnake
    ? `Hospitals reporting "${category}" antivenom (you identified: ${chosenSnake.species}), sorted by distance:`
    : `Showing hospitals reporting general antivenom stock, sorted by distance. Tell hospital staff you're not sure of the species.`;

  $("hospitalList").innerHTML = "Searching...";
  showStep("step3", 3);

  const res = await fetch("/api/hospitals/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, lat, lng }),
  });
  const hospitals = await res.json();
  renderHospitals(hospitals);
  renderMap(hospitals, lat, lng);
});

function statusText(status) {
  if (status === "green") return "Available";
  if (status === "yellow") return "Reported available (info may be outdated)";
  return "Not reported available";
}
function timeAgo(iso) {
  if (!iso) return "no data";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins} min ago`;
  return `${Math.round(mins / 60)} hr ago`;
}

function renderHospitals(hospitals) {
  const container = $("hospitalList");
  container.innerHTML = "";
  hospitals.forEach((h) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="hospital">
        <div>
          <div class="hospital-name-row">
            <strong>${h.name}</strong>
            <span class="verified-badge">✔ Verified</span>
          </div>
          <div class="hospital-meta">${h.address}</div>
          <div class="hospital-icons">
            <span class="icon-chip" title="Hospital">${ICONS.hospital}</span>
            <span class="icon-chip" title="Antivenom">${ICONS.vial}</span>
            <span class="icon-chip" title="Location">${ICONS.pin}</span>
          </div>
          <div class="hospital-meta" style="margin-top:6px;">
            <span class="status-dot status-${h.status}"></span>
            <span class="status-label status-${h.status}-text">${statusText(h.status)}</span>
            ${h.quantity ? ` · ${h.quantity} vials` : ""}
          </div>
          <div class="hospital-meta">Last updated: ${timeAgo(h.lastUpdated)}</div>
        </div>
        <div class="distance">${h.distanceKm} km</div>
      </div>
      <div class="btn-row">
        <a class="btn" href="tel:${h.phone}">${ICONS.phone} Call</a>
        <a class="btn secondary" target="_blank" rel="noopener"
           href="https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}">Directions</a>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderMap(hospitals, lat, lng) {
  if (resultsMap) { resultsMap.remove(); resultsMap = null; }
  resultsMap = L.map("resultsMap").setView([lat, lng], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18,
  }).addTo(resultsMap);

  const youIcon = L.divIcon({ className: "", html: '<div style="background:#2f6fa8;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4)"></div>', iconSize: [16, 16] });
  L.marker([lat, lng], { icon: youIcon }).addTo(resultsMap).bindPopup("You are here");

  hospitals.forEach((h) => {
    const color = h.status === "green" ? "#1e9e5a" : h.status === "yellow" ? "#b8860b" : "#c0392b";
    const icon = L.divIcon({ className: "", html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 3px rgba(0,0,0,0.4)"></div>`, iconSize: [14, 14] });
    L.marker([h.lat, h.lng], { icon }).addTo(resultsMap)
      .bindPopup(`<strong>${h.name}</strong><br>${h.distanceKm} km away<br>${statusText(h.status)}`);
  });
}

// ---------- Optional bite report ----------
$("submitReportBtn").addEventListener("click", async () => {
  const phone = $("reportPhone").value.trim();
  const notes = $("reportNotes").value.trim();
  $("reportStatus").textContent = "Submitting...";
  try {
    await fetch("/api/bite-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ai_species: chosenSnake?.species || null,
        ai_category: chosenSnake?.category || null,
        ai_confidence: null,
        lat: userLat,
        lng: userLng,
        notes,
        phone,
      }),
    });
    $("reportStatus").textContent = "Thank you — this helps improve regional coverage.";
  } catch {
    $("reportStatus").textContent = "Couldn't submit right now, but hospital search still works fine.";
  }
});

// ---------- Start over ----------
$("startOverBtn").addEventListener("click", () => {
  chosenSnake = null;
  userLat = null;
  userLng = null;
  document.querySelectorAll(".snake-card").forEach((c) => c.classList.remove("selected"));
  $("latInput").value = "";
  $("lngInput").value = "";
  $("addressInput").value = "";
  $("resolvedAddress").textContent = "";
  $("locationStatus").textContent = "Or type your address — suggestions appear as you type (OpenStreetMap):";
  $("reportSection").classList.add("step-hidden");
  $("reportPhone").value = "";
  $("reportNotes").value = "";
  $("reportStatus").textContent = "";
  hideSuggestions();
  showStep("step1", 1);
});
