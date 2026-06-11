/* ============================================================
   Vastu Shastra Room Placement Data
   Directions follow the classic 9-zone Vastu Purusha Mandala:
   NW N NE
   W  C  E      (C = Brahmasthan / centre)
   SW S SE
   Each room defines:
     best  -> GREEN  (ideal placement)
     good  -> ORANGE (acceptable second choice)
     avoid -> RED    (never place here)
   Anything not listed renders neutral (grey).
   ============================================================ */

const DIRECTIONS = {
  N:  { label: "North",      hindi: "Uttar",   deity: "Kubera (Wealth)",        element: "Water" },
  NE: { label: "North-East", hindi: "Ishan",   deity: "Ishana (Divinity)",      element: "Water" },
  E:  { label: "East",       hindi: "Purva",   deity: "Indra (Power)",          element: "Air"   },
  SE: { label: "South-East", hindi: "Agneya",  deity: "Agni (Fire)",            element: "Fire"  },
  S:  { label: "South",      hindi: "Dakshin", deity: "Yama (Discipline)",      element: "Earth" },
  SW: { label: "South-West", hindi: "Nairutya",deity: "Nirriti (Stability)",    element: "Earth" },
  W:  { label: "West",       hindi: "Paschim", deity: "Varuna (Fortune)",       element: "Water" },
  NW: { label: "North-West", hindi: "Vayavya", deity: "Vayu (Movement)",        element: "Air"   },
  C:  { label: "Centre",     hindi: "Brahmasthan", deity: "Brahma (Creation)",  element: "Space" }
};

/* Grid order used to render the 3x3 house map */
const GRID_ORDER = ["NW", "N", "NE", "W", "C", "E", "SW", "S", "SE"];

const ROOMS = [
  {
    id: "master-bedroom",
    name: "Master Bedroom",
    icon: "🛏️",
    aliases: ["master bedroom", "main bedroom", "couple bedroom", "parents room"],
    best:  ["SW"],
    good:  ["S", "W"],
    avoid: ["NE", "SE"],
    why: "South-West is ruled by the Earth element — it brings stability, authority and restful sleep for the head of the family.",
    tips: [
      "Sleep with your head towards the South or West.",
      "Place heavy wardrobes along the South or West wall.",
      "Avoid mirrors facing the bed."
    ]
  },
  {
    id: "bedroom",
    name: "Bedroom (General)",
    icon: "🛌",
    aliases: ["bedroom", "bed room", "sleeping room"],
    best:  ["SW", "S"],
    good:  ["W", "NW"],
    avoid: ["NE", "SE"],
    why: "Earth-dominated zones (SW, S) promote deep, grounded sleep. The fiery SE causes restlessness; the sacred NE should stay light and open.",
    tips: [
      "Keep the bed away from the wall sharing a toilet.",
      "Use calm, earthy colours on the walls.",
      "Never sleep with feet pointing towards the door."
    ]
  },
  {
    id: "kids-room",
    name: "Kids Room",
    icon: "🧸",
    aliases: ["kids room", "children room", "child room", "children's room", "kid room", "nursery"],
    best:  ["W"],
    good:  ["NW", "N"],
    avoid: ["SW", "SE"],
    why: "The West (Varuna) supports learning and creativity in children. South-West belongs to the elders, and the fiery South-East makes kids aggressive and restless.",
    tips: [
      "Study desk should face East or North.",
      "Use green or light blue tones for concentration.",
      "Kids should sleep with head towards the East or South."
    ]
  },
  {
    id: "guest-bedroom",
    name: "Guest Bedroom",
    icon: "🚪",
    aliases: ["guest bedroom", "guest room", "visitors room"],
    best:  ["NW"],
    good:  ["W", "N"],
    avoid: ["SW", "NE"],
    why: "North-West is ruled by Vayu (air/movement) — perfect for guests, who are temporary by nature. South-West would give guests dominance over the house owners.",
    tips: [
      "Keep guest beds in the SW corner of the NW room.",
      "Light, airy décor suits this moving-energy zone."
    ]
  },
  {
    id: "mandir",
    name: "Mandir / Pooja Room",
    icon: "🛕",
    aliases: ["mandir", "pooja room", "puja room", "temple", "prayer room", "pooja", "puja", "altar"],
    best:  ["NE"],
    good:  ["E", "N"],
    avoid: ["S", "SW", "C"],
    why: "North-East (Ishan Kona) is the most sacred zone — the corner of divinity and water. Morning sun purifies this space, ideal for prayer and meditation.",
    tips: [
      "Face East while praying.",
      "Never place the mandir under a staircase or next to a toilet.",
      "Idols should not face each other; keep them a few inches from the wall.",
      "Use white, light yellow or light blue colours."
    ]
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: "🍳",
    aliases: ["kitchen", "cooking room", "rasoi"],
    best:  ["SE"],
    good:  ["NW"],
    avoid: ["NE", "SW", "N", "C"],
    why: "South-East is the Agni (fire) corner — the natural home of the cooking flame. A kitchen in the watery NE or earthy SW creates elemental clash.",
    tips: [
      "Cook facing East.",
      "Place the sink in the NE of the kitchen, away from the stove (fire vs water).",
      "Heavy storage on the South and West walls."
    ]
  },
  {
    id: "toilet",
    name: "Toilet",
    icon: "🚽",
    aliases: ["toilet", "wc", "latrine", "lavatory", "commode"],
    best:  ["NW"],
    good:  ["W", "S"],
    avoid: ["NE", "SW", "C", "E"],
    why: "North-West (Vayu) is the zone of disposal and movement — waste leaves the house easily. A toilet in the sacred NE or stability-zone SW is the biggest Vastu defect.",
    tips: [
      "The toilet seat should face North or South (never East or West).",
      "Keep the toilet door closed at all times.",
      "Never build a toilet above or below the pooja room or kitchen."
    ]
  },
  {
    id: "washroom",
    name: "Washroom / Bathroom",
    icon: "🚿",
    aliases: ["washroom", "bathroom", "bath room", "bath", "shower room"],
    best:  ["NW"],
    good:  ["E", "W"],
    avoid: ["NE", "SW", "C"],
    why: "North-West handles outgoing water and air best. East is acceptable for a bathing-only space — morning sunlight is naturally antiseptic.",
    tips: [
      "Drains should slope towards the North or East.",
      "Use light colours; avoid dark blue or black.",
      "Mirror on the North or East wall."
    ]
  },
  {
    id: "sunroom",
    name: "Sunroom",
    icon: "☀️",
    aliases: ["sunroom", "sun room", "solarium", "sun lounge", "conservatory"],
    best:  ["E"],
    good:  ["NE", "N"],
    avoid: ["SW", "S"],
    why: "The East welcomes the rising sun (Indra) — exactly what a sunroom is built for. Gentle morning UV is healing; harsh SW afternoon heat is draining.",
    tips: [
      "Large openings on the East and North sides.",
      "Keep this zone clutter-free and low-height.",
      "Great spot for morning yoga and indoor plants."
    ]
  },
  {
    id: "living-room",
    name: "Living Room",
    icon: "🛋️",
    aliases: ["living room", "drawing room", "hall", "lounge", "sitting room", "family room"],
    best:  ["NE", "N"],
    good:  ["E", "NW"],
    avoid: ["SW"],
    why: "North and North-East invite light, openness and positive social energy — perfect for welcoming guests. The SW should hold the master bedroom, not common space.",
    tips: [
      "Seat the family head facing East or North.",
      "Heavy furniture towards the West or South-West of the room.",
      "Electronics on the South-East side."
    ]
  },
  {
    id: "dining-room",
    name: "Dining Room",
    icon: "🍽️",
    aliases: ["dining room", "dining", "dining hall", "eating area"],
    best:  ["W"],
    good:  ["E", "N"],
    avoid: ["S", "SW"],
    why: "West (Varuna) is the traditional zone of nourishment and satisfaction — meals here bring contentment and family bonding.",
    tips: [
      "Eat facing East or West, never South.",
      "Dining table should be square or rectangular, not circular.",
      "Place near the kitchen, ideally to its West."
    ]
  },
  {
    id: "study-room",
    name: "Study Room",
    icon: "📚",
    aliases: ["study room", "study", "library", "reading room", "home office", "office"],
    best:  ["NE", "E"],
    good:  ["N", "W"],
    avoid: ["SW", "SE"],
    why: "North-East and East carry the calm clarity of the morning sun and Mercury's intellect — ideal for focus, memory and learning.",
    tips: [
      "Face East or North while studying.",
      "Bookshelf on the East or North wall.",
      "Avoid studying under a beam or facing a blank wall."
    ]
  },
  {
    id: "staircase",
    name: "Staircase",
    icon: "🪜",
    aliases: ["staircase", "stairs", "stairway", "steps"],
    best:  ["SW"],
    good:  ["S", "W"],
    avoid: ["NE", "C"],
    why: "Heavy structures belong in the Earth zone (SW). A staircase in the NE or centre crushes the most sensitive energy points of the home.",
    tips: [
      "Stairs should turn clockwise while going up.",
      "Always keep an odd number of steps.",
      "Never build a pooja room, toilet or kitchen under the stairs."
    ]
  },
  {
    id: "store-room",
    name: "Store Room",
    icon: "📦",
    aliases: ["store room", "storeroom", "storage", "store", "godown"],
    best:  ["SW"],
    good:  ["W", "S", "NW"],
    avoid: ["NE", "C"],
    why: "Heavy stored goods anchor the South-West Earth zone, strengthening stability. Clutter in the NE blocks the home's incoming positive energy.",
    tips: [
      "Store grains in the SW or W.",
      "Empty containers should not be kept open.",
      "Declutter regularly — stagnant items hold stagnant energy."
    ]
  },
  {
    id: "main-entrance",
    name: "Main Entrance",
    icon: "🚪",
    aliases: ["main entrance", "entrance", "main door", "front door", "gate", "entry"],
    best:  ["NE", "N", "E"],
    good:  ["W", "NW"],
    avoid: ["SW", "S", "SE"],
    why: "An entrance in the North-East, North or East lets the morning sun and Kubera's prosperity flow straight into the home.",
    tips: [
      "The main door should be the largest door in the house.",
      "It should open inward and clockwise.",
      "Keep the entrance brightly lit and free of shoes/clutter.",
      "A nameplate invites positive opportunities."
    ]
  },
  {
    id: "garage",
    name: "Garage / Parking",
    icon: "🚗",
    aliases: ["garage", "parking", "car park", "car porch", "carport"],
    best:  ["NW"],
    good:  ["SE", "W"],
    avoid: ["NE", "SW", "C"],
    why: "Vehicles are moving objects — they belong in the Vayu (air/movement) corner, the North-West. They should never block the sacred NE.",
    tips: [
      "Park vehicles facing North or East.",
      "Keep flammables out of the garage's NE corner.",
      "The garage should not touch the main building's NE wall."
    ]
  },
  {
    id: "balcony",
    name: "Balcony / Verandah",
    icon: "🌅",
    aliases: ["balcony", "verandah", "veranda", "terrace", "porch", "deck"],
    best:  ["NE", "N", "E"],
    good:  ["NW"],
    avoid: ["SW", "S"],
    why: "Open, low, light spaces in the North and East welcome beneficial morning energy. Heavy, covered mass belongs to the South-West instead.",
    tips: [
      "Keep balconies in N/E lower than the rest of the floor.",
      "Avoid heavy planters in the NE balcony corner.",
      "Morning tea here recharges the whole day."
    ]
  },
  {
    id: "water-tank-underground",
    name: "Water Tank (Underground)",
    icon: "💧",
    aliases: ["underground water tank", "water tank underground", "borewell", "well", "sump", "underground tank"],
    best:  ["NE"],
    good:  ["N", "E"],
    avoid: ["SW", "SE", "C"],
    why: "Water below ground level in the North-East amplifies the zone's natural water element — a classic prosperity booster.",
    tips: [
      "Never dig a well or sump in the SW — it destabilises the house.",
      "Keep the tank clean; stored water reflects stored fortune."
    ]
  },
  {
    id: "water-tank-overhead",
    name: "Water Tank (Overhead)",
    icon: "🗼",
    aliases: ["overhead water tank", "water tank overhead", "rooftop tank", "overhead tank", "terrace tank"],
    best:  ["SW"],
    good:  ["W", "S"],
    avoid: ["NE", "SE", "C"],
    why: "Overhead weight strengthens the heavy South-West zone. An elevated tank in the NE crushes the most sacred, light corner of the home.",
    tips: [
      "Use a dark-coloured tank in the SW (absorbs heat, adds weight).",
      "Keep it slightly off the exact SW corner point."
    ]
  },
  {
    id: "septic-tank",
    name: "Septic Tank",
    icon: "🕳️",
    aliases: ["septic tank", "soak pit", "sewage tank", "drainage pit"],
    best:  ["NW"],
    good:  ["W"],
    avoid: ["NE", "SW", "SE", "C", "E"],
    why: "Waste must exit through the North-West movement zone. A septic tank in the NE poisons the home's most positive energy source.",
    tips: [
      "Keep it away from the main entrance and kitchen.",
      "The tank should not touch the compound wall on the N or E side."
    ]
  },
  {
    id: "brahmasthan",
    name: "Brahmasthan (Centre)",
    icon: "🕉️",
    aliases: ["brahmasthan", "centre", "center", "courtyard", "central courtyard", "aangan"],
    best:  ["C"],
    good:  [],
    avoid: ["NW", "N", "NE", "W", "E", "SW", "S", "SE"],
    why: "The centre of the home is the lungs of the Vastu Purusha. It must remain open, light and empty — a courtyard, skylight or open hall is ideal.",
    tips: [
      "No walls, pillars, toilets, stairs or heavy furniture in the centre.",
      "A skylight or open courtyard here energises the whole house.",
      "Keep it spotlessly clean."
    ]
  }
];

/* ---- Quiz question pool: built from the same data so it never drifts ---- */
const LEVELS = [
  { min: 0,    title: "Vastu Newbie",      icon: "🌱" },
  { min: 100,  title: "Direction Seeker",  icon: "🧭" },
  { min: 250,  title: "Energy Apprentice", icon: "✨" },
  { min: 500,  title: "Zone Master",       icon: "🏠" },
  { min: 900,  title: "Vastu Pandit",      icon: "📜" },
  { min: 1500, title: "Vastu Guru",        icon: "🕉️" }
];

const BADGES = [
  { id: "first-room",   icon: "🔍", name: "First Steps",     desc: "Explore your first room" },
  { id: "five-rooms",   icon: "🗺️", name: "House Hunter",    desc: "Explore 5 different rooms" },
  { id: "all-rooms",    icon: "🏆", name: "Master Architect", desc: "Explore every room" },
  { id: "first-quiz",   icon: "🎯", name: "Quiz Taker",      desc: "Answer your first quiz question" },
  { id: "streak-3",     icon: "🔥", name: "On Fire",         desc: "Get a 3-answer streak in the quiz" },
  { id: "streak-7",     icon: "⚡", name: "Unstoppable",     desc: "Get a 7-answer streak in the quiz" },
  { id: "score-500",    icon: "💎", name: "Half a Grand",    desc: "Reach 500 total points" }
];
