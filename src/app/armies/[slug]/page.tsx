import { armies, armyBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { ArmySpace } from "@/components/artist-space";
export function generateStaticParams() {
  return armies.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = armyBySlug(slug);
  return { title: v ? `${v.artist.name}’s fan-run Army` : "Army not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const view = armyBySlug(slug);
  if (!view) notFound();
  return <ArmySpace view={view} />;
}
