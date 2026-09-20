// dashboard.js — protected hospital dashboard with improved stock controls

const $ = (id) => document.getElementById(id);

async function init() {
  const meRes = await fetch("/api/hospital/me");
  if (!meRes.ok) {
    window.location.href = "hospital-login.html";
    return;
  }
  const me = await meRes.json();
  $("hospitalNameHeader").textContent = me.name;

  const banner = $("statusBanner");
  if (me.status === "pending") {
    banner.textContent =
      "Your registration is pending review by the site operator. You can still update inventory now — it will appear in public search as soon as you're approved.";
    banner.classList.remove("step-hidden");
  } else if (me.status === "rejected") {
    banner.textContent =
      "Your registration was not approved. Contact the site operator if you believe this is a mistake.";
    banner.classList.remove("step-hidden");
  }

  $("regInfo").innerHTML = `
    <strong>${me.name}</strong><br>
    ${me.address || "No address"}<br>
    Phone: ${me.phone || "—"} · Email: ${me.email || "—"}<br>
    Status: <strong>${me.status}</strong>
    ${me.status === "approved" ? " ✔ Visible in public search" : ""}
  `;

  await loadInventory();
}

async function loadInventory() {
  const res = await fetch("/api/hospital/inventory");
  if (!res.ok) {
    window.location.href = "hospital-login.html";
    return;
  }
  const rows = await res.json();
  renderInventory(rows);
}

function freshnessLabel(available, quantity, lastUpdated) {
  if (!available || quantity <= 0) return { text: "Not available", cls: "status-red-text" };
  if (!lastUpdated) return { text: "Never updated", cls: "status-yellow-text" };
  const ageHours = (Date.now() - new Date(lastUpdated).getTime()) / 36e5;
  if (ageHours <= 1) return { text: "Fresh (updated < 1h)", cls: "status-green-text" };
  if (ageHours <= 24) return { text: `Updated ${Math.round(ageHours)}h ago`, cls: "status-yellow-text" };
  return { text: `Stale (${Math.round(ageHours / 24)}d ago)`, cls: "status-red-text" };
}

function renderInventory(rows) {
  const list = $("inventoryList");
  list.innerHTML = "";
  rows.forEach((row) => {
    const fresh = freshnessLabel(row.available, row.quantity || 0, row.last_updated);
    const div = document.createElement("div");
    div.className = "inv-row inv-row-enhanced";
    div.innerHTML = `
      <div class="inv-head">
        <span class="inv-label">${row.category}</span>
        <span class="small ${fresh.cls}">${fresh.text}</span>
      </div>
      <div class="inv-controls">
        <button type="button" class="qty-btn" data-action="minus" data-category="${row.category}" aria-label="Decrease">−</button>
        <input type="number" min="0" value="${row.quantity || 0}" data-category="${row.category}" data-field="quantity" class="qty-input" />
        <button type="button" class="qty-btn" data-action="plus" data-category="${row.category}" aria-label="Increase">+</button>
        <label class="avail-label">
          <input type="checkbox" data-category="${row.category}" data-field="available" ${row.available ? "checked" : ""} />
          Available
        </label>
      </div>
      <div class="small">Last updated: ${row.last_updated ? new Date(row.last_updated).toLocaleString() : "never"}</div>
    `;
    list.appendChild(div);
  });

  list.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.category;
      const input = list.querySelector(`input[data-field="quantity"][data-category="${cat}"]`);
      let v = Number(input.value) || 0;
      if (btn.dataset.action === "plus") v += 1;
      else v = Math.max(0, v - 1);
      input.value = v;
      // Auto-check available when stock > 0
      const avail = list.querySelector(`input[data-field="available"][data-category="${cat}"]`);
      if (v > 0) avail.checked = true;
      if (v === 0) avail.checked = false;
    });
  });
}

$("saveBtn").addEventListener("click", async () => {
  $("saveStatus").textContent = "Saving…";
  const rows = document.querySelectorAll("#inventoryList .inv-row");
  for (const row of rows) {
    const qtyInput = row.querySelector('input[data-field="quantity"]');
    const availInput = row.querySelector('input[data-field="available"]');
    await fetch("/api/hospital/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: qtyInput.dataset.category,
        quantity: Number(qtyInput.value),
        available: availInput.checked,
      }),
    });
  }
  $("saveStatus").textContent = "Saved ✔ — public search will show the new stock";
  await loadInventory();
});

$("markAllAvailableBtn").addEventListener("click", () => {
  document.querySelectorAll('#inventoryList input[data-field="available"]').forEach((cb) => {
    cb.checked = true;
  });
  $("saveStatus").textContent = "Marked available — click Save to publish";
});

$("logoutLink").addEventListener("click", async (e) => {
  e.preventDefault();
  await fetch("/api/hospital/logout", { method: "POST" });
  window.location.href = "hospital-login.html";
});

// ---------- Doctor contacts ----------
async function loadDoctors() {
  const res = await fetch("/api/hospital/doctors");
  if (!res.ok) return;
  const doctors = await res.json();
  const list = $("doctorList");
  list.innerHTML = doctors.length ? "" : '<p class="small">No doctors listed yet.</p>';
  doctors.forEach((d) => {
    const row = document.createElement("div");
    row.className = "contact-row";
    row.innerHTML = `
      <div>
        <div class="c-name">${d.name}</div>
        <div class="c-meta">${d.specialty || "General"} · ${d.phone || "no phone"}</div>
      </div>
      <button class="btn secondary" data-id="${d.id}">Remove</button>
    `;
    row.querySelector("button").addEventListener("click", async () => {
      await fetch(`/api/hospital/doctors/${d.id}`, { method: "DELETE" });
      loadDoctors();
    });
    list.appendChild(row);
  });
}

$("addDoctorBtn").addEventListener("click", async () => {
  const name = $("doctorName").value.trim();
  const specialty = $("doctorSpecialty").value.trim();
  const phone = $("doctorPhone").value.trim();
  if (!name) {
    alert("Doctor name is required.");
    return;
  }
  await fetch("/api/hospital/doctors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, specialty, phone }),
  });
  $("doctorName").value = "";
  $("doctorSpecialty").value = "";
  $("doctorPhone").value = "";
  loadDoctors();
});

init();
loadDoctors();
