import { notFound } from "next/navigation";
import { boards, boardById } from "@/lib/boards";
import { BoardPage } from "@/components/board-page";
export function generateStaticParams() {
  return boards.filter((b) => b.kind === "com").map((b) => ({ slug: b.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const board = boardById(`com/${slug}`);
  return { title: board ? board.id : "Board not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const board = boardById(`com/${slug}`);
  if (!board) notFound();
  return <BoardPage board={board} />;
}
