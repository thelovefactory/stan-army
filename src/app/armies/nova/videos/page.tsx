import { armyBySlug } from "@/lib/data";
import { FanMediaPage } from "@/components/fan-media";
export const metadata = { title: "Nova’s after-hours fan video shelf" };
export default function Page() {
  return <FanMediaPage view={armyBySlug("nova")!} mode="videos" />;
}
