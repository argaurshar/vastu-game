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
  initAnalyzer();
});

/* ============================================================
   Floor-Plan Analyzer
   Upload a plan -> AI (Gemini) or manual zone tagging ->
   a Vastu compliance report with rectifications.
   Reuses ROOMS, DIRECTIONS, DOSHAS, GEMINI, zoneVerdict,
   dirLabel, findRoom, GRID_ORDER.
   ============================================================ */
const DEFAULT_CROP = { x: 0.12, y: 0.06, w: 0.76, h: 0.84 };
const analyzer = {
  imageDataUrl: null,    // the full rendered plan (shown in the crop UI)
  reportImageUrl: null,  // the CROPPED plan that is actually analysed & marked up
  crop: { ...DEFAULT_CROP }, // fraction {x,y,w,h} of the image = the actual plot
  aiBase64: null,        // bytes sent to Gemini (the cropped plan image)
  aiMime: null,
  north: "up"
};
function clampN(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/* --- orientation: which Vastu zone sits in each screen cell ---
   Supports all 8 compass directions for "where North points", including the
   four diagonals. The 8 outer Vastu zones form a clockwise ring (N..NW); the
   screen's 8 perimeter cells form a clockwise ring from top-centre. Placing N
   at the screen position the user chose and walking both rings together gives
   the zone for every cell. For diagonal North this naturally puts the cardinal
   directions on the screen corners and the inter-cardinals on the edges. */
const VASTU_RING = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]; // clockwise
const NORTH_RING_INDEX = {
  "up": 0, "up-right": 1, "right": 2, "down-right": 3,
  "down": 4, "down-left": 5, "left": 6, "up-left": 7
};
/* row-major cell index (0..8) -> position in the clockwise screen ring
   (TC=0,TR=1,RC=2,BR=3,BC=4,BL=5,LC=6,TL=7); centre cell = -1 */
const ROWMAJOR_TO_RING = [7, 0, 1, 6, -1, 2, 5, 4, 3];
const NORTH_LABEL = {
  "up": "↑ Up", "up-right": "↗ Top-right", "right": "→ Right", "down-right": "↘ Bottom-right",
  "down": "↓ Down", "down-left": "↙ Bottom-left", "left": "← Left", "up-left": "↖ Top-left"
};

/* Normalise a free-form North string (e.g. from Gemini: "top-right", "NE",
   "north_east") to one of the 8 canonical codes, or null if unrecognised. */
function normNorth(s) {
  if (!s) return null;
  const k = String(s).toLowerCase().trim().replace(/[\s_]+/g, "-");
  const map = {
    "top": "up", "bottom": "down",
    "top-left": "up-left", "top-right": "up-right",
    "bottom-left": "down-left", "bottom-right": "down-right",
    "north": "up", "south": "down", "east": "right", "west": "left",
    "north-east": "up-right", "northeast": "up-right", "ne": "up-right",
    "north-west": "up-left", "northwest": "up-left", "nw": "up-left",
    "south-east": "down-right", "southeast": "down-right", "se": "down-right",
    "south-west": "down-left", "southwest": "down-left", "sw": "down-left"
  };
  const v = map[k] || k;
  return NORTH_RING_INDEX[v] != null ? v : null;
}

/* 9 Vastu zones in screen row-major order (top-left → bottom-right) */
function screenZones(north) {
  const k = NORTH_RING_INDEX[north] ?? 0;
  return ROWMAJOR_TO_RING.map((ring) =>
    ring === -1 ? "C" : VASTU_RING[(ring - k + 8) % 8]
  );
}

/* ---------------- init & mode switching ---------------- */
function initAnalyzer() {
  const keyInput = $("#gemini-key");
  if (keyInput) {
    keyInput.value = loadApiKey();
    keyInput.addEventListener("change", () => saveApiKey(keyInput.value));
  }
  const modelSel = $("#gemini-model");
  if (modelSel) {
    populateModelDropdown(GEMINI.models, loadModel() || GEMINI.model);   // predefined fallback
    modelSel.addEventListener("change", () => saveModel(modelSel.value));
  }
  if (keyInput) {
    keyInput.addEventListener("change", () => { if (keyInput.value.trim()) loadModelsFromKey(); });
    if (keyInput.value.trim()) loadModelsFromKey();   // a saved key -> load its real models now
  }
  const loadBtn = $("#load-models");
  if (loadBtn) loadBtn.addEventListener("click", loadModelsFromKey);

  const file = $("#plan-file");
  if (file) file.addEventListener("change", (e) => handleUpload(e.target.files[0]));

  document.querySelectorAll("input[name='north']").forEach((r) =>
    r.addEventListener("change", () => {
      analyzer.north = r.value;
      const nh = $("#north-hint");
      if (nh) nh.textContent = NORTH_LABEL[r.value] || r.value;
    })
  );
  const nh0 = $("#north-hint");
  if (nh0) nh0.textContent = NORTH_LABEL[analyzer.north] || analyzer.north;

  const aiBtn = $("#ai-analyze");
  if (aiBtn) aiBtn.addEventListener("click", runAiAnalysis);
  const cropReset = $("#crop-reset");
  if (cropReset) cropReset.addEventListener("click", () => { analyzer.crop = { ...DEFAULT_CROP }; positionCropRect(); });
  const cropFull = $("#crop-full");
  if (cropFull) cropFull.addEventListener("click", () => { analyzer.crop = { x: 0, y: 0, w: 1, h: 1 }; positionCropRect(); });

  /* warm the local PDF library in the background so PDF uploads feel instant */
  ensurePdfJs().catch(() => {});
}

function setAnalyzerMsg(scope, msg, kind) {
  const el = $("#ai-msg");
  if (!el) return;
  el.className = "an-msg " + (kind || "");
  el.textContent = msg || "";
}

/* ---------------- upload (image or PDF) ---------------- */
function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error("could not read the file"));
    r.readAsDataURL(file);
  });
}

/* Render to an image, then let the user mark the rectangle that is the actual
   floor plan/plot. Only that rectangle is analysed and zoned. */
async function handleUpload(file) {
  if (!file) return;
  const isPdf = file.type === "application/pdf";
  const isImg = /^image\/(png|jpe?g|webp)$/.test(file.type);
  if (!isPdf && !isImg) {
    setAnalyzerMsg("ai", "Please upload a PNG, JPG, WEBP or PDF of the plan.", "warn");
    return;
  }
  analyzer.reportImageUrl = null;
  analyzer.crop = { ...DEFAULT_CROP };
  $("#ai-analyze").disabled = true;

  try {
    if (isImg) {
      analyzer.imageDataUrl = await readDataUrl(file);
    } else {
      setAnalyzerMsg("ai", "Rendering the plan…", "busy");
      analyzer.imageDataUrl = await pdfToImage(file);
    }
  } catch (err) {
    setAnalyzerMsg("ai", "Could not open the file (" + (err.message || "error") + "). Try a PNG/JPG export of the plan.", "warn");
    return;
  }

  setAnalyzerMsg("ai", "", "");
  renderCropStage();
  $("#ai-analyze").disabled = false;
}

/* ---- crop rectangle: mark only the actual floor plan / plot ---- */
function renderCropStage() {
  const wrap = $("#crop-wrap"), stage = $("#crop-stage");
  if (!stage || !analyzer.imageDataUrl) return;
  if (wrap) wrap.style.display = "";
  stage.innerHTML =
    `<img class="crop-img" src="${analyzer.imageDataUrl}" alt="uploaded plan" />
     <div class="crop-rect" id="crop-rect">
       <span class="crop-h tl" data-h="tl"></span><span class="crop-h tr" data-h="tr"></span>
       <span class="crop-h bl" data-h="bl"></span><span class="crop-h br" data-h="br"></span>
     </div>`;
  const img = stage.querySelector(".crop-img");
  if (img.complete) positionCropRect(); else img.addEventListener("load", positionCropRect);
  attachCropHandlers();
}

function positionCropRect() {
  const r = $("#crop-rect"); if (!r) return;
  const c = analyzer.crop;
  r.style.left = (c.x * 100) + "%"; r.style.top = (c.y * 100) + "%";
  r.style.width = (c.w * 100) + "%"; r.style.height = (c.h * 100) + "%";
}

function attachCropHandlers() {
  const stage = $("#crop-stage");
  const img = stage.querySelector(".crop-img");
  const rect = $("#crop-rect");
  if (!img || !rect) return;
  let mode = null, sx = 0, sy = 0, start = null;
  const onMove = (e) => {
    if (!mode) return;
    const b = img.getBoundingClientRect();
    const dx = (e.clientX - sx) / b.width, dy = (e.clientY - sy) / b.height;
    let { x, y, w, h } = start;
    if (mode === "move") { x = clampN(x + dx, 0, 1 - w); y = clampN(y + dy, 0, 1 - h); }
    else {
      if (mode.includes("l")) { const nx = clampN(x + dx, 0, x + w - 0.05); w = w + (x - nx); x = nx; }
      if (mode.includes("r")) { w = clampN(w + dx, 0.05, 1 - x); }
      if (mode.includes("t")) { const ny = clampN(y + dy, 0, y + h - 0.05); h = h + (y - ny); y = ny; }
      if (mode.includes("b")) { h = clampN(h + dy, 0.05, 1 - y); }
    }
    analyzer.crop = { x, y, w, h };
    positionCropRect();
  };
  const onUp = () => { mode = null; window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  const startDrag = (m, e) => {
    mode = m; sx = e.clientX; sy = e.clientY; start = { ...analyzer.crop };
    e.preventDefault(); e.stopPropagation();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };
  rect.addEventListener("pointerdown", (e) => startDrag("move", e));
  rect.querySelectorAll(".crop-h").forEach((hd) => hd.addEventListener("pointerdown", (e) => startDrag(hd.dataset.h, e)));
}

/* crop the source image to the marked rectangle -> JPEG data URL */
function cropToDataUrl() {
  return new Promise((resolve) => {
    if (!analyzer.imageDataUrl) { resolve(null); return; }
    const im = new Image();
    im.onload = () => {
      const c = analyzer.crop || DEFAULT_CROP;
      const sx = Math.max(0, Math.round(c.x * im.naturalWidth));
      const sy = Math.max(0, Math.round(c.y * im.naturalHeight));
      const sw = Math.max(1, Math.round(c.w * im.naturalWidth));
      const sh = Math.max(1, Math.round(c.h * im.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = sw; canvas.height = sh;
      canvas.getContext("2d").drawImage(im, sx, sy, sw, sh, 0, 0, sw, sh);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    im.onerror = () => resolve(null);
    im.src = analyzer.imageDataUrl;
  });
}

/* lazy-load pdf.js (UMD) once, then render page 1 to a PNG data URL */
let pdfJsReady = null;
function ensurePdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (pdfJsReady) return pdfJsReady;
  pdfJsReady = new Promise((resolve, reject) => {
    const base = "vendor/pdfjs";   // bundled locally — no CDN, works offline & instantly
    const s = document.createElement("script");
    s.src = base + "/pdf.min.js";
    const timer = setTimeout(() => reject(new Error("PDF library timed out")), 15000);
    s.onload = () => {
      clearTimeout(timer);
      if (!window.pdfjsLib) { reject(new Error("pdf.js failed to initialise")); return; }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = base + "/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    s.onerror = () => { clearTimeout(timer); reject(new Error("could not load the PDF library")); };
    document.head.appendChild(s);
  });
  return pdfJsReady;
}
async function pdfToImage(file) {
  const pdfjsLib = await ensurePdfJs();
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const page = await pdf.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const maxDim = 1600;                                   // cap so encoding stays fast
  const scale = Math.max(0.4, Math.min(2, maxDim / Math.max(base.width, base.height)));
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
  // toBlob is asynchronous — it does not block the main thread like toDataURL
  return await new Promise((resolve, reject) =>
    canvas.toBlob((b) => b ? resolve(URL.createObjectURL(b)) : reject(new Error("could not encode preview")), "image/jpeg", 0.85)
  );
}

/* screen rotation per North — used by the report's marked-up plan */
const NORTH_ANGLE = {
  "up": 0, "up-right": 45, "right": 90, "down-right": 135,
  "down": 180, "down-left": 225, "left": 270, "up-left": 315
};

/* ---------------- API key persistence ---------------- */
function saveApiKey(k) { try { localStorage.setItem("vastu-gemini-key", k.trim()); } catch (_) {} }
function loadApiKey() { try { return localStorage.getItem("vastu-gemini-key") || ""; } catch (_) { return ""; } }
function saveModel(m) { try { localStorage.setItem("vastu-gemini-model", m); } catch (_) {} }
function loadModel() { try { return localStorage.getItem("vastu-gemini-model") || ""; } catch (_) { return ""; } }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function parseRetryDelay(bodyText) {
  try {
    const det = (JSON.parse(bodyText)?.error?.details) || [];
    for (const x of det) { const m = x.retryDelay && /([\d.]+)s/.exec(x.retryDelay); if (m) return Math.ceil(parseFloat(m[1])); }
  } catch (_) {}
  return null;
}
function apiErrorMessage(bodyText) { try { return JSON.parse(bodyText)?.error?.message || ""; } catch (_) { return ""; } }
function geminiRequest(model, key) {
  return fetch(GEMINI.endpoint(model, key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildGeminiBody())
  });
}

/* ---------------- Gemini request ---------------- */
function buildGeminiBody() {
  return {
    contents: [{
      parts: [
        { text: GEMINI.prompt(analyzer.north) },
        { inline_data: { mime_type: analyzer.aiMime, data: analyzer.aiBase64 } }
      ]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: GEMINI.schema,
      temperature: 0.2
    }
  };
}

/* ----- live model list from the user\'s key (ListModels) ----- */
function modelPriority(id) {
  // prefer high-free-limit, vision-capable, current models
  if (/2\.5-flash-lite/.test(id)) return 0;
  if (/2\.0-flash-lite/.test(id)) return 1;
  if (/2\.5-flash(?!-lite)/.test(id)) return 2;
  if (/2\.0-flash(?!-lite)/.test(id)) return 3;
  if (/2\.5-pro/.test(id)) return 5;
  if (/flash/.test(id)) return 4;
  return 6;
}
async function fetchAvailableModels(key) {
  const res = await fetch(GEMINI.listEndpoint(key));
  if (!res.ok) { const t = await res.text().catch(() => ""); throw new Error("HTTP " + res.status + (apiErrorMessage(t) ? " — " + apiErrorMessage(t) : "")); }
  const data = await res.json();
  return (data.models || [])
    .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
    .filter((m) => /models\/gemini/i.test(m.name || ""))
    .filter((m) => !/embedding|aqa|imagen|image-generation|-tts|-live|vision-latest/i.test(m.name || ""))
    .map((m) => ({ id: (m.name || "").replace(/^models\//, ""), label: (m.displayName || (m.name || "").replace(/^models\//, "")) }))
    .sort((x, y) => modelPriority(x.id) - modelPriority(y.id) || x.id.localeCompare(y.id));
}
function populateModelDropdown(models, selected) {
  const sel = $("#gemini-model");
  if (!sel || !models.length) return;
  sel.innerHTML = models.map((m) => `<option value="${m.id}">${m.label}</option>`).join("");
  const want = selected && models.some((m) => m.id === selected) ? selected : models[0].id;
  sel.value = want;
  saveModel(sel.value);
}
async function loadModelsFromKey() {
  const key = ($("#gemini-key").value || "").trim();
  const status = $("#model-status");
  if (!key) { if (status) { status.textContent = "Enter your key first to load its models."; status.className = "model-status warn"; } return; }
  saveApiKey(key);
  if (status) { status.textContent = "Loading models your key can use…"; status.className = "model-status busy"; }
  try {
    const models = await fetchAvailableModels(key);
    if (!models.length) throw new Error("no generateContent models returned");
    populateModelDropdown(models, loadModel() || GEMINI.model);
    if (status) { status.textContent = `✓ ${models.length} models available to this key — pick any.`; status.className = "model-status ok"; }
  } catch (err) {
    if (status) { status.textContent = "Couldn't load models (" + err.message + "). Using the built-in list.", status.className = "model-status warn"; }
  }
}

/* classify a 429 so we can tell the user if waiting will help */
function parse429Kind(bodyText) {
  try {
    const det = JSON.parse(bodyText)?.error?.details || [];
    const qf = det.find((d) => /QuotaFailure/.test(d["@type"] || ""));
    const id = ((qf?.violations?.[0]?.quotaId) || (qf?.violations?.[0]?.quotaMetric) || "") + "";
    if (/per[_-]?day|daily|requests.*day/i.test(id)) return "day";
    if (/per[_-]?minute|requests.*minute/i.test(id)) return "minute";
  } catch (_) {}
  return null;
}

/* button spinner + animated progress while the model thinks */
function setAiBusy(on, msg) {
  const btn = $("#ai-analyze");
  if (btn) {
    btn.disabled = on;
    btn.classList.toggle("loading", on);
    btn.textContent = on ? "Analyzing…" : "Analyze with Gemini";
  }
  const bar = $("#ai-progress");
  if (bar) bar.classList.toggle("show", on);
  if (msg) setAnalyzerMsg("ai", msg, "busy");
}

/* On 429: one timed retry on the chosen model, then try every OTHER model in
   the dropdown — each model has its own quota, so another may succeed. */
async function callWithRetry(model, key) {
  const all = Array.from(document.querySelectorAll("#gemini-model option")).map((o) => o.value);
  const candidates = [model, ...all.filter((m) => m !== model)];
  let res, used = model, lastBody = "";

  for (let i = 0; i < candidates.length; i++) {
    used = candidates[i];
    if (i > 0) setAiBusy(true, `Rate-limited — trying ${used}…`);
    res = await geminiRequest(used, key);
    if (res.status !== 429) { syncModelDropdown(used); return { res, model: used, lastBody }; }
    lastBody = await res.text().catch(() => "");

    if (i === 0) {   // give the preferred model one timed retry before moving on
      const delay = Math.min(parseRetryDelay(lastBody) || 12, 20);
      for (let s = delay; s > 0; s--) { setAiBusy(true, `Rate limit on ${used}. Retrying in ${s}s…`); await sleep(1000); }
      res = await geminiRequest(used, key);
      if (res.status !== 429) { syncModelDropdown(used); return { res, model: used, lastBody }; }
      lastBody = await res.text().catch(() => "");
    }
  }
  return { res, model: used, lastBody };   // every model rate-limited
}
function syncModelDropdown(model) {
  const sel = $("#gemini-model");
  if (sel && sel.value !== model && Array.from(sel.options).some((o) => o.value === model)) {
    sel.value = model; saveModel(model);
  }
}

async function runAiAnalysis() {
  if (!analyzer.imageDataUrl) { setAnalyzerMsg("ai", "Upload a floor-plan image or PDF first.", "warn"); return; }
  const key = ($("#gemini-key").value || "").trim();
  if (!key) { setAnalyzerMsg("ai", "Enter your Google Gemini API key above (it stays in your browser).", "warn"); $("#gemini-key").focus(); return; }
  saveApiKey(key);
  const model = $("#gemini-model").value || GEMINI.model;
  saveModel(model);

  // analyse ONLY the marked rectangle (the real plan), not the whole sheet
  const cropped = await cropToDataUrl();
  if (cropped) {
    const cm = /^data:(.+?);base64,(.*)$/.exec(cropped);
    analyzer.aiMime = cm ? cm[1] : "image/jpeg";
    analyzer.aiBase64 = cm ? cm[2] : "";
    analyzer.reportImageUrl = cropped;
  }
  if (!analyzer.aiBase64) { setAiBusy(false); setAnalyzerMsg("ai", "Could not prepare the cropped plan. Try re-uploading.", "warn"); return; }

  setAiBusy(true, "Analyzing the marked plan with Gemini… this can take 10–20s.");
  try {
    const result = await callWithRetry(model, key);
    const res = result.res;
    const usedModel = result.model;
    if (!res.ok) {
      const t = result.lastBody || await res.text().catch(() => "");
      const apiMsg = apiErrorMessage(t);
      if (res.status === 429) {
        const kind = parse429Kind(t);
        const which = kind === "day" ? "the per-DAY free-tier limit — it resets after ~24h"
                    : kind === "minute" ? "the per-MINUTE limit — wait ~60s and retry"
                    : "the free-tier quota";
        throw new Error(`All available models are rate-limited (429). Your key has hit ${which}. Options: wait and retry, use a different Google account/key, or enable billing in Google AI Studio. (Tried every model in the dropdown automatically.)`);
      }
      if (res.status === 400)
        throw new Error("Gemini rejected the request (400)" + (apiMsg ? ": " + apiMsg : ". Check the model and that the Generative Language API is enabled."));
      if (res.status === 401 || res.status === 403)
        throw new Error("Invalid or unauthorized API key (HTTP " + res.status + ")" + (apiMsg ? ": " + apiMsg : "."));
      if (res.status === 404)
        throw new Error(`Model "${usedModel}" isn't available for your key (404). Pick a different model in the dropdown.`);
      throw new Error("Gemini error HTTP " + res.status + (apiMsg ? ": " + apiMsg : "."));
    }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
    let parsed;
    try { parsed = JSON.parse(text); }
    catch (_) { throw new Error("Could not read the AI response as JSON. Try again, or use Manual grid mode."); }

    const { assignments, warnings } = normalizeDetectedRooms(parsed.rooms || []);
    if (!assignments.length) throw new Error("The AI did not return any recognizable rooms. Try a clearer image or Manual mode.");
    const detected = normNorth(parsed.detectedNorth);
    if (detected && detected !== analyzer.north) {
      warnings.unshift(`AI read North as ${NORTH_LABEL[detected]}, but you selected ${NORTH_LABEL[analyzer.north]}. Zones use your selection — re-check the plan's North arrow if they differ.`);
    }
    setAnalyzerMsg("ai", "", "");
    renderReport(assignments, {
      north: analyzer.north,
      notes: parsed.notes,
      warnings,
      source: "ai"
    });
  } catch (err) {
    setAnalyzerMsg("ai", err.message + (/Failed to fetch/i.test(err.message) ? " (network/CORS — try Manual grid mode)" : ""), "warn");
  } finally {
    setAiBusy(false);
  }
}

function normalizeDetectedRooms(detected) {
  const valid = new Set(GRID_ORDER);
  const assignments = [], warnings = [];
  detected.forEach((d) => {
    const room = findRoom(d.name || "");
    const zone = String(d.zone || "").toUpperCase().trim();
    if (!room) { warnings.push(`Unmatched room from plan: “${d.name}”`); return; }
    if (!valid.has(zone)) { warnings.push(`${room.name}: unclear zone “${d.zone}”`); return; }
    assignments.push({ room, zone, note: d.note });
  });
  return { assignments, warnings };
}

/* ---------------- report engine (shared) ---------------- */
function findDosha(roomId, zone) {
  return DOSHAS.find((d) => d.roomId === roomId && Array.isArray(d.zones) && d.zones.includes(zone));
}

function verdictText(v) {
  return v.cls === "best" ? "1 · BEST" : v.cls === "good" ? v.label : v.cls === "avoid" ? "AVOID" : "Acceptable";
}

function donutSvg(pct, color) {
  const r = 42, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return `<svg viewBox="0 0 100 100" class="rep-donut" aria-hidden="true">
    <circle class="ring-bg" cx="50" cy="50" r="${r}"></circle>
    <circle class="ring-fg" cx="50" cy="50" r="${r}" stroke="${color}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"></circle>
    <text class="ring-num" x="50" y="56">${pct}%</text>
  </svg>`;
}

/* where a Vastu zone sits on the plan image, as a 0..1 fraction, for any North */
function zoneScreenFraction(zone, north) {
  const idx = GRID_ORDER.indexOf(zone);
  const col = idx % 3, row = Math.floor(idx / 3);
  const ox = col - 1, oy = row - 1;
  const ang = (NORTH_ANGLE[north] || 0) * Math.PI / 180;
  const rx = ox * Math.cos(ang) - oy * Math.sin(ang);
  const ry = ox * Math.sin(ang) + oy * Math.cos(ang);
  return { fx: 0.5 + rx / 3, fy: 0.5 + ry / 3 };
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function getPlanImageForReport() {
  return analyzer.reportImageUrl || analyzer.imageDataUrl || null;
}

/* Draw the consultant-style marked-up plan: green ✓ pills for kept rooms,
   red ⚠ pills (with the destination zone) for forbidden-zone rooms. */
async function buildAnnotatedPlan(rows, north) {
  const src = await getPlanImageForReport();
  if (!src) return null;
  const img = await new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  if (!img || !img.naturalWidth) return null;

  const maxW = 1200;
  const scale = Math.min(1, maxW / img.naturalWidth);
  const W = Math.round(img.naturalWidth * scale), H = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, W, H);
  ctx.fillStyle = "rgba(255,255,255,0.10)"; ctx.fillRect(0, 0, W, H);

  const byZone = {};
  rows.forEach((r) => { (byZone[r.a.zone] = byZone[r.a.zone] || []).push(r); });

  const fs = Math.max(12, Math.round(W / 52));
  const h = Math.round(fs * 1.8);
  ctx.font = "700 " + fs + "px Segoe UI, Arial, sans-serif";
  ctx.textBaseline = "middle";

  Object.keys(byZone).forEach((zone) => {
    const { fx, fy } = zoneScreenFraction(zone, north);
    const cx = fx * W, cy = fy * H;
    byZone[zone].forEach((r, i) => {
      const bad = r.v.cls === "avoid";
      const color = bad ? "#ef4444" : (r.v.cls === "best" ? "#16a34a" : r.v.cls === "good" ? "#d97706" : "#475569");
      const label = (bad ? "⚠ " : "✓ ") + r.a.room.name + (bad ? "  ➜  " + dirLabel(r.ideal) : "");
      const padX = Math.round(fs * 0.7);
      const tw = ctx.measureText(label).width + padX * 2;
      let x = cx - tw / 2, y = cy - h / 2 + i * (h + 6);
      x = Math.max(4, Math.min(x, W - tw - 4));
      y = Math.max(4, Math.min(y, H - h - 4));
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.45)"; ctx.shadowBlur = 5; ctx.shadowOffsetY = 1;
      ctx.fillStyle = color;
      roundRectPath(ctx, x, y, tw, h, h / 2); ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(label, x + padX, y + h / 2 + 1);
    });
  });
  return canvas.toDataURL("image/jpeg", 0.92);
}

function verdictBadgeHtml(v) {
  return `<span class="tbadge ${v.cls}">${verdictText(v)}</span>`;
}

function renderReport(assignments, meta) {
  const rows = assignments.map((a) => {
    const v = zoneVerdict(a.room, a.zone);
    const ideal = a.room.best;
    const isAvoid = v.cls === "avoid";
    let rect = "";
    if (isAvoid) {
      const dosha = findDosha(a.room.id, a.zone);
      rect = dosha ? dosha.remedies[0] : `Move ${a.room.name} to its best zone — ${dirLabel(ideal)}. ${a.room.tips[0] || ""}`.trim();
    }
    return { a, v, ideal, isAvoid, rect, dosha: isAvoid ? findDosha(a.room.id, a.zone) : null };
  });

  const total = rows.length;
  const problems = rows.filter((r) => r.isAvoid);
  const kept = rows.filter((r) => !r.isAvoid);
  const bestCount = rows.filter((r) => r.v.cls === "best").length;
  const secondCount = rows.filter((r) => r.v.cls === "good").length;
  const acceptCount = rows.filter((r) => r.v.cls === "neutral").length;
  const pct = total ? Math.round((kept.length / total) * 100) : 0;
  const band = problems.length === 0 ? "best" : problems.length <= 2 ? "good" : "avoid";
  const headline = problems.length === 0 ? "No room in a forbidden zone" : `${problems.length} room${problems.length > 1 ? "s" : ""} to relocate`;
  const ringColor = band === "best" ? "#16a34a" : band === "good" ? "#d97706" : "#ef4444";

  const fixCards = problems.length ? problems.map((r) => {
    const sev = r.dosha ? r.dosha.severity : "high";
    const why = r.dosha ? r.dosha.why
      : `${r.a.room.name} sits in the ${DIRECTIONS[r.a.zone].label} — a forbidden zone for it, clashing with that corner's ${DIRECTIONS[r.a.zone].element} energy.`;
    const rem = r.dosha ? r.dosha.remedies : [r.rect, ...r.a.room.tips.slice(0, 2)].filter(Boolean);
    return `
      <div class="fix-card">
        <div class="fix-top">
          <span class="fix-room">${r.a.room.icon} ${r.a.room.name}</span>
          <span class="sev ${sev}">${sev === "high" ? "HIGH" : "MEDIUM"}</span>
        </div>
        <div class="fix-move">
          <span class="loc bad">${DIRECTIONS[r.a.zone].label}</span>
          <span class="fix-arrow">➜</span>
          <span class="loc good">${dirLabel(r.ideal)} <em>best</em></span>
        </div>
        <p class="fix-why">${why}</p>
        <ul class="fix-rem">${rem.map((x) => `<li>${x}</li>`).join("")}</ul>
      </div>`;
  }).join("") : `<p class="rep-allgood">✓ Every room is in an acceptable zone — nothing has to move.</p>`;

  const chip = (r) => `<span class="keep-chip ${r.v.cls}">${r.a.room.icon} ${r.a.room.name} · ${DIRECTIONS[r.a.zone].label} · ${verdictText(r.v)}</span>`;
  const keptHtml = kept.length ? `<div class="keep-wrap">${kept.map(chip).join("")}</div>` : `<p class="dim">—</p>`;

  const tableRows = rows.map((r) => `
    <tr class="${r.isAvoid ? "row-move" : ""}">
      <td>${r.a.room.icon} ${r.a.room.name}</td>
      <td>${DIRECTIONS[r.a.zone].label}</td>
      <td>${verdictBadgeHtml(r.v)}</td>
      <td>${dirLabel(r.ideal)}</td>
      <td>${r.isAvoid ? "➜ Move to " + dirLabel(r.ideal) : "✓ Keep"}</td>
    </tr>`).join("");

  const warnHtml = (meta.warnings && meta.warnings.length)
    ? `<div class="rep-warn"><b>Notes from detection:</b><ul>${meta.warnings.map((w) => `<li>${w}</li>`).join("")}</ul></div>` : "";
  const aiNote = meta.notes ? `<p class="dim">AI observation: ${meta.notes}</p>` : "";
  const sourceLabel = meta.source === "ai" ? "AI (Gemini) detection" : "Manual zone tagging";
  const northLabel = NORTH_LABEL[meta.north] || meta.north;

  $("#report").innerHTML = `
    <div class="rep-head">
      <h3>🧭 Vastu Analysis Report</h3>
      <button class="btn" id="print-report">🖨️ Save as PDF</button>
    </div>
    <div class="rep-meta">
      <span><b>Source:</b> ${sourceLabel}</span>
      <span><b>North:</b> ${northLabel}</span>
      <span><b>Date:</b> ${new Date().toLocaleDateString()}</span>
    </div>

    <div class="rep-hero ${band}">
      <div class="rep-gauge">
        ${donutSvg(pct, ringColor)}
        <div class="rep-gauge-cap"><b>${headline}</b><span class="dim">${kept.length} of ${total} rooms fine to keep</span></div>
      </div>
      <div class="rep-legend2">
        <span><i class="sw keep"></i> Keep — best / 2nd / 3rd / acceptable</span>
        <span><i class="sw move"></i> Relocate — in a forbidden zone</span>
      </div>
    </div>

    <div class="rep-stats">
      <div class="stat best"><span class="n">${bestCount}</span><span class="l">🥇 Best</span></div>
      <div class="stat good"><span class="n">${secondCount}</span><span class="l">🥈 2nd / 3rd</span></div>
      <div class="stat neutral"><span class="n">${acceptCount}</span><span class="l">⚪ Acceptable</span></div>
      <div class="stat avoid"><span class="n">${problems.length}</span><span class="l">⚠ Relocate</span></div>
    </div>

    <h4 class="rep-h rep-plan-h">Marked-up plan</h4>
    <div id="rep-plan" class="rep-plan"><div class="rep-plan-load">🖊️ Marking your plan…</div></div>

    ${aiNote}${warnHtml}

    <h4 class="rep-h">Room-by-room summary</h4>
    <div class="rep-table-wrap">
      <table class="rep-table">
        <thead><tr><th>Room</th><th>Detected zone</th><th>Verdict</th><th>Ideal (1·BEST)</th><th>Action</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>

    <h4 class="rep-h">⚠ Must relocate <span class="dim">— only rooms in a forbidden zone</span></h4>
    <div class="fix-grid">${fixCards}</div>

    <h4 class="rep-h">✓ Keep as-is <span class="dim">— best, 2nd/3rd-best &amp; acceptable placements</span></h4>
    ${keptHtml}

    <p class="rep-disclaimer">${meta.source === "ai" ? "AI detection is best-effort — verify the marked zones against the real drawing. " : ""}Rooms already in their best, 2nd/3rd-best or an acceptable zone are kept as-is; only forbidden-zone placements are flagged for relocation. Guidance only — consult a qualified Vastu expert for construction decisions.</p>`;

  $("#report").style.display = "block";
  $("#print-report").addEventListener("click", () => window.print());
  $("#report").scrollIntoView({ behavior: "smooth", block: "start" });

  buildAnnotatedPlan(rows, meta.north).then((url) => {
    const el = $("#rep-plan");
    if (!el) return;
    el.innerHTML = url
      ? `<img src="${url}" alt="marked-up Vastu plan" />`
      : `<div class="rep-plan-load">No plan image available to mark — upload an image or PDF in the Analyze tab.</div>`;
  });
}


