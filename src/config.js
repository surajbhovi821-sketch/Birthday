/* ============================================================
   DEFAULT CONTENT — fully editable from the Admin Panel (⚙)
   Relationship is intentionally NOT assumed: leave blank and
   pick one in Admin → Suraj.
   ============================================================ */
window.DEFAULT_CONFIG = {
  birthday: {
    name: "Seema",
    dob: "2 February 2006",
    birthdayDate: "2 February",
    birthdayYear: "2027",
    fullBirthday: "2 February 2027",
    age: 21
  },
  suraj: {
    name: "Suraj",
    photo: "suraj",                 // key into IMAGES, or a data:/http: URL
    relationship: "",               // ← editable, never assumed (Best Friend / Friend / Brother / Sister / Cousin / Partner / Special Person / Other)
    intro: "Someone who wanted to make your birthday a little more special."
  },
  story: {
    metHow: "It all started with a simple hello — and somehow that hello turned into endless conversations, laughter and memories that I wouldn't trade for anything.",
    metWhen: "A few years ago — though it honestly feels like it was only yesterday.",
    firstMemory: "The first time we really talked, I remember thinking: this is someone special.",
    favoriteMoment: "Every moment we've spent laughing about absolutely nothing.",
    funnyMemory: "That time we couldn't stop laughing at something only the two of us found funny.",
    specialMoment: "Every small moment that somehow became a big one.",
    together: "Late-night talks, silly jokes, shared dreams, and a bond that kept growing.",
    meaning: "Seema means far more than words can capture — she's the person I can talk to about anything, and the one who always believes in me."
  },
  words: [
    "Seema, I don't know if words can completely explain how special you are to me.",
    "We've shared so many moments, conversations, laughs, and memories.",
    "On your birthday, I simply want to wish you happiness, success, peace, and everything you deserve.",
    "Keep smiling and keep being the person you are.",
    "Happy Birthday, Seema. ❤️",
    "— Suraj"
  ],
  letter: [
    "Dear Seema,",
    "I wanted to give you something that feels like you — warm, bright, and unforgettable.",
    "I remember the day we started talking like it was yesterday. What began as an ordinary day slowly became one of the most important parts of my life, because you walked into it.",
    "Thank you for the laughter, for the late-night conversations, for being someone I can always count on. You make ordinary moments feel special just by being in them.",
    "As you turn twenty-one, I hope this year brings you everything you've been dreaming of — happiness, success, peace, and a thousand moments worth remembering.",
    "Whatever happens, remember this: I'll always be here, cheering for you.",
    "Happy Birthday, Seema. This is your year.",
    "With love and best wishes,",
    "Suraj ❤️"
  ],
  finalQuote: "Some people become part of our memories, while some become part of our story.",
  closing: "Here's to another beautiful year and many more memories to come.",
  photos: {
    suraj: ["suraj"],
    seema: ["seema"],
    together: ["together", "together2"],
    memory: ["memory1", "memory2", "memory3"]
  },
  notes: {
    suraj:       { caption: "Suraj — the one behind this surprise", date: "", memory: "" },
    seema:       { caption: "Seema — the birthday girl ✨", date: "2 February 2006", memory: "Every year, one day belongs to you." },
    together:    { caption: "Us — through it all", date: "", memory: "Some moments became memories without us even realizing it." },
    together2:   { caption: "Some evenings just stay with you", date: "", memory: "Under the stars, with nowhere else to be." },
    memory1:     { caption: "Two cups, endless conversations", date: "", memory: "The best conversations happen over chai." },
    memory2:     { caption: "Lights, laughter and us", date: "", memory: "A night full of lights and even more laughter." },
    memory3:     { caption: "A little celebration", date: "", memory: "Some celebrations need no reason." }
  },
  memories: [
    { id: "m1", date: "The beginning", title: "The First Memory", desc: "Everything started with a simple conversation that neither of us expected to matter — but it did.", location: "", photo: "memory1", video: "" },
    { id: "m2", date: "That unforgettable day", title: "That Unforgettable Day", desc: "One of those days that stays with you long after it ends — golden light, endless laughs, no plans, perfect anyway.", location: "", photo: "together", video: "" },
    { id: "m3", date: "Under the stars", title: "A Quiet Night", desc: "No noise, no crowd — just good company, a sky full of stars, and conversations that went on forever.", location: "", photo: "together2", video: "" }
  ],
  private: [
    { id: "p1", title: "That day...", caption: "Only we know what happened here 😂", photo: "memory1" },
    { id: "p2", title: "One of my favorite memories", caption: "I still smile thinking about this.", photo: "memory2" },
    { id: "p3", title: "I still remember this moment", caption: "A memory worth keeping forever.", photo: "together2" },
    { id: "p4", title: "A memory worth keeping forever", caption: "Some moments are too precious to ever forget.", photo: "memory3" }
  ],
  video: { url: "", title: "A little something for you", thumb: "", note: "Suraj's message will appear here" },
  music: { title: "A melody for you", file: "", useMusicBox: true },
  gift: {
    type: "photo",               // "photo" | "message" | "video"
    photo: "together2",
    message: "This is one of my favorite photos of us. Happy Birthday, Seema! 🎂❤️",
    videoUrl: ""
  }
};
