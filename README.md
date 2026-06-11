# 🕉️ Vastu Room Guide

A quick-reference web app for **architects and interior designers**: click or
type any room name and instantly see its ideal placement in a home according
to **Vastu Shastra** (the Vastu Purusha Mandala).

**Live:** https://argaurshar.github.io/vastu-game/

## How it works

**Click any room chip or type a room name** (washroom, bedroom, master bedroom,
sunroom, kids room, mandir, toilet, kitchen, and many more) and the 3×3 house map
instantly shows:

| Colour | Meaning |
|--------|---------|
| 🟢 **Green** | Best position — place the room here |
| 🟠 **Orange** | Second-best position — acceptable alternative |
| 🔴 **Red** | Always avoid — never place the room here |
| ⚪ Grey | Neutral zone |

Each room also lists the reasoning behind the placement and practical notes
(sleeping direction, stove orientation, drainage slope, etc.).

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

## Rooms covered (21)

Master Bedroom · Bedroom · Kids Room · Guest Bedroom · Mandir / Pooja Room ·
Kitchen · Toilet · Washroom / Bathroom · Sunroom · Living Room · Dining Room ·
Study Room · Staircase · Store Room · Main Entrance · Garage · Balcony ·
Underground Water Tank · Overhead Water Tank · Septic Tank · Brahmasthan

Typing understands aliases — e.g. *pooja*, *puja room*, *temple* all find the
Mandir; *wc* finds the Toilet.

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
