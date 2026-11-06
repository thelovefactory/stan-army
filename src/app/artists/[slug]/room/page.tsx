import { artists } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ArtistSpace } from '@/components/artist-space';
export function generateStaticParams() { return artists.map(a=>({slug:a.slug})); }
export const metadata = {title:'The listening room'};
export default async function Page({ params }: { params: Promise<{slug:string}> }) { const {slug}=await params; const artist=artists.find(a=>a.slug===slug); if(!artist) notFound(); return <ArtistSpace artist={artist} room/>; }
