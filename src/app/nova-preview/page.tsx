import type { Metadata } from "next";
import { NovaLayoutStudy } from "@/components/nova-layout-study";

export const metadata: Metadata = {
  title: "Nova’s Army — layout study",
  description: "An alternative community-first Army layout using the existing Nova demo content.",
};

export default function Page() {
  return <NovaLayoutStudy />;
}
