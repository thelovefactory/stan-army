export type User = { id: string; handle: string; name: string; image: string };
export type Artist = {
  id: string;
  slug: string;
  name: string;
  officialHandle: string;
  genre: string;
  city: string;
  bio: string;
  image: string;
};
export type Army = {
  id: string;
  slug: string;
  artistId: string;
  founderId: string;
  count: number;
  accent: string;
  favourite: boolean;
  added: number;
  welcome: string;
};
export type ArmyMembership = {
  armyId: string;
  userId: string;
  role: "owner" | "admin" | "moderator" | "member";
};
export type ArtistRelationship = {
  userId: string;
  artistId: string;
  kind: "artist" | "representative";
  status: "pending" | "verified" | "revoked";
};
export type ArmyView = { army: Army; artist: Artist; founder: User };
export const users: User[] = [
  {
    id: "fan-jess",
    handle: "jess.wav",
    name: "Jess.wav",
    image: "/images/sienna.jpg",
  },
  {
    id: "fan-lou",
    handle: "lucid.lou",
    name: "Lou",
    image: "/images/atlas.jpg",
  },
  {
    id: "demo-nova",
    handle: "novareign",
    name: "Nova Reign",
    image: "/images/artist.jpg",
  },
  {
    id: "demo-rep",
    handle: "nova.team",
    name: "Nova’s team",
    image: "/images/atlas.jpg",
  },
];
export const currentFan = users[0];
export const fanFavourites: { userId: string; artistId: string }[] = [
  { userId: currentFan.id, artistId: "artist-nova" },
  { userId: currentFan.id, artistId: "artist-sienna" },
  { userId: currentFan.id, artistId: "artist-atlas" },
];
export const artists: Artist[] = [
  {
    id: "artist-nova",
    slug: "nova-reign",
    name: "Nova Reign",
    officialHandle: "novareign",
    genre: "Alternative R&B",
    city: "Bristol, UK",
    bio: "Late-night soul. Loud feelings. Songs for the journey home.",
    image: "/images/artist.jpg",
  },
  {
    id: "artist-sienna",
    slug: "sienna-blue",
    name: "Sienna Blue",
    officialHandle: "siennablue",
    genre: "Indie pop",
    city: "London, UK",
    bio: "Bedroom beginnings, big-sky choruses.",
    image: "/images/sienna.jpg",
  },
  {
    id: "artist-atlas",
    slug: "atlas-noir",
    name: "Atlas Noir",
    officialHandle: "atlasnoir",
    genre: "Electronic",
    city: "Berlin, DE",
    bio: "After-hours electronics for beautifully restless people.",
    image: "/images/atlas.jpg",
  },
  {
    id: "artist-velvet",
    slug: "velvet-static",
    name: "Velvet Static",
    officialHandle: "velvetstatic",
    genre: "Alternative",
    city: "Manchester, UK",
    bio: "Distorted guitars, open hearts.",
    image: "/images/room.jpg",
  },
  {
    id: "artist-sol",
    slug: "sol-collective",
    name: "Sol Collective",
    officialHandle: "solcollective",
    genre: "Alternative R&B",
    city: "Bristol, UK",
    bio: "A gathering of voices. Soul, rhythm, and a place to belong.",
    image: "/images/crowd.jpg",
  },
  {
    id: "artist-milo",
    slug: "milo-june",
    name: "Milo June",
    officialHandle: "milojune",
    genre: "Indie pop",
    city: "London, UK",
    bio: "Small stories with a big heart.",
    image: "/images/atlas.jpg",
  },
  {
    id: "artist-echo",
    slug: "echo-valentine",
    name: "Echo Valentine",
    officialHandle: "echovalentine",
    genre: "Indie pop",
    city: "Leeds, UK",
    bio: "Songs for the beautifully unfinished.",
    image: "/images/room.jpg",
  },
];
export const armies: Army[] = [
  {
    id: "army-nova",
    slug: "nova",
    artistId: "artist-nova",
    founderId: "fan-jess",
    count: 2408,
    accent: "mint",
    favourite: true,
    added: 6,
    welcome:
      "I started this Army after hearing Nova through a crackly late-night radio. Now we swap B-sides, make gig friends and send the songs a little further. Pull up a seat. You belong here.",
  },
  {
    id: "army-sienna",
    slug: "sienna-blue",
    artistId: "artist-sienna",
    founderId: "fan-lou",
    count: 1826,
    accent: "pink",
    favourite: true,
    added: 4,
    welcome:
      "A fan-built home for everyone who carries these choruses around. Come share the song that found you.",
  },
  {
    id: "army-atlas",
    slug: "atlas-noir",
    artistId: "artist-atlas",
    founderId: "fan-lou",
    count: 3210,
    accent: "blue",
    favourite: false,
    added: 2,
    welcome:
      "For the night-bus listeners and the last ones on the dance floor. Built by fans, open to you.",
  },
  {
    id: "army-velvet",
    slug: "velvet-static",
    artistId: "artist-velvet",
    founderId: "fan-jess",
    count: 964,
    accent: "orange",
    favourite: true,
    added: 5,
    welcome: "A little noise. A lot of heart. This is our fan-run corner.",
  },
  {
    id: "army-sol",
    slug: "sol-collective",
    artistId: "artist-sol",
    founderId: "fan-lou",
    count: 783,
    accent: "mint",
    favourite: false,
    added: 3,
    welcome: "Different people, one shared rhythm. Fans make this place.",
  },
  {
    id: "army-milo",
    slug: "milo-june",
    artistId: "artist-milo",
    founderId: "fan-jess",
    count: 512,
    accent: "pink",
    favourite: false,
    added: 1,
    welcome: "A place for the B-sides and the people who get them.",
  },
];
export const memberships: ArmyMembership[] = armies.map((a) => ({
  armyId: a.id,
  userId: a.founderId,
  role: "owner",
}));
// Fictional verification fixtures only; never evidence about a real artist.
export const artistRelationships: ArtistRelationship[] = [
  {
    userId: "demo-nova",
    artistId: "artist-nova",
    kind: "artist",
    status: "verified",
  },
  {
    userId: "demo-rep",
    artistId: "artist-nova",
    kind: "representative",
    status: "verified",
  },
];
export function armyView(army: Army): ArmyView {
  return {
    army,
    artist: artists.find((a) => a.id === army.artistId)!,
    founder: users.find((u) => u.id === army.founderId)!,
  };
}
export function armyBySlug(slug: string): ArmyView | undefined {
  const army = armies.find((a) => a.slug === slug);
  return army ? armyView(army) : undefined;
}
export function armyForArtist(artistId: string): Army | undefined {
  return armies.find((a) => a.artistId === artistId);
}
export function armyPath(army: Pick<Army, "slug">): string {
  return `/armies/${army.slug}`;
}
export function armyAddress(army: Pick<Army, "slug">): string {
  return `${army.slug}.stan.army`;
}
export function legacyArmy(artistSlug: string): ArmyView | undefined {
  const artist = artists.find((a) => a.slug === artistSlug);
  const army = artist && armyForArtist(artist.id);
  return army ? armyView(army) : undefined;
}
export function canAdminArmy(userId: string, armyId: string): boolean {
  return memberships.some(
    (m) =>
      m.armyId === armyId &&
      m.userId === userId &&
      (m.role === "owner" || m.role === "admin"),
  );
}
export function canPublishOfficial(userId: string, artistId: string): boolean {
  return artistRelationships.some(
    (r) =>
      r.userId === userId && r.artistId === artistId && r.status === "verified",
  );
}
export type DiscoveryOptions = {
  search: string;
  genre: string;
  city: string;
  collection: string;
};
export function filterArmies(options: DiscoveryOptions): ArmyView[] {
  const q = options.search.trim().toLowerCase();
  return armies
    .map(armyView)
    .filter(
      ({ army, artist }) =>
        (!q ||
          `${artist.name} ${army.slug} ${artist.genre} ${artist.city}`
            .toLowerCase()
            .includes(q)) &&
        (options.genre === "All genres" || artist.genre === options.genre) &&
        (options.city === "Everywhere" || artist.city === options.city) &&
        (options.collection !== "Our favourites" || army.favourite),
    )
    .sort((a, b) =>
      options.collection === "Most stanned"
        ? b.army.count - a.army.count
        : b.army.added - a.army.added,
    );
}
export const reservedAddresses = new Set([
  "www",
  "app",
  "api",
  "admin",
  "support",
  "help",
  "login",
  "auth",
  "account",
  "billing",
  "official",
  "artist",
  "artists",
  "army",
  "armies",
  "mail",
  "status",
  "security",
  "static",
  "cdn",
  "stan",
]);
export function suggestedAddress(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 63)
    .replace(/-$/, "");
}
export type ArmyDraft = {
  artistId: string;
  artistName: string;
  artistContext: string;
  address: string;
  welcome: string;
  musicLink: string;
  image: string;
};
export const initialArmyDraft: ArmyDraft = {
  artistId: "",
  artistName: "",
  artistContext: "",
  address: "",
  welcome: "",
  musicLink: "",
  image: "/images/room.jpg",
};
export function artistIdentityKey(name: string): string {
  return name
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s._-]+/g, " ")
    .trim();
}
export function validateArmyDraft(
  d: ArmyDraft,
  step: number,
  claimed: string[] = [],
): string | null {
  if (step === 0) {
    if (d.artistName.trim().length < 2 || d.artistName.length > 80)
      return "Choose or enter an artist name between 2 and 80 characters.";
    if (
      d.artistId &&
      !artists.some(
        (a) =>
          a.id === d.artistId &&
          artistIdentityKey(a.name) === artistIdentityKey(d.artistName),
      )
    )
      return "Select a matching artist identity or add distinguishing details for an unlisted artist.";
    const exact = artists.find(
      (a) => artistIdentityKey(a.name) === artistIdentityKey(d.artistName),
    );
    const id = d.artistId || exact?.id;
    if (id && armyForArtist(id))
      return "This artist already has an Army. Visit and enlist instead of creating a duplicate.";
    if (!id && d.artistContext.trim().length < 10)
      return "Add at least 10 characters of distinguishing details, such as city, genre or an official catalogue link.";
  }
  if (step === 1) {
    if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(d.address))
      return "Use 1–63 lowercase letters, numbers or internal hyphens.";
    if (reservedAddresses.has(d.address))
      return "That address is reserved for the platform or identity protection.";
    if (armies.some((a) => a.slug === d.address) || claimed.includes(d.address))
      return "That address is already used in this demo. Choose another.";
    if (/(^|-)(official|verified)(-|$)/.test(d.address))
      return "Choose a fan-community address without an official or verified claim.";
  }
  if (step === 2 && (d.welcome.trim().length < 10 || d.welcome.length > 500))
    return "Write a fan welcome between 10 and 500 characters.";
  if (step === 2 && d.musicLink.trim()) {
    try {
      const url = new URL(d.musicLink);
      if (
        url.protocol !== "https:" ||
        !url.hostname.includes(".") ||
        url.username ||
        url.password
      )
        return "Use a full public HTTPS music link without login credentials, or leave it blank.";
    } catch {
      return "Use a full public HTTPS music link, or leave it blank.";
    }
  }
  return null;
}
export const embed = {
  title: "NPR Music · Tiny Desk Concert",
  url: "https://www.youtube.com/watch?v=ferZnZ0_rSM",
  src: "https://www.youtube-nocookie.com/embed/ferZnZ0_rSM",
};
export function canModerateArmy(userId: string, armyId: string): boolean {
  return memberships.some(
    (m) =>
      m.userId === userId &&
      m.armyId === armyId &&
      ["owner", "admin", "moderator"].includes(m.role),
  );
}
export type OfficialRequest = {
  artistId: string;
  kind: "artist" | "representative";
  handle: string;
  evidenceUrl: string;
  details: string;
};
export function validateOfficialRequest(
  request: OfficialRequest,
): string | null {
  if (!artists.some((a) => a.id === request.artistId))
    return "Choose the artist identity you represent.";
  if (!/^[a-z0-9][a-z0-9._-]{2,29}$/.test(request.handle))
    return "Enter your separate Stan Army handle (3–30 lowercase letters, numbers, dots, underscores or hyphens).";
  try {
    const url = new URL(request.evidenceUrl);
    if (
      url.protocol !== "https:" ||
      !url.hostname.includes(".") ||
      url.username ||
      url.password
    )
      return "Provide a public HTTPS evidence link without login credentials.";
  } catch {
    return "Provide a public HTTPS evidence link.";
  }
  if (request.details.trim().length < 20 || request.details.length > 1000)
    return "Explain the identity or representative authority in 20–1000 characters. Do not include secrets or identity documents in this demo.";
  return null;
}
