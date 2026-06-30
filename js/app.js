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
const analyzer = {
  mode: "manual",
  imageDataUrl: null,   // raster for preview + manual overlay
  pdfFile: null,        // kept so the preview can render lazily (manual mode only)
  rendering: false,
  aiBase64: null,       // bytes sent to Gemini (a PDF is sent as-is)
  aiMime: null,
  north: "up",
  manualAssign: {}   // { zone: [roomId, ...] }
};

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

  document.querySelectorAll(".an-tab").forEach((t) =>
    t.addEventListener("click", () => setAnalyzerMode(t.dataset.mode))
  );
  const file = $("#plan-file");
  if (file) file.addEventListener("change", (e) => handleUpload(e.target.files[0]));

  document.querySelectorAll("input[name='north']").forEach((r) =>
    r.addEventListener("change", () => {
      analyzer.north = r.value;
      const nh = $("#north-hint");
      if (nh) nh.textContent = NORTH_LABEL[r.value] || r.value;
      if (analyzer.imageDataUrl || analyzer.aiBase64) renderManualGrid();
    })
  );
  const nh0 = $("#north-hint");
  if (nh0) nh0.textContent = NORTH_LABEL[analyzer.north] || analyzer.north;

  const aiBtn = $("#ai-analyze");
  if (aiBtn) aiBtn.addEventListener("click", runAiAnalysis);
  const manualBtn = $("#manual-report");
  if (manualBtn) manualBtn.addEventListener("click", () => {
    const { assignments } = collectManualAssignments();
    if (!assignments.length) { setAnalyzerMsg("manual", "Assign at least one room to a zone first.", "warn"); return; }
    renderReport(assignments, { north: analyzer.north, source: "manual" });
  });

  setAnalyzerMode("manual");
  /* warm the local PDF library in the background so PDF uploads feel instant */
  ensurePdfJs().catch(() => {});
}

function setAnalyzerMode(mode) {
  analyzer.mode = mode;
  document.querySelectorAll(".an-tab").forEach((t) =>
    t.classList.toggle("active", t.dataset.mode === mode)
  );
  $("#ai-panel").style.display = mode === "ai" ? "" : "none";
  $("#manual-panel").style.display = mode === "manual" ? "" : "none";
  if (mode === "manual") {
    if (analyzer.pdfFile && !analyzer.imageDataUrl) ensurePdfPreview();
    if (analyzer.imageDataUrl || analyzer.aiBase64) renderManualGrid();
  }
}

function setAnalyzerMsg(scope, msg, kind) {
  const el = $(scope === "ai" ? "#ai-msg" : "#manual-msg");
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

function showPreviewAndGrid() {
  const prev = $("#plan-preview");
  if (prev) {
    if (analyzer.imageDataUrl) { prev.src = analyzer.imageDataUrl; prev.style.display = "block"; }
    else { prev.removeAttribute("src"); prev.style.display = "none"; }
  }
  if (analyzer.mode === "manual") renderManualGrid();
}

/* Read bytes once and enable the buttons immediately. A PDF is sent to
   Gemini as-is (it reads PDFs natively); the raster preview for manual
   tagging is rendered in the background and never blocks the buttons. */
async function handleUpload(file) {
  if (!file) return;
  const isPdf = file.type === "application/pdf";
  const isImg = /^image\/(png|jpe?g|webp)$/.test(file.type);
  if (!isPdf && !isImg) {
    setAnalyzerMsg(analyzer.mode, "Please upload a PNG, JPG, WEBP or PDF of the plan.", "warn");
    return;
  }

  let dataUrl;
  try { dataUrl = await readDataUrl(file); }
  catch (_) { setAnalyzerMsg(analyzer.mode, "Could not read the file.", "warn"); return; }
  const mm = /^data:(.+?);base64,(.*)$/.exec(dataUrl);
  analyzer.aiMime = mm ? mm[1] : file.type;
  analyzer.aiBase64 = mm ? mm[2] : "";
  $("#ai-analyze").disabled = false;
  $("#manual-report").disabled = false;
  setAnalyzerMsg("ai", "", "");
  setAnalyzerMsg("manual", "", "");

  if (isImg) {
    analyzer.pdfFile = null;
    analyzer.imageDataUrl = dataUrl;
    showPreviewAndGrid();
    return;
  }

  // PDF: ready for AI INSTANTLY — Gemini reads the PDF directly, so we do NOT
  // rasterise it here (that render is what used to freeze the page for minutes).
  // The preview is rendered lazily only when the user opens Manual mode.
  analyzer.pdfFile = file;
  analyzer.imageDataUrl = null;
  setAnalyzerMsg("ai", file.size > 18 * 1024 * 1024
    ? `PDF “${file.name}” ready, but large — if Gemini returns 400, export a smaller PDF or a PNG.`
    : `PDF “${file.name}” ready — click “Analyze with Gemini”.`, file.size > 18 * 1024 * 1024 ? "warn" : "");
  setAnalyzerMsg("manual", "PDF ready. Open this tab to render a preview for manual tagging.", "");
  if (analyzer.mode === "manual") { ensurePdfPreview(); renderManualGrid(); }
}

/* Render the stored PDF to a preview image — lazily, only for manual mode. */
function ensurePdfPreview() {
  if (!analyzer.pdfFile || analyzer.imageDataUrl || analyzer.rendering) return;
  analyzer.rendering = true;
  setAnalyzerMsg("manual", "Rendering a preview for manual tagging… you can start assigning zones now.", "busy");
  pdfToImage(analyzer.pdfFile)
    .then((img) => { analyzer.imageDataUrl = img; showPreviewAndGrid(); setAnalyzerMsg("manual", "", ""); })
    .catch((err) => setAnalyzerMsg("manual",
      "Couldn't render the PDF preview (" + err.message + "). AI mode still works; for manual tagging upload a PNG/JPG.", "warn"))
    .finally(() => { analyzer.rendering = false; });
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

/* ---------------- manual grid + assignments ---------------- */
/* screen rotation per North; diagonals get a true 45°-rotated grid */
const NORTH_ANGLE = {
  "up": 0, "up-right": 45, "right": 90, "down-right": 135,
  "down": 180, "down-left": 225, "left": 270, "up-left": 315
};

function assignedIcons(zone) {
  return (analyzer.manualAssign[zone] || [])
    .map((id) => { const r = ROOMS.find((x) => x.id === id); return r ? r.icon : ""; })
    .join("");
}

function renderManualGrid() {
  const angle = NORTH_ANGLE[analyzer.north] || 0;
  const diagonal = angle % 90 !== 0;
  /* diagonal: render canonical zones and rotate the whole grid to true North.
     cardinal: keep the verified relabel (no rotation). */
  const zones = diagonal ? GRID_ORDER : screenZones(analyzer.north);

  const stage = $("#plan-stage");
  if (stage) {
    if (!analyzer.imageDataUrl) {
      // preview not ready yet (e.g. PDF still rasterising) — still let the user assign via the list below
      stage.classList.remove("clip");
      stage.innerHTML = `<div class="plan-rendering">🖼️ Rendering plan preview… you can already assign zones below.</div>`;
    } else {
      const gridStyle = diagonal ? `transform:rotate(${angle}deg);` : "";
      const labelStyle = diagonal ? `transform:rotate(${-angle}deg);` : "";
      stage.classList.toggle("clip", diagonal);
      stage.innerHTML =
        `<img class="plan-img" src="${analyzer.imageDataUrl}" alt="floor plan" />
         <div class="plan-grid" style="${gridStyle}">` +
        zones.map((z) =>
          `<div class="plan-cell" data-zone="${z}" title="Click to assign rooms to ${DIRECTIONS[z].label}">
             <span class="plan-cell-label" style="${labelStyle}">
               <b>${z === "C" ? "Brahma" : z}</b>
               <em>${assignedIcons(z)}</em>
             </span>
           </div>`).join("") +
        `</div>`;
      stage.querySelectorAll(".plan-cell").forEach((cell) =>
        cell.addEventListener("click", (e) => { e.stopPropagation(); openCellMenu(cell.dataset.zone, cell); })
      );
    }
  }

  const roomOptions = ROOMS.map((r) => `<option value="${r.id}">${r.icon} ${r.name}</option>`).join("");
  const list = $("#zone-assign-list");
  list.innerHTML = zones
    .map((z) => {
      const d = DIRECTIONS[z];
      const tags = (analyzer.manualAssign[z] || [])
        .map((id) => {
          const r = ROOMS.find((x) => x.id === id);
          return `<span class="assign-tag" data-zone="${z}" data-id="${id}">${r.icon} ${r.name} ✕</span>`;
        })
        .join("");
      return `
        <div class="assign-row">
          <div class="assign-zone"><b>${z === "C" ? "C" : z}</b> ${d.label}</div>
          <select class="room-picker" data-zone="${z}">
            <option value="">+ add room…</option>${roomOptions}
          </select>
          <div class="assign-tags">${tags || '<em class="dim">none</em>'}</div>
        </div>`;
    })
    .join("");

  list.querySelectorAll(".room-picker").forEach((sel) =>
    sel.addEventListener("change", () => {
      addRoomToZone(sel.dataset.zone, sel.value);
      sel.value = "";
    })
  );
  list.querySelectorAll(".assign-tag").forEach((tag) =>
    tag.addEventListener("click", () => removeRoomFromZone(tag.dataset.zone, tag.dataset.id))
  );
}

function addRoomToZone(zone, id) {
  if (!id) return;
  analyzer.manualAssign[zone] = analyzer.manualAssign[zone] || [];
  if (!analyzer.manualAssign[zone].includes(id)) analyzer.manualAssign[zone].push(id);
  renderManualGrid();
}
function removeRoomFromZone(zone, id) {
  analyzer.manualAssign[zone] = (analyzer.manualAssign[zone] || []).filter((x) => x !== id);
  renderManualGrid();
}

/* ---- click-to-assign popover over an overlay cell ---- */
function closeCellMenu() {
  const m = $("#cell-menu");
  if (m) m.remove();
  document.removeEventListener("click", closeCellMenu);
  document.removeEventListener("keydown", onCellMenuKey);
}
function onCellMenuKey(e) { if (e.key === "Escape") closeCellMenu(); }

function openCellMenu(zone, cell) {
  closeCellMenu();
  const stage = $("#plan-stage");
  const sr = stage.getBoundingClientRect();
  const cr = cell.getBoundingClientRect();
  const left = Math.max(4, Math.min(cr.left - sr.left + cr.width / 2 - 110, sr.width - 224));
  const top = Math.max(4, cr.top - sr.top + cr.height / 2 - 10);

  const assigned = analyzer.manualAssign[zone] || [];
  const menu = document.createElement("div");
  menu.id = "cell-menu";
  menu.style.left = left + "px";
  menu.style.top = top + "px";
  menu.innerHTML =
    `<div class="cell-menu-head"><b>${DIRECTIONS[zone].label}</b> — tap a room to toggle
       <span class="cell-menu-close" title="Close">✕</span></div>
     <div class="cell-menu-list">` +
    ROOMS.map((r) => {
      const on = assigned.includes(r.id);
      return `<button class="cell-menu-item ${on ? "on" : ""}" data-id="${r.id}">${r.icon} ${r.name}${on ? " ✓" : ""}</button>`;
    }).join("") +
    `</div>`;
  stage.appendChild(menu);

  menu.addEventListener("click", (e) => e.stopPropagation());
  menu.querySelector(".cell-menu-close").addEventListener("click", closeCellMenu);
  menu.querySelectorAll(".cell-menu-item").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.id;
      if ((analyzer.manualAssign[zone] || []).includes(id)) removeRoomFromZone(zone, id);
      else addRoomToZone(zone, id);
      const stillOpen = $("#cell-menu");           // renderManualGrid wiped the stage
      if (!stillOpen) { const c = $(`.plan-cell[data-zone="${zone}"]`); if (c) openCellMenu(zone, c); }
    })
  );
  setTimeout(() => {
    document.addEventListener("click", closeCellMenu);
    document.addEventListener("keydown", onCellMenuKey);
  }, 0);
}

function collectManualAssignments() {
  const assignments = [];
  Object.keys(analyzer.manualAssign).forEach((zone) =>
    (analyzer.manualAssign[zone] || []).forEach((id) => {
      const room = ROOMS.find((r) => r.id === id);
      if (room) assignments.push({ room, zone });
    })
  );
  return { assignments };
}

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
  if (!analyzer.aiBase64) { setAnalyzerMsg("ai", "Upload a floor-plan image or PDF first.", "warn"); return; }
  const key = ($("#gemini-key").value || "").trim();
  if (!key) { setAnalyzerMsg("ai", "Enter your Google Gemini API key above (it stays in your browser).", "warn"); $("#gemini-key").focus(); return; }
  saveApiKey(key);
  const model = $("#gemini-model").value || GEMINI.model;
  saveModel(model);

  setAiBusy(true, "Analyzing the plan with Gemini… this can take 10–20s.");
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

function renderReport(assignments, meta) {
  const rows = assignments.map((a) => {
    const v = zoneVerdict(a.room, a.zone);              // {cls,label}
    const ideal = a.room.best;
    const ok = v.cls === "best" || v.cls === "good";
    let rect = "";
    if (!ok) {
      const dosha = findDosha(a.room.id, a.zone);
      if (dosha) rect = dosha.remedies[0];
      else rect = `Shift ${a.room.name} towards its best zone — ${dirLabel(ideal)}. ${a.room.tips[0] || ""}`.trim();
    }
    return { a, v, ideal, ok, rect, dosha: ok ? null : findDosha(a.room.id, a.zone) };
  });

  const total = rows.length;
  const good = rows.filter((r) => r.ok).length;
  const score = total ? Math.round((good / total) * 100) : 0;
  const band = score >= 75 ? "best" : score >= 45 ? "good" : "avoid";
  const bandWord = score >= 75 ? "Largely Vastu-compliant" : score >= 45 ? "Partly compliant — fixable" : "Several major doshas";

  const problems = rows.filter((r) => !r.ok);
  const positives = rows.filter((r) => r.ok);

  const verdictBadge = (v) =>
    `<span class="rep-badge ${v.cls}">${v.cls === "best" ? "1 · BEST" : v.cls === "good" ? v.label : v.cls === "avoid" ? "AVOID" : "NOT IDEAL"}</span>`;

  const tableRows = rows.map((r) => `
    <tr>
      <td>${r.a.room.icon} ${r.a.room.name}</td>
      <td>${DIRECTIONS[r.a.zone].label}</td>
      <td>${verdictBadge(r.v)}</td>
      <td>${dirLabel(r.ideal)}</td>
      <td>${r.ok ? "✓ Well placed" : (r.rect || "")}</td>
    </tr>`).join("");

  const problemCards = problems.length ? problems.map((r) => {
    const sev = r.dosha ? r.dosha.severity : (r.v.cls === "avoid" ? "high" : "medium");
    const why = r.dosha ? r.dosha.why : `${r.a.room.name} is out of its recommended zone, weakening the ${DIRECTIONS[r.a.zone].element} balance of the ${DIRECTIONS[r.a.zone].label}.`;
    const rem = r.dosha ? r.dosha.remedies : [r.rect, ...r.a.room.tips.slice(0, 2)];
    return `
      <div class="rep-problem">
        <div class="rep-problem-head">
          <span class="sev ${sev}">${sev === "high" ? "HIGH" : "MEDIUM"}</span>
          <b>${r.a.room.icon} ${r.a.room.name} in the ${DIRECTIONS[r.a.zone].label}</b>
        </div>
        <p class="dim">${why}</p>
        <ul>${rem.map((x) => `<li>${x}</li>`).join("")}</ul>
      </div>`;
  }).join("") : `<p class="dim">No major placement doshas found — well done.</p>`;

  const warnHtml = (meta.warnings && meta.warnings.length)
    ? `<div class="rep-warn"><b>Notes from detection:</b><ul>${meta.warnings.map((w) => `<li>${w}</li>`).join("")}</ul></div>`
    : "";
  const aiNote = meta.notes ? `<p class="dim">AI observation: ${meta.notes}</p>` : "";
  const sourceLabel = meta.source === "ai" ? "AI (Gemini) detection" : "Manual zone tagging";
  const northLabel = NORTH_LABEL[meta.north] || meta.north;

  $("#report").innerHTML = `
    <div class="rep-head">
      <h3>🧭 Vastu Analysis Report</h3>
      <button class="btn" id="print-report">🖨️ Print / Save as PDF</button>
    </div>
    <div class="rep-meta">
      <span><b>Source:</b> ${sourceLabel}</span>
      <span><b>North:</b> ${northLabel}</span>
      <span><b>Date:</b> ${new Date().toLocaleDateString()}</span>
    </div>
    <div class="rep-score ${band}">
      <div class="rep-score-num">${score}%</div>
      <div><b>${bandWord}</b><br><span class="dim">${good} of ${total} rooms in a recommended zone (best or 2nd-best)</span></div>
    </div>
    ${aiNote}${warnHtml}
    <h4 class="rep-h">Room-by-room</h4>
    <div class="rep-table-wrap">
      <table class="rep-table">
        <thead><tr><th>Room</th><th>Detected zone</th><th>Verdict</th><th>Ideal (1·BEST)</th><th>Action</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
    <h4 class="rep-h">Problems &amp; rectifications</h4>
    ${problemCards}
    <h4 class="rep-h">Well-placed rooms</h4>
    ${positives.length ? `<div class="rep-pos">${positives.map((r) => `<span class="assign-tag static">${r.a.room.icon} ${r.a.room.name} · ${DIRECTIONS[r.a.zone].label}</span>`).join("")}</div>` : `<p class="dim">None yet.</p>`}
    <p class="rep-disclaimer">${meta.source === "ai" ? "AI detection is best-effort OCR/vision — verify zones against the actual drawing. " : ""}This report is generated from traditional Vastu principles for guidance; consult a qualified Vastu expert for construction decisions.</p>`;

  $("#report").style.display = "block";
  $("#print-report").addEventListener("click", () => window.print());
  $("#report").scrollIntoView({ behavior: "smooth", block: "start" });
}
