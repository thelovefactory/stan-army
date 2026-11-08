/** Bounded, versioned layout data only; never CSS, content or permissions. */
export const PANEL_IDS = ["feed", "chat", "music", "board"] as const;
export type PanelId = (typeof PANEL_IDS)[number];
export type PanelSize = { width: number; height: number };
export type GridPosition = { x: number; y: number };
export type DesktopLayout = {
  version: 1;
  order: PanelId[];
  sizes: Record<PanelId, PanelSize>;
  minimized: PanelId[];
  /** Additive to v1: legacy layouts acquire stable slots on first spatial edit. */
  positions?: Record<PanelId, GridPosition>;
};
export type Placement = PanelSize & GridPosition & { id: PanelId };
export const DESKTOP_COLUMNS = 12;
export const DESKTOP_ROW = 72;
export const DESKTOP_GAP = 16;
export const PERSONAL_DESKTOP_KEY = "stan-army:desktop:personal:v1:army-nova";
export const OWNER_DESKTOP_KEY = "stan-army:desktop:owner:v1:army-nova";
export const DEFAULT_DESKTOP: DesktopLayout = {
  version: 1, order: [...PANEL_IDS], minimized: [],
  sizes: { feed: { width: 8, height: 7 }, chat: { width: 4, height: 4 }, music: { width: 4, height: 3 }, board: { width: 12, height: 3 } },
};
const isPanel = (value: unknown): value is PanelId => PANEL_IDS.includes(value as PanelId);
const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" ? value as Record<string, unknown> : {};
const bounded = (value: unknown, min: number, max: number, fallback: number) => typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;
export function overlaps(a: Placement, b: Placement) { return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y; }
function nearestSlot(item: Placement, placed: Placement[]): Placement {
  let best: Placement | null = null, cost = Infinity;
  for (let y = 0; y < 64; y++) for (let x = 0; x <= 12 - item.width; x++) {
    const next = { ...item, x, y };
    if (placed.some((other) => overlaps(next, other))) continue;
    const score = Math.abs(y - item.y) * 12 + Math.abs(x - item.x) + (y < item.y ? .5 : 0);
    if (score < cost) { best = next; cost = score; }
  }
  // Four windows, each at most eight rows, always fit in this search area.
  return best!;
}
function legacySlots(layout: DesktopLayout): Placement[] {
  const placed: Placement[] = [];
  for (const id of layout.order) {
    let next: Placement | undefined;
    for (let y = 0; y < 32 && !next; y++) for (let x = 0; x <= 12 - layout.sizes[id].width; x++) {
      const candidate = { id, ...layout.sizes[id], x, y };
      if (placed.every((other) => !overlaps(candidate, other))) { next = candidate; break; }
    }
    placed.push(next!);
  }
  return placed;
}
function allSlots(layout: DesktopLayout): Placement[] {
  return layout.positions
    ? layout.order.map((id) => ({ id, ...layout.sizes[id], ...layout.positions![id] }))
    : legacySlots(layout);
}
/** Only deliberate minimisation hides a panel. Invalid stored collisions are repaired. */
export function packDesktop(layout: DesktopLayout): Placement[] {
  const placed: Placement[] = [];
  for (const item of allSlots(layout)) {
    if (layout.minimized.includes(item.id)) continue;
    placed.push(placed.some((other) => overlaps(item, other)) ? nearestSlot(item, placed) : item);
  }
  return placed;
}
export function validateDesktop(value: unknown, fallback = DEFAULT_DESKTOP): DesktopLayout {
  const raw = record(value);
  if (raw.version !== 1) return structuredClone(fallback);
  const order = Array.isArray(raw.order) ? [...new Set(raw.order.filter(isPanel))] : [];
  for (const id of fallback.order) if (!order.includes(id)) order.push(id);
  const sizes = {} as Record<PanelId, PanelSize>;
  const positions = {} as Record<PanelId, GridPosition>;
  for (const id of PANEL_IDS) {
    const size = record(record(raw.sizes)[id]);
    sizes[id] = { width: bounded(size.width, 4, 12, fallback.sizes[id].width), height: bounded(size.height, 3, 8, fallback.sizes[id].height) };
    const pos = record(record(raw.positions)[id]);
    positions[id] = { x: bounded(pos.x, 0, 12 - sizes[id].width, 0), y: bounded(pos.y, 0, 48, 0) };
  }
  const result: DesktopLayout = { version: 1, order, sizes, minimized: Array.isArray(raw.minimized) ? [...new Set(raw.minimized.filter(isPanel))] : [] };
  if (raw.positions && PANEL_IDS.every((id) => record(raw.positions)[id])) {
    result.positions = positions;
    for (const item of packDesktop(result)) positions[item.id] = { x: item.x, y: item.y };
  }
  return result;
}
export function parseDesktop(raw: string | null, fallback = DEFAULT_DESKTOP): DesktopLayout {
  if (!raw || raw.length > 8000) return structuredClone(fallback);
  try { return validateDesktop(JSON.parse(raw), fallback); } catch { return structuredClone(fallback); }
}
function snapshot(layout: DesktopLayout): DesktopLayout {
  const next = structuredClone(layout);
  next.positions = {} as Record<PanelId, GridPosition>;
  for (const item of allSlots(layout)) next.positions[item.id] = { x: item.x, y: item.y };
  for (const item of packDesktop(layout)) next.positions[item.id] = { x: item.x, y: item.y };
  return next;
}
/** Exchange the actual spaces, not just an abstract order; unrelated windows stay put. */
export function swapPanelSlots(layout: DesktopLayout, first: PanelId, second: PanelId): DesktopLayout {
  if (first === second) return layout;
  const next = snapshot(layout);
  [next.positions![first], next.positions![second]] = [next.positions![second], next.positions![first]];
  [next.sizes[first], next.sizes[second]] = [next.sizes[second], next.sizes[first]];
  next.order = next.order.map((id) => id === first ? second : id === second ? first : id);
  return next;
}
/** Place/resize the active panel first. Preserve unaffected slots and only move collisions. */
export function placePanel(layout: DesktopLayout, id: PanelId, position: GridPosition, size = layout.sizes[id]): DesktopLayout {
  const next = snapshot(layout);
  const safeSize = { width: bounded(size.width, 4, 12, layout.sizes[id].width), height: bounded(size.height, 3, 8, layout.sizes[id].height) };
  const active: Placement = { id, ...safeSize, x: bounded(position.x, 0, 12 - safeSize.width, 0), y: bounded(position.y, 0, 48, 0) };
  next.sizes[id] = safeSize; next.positions![id] = { x: active.x, y: active.y };
  const old = packDesktop(layout).filter((item) => item.id !== id);
  const placed: Placement[] = [active];
  const collisions: Placement[] = [];
  for (const item of old) {
    if (!overlaps(active, item)) { placed.push(item); continue; }
    // A shared vertical divider can trade width with an adjacent neighbour.
    let fitted: Placement | null = null;
    if (item.y === active.y && item.x < active.x && active.x - item.x >= 4)
      fitted = { ...item, width: active.x - item.x };
    else if (item.y === active.y && item.x >= active.x && item.x + item.width - active.x - active.width >= 4)
      fitted = { ...item, x: active.x + active.width, width: item.x + item.width - active.x - active.width };
    if (fitted && placed.every((other) => !overlaps(fitted!, other)) && old.every((other) => other.id === item.id || !overlaps(fitted!, other))) placed.push(fitted);
    else collisions.push(item);
  }
  for (const item of collisions) placed.push(nearestSlot(item, placed));
  for (const item of placed) {
    next.sizes[item.id] = { width: item.width, height: item.height };
    next.positions![item.id] = { x: item.x, y: item.y };
  }
  return next;
}
export function resizePanel(layout: DesktopLayout, id: PanelId, size: PanelSize, fromLeft = false): DesktopLayout {
  const current = packDesktop(layout).find((item) => item.id === id) ?? allSlots(layout).find((item) => item.id === id)!;
  const width = bounded(size.width, 4, 12, current.width);
  const x = fromLeft ? Math.max(0, current.x + current.width - width) : Math.min(current.x, 12 - width);
  return placePanel(layout, id, { x, y: current.y }, { width, height: size.height });
}
export function movePanel(layout: DesktopLayout, id: PanelId, index: number): DesktopLayout {
  const order = layout.order.filter((item) => item !== id);
  order.splice(Math.max(0, Math.min(order.length, index)), 0, id);
  return { ...layout, order };
}
export function setPanelMinimized(layout: DesktopLayout, id: PanelId, minimized: boolean): DesktopLayout {
  const next = snapshot(layout);
  next.minimized = minimized ? [...new Set([...layout.minimized, id])] : layout.minimized.filter((item) => item !== id);
  if (!minimized) {
    const item = { id, ...next.sizes[id], ...next.positions![id] };
    const visible = packDesktop(layout).filter((other) => other.id !== id);
    const fitted = visible.some((other) => overlaps(item, other)) ? nearestSlot(item, visible) : item;
    next.positions![id] = { x: fitted.x, y: fitted.y };
  }
  return next;
}
export function chatFirstDesktop(): DesktopLayout {
  return validateDesktop({ ...DEFAULT_DESKTOP, order: ["chat", "board", "feed", "music"], sizes: { chat: { width: 8, height: 5 }, board: { width: 4, height: 5 }, feed: { width: 8, height: 6 }, music: { width: 4, height: 3 } } });
}
export type DesktopLook = "electric" | "afterhours" | "chrome";
export type Participation = "mint" | "pink" | "yellow";
export type WindowColour = "mint" | "pink" | "blue" | "yellow" | "neutral";
export type WindowSkin = "solid" | "leopard" | "grid";
export type WindowAppearance = { colour: WindowColour; skin: WindowSkin };
export type OwnerDesktop = { version: 1; look: DesktopLook; participation: Participation; layout: DesktopLayout; windows: Record<PanelId, WindowAppearance> };
const defaultWindows: Record<PanelId, WindowAppearance> = { feed: {colour: "mint", skin: "solid"}, chat: {colour: "pink", skin: "solid"}, board: {colour: "blue", skin: "solid"}, music: {colour: "yellow", skin: "solid"} };
export function parseOwnerDesktop(raw: string | null): OwnerDesktop {
  const fallback: OwnerDesktop = { version: 1, look: "electric", participation: "mint", layout: structuredClone(DEFAULT_DESKTOP), windows: structuredClone(defaultWindows) };
  if (!raw || raw.length > 10000) return fallback;
  try {
    const value = record(JSON.parse(raw)); if (value.version !== 1) return fallback;
    const windows = structuredClone(defaultWindows);
    for (const id of PANEL_IDS) {
      const item = record(record(value.windows)[id]);
      if (["mint", "pink", "blue", "yellow", "neutral"].includes(String(item.colour))) windows[id].colour = item.colour as WindowColour;
      if (["solid", "leopard", "grid"].includes(String(item.skin))) windows[id].skin = item.skin as WindowSkin;
    }
    return { version: 1,
      look: ["electric", "afterhours", "chrome"].includes(String(value.look)) ? value.look as DesktopLook : fallback.look,
      participation: ["mint", "pink", "yellow"].includes(String(value.participation)) ? value.participation as Participation : fallback.participation,
      layout: validateDesktop(value.layout), windows,
    };
  } catch { return fallback; }
}
