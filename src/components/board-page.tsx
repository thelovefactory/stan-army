import Link from "next/link";
import { Board } from "@/lib/boards";
import { DiscussionBoard } from "./discussion-board";
import { MyBoardsLinks } from "./boards-directory";
export function BoardPage({ board }: { board: Board }) {
  return (
    <main id="main" className="container boards-page">
      <div className="board-page-nav">
        <Link href="/boards">← Explore boards</Link>
        {board.armySlug ? (
          <Link href={`/armies/${board.armySlug}`}>
            Visit {board.title}’s Army ↗
          </Link>
        ) : (
          <span>Across Armies · independent music community</span>
        )}
      </div>
      <MyBoardsLinks />
      <DiscussionBoard key={board.id} boardId={board.id} standalone />
    </main>
  );
}
