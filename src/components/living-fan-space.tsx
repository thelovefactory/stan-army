"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Heart,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import {
  FanNote,
  fanNotes,
  NoteStyle,
  orbitFans,
  validateMark,
} from "@/lib/fan-space";
import { useDemo } from "./demo-provider";
import { useProfileTheme } from "./profile-theme";
import { MemoryVisual } from "./memory-visual";
export function LivingFanSpace({ armyId }: { armyId: string }) {
  const { notes, leaveMark } = useDemo();
  const { clean } = useProfileTheme();
  const [draft, setDraft] = useState(""),
    [style, setStyle] = useState<NoteStyle>("note"),
    [notice, setNotice] = useState(""),
    [examples, setExamples] = useState(true);
  const composer = useRef<HTMLTextAreaElement>(null);
  const local = notes[armyId] || [];
  const seeded = examples
    ? fanNotes
    : [{ ...fanNotes[0], likes: 0, replies: [] }];
  function prompt(text: string) {
    setDraft(text);
    composer.current?.focus();
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const issue = validateMark(draft);
    if (issue) {
      setNotice(issue);
      return;
    }
    leaveMark(armyId, draft, style);
    setDraft("");
    setNotice(
      "You left your mark. Your note is now first in this local feed; only this browser session can see it.",
    );
  }
  return (
    <section
      className={`living-fan-space ${clean ? "contributions-clean" : ""}`}
      id="fan-space"
      aria-labelledby="fan-space-heading"
    >
      <div className="fan-space-heading">
        <div>
          <p className="eyebrow">THE MUSIC BROUGHT YOU. THIS BIT IS OURS.</p>
          <h2 id="fan-space-heading">
            Look what we’re
            <br />
            <span>making of this place.</span>
          </h2>
        </div>
        <span className="fan-space-star" aria-hidden="true">
          ✳
        </span>
      </div>
      <p className="living-demo-label">
        Fictional fans & sample memories. Your contributions are local demos,
        not live posts.
      </p>
      <form className="mark-composer" onSubmit={submit}>
        <div className="composer-heading">
          <span className="little-avatar">YOU</span>
          <div>
            <h3>Leave your mark.</h3>
            <p>One song. One memory. One thing only you would say.</p>
          </div>
          <Sparkles size={20} />
        </div>
        <label htmlFor="fan-mark" className="sr-only">
          Your note to the Army
        </label>
        <textarea
          id="fan-mark"
          ref={composer}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setNotice("");
          }}
          maxLength={500}
          rows={3}
          placeholder="I knew I’d found my people when…"
        />
        <div className="mark-prompts">
          <button
            type="button"
            onClick={() => prompt("The first time this music found me… ")}
          >
            A first-listen memory
          </button>
          <button
            type="button"
            onClick={() => prompt("Made something for the B-side people: ")}
          >
            Something I made
          </button>
          <button
            type="button"
            onClick={() =>
              prompt("Unreasonably invested in the bridge. Anyone else? ")
            }
          >
            A very important question
          </button>
        </div>
        <fieldset className="mark-style-picker">
          <legend>Make it look like you</legend>
          {(
            [
              { id: "note", label: "Simple note" },
              { id: "scrapbook", label: "Notebook heart" },
              { id: "afterhours", label: "After hours" },
              { id: "photo", label: "Demo photo" },
            ] as { id: NoteStyle; label: string }[]
          ).map((s) => (
            <label key={s.id}>
              <input
                type="radio"
                name="note-style"
                value={s.id}
                checked={style === s.id}
                onChange={() => setStyle(s.id)}
              />
              <span>{s.label}</span>
            </label>
          ))}
        </fieldset>
        <div className="composer-actions">
          <span>
            {draft.length}/500 ·{" "}
            {style === "photo"
              ? "Uses an existing licensed demo photo"
              : "Your voice. Your little corner."}
          </span>
          <button type="submit" disabled={!draft.trim()}>
            <Send size={15} /> Leave my mark
          </button>
        </div>
        <p role="status" className="mark-status">
          {notice ||
            "You don’t need a crowd to start something. Notes stay until refresh."}
        </p>
      </form>
      <div className="feed-controls">
        <p>
          {local.length ? `${local.length} of your marks · ` : ""}A few notes
          from this corner
        </p>
        <label>
          <input
            type="checkbox"
            checked={examples}
            onChange={(e) => setExamples(e.target.checked)}
          />{" "}
          Show sample conversations
        </label>
      </div>
      {!examples && (
        <p className="first-stan-note">
          Just the first stan’s note and anything you add. One person is already
          a beginning. ♡
        </p>
      )}
      <div className="fan-note-list">
        {[...local, ...seeded].map((note) => (
          <FanNoteCard key={note.id} note={note} armyId={armyId} />
        ))}
      </div>
    </section>
  );
}
function FanNoteCard({ note, armyId }: { note: FanNote; armyId: string }) {
  const { hearts, heart, replies, reply } = useDemo();
  const { clean } = useProfileTheme();
  const key = `${armyId}:${note.id}`;
  const [expanded, setExpanded] = useState(false),
    [draft, setDraft] = useState(""),
    [notice, setNotice] = useState("");
  const field = useRef<HTMLInputElement>(null);
  const allReplies = [...note.replies, ...(replies[key] || [])];
  const loved = hearts.includes(key);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const issue = validateMark(draft);
    if (issue) {
      setNotice(issue);
      return;
    }
    reply(key, draft);
    setDraft("");
    setNotice("Reply added locally. Only this browser session can see it.");
  }
  return (
    <article
      className={`fan-note note-${note.style} ${clean ? "note-clean" : ""}`}
    >
      <header>
        <span className={`note-avatar avatar-${note.initials.toLowerCase()}`}>
          {note.initials}
        </span>
        <div>
          <strong>{note.local ? "You · @jess.wav" : `@${note.handle}`}</strong>
          <small>{note.label}</small>
        </div>
        <span className="note-ornament" aria-hidden="true">
          {note.style === "scrapbook"
            ? "♡"
            : note.style === "afterhours"
              ? "☾"
              : "✧"}
        </span>
      </header>
      {(note.image || note.style === "photo") && (
        <div className="fan-note-photo">
          <Image
            src={note.image || "/images/room.jpg"}
            fill
            sizes="(max-width:800px) 90vw,55vw"
            alt="Licensed stock concert photo illustrating a fictional fan memory"
          />
          <span>the blurry ones stay with you.</span>
        </div>
      )}
      <p className="note-body">{note.text}</p>
      {note.id === "lex-print" && (
        <div className="note-print">
          <MemoryVisual memoryId="bside-print" />
        </div>
      )}
      <footer>
        <button
          aria-pressed={loved}
          onClick={() => heart(key)}
          aria-label={loved ? "Remove local heart" : "Leave a local heart"}
        >
          <Heart size={17} fill={loved ? "currentColor" : "none"} />
          {note.likes + (loved ? 1 : 0)}{" "}
          <span>{note.local ? "hearts" : "sample hearts"}</span>
        </button>
        <button
          onClick={() => {
            setExpanded(!expanded);
            if (!expanded) requestAnimationFrame(() => field.current?.focus());
          }}
          aria-expanded={expanded}
        >
          <MessageCircle size={16} />
          {allReplies.length
            ? `${allReplies.length} replies`
            : "Say something back"}
        </button>
        <span>{note.local ? "Your local note" : "Demo conversation"}</span>
      </footer>
      {expanded && (
        <div className="note-replies">
          {allReplies.map((r) => (
            <div className="note-reply" key={r.id}>
              <b>@{r.handle}</b>
              <p>{r.text}</p>
            </div>
          ))}
          <form onSubmit={submit}>
            <label className="sr-only" htmlFor={`reply-${note.id}`}>
              Reply to {note.handle}
            </label>
            <input
              id={`reply-${note.id}`}
              ref={field}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={280}
              placeholder="Leave a little something back…"
            />
            <button
              disabled={draft.trim().length < 2}
              aria-label="Send local reply"
            >
              <ArrowUpRight size={19} />
            </button>
          </form>
          <p className="reply-status" role="status">
            {notice || "Replies are local demonstrations and reset on refresh."}
          </p>
        </div>
      )}
    </article>
  );
}
export function OrbitFans() {
  const [selected, setSelected] = useState(0);
  return (
    <section className="orbit-fans">
      <div className="orbit-heading">
        <div>
          <p className="eyebrow">IT’S THE PEOPLE, ISN’T IT?</p>
          <h2>In our little orbit.</h2>
        </div>
        <span>♡</span>
      </div>
      <div className="orbit-grid">
        {orbitFans.map((f, i) => (
          <button
            key={f.handle}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
            aria-label={`Meet fictional fan ${f.handle}`}
          >
            <span className={`orbit-avatar fan-${f.color}`}>{f.initials}</span>
            <b>@{f.handle}</b>
          </button>
        ))}
      </div>
      <div className="orbit-person">
        <b>@{orbitFans[selected].handle}</b>
        <p>{orbitFans[selected].line}</p>
        {selected === 0 && (
          <Link href="/fans/jess-wav">
            Visit Jess’s own corner <ArrowUpRight size={13} />
          </Link>
        )}
      </div>
      <p className="orbit-disclaimer">
        Eight fictional personalities. Not a ranking or an online count.
      </p>
    </section>
  );
}
