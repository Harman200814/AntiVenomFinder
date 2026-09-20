// admin.js — protected admin panel

const $ = (id) => document.getElementById(id);

async function init() {
  const meRes = await fetch("/api/admin/me");
  const me = await meRes.json();
  if (!me.isAdmin) {
    window.location.href = "admin-login.html";
    return;
  }
  await loadHospitals();
}

async function loadHospitals() {
  const res = await fetch("/api/admin/hospitals");
  if (!res.ok) { window.location.href = "admin-login.html"; return; }
  const hospitals = await res.json();
  renderRows(hospitals);
}

function renderRows(hospitals) {
  const tbody = $("hospitalRows");
  tbody.innerHTML = "";
  hospitals.forEach((h) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${h.name}</strong></td>
      <td>${h.address || "—"}<br><span class="small">${h.lat.toFixed(3)}, ${h.lng.toFixed(3)}</span></td>
      <td>${h.email}<br><span class="small">${h.phone || "—"}</span></td>
      <td class="small">${new Date(h.created_at).toLocaleDateString()}</td>
      <td><span class="status-pill ${h.status}">${h.status}</span></td>
      <td>
        <div class="admin-actions">
          <button class="btn" data-id="${h.id}" data-status="approved">Approve</button>
          <button class="btn secondary" data-id="${h.id}" data-status="rejected">Reject</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("button[data-status]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await fetch(`/api/admin/hospitals/${btn.dataset.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: btn.dataset.status }),
      });
      loadHospitals();
    });
  });
}

$("logoutLink").addEventListener("click", async (e) => {
  e.preventDefault();
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "admin-login.html";
});

init();
