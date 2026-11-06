import { ArmyWizard } from "@/components/army-wizard";
export const metadata = {
  title: "Start an Army — every Army starts with one fan",
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ artist?: string | string[] }>;
}) {
  const query = await searchParams;
  const prefill =
    typeof query.artist === "string" ? query.artist.slice(0, 80) : "";
  return <ArmyWizard key={prefill} prefill={prefill} />;
}
