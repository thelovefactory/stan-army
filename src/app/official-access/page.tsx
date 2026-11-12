import { OfficialAccess } from "@/components/official-access";
export const metadata = {
  title: "Request official access — identity, not ownership",
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ army?: string | string[] }>;
}) {
  const query = await searchParams;
  return (
    <OfficialAccess
      armySlug={typeof query.army === "string" ? query.army : "nova"}
    />
  );
}
