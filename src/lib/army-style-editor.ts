import { contrast, readableColor } from "./theme";
import { PANEL_IDS, parseOwnerDesktop } from "./army-desktop";
import type { OwnerDesktop } from "./army-desktop";

export const DESKTOP_PRESETS = [
  { id: "blackout", name: "Blackout", description: "The quiet starting point.", colour: "#151718", accent: "#a7f3d0" },
  { id: "afterhours", name: "After hours", description: "Late nights. Deep purple.", colour: "#241a34", accent: "#dda6ef" },
  { id: "acid", name: "Acid house", description: "A little loud everywhere.", colour: "#efff70", accent: "#ff009d" },
  { id: "leopard", name: "Wild thing", description: "Maximum personality.", colour: "#f3b4db", accent: "#a7f3d0" },
] as const;
export type DesktopPresetId = (typeof DESKTOP_PRESETS)[number]["id"];

/** Presets alter presentation only. Community content and personal geometry stay put. */
export function applyDesktopPreset(owner: OwnerDesktop, id: DesktopPresetId): OwnerDesktop {
  const next = parseOwnerDesktop(null);
  next.layout = owner.layout;
  next.music = owner.music;
  if (id === "afterhours") {
    next.look = "afterhours"; next.header.colour = "#201929"; next.accent = "#b56ae8";
    for (const panel of PANEL_IDS) next.windows[panel] = { ...next.windows[panel], surface: "custom", customSurface: "#201a29", colour: "pink", skin: "grid" };
  } else if (id === "acid") {
    next.look = "chrome"; next.header.colour = "#171c14";
    for (const panel of PANEL_IDS) next.windows[panel] = { ...next.windows[panel], surface: panel === "chat" ? "mint" : panel === "music" ? "dark" : "yellow", typeface: panel === "music" ? "mono" : "chunky", colour: "yellow" };
  } else if (id === "leopard") {
    next.look = "electric"; next.header.typeface = "chunky";
    next.windows.chat = { ...next.windows.chat, surface: "mint", typeface: "mono" };
    next.windows.board = { ...next.windows.board, surface: "pink", typeface: "chunky" };
    next.windows.music = { ...next.windows.music, skin: "leopard" };
    next.frame = "classic";
  }
  return next;
}
export function sameDesktopStyle(a: OwnerDesktop, b: OwnerDesktop): boolean {
  const { layout: _a, ...first } = a, { layout: _b, ...second } = b;
  void _a; void _b;
  return JSON.stringify(first) === JSON.stringify(second);
}
export type StyleHistory = { past: OwnerDesktop[]; present: OwnerDesktop; future: OwnerDesktop[] };
export function createStyleHistory(owner: OwnerDesktop): StyleHistory { return { past: [], present: owner, future: [] }; }
export function changeStyle(history: StyleHistory, next: OwnerDesktop): StyleHistory {
  if (sameDesktopStyle(history.present, next)) return history;
  return { past: [...history.past, history.present].slice(-40), present: next, future: [] };
}
export function undoStyle(history: StyleHistory): StyleHistory {
  const previous = history.past.at(-1);
  return previous ? { past: history.past.slice(0, -1), present: previous, future: [history.present, ...history.future] } : history;
}
export function redoStyle(history: StyleHistory): StyleHistory {
  const next = history.future[0];
  return next ? { past: [...history.past, history.present], present: next, future: history.future.slice(1) } : history;
}

/** Use true black when a mid-grey surface sits between the off-black/white thresholds. */
export function readableDesktopColour(preferred: string, background: string): string {
  const colour = readableColor(preferred, background);
  if (contrast(colour, background) >= 4.5) return colour;
  return contrast("#000000", background) > contrast("#ffffff", background) ? "#000000" : "#ffffff";
}
