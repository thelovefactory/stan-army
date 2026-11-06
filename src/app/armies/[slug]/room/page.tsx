import { armies, armyBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { ArmySpace } from "@/components/artist-space";
export function generateStaticParams() {
  return armies.map((a) => ({ slug: a.slug }));
}
export const metadata = { title: "The fan listening room" };
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const view = armyBySlug(slug);
  if (!view) notFound();
  return <ArmySpace view={view} room />;
}
