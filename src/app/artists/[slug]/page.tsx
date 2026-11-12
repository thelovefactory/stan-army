import { armies, armyView, legacyArmy, armyPath } from "@/lib/data";
import { notFound, permanentRedirect } from "next/navigation";
export function generateStaticParams() {
  return armies.map((a) => ({ slug: armyView(a).artist.slug }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const view = legacyArmy(slug);
  if (!view) notFound();
  permanentRedirect(armyPath(view.army));
}
