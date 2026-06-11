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
  N:  { label: "North",      hindi: "Uttar",       deity: "Kubera",  domain: "Wealth & career",
        element: "Water", rating: "good",        nature: "Auspicious — keep light and open",
        interiors: {
          colors:    "Green, light blue, pista — tones of water and growth",
          furniture: "Low, light furniture; leave floor area visible; no tall storage",
          materials: "Water features, aquarium, glass; avoid heavy stone cladding",
          decor:     "Mirror on the North wall invites opportunities; money plant; waterfall or river artwork"
        } },
  NE: { label: "North-East", hindi: "Ishan",       deity: "Ishana",  domain: "Divinity & wisdom",
        element: "Water", rating: "good",        nature: "Most auspicious — prayer, water, openness",
        interiors: {
          colors:    "White, light yellow, very light blue — keep it the brightest corner",
          furniture: "Minimal and lowest in the house; never tall wardrobes or lofts here",
          materials: "Marble or light stone; a small water urn; no metal heaviness",
          decor:     "Tulsi or sacred plants, diya or soft lamp, spiritual artwork; absolutely no clutter, dustbins or shoes"
        } },
  E:  { label: "East",       hindi: "Purva",       deity: "Indra",   domain: "Health & power",
        element: "Air",   rating: "good",        nature: "Auspicious — morning sun, entrances",
        interiors: {
          colors:    "White, light green, cream — let morning light dominate",
          furniture: "Light seating; keep windows unblocked by tall pieces",
          materials: "Light wood, cane, cotton fabrics",
          decor:     "Mirror on the East wall is fine; rising-sun or garden artwork; fresh flowers"
        } },
  SE: { label: "South-East", hindi: "Agneya",      deity: "Agni",    domain: "Fire & energy",
        element: "Fire",  rating: "conditional", nature: "Fire zone — ideal for kitchen only",
        interiors: {
          colors:    "Red, orange, coral and pink accents — feed the fire element",
          furniture: "Kitchen mass and appliances; avoid beds and water-blue décor",
          materials: "Granite, fire-resistant surfaces; electrical panels suit this corner",
          decor:     "Bright warm lighting; no fountains, aquariums or blue artwork (water vs fire clash)"
        } },
  S:  { label: "South",      hindi: "Dakshin",     deity: "Yama",    domain: "Discipline & rest",
        element: "Earth", rating: "conditional", nature: "Heavy zone — bedrooms, storage",
        interiors: {
          colors:    "Coral red, earthy maroon, warm brown",
          furniture: "Medium-heavy pieces; bed with headboard on the South wall",
          materials: "Solid wood, brick textures",
          decor:     "Restful artwork; no mirror facing the bed; thick curtains welcome"
        } },
  SW: { label: "South-West", hindi: "Nairutya",    deity: "Nirriti", domain: "Stability & strength",
        element: "Earth", rating: "conditional", nature: "Heaviest zone — master bedroom; avoid openings",
        interiors: {
          colors:    "Earthy browns, beige, terracotta, mustard — ground the Earth element",
          furniture: "Tallest and heaviest furniture: wardrobes, safe (opening towards North), master bed",
          materials: "Stone, solid timber; raised flooring is favourable",
          decor:     "Family photographs strengthen bonds; avoid water features, mirrors and excessive glass"
        } },
  W:  { label: "West",       hindi: "Paschim",     deity: "Varuna",  domain: "Fortune & nourishment",
        element: "Water", rating: "conditional", nature: "Stable zone — dining, kids room, study",
        interiors: {
          colors:    "Blue, grey, white — calm and satisfying tones",
          furniture: "Dining table, study desks, moderate storage along the West wall",
          materials: "Mixed wood and metal acceptable",
          decor:     "Achievement boards and certificates for kids; balanced lighting"
        } },
  NW: { label: "North-West", hindi: "Vayavya",     deity: "Vayu",    domain: "Movement & change",
        element: "Air",   rating: "conditional", nature: "Movement zone — guests, toilets, garage",
        interiors: {
          colors:    "White, cream, light grey — airy and mobile",
          furniture: "Light, movable pieces; guest beds; nothing permanent or anchored",
          materials: "Metal (silver tones) suits Vayu; wind chimes",
          decor:     "Keep it ventilated; good corner for items you want to move (stock, items for sale)"
        } },
  C:  { label: "Centre",     hindi: "Brahmasthan", deity: "Brahma",  domain: "Creation & space",
        element: "Space", rating: "open",        nature: "Keep completely open — no construction",
        interiors: {
          colors:    "White or light yellow if treated at all",
          furniture: "None — no furniture, pillars, beams or storage",
          materials: "Open-to-sky courtyard or skylight is ideal",
          decor:     "A rangoli or floor medallion is the only ornament it needs; keep spotless"
        } }
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

/* ============================================================
   32-Pada Main Entrance Chart
   The outer ring of the 9x9 Vastu Purusha Mandala holds 32
   padas (steps), each ruled by a deity. The position of the
   main door within its side decides the result. Verdicts use
   the same language as rooms: best / good / avoid.
   Sides are numbered clockwise: N1..N8 (NW->NE), E1..E8
   (NE->SE), S1..S8 (SE->SW), W1..W8 (SW->NW).
   ============================================================ */
const PADAS = [
  /* ---- North side, NW -> NE ---- */
  { code: "N1", side: "N", deity: "Roga",        verdict: "avoid", effect: "Illness and instability in the family" },
  { code: "N2", side: "N", deity: "Naga",        verdict: "avoid", effect: "Enemies, jealousy and mental unrest" },
  { code: "N3", side: "N", deity: "Mukhya",      verdict: "best",  effect: "Prosperity, name and recognition" },
  { code: "N4", side: "N", deity: "Bhallata",    verdict: "best",  effect: "Abundance and ever-growing wealth" },
  { code: "N5", side: "N", deity: "Soma",        verdict: "best",  effect: "Wealth, opportunities and peace (Kubera's seat)" },
  { code: "N6", side: "N", deity: "Bhujaga",     verdict: "avoid", effect: "Anxiety and hidden opposition" },
  { code: "N7", side: "N", deity: "Aditi",       verdict: "avoid", effect: "Indiscipline and lack of direction" },
  { code: "N8", side: "N", deity: "Diti",        verdict: "avoid", effect: "Financial drain and disputes" },
  /* ---- East side, NE -> SE ---- */
  { code: "E1", side: "E", deity: "Shikhi",      verdict: "avoid", effect: "Accidents and fear of fire (corner pada)" },
  { code: "E2", side: "E", deity: "Parjanya",    verdict: "avoid", effect: "Unnecessary expenditure" },
  { code: "E3", side: "E", deity: "Jayanta",     verdict: "best",  effect: "Victory, success and financial gains" },
  { code: "E4", side: "E", deity: "Indra",       verdict: "best",  effect: "Power, authority and favour from government" },
  { code: "E5", side: "E", deity: "Surya",       verdict: "avoid", effect: "Anger and friction with authorities" },
  { code: "E6", side: "E", deity: "Satya",       verdict: "avoid", effect: "Broken promises and unreliability" },
  { code: "E7", side: "E", deity: "Bhrisha",     verdict: "avoid", effect: "Cruel temperament and harshness" },
  { code: "E8", side: "E", deity: "Antariksha",  verdict: "avoid", effect: "Theft and losses (corner-adjacent)" },
  /* ---- South side, SE -> SW ---- */
  { code: "S1", side: "S", deity: "Anila",       verdict: "avoid", effect: "Instability and restlessness (corner pada)" },
  { code: "S2", side: "S", deity: "Pusha",       verdict: "avoid", effect: "Bondage and servitude" },
  { code: "S3", side: "S", deity: "Vitatha",     verdict: "avoid", effect: "Falsehood and deceit around the family" },
  { code: "S4", side: "S", deity: "Grihakshata", verdict: "good",  effect: "The one workable South entrance — material gains" },
  { code: "S5", side: "S", deity: "Yama",        verdict: "avoid", effect: "Fear, debts and heaviness" },
  { code: "S6", side: "S", deity: "Gandharva",   verdict: "avoid", effect: "Loss of wealth through pleasures" },
  { code: "S7", side: "S", deity: "Bhringraja",  verdict: "avoid", effect: "Poverty and scarcity" },
  { code: "S8", side: "S", deity: "Mriga",       verdict: "avoid", effect: "Weak health and timidity (corner-adjacent)" },
  /* ---- West side, SW -> NW ---- */
  { code: "W1", side: "W", deity: "Pitra",       verdict: "avoid", effect: "Debts and ancestral displeasure (corner pada)" },
  { code: "W2", side: "W", deity: "Dauwarika",   verdict: "avoid", effect: "Harshness and quarrels" },
  { code: "W3", side: "W", deity: "Sugriva",     verdict: "best",  effect: "Gains, recovery of dues and support" },
  { code: "W4", side: "W", deity: "Pushpadanta", verdict: "best",  effect: "Fortune, fulfilment and happiness" },
  { code: "W5", side: "W", deity: "Varuna",      verdict: "good",  effect: "General welfare and steady flow of resources" },
  { code: "W6", side: "W", deity: "Asura",       verdict: "avoid", effect: "Fear and negative influences" },
  { code: "W7", side: "W", deity: "Shosha",      verdict: "avoid", effect: "Drain of wealth and vitality" },
  { code: "W8", side: "W", deity: "Papayakshma", verdict: "avoid", effect: "Chronic disease (corner-adjacent)" }
];

/* ============================================================
   Site & Plot selection guide — the checks an architect makes
   before a single wall is drawn.
   ============================================================ */
const SITE_GUIDE = [
  {
    icon: "⬛",
    title: "Plot Shape",
    points: [
      "Square is ideal; rectangle is fine up to a 1:2 ratio.",
      "Gaumukhi (narrow front, wider back) suits homes; Shermukhi (wide front, narrow back) suits only commercial use.",
      "Extension of the North-East corner is auspicious; extension of any other corner is a defect.",
      "A cut South-West corner is the most serious plot defect — avoid such plots if possible.",
      "Avoid triangular, circular and irregular plots for residences."
    ]
  },
  {
    icon: "⛰️",
    title: "Slope & Levels",
    points: [
      "Ground should slope down towards the North-East; a slope towards the South-West is inauspicious.",
      "South-West plinth and floor levels highest; North-East lowest.",
      "Basement, if any, only in the North or North-East portion.",
      "Rainwater should drain out towards the North-East."
    ]
  },
  {
    icon: "🛣️",
    title: "Roads & Veedhi Shoola",
    points: [
      "Roads on the North and East of the plot are the most favourable; North-East corner road junctions are excellent.",
      "Veedhi Shoola (a road thrusting into the plot from a T-junction): from the North-East it is auspicious; from the South-West it is the most harmful.",
      "Thrusts from the South or West bring instability — set the building back and screen with heavy planting.",
      "Plots between two parallel roads (N–S or E–W through-plots) need careful entrance planning."
    ]
  },
  {
    icon: "🌊",
    title: "Surroundings",
    points: [
      "Water bodies (river, lake, pond) to the North or North-East are highly auspicious.",
      "Hills, tall buildings and heavy structures should be to the South or South-West — they shield, not block.",
      "Avoid plots facing cremation grounds, hospitals or directly opposite temple entrances.",
      "Large trees belong on the South and West boundaries, never shading the North-East."
    ]
  },
  {
    icon: "🏗️",
    title: "Open Space & Building Mass",
    points: [
      "Leave more open space on the North and East sides of the building than on the South and West.",
      "Build the heavier, taller mass towards the South-West; step heights down towards the North-East.",
      "Compound walls thicker and higher on the South and West; lighter on the North and East.",
      "Borewell or underground sump in the North-East of the open space; overhead tank over the South-West block."
    ]
  }
];

/* ============================================================
   Common Vastu doshas (defects) and practical remedies.
   Relocation is always the first remedy; the rest are
   mitigations for existing construction.
   ============================================================ */
const DOSHAS = [
  {
    defect: "Toilet in the North-East",
    severity: "high",
    why: "Waste in the most sacred water zone — the classic worst defect, linked to health and financial decline.",
    remedies: [
      "Best: convert to a storeroom or bathing-only space and build the WC in the NW.",
      "If it must stay: keep the door always closed, lid down, add a bright light and keep it spotless.",
      "Use light colours and place a small sea-salt bowl, replaced weekly."
    ]
  },
  {
    defect: "Kitchen in the North-East or North",
    severity: "high",
    why: "Fire burning in the water zone creates an elemental clash — friction and drained finances.",
    remedies: [
      "Relocate the hob to the SE corner of the same kitchen and cook facing East.",
      "Use yellow or cream walls, never red, in a NE kitchen.",
      "Shift heavy storage to the kitchen's South and West walls."
    ]
  },
  {
    defect: "Kitchen in the South-West",
    severity: "medium",
    why: "Fire destabilises the Earth corner that should anchor the family.",
    remedies: [
      "Place the hob in the SE corner of the room.",
      "Add earthy tones and heavy storage to restore the zone's weight."
    ]
  },
  {
    defect: "Master bedroom in the South-East",
    severity: "medium",
    why: "Sleeping in the fire zone causes short tempers, arguments and restless sleep.",
    remedies: [
      "Move the couple to the SW room and give the SE room another use.",
      "If not possible: bed in the SW corner of the room, head towards South; avoid red décor; no mirrors facing the bed."
    ]
  },
  {
    defect: "Main entrance in the South-West",
    severity: "high",
    why: "Openings in the heaviest zone leak the home's stability (see padas W1, S8).",
    remedies: [
      "If a second entrance on the N or E exists, make it the daily-use door.",
      "Keep the SW door solid (no glass), heavier than other doors, and very well lit.",
      "A threshold (umbar) and a panelled door reduce the defect."
    ]
  },
  {
    defect: "Staircase in the centre (Brahmasthan)",
    severity: "high",
    why: "Heavy load on the home's lungs — pressure on health and harmony of the whole family.",
    remedies: [
      "Keep the area under and around the stairs completely free of storage.",
      "Maximise light here — a skylight above the stairwell helps.",
      "Never put a toilet, kitchen or pooja under these stairs."
    ]
  },
  {
    defect: "Staircase in the North-East",
    severity: "high",
    why: "Mass in the corner that must remain the lightest and most open.",
    remedies: [
      "Paint it in light colours and keep the space beneath open and bright.",
      "Strengthen the SW with weight (tall storage) to restore balance."
    ]
  },
  {
    defect: "Cut or missing South-West corner",
    severity: "high",
    why: "The house loses its anchor — savings and stability suffer.",
    remedies: [
      "Place the heaviest furniture in the deepest available SW point.",
      "Raise floor level or add a heavy planter/stone feature at the cut.",
      "Keep SW windows small and usually closed."
    ]
  },
  {
    defect: "Underground water tank / borewell in the South-West",
    severity: "high",
    why: "A void below the anchor zone destabilises the entire dwelling.",
    remedies: [
      "Decommission if feasible and dig a new sump in the NE.",
      "Otherwise keep it sealed, covered with a heavy slab, and add weight above it."
    ]
  },
  {
    defect: "Septic tank in the North-East",
    severity: "high",
    why: "Contamination of the prosperity zone — the strongest drain on health and wealth.",
    remedies: [
      "Relocate to the NW if at all possible — this defect responds poorly to soft remedies.",
      "Until then: keep the NE surface spotless, well lit and free of any other load."
    ]
  },
  {
    defect: "Bedroom directly above the kitchen",
    severity: "medium",
    why: "Sleeping over fire brings irritability and disturbed sleep.",
    remedies: [
      "Shift the bed so it does not sit directly above the hob.",
      "Use cooling colours (light blue, white) in the bedroom."
    ]
  },
  {
    defect: "Mirror facing the bed",
    severity: "medium",
    why: "Reflection of the sleeping body is believed to disturb rest and relationships.",
    remedies: [
      "Move the mirror to the North or East wall, or inside a wardrobe.",
      "Cover it with a curtain at night if it cannot move."
    ]
  },
  {
    defect: "Heavy storage or pillar in the Brahmasthan",
    severity: "medium",
    why: "The centre must breathe; blocking it congests the whole house's energy.",
    remedies: [
      "Clear the central ninth of the floor plan of furniture and clutter.",
      "If a structural column exists, keep its surroundings open and light-coloured."
    ]
  },
  {
    defect: "Children sleeping in the South-West room",
    severity: "medium",
    why: "SW confers authority — children here tend to overrule parents and grow stubborn.",
    remedies: [
      "Swap rooms: parents to SW, children to the West or NW room.",
      "If unavoidable, place the child's bed in the room's NW and study desk facing East."
    ]
  },
  {
    defect: "Stove and sink adjacent on one counter",
    severity: "medium",
    why: "Fire and water side by side create elemental friction — small daily conflicts.",
    remedies: [
      "Separate them by at least 2–3 ft or place a wooden chopping station between.",
      "Ideally: hob in the SE of the kitchen, sink towards the NE."
    ]
  }
];
