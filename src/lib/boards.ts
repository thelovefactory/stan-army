import { armies, armyView } from "./data";
export type Thread = {
  id: string;
  author: string;
  title: string;
  body: string;
  tag: string;
  score: number;
  replies: { author: string; text: string }[];
  local?: boolean;
};
const novaThreads: Thread[] = [
  {
    id: "bridge",
    author: "jess.wav",
    title: "Which Nova bridge would you defend with your life?",
    body: "The last eight bars. Headphones on. That’s my entire argument. What’s yours?",
    tag: "Discussion",
    score: 18,
    replies: [
      {
        author: "lucid.lou",
        text: "The one you immediately rewind before the song even finishes. You know the one.",
      },
    ],
  },
  {
    id: "first-listen",
    author: "milo.mp3",
    title: "First listen vs. 100th listen: what changed for you?",
    body: "I came for the chorus and stayed for the tiny things in the background. Tell me what I’m missing.",
    tag: "Question",
    score: 12,
    replies: [],
  },
  {
    id: "fan-project",
    author: "lex.exe",
    title: "A little fan-made zine. Who wants a page?",
    body: "Lyrics in the margins, blurry photos, concert memories. If you’ve got one thing you want to make, that’s enough.",
    tag: "Fan project",
    score: 9,
    replies: [],
  },
];

export type Board = {
  id: string;
  kind: "s" | "com";
  slug: string;
  title: string;
  description: string;
  armySlug?: string;
};
export const boards: Board[] = [
  ...armies.map((a) => ({
    id: `s/${a.slug}`,
    kind: "s" as const,
    slug: a.slug,
    title: armyView(a).artist.name,
    description: `Artist discussions for ${armyView(a).artist.name}’s Army.`,
    armySlug: a.slug,
  })),
  {
    id: "com/popmusic",
    kind: "com",
    slug: "popmusic",
    title: "Pop music",
    description: "Hooks, new discoveries and songs you keep coming back to.",
  },
  {
    id: "com/disco",
    kind: "com",
    slug: "disco",
    title: "Disco",
    description: "Dance floors, deep cuts and basslines that never get old.",
  },
  {
    id: "com/2000s",
    kind: "com",
    slug: "2000s",
    title: "The 2000s",
    description: "A decade of music, memories and questionable ringtones.",
  },
  {
    id: "com/musicvideos",
    kind: "com",
    slug: "musicvideos",
    title: "Music videos",
    description:
      "The visuals, choreography and tiny details worth talking about.",
  },
];
export function boardById(id: string) {
  return boards.find((b) => b.id === id);
}
export function boardPath(board: Board) {
  return `/${board.id}`;
}
export function initialBoardThreads(board: Board): Thread[] {
  if (board.id === "s/nova") return novaThreads;
  const topics: Record<string, [string, string]> = {
    "com/popmusic": [
      "What makes a perfect pop chorus?",
      "A hook, a key change, a perfectly timed pause? Make your case.",
    ],
    "com/disco": [
      "One disco track to bring an empty dance floor to life?",
      "Give us a recommendation and tell us what makes it move.",
    ],
    "com/2000s": [
      "Which 2000s song sends you straight back?",
      "The bus ride, the bedroom stereo, the ringtone. What do you remember?",
    ],
    "com/musicvideos": [
      "Which music video deserves a frame-by-frame watch?",
      "We’re here for the choreography, the colour and the detail you only noticed on the tenth watch.",
    ],
  };
  const [title, body] = topics[board.id] || [
    `What brought you to ${board.title}?`,
    "A first listen, a lyric, a memory. Start the conversation.",
  ];
  return [
    {
      id: "welcome",
      author: "cassette.kid",
      title,
      body,
      tag: "Discussion",
      score: 5,
      replies: [],
    },
  ];
}
export function parseMyBoards(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (id): id is string => typeof id === "string" && !!boardById(id),
            ),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}
