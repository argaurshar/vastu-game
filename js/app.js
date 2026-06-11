/* ============================================================
   Vastu Quest — game logic
   Explore mode: click a chip or type a room name -> the 3x3
   house map lights up green (best) / orange (good) / red (avoid).
   Quiz mode: guess the best zone for a random room and score.
   ============================================================ */

const STORAGE_KEY = "vastu-quest-save-v1";

const state = {
  score: 0,
  explored: [],        // room ids viewed at least once
  badges: [],          // earned badge ids
  quizAnswered: 0,
  quizCorrect: 0,
  streak: 0,
  bestStreak: 0,
  mode: "explore",
  currentRoom: null,
  quizRoom: null,
  quizLocked: false
};

/* ---------------- persistence ---------------- */
function save() {
  const { score, explored, badges, quizAnswered, quizCorrect, bestStreak } = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ score, explored, badges, quizAnswered, quizCorrect, bestStreak }));
}
function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data) Object.assign(state, data);
  } catch (_) { /* corrupted save — start fresh */ }
}

/* ---------------- helpers ---------------- */
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

/* ---------------- HUD / gamification ---------------- */
function currentLevel() {
  let lvl = LEVELS[0];
  for (const l of LEVELS) if (state.score >= l.min) lvl = l;
  return lvl;
}
function nextLevel() {
  return LEVELS.find((l) => l.min > state.score) || null;
}

function addPoints(pts) {
  state.score = Math.max(0, state.score + pts);
  const el = $("#score-val");
  el.textContent = state.score;
  el.classList.remove("pop");
  void el.offsetWidth; // restart animation
  el.classList.add("pop");
  checkBadges();
  renderHUD();
  save();
}

function renderHUD() {
  $("#score-val").textContent = state.score;
  $("#explored-val").textContent = `${state.explored.length}/${ROOMS.length}`;
  const lvl = currentLevel();
  const nxt = nextLevel();
  $("#level-name").textContent = `${lvl.icon} ${lvl.title}`;
  const pct = nxt
    ? Math.min(100, ((state.score - lvl.min) / (nxt.min - lvl.min)) * 100)
    : 100;
  $("#level-fill").style.width = pct + "%";
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  $("#toast-wrap").appendChild(t);
  setTimeout(() => t.remove(), 3400);
}

function earnBadge(id) {
  if (state.badges.includes(id)) return;
  state.badges.push(id);
  const b = BADGES.find((x) => x.id === id);
  toast(`${b.icon} Badge earned: ${b.name}!`);
  renderBadges();
  save();
}

function checkBadges() {
  if (state.explored.length >= 1) earnBadge("first-room");
  if (state.explored.length >= 5) earnBadge("five-rooms");
  if (state.explored.length >= ROOMS.length) earnBadge("all-rooms");
  if (state.quizAnswered >= 1) earnBadge("first-quiz");
  if (state.streak >= 3) earnBadge("streak-3");
  if (state.streak >= 7) earnBadge("streak-7");
  if (state.score >= 500) earnBadge("score-500");
}

function renderBadges() {
  $("#badges").innerHTML = BADGES.map(
    (b) => `
    <div class="badge ${state.badges.includes(b.id) ? "earned" : ""}" title="${b.desc}">
      <div class="icon">${b.icon}</div>
      <div class="name">${b.name}</div>
      <div class="desc">${b.desc}</div>
    </div>`
  ).join("");
}

/* ---------------- house map ---------------- */
function renderMap(room, { quiz = false, reveal = true } = {}) {
  const map = $("#house-map");
  map.classList.toggle("quiz", quiz);
  map.innerHTML = GRID_ORDER.map((dir) => {
    const d = DIRECTIONS[dir];
    const status = room && reveal ? zoneStatus(room, dir) : "neutral";
    const medal =
      status === "best" ? "🥇" : status === "good" ? "🥈" : status === "avoid" ? "🚫" : "";
    const verdict =
      status === "best" ? "BEST" : status === "good" ? "GOOD" : status === "avoid" ? "AVOID" : "";
    return `
      <div class="zone ${status}" data-dir="${dir}" title="${d.label} — ${d.deity} · Element: ${d.element}">
        ${medal ? `<span class="medal">${medal}</span>` : ""}
        <span class="dir">${dir === "C" ? "⊙" : dir}</span>
        <span class="hindi">${d.hindi}</span>
        ${verdict ? `<span class="verdict">${verdict}</span>` : ""}
      </div>`;
  }).join("");

  if (quiz && !state.quizLocked) {
    map.querySelectorAll(".zone").forEach((z) =>
      z.addEventListener("click", () => answerQuiz(z.dataset.dir))
    );
  }
}

/* ---------------- explore mode ---------------- */
function showRoom(room) {
  state.currentRoom = room;
  renderMap(room);

  const isNew = !state.explored.includes(room.id);
  if (isNew) {
    state.explored.push(room.id);
    addPoints(10);
    toast(`+10 points — ${room.icon} ${room.name} explored!`);
  }

  $("#room-info").innerHTML = `
    <div class="room-title">${room.icon} ${room.name}</div>
    <div class="verdict-rows">
      <div class="verdict-row best">🥇 <b>Best:</b> <span>${dirNames(room.best)}</span></div>
      ${room.good.length ? `<div class="verdict-row good">🥈 <b>Second best:</b> <span>${dirNames(room.good)}</span></div>` : ""}
      <div class="verdict-row avoid">🚫 <b>Always avoid:</b> <span>${dirNames(room.avoid)}</span></div>
    </div>
    <div class="why">💡 ${room.why}</div>
    <div class="tips">
      <h4>Vastu Tips</h4>
      <ul>${room.tips.map((t) => `<li>${t}</li>`).join("")}</ul>
    </div>`;

  document.querySelectorAll(".chip").forEach((c) => {
    c.classList.toggle("selected", c.dataset.id === room.id);
    c.classList.toggle("explored", state.explored.includes(c.dataset.id));
  });
  renderHUD();
  save();
}

function renderChips() {
  $("#chips").innerHTML = ROOMS.map(
    (r) => `
    <span class="chip ${state.explored.includes(r.id) ? "explored" : ""}" data-id="${r.id}">
      ${r.icon} ${r.name}
    </span>`
  ).join("");
  document.querySelectorAll(".chip").forEach((c) =>
    c.addEventListener("click", () => {
      const room = ROOMS.find((r) => r.id === c.dataset.id);
      $("#room-search").value = "";
      closeSuggestions();
      showRoom(room);
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
      (r, i) => `
      <div class="suggestion" data-id="${r.id}" data-i="${i}">
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
    const box = $("#suggestions");
    const items = box.querySelectorAll(".suggestion");
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
        } else {
          toast("🤔 Room not found — try a chip below!");
        }
      }
    } else if (e.key === "Escape") {
      closeSuggestions();
    }
  });
  input.addEventListener("blur", () => setTimeout(closeSuggestions, 150));
}

/* ---------------- quiz mode ---------------- */
function nextQuizQuestion() {
  // avoid repeating the same room twice in a row
  let room;
  do {
    room = ROOMS[Math.floor(Math.random() * ROOMS.length)];
  } while (ROOMS.length > 1 && state.quizRoom && room.id === state.quizRoom.id);

  state.quizRoom = room;
  state.quizLocked = false;
  renderMap(room, { quiz: true, reveal: false });

  $("#quiz-question").innerHTML =
    `Where is the <b>BEST</b> place for the ${room.icon} <b>${room.name}</b>?`;
  $("#quiz-sub").textContent = "Tap a zone on the house map. 🥇 Best = +20 · 🥈 Good = +10 · 🚫 Avoid = −5";
  const fb = $("#quiz-feedback");
  fb.className = "quiz-feedback";
  fb.textContent = "";
  $("#quiz-next").disabled = true;
  renderQuizStats();
}

function answerQuiz(dir) {
  if (state.quizLocked || !state.quizRoom) return;
  state.quizLocked = true;
  const room = state.quizRoom;
  const status = zoneStatus(room, dir);
  state.quizAnswered++;

  const fb = $("#quiz-feedback");
  fb.classList.add("show");

  if (status === "best") {
    state.quizCorrect++;
    state.streak++;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    addPoints(20);
    fb.classList.add("correct");
    fb.innerHTML = `🎉 Perfect! <b>${dirNames([dir])}</b> is the ideal zone. ${room.why}`;
  } else if (status === "good") {
    state.streak = 0;
    addPoints(10);
    fb.classList.add("partial");
    fb.innerHTML = `👍 Close! <b>${dirNames([dir])}</b> works, but the best zone is <b>${dirNames(room.best)}</b>.`;
  } else {
    state.streak = 0;
    addPoints(-5);
    fb.classList.add(status === "avoid" ? "wrong" : "partial");
    fb.innerHTML =
      status === "avoid"
        ? `❌ Ouch — <b>${dirNames([dir])}</b> must always be avoided for the ${room.name}! The best zone is <b>${dirNames(room.best)}</b>.`
        : `😅 Not quite. <b>${dirNames([dir])}</b> is neutral here — the best zone is <b>${dirNames(room.best)}</b>.`;
  }

  renderMap(room, { quiz: true, reveal: true });
  $("#house-map").querySelectorAll(".zone").forEach((z) => z.classList.add("locked"));
  $("#quiz-next").disabled = false;
  checkBadges();
  renderQuizStats();
  save();
}

function renderQuizStats() {
  $("#quiz-stats").innerHTML = `
    <span class="hud-pill">🔥 <b>${state.streak}</b> <span class="label">streak</span></span>
    <span class="hud-pill">🏅 <b>${state.bestStreak}</b> <span class="label">best streak</span></span>
    <span class="hud-pill">✅ <b>${state.quizCorrect}/${state.quizAnswered}</b> <span class="label">correct</span></span>`;
}

/* ---------------- mode switching ---------------- */
function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".tab").forEach((t) =>
    t.classList.toggle("active", t.dataset.mode === mode)
  );
  $("#explore-panel").style.display = mode === "explore" ? "" : "none";
  $("#quiz-panel").style.display = mode === "quiz" ? "" : "none";

  // the house map is a single shared node — move it into the active panel
  const slot = mode === "quiz" ? $("#quiz-map-slot") : $("#explore-map-slot");
  slot.appendChild($("#house-map"));

  if (mode === "quiz") {
    nextQuizQuestion();
  } else {
    if (state.currentRoom) showRoom(state.currentRoom);
    else renderMap(null);
  }
}

/* ---------------- boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  load();
  renderChips();
  renderBadges();
  renderHUD();
  renderMap(null);
  initSearch();
  $("#quiz-next").addEventListener("click", nextQuizQuestion);
  document.querySelectorAll(".tab").forEach((t) =>
    t.addEventListener("click", () => setMode(t.dataset.mode))
  );
  $("#reset-btn").addEventListener("click", () => {
    if (!confirm("Reset all progress, points and badges?")) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
});
