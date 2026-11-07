"use client";
import { useState } from "react";
import { ArrowUp, ArrowDown, MessageSquare, Plus, X } from "lucide-react";
type Thread = {
  id: string;
  author: string;
  title: string;
  body: string;
  tag: string;
  score: number;
  replies: { author: string; text: string }[];
  local?: boolean;
};
const initialThreads: Thread[] = [
  {
    id: "bridge",
    author: "jess.wav",
    title: "Which Nova bridge would you defend with your life?",
    body: "The last eight bars. Headphones on. That’s my entire argument. What’s yours?",
    tag: "Discussion",
    score: 18,
    replies: [
      {
        author: "lucid.lou",
        text: "The one you immediately rewind before the song even finishes. You know the one.",
      },
    ],
  },
  {
    id: "first-listen",
    author: "milo.mp3",
    title: "First listen vs. 100th listen: what changed for you?",
    body: "I came for the chorus and stayed for the tiny things in the background. Tell me what I’m missing.",
    tag: "Question",
    score: 12,
    replies: [],
  },
  {
    id: "fan-project",
    author: "lex.exe",
    title: "A little fan-made zine. Who wants a page?",
    body: "Lyrics in the margins, blurry photos, concert memories. If you’ve got one thing you want to make, that’s enough.",
    tag: "Fan project",
    score: 9,
    replies: [],
  },
];
export function DiscussionBoard() {
  const [threads, setThreads] = useState(initialThreads);
  const [sort, setSort] = useState("top");
  const [votes, setVotes] = useState<Record<string, number>>({});
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
  function vote(id: string, value: number) {
    setVotes((c) => ({ ...c, [id]: c[id] === value ? 0 : value }));
  }
  return (
    <section
      className="discussion-board"
      id="discussions"
      aria-labelledby="discussion-heading"
    >
      <header className="board-header">
        <div>
          <p className="eyebrow">THE CONVERSATION KEEPS GOING</p>
          <h2 id="discussion-heading">
            s/Nova<span>✳</span>
          </h2>
          <p>Deep dives, big feelings, very specific opinions.</p>
        </div>
        <button
          className="button button-mint"
          aria-expanded={composing}
          onClick={() => setComposing(!composing)}
        >
          <Plus size={16} /> Start a discussion
        </button>
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
            <button type="button" onClick={() => setComposing(false)}>
              Cancel
            </button>
            <button type="submit" className="button button-mint">
              Post discussion
            </button>
          </div>
        </form>
      )}
      <p role="status" className="board-status">
        {status}
      </p>
      <div className="board-threads">
        {ordered.map((t) => (
          <article key={t.id} className="board-thread">
            <div className="thread-votes">
              <button
                aria-label={`Upvote: ${t.title}`}
                aria-pressed={votes[t.id] === 1}
                onClick={() => vote(t.id, 1)}
              >
                <ArrowUp size={19} />
              </button>
              <strong>{t.score + (votes[t.id] || 0)}</strong>
              <button
                aria-label={`Downvote: ${t.title}`}
                aria-pressed={votes[t.id] === -1}
                onClick={() => vote(t.id, -1)}
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
