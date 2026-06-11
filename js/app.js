/* ============================================================
   Vastu Room Guide — quick-reference logic
   Click a room chip or type a room name -> the 3x3 house map
   lights up green (best) / orange (second best) / red (avoid),
   with the traditional Vastu Purusha Mandala shown below it.
   ============================================================ */

const $ = (sel) => document.querySelector(sel);

function zoneStatus(room, dir) {
  if (room.best.includes(dir)) return "best";
  if (room.good.includes(dir)) return "good";
  if (room.avoid.includes(dir)) return "avoid";
  return "neutral";
}

function dirNames(dirs) {
  return dirs.map((d) => DIRECTIONS[d].label).join(", ");
}

function findRoom(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return (
    ROOMS.find((r) => r.name.toLowerCase() === q || r.aliases.includes(q)) ||
    ROOMS.find((r) => r.aliases.some((a) => a.startsWith(q)) || r.name.toLowerCase().startsWith(q)) ||
    ROOMS.find((r) => r.aliases.some((a) => a.includes(q)) || r.name.toLowerCase().includes(q))
  );
}

function matchRooms(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ROOMS.filter(
    (r) => r.name.toLowerCase().includes(q) || r.aliases.some((a) => a.includes(q))
  ).slice(0, 7);
}

/* ---------------- house map ---------------- */
function renderMap(room) {
  const map = $("#house-map");
  map.innerHTML = GRID_ORDER.map((dir) => {
    const d = DIRECTIONS[dir];
    const status = room ? zoneStatus(room, dir) : "neutral";
    const verdict =
      status === "best" ? "BEST" : status === "good" ? "GOOD" : status === "avoid" ? "AVOID" : "";
    return `
      <div class="zone ${status}" data-dir="${dir}" title="${d.label} (${d.hindi}) — ${d.deity}: ${d.domain} · Element: ${d.element}">
        <span class="dir">${dir === "C" ? "⊙" : dir}</span>
        <span class="hindi">${d.hindi}</span>
        ${verdict ? `<span class="verdict">${verdict}</span>` : ""}
      </div>`;
  }).join("");
}

/* ---------------- Vastu Purusha Mandala (static reference) ---------------- */
function renderMandala() {
  $("#mandala-grid").innerHTML = GRID_ORDER.map((dir) => {
    const d = DIRECTIONS[dir];
    return `
      <div class="m-zone ${d.rating}">
        <span class="m-deity">${d.deity}</span>
        <span class="m-domain">${d.domain}</span>
        <span class="m-nature">${d.nature}</span>
      </div>`;
  }).join("");
}

/* ---------------- room display ---------------- */
function showRoom(room) {
  renderMap(room);

  $("#room-info").innerHTML = `
    <div class="room-title">${room.icon} ${room.name}</div>
    <div class="verdict-rows">
      <div class="verdict-row best"><b>Best:</b> <span>${dirNames(room.best)}</span></div>
      ${room.good.length ? `<div class="verdict-row good"><b>Second best:</b> <span>${dirNames(room.good)}</span></div>` : ""}
      <div class="verdict-row avoid"><b>Always avoid:</b> <span>${dirNames(room.avoid)}</span></div>
    </div>
    <div class="why">${room.why}</div>
    <div class="tips">
      <h4>Placement Notes</h4>
      <ul>${room.tips.map((t) => `<li>${t}</li>`).join("")}</ul>
    </div>`;

  document.querySelectorAll(".chip").forEach((c) =>
    c.classList.toggle("selected", c.dataset.id === room.id)
  );
}

function renderChips() {
  $("#chips").innerHTML = ROOMS.map(
    (r) => `<span class="chip" data-id="${r.id}">${r.icon} ${r.name}</span>`
  ).join("");
  document.querySelectorAll(".chip").forEach((c) =>
    c.addEventListener("click", () => {
      $("#room-search").value = "";
      closeSuggestions();
      showRoom(ROOMS.find((r) => r.id === c.dataset.id));
    })
  );
}

/* ---------------- search / autocomplete ---------------- */
let focusedSuggestion = -1;

function openSuggestions(items) {
  const box = $("#suggestions");
  if (!items.length) return closeSuggestions();
  box.innerHTML = items
    .map(
      (r) => `
      <div class="suggestion" data-id="${r.id}">
        <span>${r.icon}</span><span>${r.name}</span>
        <span class="alias">${r.best.map((d) => DIRECTIONS[d].label).join(", ")}</span>
      </div>`
    )
    .join("");
  box.classList.add("open");
  focusedSuggestion = -1;
  box.querySelectorAll(".suggestion").forEach((s) =>
    s.addEventListener("mousedown", (e) => {
      e.preventDefault();
      pickSuggestion(s.dataset.id);
    })
  );
}
function closeSuggestions() {
  $("#suggestions").classList.remove("open");
  focusedSuggestion = -1;
}
function pickSuggestion(id) {
  const room = ROOMS.find((r) => r.id === id);
  $("#room-search").value = room.name;
  closeSuggestions();
  showRoom(room);
}

function initSearch() {
  const input = $("#room-search");
  input.addEventListener("input", () => {
    const matches = matchRooms(input.value);
    openSuggestions(matches);
    const exact = findRoom(input.value);
    if (exact && (input.value.trim().toLowerCase() === exact.name.toLowerCase() ||
                  exact.aliases.includes(input.value.trim().toLowerCase()))) {
      showRoom(exact);
    }
  });
  input.addEventListener("keydown", (e) => {
    const items = $("#suggestions").querySelectorAll(".suggestion");
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!items.length) return;
      focusedSuggestion =
        (focusedSuggestion + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items.forEach((s, i) => s.classList.toggle("focused", i === focusedSuggestion));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedSuggestion >= 0 && items[focusedSuggestion]) {
        pickSuggestion(items[focusedSuggestion].dataset.id);
      } else {
        const room = findRoom(input.value);
        if (room) {
          input.value = room.name;
          closeSuggestions();
          showRoom(room);
        }
      }
    } else if (e.key === "Escape") {
      closeSuggestions();
    }
  });
  input.addEventListener("blur", () => setTimeout(closeSuggestions, 150));
}

/* ---------------- boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderChips();
  renderMap(null);
  renderMandala();
  initSearch();
});
