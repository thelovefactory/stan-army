import type { Artist } from "./artists";
export function filterArtists(
  artists: Artist[],
  query: string,
  genre: string,
  collection: string,
): Artist[];
export function safeMusicUrl(value: string): boolean;
export function validHandle(value: string): boolean;
