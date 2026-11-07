"use client";
import Link from "next/link";
import { boardById, boardPath, Thread } from "@/lib/boards";
import { useBoards } from "./boards-provider";
import { useState } from "react";
import { ArrowUp, ArrowDown, MessageSquare, Plus, X } from "lucide-react";
export function DiscussionBoard({
  boardId = "s/nova",
  standalone = false,
}: {
  boardId?: string;
  standalone?: boolean;
}) {
  const board = boardById(boardId)!;
  const {
    threadsFor,
    setThreadsFor,
    votesFor,
    vote,
    favourites,
    toggleFavourite,
    bookmarkStatus,
  } = useBoards();
  const threads = threadsFor(board);
  const votes = votesFor(board.id);
  const setThreads = (update: (current: Thread[]) => Thread[]) =>
    setThreadsFor(board, update);
  const saved = favourites.includes(board.id);
  const [sort, setSort] = useState("top");
  const [open, setOpen] = useState<string>();
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("Discussion");
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("");
  const ordered =
    sort === "top"
      ? [...threads].sort(
          (a, b) => b.score + (votes[b.id] || 0) - a.score - (votes[a.id] || 0),
        )
      : threads;
  return (
    <section
      className={`discussion-board board-kind-${board.kind}`}
      id="discussions"
      aria-labelledby="discussion-heading"
    >
      <header className="board-header">
        <div>
          <p className="eyebrow">
            {board.kind === "s"
              ? "ARTIST DISCUSSION · PART OF THE ARMY"
              : "COMMUNITY · ACROSS ARMIES"}
          </p>
          <h2 id="discussion-heading">
            {board.id}
            <span>{board.kind === "s" ? "✳" : "✦"}</span>
          </h2>
          <p>{board.description}</p>
        </div>
        <div className="board-header-actions">
          <button
            className="button"
            aria-pressed={saved}
            onClick={() => toggleFavourite(board.id)}
          >
            {saved ? "Saved to My Boards" : "+ My Boards"}
          </button>
          {standalone ? (
            <Link href="/boards">Explore boards ↗</Link>
          ) : (
            <Link href={boardPath(board)}>Open board ↗</Link>
          )}
          <button
            className="button button-mint"
            aria-expanded={composing}
            onClick={() => setComposing(!composing)}
          >
            <Plus size={16} /> Start a discussion
          </button>
        </div>
      </header>
      <div className="board-toolbar">
        <div role="group" aria-label="Sort discussions">
          {["top", "new"].map((s) => (
            <button
              key={s}
              aria-pressed={sort === s}
              onClick={() => setSort(s)}
            >
              {s === "top" ? "Top" : "New"}
            </button>
          ))}
        </div>
        <small>
          Demo threads · your posts, replies and votes reset on refresh
        </small>
      </div>
      {composing && (
        <form
          className="board-compose"
          onSubmit={(e) => {
            e.preventDefault();
            if (title.trim().length < 3 || !body.trim()) return;
            setThreads((c) => [
              {
                id: crypto.randomUUID(),
                author: "you.demo",
                title: title.trim(),
                body: body.trim(),
                tag,
                score: 0,
                replies: [],
                local: true,
              },
              ...c,
            ]);
            setTitle("");
            setBody("");
            setComposing(false);
            setSort("new");
            setStatus("Discussion posted locally.");
          }}
        >
          <label htmlFor="thread-title">Title</label>
          <input
            id="thread-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
            maxLength={160}
            placeholder="What do you want to talk about?"
          />
          <label htmlFor="thread-body">Your post</label>
          <textarea
            id="thread-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            maxLength={2000}
            rows={3}
          />
          <label htmlFor="thread-tag">Topic</label>
          <select
            id="thread-tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            <option>Discussion</option>
            <option>Question</option>
            <option>Fan project</option>
          </select>
          <div>
            <button
              type="button"
              formNoValidate
              onClick={() => setComposing(false)}
            >
              Cancel
            </button>
            <button type="submit" className="button button-mint">
              Post discussion
            </button>
          </div>
        </form>
      )}
      <p role="status" className="board-status">
        {status || bookmarkStatus}
      </p>
      <div className="board-threads">
        {ordered.map((t) => (
          <article key={t.id} className="board-thread">
            <div className="thread-votes">
              <button
                aria-label={`Upvote: ${t.title}`}
                aria-pressed={votes[t.id] === 1}
                onClick={() => vote(board.id, t.id, 1)}
              >
                <ArrowUp size={19} />
              </button>
              <strong>{t.score + (votes[t.id] || 0)}</strong>
              <button
                aria-label={`Downvote: ${t.title}`}
                aria-pressed={votes[t.id] === -1}
                onClick={() => vote(board.id, t.id, -1)}
              >
                <ArrowDown size={19} />
              </button>
            </div>
            <div className="thread-content">
              <div className="thread-meta">
                <b className="thread-tag">{t.tag}</b>
                <span>
                  @{t.author} · {t.local ? "local post" : "sample thread"}
                </span>
              </div>
              <h3>
                <button
                  aria-expanded={open === t.id}
                  aria-controls={`thread-${t.id}`}
                  onClick={() => {
                    setOpen(open === t.id ? undefined : t.id);
                    setReply("");
                  }}
                >
                  {t.title}
                </button>
              </h3>
              <p className="thread-excerpt">{t.body}</p>
              <button
                className="thread-comments"
                aria-expanded={open === t.id}
                aria-controls={`thread-${t.id}`}
                onClick={() => {
                  setOpen(open === t.id ? undefined : t.id);
                  setReply("");
                }}
              >
                <MessageSquare size={15} />
                {t.replies.length}{" "}
                {t.replies.length === 1 ? "reply" : "replies"} · Join in
              </button>
              {open === t.id && (
                <div className="thread-expanded" id={`thread-${t.id}`}>
                  <button
                    className="thread-close"
                    aria-label="Close discussion"
                    onClick={() => setOpen(undefined)}
                  >
                    <X size={16} />
                  </button>
                  {t.replies.map((r, i) => (
                    <div className="board-reply" key={i}>
                      <b>@{r.author}</b>
                      <p>{r.text}</p>
                    </div>
                  ))}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!reply.trim()) return;
                      setThreads((c) =>
                        c.map((x) =>
                          x.id === t.id
                            ? {
                                ...x,
                                replies: [
                                  ...x.replies,
                                  { author: "you.demo", text: reply.trim() },
                                ],
                              }
                            : x,
                        ),
                      );
                      setReply("");
                      setStatus("Reply added locally.");
                    }}
                  >
                    <label htmlFor={`reply-${t.id}`}>Add a reply</label>
                    <textarea
                      id={`reply-${t.id}`}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      required
                      maxLength={1000}
                      rows={2}
                    />
                    <button
                      type="submit"
                      className="button button-mint"
                      disabled={!reply.trim()}
                    >
                      Reply
                    </button>
                  </form>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
