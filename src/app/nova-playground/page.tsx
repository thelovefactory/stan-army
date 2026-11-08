import type { Metadata } from "next";
import { ArmyDesktopPlayground } from "@/components/army-desktop-playground";

export const metadata: Metadata = {
  title: "Nova — desktop playground",
  description: "An experimental personal, snap-to-grid Army desktop. Move the windows, not the community.",
};
export default function Page() { return <ArmyDesktopPlayground />; }
