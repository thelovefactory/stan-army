export type Artist = {
  handle: string;
  name: string;
  genre: string;
  city: string;
  image: string;
  accent: string;
  stans: number;
  bio: string;
  tag: string;
  favourite: boolean;
};
export const artists: Artist[] = [
  {
    handle: "nova",
    name: "NOVA",
    genre: "Alternative R&B",
    city: "London, UK",
    image: "/images/nova.jpg",
    accent: "#b5f4cf",
    stans: 2846,
    bio: "Songs for the late nights & the feelings you can’t quite name. Making a little universe with you.",
    tag: "FOR THE NIGHT OWLS",
    favourite: true,
  },
  {
    handle: "the-static",
    name: "THE STATIC",
    genre: "Indie rock",
    city: "Bristol, UK",
    image: "/images/static.jpg",
    accent: "#ff977c",
    stans: 1820,
    bio: "Loud guitars. Small rooms. Big feelings. Meet us at the front.",
    tag: "TURN IT UP",
    favourite: true,
  },
  {
    handle: "milo-blue",
    name: "MILO BLUE",
    genre: "Electronic",
    city: "Berlin, DE",
    image: "/images/milo.jpg",
    accent: "#acb8ff",
    stans: 3604,
    bio: "A soundtrack for getting lost, and finding your people.",
    tag: "AFTER HOURS CLUB",
    favourite: false,
  },
  {
    handle: "sol",
    name: "SOL",
    genre: "Soul",
    city: "Lisbon, PT",
    image: "/images/sol.jpg",
    accent: "#f4d989",
    stans: 964,
    bio: "A little soul. A little sunshine. Something to come home to.",
    tag: "STAY A LITTLE LONGER",
    favourite: true,
  },
];
export function getArtist(handle: string) {
  return artists.find((a) => a.handle === handle);
}
