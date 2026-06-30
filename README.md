# 🕉️ Vastu Room Guide

A quick-reference web app for **architects and interior designers**: click or
type any room name and instantly see its ideal placement in a home according
to **Vastu Shastra** (the Vastu Purusha Mandala).

**Live:** https://argaurshar.github.io/vastu-game/

## How it works

**Click any room chip or type a room name** (washroom, bedroom, master bedroom,
sunroom, kids room, mandir, toilet, kitchen, and many more) and the 3×3 house map
instantly shows:

| Badge | Colour | Meaning |
|-------|--------|---------|
| **1 · BEST** | 🟢 Green | The single best position — place the room here |
| **2A**, **2B**, **2C** | 🟠 Orange | Second-best alternates, ranked in priority order |
| **AVOID** | 🔴 Red | Always avoid — never place the room here |
| — | ⚪ Grey | Neutral zone |

When a room has more than one acceptable second-best direction, each one is
marked separately as **2A**, **2B** (and **2C** where applicable) on both the
house map and the detail panel, so you can see every fallback option at a glance.

Each room also lists the reasoning behind the placement and practical notes
(sleeping direction, stove orientation, drainage slope, etc.).

## Floor-plan analyzer

Upload a floor plan and get a **Vastu compliance report** — each room scored by
zone (1·BEST / 2A / 2B / AVOID), the doshas found, and concrete rectifications,
with a **Print / Save-as-PDF** button for client handoff. Two modes:

- **Manual grid** (no key) — upload the plan, set which way North points, drop a
  9-zone Vastu grid over it (auto-oriented to your North), and tag each zone with
  the room(s) you see. The report is built from the app's built-in Vastu data.
- **AI analysis (Google Gemini)** — Gemini reads the plan (OCR + vision),
  detects rooms and their zones automatically, then the same engine produces the
  report. **Bring your own key:** paste a Google Gemini API key (from
  [Google AI Studio](https://aistudio.google.com/app/apikey)); it is stored only
  in your browser's localStorage and the image is sent directly to Google — never
  to this site (it has no server). If the network blocks the call, fall back to
  Manual mode.

> Privacy: in AI mode the floor-plan image is uploaded to Google's Gemini API for
> analysis. AI detection is best-effort — verify zones against the actual drawing.

## Sections

- **Rooms** — search or click a room → green/orange/red direction map.
- **Zone profiles (reverse lookup)** — click any zone on the map → every room
  that belongs, is acceptable, or must never go there, plus the zone's interior
  palette (colours, furniture weight, materials, décor).
- **The Nine Zones** — the traditional Vastu Purusha Mandala with each zone's
  ruling deity, domain, element and general nature, and the Pancha Bhoota
  (five elements) logic behind every rule.
- **Main Entrance Planner** — the classical 32-pada ring: divide each outer
  wall into eight parts and click a pada to see its deity, verdict and effect
  (N3 Mukhya, E3 Jayanta, W4 Pushpadanta, S4 Grihakshata…).
- **Site & Plot Selection** — plot shapes (Gaumukhi/Shermukhi, cut corners),
  slope and levels, roads and Veedhi Shoola, surroundings, open-space and
  building-mass distribution.
- **Doshas & Remedies** — 15 common defects (toilet in NE, kitchen in N, cut
  SW corner…) with severity and practical mitigations for existing buildings.

## Rooms covered (32)

Master Bedroom · Bedroom · Kids Room · Guest Bedroom · Mandir / Pooja Room ·
Kitchen · Toilet · Washroom / Bathroom · Sunroom · Living Room · Dining Room ·
Study Room · Home Office / Workspace · Elders / Grandparents Room ·
Cash Locker / Safe (Almirah) · Wardrobe / Dressing Room · Staircase ·
Lift / Elevator · Store Room · Main Entrance · Garage · Servant Room ·
Gym / Exercise Room · Balcony · Garden / Lawn · Tulsi Plant · Swimming Pool ·
Generator / Inverter / Electrical · Underground Water Tank · Overhead Water Tank ·
Septic Tank · Brahmasthan

Typing understands aliases — e.g. *pooja*, *puja room*, *temple* all find the
Mandir; *wc* finds the Toilet; *tijori* or *safe* find the Cash Locker.

## Run it locally

No build step, no dependencies — just open the page:

```bash
# option 1: open directly
open index.html

# option 2: serve locally
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
index.html      — page layout (search, room chips, map, mandala, info panel)
css/style.css   — styling
js/data.js      — Vastu data: 21 rooms, 9 zones with deities and ratings
js/app.js       — lookup logic: search, autocomplete, map rendering
```

> ⚠️ For reference only. Consult a qualified Vastu expert for real
> construction or renovation decisions.
