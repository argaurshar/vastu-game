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


/* ============================================================
   Room placement model:
     best   -> the single first-best zone   (GREEN, "1 · BEST")
     second -> ordered alternates           (ORANGE, "2A", "2B", "2C" …)
     avoid  -> never place here             (RED, "AVOID")
   The order of the `second` array is meaningful: index 0 = 2A,
   index 1 = 2B, and so on. Anything unlisted renders neutral.
   ============================================================ */
const ROOMS = [
  {
    id: "master-bedroom",
    name: "Master Bedroom",
    icon: "🛏️",
    aliases: ["master bedroom", "main bedroom", "couple bedroom", "parents room"],
    best:   "SW",
    second: ["S", "W"],
    avoid:  ["NE", "SE", "N"],
    why: "South-West is ruled by the Earth element — it brings stability, authority and restful sleep for the head of the family. South and West are the next-strongest earth/water zones.",
    tips: [
      "Sleep with your head towards the South or West.",
      "Place heavy wardrobes along the South or West wall.",
      "Avoid mirrors facing the bed and a toilet sharing the headboard wall."
    ]
  },
  {
    id: "bedroom",
    name: "Bedroom (General)",
    icon: "🛌",
    aliases: ["bedroom", "bed room", "sleeping room"],
    best:   "SW",
    second: ["S", "W"],
    avoid:  ["NE", "SE"],
    why: "Earth-dominated zones promote deep, grounded sleep. South-West is best; South and West are the strong alternates. The fiery SE causes restlessness and the sacred NE must stay light.",
    tips: [
      "Keep the bed away from any wall shared with a toilet.",
      "Use calm, earthy colours on the walls.",
      "Never sleep with feet pointing towards the door."
    ]
  },
  {
    id: "kids-room",
    name: "Kids Room",
    icon: "🧸",
    aliases: ["kids room", "children room", "child room", "children's room", "kid room", "nursery"],
    best:   "W",
    second: ["NW", "N"],
    avoid:  ["SW", "SE", "S"],
    why: "The West (Varuna) supports a child's learning and creativity. North-West and North are good alternates. South-West belongs to the elders and the fiery SE makes children restless.",
    tips: [
      "Study desk should face East or North.",
      "Children should sleep with head towards the East or South.",
      "Use green or light blue tones to aid concentration."
    ]
  },
  {
    id: "guest-bedroom",
    name: "Guest Bedroom",
    icon: "🛎️",
    aliases: ["guest bedroom", "guest room", "visitors room"],
    best:   "NW",
    second: ["W", "N"],
    avoid:  ["SW", "NE", "SE"],
    why: "North-West (Vayu, movement) suits guests, who are temporary by nature. West and North are workable alternates. South-West would give guests dominance over the owners.",
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
    best:   "NE",
    second: ["E", "N"],
    avoid:  ["S", "SW", "SE", "C"],
    why: "North-East (Ishan Kona) is the most sacred zone — the corner of divinity and water. East and North are the next-best. Morning sun purifies this space for prayer and meditation.",
    tips: [
      "Face East or North while praying.",
      "Never place the mandir under a staircase or next to/above a toilet.",
      "Idols should not face each other; keep them a few inches off the wall.",
      "Use white, light yellow or light blue colours."
    ]
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: "🍳",
    aliases: ["kitchen", "cooking room", "rasoi"],
    best:   "SE",
    second: ["NW", "S"],
    avoid:  ["NE", "SW", "N", "C"],
    why: "South-East is the Agni (fire) corner — the natural home of the cooking flame. North-West is the recognised alternate; South is workable. A kitchen in the watery NE or earthy SW creates an elemental clash.",
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
    best:   "NW",
    second: ["W", "S"],
    avoid:  ["NE", "SW", "C", "E"],
    why: "North-West (Vayu) is the zone of disposal — waste leaves the house easily. West and South are acceptable alternates. A toilet in the sacred NE or the stability-zone SW is the worst Vastu defect.",
    tips: [
      "The toilet seat should face North or South (never East or West).",
      "Keep the door closed and the exhaust running.",
      "Never build a toilet above or below the pooja room or kitchen."
    ]
  },
  {
    id: "washroom",
    name: "Washroom / Bathroom",
    icon: "🚿",
    aliases: ["washroom", "bathroom", "bath room", "bath", "shower room", "snan ghar"],
    best:   "E",
    second: ["NW", "N"],
    avoid:  ["SW", "SE", "C"],
    why: "For a bathing-only room the East is best — morning sunlight is naturally antiseptic. North-West handles outgoing water well and North is fine. Keep it out of the SW anchor and the SE fire corner.",
    tips: [
      "Drains should slope towards the North or East.",
      "Mirror on the North or East wall.",
      "Use light colours; avoid dark blue or black."
    ]
  },
  {
    id: "sunroom",
    name: "Sunroom",
    icon: "☀️",
    aliases: ["sunroom", "sun room", "solarium", "sun lounge", "conservatory"],
    best:   "E",
    second: ["NE", "N"],
    avoid:  ["SW", "S"],
    why: "The East welcomes the rising sun (Indra) — exactly what a sunroom is built for. North-East and North are the next-best. Harsh SW afternoon heat is draining.",
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
    best:   "N",
    second: ["NE", "E", "NW"],
    avoid:  ["SW", "S"],
    why: "North (Kubera) invites light and positive social energy. North-East and East are excellent alternates and North-West works for a formal drawing room. The SW should hold the master bedroom, not common space.",
    tips: [
      "Seat the family head facing East or North.",
      "Heavy furniture towards the West or South-West of the room.",
      "Electronics and the TV on the South-East side."
    ]
  },
  {
    id: "dining-room",
    name: "Dining Room",
    icon: "🍽️",
    aliases: ["dining room", "dining", "dining hall", "eating area"],
    best:   "W",
    second: ["NW", "E"],
    avoid:  ["SW", "S"],
    why: "West (Varuna) is the traditional zone of nourishment and satisfaction. North-West (near the kitchen) and East are good alternates. Avoid dining in the heavy SW or the disciplined South.",
    tips: [
      "Eat facing East, North or West — never South.",
      "Dining table should be square or rectangular, not circular.",
      "Place it adjoining the kitchen, ideally to its West."
    ]
  },
  {
    id: "study-room",
    name: "Study Room",
    icon: "📚",
    aliases: ["study room", "study", "library", "reading room"],
    best:   "NE",
    second: ["E", "N", "W"],
    avoid:  ["SW", "SE", "S"],
    why: "North-East and East carry the calm clarity of the morning sun — ideal for focus and memory. North aids career study and West suits steady, long-hour work. Avoid the heavy SW and fiery SE.",
    tips: [
      "Face East or North while studying.",
      "Bookshelf on the South or West wall, never the NE.",
      "Avoid studying under a beam or facing a blank wall."
    ]
  },
  {
    id: "home-office",
    name: "Home Office / Workspace",
    icon: "💼",
    aliases: ["home office", "office", "work from home", "workspace", "cabin", "work room"],
    best:   "N",
    second: ["E", "NW", "W"],
    avoid:  ["NE", "SE"],
    why: "North is Kubera's zone of wealth and business growth; East gives drive and recognition. North-West and West suit administrative work. The owner should sit in the room's SW corner facing North or East.",
    tips: [
      "Sit with your back to a solid South or West wall, facing North or East.",
      "Keep the desk's North-East corner clear for cash flow and clarity.",
      "Place the safe/locker on the South-West wall opening towards the North."
    ]
  },
  {
    id: "elders-room",
    name: "Elders / Grandparents Room",
    icon: "👴",
    aliases: ["elders room", "grandparents room", "parents room", "in-laws room", "old age room"],
    best:   "SW",
    second: ["S", "W"],
    avoid:  ["NE", "SE"],
    why: "The South-West gives the elders the same authority, stability and grounding as the head of the family. South and West are calm, steady alternates that support rest and respect.",
    tips: [
      "Bed in the SW of the room, head towards South.",
      "Keep the room well-ventilated with an easy, step-free approach.",
      "Earthy, warm colours suit this zone."
    ]
  },
  {
    id: "cash-locker",
    name: "Cash Locker / Safe (Almirah)",
    icon: "🔐",
    aliases: ["cash locker", "safe", "locker", "almirah", "money", "valuables", "jewellery", "tijori", "vault"],
    best:   "SW",
    second: ["S", "W"],
    avoid:  ["NE", "SE", "C"],
    why: "Wealth is anchored in the heavy South-West and should open towards the North (Kubera) so it keeps refilling. South and West also hold value securely. Never keep the safe in the light NE or fiery SE.",
    tips: [
      "Place the safe against the South or West wall, its door opening towards the North.",
      "Keep a small amount of cash or gold always inside — never let it sit empty.",
      "Do not put the locker in a bedroom's SE or under a beam."
    ]
  },
  {
    id: "wardrobe",
    name: "Wardrobe / Dressing Room",
    icon: "👗",
    aliases: ["wardrobe", "dressing room", "dresser", "closet", "almirah", "cupboard"],
    best:   "SW",
    second: ["S", "W"],
    avoid:  ["NE", "SE"],
    why: "Heavy storage belongs in the earth zones. South-West is best, with South and West as alternates — they add the weight these corners need. Keep wardrobes out of the light North-East.",
    tips: [
      "Tall wardrobes along the South or West wall.",
      "A dressing mirror on the North or East wall; never facing the bed.",
      "Store heavier items on the lower shelves."
    ]
  },
  {
    id: "staircase",
    name: "Staircase",
    icon: "🪜",
    aliases: ["staircase", "stairs", "stairway", "steps"],
    best:   "SW",
    second: ["S", "W"],
    avoid:  ["NE", "C", "N", "E"],
    why: "A staircase is a heavy structure and belongs in the Earth zone (SW), with South and West as alternates. Stairs in the NE or the centre crush the most sensitive energy points of the home.",
    tips: [
      "Stairs should turn clockwise while going up.",
      "Always keep an odd number of steps.",
      "Never build a pooja room, toilet or kitchen under the stairs."
    ]
  },
  {
    id: "lift",
    name: "Lift / Elevator",
    icon: "🛗",
    aliases: ["lift", "elevator", "home lift"],
    best:   "SW",
    second: ["S", "W"],
    avoid:  ["NE", "C", "N", "E"],
    why: "A lift is heavy and in constant motion, so it sits best in the South-West, with South and West acceptable. It must never occupy the light North-East or the open Brahmasthan.",
    tips: [
      "Keep the lift shaft out of the exact centre of the plan.",
      "Balance a SW lift with equally heavy construction around it.",
      "Never sacrifice the NE corner for a lift or machine room."
    ]
  },
  {
    id: "store-room",
    name: "Store Room",
    icon: "📦",
    aliases: ["store room", "storeroom", "storage", "store", "godown", "pantry"],
    best:   "SW",
    second: ["W", "S", "NW"],
    avoid:  ["NE", "C"],
    why: "Heavy stored goods anchor the South-West Earth zone. West and South are strong alternates and North-West suits a fast-moving pantry. Clutter in the NE blocks the home's incoming positive energy.",
    tips: [
      "Store grains and heavy stock in the SW or W.",
      "Keep a moving pantry (daily-use) in the NW.",
      "Declutter regularly — stagnant items hold stagnant energy."
    ]
  },
  {
    id: "main-entrance",
    name: "Main Entrance",
    icon: "🚪",
    aliases: ["main entrance", "entrance", "main door", "front door", "gate", "entry"],
    best:   "NE",
    second: ["N", "E", "W"],
    avoid:  ["SW", "S", "SE"],
    why: "An entrance in the North-East lets morning sun and prosperity flow in. North (Kubera) and East (Indra) are the next-best, and West is workable. Use the 32-pada planner to fix the exact door position on the chosen wall.",
    tips: [
      "The main door should be the largest door in the house.",
      "It should open inward and clockwise.",
      "Place the door on an auspicious pada (N3/N4/N5, E3/E4, W3/W4).",
      "Keep the entrance bright, clean and free of shoes/clutter."
    ]
  },
  {
    id: "garage",
    name: "Garage / Parking",
    icon: "🚗",
    aliases: ["garage", "parking", "car park", "car porch", "carport"],
    best:   "NW",
    second: ["SE", "S"],
    avoid:  ["NE", "SW", "C"],
    why: "Vehicles are moving objects, so they belong in the Vayu (air/movement) corner, the North-West. South-East and South are acceptable alternates. Parking should never block the sacred NE.",
    tips: [
      "Park vehicles facing North or East.",
      "Keep flammables out of the garage's NE corner.",
      "The garage should not touch the main building's NE wall."
    ]
  },
  {
    id: "servant-room",
    name: "Servant Room",
    icon: "🧹",
    aliases: ["servant room", "maid room", "helper room", "staff room", "driver room"],
    best:   "NW",
    second: ["SE", "W"],
    avoid:  ["NE", "SW", "C"],
    why: "North-West suits help and staff, whose role is supportive and changeable. South-East and West are workable. Staff quarters must not take the SW (owner's authority) or the sacred NE.",
    tips: [
      "Keep it as a self-contained corner unit.",
      "Provide separate ventilation and a simple, clean layout.",
      "Avoid placing it over the pooja room or main bedroom."
    ]
  },
  {
    id: "gym",
    name: "Gym / Exercise Room",
    icon: "🏋️",
    aliases: ["gym", "exercise room", "workout room", "fitness", "yoga room"],
    best:   "NW",
    second: ["S", "E"],
    avoid:  ["NE", "SW", "C"],
    why: "Physical activity is movement energy, best placed in the North-West. South gives stamina and East gives morning vitality. Keep heavy equipment out of the NE and the central Brahmasthan.",
    tips: [
      "Face North or East while exercising.",
      "Heaviest machines along the South or West wall.",
      "Keep a dedicated yoga/meditation mat in the East or NE of the room."
    ]
  },
  {
    id: "balcony",
    name: "Balcony / Verandah",
    icon: "🌅",
    aliases: ["balcony", "verandah", "veranda", "terrace", "porch", "deck"],
    best:   "NE",
    second: ["N", "E"],
    avoid:  ["SW", "S", "W"],
    why: "Open, low, light spaces in the North-East, North and East welcome beneficial morning energy. Heavy, covered mass belongs to the South and West instead.",
    tips: [
      "Keep N/E balconies lower than the rest of the floor.",
      "Avoid heavy planters in the NE balcony corner.",
      "Morning tea here recharges the whole day."
    ]
  },
  {
    id: "garden",
    name: "Garden / Lawn",
    icon: "🌳",
    aliases: ["garden", "lawn", "yard", "open space", "landscaping", "kitchen garden"],
    best:   "NE",
    second: ["N", "E"],
    avoid:  ["SW", "S"],
    why: "Open lawn and light planting belong in the North-East, North and East, keeping these zones low and bright. Tall, heavy trees should sit on the South and West to weight those corners.",
    tips: [
      "Keep the NE open with grass or low plants only.",
      "Plant big trees (mango, neem) on the South or West boundary.",
      "Tulsi in the NE; avoid thorny plants and cactus near the house."
    ]
  },
  {
    id: "tulsi",
    name: "Tulsi Plant (Vrindavan)",
    icon: "🌿",
    aliases: ["tulsi", "tulsi plant", "holy basil", "tulsi vrindavan", "plant"],
    best:   "NE",
    second: ["E", "N"],
    avoid:  ["S", "SW", "W"],
    why: "The sacred Tulsi thrives on morning sun and purifies the most auspicious corner. North-East is ideal, with East and North as alternates. It should never sit in the southern or western heavy zones.",
    tips: [
      "Raise it on a clean platform (Vrindavan) in the NE of the courtyard or balcony.",
      "Offer water in the morning; keep the surroundings clean.",
      "An odd number of Tulsi plants is considered auspicious."
    ]
  },
  {
    id: "swimming-pool",
    name: "Swimming Pool / Water Body",
    icon: "🏊",
    aliases: ["swimming pool", "pool", "water body", "fountain", "pond", "water feature"],
    best:   "NE",
    second: ["N", "E"],
    avoid:  ["SW", "SE", "S", "C"],
    why: "Standing water amplifies the water element of the North-East, North and East — a prosperity booster when kept clean. Water in the SW destabilises the home and in the SE clashes with fire.",
    tips: [
      "Keep the pool in the NE of the open plot, water clean and moving.",
      "Never place a pool or large tank in the SW.",
      "A small fountain in the NE of the living room is auspicious."
    ]
  },
  {
    id: "electrical",
    name: "Generator / Inverter / Electrical",
    icon: "⚡",
    aliases: ["generator", "inverter", "electrical", "meter", "electric panel", "db box", "transformer", "switchboard"],
    best:   "SE",
    second: ["S", "NW"],
    avoid:  ["NE", "SW", "C"],
    why: "Electrical and heat-producing equipment belongs in the Agni (fire) corner, the South-East. South and North-West are acceptable. Keep electrical loads out of the watery NE and the anchoring SW.",
    tips: [
      "Mount the main meter and inverter on the SE wall.",
      "Keep batteries ventilated and off the NE corner.",
      "Heavy machinery and motors suit the South or South-East."
    ]
  },
  {
    id: "water-tank-underground",
    name: "Water Tank (Underground)",
    icon: "💧",
    aliases: ["underground water tank", "water tank underground", "borewell", "well", "sump", "underground tank", "boring"],
    best:   "NE",
    second: ["N", "E"],
    avoid:  ["SW", "SE", "C", "S"],
    why: "Water below ground level in the North-East amplifies the zone's natural water element — a classic prosperity booster. North and East are the next-best. Never sink a tank or well in the SW.",
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
    best:   "SW",
    second: ["W", "S"],
    avoid:  ["NE", "SE", "C", "N"],
    why: "Overhead weight strengthens the heavy South-West zone, with West and South as alternates. An elevated tank in the NE crushes the most sacred, light corner of the home.",
    tips: [
      "Use a dark-coloured tank in the SW (adds weight, absorbs heat).",
      "Keep it slightly off the exact SW corner point.",
      "The overhead tank should not sit over the NE or the centre."
    ]
  },
  {
    id: "septic-tank",
    name: "Septic Tank",
    icon: "🕳️",
    aliases: ["septic tank", "soak pit", "sewage tank", "drainage pit"],
    best:   "NW",
    second: ["W", "S"],
    avoid:  ["NE", "SW", "SE", "C", "E"],
    why: "Waste must exit through the North-West movement zone, with West and South as the only acceptable alternates. A septic tank in the NE poisons the home's most positive energy source.",
    tips: [
      "Keep it away from the main entrance and the kitchen.",
      "The tank should not touch the compound wall on the N or E side.",
      "Never place it in the NE or below the pooja room."
    ]
  },
  {
    id: "brahmasthan",
    name: "Brahmasthan (Centre)",
    icon: "🕉️",
    aliases: ["brahmasthan", "centre", "center", "courtyard", "central courtyard", "aangan"],
    best:   "C",
    second: [],
    avoid:  ["NW", "N", "NE", "W", "E", "SW", "S", "SE"],
    why: "The centre of the home is the lungs of the Vastu Purusha. It must remain open, light and empty — a courtyard, skylight or open hall is ideal. It has no second-best: nothing heavy belongs here.",
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
    roomId: "toilet", zones: ["NE"],
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
    roomId: "kitchen", zones: ["NE", "N"],
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
    roomId: "kitchen", zones: ["SW"],
    severity: "medium",
    why: "Fire destabilises the Earth corner that should anchor the family.",
    remedies: [
      "Place the hob in the SE corner of the room.",
      "Add earthy tones and heavy storage to restore the zone's weight."
    ]
  },
  {
    defect: "Master bedroom in the South-East",
    roomId: "master-bedroom", zones: ["SE"],
    severity: "medium",
    why: "Sleeping in the fire zone causes short tempers, arguments and restless sleep.",
    remedies: [
      "Move the couple to the SW room and give the SE room another use.",
      "If not possible: bed in the SW corner of the room, head towards South; avoid red décor; no mirrors facing the bed."
    ]
  },
  {
    defect: "Main entrance in the South-West",
    roomId: "main-entrance", zones: ["SW"],
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
    roomId: "staircase", zones: ["C"],
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
    roomId: "staircase", zones: ["NE"],
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
    roomId: "water-tank-underground", zones: ["SW"],
    severity: "high",
    why: "A void below the anchor zone destabilises the entire dwelling.",
    remedies: [
      "Decommission if feasible and dig a new sump in the NE.",
      "Otherwise keep it sealed, covered with a heavy slab, and add weight above it."
    ]
  },
  {
    defect: "Septic tank in the North-East",
    roomId: "septic-tank", zones: ["NE"],
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
    roomId: "store-room", zones: ["C"],
    severity: "medium",
    why: "The centre must breathe; blocking it congests the whole house's energy.",
    remedies: [
      "Clear the central ninth of the floor plan of furniture and clutter.",
      "If a structural column exists, keep its surroundings open and light-coloured."
    ]
  },
  {
    defect: "Children sleeping in the South-West room",
    roomId: "kids-room", zones: ["SW"],
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

/* ============================================================
   Gemini (Google generalist) vision config for the floor-plan
   analyzer. The browser calls Gemini directly with a user-
   supplied API key (stored only in localStorage). No backend.
   ============================================================ */
const GEMINI = {
  model: "gemini-2.5-flash",            // default; editable in the UI
  /* predefined models offered in the dropdown. Flash-Lite has the highest
     free-tier limits, Pro the lowest — handy when a key hits 429. */
  models: [
    { id: "gemini-2.5-flash",      label: "Gemini 2.5 Flash — balanced (default)" },
    { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite — fastest, highest free limit" },
    { id: "gemini-2.5-pro",        label: "Gemini 2.5 Pro — most accurate, lowest free limit" },
    { id: "gemini-2.0-flash",      label: "Gemini 2.0 Flash — previous generation" },
    { id: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash-Lite — previous gen, high limit" }
  ],
  endpoint: (model, key) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
  listEndpoint: (key) =>
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
  keyUrl: "https://aistudio.google.com/app/apikey",
  /* Strict-JSON response schema so we can parse reliably. */
  schema: {
    type: "object",
    properties: {
      detectedNorth: { type: "string", description: "Where North points on the image: up, up-right, right, down-right, down, down-left, left, or up-left (diagonals allowed)" },
      rooms: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name:       { type: "string", description: "Room name as labelled or inferred (e.g. Kitchen, Master Bedroom, Toilet, Pooja)" },
            zone:       { type: "string", description: "One of NW, N, NE, W, C, E, SW, S, SE" },
            confidence: { type: "number", description: "0 to 1" },
            note:       { type: "string", description: "Short observation, optional" }
          },
          required: ["name", "zone"]
        }
      },
      notes: { type: "string", description: "Any overall observation about the plan or its orientation" }
    },
    required: ["rooms"]
  },
  prompt: (north) => {
    const where = {
      "up": "the top of the image", "up-right": "the top-right corner",
      "right": "the right edge", "down-right": "the bottom-right corner",
      "down": "the bottom of the image", "down-left": "the bottom-left corner",
      "left": "the left edge", "up-left": "the top-left corner"
    }[north] || "the top of the image";
    return `You are an expert Vastu Shastra consultant and architect reading a residential floor plan.

This image has already been CROPPED to just the building footprint / plot — treat the FULL extent
of this image as the building outline. Fit the 9-zone Vastu grid to the edges of THIS image (the
plan fills it); there is no surrounding sheet, title block or margin to ignore.

On this drawing, geographic NORTH is towards ${where}. This may be a DIAGONAL direction — respect it exactly; do not assume North is up.

Using that true North, overlay the 3x3 (9-zone) Vastu grid across the whole image:
N (Uttar), NE (Ishan), E (Purva), SE (Agneya), S (Dakshin), SW (Nairutya), W (Paschim), NW (Vayavya), around the centre C (Brahmasthan).

Tasks:
1. Report the North arrow you actually see on the drawing as "detectedNorth"
   (one of: up, up-right, right, down-right, down, down-left, left, up-left).
   IMPORTANT: compute every room's zone using the user-stated North above, even if the
   drawing's own arrow seems to differ — do not silently recompute against a different North.
2. OCR every room label, and infer unlabelled rooms from fixtures
   (stove = kitchen, bed = bedroom, WC/commode = toilet, sink+shower = bathroom,
   idol/temple = pooja, stairs, parking, etc.).
3. For EACH room, decide which of the 9 compass zones (NW, N, NE, W, C, E, SW, S, SE) its centre
   falls in, measured from the building's centre using the true North above.
4. Prefer these canonical names where they fit: Master Bedroom, Bedroom, Kids Room, Guest Bedroom,
   Mandir / Pooja Room, Kitchen, Toilet, Washroom / Bathroom, Living Room, Dining Room, Study Room,
   Home Office, Staircase, Store Room, Main Entrance, Garage, Balcony, Brahmasthan (Centre).

Return ONLY JSON matching the provided schema. Do not include any prose outside the JSON.`;
  }
};
