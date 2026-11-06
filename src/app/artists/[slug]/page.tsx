import { artists } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ArtistSpace } from '@/components/artist-space';
export function generateStaticParams() { return artists.map(a=>({slug:a.slug})); }
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }) { const {slug}=await params; const artist=artists.find(a=>a.slug===slug); return {title:artist?`${artist.name}’s army`:'Army not found'}; }
export default async function Page({ params }: { params: Promise<{slug:string}> }) { const {slug}=await params; const artist=artists.find(a=>a.slug===slug); if(!artist) notFound(); return <ArtistSpace artist={artist}/>; }
