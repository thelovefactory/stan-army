import { armyBySlug } from "@/lib/data";
import { ArmyPosts } from "@/components/army-posts";
export const metadata = { title: "Nova’s Army — all posts" };
export default function Page() {
  return <ArmyPosts view={armyBySlug("nova")!} />;
}
