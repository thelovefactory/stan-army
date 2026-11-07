"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight, Heart, MessageCircle, ImagePlus, X } from "lucide-react";
import {
  FanNote,
  fanNotes,
  NoteStyle,
  orbitFans,
  validateMark,
} from "@/lib/fan-space";
import { useDemo } from "./demo-provider";
import { useProfileTheme } from "./profile-theme";
import { readImage } from "@/lib/image-upload";
import type { ThemeAsset } from "@/lib/theme";
import { MemoryVisual } from "./memory-visual";
export function LivingFanSpace({ armyId }: { armyId: string }) {
  const { notes, leaveMark } = useDemo();
  const { clean, animationsEnabled } = useProfileTheme();
  const [draft, setDraft] = useState(""),
    [style, setStyle] = useState<NoteStyle>("note"),
    [notice, setNotice] = useState(""),
    [examples, setExamples] = useState(true);
  const [attachment, setAttachment] = useState<ThemeAsset>();
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const local = notes[armyId] || [];
  const seeded = examples
    ? fanNotes
    : [{ ...fanNotes[0], likes: 0, replies: [] }];
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const issue =
      attachment && draft.length <= 500 ? null : validateMark(draft);
    if (issue) {
      setNotice(issue);
      return;
    }
    leaveMark(armyId, draft, style, attachment);
    setAttachment(undefined);
    setDraft("");
    setNotice("Posted locally · stays until refresh.");
  }
  return (
    <section
      className={`living-fan-space ${clean ? "contributions-clean" : ""}`}
      id="fan-space"
      aria-labelledby="fan-space-heading"
    >
      <h2 id="fan-space-heading" className="sr-only">
        Fan feed
      </h2>
      <form className="mark-composer simple-composer" onSubmit={submit}>
        <div className="compose-row">
          <span className="little-avatar" aria-hidden="true">
            YOU
          </span>
          <label htmlFor="fan-mark" className="sr-only">
            Your post to the Army
          </label>
          <textarea
            id="fan-mark"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setNotice("");
            }}
            maxLength={500}
            rows={3}
            placeholder="What’s happening in the Army?"
          />
        </div>
        {attachment && (
          <div className="attachment-preview">
            {!attachment.animated || animationsEnabled ? (
              <Image
                src={attachment.dataUrl}
                unoptimized
                width={attachment.width}
                height={attachment.height}
                alt="Your selected attachment"
              />
            ) : (
              <p>Animated image attached · animation paused</p>
            )}
            <button
              type="button"
              className="icon-button"
              aria-label="Remove attachment"
              onClick={() => setAttachment(undefined)}
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="composer-actions">
          <div className="composer-tools">
            <button
              type="button"
              className="icon-button"
              aria-label="Attach an image or GIF"
              disabled={uploading}
              onClick={() => fileInput.current?.click()}
            >
              <ImagePlus size={20} />
            </button>
            <input
              ref={fileInput}
              type="file"
              className="sr-only"
              tabIndex={-1}
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setUploading(true);
                setNotice("");
                try {
                  setAttachment(await readImage(file));
                } catch (error) {
                  setNotice(
                    error instanceof Error
                      ? error.message
                      : "Could not read image.",
                  );
                } finally {
                  setUploading(false);
                }
              }}
            />
            <label className="sr-only" htmlFor="post-style">
              Post style
            </label>
            <select
              id="post-style"
              value={style}
              onChange={(e) => setStyle(e.target.value as NoteStyle)}
            >
              <option value="note">Plain</option>
              <option value="scrapbook">Notebook</option>
              <option value="afterhours">After hours</option>
            </select>
          </div>
          <span>{draft.length}/500</span>
          <button
            type="submit"
            disabled={uploading || (!draft.trim() && !attachment)}
          >
            {uploading ? "Reading…" : "Post"}
          </button>
        </div>
        {notice && (
          <p role="status" className="mark-status">
            {notice}
          </p>
        )}
        <small className="composer-local-note">
          Local demo · images up to 512 KB · posts reset on refresh
        </small>
      </form>
      <div className="feed-controls">
        <p>{local.length ? `${local.length} of your marks · ` : ""}Posts</p>
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
  const { clean, animationsEnabled } = useProfileTheme();
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
      {note.attachment && (
        <div className="post-attachment">
          {!note.attachment.animated || animationsEnabled ? (
            <Image
              src={note.attachment.dataUrl}
              unoptimized
              width={note.attachment.width}
              height={note.attachment.height}
              alt="Image shared with this local post"
            />
          ) : (
            <p>Animated attachment · animation paused</p>
          )}
        </div>
      )}
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
