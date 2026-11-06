export type Artist = { slug: string; name: string; handle: string; genre: string; city: string; bio: string; count: number; image: string; accent: string; favourite: boolean; added: number };
export const artists: Artist[] = [
  { slug: 'nova-reign', name: 'Nova Reign', handle: 'novareign', genre: 'Alternative R&B', city: 'Bristol, UK', bio: 'Late-night soul. Loud feelings. Songs for the journey home. Come for the music, stay for the people.', count: 2408, image: '/images/artist.jpg', accent: 'mint', favourite: true, added: 6 },
  { slug: 'sienna-blue', name: 'Sienna Blue', handle: 'siennablue', genre: 'Indie pop', city: 'London, UK', bio: 'Bedroom beginnings, big-sky choruses. Making a little space for all the things we never say.', count: 1826, image: '/images/sienna.jpg', accent: 'pink', favourite: true, added: 4 },
  { slug: 'atlas-noir', name: 'Atlas Noir', handle: 'atlasnoir', genre: 'Electronic', city: 'Berlin, DE', bio: 'After-hours electronics for beautifully restless people. Meet me somewhere between the bass and the sunrise.', count: 3210, image: '/images/atlas.jpg', accent: 'blue', favourite: false, added: 2 },
  { slug: 'velvet-static', name: 'Velvet Static', handle: 'velvetstatic', genre: 'Alternative', city: 'Manchester, UK', bio: 'Distorted guitars, open hearts. A little noise goes a long way.', count: 964, image: '/images/room.jpg', accent: 'orange', favourite: true, added: 5 },
  { slug: 'sol-collective', name: 'Sol Collective', handle: 'solcollective', genre: 'Alternative R&B', city: 'Bristol, UK', bio: 'A gathering of voices. Soul, rhythm, and a place to belong.', count: 783, image: '/images/crowd.jpg', accent: 'mint', favourite: false, added: 3 },
  { slug: 'milo-june', name: 'Milo June', handle: 'milojune', genre: 'Indie pop', city: 'London, UK', bio: 'Small stories with a big heart. Your next rainy-day soundtrack.', count: 512, image: '/images/atlas.jpg', accent: 'pink', favourite: false, added: 1 },
];
export type DiscoveryOptions = { search: string; genre: string; city: string; collection: string };
export function filterArtists(options: DiscoveryOptions): Artist[] {
  const query = options.search.trim().toLowerCase();
  return artists.filter(a => (!query || `${a.name} ${a.handle} ${a.genre} ${a.city}`.toLowerCase().includes(query)) && (options.genre === 'All genres' || a.genre === options.genre) && (options.city === 'Everywhere' || a.city === options.city) && (options.collection !== 'Our favourites' || a.favourite)).sort((a, b) => options.collection === 'Most stanned' ? b.count - a.count : b.added - a.added);
}
export const embed = { title: 'NPR Music · Tiny Desk Concert', url: 'https://www.youtube.com/watch?v=ferZnZ0_rSM', src: 'https://www.youtube-nocookie.com/embed/ferZnZ0_rSM' };
export type WizardDraft = { name: string; handle: string; bio: string; genre: string; link: string; image: string; accent: string };
export const initialDraft: WizardDraft = { name: '', handle: '', bio: '', genre: 'Alternative R&B', link: '', image: '/images/artist.jpg', accent: 'mint' };
export function validateDraft(draft: WizardDraft, step: number): string | null {
  if (step === 0) {
    if (draft.name.trim().length < 2 || draft.name.trim().length > 60) return 'Enter an artist name between 2 and 60 characters.';
    if (!/^[a-z0-9][a-z0-9-]{2,29}$/.test(draft.handle)) return 'Use 3–30 lowercase letters, numbers or hyphens for your handle.';
  }
  if (step === 1 && (draft.bio.trim().length < 10 || draft.bio.length > 300)) return 'Write a bio between 10 and 300 characters.';
  if (step === 2 && draft.link.trim()) {
    try { const url = new URL(draft.link); if (url.protocol !== 'https:' || !url.hostname.includes('.') || url.username || url.password) return 'Enter a full HTTPS link without login details, or leave it blank.'; }
    catch { return 'Enter a full HTTPS link, or leave it blank for now.'; }
  }
  return null;
}
