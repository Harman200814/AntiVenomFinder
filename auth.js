// auth.js — handles both hospital-login.html and hospital-register.html

const $ = (id) => document.getElementById(id);

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

// ---- Login page ----
if ($("loginBtn")) {
  $("loginBtn").addEventListener("click", async () => {
    $("errorMsg").textContent = "";
    try {
      await postJSON("/api/hospital/login", {
        email: $("email").value.trim(),
        password: $("password").value,
      });
      window.location.href = "hospital-dashboard.html";
    } catch (err) {
      $("errorMsg").textContent = err.message;
    }
  });
}

// ---- Register page: address autocomplete + GPS ----
if ($("registerBtn")) {
  let addressDebounce = null;

  function hideSuggestions() {
    const ul = $("addressSuggestions");
    if (!ul) return;
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
        $("address").value = item.display_name;
        $("lat").value = parseFloat(item.lat).toFixed(6);
        $("lng").value = parseFloat(item.lon).toFixed(6);
        $("geoStatus").textContent = `📍 Location set: ${item.display_name.split(",").slice(0, 2).join(",")}`;
        hideSuggestions();
      });
      ul.appendChild(li);
    });
    ul.classList.remove("step-hidden");
  }

  $("address").addEventListener("input", () => {
    const q = $("address").value.trim();
    clearTimeout(addressDebounce);
    if (q.length < 3) {
      hideSuggestions();
      return;
    }
    addressDebounce = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&limit=6`;
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

  if ($("useGpsBtn")) {
    $("useGpsBtn").addEventListener("click", () => {
      $("geoStatus").textContent = "Detecting GPS…";
      if (!navigator.geolocation) {
        $("geoStatus").textContent = "GPS not supported on this device — type an address instead.";
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          $("lat").value = pos.coords.latitude.toFixed(6);
          $("lng").value = pos.coords.longitude.toFixed(6);
          $("geoStatus").textContent = "GPS coordinates filled ✔ — still enter a readable address above.";
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
            { headers: { Accept: "application/json" } }
          )
            .then((r) => r.json())
            .then((data) => {
              if (data && data.display_name) {
                $("address").value = data.display_name;
                $("geoStatus").textContent = `📍 ${data.display_name}`;
              }
            })
            .catch(() => {});
        },
        () => {
          $("geoStatus").textContent = "Couldn't get GPS — type your hospital address and pick a suggestion.";
        }
      );
    });
  }

  $("registerBtn").addEventListener("click", async () => {
    $("errorMsg").textContent = "";
    const lat = parseFloat($("lat").value);
    const lng = parseFloat($("lng").value);
    if (!$("name").value.trim()) {
      $("errorMsg").textContent = "Hospital name is required.";
      return;
    }
    if (!$("address").value.trim()) {
      $("errorMsg").textContent = "Please enter an address and select a suggestion so location is set.";
      return;
    }
    if (isNaN(lat) || isNaN(lng)) {
      $("errorMsg").textContent =
        "Location not set yet. Type your address and click a suggestion, or use the GPS button.";
      return;
    }
    if ($("password").value.length < 6) {
      $("errorMsg").textContent = "Password must be at least 6 characters.";
      return;
    }
    try {
      await postJSON("/api/hospital/register", {
        name: $("name").value.trim(),
        address: $("address").value.trim(),
        lat,
        lng,
        phone: $("phone").value.trim(),
        email: $("email").value.trim(),
        password: $("password").value,
      });
      window.location.href = "hospital-dashboard.html";
    } catch (err) {
      $("errorMsg").textContent = err.message;
    }
  });
}
