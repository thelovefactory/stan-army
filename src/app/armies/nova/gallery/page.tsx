import { armyBySlug } from "@/lib/data";
import { FanMediaPage } from "@/components/fan-media";
export const metadata = { title: "Nova’s communal shoebox — fan gallery" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ memory?: string | string[] }>;
}) {
  const query = await searchParams;
  return (
    <FanMediaPage
      view={armyBySlug("nova")!}
      mode="gallery"
      initialMemory={
        typeof query.memory === "string" ? query.memory : undefined
      }
    />
  );
}
