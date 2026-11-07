"use client";
import Link from "next/link";
import { boards, Board, boardPath } from "@/lib/boards";
import { useBoards } from "./boards-provider";
export function BoardCard({ board }: { board: Board }) {
  const { favourites, toggleFavourite } = useBoards();
  const saved = favourites.includes(board.id);
  return (
    <article className={`board-card board-kind-${board.kind}`}>
      <span className="board-type">
        {board.kind === "s" ? "ARTIST DISCUSSION" : "COMMUNITY"}
      </span>
      <h3>
        <Link href={boardPath(board)}>{board.id}</Link>
      </h3>
      <p>{board.description}</p>
      <button
        aria-pressed={saved}
        aria-label={`${saved ? "Remove" : "Add"} ${board.id} ${saved ? "from" : "to"} My Boards`}
        onClick={() => toggleFavourite(board.id)}
      >
        {saved ? "✓ Saved · remove" : "+ My Boards"}
      </button>
    </article>
  );
}
export function BoardsDirectory() {
  const { favourites, bookmarkStatus } = useBoards();
  return (
    <main id="main" className="container boards-page">
      <header className="boards-intro">
        <p className="eyebrow">FOLLOW YOUR CURIOSITY</p>
        <h1>
          Your boards.
          <br />
          <span>Your rabbit holes.</span>
        </h1>
        <p>Your Army is where you belong. Your boards are where you explore.</p>
        <p className="boards-demo">
          Demo discussions · My Boards saves on this device
        </p>
      </header>
      <section id="my-boards" aria-labelledby="my-boards-heading">
        <h2 id="my-boards-heading">My Boards</h2>
        <p role="status">{bookmarkStatus}</p>
        {favourites.length ? (
          <div className="board-card-grid">
            {favourites.map((id) => (
              <BoardCard key={id} board={boards.find((b) => b.id === id)!} />
            ))}
          </div>
        ) : (
          <p className="boards-empty">
            Save any artist discussion or community below. Find all your
            favourites here.
          </p>
        )}
      </section>
      <section aria-labelledby="artist-boards-heading">
        <h2 id="artist-boards-heading">
          <span className="artist-board-label">s/</span> Artist discussions
        </h2>
        <p>
          Each board belongs to its artist’s Army. A place for that artist’s
          conversations.
        </p>
        <div className="board-card-grid">
          {boards
            .filter((b) => b.kind === "s")
            .map((b) => (
              <BoardCard key={b.id} board={b} />
            ))}
        </div>
      </section>
      <section aria-labelledby="community-boards-heading">
        <h2 id="community-boards-heading">
          <span className="community-board-label">com/</span> Communities
        </h2>
        <p>
          Music brings us together across Armies. These communities belong to no
          single artist.
        </p>
        <div className="board-card-grid">
          {boards
            .filter((b) => b.kind === "com")
            .map((b) => (
              <BoardCard key={b.id} board={b} />
            ))}
        </div>
      </section>
    </main>
  );
}
export function MyBoardsLinks() {
  const { favourites } = useBoards();
  return (
    <nav className="my-boards-links" aria-label="My Boards">
      <Link href="/boards#my-boards">
        <b>My Boards</b> ↗
      </Link>
      {favourites.map((id) => (
        <Link
          key={id}
          href={`/${id}`}
          className={
            id.startsWith("com/")
              ? "community-board-label"
              : "artist-board-label"
          }
        >
          {id}
        </Link>
      ))}
    </nav>
  );
}
