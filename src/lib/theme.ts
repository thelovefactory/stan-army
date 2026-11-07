/** Presentation only. No artist content, credentials, executable CSS or remote assets. */
export const THEME_VERSION = 1;
export const MAX_ASSET_BYTES = 512 * 1024;
export const MAX_TOTAL_ASSET_BYTES = 1024 * 1024;
export const fonts = {
  original: "Arial, Helvetica, sans-serif",
  "comic-chaos": '"Comic Sans MS", "Comic Sans", cursive',
  "terminal-kid": '"Courier New", Courier, monospace',
  "drama-club": 'Georgia, "Times New Roman", serif',
  "scene-headline": 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
  typewriter: '"Lucida Console", Monaco, monospace',
} as const;
export const fontLabels: Record<keyof typeof fonts, string> = {
  original: "Stan Army original",
  "comic-chaos": "Comic chaos",
  "terminal-kid": "Terminal kid",
  "drama-club": "Drama club",
  "scene-headline": "Scene headline",
  typewriter: "Typewriter diary",
};
export type PresetId =
  | "blank-canvas"
  | "glitter-bomb"
  | "scene-queen"
  | "burning-desire"
  | "digital-dream"
  | "cyber-trash";
export type ThemeAsset = {
  dataUrl: string;
  mime: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  bytes: number;
  width: number;
  height: number;
  animated: boolean;
};
export const playerSkins = {
  desktop: "Classic desktop",
  y2k: "Bubblegum Y2K",
  minimal: "Quiet hours",
  toxic: "Toxic chrome",
} as const;
export type PlayerSkin = keyof typeof playerSkins;
export const moduleLabels = {
  feed: "Fan posts",
  playlist: "Music / Spotify playlist",
  videos: "Videos",
  gallery: "Gallery",
  chat: "Army chat",
  outside: "Outside the Army",
  announcements: "Announcements",
  events: "Events & links",
  discussions: "Discussion board",
} as const;
export type ArmyModuleName = keyof typeof moduleLabels;
export const defaultModules: Record<ArmyModuleName, boolean> = {
  feed: true,
  playlist: true,
  videos: true,
  gallery: true,
  chat: true,
  outside: true,
  announcements: true,
  events: true,
  discussions: true,
};
export type Theme = {
  schemaVersion: 1;
  playerSkin: PlayerSkin;
  participationColor: string;
  outsideArmy: { accent: string | null; treatment: "panel" | "outline" };
  modules: Record<ArmyModuleName, boolean>;
  preset: PresetId;
  background: {
    color: string;
    image: ThemeAsset | null;
    size: "cover" | "contain" | "tile" | "natural";
    position: "center" | "top" | "bottom" | "left" | "right";
    attachment: "scroll" | "fixed";
  };
  colors: {
    text: string;
    links: string;
    buttons: string;
    borders: string;
    accent: string;
  };
  font: keyof typeof fonts;
  panels: {
    color: string;
    opacity: number;
    border: "solid" | "dashed" | "dotted" | "double";
    corners: "original" | "square" | "round" | "wonky";
  };
  decorations: {
    style: "none" | "hearts" | "stars" | "flames" | "butterflies" | "pixels";
    glitter: boolean;
    animated: boolean;
  };
  images: { banner: ThemeAsset | null; avatar: ThemeAsset | null };
};
export const defaultTheme: Theme = {
  schemaVersion: 1,
  playerSkin: "desktop",
  participationColor: "#161619",
  outsideArmy: { accent: null, treatment: "panel" },
  modules: { ...defaultModules },
  preset: "blank-canvas",
  background: {
    color: "#0b0b0d",
    image: null,
    size: "cover",
    position: "center",
    attachment: "scroll",
  },
  colors: {
    text: "#f7f7f4",
    links: "#a0f4cc",
    buttons: "#305bff",
    borders: "#303035",
    accent: "#a0f4cc",
  },
  font: "original",
  panels: {
    color: "#161619",
    opacity: 100,
    border: "solid",
    corners: "original",
  },
  decorations: { style: "none", glitter: false, animated: true },
  images: { banner: null, avatar: null },
};
export const presets: {
  id: PresetId;
  name: string;
  line: string;
  color: string;
  symbol: string;
  theme: Theme;
}[] = [
  {
    id: "blank-canvas",
    name: "Blank Canvas",
    line: "The stage, as we made it.",
    color: "#a0f4cc",
    symbol: "✳",
    theme: defaultTheme,
  },
  {
    id: "glitter-bomb",
    name: "Glitter Bomb",
    line: "Sorry about the sparkles. (Not sorry.)",
    color: "#ff82ce",
    symbol: "♥",
    theme: {
      ...defaultTheme,
      preset: "glitter-bomb",
      participationColor: "#300d29",
      playerSkin: "y2k",
      background: { ...defaultTheme.background, color: "#2c092a" },
      colors: {
        text: "#fff1fa",
        links: "#ffa7df",
        buttons: "#c02b86",
        borders: "#ee88ca",
        accent: "#ff97d6",
      },
      font: "comic-chaos",
      panels: {
        color: "#300d29",
        opacity: 94,
        border: "dotted",
        corners: "round",
      },
      decorations: { style: "hearts", glitter: true, animated: true },
    },
  },
  {
    id: "scene-queen",
    name: "Scene Queen",
    line: "Your top eight could never.",
    color: "#ecff51",
    symbol: "★",
    theme: {
      ...defaultTheme,
      preset: "scene-queen",
      participationColor: "#1e0925",
      background: { ...defaultTheme.background, color: "#130b21" },
      colors: {
        text: "#fff8ff",
        links: "#efff66",
        buttons: "#db247d",
        borders: "#e66fff",
        accent: "#efff66",
      },
      font: "scene-headline",
      panels: {
        color: "#1e0925",
        opacity: 97,
        border: "double",
        corners: "square",
      },
      decorations: { style: "stars", glitter: false, animated: true },
    },
  },
  {
    id: "burning-desire",
    name: "Burning Desire",
    line: "Set your away message on fire.",
    color: "#ff663b",
    symbol: "♨",
    theme: {
      ...defaultTheme,
      preset: "burning-desire",
      participationColor: "#220c0c",
      background: { ...defaultTheme.background, color: "#170707" },
      colors: {
        text: "#fff2e9",
        links: "#ffb18d",
        buttons: "#b82c21",
        borders: "#a8a3a3",
        accent: "#ff774d",
      },
      font: "drama-club",
      panels: {
        color: "#220c0c",
        opacity: 96,
        border: "double",
        corners: "wonky",
      },
      decorations: { style: "flames", glitter: false, animated: true },
    },
  },
  {
    id: "digital-dream",
    name: "Digital Dream",
    line: "Logged in from a cloud.",
    color: "#bdc0ff",
    symbol: "ʚɞ",
    theme: {
      ...defaultTheme,
      preset: "digital-dream",
      participationColor: "#25213f",
      playerSkin: "minimal",
      background: { ...defaultTheme.background, color: "#201c3c" },
      colors: {
        text: "#f9f4ff",
        links: "#d8c4ff",
        buttons: "#6950bb",
        borders: "#a9a4db",
        accent: "#c4e8ff",
      },
      font: "drama-club",
      panels: {
        color: "#25213f",
        opacity: 92,
        border: "dashed",
        corners: "round",
      },
      decorations: { style: "butterflies", glitter: true, animated: true },
    },
  },
  {
    id: "cyber-trash",
    name: "Cyber Trash",
    line: "404: good taste not found.",
    color: "#c0ff36",
    symbol: "▚",
    theme: {
      ...defaultTheme,
      preset: "cyber-trash",
      participationColor: "#151e0f",
      playerSkin: "toxic",
      background: { ...defaultTheme.background, color: "#11170c" },
      colors: {
        text: "#ebffda",
        links: "#c0ff36",
        buttons: "#486516",
        borders: "#a1bc52",
        accent: "#c0ff36",
      },
      font: "terminal-kid",
      panels: {
        color: "#151e0f",
        opacity: 97,
        border: "dashed",
        corners: "square",
      },
      decorations: { style: "pixels", glitter: false, animated: true },
    },
  },
];
function record(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}
function choice<T extends string>(
  v: unknown,
  options: readonly T[],
  fallback: T,
): T {
  return typeof v === "string" && options.includes(v as T)
    ? (v as T)
    : fallback;
}
export function safeColor(v: unknown, fallback: string): string {
  return typeof v === "string" && /^#[a-f0-9]{6}$/i.test(v)
    ? v.toLowerCase()
    : fallback;
}
function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}
/** Only inline, signature-matched raster images can enter the CSS/image pipeline. */
export function validAsset(value: unknown): ThemeAsset | null {
  const a = record(value);
  const signatures: Record<string, string[]> = {
    "image/jpeg": ["/9j/"],
    "image/png": ["iVBORw0KGgo"],
    "image/gif": ["R0lGODdh", "R0lGODlh"],
    "image/webp": ["UklGR"],
  };
  if (
    typeof a.mime !== "string" ||
    !Object.hasOwn(signatures, a.mime) ||
    typeof a.dataUrl !== "string"
  )
    return null;
  const prefix = `data:${a.mime};base64,`;
  if (!a.dataUrl.startsWith(prefix)) return null;
  const body = a.dataUrl.slice(prefix.length);
  if (
    !/^[A-Za-z0-9+/]+={0,2}$/.test(body) ||
    body.length % 4 !== 0 ||
    !signatures[a.mime].some((s) => body.startsWith(s))
  )
    return null;
  const actualBytes =
    (body.length * 3) / 4 -
    (body.endsWith("==") ? 2 : body.endsWith("=") ? 1 : 0);
  if (
    typeof a.bytes !== "number" ||
    a.bytes !== actualBytes ||
    a.bytes < 1 ||
    a.bytes > MAX_ASSET_BYTES
  )
    return null;
  if (
    typeof a.width !== "number" ||
    typeof a.height !== "number" ||
    !Number.isInteger(a.width) ||
    !Number.isInteger(a.height) ||
    a.width < 1 ||
    a.height < 1 ||
    a.width > 4096 ||
    a.height > 4096
  )
    return null;
  // Inspect bytes again on restore rather than trusting stored animation metadata.
  let decoded: string;
  try {
    decoded = atob(body);
  } catch {
    return null;
  }
  if (
    a.mime === "image/webp" &&
    (decoded.slice(0, 4) !== "RIFF" || decoded.slice(8, 12) !== "WEBP")
  )
    return null;
  const animated =
    a.mime === "image/gif" ||
    (a.mime === "image/png" && decoded.includes("acTL")) ||
    (a.mime === "image/webp" && decoded.includes("ANIM"));
  return {
    dataUrl: a.dataUrl,
    mime: a.mime as ThemeAsset["mime"],
    bytes: a.bytes,
    width: a.width,
    height: a.height,
    animated,
  };
}
export function validateTheme(value: unknown): Theme {
  const t = record(value);
  const d = defaultTheme;
  if (t.schemaVersion !== THEME_VERSION) return structuredClone(d);
  const bg = record(t.background),
    c = record(t.colors),
    p = record(t.panels),
    dec = record(t.decorations),
    im = record(t.images);
  let background = validAsset(bg.image),
    banner = validAsset(im.banner),
    avatar = validAsset(im.avatar);
  if (
    [background, banner, avatar].reduce((sum, a) => sum + (a?.bytes || 0), 0) >
    MAX_TOTAL_ASSET_BYTES
  ) {
    background = null;
    banner = null;
    avatar = null;
  }
  return {
    schemaVersion: 1,
    outsideArmy: {
      accent:
        record(t.outsideArmy).accent == null
          ? null
          : safeColor(record(t.outsideArmy).accent, d.colors.accent),
      treatment: choice(
        record(t.outsideArmy).treatment,
        ["panel", "outline"],
        "panel",
      ),
    },
    participationColor: safeColor(
      t.participationColor,
      safeColor(p.color, d.panels.color),
    ),
    modules: Object.fromEntries(
      Object.entries(defaultModules).map(([name, enabled]) => [
        name,
        typeof record(t.modules)[name] === "boolean"
          ? record(t.modules)[name]
          : enabled,
      ]),
    ) as Record<ArmyModuleName, boolean>,
    playerSkin: choice(
      t.playerSkin,
      Object.keys(playerSkins) as PlayerSkin[],
      d.playerSkin,
    ),
    preset: choice(
      t.preset,
      presets.map((p) => p.id),
      d.preset,
    ),
    background: {
      color: safeColor(bg.color, d.background.color),
      image: background,
      size: choice(
        bg.size,
        ["cover", "contain", "tile", "natural"],
        d.background.size,
      ),
      position: choice(
        bg.position,
        ["center", "top", "bottom", "left", "right"],
        d.background.position,
      ),
      attachment: choice(
        bg.attachment,
        ["scroll", "fixed"],
        d.background.attachment,
      ),
    },
    colors: {
      text: safeColor(c.text, d.colors.text),
      links: safeColor(c.links, d.colors.links),
      buttons: safeColor(c.buttons, d.colors.buttons),
      borders: safeColor(c.borders, d.colors.borders),
      accent: safeColor(c.accent, d.colors.accent),
    },
    font: choice(t.font, Object.keys(fonts) as (keyof typeof fonts)[], d.font),
    panels: {
      color: safeColor(p.color, d.panels.color),
      opacity:
        typeof p.opacity === "number" && Number.isFinite(p.opacity)
          ? Math.max(0, Math.min(100, p.opacity))
          : 100,
      border: choice(
        p.border,
        ["solid", "dashed", "dotted", "double"],
        d.panels.border,
      ),
      corners: choice(
        p.corners,
        ["original", "square", "round", "wonky"],
        d.panels.corners,
      ),
    },
    decorations: {
      style: choice(
        dec.style,
        ["none", "hearts", "stars", "flames", "butterflies", "pixels"],
        d.decorations.style,
      ),
      glitter: bool(dec.glitter, false),
      animated: bool(dec.animated, true),
    },
    images: { banner, avatar },
  };
}
export function parseTheme(raw: string | null): Theme {
  try {
    return validateTheme(raw ? JSON.parse(raw) : null);
  } catch {
    return structuredClone(defaultTheme);
  }
}
export function storageKey(profileId: string): string {
  return `stan-army:theme:v1:${profileId}`;
}
function rgb(hex: string): number[] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}
function luminance(hex: string): number {
  return rgb(hex)
    .map((v) => {
      const n = v / 255;
      return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    })
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
}
export function contrast(a: string, b: string): number {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function readableColor(preferred: string, background: string): string {
  if (contrast(preferred, background) >= 4.5) return preferred;
  return contrast("#111111", background) > contrast("#ffffff", background)
    ? "#111111"
    : "#ffffff";
}
export function saveProfileTheme(
  storage: Pick<Storage, "setItem">,
  profileId: string,
  theme: Theme,
): Theme {
  const validated = validateTheme(theme);
  storage.setItem(storageKey(profileId), JSON.stringify(validated));
  return validated;
}
export function loadProfileTheme(
  storage: Pick<Storage, "getItem">,
  profileId: string,
): Theme {
  try {
    return parseTheme(storage.getItem(storageKey(profileId)));
  } catch {
    return structuredClone(defaultTheme);
  }
}

/** Read-through compatibility: never writes or removes a legacy key while rendering. */
export function profileThemeSnapshot(
  storage: Pick<Storage, "getItem">,
  profileId: string,
  legacyProfileId?: string,
): string | null {
  try {
    const current = storage.getItem(storageKey(profileId));
    return current !== null
      ? current
      : legacyProfileId
        ? storage.getItem(storageKey(legacyProfileId))
        : null;
  } catch {
    return null;
  }
}
