/** Personal window arrangements only. No CSS, positions or permissions are accepted from storage. */
export const PANEL_IDS = ["feed", "chat", "music", "board"] as const;
export type PanelId = (typeof PANEL_IDS)[number];
export type PanelSize = { width: number; height: number };
export type DesktopLayout = {
  version: 1;
  order: PanelId[];
  sizes: Record<PanelId, PanelSize>;
  minimized: PanelId[];
};
export type Placement = PanelSize & { id: PanelId; x: number; y: number };
export const DESKTOP_COLUMNS = 12;
export const DESKTOP_ROW = 72;
export const DESKTOP_GAP = 16;
export const PERSONAL_DESKTOP_KEY = "stan-army:desktop:personal:v1:army-nova";
export const OWNER_DESKTOP_KEY = "stan-army:desktop:owner:v1:army-nova";
export const DEFAULT_DESKTOP: DesktopLayout = {
  version: 1,
  order: [...PANEL_IDS],
  sizes: {
    feed: { width: 8, height: 7 },
    chat: { width: 4, height: 4 },
    music: { width: 4, height: 3 },
    board: { width: 12, height: 3 },
  },
  minimized: [],
};
const isPanel = (value: unknown): value is PanelId => PANEL_IDS.includes(value as PanelId);
const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" ? value as Record<string, unknown> : {};
const bounded = (value: unknown, min: number, max: number, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;

export function validateDesktop(value: unknown, fallback = DEFAULT_DESKTOP): DesktopLayout {
  const raw = record(value);
  if (raw.version !== 1) return structuredClone(fallback);
  const order = Array.isArray(raw.order) ? [...new Set(raw.order.filter(isPanel))] : [];
  for (const id of fallback.order) if (!order.includes(id)) order.push(id);
  const sizes = {} as Record<PanelId, PanelSize>;
  for (const id of PANEL_IDS) {
    const size = record(record(raw.sizes)[id]);
    sizes[id] = {
      width: bounded(size.width, 4, DESKTOP_COLUMNS, fallback.sizes[id].width),
      height: bounded(size.height, 2, 8, fallback.sizes[id].height),
    };
  }
  return {
    version: 1, order, sizes,
    minimized: Array.isArray(raw.minimized) ? [...new Set(raw.minimized.filter(isPanel))] : [],
  };
}
export function parseDesktop(raw: string | null, fallback = DEFAULT_DESKTOP): DesktopLayout {
  if (!raw || raw.length > 8000) return structuredClone(fallback);
  try { return validateDesktop(JSON.parse(raw), fallback); }
  catch { return structuredClone(fallback); }
}
export function overlaps(a: Placement, b: Placement) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
/** First-fit packing snaps to cells and reflows neighbours; rectangles never overlap. */
export function packDesktop(layout: DesktopLayout): Placement[] {
  const placed: Placement[] = [];
  for (const id of layout.order) {
    if (layout.minimized.includes(id)) continue;
    const size = layout.sizes[id];
    let found = false;
    for (let y = 0; y < 32 && !found; y++) {
      for (let x = 0; x <= DESKTOP_COLUMNS - size.width; x++) {
        const candidate = { id, x, y, ...size };
        if (placed.every((item) => !overlaps(candidate, item))) {
          placed.push(candidate); found = true; break;
        }
      }
    }
  }
  return placed;
}
export function movePanel(layout: DesktopLayout, id: PanelId, index: number): DesktopLayout {
  const order = layout.order.filter((item) => item !== id);
  order.splice(Math.max(0, Math.min(order.length, index)), 0, id);
  return { ...layout, order };
}
export function resizePanel(layout: DesktopLayout, id: PanelId, size: PanelSize): DesktopLayout {
  return validateDesktop({ ...layout, sizes: { ...layout.sizes, [id]: size } }, layout);
}
export function chatFirstDesktop(): DesktopLayout {
  return validateDesktop({ ...DEFAULT_DESKTOP,
    order: ["chat", "board", "feed", "music"],
    sizes: { chat: { width: 8, height: 5 }, board: { width: 4, height: 5 }, feed: { width: 8, height: 6 }, music: { width: 4, height: 3 } },
  });
}
export type DesktopLook = "electric" | "afterhours" | "chrome";
export type Participation = "mint" | "pink" | "yellow";
export type OwnerDesktop = { version: 1; look: DesktopLook; participation: Participation; layout: DesktopLayout };
export function parseOwnerDesktop(raw: string | null): OwnerDesktop {
  const fallback: OwnerDesktop = { version: 1, look: "electric", participation: "mint", layout: structuredClone(DEFAULT_DESKTOP) };
  if (!raw || raw.length > 10000) return fallback;
  try {
    const value = record(JSON.parse(raw));
    if (value.version !== 1) return fallback;
    return {
      version: 1,
      look: ["electric", "afterhours", "chrome"].includes(String(value.look)) ? value.look as DesktopLook : fallback.look,
      participation: ["mint", "pink", "yellow"].includes(String(value.participation)) ? value.participation as Participation : fallback.participation,
      layout: validateDesktop(value.layout),
    };
  } catch { return fallback; }
}
