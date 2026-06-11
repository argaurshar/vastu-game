# 🕉️ Vastu Quest — Gamified Vastu Shastra Room Guide

A fun, interactive single-page game that teaches the ideal placement of every room
in a home according to **Vastu Shastra** (the Vastu Purusha Mandala).

## How it works

**Click any room chip or type a room name** (washroom, bedroom, master bedroom,
sunroom, kids room, mandir, toilet, kitchen, and many more) and the 3×3 house map
instantly lights up:

| Colour | Meaning |
|--------|---------|
| 🟢 **Green** | Best position — place the room here |
| 🟠 **Orange** | Second-best position — acceptable alternative |
| 🔴 **Red** | Always avoid — never place the room here |
| ⚪ Grey | Neutral zone |

The map covers all Vastu zones: **North, North-East, East, South-East, South,
South-West, West, North-West** and the sacred **Brahmasthan (centre)** — each
labelled with its Sanskrit name, ruling deity and element.

## Rooms covered (21)

Master Bedroom · Bedroom · Kids Room · Guest Bedroom · Mandir / Pooja Room ·
Kitchen · Toilet · Washroom / Bathroom · Sunroom · Living Room · Dining Room ·
Study Room · Staircase · Store Room · Main Entrance · Garage · Balcony ·
Underground Water Tank · Overhead Water Tank · Septic Tank · Brahmasthan

Typing also understands aliases — e.g. *pooja*, *puja room*, *temple* all find
the Mandir; *wc* finds the Toilet.

## 🎮 Gamification

- **⭐ Points** — +10 for every new room you explore
- **🎯 Quiz Challenge** — tap the zone you think is best: 🥇 +20, 🥈 +10, 🚫 −5
- **🔥 Streaks** — chain correct answers for streak badges
- **📈 Levels** — climb from *Vastu Newbie* 🌱 to *Vastu Guru* 🕉️
- **🏅 7 Badges** — First Steps, House Hunter, Master Architect, On Fire, and more
- Progress is saved automatically in your browser (localStorage)

## Run it

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
index.html      — page layout (explore mode, quiz mode, badges)
css/style.css   — game styling, colours, animations
js/data.js      — Vastu data: 21 rooms, 9 zones, levels, badges
js/app.js       — game logic: search, house map, quiz, scoring
```

> ⚠️ For education and fun. Consult a qualified Vastu expert for real
> construction or renovation decisions.
