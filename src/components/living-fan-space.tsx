"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight, Heart, MessageCircle, X } from "lucide-react";
import {
  FanNote,
  fanNotes,
  orbitFans,
  validateMark,
  validatePoll,
} from "@/lib/fan-space";
import { useDemo } from "./demo-provider";
import { useProfileTheme } from "./profile-theme";
import { readImage } from "@/lib/image-upload";
import type { ThemeAsset } from "@/lib/theme";
import {
  StanPhotoIcon,
  StanGifIcon,
  StanPollIcon,
  StanEmojiIcon,
} from "./stan-icons";
import { ReactionPicker } from "./reaction-picker";
import { MemoryVisual } from "./memory-visual";
export function LivingFanSpace({ armyId }: { armyId: string }) {
  const { notes, leaveMark } = useDemo();
  const { clean, animationsEnabled } = useProfileTheme();
  const [draft, setDraft] = useState(""),
    [notice, setNotice] = useState(""),
    [examples, setExamples] = useState(true);
  const [attachment, setAttachment] = useState<ThemeAsset>();
  const [pollOptions, setPollOptions] = useState<string[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [picker, setPicker] = useState<"gifs" | "emoji" | null>(null);
  const pickerTrigger = useRef<HTMLButtonElement | null>(null);
  const composerInput = useRef<HTMLTextAreaElement>(null);
  function closePicker() {
    setPicker(null);
    requestAnimationFrame(() => pickerTrigger.current?.focus());
  }
  function cancelPoll() {
    setPollOptions(null);
    setNotice("");
    requestAnimationFrame(() => composerInput.current?.focus());
  }
  const fileInput = useRef<HTMLInputElement>(null);
  const local = notes[armyId] || [];
  const seeded = examples
    ? fanNotes
    : [{ ...fanNotes[0], likes: 0, replies: [] }];
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const pollIssue = pollOptions ? validatePoll(pollOptions) : null;
    if (pollIssue) {
      setNotice(pollIssue);
      return;
    }
    const issue =
      attachment && draft.length <= 500 ? null : validateMark(draft);
    if (issue) {
      setNotice(issue);
      return;
    }
    leaveMark(
      armyId,
      draft,
      "note",
      attachment,
      pollOptions ? { options: pollOptions } : undefined,
    );
    setPollOptions(null);
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
            ref={composerInput}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setNotice("");
            }}
            maxLength={500}
            rows={3}
            placeholder={
              pollOptions ? "Ask the Army a question…" : "What’s happening?"
            }
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
        {pollOptions && (
          <fieldset
            className="poll-editor"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                cancelPoll();
              }
            }}
          >
            <legend>Poll choices</legend>
            <button
              type="button"
              className="poll-close"
              aria-label="Close poll"
              onClick={cancelPoll}
            >
              <X size={18} />
            </button>
            {pollOptions.map((option, index) => (
              <label key={index}>
                Choice {index + 1}
                <input
                  value={option}
                  maxLength={80}
                  required
                  onChange={(e) =>
                    setPollOptions((current) =>
                      current!.map((value, i) =>
                        i === index ? e.target.value : value,
                      ),
                    )
                  }
                />
              </label>
            ))}
            <div>
              {pollOptions.length < 4 && (
                <button
                  type="button"
                  onClick={() => setPollOptions([...pollOptions, ""])}
                >
                  + Add choice
                </button>
              )}
              <button type="button" onClick={cancelPoll}>
                Cancel poll
              </button>
            </div>
            <small>One choice per person · local demo</small>
          </fieldset>
        )}
        <div className="composer-actions">
          <div className="composer-tools">
            <button
              type="button"
              className="composer-attach"
              aria-label="Attach a photo"
              title="Attach a photo"
              disabled={uploading || !!pollOptions}
              onClick={() => {
                if (fileInput.current) {
                  fileInput.current.accept = "image/jpeg,image/png,image/webp";
                  fileInput.current.click();
                }
              }}
            >
              <StanPhotoIcon />
              <span>Photo</span>
            </button>
            <button
              type="button"
              className="composer-attach"
              aria-label="Open GIF picker"
              title="Choose a GIF"
              aria-expanded={picker === "gifs"}
              onClick={(e) => {
                pickerTrigger.current = e.currentTarget;
                setPicker(picker === "gifs" ? null : "gifs");
              }}
            >
              <StanGifIcon />
              <span>GIF</span>
            </button>
            <button
              type="button"
              className="composer-attach"
              aria-label="Add a poll"
              title="Add a poll"
              aria-pressed={!!pollOptions}
              disabled={uploading || !!attachment}
              onClick={() => {
                setPollOptions(pollOptions ? null : ["", ""]);
                setNotice("");
              }}
            >
              <StanPollIcon />
              <span>Poll</span>
            </button>
            <button
              type="button"
              className="composer-attach"
              aria-label="Open emoji picker"
              aria-expanded={picker === "emoji"}
              onClick={(e) => {
                pickerTrigger.current = e.currentTarget;
                setPicker(picker === "emoji" ? null : "emoji");
              }}
            >
              <StanEmojiIcon />
              <span>Emoji</span>
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
          </div>
          <span>{draft.length}/500</span>
          <button
            type="submit"
            disabled={
              uploading ||
              (!draft.trim() && !attachment) ||
              !!(pollOptions && validatePoll(pollOptions))
            }
          >
            {uploading ? "Reading…" : "Post"}
          </button>
        </div>
        {picker && (
          <ReactionPicker
            key={picker}
            initialTab={picker}
            canAttach={!pollOptions}
            onBusy={setUploading}
            onClose={closePicker}
            onEmoji={(emoji) => {
              const field = composerInput.current;
              const start = field?.selectionStart ?? draft.length;
              const end = field?.selectionEnd ?? draft.length;
              const next = draft.slice(0, start) + emoji + draft.slice(end);
              if (next.length > 500) {
                setNotice("Keep your post to 500 characters.");
                return;
              }
              setDraft(next);
              setNotice("");
              setPicker(null);
              requestAnimationFrame(() => {
                field?.focus();
                field?.setSelectionRange(
                  start + emoji.length,
                  start + emoji.length,
                );
              });
            }}
            onGif={(asset) => {
              setAttachment(asset);
              setNotice("");
              closePicker();
            }}
          />
        )}
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
        <p>{local.length ? `${local.length} of your posts · ` : ""}Posts</p>
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
      {note.poll && <FanPollCard options={note.poll.options} />}
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

function FanPollCard({ options }: { options: string[] }) {
  const [choice, setChoice] = useState<number | null>(null);
  return (
    <section className="fan-poll" aria-label="Post poll">
      {options.map((option, index) => (
        <button
          key={index}
          aria-pressed={choice === index}
          onClick={() => setChoice(index)}
        >
          <span>{option}</span>
          {choice !== null && (
            <strong>{choice === index ? "100%" : "0%"}</strong>
          )}
        </button>
      ))}
      <small>
        {choice === null
          ? "Choose an option"
          : "1 local vote · click another option to change"}{" "}
        · demo poll
      </small>
    </section>
  );
}
