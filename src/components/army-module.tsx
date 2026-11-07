"use client";
import { ArmyModuleName } from "@/lib/theme";
import { useProfileTheme } from "./profile-theme";
export function ArmyModule({
  name,
  children,
  fallback = false,
}: {
  name: ArmyModuleName;
  children: React.ReactNode;
  fallback?: boolean;
}) {
  const { theme } = useProfileTheme();
  return theme.modules[name] ? (
    children
  ) : fallback ? (
    <p className="module-hidden-note">
      This module is hidden by this Army’s customiser. You can return to the
      Army or change its visibility in Customise if you have permission.
    </p>
  ) : null;
}
