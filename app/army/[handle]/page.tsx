import { notFound } from "next/navigation";
import { artists, getArtist } from "@/lib/artists";
import { ArtistRoom } from "@/components/artist-room";
export function generateStaticParams() {
  return artists.map((a) => ({ handle: a.handle }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  return { title: getArtist(handle)?.name || "Artist not found" };
}
export default async function ArmyPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const artist = getArtist(handle);
  if (!artist) notFound();
  return <ArtistRoom key={handle} artist={artist} />;
}
