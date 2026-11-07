import type { ThemeAsset } from "./theme";
export type NoteStyle = "note" | "scrapbook" | "afterhours" | "photo";
export type FanReply = { id: string; handle: string; text: string };
export type FanNote = {
  id: string;
  handle: string;
  name: string;
  initials: string;
  style: NoteStyle;
  label: string;
  text: string;
  image?: string;
  attachment?: ThemeAsset;
  poll?: FanPoll;
  likes: number;
  replies: FanReply[];
  local?: boolean;
};
export const noteStyles: NoteStyle[] = [
  "note",
  "scrapbook",
  "afterhours",
  "photo",
];
export function validateMark(text: string): string | null {
  return text.trim().length < 2
    ? "Give your mark at least 2 characters."
    : text.length > 500
      ? "Keep your note to 500 characters."
      : null;
}
export function safeNoteStyle(value: string): NoteStyle {
  return noteStyles.includes(value as NoteStyle)
    ? (value as NoteStyle)
    : "note";
}
export const fanNotes: FanNote[] = [
  {
    id: "jess-first-note",
    handle: "jess.wav",
    name: "Jess",
    initials: "JW",
    style: "scrapbook",
    label: "THE NOTE THAT STARTED IT",
    text: "I made this little corner because none of my friends understood why I kept rewinding the same bridge. If you get it too… hi. You can sit with me. ♡",
    likes: 24,
    replies: [
      {
        id: "r1",
        handle: "lucid.lou",
        text: "“you can sit with me” and just like that I’m staying.",
      },
      {
        id: "r2",
        handle: "milo.mp3",
        text: "the bridge rewind support group has entered the chat",
      },
    ],
  },
  {
    id: "lou-memory",
    handle: "lucid.lou",
    name: "Lou",
    initials: "LL",
    style: "photo",
    label: "A MEMORY I KEEP COMING BACK TO",
    text: "My phone was on 3%. The photo is mostly lights. The people next to me were strangers until the chorus. Anyway. That feeling.",
    image: "/images/room.jpg",
    likes: 17,
    replies: [
      {
        id: "r3",
        handle: "jess.wav",
        text: "the blurry ones always mean the most 🖤",
      },
    ],
  },
  {
    id: "milo-night",
    handle: "milo.mp3",
    name: "Milo",
    initials: "MM",
    style: "afterhours",
    label: "UNREASONABLY INVESTED",
    text: "headphones on. last bus home. pretending I’m in the closing scene of a film nobody asked me to star in. anyone else?",
    likes: 31,
    replies: [
      {
        id: "r4",
        handle: "soft.static",
        text: "every single journey. the bus driver is supporting cast.",
      },
    ],
  },
  {
    id: "lex-print",
    handle: "lex.makes",
    name: "Lex",
    initials: "LX",
    style: "note",
    label: "MADE SOMETHING FOR US",
    text: "Made a tiny print for the B-side people. No shop. No launch. Just something to stick above your desk and remember you found your people.",
    likes: 12,
    replies: [],
  },
];
export const orbitFans = [
  {
    handle: "jess.wav",
    initials: "JW",
    line: "Made the first little corner.",
    color: "pink",
  },
  {
    handle: "lucid.lou",
    initials: "LL",
    line: "Keeps the blurry photos.",
    color: "mint",
  },
  {
    handle: "milo.mp3",
    initials: "MM",
    line: "Last-bus cinema enthusiast.",
    color: "blue",
  },
  {
    handle: "lex.makes",
    initials: "LX",
    line: "Makes things instead of small talk.",
    color: "orange",
  },
  {
    handle: "soft.static",
    initials: "SS",
    line: "Here for the B-sides.",
    color: "pink",
  },
  {
    handle: "rae.radio",
    initials: "RR",
    line: "Sends songs at inconvenient hours.",
    color: "mint",
  },
  {
    handle: "cassette.kid",
    initials: "CK",
    line: "Still writes tracklists by hand.",
    color: "orange",
  },
  {
    handle: "junebug",
    initials: "JB",
    line: "Always stays for the encore.",
    color: "blue",
  },
];
export type Memory = {
  id: string;
  title: string;
  by: string;
  kind: "Photos" | "Fan art" | "Keepsakes";
  visual: "photo" | "print" | "ticket" | "cassette";
  image?: string;
  attachment?: ThemeAsset;
  poll?: FanPoll;
  caption: string;
};
export const memories: Memory[] = [
  {
    id: "lights",
    title: "The room before the encore",
    by: "lucid.lou",
    kind: "Photos",
    visual: "photo",
    image: "/images/room.jpg",
    caption:
      "Illustrative concert memory using licensed stock photography. Not a Nova performance or an actual upload.",
  },
  {
    id: "bside-print",
    title: "For the B-side people",
    by: "lex.makes",
    kind: "Fan art",
    visual: "print",
    caption:
      "Original typographic demo print made for this prototype. No copied artwork or song lyrics.",
  },
  {
    id: "ticket",
    title: "Kept the ticket. Obviously.",
    by: "cassette.kid",
    kind: "Keepsakes",
    visual: "ticket",
    caption:
      "Original CSS keepsake design. This ticket is fictional and cannot be used to attend an event.",
  },
  {
    id: "crowd",
    title: "We sang the way home",
    by: "junebug",
    kind: "Photos",
    visual: "photo",
    image: "/images/crowd.jpg",
    caption:
      "Licensed stock photograph illustrating a fictional shared memory, not a real fan upload.",
  },
  {
    id: "mixtape",
    title: "A mixtape for the journey",
    by: "rae.radio",
    kind: "Keepsakes",
    visual: "cassette",
    caption:
      "Original CSS cassette graphic. No audio, recorded music or copyrighted cover art is hosted.",
  },
  {
    id: "heart-print",
    title: "You can sit with us",
    by: "soft.static",
    kind: "Fan art",
    visual: "print",
    caption:
      "Original typographic community print, rendered with safe local CSS and text.",
  },
];
export function memoryById(id: string): Memory | undefined {
  return memories.find((m) => m.id === id);
}
export const fanVideoStudies = [
  {
    id: "mark",
    title: "A tiny love note to this corner",
    by: "lex.makes",
    category: "Fan-made tribute study",
    src: "/videos/leave-your-mark.mp4",
    caption:
      "Original six-second silent typography study. Not artist footage or music.",
  },
  {
    id: "bside",
    title: "For the B-side people",
    by: "soft.static",
    category: "Fan edit study",
    src: "/videos/bside-people.mp4",
    caption:
      "Original six-second silent graphic edit. No copyrighted recording or artist likeness.",
  },
];

export type FanPoll = { options: string[] };
export function validatePoll(options: string[]): string | null {
  if (options.length < 2 || options.length > 4) return "Add 2–4 poll choices.";
  if (options.some((o) => !o.trim() || o.length > 80))
    return "Fill in every choice (80 characters maximum).";
  if (
    new Set(options.map((o) => o.trim().toLowerCase())).size !== options.length
  )
    return "Use different choices for your poll.";
  return null;
}
