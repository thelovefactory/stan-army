import { embed } from "./data";
import { fanVideoStudies } from "./fan-space";
export type PlayerMode = "music" | "video";
export type PlayerItem = {
  id: string;
  mode: PlayerMode;
  kind: "audio" | "video" | "embed";
  title: string;
  by: string;
  credit: string;
  src: string;
  source: string;
  seconds?: number;
};
export const playerItems: PlayerItem[] = [
  {
    id: "midnight-circuit",
    mode: "music",
    kind: "audio",
    title: "Midnight Circuit",
    by: "Stan Army · original demo sketch",
    credit:
      "Original synthesized instrumental for this prototype. Not a Nova Reign recording.",
    src: "/audio/midnight-circuit.mp3",
    source: "/audio/midnight-circuit.mp3",
    seconds: 24,
  },
  {
    id: "window-seat",
    mode: "music",
    kind: "audio",
    title: "Window Seat",
    by: "Stan Army · original demo sketch",
    credit:
      "Original synthesized instrumental for this prototype. Not a Nova Reign recording.",
    src: "/audio/window-seat.mp3",
    source: "/audio/window-seat.mp3",
    seconds: 24,
  },
  ...fanVideoStudies.map((v) => ({
    id: v.id,
    mode: "video" as const,
    kind: "video" as const,
    title: v.title,
    by: `@${v.by} · fictional fan credit`,
    credit: v.caption,
    src: v.src,
    source: v.src,
    seconds: 6,
  })),
  {
    id: "npr-sample",
    mode: "video",
    kind: "embed",
    title: "NPR Music · Tiny Desk",
    by: "YouTube · third-party performance example",
    credit:
      "Public provider example, not Nova’s music. YouTube loads only after your click; its own controls govern playback.",
    src: embed.src,
    source: embed.url,
  },
];
export function itemFor(id: string, mode?: PlayerMode): PlayerItem {
  return (
    playerItems.find((i) => i.id === id && (!mode || i.mode === mode)) ||
    playerItems.find((i) => !mode || i.mode === mode)!
  );
}
export function adjacentItem(id: string, direction: number): PlayerItem {
  const active = itemFor(id);
  const queue = playerItems.filter((i) => i.mode === active.mode);
  const index = queue.findIndex((i) => i.id === active.id);
  return queue[
    (index + (direction % queue.length) + queue.length) % queue.length
  ];
}
export function formatTime(seconds: number): string {
  const n = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
}
export function safeSeek(value: number, duration: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(duration) || duration <= 0)
    return 0;
  return Math.min(duration, Math.max(0, value));
}
