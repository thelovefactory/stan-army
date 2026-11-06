import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Artist } from '@/lib/data';
export function ArtistCard({ artist, index = 0 }: { artist: Artist; index?: number }) { return <Link href={`/artists/${artist.slug}`} className={`artist-card accent-${artist.accent}`}><div className="card-photo"><Image src={artist.image} fill sizes="(max-width: 600px) 92vw, (max-width: 900px) 45vw, 30vw" alt={`Licensed stock photograph representing fictional artist ${artist.name}`} style={{ objectFit: 'cover' }} /><span className="card-category">{artist.genre}</span><span className="card-number">0{index + 1}</span><span className="card-arrow"><ArrowUpRight size={21} /></span></div><div className="card-details"><div><h3>{artist.name}</h3><p>@{artist.handle} <span>· {artist.city}</span></p></div><span className="card-count">{artist.count.toLocaleString('en-GB')}<small>demo stans</small></span></div></Link>; }
