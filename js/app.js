/* ============================================================
   Vastu Room Guide — quick-reference logic
   Click a room chip or type a room name -> the 3x3 house map
   lights up green (best) / orange (second best) / red (avoid),
   with the traditional Vastu Purusha Mandala shown below it.
   ============================================================ */

const $ = (sel) => document.querySelector(sel);

/* Returns the CSS class + the badge label for a zone, given a room.
   best   -> green  "BEST"
   second -> orange "2A", "2B", "2C" … (in priority order)
   avoid  -> red    "AVOID"                                       */
function zoneVerdict(room, dir) {
  if (room.best === dir) return { cls: "best", label: "1 · BEST" };
  const si = room.second.indexOf(dir);
  if (si !== -1) return { cls: "good", label: "2" + String.fromCharCode(65 + si) };
  if (room.avoid.includes(dir)) return { cls: "avoid", label: "AVOID" };
  return { cls: "neutral", label: "" };
}

function dirLabel(dir) {
  return DIRECTIONS[dir].label;
}
function dirNames(dirs) {
  return dirs.map(dirLabel).join(", ");
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
let currentRoom = null;

function renderMap(room) {
  const map = $("#house-map");
  map.innerHTML = GRID_ORDER.map((dir) => {
    const d = DIRECTIONS[dir];
    const v = room ? zoneVerdict(room, dir) : { cls: "neutral", label: "" };
    return `
      <div class="zone ${v.cls}" data-dir="${dir}" title="Click for the full ${d.label} zone profile">
        <span class="dir">${dir === "C" ? "⊙" : dir}</span>
        <span class="hindi">${d.hindi}</span>
        ${v.label ? `<span class="verdict">${v.label}</span>` : ""}
      </div>`;
  }).join("");
  map.querySelectorAll(".zone").forEach((z) =>
    z.addEventListener("click", () => showZone(z.dataset.dir))
  );
}

/* ---------------- zone profile (reverse lookup) ---------------- */
function roomsByZone(dir, kind) {
  if (kind === "best")   return ROOMS.filter((r) => r.best === dir);
  if (kind === "second") return ROOMS.filter((r) => r.second.includes(dir));
  return ROOMS.filter((r) => r.avoid.includes(dir));
}

function roomList(rooms) {
  if (!rooms.length) return "<em>—</em>";
  return rooms
    .map((r) => `<span class="zone-room" data-id="${r.id}">${r.icon} ${r.name}</span>`)
    .join("");
}

function showZone(dir) {
  const d = DIRECTIONS[dir];
  document.querySelectorAll("#house-map .zone").forEach((z) =>
    z.classList.toggle("picked", z.dataset.dir === dir)
  );

  $("#room-info").innerHTML = `
    <div class="zone-head">
      <div class="room-title">🧭 ${d.label} <span class="zone-hindi">(${d.hindi})</span></div>
      <button class="back-btn" id="zone-back">✕ back</button>
    </div>
    <div class="zone-meta">
      <span><b>Deity:</b> ${d.deity} — ${d.domain}</span>
      <span><b>Element:</b> ${d.element}</span>
      <span><b>Nature:</b> ${d.nature}</span>
    </div>
    <div class="verdict-rows">
      <div class="verdict-row best"><b>Best for (1):</b> <span class="zone-rooms">${roomList(roomsByZone(dir, "best"))}</span></div>
      <div class="verdict-row good"><b>2nd-best for:</b> <span class="zone-rooms">${roomList(roomsByZone(dir, "second"))}</span></div>
      <div class="verdict-row avoid"><b>Never here:</b> <span class="zone-rooms">${roomList(roomsByZone(dir, "avoid"))}</span></div>
    </div>
    <div class="tips">
      <h4>Interior Palette — ${d.label}</h4>
      <ul>
        <li><b>Colours:</b> ${d.interiors.colors}</li>
        <li><b>Furniture:</b> ${d.interiors.furniture}</li>
        <li><b>Materials:</b> ${d.interiors.materials}</li>
        <li><b>Décor:</b> ${d.interiors.decor}</li>
      </ul>
    </div>`;

  $("#zone-back").addEventListener("click", () => {
    document.querySelectorAll("#house-map .zone").forEach((z) => z.classList.remove("picked"));
    if (currentRoom) showRoom(currentRoom);
    else $("#room-info").innerHTML = $("#placeholder-template").innerHTML;
  });
  $("#room-info").querySelectorAll(".zone-room").forEach((el) =>
    el.addEventListener("click", () => {
      document.querySelectorAll("#house-map .zone").forEach((z) => z.classList.remove("picked"));
      showRoom(ROOMS.find((r) => r.id === el.dataset.id));
    })
  );
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
  currentRoom = room;
  renderMap(room);

  const entranceLink = room.id === "main-entrance"
    ? `<a class="section-link" href="#entrance">Open the 32-pada Entrance Planner ↓</a>`
    : "";

  const secondRows = room.second
    .map((dir, i) => {
      const tag = "2" + String.fromCharCode(65 + i);
      return `<div class="verdict-row good">
                <b><span class="tag">${tag}</span> Second best:</b> <span>${dirLabel(dir)}</span>
              </div>`;
    })
    .join("");

  $("#room-info").innerHTML = `
    <div class="room-title">${room.icon} ${room.name}</div>
    <div class="verdict-rows">
      <div class="verdict-row best"><b><span class="tag">1</span> Best:</b> <span>${dirLabel(room.best)}</span></div>
      ${secondRows}
      <div class="verdict-row avoid"><b>Always avoid:</b> <span>${dirNames(room.avoid)}</span></div>
    </div>
    <div class="why">${room.why}</div>
    <div class="tips">
      <h4>Placement Notes</h4>
      <ul>${room.tips.map((t) => `<li>${t}</li>`).join("")}</ul>
    </div>
    ${entranceLink}`;

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
        <span class="alias">${dirLabel(r.best)}</span>
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

/* ---------------- 32-pada entrance ring ---------------- */
/* The ring is a 9x9 grid: top row N1..N8 + E1 (NE corner),
   right column E2..E8 + S1 (SE), bottom row S2..S8 + W1 (SW),
   left column W2..W8. 9+8+8+7 = 32 cells. */
function padaPosition(code) {
  const side = code[0];
  const i = parseInt(code.slice(1), 10);
  if (side === "N") return { row: 1, col: i };           // N1..N8 -> cols 1..8
  if (side === "E") return i === 1 ? { row: 1, col: 9 }  // E1 = NE corner
                                   : { row: i, col: 9 }; // E2..E8 -> rows 2..8
  if (side === "S") return i === 1 ? { row: 9, col: 9 }  // S1 = SE corner
                                   : { row: 9, col: 10 - i }; // S2..S8 -> cols 8..2
  /* W */          return i === 1 ? { row: 9, col: 1 }   // W1 = SW corner
                                   : { row: 10 - i, col: 1 }; // W2..W8 -> rows 8..2
}

function renderPadas() {
  const ring = $("#pada-ring");
  ring.innerHTML =
    PADAS.map((p) => {
      const pos = padaPosition(p.code);
      return `
        <div class="pada ${p.verdict}" data-code="${p.code}"
             style="grid-row:${pos.row};grid-column:${pos.col}"
             title="${p.code} — ${p.deity}">
          <span class="p-code">${p.code}</span>
          <span class="p-deity">${p.deity}</span>
        </div>`;
    }).join("") +
    `<div class="pada-core">
       <span>House<br>footprint</span>
       <span class="pada-core-sub">door position is measured<br>along the outer wall</span>
     </div>`;

  ring.querySelectorAll(".pada").forEach((el) =>
    el.addEventListener("click", () => showPada(el.dataset.code))
  );
  showPada("N3");
}

function showPada(code) {
  const p = PADAS.find((x) => x.code === code);
  $("#pada-ring").querySelectorAll(".pada").forEach((el) =>
    el.classList.toggle("picked", el.dataset.code === code)
  );
  const verdictText =
    p.verdict === "best" ? "Auspicious — ideal door position"
    : p.verdict === "good" ? "Acceptable door position"
    : "Avoid placing the door here";
  $("#pada-detail").innerHTML = `
    <div class="verdict-row ${p.verdict}">
      <b>${p.code} · ${p.deity}</b>
      <span>${verdictText} — ${p.effect}.</span>
    </div>`;
}

/* ---------------- site & plot guide ---------------- */
function renderSiteGuide() {
  $("#site-cards").innerHTML = SITE_GUIDE.map(
    (s) => `
    <div class="card site-card">
      <h3>${s.icon} ${s.title}</h3>
      <ul>${s.points.map((p) => `<li>${p}</li>`).join("")}</ul>
    </div>`
  ).join("");
}

/* ---------------- doshas & remedies ---------------- */
function renderDoshas() {
  $("#dosha-list").innerHTML = DOSHAS.map(
    (d, i) => `
    <div class="dosha" data-i="${i}">
      <div class="dosha-head">
        <span class="sev ${d.severity}">${d.severity === "high" ? "HIGH" : "MEDIUM"}</span>
        <span class="dosha-name">${d.defect}</span>
        <span class="dosha-arrow">▾</span>
      </div>
      <div class="dosha-body">
        <p class="dosha-why">${d.why}</p>
        <ul>${d.remedies.map((r) => `<li>${r}</li>`).join("")}</ul>
      </div>
    </div>`
  ).join("");
  document.querySelectorAll(".dosha-head").forEach((h) =>
    h.addEventListener("click", () => h.parentElement.classList.toggle("open"))
  );
}

/* ---------------- boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderChips();
  renderMap(null);
  renderMandala();
  renderPadas();
  renderSiteGuide();
  renderDoshas();
  initSearch();
});
